# 💎 LuxTable

**Enterprise-Grade Data Management. Minimalist Aesthetics.**

[![npm version](https://img.shields.io/npm/v/luxtable.svg)](https://www.npmjs.com/package/luxtable)
[![npm downloads](https://img.shields.io/npm/dm/luxtable.svg)](https://www.npmjs.com/package/luxtable)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

LuxTable is a high-performance, feature-rich data grid library designed specifically for the modern React ecosystem. It bridges the gap between complex data manipulation and the clean, modular philosophy of Shadcn UI. Built for developers who refuse to choose between power and beauty.

## ✨ Key Features

- ⚡ **High-Velocity Performance** - Optimized rendering engine capable of handling massive datasets with 60fps fluidity
- 🎨 **Shadcn-Native Design** - Crafted with Tailwind CSS and Radix UI primitives
- 🔍 **Advanced Filtering** - Column-level filters with multiple filter types (text, number, select)
- 🔄 **Smart Sorting** - Multi-column sorting with intuitive click interactions
- ✅ **Row Selection** - Single and multi-select with checkbox support
- 📄 **Pagination** - Built-in pagination with customizable page sizes
- 🛠️ **Column Actions** - Hide/show columns, sorting controls in a unified dropdown
- 🔎 **Global Search** - Search across all columns instantly
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

```tsx
import { LuxTable } from "@/components/lux-table/lux-table";
import { ColumnDef } from "@tanstack/react-table";

type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
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

LuxTable comes with built-in cell renderers for common use cases:

```tsx
import { StatusCell, ProgressCell, DateCell, CopyableCell } from "@/components/lux-table/cell-renderers";

// Status badges
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => <StatusCell value={row.getValue("status")} />,
}

// Progress bars
{
  accessorKey: "progress",
  header: "Progress",
  cell: ({ row }) => <ProgressCell value={row.getValue("progress")} />,
}

// Formatted dates
{
  accessorKey: "createdAt",
  header: "Created",
  cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
}

// Copy to clipboard
{
  accessorKey: "id",
  header: "ID",
  cell: ({ row }) => <CopyableCell value={row.getValue("id")} />,
}
```

## 🎯 Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination` | `boolean` | `false` | Enable/disable pagination |
| `pageSize` | `number` | `10` | Default rows per page |
| `filtering` | `boolean` | `false` | Enable column-level filtering |
| `selection` | `"single" \| "multiple" \| "none"` | `"none"` | Row selection mode |
| `showToolbar` | `boolean` | `false` | Show toolbar with search and column visibility |
| `showGlobalSearch` | `boolean` | `true` | Show global search in toolbar |
| `showColumnVisibility` | `boolean` | `true` | Show column visibility controls |

## 🛠 Tech Stack

- **Core**: React & TanStack Table
- **Styling**: Tailwind CSS
- **Primitives**: Radix UI
- **Icons**: Lucide React

## 📖 Documentation

Visit our [documentation](https://luxtable.dev/docs) for detailed guides and examples.

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
