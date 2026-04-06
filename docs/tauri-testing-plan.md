# Tauri macOS Testing Plan

## Scope
Layers 1–3 only. Full binary E2E (tauri-driver + WebdriverIO) is out of scope.

---

## Prerequisites (fix before anything else)

| File | Change |
|---|---|
| `src-tauri/capabilities/default.json` | `fs:allow-app-data-read-recursive` → `fs:allow-appdata-read-recursive`; `fs:allow-app-data-write-recursive` → `fs:allow-appdata-write-recursive` |
| `src-tauri/Cargo.toml` | Add `tempfile = "3"` to `[dev-dependencies]` |

These must be fixed first — invalid capability names prevent `cargo build` from succeeding.

---

## Layer 1 — Rust Unit Tests

**Goal:** Test filesystem logic without a running Tauri app.

**Refactor `src-tauri/src/lib.rs`:** Extract two pure functions with no `AppHandle` dependency:

```rust
pub fn read_section_from_dir(dir: &std::path::Path, key: &str) -> Result<serde_json::Value, String>
pub fn write_section_to_dir(dir: &std::path::Path, key: &str, data: serde_json::Value) -> Result<(), String>
```

The Tauri commands become thin delegators that call these functions with `app.path().app_data_dir()`.

**Add `#[cfg(test)]` module to `lib.rs`** covering:

| Test | Assertion |
|---|---|
| `read_missing_key_returns_empty_array` | Returns `[]` when file does not exist |
| `write_then_read_roundtrip` | Written data is read back unchanged |
| `write_creates_subdirectory_automatically` | Deep nested dirs are created |
| `write_overwrites_existing_file` | Second write replaces first |
| `read_corrupt_json_returns_error` | Malformed JSON yields `Err` |
| `key_with_path_separator_is_rejected` | `../escape` does not write outside data dir |

**Run:**
```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

---

## Layer 2 — Vitest Tests for Tauri Code Paths

**Goal:** Cover `IS_TAURI` branches in `storage.js` and `platform.js` that are currently at zero coverage.

**Technique:** Use `mockWindows('main')` + `mockIPC()` from `@tauri-apps/api/mocks` (already installed). Call `vi.resetModules()` before each import so the module-level `IS_TAURI` constant is re-evaluated with `window.__TAURI_INTERNALS__` present.

### New file: `src/utils/storage.tauri.test.js`

| Test | Assertion |
|---|---|
| `IS_TAURI` is true when `__TAURI_INTERNALS__` present | `IS_TAURI === true` |
| `initTauriStorage` calls `read_section` for every known key | `readCalls.length === ALL_KEYS.length` |
| `initTauriStorage` populates cache so `loadData` is synchronous | `loadData('weekly-goals')` returns seeded data |
| `loadData` returns `[]` for key not in cache | Returns empty array |
| `saveData` updates cache synchronously and invokes `write_section` | Cache updated; `write_section` called after flush |
| `clearAll` resets all keys to `[]` and writes each to disk | All keys empty; all write invokes fired |

### New file: `src/utils/platform.tauri.test.js`

Uses `vi.doMock` on `@tauri-apps/plugin-dialog` and `@tauri-apps/plugin-fs`.

| Test | Assertion |
|---|---|
| `saveFile` calls dialog `save` then `writeFile` with chosen path | Both called with correct args |
| `saveFile` does nothing when dialog is cancelled (returns `null`) | `writeFile` not called |
| `openFile` returns a `File` object built from selected path | `instanceof File`, correct name |
| `openFile` returns `null` when dialog is cancelled | Returns `null` |

**Run:**
```bash
npm run test:run
```

---

## Layer 3 — Playwright Integration with Injected Tauri Mock

**Goal:** Test the full React app in Tauri mode without building the binary.

**Technique:** Inject `window.__TAURI_INTERNALS__` via `page.addInitScript` to make `IS_TAURI` truthy, then intercept `invoke` calls to control what the "backend" returns.

### New file: `e2e/tauri-mode.spec.js`

| Test | Assertion |
|---|---|
| App reads data via `read_section` invoke on page load | `getByText('Injected goal')` visible |
| App writes via `write_section` invoke after adding a row | `write_section` intercepted with correct key |

**Run:**
```bash
npm run test:e2e -- --project=chromium
```

---

## CI Integration

| Job | Trigger | Commands |
|---|---|---|
| `unit-and-vitest` | Every push | `npm run test:run` (includes new Layer 2 tests) |
| `playwright-browser` | Every push | `npm run test:e2e` (includes new Layer 3 spec) |
| `rust-unit` | Every push (macOS runner) | `cargo test --manifest-path src-tauri/Cargo.toml` |

---

## New Files

| File | Layer |
|---|---|
| `src-tauri/src/lib.rs` — add `#[cfg(test)]` module | 1 |
| `src/utils/storage.tauri.test.js` | 2 |
| `src/utils/platform.tauri.test.js` | 2 |
| `e2e/tauri-mode.spec.js` | 3 |
