# Upstream submission to ALLTERCO/shelly-script-examples

Target upstream repository: `ALLTERCO/shelly-script-examples`

## Important upstream-readiness note

The current project uses a separate one-time Virtual Component installer and a permanent Modbus bridge. The upstream repository currently requires runtime scripts that use Virtual Components to be self-contained and to create, verify or repair their own components before normal logic starts.

Before opening a production Pull Request, combine/adapt the required Virtual Component setup into a standalone `.shelly.js` runtime script using the upstream standard helper, preserve the documented fixed IDs, and add the upstream metadata header (`@title`, `@description`, `@status`, `@link`). The `modbus/` collection is the likely fit, subject to maintainer preference.

## Suggested Pull Request title

```text
Add LG THERMA V Modbus RTU bridge for Shelly Pro EM-50
```

## Pull Request body

```markdown
## Summary

This PR proposes a Shelly Script example for local **RS-485 / Modbus RTU** monitoring and limited control of a compatible **LG THERMA V heat pump** using **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**.

The script maps a small tested Modbus data set into Shelly Virtual Components for power, DHW, Silent Mode, heating-water target, DHW target, inlet/outlet/DHW temperatures and error code. The resulting values can also be consumed by Shelly Smart Control and, optionally, Home Assistant through the standard Shelly integration.

## Why this is useful

Many heat-pump integrations depend on an external gateway, vendor cloud or a continuously running automation server. This example keeps the Modbus bridge on the Shelly device itself and demonstrates a reusable local pattern for HVAC/plant integrations.

The implementation includes:

- Modbus RTU over RS-485;
- Shelly `MbRtuClient` usage;
- Virtual Components for control and telemetry;
- first-read-before-write startup synchronization;
- write confirmation through readback;
- signed 16-bit temperature decoding;
- optional Home Assistant exposure without making Home Assistant part of the control path.

## Tested configuration

- Controller: Shelly Pro EM-50
- Interface: Shelly Pro Modbus Add-on / supported RS-485 Add-on
- Target: compatible LG THERMA V installation with documented Modbus RTU access
- Serial settings: 9600 baud, 8N1
- Tested LG slave/server ID: 2
- Shelly Serial / MbRtuClient component: 100
- Addressing used by the script: zero-based Shelly RPC addresses
- Virtual Components: exactly 9

## Data map used by the tested project

- Coil 0 — main power — R/W
- Coil 1 — DHW enable — R/W
- Coil 2 — Silent Mode — R/W
- Holding register 2 — heating-water target — R/W, signed ×0.1 °C
- Holding register 8 — DHW target — R/W, signed ×0.1 °C
- Input register 2 — inlet-water temperature — read, signed ×0.1 °C
- Input register 3 — outlet-water temperature — read, signed ×0.1 °C
- Input register 5 — DHW temperature — read, signed ×0.1 °C
- Input register 0 — error code — read

## Safety and compatibility scope

This is intentionally conservative and should not be presented as a universal LG THERMA V register map.

LG THERMA V generations and controller boards differ. Connector names, Modbus enablement, slave IDs, register addresses, write permissions and safe operating limits must be verified against the service documentation for the exact target unit before writes are enabled.

The script performs a real device read before enabling user writes so stale Virtual Component defaults are not pushed to the heat pump after restart. Supported writes are followed by readback so the displayed state reflects the physical controller.

The integration must not bypass manufacturer safety logic. Work inside HVAC electrical equipment also requires appropriate isolation and competence.

## Upstream compatibility work

For this PR, the final runtime example should follow the repository's current Virtual Component standard: embed/use the standard helper, self-create/verify the fixed Virtual Components and start Modbus activity only after Virtual Component initialization succeeds.

## Documentation

Standalone implementation, register mapping, installation notes and troubleshooting:

https://github.com/drHouse-gif/lg-therma-v-shelly

## Contributor checklist

- [ ] I have tested the final upstream-formatted script on compatible Shelly hardware.
- [ ] I have validated the final script against the exact LG THERMA V installation used for testing.
- [ ] The submitted runtime script is self-contained and follows the upstream Virtual Component helper pattern.
- [ ] The source uses the upstream metadata header and style conventions.
- [ ] The documentation clearly states that model-specific LG service documentation is authoritative.
- [ ] No private installation data or credentials are included.
- [ ] I confirm I have the necessary rights to contribute the submitted content under the upstream repository license.
```

## Suggested Issue title

```text
Proposal: LG THERMA V Modbus RTU bridge example for Shelly Pro EM-50
```

## Issue body

```markdown
I would like to contribute a local Modbus RTU example for integrating a compatible **LG THERMA V heat pump** with **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**.

The tested project maps a small set of power, DHW, target-temperature, water-temperature, Silent Mode and error-code values into Shelly Virtual Components. It uses first-read-before-write startup synchronization and readback after writes so Shelly reflects physical device state rather than assuming a command succeeded.

The project is local-first and does not require Home Assistant or a vendor cloud service.

Standalone project and documentation:
https://github.com/drHouse-gif/lg-therma-v-shelly

I understand that LG THERMA V register maps and controller hardware vary by exact model, so the contribution will clearly scope the tested configuration and require installers to verify the target unit's service documentation before enabling writes.

I have also reviewed the upstream Virtual Component requirements. Before the production PR, I will adapt the runtime script to self-create/verify its Virtual Components with the standard helper and follow the required `.shelly.js` metadata/style conventions.

Would this example be appropriate for the `modbus/` collection?
```
