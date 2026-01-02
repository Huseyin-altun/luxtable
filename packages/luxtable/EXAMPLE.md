# 🚀 LuxTable - Quick Start Guide

This guide shows you how to install and use LuxTable with the shadcn CLI.

## Prerequisites

Before installing LuxTable, make sure you have:

- **Node.js** 18+ installed
- **A Next.js project** (or any React project with Tailwind CSS)
- **shadcn/ui** initialized in your project

---

## Step 1: Create a New Next.js Project (Optional)

If you don't have a project yet:

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
```

---

## Step 2: Initialize shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

When prompted, select your preferences:
- Style: **New York** (recommended)
- Base color: **Slate** (or your preference)
- CSS variables: **Yes**

---

## Step 3: Install LuxTable

### Option A: Using unpkg CDN (Recommended)

```bash
# Install the main LuxTable component
pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table.json"
```

This command will:
- ✅ Install required dependencies (`@tanstack/react-table`, `lucide-react`, etc.)
- ✅ Install required shadcn/ui components (button, checkbox, dropdown-menu, input, select)
- ✅ Copy LuxTable files to your `components/` folder

### Option B: Install additional components (Optional)

```bash
# Cell renderers for status badges, progress bars, dates, etc.
pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table-cell-renderers.json"

# Column helper for type-safe column definitions
pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table-column-helper.json"
```

---

## Step 4: Create Your First Table

Create a new file `app/page.tsx` (or modify the existing one):

```tsx
"use client";

import { LuxTable } from "@/components/lux-table/lux-table";
import { ColumnDef } from "@tanstack/react-table";

// 1. Define your data type
type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  createdAt: string;
};

// 2. Define your columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
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
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        pending: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
];

// 3. Sample data
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", role: "Admin", createdAt: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active", role: "User", createdAt: "2024-02-20" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "inactive", role: "User", createdAt: "2024-03-10" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", status: "pending", role: "Moderator", createdAt: "2024-04-05" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", status: "active", role: "User", createdAt: "2024-05-12" },
  { id: 6, name: "Diana Miller", email: "diana@example.com", status: "active", role: "Admin", createdAt: "2024-06-01" },
  { id: 7, name: "Edward Davis", email: "edward@example.com", status: "inactive", role: "User", createdAt: "2024-07-18" },
  { id: 8, name: "Fiona Garcia", email: "fiona@example.com", status: "pending", role: "User", createdAt: "2024-08-25" },
  { id: 9, name: "George Martinez", email: "george@example.com", status: "active", role: "Moderator", createdAt: "2024-09-30" },
  { id: 10, name: "Hannah Anderson", email: "hannah@example.com", status: "active", role: "User", createdAt: "2024-10-14" },
  { id: 11, name: "Ivan Thomas", email: "ivan@example.com", status: "inactive", role: "User", createdAt: "2024-11-22" },
  { id: 12, name: "Julia Jackson", email: "julia@example.com", status: "active", role: "Admin", createdAt: "2024-12-01" },
];

// 4. Render the table
export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      <LuxTable
        data={users}
        columns={columns}
        options={{
          pagination: true,
          pageSize: 5,
          filtering: true,
          selection: "multiple",
          showToolbar: true,
          showGlobalSearch: true,
          showColumnVisibility: true,
        }}
        onSelectedRowsChange={(selectedRows) => {
          console.log("Selected:", selectedRows);
        }}
      />
    </div>
  );
}
```

---

## Step 5: Run Your App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your table!

---

## 🎨 Features Demonstrated

The example above showcases:

| Feature | How to Enable |
|---------|---------------|
| **Pagination** | `options={{ pagination: true }}` |
| **Column Filtering** | `options={{ filtering: true }}` |
| **Global Search** | `options={{ showToolbar: true, showGlobalSearch: true }}` |
| **Row Selection** | `options={{ selection: "multiple" }}` |
| **Column Visibility** | `options={{ showColumnVisibility: true }}` |
| **Custom Cell Rendering** | Use `cell` property in column definition |

---

## 📁 Project Structure After Installation

```
my-app/
├── components/
│   ├── lux-table/
│   │   ├── lux-table.tsx        # Main table component
│   │   ├── types.ts             # TypeScript types
│   │   ├── column-filter.tsx    # Column filter component
│   │   ├── column-header.tsx    # Column header with actions
│   │   ├── pagination.tsx       # Pagination controls
│   │   └── table-toolbar.tsx    # Toolbar with search
│   ├── table/
│   │   └── table.tsx            # Base table primitives
│   └── ui/
│       ├── button.tsx           # shadcn button
│       ├── checkbox.tsx         # shadcn checkbox
│       ├── dropdown-menu.tsx    # shadcn dropdown
│       ├── input.tsx            # shadcn input
│       └── select.tsx           # shadcn select
├── lib/
│   └── utils.ts                 # cn() utility function
└── app/
    └── page.tsx                 # Your page with LuxTable
```

---

## 🔧 Advanced Usage

### Using Cell Renderers

If you installed `lux-table-cell-renderers`:

```tsx
import { StatusCell, ProgressCell, DateCell, CopyableCell } from "@/components/lux-table/cell-renderers";

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
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyableCell value={row.getValue("id")} />,
  },
];
```

### Controlled Sorting

```tsx
import { useState } from "react";
import { SortingState } from "@tanstack/react-table";

export default function Page() {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <LuxTable
      data={data}
      columns={columns}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
```

### Controlled Row Selection

```tsx
import { useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";

export default function Page() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <LuxTable
      data={data}
      columns={columns}
      options={{ selection: "multiple" }}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
}
```

---

## 📚 Full Documentation

For more examples and API reference, visit: [https://luxtable.dev/docs](https://luxtable.dev/docs)

---

## 🆘 Troubleshooting

### "Module not found" errors

Make sure you have the required path aliases in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Styles not applied

Ensure Tailwind is scanning your components:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
};
```

---

## 💡 Need Help?

- GitHub Issues: [github.com/luxtable/luxtable/issues](https://github.com/luxtable/luxtable/issues)
- Documentation: [luxtable.dev/docs](https://luxtable.dev/docs)

Happy coding! 🎉
