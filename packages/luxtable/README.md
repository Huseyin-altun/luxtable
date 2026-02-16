# 💎 LuxTable

**Enterprise-Grade Data Management. Minimalist Aesthetics.**

[![npm version](https://img.shields.io/npm/v/luxtable.svg)](https://www.npmjs.com/package/luxtable)
[![npm downloads](https://img.shields.io/npm/dm/luxtable.svg)](https://www.npmjs.com/package/luxtable)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

LuxTable is a high-performance, feature-rich data grid library designed specifically for the modern React ecosystem. It bridges the gap between complex data manipulation and the clean, modular philosophy of Shadcn UI. Built for developers who refuse to choose between power and beauty.

## ✨ Key Features

- ⚡ **High-Velocity Performance** - Optimized rendering engine capable of handling massive datasets with 60fps fluidity
- 🎨 **Shadcn-Native Design** - Crafted with Tailwind CSS and Radix UI primitives
- 🚀 **Zero-Config Magic** - Auto-generate columns from data, auto-detect cell types by field names
- 🔍 **Advanced Filtering** - Column-level filters with multiple filter types (text, number, select)
- 🔄 **Smart Sorting** - Multi-column sorting with Shift+Click support
- ✅ **Row Selection** - Single and multi-select with checkbox support
- 📄 **Pagination** - Built-in pagination with customizable page sizes
- 🛠️ **Column Actions** - Hide/show columns, sorting controls in a unified dropdown
- 🔎 **Global Search** - Search across all columns instantly
- 🎯 **Auto Cell Detection** - Automatically detects and renders status, date, currency, boolean, and copyable fields
- 🔒 **Type-Safe Excellence** - First-class TypeScript support with full type inference
- 📱 **Fully Responsive** - Adaptive layouts from ultra-wide monitors to mobile screens

## 🚀 Quick Start

### Installation (Recommended: shadcn CLI)

LuxTable uses the **shadcn registry** approach - components are copied directly into your project, giving you full control over the code.

#### Prerequisites

Make sure you have shadcn/ui set up in your project:

```bash
pnpm dlx shadcn@latest init
```

#### Install LuxTable

```bash
# Install the main LuxTable component
pnpm dlx shadcn@latest add "https://luxtable.dev/r/lux-table.json"

# Optional: Install pre-built cell renderers
pnpm dlx shadcn@latest add "https://luxtable.dev/r/lux-table-cell-renderers.json"

# Optional: Install column helper utilities
pnpm dlx shadcn@latest add "https://luxtable.dev/r/lux-table-column-helper.json"
```

This will:
- Copy LuxTable components to your `components/lux-table` folder
- Install required dependencies (`@tanstack/react-table`, `lucide-react`)
- Install required shadcn/ui components (button, checkbox, dropdown-menu, input, select)

### Alternative: npm Package

If you prefer using LuxTable as an npm package:

```bash
npm install luxtable
# or
pnpm add luxtable
# or
yarn add luxtable
```

> **Note:** When using the npm package, you need to configure your `tailwind.config.js` to include LuxTable:
> ```js
> module.exports = {
>   content: [
>     "./src/**/*.{js,ts,jsx,tsx}",
>     "./node_modules/luxtable/dist/**/*.{js,mjs}",
>   ],
> };
> ```

### Basic Usage

#### Zero-Config: Auto-Generated Columns

LuxTable can automatically generate columns from your data - no column definitions needed!

```tsx
import { LuxTable } from "luxtable";

type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  salary: number;
};

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", joinDate: "2024-01-15", salary: 75000 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active", joinDate: "2024-02-20", salary: 65000 },
  // ... more data
];

export default function App() {
  return (
    <LuxTable
      data={data}
      options={{
        pagination: true,
        filtering: true,
        sorting: true,
        multiSort: true, // Shift+Click to sort by multiple columns
        selection: "multiple",
        showToolbar: true,
        showGlobalSearch: true,
        showColumnVisibility: true,
      }}
    />
  );
}
```

**What happens automatically:**
- ✅ Columns are auto-generated from data keys
- ✅ Headers are auto-formatted (camelCase → Title Case)
- ✅ Cell types are auto-detected:
  - `status` → StatusCell (colored badges)
  - `joinDate`, `createdAt` → DateCell (formatted dates)
  - `salary`, `price` → CurrencyCell (formatted currency)
  - `id`, `email` → CopyableCell (click to copy)
  - Boolean fields → BooleanCell (Yes/No)

#### Manual Column Definitions

You can also define columns manually for full control:

```tsx
import { LuxTable, createColumnHelper } from "luxtable";
import { ColumnDef } from "@tanstack/react-table";

type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
};

const columnHelper = createColumnHelper<User>();

const columns: ColumnDef<User>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 80,
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
];

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
];

export default function App() {
  return (
    <LuxTable
      data={data}
      columns={columns}
      options={{
        pagination: true,
        filtering: true,
        selection: "multiple",
        showToolbar: true,
      }}
    />
  );
}
```

## 📦 Cell Renderers

LuxTable comes with built-in cell renderers that are automatically applied based on field names and values. You can also use them manually:

### Available Cell Renderers

- **StatusCell** - Colored status badges (Active, Pending, etc.)
- **ProgressCell** - Progress bars with percentage
- **DateCell** - Formatted dates (short, long, relative)
- **CurrencyCell** - Formatted currency values
- **BooleanCell** - Yes/No indicators
- **CopyableCell** - Click-to-copy text with icon

### Auto-Detection

Cell renderers are automatically applied based on field names:

```tsx
// These fields are auto-detected and rendered:
{
  status: "active",        // → StatusCell (colored badge)
  joinDate: "2024-01-15", // → DateCell (formatted date)
  salary: 75000,          // → CurrencyCell (formatted currency)
  isActive: true,         // → BooleanCell (Yes/No)
  id: "123",              // → CopyableCell (click to copy)
}
```

### Manual Usage

You can also use cell renderers manually in column definitions:

```tsx
import { StatusCell, ProgressCell, DateCell, CopyableCell, CurrencyCell, BooleanCell } from "luxtable";

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell value={row.getValue("status")} />,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => <ProgressCell value={row.getValue("progress")} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} format="long" />,
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => <CurrencyCell value={row.getValue("salary")} currency="USD" />,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <BooleanCell value={row.getValue("isActive")} />,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyableCell value={String(row.getValue("id"))} />,
  },
];
```

### Custom Cell Configuration

You can customize auto-detection behavior using `cellConfig`:

```tsx
<LuxTable
  data={data}
  cellConfig={{
    // Custom field configurations
    fields: {
      customStatus: { type: "status" },
      customDate: { type: "date", format: "long" },
    },
    // Custom auto-detection patterns
    patterns: {
      status: ["status", "state", "customStatus"],
      date: ["date", "createdAt", "customDate"],
    },
    // Default status colors
    defaultStatusColors: {
      active: { bg: "bg-green-100", text: "text-green-800" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    },
  }}
/>
```

## 🎯 Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination` | `boolean` | `false` | Enable/disable pagination |
| `pageSize` | `number` | `10` | Default rows per page |
| `sorting` | `boolean` | `true` | Enable/disable column sorting |
| `multiSort` | `boolean` | `true` | Enable multi-column sorting (Shift+Click) |
| `maxMultiSortColCount` | `number` | `undefined` | Maximum columns for multi-sort (unlimited by default) |
| `filtering` | `boolean` | `false` | Enable column-level filtering |
| `selection` | `"single" \| "multiple" \| "none"` | `"none"` | Row selection mode |
| `showSelectionCheckbox` | `boolean` | `true` | Show selection checkbox (when selection is enabled) |
| `showToolbar` | `boolean` | `false` | Show toolbar with search and column visibility |
| `showGlobalSearch` | `boolean` | `true` | Show global search in toolbar |
| `showColumnVisibility` | `boolean` | `true` | Show column visibility controls |

### Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TData[]` | Table data (required) |
| `columns` | `ColumnDef<TData>[]` | Column definitions (optional - auto-generated if not provided) |
| `options` | `LuxTableOptions` | Table options (see above) |
| `cellConfig` | `GlobalCellConfig` | Custom cell configuration for auto-detection |
| `sorting` | `SortingState` | Controlled sorting state |
| `onSortingChange` | `(sorting: SortingState) => void` | Called when sorting changes |
| `rowSelection` | `RowSelectionState` | Controlled row selection state |
| `onRowSelectionChange` | `(selection: RowSelectionState) => void` | Called when row selection changes |
| `onSelectedRowsChange` | `(rows: TData[]) => void` | Called when selected rows change (with row data) |
| `getRowId` | `(row: TData, index: number) => string` | Custom row ID function (default: uses "id" field or index) |
| `className` | `string` | Additional CSS classes |

## 🛠 Tech Stack

- **Core**: React & TanStack Table
- **Styling**: Tailwind CSS
- **Primitives**: Radix UI
- **Icons**: Lucide React

## 📖 Documentation

- **Usage Guide**: See [USAGE.md](./USAGE.md) for detailed setup and examples
- **Examples**: See [EXAMPLE.md](./EXAMPLE.md) for quick start guide
- **Full Documentation**: Visit [https://luxtable.dev/docs](https://luxtable.dev/docs) for complete API reference

## 💡 Why LuxTable?

Most data grids are either too lightweight for complex tasks or too bloated with legacy styles. LuxTable is built from the ground up to be **headless-first but styled-ready**. It provides the engine you need for heavy data work, wrapped in the minimalist aesthetic that modern users expect.

### Why shadcn Registry?

By using the shadcn registry approach instead of a traditional npm package:

- ✅ **Full Control** - Components are in your codebase, customize freely
- ✅ **No CSS Conflicts** - Uses your project's Tailwind configuration
- ✅ **Smaller Bundle** - Only include what you need
- ✅ **Easy Updates** - Re-run the add command to update
- ✅ **Matches Your Stack** - Works seamlessly with your existing shadcn/ui components

## 📄 License

MIT © [LuxTable](https://github.com/luxtable/luxtable)
