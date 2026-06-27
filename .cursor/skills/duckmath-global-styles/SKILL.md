---
name: duckmath-global-styles
description: Applies DuckMath-inspired global visual styling for Next.js Tailwind pages. Use when implementing or refining a DuckMath-style green game portal, learning hub, arcade grid, or any page that should match duckmath.org visual language.
disable-model-invocation: true
---

# DuckMath Global Styles

## Intent

Recreate the visual language observed from `https://duckmath.org/`: a bright green full-page background, fixed emerald pattern, dark forest panels, rounded game cards, playful learning/game portal layout, and high-contrast green accents.

## Core Rules

1. Use the tokens in `tokens-reference.md` before inventing new colors.
2. Prefer `League Spartan` or a geometric rounded sans stack for headings and UI.
3. Keep the page background vivid green with an emerald pattern or layered radial gradients.
4. Place content inside dark green translucent panels with soft shadows.
5. Use rounded full pills for navigation, filters, badges, and search.
6. Use dense card grids for apps/games/lessons. Cards should feel clickable, chunky, and playful.
7. Keep copy short and action-oriented. The site should feel like a study portal disguised as a game hub.

## Tailwind Mapping

- Page background: `bg-background text-foreground` plus global CSS gradients/patterns.
- Main panels: `bg-card text-card-foreground border border-border rounded-[var(--radius)] shadow-lg`.
- Primary actions: deep emerald/green buttons with light text.
- Secondary actions: translucent dark green pills with light borders.
- Muted copy: use `text-muted-foreground`, not gray.
- Card hover: slightly lift, brighten border, and deepen shadow.

## Layout Pattern

For a DuckMath-style landing page:

1. Header: compact pill nav on a transparent or glassy dark green surface.
2. Hero: left-aligned or centered headline, search bar, category chips, and a featured game/lesson card.
3. Content: responsive grid of rounded cards with icon/image area, title, metadata, and action.
4. Footer/CTA: dark green block with emerald highlight and simple links.

## Validation

Before finishing:

- Confirm `src/app/theme.css` exposes DuckMath-like colors.
- Confirm `src/app/globals.css` sets the global green background and body font.
- Confirm major interactive surfaces have rounded corners, borders, hover states, and strong contrast.
- Run the project linter or TypeScript check when practical.
