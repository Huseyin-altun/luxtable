# LuxTable Usage Guide

## 🚀 Getting Started with Vite + React + TypeScript

This guide will walk you through setting up LuxTable in a new or existing Vite + React + TypeScript project.

---

## 📦 Installation

### Option 1: New Project Setup

```bash
# Create a new Vite project with React and TypeScript
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install dependencies
npm install

# Install LuxTable
npm install luxtable

# Install TailwindCSS (required for styling)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Option 2: Existing Project

```bash
# Install LuxTable
npm install luxtable
# or
pnpm add luxtable
# or
yarn add luxtable
```

---

## ⚙️ Configuration

### 1. Configure TailwindCSS

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include LuxTable components
    "./node_modules/luxtable/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### 2. Add CSS Variables

Add the following to your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 📝 Basic Usage

### Simple Table Example

```tsx
// src/App.tsx
import { LuxTable, createColumnHelper } from 'luxtable';

// Define your data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

// Sample data
const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
];

// Create column helper
const columnHelper = createColumnHelper<User>();

// Define columns
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 80,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('role', {
    header: 'Role',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
];

function App() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <LuxTable
        data={data}
        columns={columns}
        enableSorting
        enablePagination
      />
    </div>
  );
}

export default App;
```

---

## ✨ Advanced Features

### With Cell Renderers

```tsx
import { 
  LuxTable, 
  createColumnHelper,
  StatusCell,
  DateCell,
  CopyableCell,
  ProgressCell 
} from 'luxtable';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  progress: number;
  taskId: string;
}

const data: Task[] = [
  { 
    id: 1, 
    title: 'Complete documentation', 
    status: 'in-progress',
    dueDate: '2024-01-15',
    progress: 65,
    taskId: 'TASK-001'
  },
  // ...more data
];

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor('taskId', {
    header: 'Task ID',
    cell: (info) => <CopyableCell value={info.getValue()} />,
  }),
  columnHelper.accessor('title', {
    header: 'Title',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <StatusCell 
        value={info.getValue()} 
        colorMap={{
          'pending': '#f59e0b',
          'in-progress': '#3b82f6',
          'completed': '#10b981',
        }}
        labelMap={{
          'pending': 'Pending',
          'in-progress': 'In Progress',
          'completed': 'Completed',
        }}
      />
    ),
  }),
  columnHelper.accessor('dueDate', {
    header: 'Due Date',
    cell: (info) => <DateCell value={info.getValue()} format="long" />,
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    cell: (info) => <ProgressCell value={info.getValue()} />,
  }),
];

function App() {
  return (
    <LuxTable
      data={data}
      columns={columns}
      enableSorting
      enablePagination
      enableColumnFilters
      showToolbar
      showGlobalSearch
    />
  );
}
```

### With Row Selection

```tsx
import { useState } from 'react';
import { LuxTable, createColumnHelper, RowSelectionState } from 'luxtable';

function App() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleSelectionChange = (selection: RowSelectionState) => {
    setRowSelection(selection);
    console.log('Selected rows:', Object.keys(selection));
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(index => data[parseInt(index)].id);
    console.log('Deleting:', selectedIds);
  };

  return (
    <div>
      {Object.keys(rowSelection).length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <span>{Object.keys(rowSelection).length} rows selected</span>
          <button onClick={handleBulkDelete} className="ml-4 text-red-600">
            Delete Selected
          </button>
        </div>
      )}
      
      <LuxTable
        data={data}
        columns={columns}
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
```

### With Row Actions

```tsx
import { LuxTable, createColumnHelper } from 'luxtable';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';

const columnHelper = createColumnHelper<User>();

const columns = [
  // ...other columns
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleEdit(row.original)}
          className="p-1 hover:bg-muted rounded"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          onClick={() => handleDelete(row.original.id)}
          className="p-1 hover:bg-destructive/10 rounded text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }),
];
```

---

## 🎨 Toolbar Features

```tsx
<LuxTable
  data={data}
  columns={columns}
  // Toolbar options
  showToolbar              // Show the toolbar
  showGlobalSearch         // Enable global search input
  showColumnVisibility     // Enable column visibility toggle
  showFilterToggle         // Enable filter toggle button
  
  // Filtering & Sorting
  enableSorting            // Enable column sorting
  enableColumnFilters      // Enable column-level filters
  
  // Pagination
  enablePagination         // Enable pagination
  pageSize={10}            // Default page size
  pageSizeOptions={[10, 20, 50, 100]}
  
  // Row Selection
  enableRowSelection       // Enable row selection with checkboxes
