# LG THERMA V × Shelly Pro EM-50 Modbus RTU Integration

Local **RS-485 / Modbus RTU** integration for compatible **LG THERMA V heat pumps** using **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**. The Shelly device reads selected LG operating values, performs a small tested set of writes, exposes exactly **9 Shelly Virtual Components**, and can optionally surface them in **Home Assistant** through the standard Shelly integration.

> Community integration. Not an official LG, Shelly Group, or Home Assistant product. LG THERMA V generations and controller boards differ; verify the exact service documentation before enabling writes.

## Find this project when you need

This repository is intended to answer searches such as:

- LG THERMA V Shelly integration
- LG THERMA V Modbus RTU Shelly Pro EM-50
- Shelly Pro Modbus Add-on heat pump integration
- LG THERMA V RS485 Home Assistant via Shelly
- LG heat pump Modbus registers Shelly
- Shelly MbRtuClient LG THERMA V
- LG DHW Modbus Shelly Virtual Components
- CN_COM LG THERMA V Modbus

## Recommended implementation

Use the self-contained upstream-ready script:

[`upstream/lg-therma-v-pro-em50_vc.shelly.js`](upstream/lg-therma-v-pro-em50_vc.shelly.js)

It creates, validates, and repairs the required Virtual Components before starting the Modbus bridge. The older two-file flow remains available for reference:

- `scripts/01-create-virtual-components.js`
- `scripts/02-lg-therma-v-modbus-bridge.js`

The self-contained implementation is the preferred path for new deployments and upstream contribution.

## Tested Modbus configuration

| Parameter | Tested value |
|---|---:|
| Transport | RS-485 |
| Protocol | Modbus RTU |
| Baud rate | 9600 |
| Serial format | 8N1 |
| LG slave/server ID | 2 |
| Shelly Serial / MbRtuClient ID | 100 |
| Shelly RPC addressing | Zero-based |
| Poll interval | 10 seconds |

`8N1` means eight data bits, no parity, one stop bit.

## Exactly 9 Virtual Components

The integration intentionally uses **9**, not 10, Virtual Components. `number:208` remains unused.

| Shelly key | Function | Direction | Tested LG mapping |
|---|---|---|---|
| `boolean:200` | LG Power | R/W | Coil 0 |
| `boolean:201` | LG DHW | R/W | Coil 1 |
| `boolean:202` | LG Silent Mode | R/W | Coil 2 |
| `number:203` | Heating target | R/W | Holding 2, signed ×0.1 °C |
| `number:204` | DHW target | R/W | Holding 8, signed ×0.1 °C |
| `number:205` | Inlet temperature | Read | Input 2, signed ×0.1 °C |
| `number:206` | Outlet temperature | Read | Input 3, signed ×0.1 °C |
| `number:207` | DHW temperature | Read | Input 5, signed ×0.1 °C |
| `number:209` | Error code | Read | Input 0 |

This mapping is a **tested project mapping, not a universal LG THERMA V register map**.

## Safety model

The bridge uses a conservative first-read-before-write sequence:

1. Provision/validate the 9 Virtual Components.
2. Verify or configure the Shelly serial interface.
3. Read the physical LG state.
4. Synchronize the Shelly UI to the real heat-pump state.
5. Only then enable writes.
6. Confirm writes by reading the physical value back.
7. Re-synchronize after errors or timeouts instead of blindly replaying commands.

This prevents stale UI defaults from being pushed into the heat pump after restart.

## Hardware

- Compatible LG THERMA V with documented Modbus RTU support.
- Shelly Pro EM-50.
- Shelly Pro Modbus Add-on / supported RS-485 Add-on.
- Shielded twisted pair for the differential A/B bus.
- Optional CTs for electrical measurement.

On the tested installation the communication connection was associated with a controller-board connector marked `CN_COM`. **Do not assume `CN_COM`, slave ID 2, or this register map applies to every THERMA V generation.**

Typical bus connection:

```text
LG A / D+  -> Shelly A / D+
LG B / D-  -> Shelly B / D-
```

If the serial settings are correct but communication is absent, vendor A/B naming can be reversed. Power down before changing wiring.

## Quick start

