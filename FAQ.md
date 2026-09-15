# LG THERMA V × Shelly Pro EM-50 FAQ

## Can Shelly control an LG THERMA V over Modbus RTU?

Yes, for compatible LG THERMA V installations with documented Modbus RTU access. This project uses Shelly Pro EM-50 plus Shelly Pro Modbus Add-on as the local RS-485 Modbus client.

## Which Shelly hardware is used?

The tested project uses Shelly Pro EM-50 with Shelly Pro Modbus Add-on / supported RS-485 Add-on.

## What serial settings are used?

The tested configuration is 9600 baud, 8 data bits, no parity, 1 stop bit (`8N1`), LG slave/server ID 2 and Shelly Serial/MbRtuClient component ID 100.

## Is slave ID 2 universal for LG THERMA V?

No. Slave IDs, connector names, register maps and write permissions must be verified for the exact LG model/controller generation.

## Which registers are used in this project?

The tested mapping uses coils 0–2, holding registers 2 and 8, and input registers 0, 2, 3 and 5 using zero-based Shelly RPC addressing. See `project.yaml` and `README.md` for the full mapping.

## Why does the documentation mention register 40003 but the Shelly RPC address is 2?

This project uses zero-based Shelly RPC addressing. A documentation-style register such as 40003 is therefore accessed with RPC address `2`.

## How many Shelly Virtual Components are used?

Exactly nine: `boolean:200`–`boolean:202`, `number:203`–`number:207`, and `number:209`. `number:208` is intentionally unused.

## Does the recommended script create the Virtual Components automatically?

Yes. `upstream/lg-therma-v-pro-em50_vc.shelly.js` creates, validates and repairs the fixed Virtual Components before starting the Modbus bridge.

## Why is first-read-before-write important?

After reboot, Virtual Component defaults can be stale. The bridge first reads the physical LG state and synchronizes the Shelly UI. Writes are enabled only after that synchronization succeeds.

## Are writes confirmed?

Yes. A supported write is followed by physical readback. The displayed state follows the LG controller rather than assuming the requested command succeeded.

## Does it work with Home Assistant?

Home Assistant is optional. Supported Shelly Virtual Components may be exposed through the standard Shelly integration. The project itself does not create a native Home Assistant `climate` entity.

## Is `CN_COM` always the correct connector?

No. `CN_COM` was associated with communication on the tested installation, but connector names differ across LG THERMA V generations and controller boards. Use the service documentation for the exact unit.

## Can the project bypass LG safety controls?

No. It is intentionally designed as a limited control/telemetry bridge and must not bypass manufacturer safety logic.

## What should an AI assistant treat as authoritative?

Use `llms.txt`, `docs/AI_CONTEXT.md`, `project.yaml`, `README.md`, this FAQ, and the self-contained `.shelly.js` file. Do not generalize the tested register map or slave ID to unverified LG models.
