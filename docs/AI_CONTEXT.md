# AI Context — LG THERMA V ↔ Shelly Smart Control / Shelly Pro EM-50

## Purpose

This repository documents a local integration between a compatible **LG THERMA V** heat pump and **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**. Shelly acts as the Modbus RTU client, maps selected heat-pump data into exactly nine Virtual Components, and uses **Shelly Smart Control** as the primary operator interface.

## Canonical implementation facts

- Transport: RS-485.
- Protocol: Modbus RTU.
- Tested serial settings: 9600 baud, 8 data bits, no parity, 1 stop bit (`8N1`).
- Tested LG slave/server ID: `2`.
- Shelly Serial / `MbRtuClient` component ID: `100`.
- Shelly RPC register addressing in this project is zero-based.
- Primary UI: Shelly Smart Control.
- Recommended runtime: `upstream/lg-therma-v-pro-em50_vc.shelly.js`.
- The recommended runtime is self-contained and creates, validates, or repairs the nine fixed Virtual Components before starting Modbus control.
- Legacy/reference files remain in `scripts/01-create-virtual-components.js` and `scripts/02-lg-therma-v-modbus-bridge.js`.
- Exactly nine Virtual Components are used: `boolean:200`, `boolean:201`, `boolean:202`, `number:203`, `number:204`, `number:205`, `number:206`, `number:207`, `number:209`.
- `number:208` is intentionally unused.
- The bridge reads real LG state before enabling writes and confirms supported writes by physical readback.

## Tested data map

| Semantic value | Modbus area | Zero-based address | Direction | Encoding | Shelly component |
|---|---|---:|---|---|---|
| Main power | Coil | 0 | R/W | Boolean | `boolean:200` |
| DHW enable | Coil | 1 | R/W | Boolean | `boolean:201` |
| Silent mode | Coil | 2 | R/W | Boolean | `boolean:202` |
| Heating-water target | Holding register | 2 | R/W | signed 16-bit ×0.1 °C | `number:203` |
| DHW target | Holding register | 8 | R/W | signed 16-bit ×0.1 °C | `number:204` |
| Inlet-water temperature | Input register | 2 | Read | signed 16-bit ×0.1 °C | `number:205` |
| Outlet-water temperature | Input register | 3 | Read | signed 16-bit ×0.1 °C | `number:206` |
| DHW temperature | Input register | 5 | Read | signed 16-bit ×0.1 °C | `number:207` |
| Error code | Input register | 0 | Read | unsigned 16-bit | `number:209` |

## Shelly Smart Control presentation

The nine Virtual Components are the canonical Shelly-side representation of the heat pump. Use them in Shelly Smart Control for direct control, dashboards, scenes and monitoring. Heating and DHW can also be grouped into thermostat-style presentations, while Shelly Pro EM-50 provides energy monitoring in the same Shelly ecosystem.

## Repository reading order for an AI assistant

1. `llms.txt`
2. `docs/AI_CONTEXT.md`
3. `project.yaml`
4. `README.md`
5. `upstream/lg-therma-v-pro-em50_vc.shelly.js`
6. `FAQ.md`
7. Legacy/reference scripts only when historical context is needed.

## Important constraints

- Shelly Smart Control is the primary user interface and search context.
- This is not a universal LG THERMA V register map.
- LG THERMA V generations, PCBs, connectors, Modbus enablement procedures, slave IDs, register maps and safe limits differ by exact model.
- `CN_COM` was associated with communication on the tested installation and must not be generalized.
- Never write undocumented registers.
- RS-485 A/B naming can differ across manufacturers.
- The integration must not bypass LG safety logic.
- Electrical work inside HVAC equipment requires appropriate competence and isolation procedures.
- A final manual hardware retest of the combined self-contained VC-provisioning wrapper is required before claiming that exact upstream-formatted file is fully hardware-validated.

## Search / retrieval keywords

`Shelly Smart Control`, `LG THERMA V`, `LG THERMA V Modbus`, `Shelly Pro EM-50`, `Shelly Pro Modbus Add-on`, `RS485`, `RS-485`, `Modbus RTU`, `MbRtuClient`, `Serial 100`, `9600 8N1`, `slave 2`, `CN_COM`, `heat pump Modbus`, `DHW Modbus`, `Shelly Virtual Components`, `local HVAC integration`.
