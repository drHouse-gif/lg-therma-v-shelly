// LG simple integration v2.0 - exactly 9 components.
// Stop the bridge before running this installer. Run once.
var C = [
  ["boolean", 200, "LG Power", false],
  ["boolean", 201, "LG DHW", false],
  ["boolean", 202, "LG Silent Mode", false],
  ["number", 203, "LG Heating Target", 35, 10, 65, 0.5],
  ["number", 204, "LG DHW Target", 50, 25, 70, 0.5],
  ["number", 205, "LG Inlet Temperature", 0, -50, 100, 0.1],
  ["number", 206, "LG Outlet Temperature", 0, -50, 100, 0.1],
  ["number", 207, "LG DHW Temperature", 0, -50, 100, 0.1],
  ["number", 209, "LG Error Code", 0, 0, 65535, 1]
];
var position = 0;
var types = ["boolean", "number", "enum", "text", "button", "group"];

function preflight() {
  for (var i = 0; i < C.length; i++) {
    for (var j = 0; j < types.length; j++) {
      var old = Shelly.getComponentConfig(types[j], C[i][1]);
      if (old && (types[j] !== C[i][0] || old.name !== C[i][2])) {
        print("STOP: occupied ID " + C[i][1] + " (" + old.name + "). Nothing changed.");
        return;
      }
    }
  }
  Timer.set(20, false, installNext);
}
function installNext() {
  if (position === C.length) {
    print("DONE: 9/9 LG components ready. Stop installer; start bridge.");
    return;
  }
  var c = C[position];
  var config = {name: c[2], persisted: false, default_value: c[3]};
  var ui = {};
  if (c[0] === "boolean") {
    ui = {view: "toggle", titles: ["Off", "On"]};
  } else {
    config.min = c[4];
    config.max = c[5];
    ui = {view: position < 5 ? "field" : "label", step: c[6]};
    if (c[1] !== 209) ui.unit = "C";
  }
  config.meta = {ui: ui};
  var exists = Shelly.getComponentConfig(c[0], c[1]);
  var prefix = c[0] === "boolean" ? "Boolean" : "Number";
  var method = exists ? prefix + ".SetConfig" : "Virtual.Add";
  var params = {id: c[1], config: config};
  if (!exists) params.type = c[0];
  Shelly.call(method, params, function (r, e, m) {
    if (e !== 0) {
      print("STOP: " + c[2] + ": " + e + " " + m);
      print("Completed " + position + "/9. Correct the error and run again.");
      return;
    }
    print("OK " + c[0] + ":" + c[1] + " " + c[2]);
    position++;
    Timer.set(20, false, installNext);
  });
}
preflight();
