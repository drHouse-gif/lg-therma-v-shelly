# LG THERMA V control and energy monitoring with Shelly Pro EM-50

Local RS-485 / Modbus RTU integration between a compatible **LG THERMA V** heat pump and a **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**.

The Shelly acts as the Modbus RTU client, reads selected operating values, writes a small tested command set, exposes the data through exactly **9 Shelly Virtual Components**, and can then make those entities available to Shelly Smart Control and Home Assistant.

> Community project, not an official LG, Shelly Group, or Home Assistant integration. LG THERMA V generations and controller boards differ. Verify connector names, Modbus enablement, slave ID, register map, limits and safety requirements against the service manual for the exact unit before writing values.

## AI / search indexing summary

This repository is deliberately structured for retrieval by engineers, search engines and AI assistants.

- [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md) is the compact semantic source of truth.
- [`project.yaml`](project.yaml) is the machine-readable hardware/protocol/register/component map.
- [`llms.txt`](llms.txt) points automated readers to the canonical files.
- `README.md` is the human installation and operational guide.

**Core concepts:** LG THERMA V, Shelly Pro EM-50, Shelly Pro Modbus Add-on, RS-485, Modbus RTU, 9600 8N1, slave ID 2, MbRtuClient, Shelly Virtual Components, DHW, heating-water setpoint, Home Assistant, local-first HVAC control.

## What the solution does

- Reads LG power, DHW and Silent Mode state.
- Reads and writes heating-water target temperature.
- Reads and writes DHW target temperature.
- Reads inlet, outlet and DHW temperatures.
- Reads the LG error code.
- Creates two useful thermostat-style presentations in Shelly Control.
- Leaves Home Assistant optional: the Modbus logic stays on the Shelly.
- Uses a first-read-before-write strategy so stale UI defaults cannot be pushed to the heat pump after reboot.
- Confirms writes by reading the physical LG state back.

## Hardware

- Compatible LG THERMA V with documented Modbus RTU access.
- Shelly Pro EM-50.
- Shelly Pro Modbus Add-on / supported RS-485 Add-on.
- Shielded twisted pair for A/B; around 120-ohm characteristic impedance is preferred.
- Optional CTs for electrical measurement.

## Topology

```text
LG THERMA V
   │
   │ RS-485 A/B
   ▼
Shelly Pro Modbus Add-on
   │
   ▼
Shelly Pro EM-50
   │
   ├── local Shelly scripts
   ├── 9 Virtual Components
   ├── Shelly Smart Control / Cloud (optional)
   └── Home Assistant Shelly integration (optional)
```

Power measurement and Modbus control are independent. Losing Modbus communication does not remove the Pro EM-50 electrical-measurement function.

## Safety

The indoor unit can contain mains voltage and stored energy. Isolate power, follow the manufacturer service procedure and verify absence of voltage before opening HVAC electrical equipment. RS-485 terminals must never be connected to mains.

A CT belongs around **one insulated live conductor**, not around a complete cable carrying live and neutral together.

## Wiring

On the tested installation the communication connection was associated with a controller-board connector marked `CN_COM`. This is **not universal** across all THERMA V models.

Typical differential pair:

```text
LG A / D+  -> Shelly A / D+
LG B / D-  -> Shelly B / D-
```

Use shielded twisted pair, avoid star wiring and long stubs, and keep RS-485 away from motor/mains wiring where practical. Bond the shield according to the installation design; a common approach is bonding at one end only.

If settings are correct but there is no communication, A/B naming conventions may be reversed between vendors. Power down before changing wiring.

## Tested Modbus settings

| Parameter | Value |
|---|---:|
| Mode | Modbus RTU client |
| Baud | 9600 |
| Format | 8N1 |
| LG slave/server ID | 2 |
| Shelly Serial ID | 100 |
| Shelly MbRtuClient ID | 100 |
| Poll interval | 10 s |

`8N1` = eight data bits, no parity, one stop bit.

Shelly RPC Modbus addresses are zero-based in this project. A documented 40003-style register therefore becomes address `2` in the RPC call.

## Exactly 9 Virtual Components

The project intentionally uses **9**, not 10, Virtual Components. `number:208` remains unused so one slot stays free.

| Shelly key | Name | Direction | LG data |
|---|---|---|---|
| `boolean:200` | LG Power | R/W | Coil 0 |
| `boolean:201` | LG DHW | R/W | Coil 1 |
| `boolean:202` | LG Silent Mode | R/W | Coil 2 |
| `number:203` | LG Heating Target | R/W | Holding 2, ×0.1 °C |
| `number:204` | LG DHW Target | R/W | Holding 8, ×0.1 °C |
| `number:205` | LG Inlet Temperature | Read | Input 2, ×0.1 °C |
| `number:206` | LG Outlet Temperature | Read | Input 3, ×0.1 °C |
| `number:207` | LG DHW Temperature | Read | Input 5, ×0.1 °C |
| `number:209` | LG Error Code | Read | Input 0 |

