// LG simple integration v2.0 - exactly 9 existing virtual components.
// Run ONLY this bridge on the RS485 bus. Enable Run on startup.
var CFG = {serialId: 100, slaveId: 2, baud: 9600, format: "8N1",
  pollMs: 10000, retryMs: 10000, gapMs: 100, settleMs: 700};
// type, virtual ID, name, Modbus address, minimum, maximum
var C = [
  ["Boolean", 200, "Power", 0],
  ["Boolean", 201, "DHW", 1],
  ["Boolean", 202, "Silent", 2],
  ["Number", 203, "Heating target", 2, 10, 65],
  ["Number", 204, "DHW target", 8, 25, 70],
  ["Number", 205, "Inlet", 2, -50, 100],
  ["Number", 206, "Outlet", 3, -50, 100],
  ["Number", 207, "DHW temperature", 5, -50, 100],
  ["Number", 209, "Error code", 0, 0, 65535]
];
var READS = [
  ["ReadCoils", 0, 3],
  ["ReadHoldingRegisters", 2, 1],
  ["ReadHoldingRegisters", 8, 1],
  ["ReadInputRegisters", 0, 6]
];
var ready = false, baseline = [], observed = [], actual = [];
var readIndex = 0, controlIndex = 0, publishIndex = 0;
var lastFault = "", lastErrorCode = null;

function later(fn, ms) {
  Timer.set(typeof ms === "number" ? ms : CFG.gapMs, false, fn);
}
function equal(a, b) {
  if (typeof a !== typeof b) return false;
  if (typeof a === "boolean") return a === b;
  return typeof a === "number" && Math.abs(a - b) < 0.001;
}
function word(v) {
  return typeof v === "number" && v >= 0 && v <= 65535 && v === Math.floor(v);
}
function signed(v) { return v > 32767 ? v - 65536 : v; }
function valid(i, v) {
  if (i < 3) return typeof v === "boolean";
  return typeof v === "number" && v >= C[i][4] && v <= C[i][5];
}
function uiValue(i) {
  var s = Shelly.getComponentStatus(C[i][0].toLowerCase(), C[i][1]);
  return s ? s.value : undefined;
}
function fault(message) {
  ready = false;
  baseline = [];
  if (message !== lastFault) print("PAUSED: " + message + ". Writes blocked; retrying.");
  lastFault = message;
  later(begin, CFG.retryMs);
}
function call(method, params, done) {
  Shelly.call(method, params, function (r, e, m) {
    // A timer boundary prevents recursive synchronous callbacks.
    later(function () { done(r, e, m); }, 1);
  });
}
function mb(method, addr, qty, done) {
  call("MbRtuClient." + method,
    {id: CFG.serialId, sid: CFG.slaveId, addr: addr, qty: qty}, done);
}

