# Upstream submission to ALLTERCO/shelly-script-examples

Target upstream repository: `ALLTERCO/shelly-script-examples`

## Current status

The upstream-formatted self-contained runtime is ready at:

`upstream/lg-therma-v-pro-em50_vc.shelly.js`

Planned upstream path:

`modbus/LG/lg-therma-v-pro-em50_vc.shelly.js`

The file now combines Virtual Component provisioning and the permanent Modbus bridge into one runtime script:

- `.shelly.js` metadata header with `@title`, `@description`, `@status` and `@link`;
- embedded standard `ensureVirtualComponents(...)` helper pattern;
- creates/reuses/repairs exactly 9 fixed Virtual Components before Modbus starts;
- preserves `number:208` as unused;
- preserves the first-read-before-write safety gate;
- confirms supported writes by reading the physical LG value back;
- starts RS-485/Modbus activity only after VC initialization succeeds.

The integrated file has passed JavaScript syntax validation. The original Modbus bridge logic was validated on the project installation. Because the automatic VC provisioning and bridge were newly combined, a final on-device start-from-empty-VC test is recommended before requesting final upstream merge.

## Pull Request title

```text
Add LG THERMA V Modbus RTU bridge for Shelly Pro EM-50
```

## Pull Request body

```markdown
## Summary

This PR adds a self-contained **RS-485 / Modbus RTU** example for local monitoring and limited control of a compatible **LG THERMA V heat pump** using **Shelly Pro EM-50 + Shelly Pro Modbus Add-on**.

The script maps a small tested Modbus data set into exactly nine Shelly Virtual Components for main power, DHW, Silent Mode, heating-water target, DHW target, inlet/outlet/DHW temperatures and error code.

## Why this is useful

It demonstrates a local HVAC/plant integration where the Shelly itself acts as the Modbus client. Home Assistant and Shelly Cloud can consume the exposed state, but neither is required for the Modbus control path.

## Upstream compatibility

- Self-contained single `.shelly.js` file.
- Embeds the standard Virtual Component helper pattern.
- Creates/reuses/repairs the nine documented fixed IDs before runtime startup.
- Starts Modbus only after VC initialization succeeds.
- Includes the required metadata header and detailed hardware/protocol documentation.

## Tested configuration

- Shelly Pro EM-50
- Shelly Pro Modbus Add-on
- Compatible LG THERMA V installation with documented Modbus RTU access
- 9600 baud, 8N1
- Tested LG slave/server ID: 2
- Shelly Serial / MbRtuClient component: 100
- Shelly RPC register addressing: zero-based in this example

## Reliability / safety behavior

- Performs a real LG read before enabling user writes, preventing stale VC defaults from being pushed after restart.
- Confirms supported writes by physical readback.
- Validates returned values before publishing them.
- Does not automatically replay an unconfirmed timed-out write.
- Does not bypass LG safety logic.
- Clearly scopes the register map to the tested installation; exact LG service documentation remains authoritative.

## Data exposed

- Coil 0: main power, R/W
- Coil 1: DHW enable, R/W
- Coil 2: Silent Mode, R/W
- Holding register 2: heating-water target, R/W, signed x0.1 C
- Holding register 8: DHW target, R/W, signed x0.1 C
- Input register 2: inlet-water temperature, read, signed x0.1 C
- Input register 3: outlet-water temperature, read, signed x0.1 C
- Input register 5: DHW temperature, read, signed x0.1 C
- Input register 0: error code, read

Standalone documentation and tested project:
https://github.com/drHouse-gif/lg-therma-v-shelly

## Contributor checklist

- [x] Self-contained upstream-format script prepared.
- [x] Standard Virtual Component helper pattern integrated.
- [x] Exactly 9 VCs preserved; `number:208` remains unused.
- [x] Required metadata header included.
- [x] JavaScript syntax validation passed.
- [x] Original Modbus bridge logic validated on the project installation.
- [ ] Final combined start-from-empty-VC path re-tested on Shelly hardware before final merge.
- [x] Model-specific safety/compatibility limitations documented.
- [x] No private installation data or credentials included.
```

## Submission status

The connected GitHub App can read `ALLTERCO/shelly-script-examples` but does not have permission to create issues or Pull Requests there. GitHub also requires a fork relationship for the PR head. Once `ALLTERCO/shelly-script-examples` is forked under `drHouse-gif`, copy this file to the planned upstream path and open the PR using the text above.