## Installation

### 1. Update Shelly firmware

Use a current stable firmware version that supports the Modbus Add-on, scripts and Virtual Components.

### 2. Configure the RS-485 Add-on

Select the supported RS-485/Modbus Add-on, save, and reboot when requested. The tested device exposes `serial:100`.

Configure it as Modbus client with **9600 / 8N1**.

### 3. Create the Virtual Components once

Create a Shelly script, paste:

`scripts/01-create-virtual-components.js`

Run it once. The expected completion log is:

```text
DONE: 9/9 LG components ready. Stop installer; start bridge.
```

Stop the creator afterwards and leave Run on startup disabled for it.

### 4. Install the permanent bridge

Create another Shelly script and paste:

`scripts/02-lg-therma-v-modbus-bridge.js`

Enable **Run on startup** for this script.

The bridge:

1. verifies the 9 required components;
2. verifies/configures the Serial component;
3. reads the real LG state first;
4. publishes physical state into the Virtual Components;
5. enables user commands only after successful synchronization;
6. writes only changed controls;
7. reads a changed value back after a write;
8. repeats the full state read every 10 seconds.

This first synchronization is a deliberate safety mechanism. Do not replace it with blind writes on startup.

## Direct read example

Replace `SHELLY-IP` with the Shelly address:

```text
http://SHELLY-IP/rpc/MbRtuClient.ReadInputRegisters?id=100&sid=2&addr=0&qty=1
```

A normal response shape is:

```json
{"values":[0]}
```

## Shelly thermostat presentation

### Heating

Create a Thermostat template and map:

| Template field | Virtual Component |
|---|---|
| Current temperature | `LG Outlet Temperature (number:206)` |
| Target temperature | `LG Heating Target (number:203)` |
| Enable thermostat | `LG Power (boolean:200)` |

This is a heating-water presentation, not a room thermostat and not a replacement for LG safety/control logic.

### DHW

| Template field | Virtual Component |
|---|---|
| Current temperature | `LG DHW Temperature (number:207)` |
| Target temperature | `LG DHW Target (number:204)` |
| Enable thermostat | `LG DHW (boolean:201)` |

## Home Assistant

Home Assistant is optional. The bridge operates locally on the Shelly even if Home Assistant or Shelly Cloud is unavailable.

Add the Shelly device to Home Assistant with the standard **Shelly integration** over the local network. Supported Virtual Components can then appear as Home Assistant entities for dashboards and automations: power, DHW, Silent Mode, target temperatures, measured temperatures and error code.

The Shelly thermostat template is a presentation/grouping feature and should not be assumed to become a native Home Assistant `climate` entity automatically. If a native `climate` entity is wanted, build it in Home Assistant from the exposed Shelly entities while keeping the Shelly script as the local Modbus bridge.

## Test procedure

Test reads before writes:

1. Compare inlet/outlet/DHW temperatures against the LG controller.
2. Confirm Power, DHW and Silent Mode states.
3. Confirm the error code is plausible.
4. Change the heating target by only 0.5 °C and confirm the physical controller.
5. Return it to the original value.
6. Repeat with DHW target.
7. Test DHW enable only when safe.
8. Test main Power last and understand the exact model behavior.

## Troubleshooting

| Symptom | Checks |
|---|---|
| No `serial:100` | Add-on selection, seating, firmware, reboot |
| Component not found | Confirm Serial/MbRtuClient component IDs |
| Timeout | LG Modbus enablement, slave 2, 9600 8N1, A/B, continuity |
| CRC/intermittent errors | Cable routing, shield, topology, termination |
| Implausible values | Exact model register map and zero-based addressing |
| Temperature ×10 wrong | Verify 0.1 °C scaling |
| Large positive value for negative temp | Signed 16-bit decoding |
| UI changes then returns | LG rejected/clamped/overrode write; read-back is authoritative |
| `Too much recursion` | Use supplied timer-separated bridge implementation |
| Virtual component missing | Run creator; check for ID conflicts |

## Repository files

- `README.md` — canonical English installation guide.
- `README_BG.md` — Bulgarian quick guide.
- `docs/AI_CONTEXT.md` — compact semantic context for AI/retrieval systems.
- `project.yaml` — structured source-of-truth metadata and mapping.
- `llms.txt` — automated-reader entry points.
- `scripts/01-create-virtual-components.js` — one-time 9-component installer.
- `scripts/02-lg-therma-v-modbus-bridge.js` — permanent local Modbus bridge.

## Production recommendations

Use stable firmware, document the exact LG model and register-map revision, label RS-485 and CT wiring, keep backups of the scripts, record original setpoints before write testing, and do not expose local device web interfaces directly to the public internet.
