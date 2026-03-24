# Import / Export Plan — Excel & Markdown (Obsidian)

## Goals

- Both Excel and Markdown import/export accessible from the same two buttons
- No extra buttons cluttering the sidebar — the existing Import / Export buttons gain format menus
- Markdown format is Obsidian-compatible out of the box
- Import gives the user a choice of Append or Overwrite (Markdown only; Excel always overwrites, matching existing behaviour)

---

## Sidebar UI

The sidebar footer currently has three rows: **Dark Mode**, **Import**, **Export**.

The Import and Export buttons become **format-picker dropdowns** that open upward when clicked. Layout stays three rows — nothing is added, nothing moves.

```
┌────────────────────────────────┐
│  ☀ Light Mode                  │  ← full-width toggle (unchanged)
├────────────────────────────────┤
│  ↑ Import ▾                    │  ← click → format menu opens above
├────────────────────────────────┤
│  ↓ Export ▾                    │  ← click → format menu opens above
└────────────────────────────────┘
```

### Format menu (opens upward, closes on outside click or selection)

```
  ┌──────────────────────────┐
  │  📊  Excel  (.xlsx)      │
  │  📝  Markdown  (.zip)    │
  └──────────────────────────┘
  ↑ Import ▾
```

Same menu shape for Export.

---

## Import Flows

### Excel import (unchanged behaviour)
1. User clicks **Import ▾** → format menu opens
2. User selects **Excel (.xlsx)** → hidden file input (`.xlsx,.xls`) opens
3. File is parsed → all sections overwritten → page reloads

### Markdown import
1. User clicks **Import ▾** → format menu opens
2. User selects **Markdown (.zip)** → hidden file input (`.zip`) opens
3. ZIP is parsed (no data written yet)
4. **ImportModeModal** appears:
   - *"X sections found. How would you like to import?"*
   - **Append to existing data** — adds rows after existing rows; nothing deleted
   - **Overwrite existing data** — replaces rows for sections in the ZIP; other sections untouched
   - **Cancel** — aborts, no data written
5. On confirmation → data written → page reloads

---

## Export Flows

### Excel export (unchanged)
1. User clicks **Export ▾** → format menu opens
2. User selects **Excel (.xlsx)** → immediate download of `life-management.xlsx`

### Markdown export
1. User clicks **Export ▾** → format menu opens
2. User selects **Markdown (.zip)** → immediate download of `life-management.zip`
   - ZIP contains one `.md` file per section (27 files)
   - Each file has YAML frontmatter + a markdown table — ready to drop into an Obsidian vault

---

## Markdown File Format

### Example `reading-log.md`

```markdown
---
section: Reading Log
storageKey: reading-log
exportedAt: 2026-03-22T14:30:00.000Z
---

| Title | Author | Date Finished | Rating | Notes |
| ----- | ------ | ------------- | ------ | ----- |
| Dune | Frank Herbert | 2026-01-15 | ★★★★★ | One of the best.<br>Incredible world-building. |
| Atomic Habits | James Clear | 2026-02-20 | ★★★★☆ | Good practical advice. |
```

### Column Type Encoding

| Type | Export | Import |
|---|---|---|
| `text` | Raw, `\|` escaped | Unescape `\|` |
| `textarea` | Newlines → `<br>` | `<br>` → `\n` |
| `date` | ISO `YYYY-MM-DD` | Passthrough |
| `number` | Numeric string | Passthrough |
| `url` | Raw URL | Passthrough |
| `select` | Option value | Passthrough |
| `rating` | `★★★☆☆` (filled/empty star chars) | Count `★` chars → numeric string |

`<br>` roundtrips cleanly and renders correctly in Obsidian reading mode. Star chars are an Obsidian convention and are immediately human-readable.

---

## Files to Create / Modify

| File | Change |
|---|---|
| `src/utils/markdownIO.js` | New — all markdown export/import logic |
| `src/utils/markdownIO.test.js` | New — unit + roundtrip tests |
| `src/components/shared/ImportModeModal.jsx` | New — Append / Overwrite / Cancel modal (Markdown import only) |
| `src/components/shared/ImportModeModal.test.jsx` | New — unit tests |
| `src/components/Sidebar.jsx` | Replace Import/Export buttons with dropdown-enabled versions; add two hidden file inputs (.xlsx and .zip); add `FormatMenu` inline state |
| `src/components/Sidebar.test.jsx` | Assert format menus render; assert both file inputs present |
| `src/components/Layout.jsx` | Forward `onMarkdownImport` / `onMarkdownExport` props |
| `src/App.jsx` | Add `handleMarkdownImport(file, mode)` and `handleMarkdownExport()` handlers |
| `e2e/import-export.spec.js` | Update: add format menu interaction before clicking Import/Export |
| `e2e/markdown-import-export.spec.js` | New — Markdown-specific E2E tests |
| `package.json` | Add `jszip` |

