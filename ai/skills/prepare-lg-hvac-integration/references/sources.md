# Source index — retrieved 2026-09-30

## LG official model documentation

- Model support page: https://www.lg.com/bg/poddryjka/product/lg-HN1616HC . Lists English/Bulgarian installation manuals dated 21 July 2026. This is a listing date, not the PDF revision.
- Requested entry: https://www.lg.com/bg/poddryjka/rukovodstva?csSalesCode=HN1616HC.NK0 . Entry page was read; document found through the model support page.
- English installation manual: https://gscs-b2c.lge.com/downloadFile?fileId=SwBHlGV3pEWTB0a0w6RJg . Downloaded and relevant sections read locally. Document MFL68681839, Rev.08_022726. Cover includes HN1616HC NK0. SHA256 e5951e6de60e47d0e067a8eeb19238c9eddff63fc1d8fda4ba9f34b70ea72c52. Inspected cover and sections pp.98,155,183–186; visually verified pp.98 and185. Full manual is not bundled for redistribution. Retrieve this exact document or a applicable successor before adapting the profile. Web reader failed on octet-stream; direct download succeeded.

## Shelly official sources

- https://kb.shelly.cloud/knowledge-base/integrating-lg-therma-v-with-shelly-smart-control-via-modbus-rtu-a-comprehensive-guide — read integration architecture, hardware, mapping, commissioning and limitations. Documents Pro EM-50 + Pro Modbus Add-on for a particular compatible installation. It does not identify HN1616HC.NK0 as the tested model or pin a firmware version. Nine components and thermostat/scene examples must not be extended to every device or account.
- https://shelly-api-docs.shelly.cloud/gen2/DynamicComponents/Virtual/ — read component creation/deletion, enumeration and the stated 10-instance limit. Verify against exact current firmware. The page's generation wording is not a universal device-support matrix.
- https://shelly-api-docs.shelly.cloud/gen2/Devices/Gen2/ShellyProEM/ — retrieved device capability excerpt: RS485 add-on enables MbRtuClient when configured. Full device setup and electrical documentation must be read before implementation.
- https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/MbRtuClient/ — retrieved API excerpt. Use exact full method descriptions before code generation; do not assume FC05 and FC15 are interchangeable.
- https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Serial/ — retrieved mode description excerpt. mb_client exposes a client component; select a documented supported mode on actual device.

## Community reference

https://github.com/drHouse-gif/lg-therma-v-shelly . README.md read, blob f83083657dc38179dfa24932499a1e19ecb1a0e5, main commit 5e9ee73e73f32c35a2b23def5100f95f565fa5a5 (2026-09-15). README reports prior installation testing but says combined provisioning wrapper still needs final hardware retest. Do not label it fully hardware-validated. Runtime source was not reviewed or bundled in this release. No license determination for code reuse has been made. Retrieve exact source and license before adapting.

## Uploaded workbook

See workbook.md. Original and 122 source-anchored point records are bundled for private testing. Gateway applicability and publication/reuse permission remain unconfirmed. Do not publish source attachments automatically with a future public release.
