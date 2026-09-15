# AI Context — LG THERMA V ↔ Shelly Pro EM-50 Modbus bridge

## Purpose

This repository documents a local integration between a compatible LG THERMA V heat pump and a Shelly Pro EM-50 fitted with the Shelly Pro Modbus Add-on. The Shelly acts as the Modbus RTU client, translates selected heat-pump registers into Shelly Virtual Components, and optionally exposes those components to Shelly Cloud and Home Assistant.

## Canonical implementation facts

- Transport: RS-485.
- Application protocol: Modbus RTU.
- Tested serial settings: 9600 baud, 8 data bits, no parity, 1 stop bit (`8N1`).
- Tested LG slave/server ID: `2`.
- Tested Shelly serial / MbRtuClient component: `100`.
- Addressing in Shelly RPC is zero-based.
- The integration uses exactly **nine** Shelly Virtual Components.
- IDs used: `boolean:200`, `boolean:201`, `boolean:202`, `number:203`, `number:204`, `number:205`, `number:206`, `number:207`, `number:209`.
- `number:208` is intentionally unused, leaving one free virtual-component slot.
- The permanent bridge performs a real device read before enabling writes. This prevents stale virtual defaults from being pushed into the heat pump after reboot.
- Writes are followed by a read-back so the displayed state represents the physical LG controller.
- Home Assistant is optional. The standard Shelly integration can expose supported Virtual Components; this project does not itself create a native HA `climate` entity.

## Data map used by this project

| Semantic value | Modbus area | Zero-based address | Direction | Encoding | Shelly component |
|---|---|---:|---|---|---|
| Main power | Coil | 0 | R/W | Boolean | `boolean:200` |
| DHW enable | Coil | 1 | R/W | Boolean | `boolean:201` |
| Silent mode | Coil | 2 | R/W | Boolean | `boolean:202` |
| Heating water target | Holding register | 2 | R/W | signed 16-bit ×0.1 °C | `number:203` |
| DHW target | Holding register | 8 | R/W | signed 16-bit ×0.1 °C | `number:204` |
| Inlet water temperature | Input register | 2 | Read | signed 16-bit ×0.1 °C | `number:205` |
| Outlet water temperature | Input register | 3 | Read | signed 16-bit ×0.1 °C | `number:206` |
| DHW temperature | Input register | 5 | Read | signed 16-bit ×0.1 °C | `number:207` |
| Error code | Input register | 0 | Read | unsigned 16-bit | `number:209` |

## Repository reading order for an AI assistant

1. `README.md` — complete installation and operational guide.
2. `project.yaml` — structured metadata and canonical mappings.
3. `scripts/01-create-virtual-components.js` — one-time Virtual Component provisioning.
4. `scripts/02-lg-therma-v-modbus-bridge.js` — permanent runtime bridge.
5. `docs/LG_THERMA_V_SHELLY_SOLUTION_EN.md` / `BG.md` — article-style documentation.

## Important constraints

- LG THERMA V generations and PCBs differ. The exact model service documentation remains authoritative.
- Do not infer that `CN_COM`, slave ID `2`, or the register map apply to every THERMA V model.
- Never write values to undocumented registers.
- RS-485 A/B naming can differ across manufacturers.
- This integration must not bypass LG safety logic.
- Electrical work inside HVAC equipment requires appropriate competence and isolation procedures.

## Search / retrieval keywords

`LG THERMA V`, `Shelly Pro EM-50`, `Shelly Pro Modbus Add-on`, `RS485`, `RS-485`, `Modbus RTU`, `MbRtuClient`, `Serial 100`, `9600 8N1`, `slave 2`, `CN_COM`, `Home Assistant Shelly`, `heat pump Modbus`, `DHW Modbus`, `Shelly Virtual Components`, `local HVAC integration`.
