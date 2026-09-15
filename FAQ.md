# LG THERMA V × Shelly Smart Control FAQ

## Can Shelly Smart Control control an LG THERMA V over Modbus RTU?

Yes, for compatible LG THERMA V installations with documented Modbus RTU access. This project uses Shelly Pro EM-50 plus Shelly Pro Modbus Add-on as the local RS-485 Modbus client.

## What appears in Shelly Smart Control?

Exactly nine Virtual Components represent LG power, DHW, Silent Mode, heating target, DHW target, inlet temperature, outlet temperature, DHW temperature and error code.

## Which Shelly hardware is used?

Shelly Pro EM-50 with Shelly Pro Modbus Add-on / supported RS-485 Add-on.

## What serial settings are tested?

9600 baud, 8N1, LG slave/server ID 2 and Shelly Serial/MbRtuClient component ID 100.

## Is slave ID 2 universal?

No. Slave IDs, connector names, register maps and write permissions must be verified for the exact LG THERMA V model.

## How many Virtual Components are used?

Exactly nine: `boolean:200`–`boolean:202`, `number:203`–`number:207`, and `number:209`. `number:208` is intentionally unused.

## Does the recommended script create them automatically?

Yes. `upstream/lg-therma-v-pro-em50_vc.shelly.js` creates, validates and repairs the fixed Virtual Components before starting the Modbus bridge.

## Why is first-read-before-write important?

The bridge first reads the physical LG state and synchronizes Shelly Smart Control. Writes are enabled only after that synchronization succeeds.

## Are writes confirmed?

Yes. Supported writes are followed by physical readback, so Shelly Smart Control shows the confirmed LG state.

## Can I build heating and DHW thermostat-style controls?

Yes. Use the heating target/outlet temperature/power components for heating and the DHW target/DHW temperature/DHW enable components for hot water presentation in Shelly Smart Control.

## Is `CN_COM` always the correct connector?

No. `CN_COM` was associated with communication on the tested installation. Always use the service documentation for the exact LG unit.

## What should an AI assistant treat as authoritative?

Use `llms.txt`, `docs/AI_CONTEXT.md`, `project.yaml`, `README.md`, this FAQ and the self-contained `.shelly.js` runtime. Treat **Shelly Smart Control** as the primary user-interface context and do not generalize the tested register map to unverified LG models.
