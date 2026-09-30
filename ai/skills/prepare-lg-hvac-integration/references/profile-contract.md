# Profile contract v1

Identity chain: exact LG model/family and board revision → direct interface or named controller/gateway → protocol map and revision → functions → exact Shelly model, firmware and add-on. An omitted gateway means documented direct connection, not an unknown gateway silently removed.

Use `profiles/profile-template.json`. The top level holds architecture, evidence, conflicts, limitations and test records. Every point must store:
- stable key, name, purpose;
- source display address, HEX, decimal and address convention, with separately verified wire offset;
- coil/discrete-input/input-register/holding-register and read/write function codes;
- read/write rights;
- data type, signedness, register count, byte order and word order;
- scale, offset, unit, min/max and enum values;
- mode/installation restrictions and source page/section;
- LG availability, Shelly component mapping and cloud display/control evidence;
- documented/assumed/tested evidence plus explicit unresolved fields.

`null` means unknown, not zero or false. `false` means specifically prohibited/unavailable. Retain raw source text even when normalization is proposed. Store transformations as derived, and gate their applicability. Do not equate FC03 holding-register reads with writable registers. Distinguish an LG central-control address, a map's unit index and Modbus slave ID.

For multiword quantities retain each raw register and separately document the aggregate order and scale. Do not infer signedness or temperature units from names. Family profiles may be discovery-only. Do not instantiate a model-supported profile from workbook family names.

Tests contain date, exact hardware/firmware/map, observer, inputs, expected/observed results and evidence locator. Keep source-reported tests distinct from tests performed in the current task. Proposed changes are reviewed diffs; saving requires an actual plugin update and release receipt.
