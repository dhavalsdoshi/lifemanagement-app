# Markdown Export/Import Plan (Obsidian Integration)

## Export Format: ZIP of per-section `.md` files

One `.md` file per section (e.g., `reading-log.md`, `budget.md`), bundled in a single ZIP download. Users extract into their Obsidian vault and get a ready-made folder of notes.

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
| `date` | ISO `YYYY-MM-DD` as-is | Passthrough |
| `number` | Numeric string | Passthrough |
| `url` | Raw URL | Passthrough |
| `select` | Option value | Passthrough |
| `rating` | `★★★☆☆` (star chars) | Count `★` chars |

`<br>` for newlines renders correctly in Obsidian reading mode and roundtrips cleanly. Star characters are an Obsidian convention and immediately readable.

---

## Files to Create / Modify

| File | Change |
|---|---|
| `src/utils/markdownIO.js` | New — all export/import logic |
| `src/utils/markdownIO.test.js` | New — Vitest unit + roundtrip tests |
| `e2e/markdown-import-export.spec.js` | New — Playwright E2E |
| `src/App.jsx` | Add `handleMarkdownImport` / `handleMarkdownExport` handlers |
| `src/components/Layout.jsx` | Forward two new props |
| `src/components/Sidebar.jsx` | Add MD Import/Export buttons + second hidden file input |
| `src/components/Sidebar.test.jsx` | Assert new buttons present |
| `package.json` | Add `jszip` |

One new library: **`jszip`** (browser-safe, MIT, ~90KB) for ZIP creation and parsing. The markdown table format is simple enough that a hand-rolled ~30-line parser handles it — no need for a full markdown library.

---

## `markdownIO.js` Public API

```js
exportToMarkdownZip(allData)          // → Promise<Blob>  (ZIP blob)
importFromMarkdownZip(file)           // → Promise<Object> (same shape as importFromWorkbook)

// Internal, exported for testing
sectionToMarkdown(storageKey, rows)   // → string
markdownToRows(storageKey, mdString)  // → Array<Object>
serializeCell(value, colType)         // → string
deserializeCell(raw, colType)         // → string
```

---

## Implementation Order (TDD)

### Phase 1 — Cell serialization
- Write tests for `serializeCell` / `deserializeCell` covering every column type, empty values, pipe chars, multiline, star ratings
- Implement

### Phase 2 — Section export (`sectionToMarkdown`)
- Tests: frontmatter content, header row, separator row, one row per item, empty section
- Implement

### Phase 3 — Section import (`markdownToRows`)
- Tests: frontmatter ignored, keys mapped by column config, `<br>` decoded, stars decoded, unknown columns ignored, empty table returns `[]`
- Parser algorithm: skip frontmatter → read header row → skip separator → parse data rows
- Implement

### Phase 4 — ZIP export (`exportToMarkdownZip`)
- Tests: returns a `Blob`, ZIP contains 27 `.md` files, content matches expected
- Implement

### Phase 5 — ZIP import (`importFromMarkdownZip`)
- Tests: accepts File, keys match storage keys, unmatched files ignored, corrupt ZIP rejects
- Implement

### Phase 6 — Roundtrip fidelity test
- Build `allData` covering every column type → export → import → assert equality (modulo regenerated IDs)
- Highest-value test; catches any serialize/deserialize asymmetry

### Phase 7 — Wire into App + Sidebar
- Two new handlers in `App.jsx`, two new buttons in `Sidebar.jsx`

### Phase 8 — E2E tests
- Export triggers `.zip` download
- Import file input has `accept=".zip"`
- Corrupt ZIP shows error alert
- Full roundtrip via UI

---

## Key Decisions

- **ZIP not single file** — 27 sections as one giant `.md` is unmaintainable; per-file also enables future "export single section"
- **Hand-rolled parser** — we control the format 100%; a 30-line parser beats a 200KB markdown library dependency
- **No IDs in markdown** — IDs are implementation details; import generates fresh ones (matches Excel import behavior)
- **Frontmatter is write-only** — export writes it for Obsidian readability; import ignores it entirely, uses `SHEET_CONFIG` as schema
- **Import is replace** — same behavior as Excel import: replaces all data for sections present in the ZIP
