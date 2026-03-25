# Development Guidelines

## Process
- Use **test-driven development**: write tests before implementation
- **Commit code** at every logical milestone
- Keep the codebase **clean**: reduce duplication, fewest possible elements for the functionality to work

## Before Every Commit

Run all of the following and ensure they pass:

```bash
npm run test:run   # Unit tests (Vitest) — must all pass
npm run test:e2e   # E2E tests (Playwright) — must all pass
npm run lint       # ESLint
npm audit          # check vulnerabilities
npm run build      # Production build — must succeed with no errors
```

## Code Quality
- No duplicate code — extract shared logic into hooks or utilities
- All code must have tests
- Minimal elements: only what is needed for functionality

## Design Principles
- **Sleek, premium, minimalist** look and feel
- **Single cohesive color palette** — no excess, no distraction, applied consistently
- **Fully responsive**: adapts gracefully to all screen sizes (desktop, tablet, mobile)
- **Light and dark mode** support
- Consistent spacing, typography, and visual harmony throughout