One new library: **`jszip`** (browser-safe, MIT, ~90KB) for ZIP creation and parsing.

---

## `markdownIO.js` Public API

```js
exportToMarkdownZip(allData)              // → Promise<Blob>  (ZIP blob)
importFromMarkdownZip(file)               // → Promise<Object> (storageKey → rows[])

// Internal helpers, exported for unit testing
sectionToMarkdown(storageKey, rows)       // → string
markdownToRows(storageKey, mdString)      // → Array<Object>
serializeCell(value, colType)             // → string
deserializeCell(raw, colType)             // → string
```

---

## `handleMarkdownImport` in `App.jsx`

```js
async function handleMarkdownImport(file, mode) {
  // mode: 'append' | 'overwrite'
  const imported = await importFromMarkdownZip(file)
  Object.entries(imported).forEach(([key, newRows]) => {
    if (mode === 'append') {
      saveData(key, [...loadData(key), ...newRows])
    } else {
      saveData(key, newRows)
    }
  })
  window.location.reload()
}
```

---

## Implementation Order (TDD)

### Phase 1 — Cell serialization
- Tests: `serializeCell` / `deserializeCell` covering every column type, empty values, pipe chars, multiline text, star ratings
- Implement

### Phase 2 — Section export (`sectionToMarkdown`)
- Tests: frontmatter fields, header row, separator row, one data row per item, empty section produces empty table
- Implement

### Phase 3 — Section import (`markdownToRows`)
- Tests: frontmatter skipped, headers mapped to column keys via `SHEET_CONFIG`, `<br>` decoded to `\n`, stars decoded to numeric string, unknown columns ignored, empty table returns `[]`
- Parser algorithm: skip frontmatter block → read header row → skip separator row → parse data rows
- Implement

### Phase 4 — ZIP export (`exportToMarkdownZip`)
- Tests: returns a `Blob`, ZIP contains one file per section, filename matches `storageKey`, content matches `sectionToMarkdown` output
- Implement

### Phase 5 — ZIP import (`importFromMarkdownZip`)
- Tests: returns correct shape, keys match storage keys, files not matching any `storageKey` are ignored, corrupt ZIP rejects with an error
- Implement

### Phase 6 — Roundtrip fidelity test
- Build `allData` covering every column type → export → import → assert all values equal (modulo regenerated row IDs)
- Highest-value test: catches any serialize/deserialize asymmetry

### Phase 7 — `ImportModeModal`
- Tests: renders section count, calls `onAppend` / `onOverwrite` / `onCancel`
- Implement `ImportModeModal.jsx`

### Phase 8 — Sidebar format menus
- Tests: both Import and Export buttons have a dropdown chevron, clicking Import opens format menu with Excel + Markdown options, clicking Export opens format menu, both file inputs present in DOM
- Implement inline `FormatMenu` state in `Sidebar.jsx`; two hidden file inputs; close menu on outside click

### Phase 9 — Wire into App + Layout
- Add `handleMarkdownImport(file, mode)` and `handleMarkdownExport()` in `App.jsx`
- Thread props through `Layout.jsx` → `Sidebar.jsx`
- Update existing `import-export.spec.js`: open format menu before clicking Import/Export

### Phase 10 — E2E tests (`markdown-import-export.spec.js`)
- Export via Markdown option triggers `.zip` download
- Markdown import file input has `accept=".zip"`
- Corrupt ZIP shows error alert
- Append mode: existing rows survive, imported rows added after them
- Overwrite mode: existing rows replaced by imported rows

---

## Key Decisions

| Decision | Rationale |
|---|---|
| Format menus on existing Import/Export buttons | Keeps sidebar footer at 3 rows; no new buttons; pattern is immediately familiar |
| Menu opens upward | Sidebar footer is at the bottom of the screen; upward avoids clipping |
| Append/Overwrite modal only for Markdown | Excel has always been overwrite-only; changing that would be a breaking UX surprise |
| Append is the first/default option | Non-destructive first; safer for users syncing from Obsidian |
| ZIP not a single `.md` | 27 sections as one file is unmanageable in Obsidian; per-file enables future single-section export |
| Hand-rolled table parser | Fully controls the format; a ~30-line parser beats a 200KB markdown library |
| No row IDs in markdown | IDs are implementation details; import generates fresh ones — same as Excel import |
| Frontmatter is write-only | Written for Obsidian readability; import ignores it entirely and uses `SHEET_CONFIG` as schema |