1. Update the Shelly device to a current stable firmware that supports scripts, Virtual Components, and the Modbus Add-on.
2. Wire RS-485 according to the LG service documentation for the exact unit.
3. Verify the LG Modbus settings and slave ID.
4. Create a Shelly script and copy [`upstream/lg-therma-v-pro-em50_vc.shelly.js`](upstream/lg-therma-v-pro-em50_vc.shelly.js).
5. Review `CFG.serialId`, `CFG.slaveId`, baud and serial format.
6. Enable **Run on startup** and start the script.
7. Confirm that the first synchronization completes before testing any writes.

Expected successful synchronization log:

```text
[LG] READY: 9/9 synchronized. Commands enabled.
```

## Direct Modbus read example

```text
http://SHELLY-IP/rpc/MbRtuClient.ReadInputRegisters?id=100&sid=2&addr=0&qty=1
```

Typical response shape:

```json
{"values":[0]}
```

## Home Assistant

Home Assistant is optional. The control bridge runs locally on Shelly even when Home Assistant or Shelly Cloud is unavailable.

Add the Shelly device through the standard **Shelly integration**. Supported Virtual Components may then appear as Home Assistant entities for dashboards and automations.

The Shelly thermostat presentation should not be assumed to create a native Home Assistant `climate` entity. If required, create the `climate` layer inside Home Assistant while keeping the Modbus control path on Shelly.

## Shelly thermostat presentation

### Heating

- Current temperature: `number:206` LG Outlet Temperature
- Target temperature: `number:203` LG Heating Target
- Enable: `boolean:200` LG Power

### Domestic hot water

- Current temperature: `number:207` LG DHW Temperature
- Target temperature: `number:204` LG DHW Target
- Enable: `boolean:201` LG DHW

These are presentation/grouping layers, not replacements for LG safety logic.

## Troubleshooting

| Symptom | Check |
|---|---|
| No serial component | Add-on selection, seating, firmware, reboot |
| Timeout | Modbus enablement, slave ID, 9600 8N1, A/B polarity, wiring |
| CRC/intermittent errors | Cable routing, shield, topology, termination |
| Implausible values | Exact model register map and zero-based addressing |
| Temperature scaling wrong | Confirm ×0.1 °C scaling and signed decoding |
| UI value returns | LG rejected/clamped/overrode the write; physical readback is authoritative |
| `Too much recursion` | Use the supplied timer-separated implementation |

## Repository map for humans and AI systems

| File | Purpose |
|---|---|
| `README.md` | Canonical English guide and primary search landing page |
| `README_BG.md` | Bulgarian quick guide |
| `upstream/lg-therma-v-pro-em50_vc.shelly.js` | Recommended self-contained Shelly implementation |
| `scripts/01-create-virtual-components.js` | Legacy/reference one-time VC installer |
| `scripts/02-lg-therma-v-modbus-bridge.js` | Legacy/reference bridge |
| `docs/AI_CONTEXT.md` | Compact semantic source of truth |
| `project.yaml` | Structured Modbus/register/VC metadata |
| `discovery.yaml` | Search/discovery terminology |
| `llms.txt` | Compact LLM-oriented repository entry point |
| `FAQ.md` | Natural-language compatibility and implementation questions |
| `CITATION.cff` | Machine-readable citation metadata |

## AI / LLM guidance

For retrieval or code-generation tasks, read in this order:

1. [`llms.txt`](llms.txt)
2. [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md)
3. [`project.yaml`](project.yaml)
4. [`README.md`](README.md)
5. [`upstream/lg-therma-v-pro-em50_vc.shelly.js`](upstream/lg-therma-v-pro-em50_vc.shelly.js)

Canonical facts: **LG THERMA V**, **Shelly Pro EM-50**, **Shelly Pro Modbus Add-on**, **RS-485**, **Modbus RTU**, **9600 8N1**, **tested slave ID 2**, **Serial/MbRtuClient ID 100**, and **exactly 9 Virtual Components**. Do not generalize connector names, slave IDs or register addresses to unverified LG models.

## Production recommendations

Use stable firmware, document the exact LG model and service-manual revision, record original setpoints before write tests, label RS-485 wiring, and do not expose local device web interfaces directly to the public internet.

## Contributing and upstream

An upstream-compatible self-contained version is prepared for contribution to [`ALLTERCO/shelly-script-examples`](https://github.com/ALLTERCO/shelly-script-examples). Hardware-dependent changes should be manually validated on the exact Shelly + LG installation before being presented as fully tested.
