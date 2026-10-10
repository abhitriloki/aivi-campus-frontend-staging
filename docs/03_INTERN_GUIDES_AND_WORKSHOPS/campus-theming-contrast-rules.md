# AIVI Campus Theming & WCAG 2.1 AA Contrast Rules

This document establishes the mandatory design token and contrast contract for all `/campus/*` multi-tenant B2B interface components in AIVI Campus.

---

## 1. Design Token & Text Contrast Contract

### A. Body & Heading Text
- **Light Surfaces / Backgrounds (`bg-[#F6F8F7]` or `bg-white`)**:
  - Headings & Primary Text: `text-slate-900` or `text-[#112031]` (Contrast ≥ 14:1)
  - Secondary / Muted Text (< 14px): **`text-slate-600`** (Minimum contrast ≥ 4.5:1).
  - *Forbidden*: `text-slate-400`, `text-gray-400`, `opacity-60` on light backgrounds.
- **Dark Surfaces / Panels (`bg-[#0b131e]` or `bg-slate-900`)**:
  - Headings & Primary Text: `text-white` or `text-slate-100`.
  - Secondary Text: `text-slate-400` or `text-slate-300`.

### B. Tenant Branding Color Usage (`tenant.branding.primaryColor`)
Tenant primary colors MAY ONLY drive the following:
1. **Primary Button Backgrounds** (paired with computed `primaryForeground` via `accessibleOn()`).
2. **Active Sidebar Item Background & Accents** (`bg-primary/10 text-primary font-bold`).
3. **Links & Interactive Hover States**.
4. **Status Chips & Badges** (paired with accessible high-contrast text).
5. **Chart Accent Colors & Focus Rings**.

*Strict Violation Invariant*: `tenant.branding.primaryColor` MUST NEVER BE USED directly for body text, table cell text, or form field labels!

---

## 2. Contrast Guard Auto-Correction (`src/utils/contrastGuard.ts`)

Every tenant primary accent color is automatically processed through `ensureTenantAccent(color, background)` before setting CSS variables:
- High-luminance colors (e.g. Cyan `#66CCFF` or Neon Yellow `#FFFF00`) are automatically darkened/adjusted to guarantee a minimum **3.0:1 UI contrast ratio** and **4.5:1 text contrast ratio**.
- `accessibleOn(hexColor)` dynamically computes whether solid white (`#ffffff`) or dark slate (`#0f172a`) text yields maximum readability on primary buttons.

---

## 3. Button & Interactive Component Variants

| Component Variant | Background | Border | Text Color | Disabled State |
|---|---|---|---|---|
| **Primary Button** | `bg-[var(--tenant-primary)]` | None | `var(--tenant-primary-fg)` (`#ffffff` or `#0f172a`) | `bg-slate-200 text-slate-500 cursor-not-allowed` |
| **Secondary Button** | `bg-white dark:bg-slate-900` | `border-slate-300 dark:border-slate-700` | `text-slate-700 dark:text-slate-200` | `bg-slate-100 text-slate-400 cursor-not-allowed` |
| **Destructive Button** | `bg-red-600` | None | `text-white` | `bg-red-200 text-red-400 cursor-not-allowed` |

---

## 4. Table Design Contract

- **Header Rows**: `bg-slate-50 dark:bg-slate-900` with `text-slate-600 dark:text-slate-400` uppercase labels.
- **Data Rows**: `text-slate-900 dark:text-slate-100` font-medium.
- **Numeric Data Columns**: Class `tabular-nums` for precise alignment.
