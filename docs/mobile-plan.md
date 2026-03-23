# Mobile-Friendly UI Plan

## Core Problems

- **Sidebar** (`w-64 shrink-0`) — 256px always-visible, leaves ~119px on a 375px phone
- **Main padding** (`p-8`) — 64px of wasted horizontal space on mobile
- **Cell tap targets** — `min-h-[28px]` spans and `p-1` delete button are well under the 44px minimum
- **Star rating** — `p-0.5` per star = 20px touch target, nearly impossible to tap accurately
- **Card padding** (`p-6`, `px-6 py-4`) — wastes space on small screens
- **CellEditor `autoFocus`** — doesn't reliably trigger the virtual keyboard on iOS
- **Input `text-sm`** — 14px font causes iOS Safari to auto-zoom on input focus
- **No safe-area insets** — content hidden behind iPhone notch/Dynamic Island/home bar
- **Playwright has no mobile viewport projects** — gaps are invisible until tested on device

---

## Sidebar: Slide-in Drawer with Hamburger

**Not bottom nav** — 30 items across 5 sections don't fit a tab bar without a second navigation layer.
**Not icon-only collapse** — icons are too similar without labels; only saves ~200px.

**Recommended:** CSS `transform`-based drawer, hidden off-screen (`-translate-x-full`) on mobile, slides in over content on hamburger tap, closes on nav link tap or backdrop tap. On `md+` it stays visible exactly as today — no regression.

No new library needed. `Menu`/`X` icons from lucide-react, state managed via a `useSidebar` hook.

---

## Component Changes

| Component | Current problem | Fix |
|---|---|---|
| `Layout.jsx` | Always shows sidebar | Add `useSidebar` state, mobile top bar (`md:hidden`), backdrop overlay |
| `Sidebar.jsx` | `w-64 shrink-0`, no transforms | `fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0`, `isOpen`/`onClose` props; NavLink onClick calls `onClose()` |
| `DataTable.jsx` | `min-h-[28px]` cells, `p-1` delete | `min-h-[44px]` cells, `p-2.5` delete button, `w-full sm:max-w-xs` search |
| `CellEditor.jsx` | `autoFocus` fails iOS; 14px inputs zoom | Replace `autoFocus` with `useEffect` + `setTimeout(() => ref.focus(), 0)`; add `style={{ fontSize: '16px' }}` to all inputs |
| `StarRating.jsx` | `p-0.5` stars = 20px target | `p-2` per star, `gap-1` between |
| `Card.jsx` | `px-6 py-4` / `p-6` | `px-4 py-3 sm:px-6 sm:py-4` / `p-4 sm:p-6` |
| `index.css` | No safe-area, no font-size reset | Add `env(safe-area-inset-*)`, `font-size: 16px` on inputs at mobile breakpoint |
| `index.html` | No `viewport-fit=cover` | Add to viewport meta tag |

**Table on mobile:** Enhanced horizontal scroll with sticky first column + scroll-into-view when editing a cell (fixes virtual keyboard pushing content off screen).

---

## Implementation Order (TDD)

1. **Add mobile Playwright projects** (`iPhone 15 Pro`, `Galaxy S24`) — reveals all failures, anchors TDD
2. **`useSidebar` hook** — `isOpen`, `open`, `close`, `toggle`, auto-close on route change
3. **Layout** — mobile top bar, backdrop, drawer wiring, `p-4 md:p-8`
4. **Sidebar** — transform drawer, `isOpen`/`onClose` props, hide title on mobile
5. **StarRating** — `p-2` stars
6. **DataTable** — touch targets, scroll-into-view on edit, sticky first column
7. **CellEditor** — `useEffect` focus, 16px font-size
8. **Card** — responsive padding
9. **`index.css` + `index.html`** — safe-area insets, zoom fix
10. **Dashboard** — update "Use the sidebar" hint text
11. **`e2e/mobile-navigation.spec.js`** — hamburger opens drawer, nav link closes it, backdrop closes it

## New Files
- `src/hooks/useSidebar.js` + `useSidebar.test.js`
- `e2e/mobile-navigation.spec.js`

## Playwright Devices
- **`iPhone 15 Pro`** — current flagship iOS, tests Dynamic Island viewport and `viewport-fit=cover`
- **`Galaxy S24`** — current flagship Android, tests current Chrome mobile behavior

## No New Libraries Needed
Tailwind responsive classes, `useLocation` (already a dep), and `Menu`/`X` from lucide-react cover everything.
