# Runtime and commissioning contract

Do not turn this design contract into a deployable script until hardware, firmware, map, limits and allowed writes are confirmed. Keep all configuration in one place. Produce full code, not fragments labelled ready.

- Maintain one in-flight bus request and a bounded sequential queue per physical bus. Avoid concurrent masters. Coalesce duplicate reads; bound queue length and command age. Prefer timer-scheduled pumping over recursive callbacks.
- Document poll period, inter-request gap, timeout, retry count and capped backoff appropriate to the LG interface and Shelly runtime. Account for API concurrency, timer and memory limits and existing scripts. Never infer limits from a different Shelly model.
- Validate finite numeric values, permitted enums, signedness, scale, register count and endianness. Use an explicit write allowlist and model/mode-specific range. Prohibit broadcast writes and arbitrary address input. Never expose emergency, disinfection, protection or installer points as ordinary controls by default.
- Start in READ_ONLY/UNSYNCED. Read LG first, then mirror verified actual values. Never write default or persisted UI values on boot. Enable only supported user commands after initial synchronization and explicit commissioning write enable.
- Track desired and actual values separately. Confirm a command with readback after documented settling time. Handle rejection, clamping, mode restrictions and mismatch without claiming success. Avoid blindly retrying non-idempotent trigger commands after an uncertain response; inspect state first.
- Poll for changes made on the original LG controller. Prevent component-update feedback using documented source/event semantics and an async-safe suppression strategy. One boolean set/reset around an asynchronous operation is insufficient. Compare values and prevent stale events from reissuing writes.
- On timeout, malformed response or repeated failure, mark last-known values stale with timestamp and communication status. Block writes, clear obsolete queued commands and re-read before recovery. Do not silently show stale values as live or replay pre-disconnect commands.
- Keep logs diagnostic and bounded. Remove tokens, passwords and personal network details. Avoid unbounded retries, log loops and exception recursion.

## Idempotent provisioning

Enumerate all existing components using the selected firmware's documented pagination. Maintain an ownership manifest with logical point, component ID/type, integration ID and configuration version. Reuse only components proven owned and compatible. A matching number or name alone does not establish ownership. If an ID is occupied by a foreign component, stop with a precise conflict or choose and persist a free ID. Never delete or repair foreign components or scripts. Track partial provisioning and create only missing owned items on rerun. Snapshot changed owned configuration for rollback. Count existing plus proposed components before changes.

## Tests

Record observed results, not only an expected result checklist. Test read-only startup, plausible units, each enabled function, external LG control synchronization, rejected/out-of-range inputs, readback mismatch, lost responses, reconnect, boot with stale cloud values, queue saturation and feedback-loop prevention. Test provisioning twice and with occupied IDs. A simulator must also model faults; record what it cannot prove. Hardware testing is not supplied by this plugin.

## Rollback

Disable writes and script autostart, then stop this integration's script. Restore prior serial/add-on settings only if this integration changed them and no other owner relies on them. Remove only manifest-owned components after explicit user intent, preserving backup and foreign resources. Restore installer settings from the commissioning record, not guessed defaults. Verify original LG controls and protections still operate. Wiring and electrical work must follow the installation manual with power isolated. Never use main-power interruption as standard compressor control.
