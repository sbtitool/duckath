# DuckMath Token Reference

## Source Observations

The live site exposes these CSS values:

- `body` font: `League Spartan, sans-serif`
- `body` background color: `#87dc83`
- `body` background image: `/imgs/backgrounds/emeralds.svg`
- `body` background attachment: `fixed`
- Link color: `#348fff`, hover `#fff`

## Palette

Use these values as the canonical project mapping:

```css
:root {
  --duck-bg-primary: #1d2c13;
  --duck-bg-secondary: #2a3f1c;
  --duck-bg-tertiary: #364f25;
  --duck-green-light: #6fbf73;
  --duck-green: #4a9d4f;
  --duck-green-dark: #3d7a41;
  --duck-emerald-light: #5dcea6;
  --duck-emerald: #3fb683;
  --duck-emerald-dark: #2d8f66;
  --duck-text-primary: #e8f5e9;
  --duck-text-secondary: #c8e6c9;
  --duck-text-muted: #a5d6a7;
  --duck-text-dark: #2e4a2d;
  --duck-border: #4a6b3f;
  --duck-border-light: #5d8151;
  --duck-page-green: #87dc83;
}
```

## Shadcn Theme Mapping

Map the project tokens like this:

- `--background`: `#87dc83`
- `--foreground`: `#e8f5e9`
- `--card`: `#1d2c13`
- `--card-foreground`: `#e8f5e9`
- `--primary`: `#3fb683`
- `--primary-foreground`: `#0d1409`
- `--secondary`: `#2a3f1c`
- `--secondary-foreground`: `#e8f5e9`
- `--muted`: `#364f25`
- `--muted-foreground`: `#a5d6a7`
- `--accent`: `#5dcea6`
- `--accent-foreground`: `#1d2c13`
- `--border`: `#4a6b3f`
- `--ring`: `#5dcea6`

## Surfaces

- Main glass surface: `rgba(29, 44, 19, 0.84)`
- Elevated card: `linear-gradient(145deg, rgba(54, 79, 37, 0.95), rgba(29, 44, 19, 0.96))`
- Hover card: `rgba(61, 83, 48, 0.95)`
- Shadow: `0 24px 70px rgba(13, 20, 9, 0.35)`
