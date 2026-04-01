# Substack Mirror: Design Language

This document captures the "Elegant Reading Room" aesthetic developed for the Substack Mirror project. It focuses on deep focus, premium typography, and a paper-like feel.

## 1. Color Palette (OKLCH)
We use the OKLCH color space for more natural perception of colors and better accessibility.

| Token | Value | Description |
| :--- | :--- | :--- |
| `background` | `oklch(0.99 0.005 60)` | Soft paper white / off-white. Reduces eye strain. |
| `foreground` | `oklch(0.15 0.01 60)` | Deep charcoal (not pure black) for text. |
| `primary` | `oklch(0.2 0.01 60)` | High-contrast accent for branding and buttons. |
| `muted` | `oklch(0.96 0.01 60)` | Soft grey for backgrounds of inputs/cards. |
| `border` | `oklch(0.92 0.01 60)` | Subtle hairlines for separation. |
| `accent` | `oklch(0.94 0.02 60)` | Soft highlight for hover states. |

## 2. Typography
The system uses a variable sans-serif (Geist) with specialized leading and tracking for long-form reading.

- **Hero Headings:** `6xl (text-6xl)`, `font-black`, `tracking-tight`.
- **Post Headings:** `4xl (text-4xl)` to `5xl`. Leading `1.1`.
- **Reader Body:** `1.125rem (text-lg)` with a leading of `1.75` for optimal readability.
- **Metadata:** `10px` or `11px`, `uppercase`, `font-bold`, `tracking-widest`.

## 3. UI Components & Patterns

### The "Zen Reader" (Prose)
A specialized wrapper for rendered HTML content:
- **Max Width:** `max-w-3xl` (approx 70-80 characters per line).
- **Images:** `rounded-xl`, `shadow-sm`, `border`. Always centered.
- **Blockquotes:** Left-border `4px`, `italic`, `oklch(0.2 / 0.1)` color.

### Navigation (Glassmorphism)
- **Blur:** `backdrop-blur` with `bg-background/95`.
- **Height:** `16 (64px)`.
- **Border:** `border-b`.

### Cards & Sections
- **Radius:** `0.5rem (rounded-lg)` for small items, `2.5rem (rounded-[2.5rem])` for large containers/hero sections.
- **Borders:** Prefers `border-dashed` for "Add" or "Empty" states to signify interactive potential.
- **Hover States:** Subtle scale or color shifts (e.g., `group-hover:text-primary`).

## 4. Layout Strategy
- **Centering:** All main views use `container mx-auto px-4`.
- **Max Widths:**
  - Landing Page: `max-w-4xl`.
  - Reader View: `max-w-3xl`.
  - Management Page: `max-w-5xl`.
- **Spacing:** Generous vertical spacing (`py-16`, `gap-16`) to create a sense of "air" and luxury.

## 5. CSS Logic (Tailwind v4 / OKLCH)
```css
:root {
  --background: oklch(0.99 0.005 60);
  --foreground: oklch(0.15 0.01 60);
  --primary: oklch(0.2 0.01 60);
  --radius: 0.5rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --radius-md: var(--radius);
}
```
