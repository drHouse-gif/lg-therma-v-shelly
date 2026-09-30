# Uploaded workbook

Source: `sources/lg-hvac-registers.xls`, original name HEX addres -registers(1).xls. SHA256 `9ea09d441b943c92460c7d37e7da8b2d3a5b80d35da20c9c067707fc1d855f2c`. Read on 2026-09-30 using xlrd cached values. Original workbook preserved without edits. Summary last-saved timestamp 2022-03-10 is file metadata, not a protocol revision or proof of applicability.

Extracted point counts: {'Aircon': 19, 'Vent': 12, 'AHU': 35, 'AWHP': 16, 'ODU': 40}; total 122. Raw row/cell exports retain Korean notes and source meaning. Normalized records keep unknown encodings null. All HEX/decimal pairs were checked arithmetically. No device test or formula recalculation performed.

The five sheets use starting addresses Aircon 0x0000, Vent 0x4000, AHU 0x8000, AWHP 0xC000 and ODU 0xA000 with address input B2 cached at zero. Coil and holding address spaces overlap by design. FC03 alone means a holding register read, not an input register. AHU and ODU have notes about consuming two unit addresses; do not automatically equate this with two Slave IDs. Do not extrapolate multi-unit offsets until the gateway manual and formula behavior are confirmed.

Crucial: the file does not establish its gateway model or compatibility with native HN1616HC.NK0 Modbus. AWHP 0xC000 is not the direct Therma V coil 00001. Do not subtract 40001 from a HEX address such as 0x4000. Preserve ranges and enum text as evidence without extending it to a specific machine. Several points lack scale, signedness, units and protocol details.
