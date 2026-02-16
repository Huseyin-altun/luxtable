# LuxTable CSS Variables

LuxTable uses a comprehensive CSS variable system that is **fully compatible with shadcn/ui**. It includes both shadcn base variables and LuxTable-specific variables, working seamlessly in both light and dark modes.

## How It Works

The variable system has two layers:

### 1. shadcn/ui Base Variables
Standard shadcn variables (`--background`, `--foreground`, `--primary`, `--accent`, `--border`, etc.) that power the shadcn UI components used internally (Button, Dropdown, Checkbox, etc.).

**If your project already has shadcn/ui configured**, your CSS variable values will take precedence, and LuxTable's internal UI components will automatically inherit your project's theme.

### 2. LuxTable Specific Variables (`--lux-*`)
Table-specific tokens that control the appearance of table elements (headers, rows, cells, pagination, etc.). These don't conflict with your existing shadcn setup.

## Usage

Import the variables file in your main CSS file:

```css
@import 'luxtable/src/styles/variables.css';
```

## Customization

All colors use HSL format and can be easily overridden:

```css
:root {
  /* Override shadcn base variables */
  --primary: 262 83% 58%;
  --accent: 262 30% 96%;
  
  /* Override LuxTable specific variables */
  --lux-table-background: 0 0% 100%;
  --lux-status-active-bg: 142 76% 36%;
}

.dark {
  /* Override dark mode colors */
  --primary: 262 83% 65%;
  --lux-table-background: 222 47% 2%;
}
```

## Available Variables

### shadcn Base Variables
These power the internal UI components (buttons, dropdowns, checkboxes, etc.):

| Variable | Description |
|----------|-------------|
| `--background` | Page/component background |
| `--foreground` | Default text color |
| `--primary` / `--primary-foreground` | Primary action color |
| `--secondary` / `--secondary-foreground` | Secondary color |
| `--muted` / `--muted-foreground` | Muted/subtle color |
| `--accent` / `--accent-foreground` | Accent/hover color |
| `--destructive` / `--destructive-foreground` | Destructive action color |
| `--border` | Default border color |
| `--input` | Input border color |
| `--ring` | Focus ring color |
| `--popover` / `--popover-foreground` | Popover/dropdown color |
| `--card` / `--card-foreground` | Card color |
| `--radius` | Border radius |

### LuxTable Specific Variables

#### Table Colors
- `--lux-table-background` - Main table background
- `--lux-table-foreground` - Main text color
- `--lux-table-border` - Table borders
- `--lux-table-header-*` - Header colors (background, foreground, border)
- `--lux-table-row-*` - Row colors (background, hover, selected, border)
- `--lux-table-cell-*` - Cell colors (foreground, muted)
- `--lux-table-footer-*` - Footer colors (background, foreground, border)

#### Toolbar
- `--lux-toolbar-background` / `--lux-toolbar-border` / `--lux-toolbar-foreground`
- `--lux-toolbar-input-*` - Input field colors (background, border, foreground, placeholder)
- `--lux-toolbar-icon` - Icon color

#### Pagination
- `--lux-pagination-background` / `--lux-pagination-border` / `--lux-pagination-foreground`
- `--lux-pagination-hover` / `--lux-pagination-active-*` / `--lux-pagination-disabled`

#### Status Colors
- `--lux-status-active-*` - Active status (bg, text)
- `--lux-status-inactive-*` - Inactive status
- `--lux-status-pending-*` - Pending status
- `--lux-status-completed-*` - Completed status
- `--lux-status-cancelled-*` - Cancelled status
- `--lux-status-default-*` - Default/unknown status

#### Selection
- `--lux-selection-background` / `--lux-selection-foreground` / `--lux-selection-border`
- `--lux-selection-info-*` - Selection info bar colors

#### Sort
- `--lux-sort-active` - Active sort direction indicator color
- `--lux-sort-idle` - Idle (unsorted) indicator color
- `--lux-sort-sorted-text` - Sorted column header text color

#### Other
- `--lux-progress-bg` / `--lux-progress-bar` / `--lux-progress-text` - Progress bar
- `--lux-boolean-true` / `--lux-boolean-false` - Boolean display
- `--lux-filter-*` - Filter panel (background, border, foreground)
- `--lux-focus-ring` / `--lux-focus-ring-offset` - Focus ring

## Format

All variables use HSL format (Hue Saturation Lightness) without the `hsl()` wrapper:

```css
--lux-table-background: 0 0% 100%; /* hsl(0, 0%, 100%) */
```

This allows Tailwind to use them with arbitrary values:
```tsx
className="bg-[hsl(var(--lux-table-background))]"
```

## Compatibility with Existing shadcn Projects

If your project already has shadcn/ui configured with its own `globals.css`, the base variables in `variables.css` serve as **fallback defaults**. Your project's values will override them automatically since CSS specificity follows the cascade.

This means:
- ✅ LuxTable works out of the box without shadcn setup
- ✅ LuxTable inherits your existing shadcn theme automatically
- ✅ `--lux-*` variables never conflict with standard shadcn variables

## Dark Mode

Dark mode is automatically handled. When you add the `.dark` class to your root element, all variables switch to their dark mode values. You can override them in the `.dark` selector:

```css
.dark {
  --lux-table-background: 222 47% 2%;
}
```