function begin() {
  // Verify all components before touching LG controls.
  for (var i = 0; i < C.length; i++) {
    if (!valid(i, uiValue(i))) {
      fault("Missing/invalid " + C[i][0] + ":" + C[i][1]);
      return;
    }
  }
  call("Serial.GetConfig", {id: CFG.serialId}, function (r, e, m) {
    if (e !== 0 || !r) { fault("Serial configuration: " + m); return; }
    if (r.mode === "mb_client" && r.serial &&
        r.serial.baud === CFG.baud && r.serial.format === CFG.format) {
      startRead();
      return;
    }
    ready = false;
    call("Serial.SetConfig", {id: CFG.serialId,
      config: {mode: "mb_client", serial: {baud: CFG.baud, format: CFG.format}}},
      function (r2, e2, m2) {
        if (e2 !== 0) { fault("Serial setup: " + m2); return; }
        if (r2 && r2.restart_required) { fault("Shelly reboot required"); return; }
        later(startRead, 500);
      });
  });
}
function startRead() {
  actual = [];
  readIndex = 0;
  later(readNext);
}
function readNext() {
  if (readIndex === READS.length) {
    for (var i = 0; i < C.length; i++) {
      if (!valid(i, actual[i])) { fault("LG value outside configured range: " + C[i][2]); return; }
    }
    // Snapshot intent separately from the newly read LG state.
    observed = [];
    for (var j = 0; j < 5; j++) {
      observed[j] = uiValue(j);
      if (!valid(j, observed[j])) { fault("Invalid control: " + C[j][2]); return; }
    }
    controlIndex = 0;
    publishIndex = 0;
    later(ready ? controlNext : publishNext);
    return;
  }
  var q = READS[readIndex];
  mb(q[0], q[1], q[2], function (r, e, m) {
    if (e !== 0 || !r || !r.values || r.values.length !== q[2]) {
      fault(q[0] + " @" + q[1] + ": " + m); return;
    }
    var v = r.values;
    for (var i = 0; i < v.length; i++) {
      if (readIndex === 0 ? typeof v[i] !== "boolean" : !word(v[i])) {
        fault("Malformed " + q[0] + " response"); return;
      }
    }
    if (readIndex === 0) { actual[0] = v[0]; actual[1] = v[1]; actual[2] = v[2]; }
    if (readIndex === 1) actual[3] = signed(v[0]) / 10;
    if (readIndex === 2) actual[4] = signed(v[0]) / 10;
    if (readIndex === 3) {
      actual[5] = signed(v[2]) / 10; actual[6] = signed(v[3]) / 10;
      actual[7] = signed(v[5]) / 10; actual[8] = v[0];
    }
    readIndex++;
    later(readNext);
  });
}
function controlNext() {
  if (controlIndex === 5) { later(publishNext); return; }
  var i = controlIndex++;
  var requested = uiValue(i);
  if (!valid(i, requested)) { fault("Invalid command: " + C[i][2]); return; }
  observed[i] = requested;
  var changed = !equal(requested, baseline[i]);
  // Consume this intent; a newer change remains visible for the next cycle.
  baseline[i] = requested;
  if (!changed || equal(requested, actual[i])) { later(controlNext); return; }
  if (i >= 3 && Math.abs(requested * 2 - Math.round(requested * 2)) > 0.001) {
    print("REJECTED " + C[i][2] + ": use 0.5 C steps.");
    later(controlNext); return;
  }
  var params = {id: CFG.serialId, sid: CFG.slaveId, addr: C[i][3]};
  var method = "MbRtuClient.WriteSingleRegister";
  if (i < 3) { method = "MbRtuClient.WriteCoils"; params.values = [requested]; }
  else params.value = Math.round(requested * 10);
  call(method, params, function (r, e, m) {
    if (e !== 0) {
      // A timed-out write may have succeeded. Resync; never blindly replay it.
      fault("Unconfirmed " + C[i][2] + ": " + m); return;
    }
    later(function () {
      mb(i < 3 ? "ReadCoils" : "ReadHoldingRegisters", C[i][3], 1,
        function (rr, ee, mm) {
          if (ee !== 0 || !rr || !rr.values || rr.values.length !== 1) {
            fault("Readback " + C[i][2] + ": " + mm); return;
          }
          var raw = rr.values[0];
          if (i < 3 ? typeof raw !== "boolean" : !word(raw)) {
            fault("Malformed readback: " + C[i][2]); return;
          }
          var value = i < 3 ? raw : signed(raw) / 10;
          if (!valid(i, value)) { fault("Invalid readback: " + C[i][2]); return; }
          actual[i] = value;
          if (equal(value, requested)) print("CONFIRMED " + C[i][2] + " = " + value);
          else print("NOT CONFIRMED " + C[i][2] + ": requested " + requested + ", LG reports " + value);
          later(controlNext);
        });
    }, CFG.settleMs);
  });
}
function publishNext() {
  if (publishIndex === C.length) {
    if (!ready) {
      // Changes made during recovery are not queued for later execution.
      for (var j = 0; j < 5; j++) {
        if (!equal(uiValue(j), actual[j])) { fault("UI changed during synchronization"); return; }
      }
      ready = true;
      print("READY: 9/9 synchronized. Commands enabled.");
    }
    lastFault = "";
    if (lastErrorCode !== actual[8]) {
      lastErrorCode = actual[8];
      print("LG error code = " + lastErrorCode);
    }
    later(begin, CFG.pollMs);
    return;
  }
  var i = publishIndex++;
  var current = uiValue(i);
  if (!valid(i, current)) { fault("Component unavailable: " + C[i][2]); return; }
  // Preserve a newer UI change made while a previous command was in flight.
  if (ready && i < 5 && !equal(current, observed[i])) { later(publishNext, 1); return; }
  if (equal(current, actual[i])) {
    if (i < 5) baseline[i] = actual[i];
    later(publishNext, 1); return;
  }
  call(C[i][0] + ".Set", {id: C[i][1], value: actual[i]}, function (r, e, m) {
    if (e !== 0) { fault("UI update " + C[i][2] + ": " + m); return; }
    if (i < 5) baseline[i] = actual[i];
    later(publishNext, 1);
  });
}
print("LG simple v2.0: 9 components; RTU " + CFG.baud + " " + CFG.format + "; slave " + CFG.slaveId);
later(begin, 1);