/>
```

---

## 🔧 Full Configuration Options

```tsx
interface LuxTableProps<T> {
  // Required
  data: T[];
  columns: ColumnDef<T>[];
  
  // Sorting
  enableSorting?: boolean;
  defaultSort?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  
  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Filtering
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  
  // Row Selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  
  // Toolbar
  showToolbar?: boolean;
  showGlobalSearch?: boolean;
  showColumnVisibility?: boolean;
  showFilterToggle?: boolean;
  
  // Styling
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: Row<T>) => string);
  cellClassName?: string;
}
```

---

## 📚 Available Cell Renderers

| Renderer | Description | Props |
|----------|-------------|-------|
| `StatusCell` | Displays status badges with colors | `value`, `colorMap`, `labelMap` |
| `DateCell` | Formats date values | `value`, `format`, `locale` |
| `CopyableCell` | Copyable text with icon | `value` |
| `ProgressCell` | Progress bar visualization | `value`, `showLabel`, `color` |

---

## 🌐 shadcn/ui Registry Installation (Alternative Method)

If you're using shadcn/ui in your project, you can install LuxTable components directly via the shadcn CLI. This method copies the source files directly into your project.

### Prerequisites

Before using shadcn CLI, make sure you have:

1. **A shadcn/ui project** - Initialize with:
   ```bash
   npx shadcn@latest init
   ```

2. **Required shadcn components** - LuxTable depends on these:
   ```bash
   npx shadcn@latest add button checkbox dropdown-menu input select
   ```

### Step 1: Install the Main LuxTable Component

```bash
# Using npx
npx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table.json"

# Using pnpm
pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table.json"
```

This will install:
- `components/lux-table/lux-table.tsx` - Main table component
- `components/lux-table/types.ts` - TypeScript types
- `components/lux-table/column-filter.tsx` - Column filter component
- `components/lux-table/column-header.tsx` - Column header with actions
- `components/lux-table/pagination.tsx` - Pagination component
- `components/lux-table/table-toolbar.tsx` - Toolbar component
- `components/table/table.tsx` - Base table primitives

### Step 2: Install Column Helper (Recommended)

```bash
npx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table-column-helper.json"
```

This will install:
- `lib/column-helper.tsx` - Type-safe column definition helper

### Step 3: Install Cell Renderers (Optional)

```bash
npx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table-cell-renderers.json"
```

This will install:
- `components/lux-table/cell-renderers/status-cell.tsx`
- `components/lux-table/cell-renderers/progress-cell.tsx`
- `components/lux-table/cell-renderers/date-cell.tsx`
- `components/lux-table/cell-renderers/copyable-cell.tsx`
- `components/lux-table/cell-renderers/currency-cell.tsx`
- `components/lux-table/cell-renderers/boolean-cell.tsx`

### Step 4: Install Dependencies

After installing via shadcn CLI, install the required npm dependencies:

```bash
npm install @tanstack/react-table lucide-react clsx tailwind-merge
```

### Step 5: Usage with shadcn Installation

```tsx
// Import from your local components
import { LuxTable } from "@/components/lux-table/lux-table";
import { createColumnHelper } from "@/lib/column-helper";
import { StatusCell } from "@/components/lux-table/cell-renderers/status-cell";

// Define columns and use as normal
const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('status', { 
    header: 'Status',
    cell: (info) => <StatusCell value={info.getValue()} />
  }),
];

function App() {
  return (
    <LuxTable
      data={data}
      columns={columns}
      options={{
        pagination: true,
        sorting: true,
        showToolbar: true,
      }}
    />
  );
}
```

### npm vs shadcn CLI - When to Use Which?

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **npm install** | Quick setup, updates | Easy updates, smaller bundle | Less customization |
| **shadcn CLI** | Full customization | Full source access, can modify | Manual updates needed |

---

## 📖 More Examples

For more detailed examples and full API documentation, visit:
- **Documentation**: [https://luxtable.dev](https://luxtable.dev)
- **GitHub**: [https://github.com/luxtable/luxtable](https://github.com/luxtable/luxtable)
- **npm**: [https://www.npmjs.com/package/luxtable](https://www.npmjs.com/package/luxtable)

---

## 🆘 Troubleshooting

### Common Issues

**1. Styles not applied**
Make sure you've:
- Added LuxTable to your Tailwind content array
- Imported your CSS file with Tailwind directives
- Added the CSS variables to your stylesheet

**2. TypeScript errors**
Ensure you're using `createColumnHelper<YourType>()` with the correct generic type.

**3. Module not found**
Try clearing your node_modules and reinstalling:
```bash
rm -rf node_modules
npm install
```

---

## 📄 License

MIT © LuxTable
