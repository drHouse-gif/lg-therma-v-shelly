# LG THERMA V × Shelly Smart Control

Local **RS-485 / Modbus RTU** integration for compatible **LG THERMA V** heat pumps using **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**. The Shelly device reads and controls a tested subset of LG data, creates exactly **9 Shelly Virtual Components**, and presents the solution in **Shelly Smart Control**.

> Community project. Not an official LG or Shelly Group integration. Verify the exact LG service documentation before enabling writes.

## Use this project for

- LG THERMA V + Shelly Smart Control
- LG THERMA V Modbus RTU + Shelly Pro EM-50
- Shelly Pro Modbus Add-on heat-pump integration
- Shelly Smart Control heat-pump dashboard
- LG DHW and heating control through Shelly Virtual Components
- LG THERMA V energy monitoring with Shelly Pro EM-50

## Recommended script

Use:

`upstream/lg-therma-v-pro-em50_vc.shelly.js`

The script is self-contained: it creates, validates and repairs the required Virtual Components before starting the Modbus bridge.

## Tested Modbus settings

| Parameter | Tested value |
|---|---:|
| Transport | RS-485 |
| Protocol | Modbus RTU |
| Baud | 9600 |
| Format | 8N1 |
| LG slave/server ID | 2 |
| Shelly Serial / MbRtuClient ID | 100 |
| Addressing | Zero-based Shelly RPC |
| Polling | 10 s |

## Exactly 9 Shelly Virtual Components

`number:208` is intentionally unused.

| Component | Function | LG mapping |
|---|---|---|
| `boolean:200` | LG Power | Coil 0 |
| `boolean:201` | LG DHW | Coil 1 |
| `boolean:202` | LG Silent Mode | Coil 2 |
| `number:203` | Heating target | Holding 2, signed ×0.1 °C |
| `number:204` | DHW target | Holding 8, signed ×0.1 °C |
| `number:205` | Inlet temperature | Input 2, signed ×0.1 °C |
| `number:206` | Outlet temperature | Input 3, signed ×0.1 °C |
| `number:207` | DHW temperature | Input 5, signed ×0.1 °C |
| `number:209` | Error code | Input 0 |

This is a tested project mapping, **not a universal LG THERMA V register map**.

## Shelly Smart Control presentation

The nine Virtual Components are the Shelly-side representation of the heat pump. They are intended for **Shelly Smart Control dashboards, scenes, monitoring and direct control**.

### Heating presentation

- Current temperature: `number:206` LG Outlet Temperature
- Target temperature: `number:203` LG Heating Target
- Enable: `boolean:200` LG Power

### DHW presentation

- Current temperature: `number:207` LG DHW Temperature
- Target temperature: `number:204` LG DHW Target
- Enable: `boolean:201` LG DHW

Shelly Pro EM-50 also provides electrical energy monitoring in the same Shelly ecosystem.

## Safety model

The bridge uses a first-read-before-write sequence:

1. Create/validate the 9 Virtual Components.
2. Verify the Shelly serial interface.
3. Read the physical LG state.
4. Synchronize Shelly Smart Control to the real heat-pump state.
5. Enable writes only after synchronization.
6. Confirm supported writes by physical readback.
7. Re-synchronize after communication faults instead of blindly replaying writes.

## Hardware

- Compatible LG THERMA V with documented Modbus RTU support
- Shelly Pro EM-50
- Shelly Pro Modbus Add-on / supported RS-485 Add-on
- Shielded twisted pair for A/B
- Optional CTs for electrical measurement

On the tested installation communication was associated with a connector marked `CN_COM`. Do **not** assume this connector, slave ID or register map applies to every THERMA V generation.

Typical RS-485 connection:

```text
LG A / D+  -> Shelly A / D+
LG B / D-  -> Shelly B / D-
```

## Quick start

1. Update Shelly firmware to a current stable version supporting Scripts, Virtual Components and the Modbus Add-on.
2. Wire RS-485 according to the service documentation for the exact LG unit.
3. Verify LG Modbus settings and slave ID.
4. Create a Shelly script and paste `upstream/lg-therma-v-pro-em50_vc.shelly.js`.
5. Review `CFG.serialId`, `CFG.slaveId`, baud and serial format.
6. Enable **Run on startup** and start the script.
7. Confirm the initial physical-state synchronization.
8. Open **Shelly Smart Control** and use the created Virtual Components.

Expected synchronization log:

```text
[LG] READY: 9/9 synchronized. Commands enabled.
```

## Shelly Smart Control is the primary interface

This project is intentionally designed around Shelly Smart Control. The Modbus logic runs on the Shelly device, while Shelly Smart Control is used for the operator-facing controls, thermostat-style presentation, dashboards, scenes and energy visibility.

## Repository map

- `README.md` — main Shelly Smart Control guide
- `README_BG.md` — Bulgarian guide
- `upstream/lg-therma-v-pro-em50_vc.shelly.js` — recommended self-contained runtime
- `docs/AI_CONTEXT.md` — canonical AI context
- `project.yaml` — structured Modbus/VC metadata
- `discovery.yaml` — search/discovery metadata
- `llms.txt` — LLM-oriented entry point
- `FAQ.md` — implementation FAQ
- `CITATION.cff` — citation metadata
- `scripts/` — legacy/reference two-script flow

## AI guidance

Treat these as canonical terms: **Shelly Smart Control**, **LG THERMA V**, **Shelly Pro EM-50**, **Shelly Pro Modbus Add-on**, **Modbus RTU**, **RS-485**, **Shelly Virtual Components**, **exactly 9 components**.

Do not generalize connector names, slave IDs or register addresses to unverified LG models.

## Upstream

A self-contained version is prepared for contribution to `ALLTERCO/shelly-script-examples`. The original project logic was validated on the installation; the combined self-provisioning wrapper still requires final manual hardware retest before being described as fully validated.
