<div align="center">

# 💎 LuxTable

**Enterprise-Grade Data Management. Minimalist Aesthetics.**

[![npm version](https://img.shields.io/npm/v/luxtable.svg?style=flat-square)](https://www.npmjs.com/package/luxtable)
[![npm downloads](https://img.shields.io/npm/dm/luxtable.svg?style=flat-square)](https://www.npmjs.com/package/luxtable)
[![license](https://img.shields.io/npm/l/luxtable.svg?style=flat-square)](https://github.com/luxtable/luxtable/blob/main/LICENSE)

LuxTable is a high-performance, feature-rich data grid library designed specifically for the modern React ecosystem. It bridges the gap between complex data manipulation and the clean, modular philosophy of Shadcn UI.

[Documentation](https://luxtable.dev) · [NPM](https://www.npmjs.com/package/luxtable) · [GitHub](https://github.com/luxtable/luxtable)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **High Performance** | Built on TanStack Table for optimized rendering of large datasets |
| 🎨 **Shadcn-Native Design** | Crafted with Tailwind CSS and Radix UI primitives |
| 🔄 **Sorting** | Multi-column sorting with customizable sort icons |
| 🔍 **Filtering** | Column-based and global search filtering |
| 📄 **Pagination** | Built-in pagination with customizable page sizes |
| ☑️ **Row Selection** | Single and multi-row selection with checkboxes |
| 🛠️ **Toolbar** | Built-in toolbar with search and column visibility controls |
| 📱 **Cell Renderers** | Pre-built renderers for common data types |
| 🔒 **TypeScript** | First-class TypeScript support with full type safety |

---

## 📦 Installation

```bash
npm install luxtable
# or
yarn add luxtable
# or
pnpm add luxtable
```

### Peer Dependencies

LuxTable requires React 18 or higher:

```bash
npm install react react-dom
```

---

## 🚀 Quick Start

### Basic Usage

```tsx
import { LuxTable, createColumnHelper } from "luxtable";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("status", { header: "Status" }),
];

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
];

export default function App() {
  return <LuxTable data={data} columns={columns} />;
}
```

### With Options

```tsx
<LuxTable
  data={data}
  columns={columns}
  options={{
    pagination: true,
    pageSize: 10,
    sorting: true,
    filtering: true,
    selection: "multiple",
    showToolbar: true,
    showGlobalSearch: true,
    showColumnVisibility: true,
  }}
  onSelectedRowsChange={(rows) => console.log("Selected:", rows)}
/>
```

---

## 📱 Cell Renderers

LuxTable provides pre-built cell renderers for common data types:

### Status Cell

```tsx
import { StatusCell } from "luxtable";

columnHelper.accessor("status", {
  header: "Status",
  cell: (info) => (
    <StatusCell
      value={info.getValue()}
      variant={info.getValue() === "active" ? "success" : "destructive"}
    />
  ),
});
```

### Date Cell

```tsx
import { DateCell } from "luxtable";

columnHelper.accessor("createdAt", {
  header: "Created At",
  cell: (info) => <DateCell value={info.getValue()} format="short" />,
});
```

### Currency Cell

```tsx
import { CurrencyCell } from "luxtable";

columnHelper.accessor("price", {
  header: "Price",
  cell: (info) => <CurrencyCell value={info.getValue()} currency="USD" />,
});
```

### Progress Cell

```tsx
import { ProgressCell } from "luxtable";

columnHelper.accessor("progress", {
  header: "Progress",
  cell: (info) => <ProgressCell value={info.getValue()} />,
});
```

### Boolean Cell

```tsx
import { BooleanCell } from "luxtable";

columnHelper.accessor("isVerified", {
  header: "Verified",
  cell: (info) => <BooleanCell value={info.getValue()} />,
});
```

### Copyable Cell

```tsx
import { CopyableCell } from "luxtable";

columnHelper.accessor("apiKey", {
  header: "API Key",
  cell: (info) => <CopyableCell value={info.getValue()} />,
});
```

---

## ⚙️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Rows per page |
| `sorting` | `boolean` | `true` | Enable sorting |
| `filtering` | `boolean` | `false` | Enable column filtering |
| `selection` | `"single" \| "multiple" \| "none"` | `"none"` | Row selection mode |
| `showSelectionCheckbox` | `boolean` | `true` | Show selection checkboxes |
| `showToolbar` | `boolean` | `false` | Show toolbar |
| `showGlobalSearch` | `boolean` | `true` | Show global search in toolbar |
| `showColumnVisibility` | `boolean` | `true` | Show column visibility toggle |

---

## 🎛️ Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TData[]` | Table data |
| `columns` | `ColumnDef<TData>[]` | Column definitions |
| `options` | `LuxTableOptions` | Table options |
| `className` | `string` | Additional CSS classes |
| `sorting` | `SortingState` | Controlled sorting state |
| `onSortingChange` | `(sorting: SortingState) => void` | Sorting change callback |
| `rowSelection` | `RowSelectionState` | Controlled row selection state |
| `onRowSelectionChange` | `(state: RowSelectionState) => void` | Row selection change callback |
| `onSelectedRowsChange` | `(rows: TData[]) => void` | Selected rows change callback |
| `getRowId` | `(row: TData, index: number) => string` | Custom row ID getter |

---

## 🛠 Tech Stack

- **Core**: React 18+ & [TanStack Table](https://tanstack.com/table)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Primitives**: [Radix UI](https://www.radix-ui.com)
- **Icons**: [Lucide React](https://lucide.dev)

---

## 📄 License

MIT © LuxTable

---

<div align="center">

**Built with ❤️ for the React ecosystem**

</div>
