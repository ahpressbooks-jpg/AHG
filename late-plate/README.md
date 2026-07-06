# Late Plate

Storefront for **Late Plate** — a Black-owned online restaurant / meal-kit and recipe brand
built around Chef Noah Dean. "Made with heart, served with flair."

Built from the Late Plate design system (brand tokens, component library, and a from-scratch
storefront UI kit) with a real Vite + React + TypeScript build.

## Stack

- Vite + React 19 + TypeScript
- react-router-dom for the Menu / Cookbooks / About routes
- lucide-react for iconography (flagged substitution — see design system readme)
- Design tokens (`src/styles/colors.css`, `typography.css`, `spacing.css`) lifted directly
  from the Late Plate design system

## Structure

- `src/components/core`, `forms`, `feedback`, `navigation` — the design system's UI primitives
  (Button, Card, Dialog, Input, Tabs, etc.), ported to typed `.tsx`
- `src/components/storefront` — Header, Hero, ChapterFilters, MealGrid, MealDetail,
  CartDrawer, CookbookShop
- `src/context/CartContext.tsx` — cart state (add/remove/checkout, toast, confirmation)
- `src/pages` — route-level screens (Menu, Cookbooks, About)
- `src/data/menu.ts` — placeholder chapter/meal/cookbook data (no real menu content was
  supplied — see design system readme)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Known placeholders (flagged in the source design system)

- No product photography — meal cards use chapter-tone gradient blocks.
- Display/script fonts (Anton, Permanent Marker) are Google Fonts substitutions for the
  hand-lettered logo type.
- Icons are Lucide substitutions — no brand icon set exists yet.
- Menu/cookbook data is placeholder content in the established brand voice, not real pricing
  or a real catalog.
