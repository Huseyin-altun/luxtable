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

LuxTable uses a comprehensive CSS variable system that works seamlessly in both light and dark modes. Import the variables file in your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import LuxTable CSS Variables */
@import 'luxtable/src/styles/variables.css';
```

Or if you're using a monorepo structure:

```css
@import '../../packages/luxtable/src/styles/variables.css';
```

#### Customizing Colors

All LuxTable colors use CSS variables with HSL format, making them easy to override. Simply override the variables in your CSS:

```css
@layer base {
  :root {
    /* Override table colors */
    --lux-table-background: 0 0% 100%;
    --lux-table-foreground: 222 47% 11%;
    --lux-table-border: 214 32% 91%;
    
    /* Override status colors */
    --lux-status-active-bg: 142 76% 36%;
    --lux-status-active-text: 0 0% 100%;
    
    /* Override primary accent */
    --lux-focus-ring: 221 83% 53%;
  }

  .dark {
    /* Override dark mode colors */
    --lux-table-background: 222 47% 11%;
    --lux-table-foreground: 210 40% 98%;
    --lux-table-border: 217 33% 18%;
  }
}
```

#### Available CSS Variables

LuxTable provides variables for all components:

- **Table**: `--lux-table-*` (background, foreground, border, etc.)
- **Toolbar**: `--lux-toolbar-*` (background, border, input colors, etc.)
- **Pagination**: `--lux-pagination-*` (background, active, hover, etc.)
- **Status**: `--lux-status-*` (active, inactive, pending, completed, cancelled)
- **Selection**: `--lux-selection-*` (background, foreground, border)
- **Progress**: `--lux-progress-*` (background, bar, text)
- **Boolean**: `--lux-boolean-*` (true, false colors)
- **Filter**: `--lux-filter-*` (background, border, foreground)
- **Focus**: `--lux-focus-ring` (focus ring color)

All variables automatically adapt to light/dark mode when you use the `.dark` class.

---

## 📝 Basic Usage

### Zero-Config: Auto-Generated Columns (Recommended)

LuxTable can automatically generate columns from your data - no column definitions needed! Cell types are also auto-detected based on field names.

```tsx
// src/App.tsx
import { LuxTable } from 'luxtable';

// Define your data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  salary: number;
}

// Sample data
const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-15', salary: 75000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joinDate: '2024-02-20', salary: 65000 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive', joinDate: '2023-11-10', salary: 55000 },
];

function App() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <LuxTable
        data={data}
        options={{
          sorting: true,
          multiSort: true,  // Shift+Click to sort by multiple columns
          filtering: true,
          pagination: true,
          pageSize: 10,
          selection: "multiple",
          showToolbar: true,
          showGlobalSearch: true,
          showColumnVisibility: true,
        }}
      />
    </div>
  );
}

export default App;
```

**What happens automatically:**
- ✅ Columns are auto-generated from data keys
- ✅ Headers are auto-formatted (camelCase → Title Case)
- ✅ `status` → StatusCell (colored badges)
- ✅ `joinDate` → DateCell (formatted dates)
- ✅ `salary` → CurrencyCell (formatted currency)
- ✅ `id`, `email` → CopyableCell (click to copy)

### Manual Column Definitions

You can also define columns manually for full control:

```tsx
// src/App.tsx
import { LuxTable, createColumnHelper } from 'luxtable';

// Define your data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

// Sample data
const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive' },
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
        options={{
          sorting: true,
          pagination: true,
        }}
      />
    </div>
  );
}

export default App;
```

---

## ✨ Advanced Features

### Auto Cell Detection

LuxTable automatically detects and renders cell types based on field names. No configuration needed!

```tsx
import { LuxTable } from 'luxtable';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  progress: number;
  taskId: string;
  isActive: boolean;
  price: number;
}

const data: Task[] = [
  { 
    id: 1, 
    title: 'Complete documentation', 
    status: 'in-progress',
    dueDate: '2024-01-15',
    progress: 65,
    taskId: 'TASK-001',
    isActive: true,
    price: 99.99
  },
  // ...more data
];

function App() {
  return (
    <LuxTable
      data={data}
      options={{
        sorting: true,
        pagination: true,
        filtering: true,
        showToolbar: true,
        showGlobalSearch: true,
      }}
    />
  );
}
```

**Auto-detected fields:**
- `status` → StatusCell (colored badge)
- `dueDate` → DateCell (formatted date)
- `taskId`, `id` → CopyableCell (click to copy)
- `isActive` → BooleanCell (Yes/No)
- `price` → CurrencyCell (formatted currency)
- `progress` → Can be configured as ProgressCell

### Manual Cell Renderers

You can also use cell renderers manually in column definitions:

```tsx
import { 
  LuxTable, 
  createColumnHelper,
  StatusCell,
  DateCell,
  CopyableCell,
  ProgressCell,
  CurrencyCell,
  BooleanCell
} from 'luxtable';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  progress: number;
  taskId: string;
  isActive: boolean;
  price: number;
}

const data: Task[] = [
  { 
    id: 1, 
    title: 'Complete documentation', 
    status: 'in-progress',
    dueDate: '2024-01-15',
    progress: 65,
    taskId: 'TASK-001',
    isActive: true,
    price: 99.99
  },
  // ...more data
];

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor('taskId', {
    header: 'Task ID',
    cell: (info) => <CopyableCell value={String(info.getValue())} />,
  }),
  columnHelper.accessor('title', {
    header: 'Title',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <StatusCell 
        value={String(info.getValue())}
        colors={{
          'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
          'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
          'completed': { bg: 'bg-green-100', text: 'text-green-800' },
        }}
      />
    ),
  }),
  columnHelper.accessor('dueDate', {
    header: 'Due Date',
    cell: (info) => <DateCell value={info.getValue() as string} format="long" />,
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    cell: (info) => <ProgressCell value={Number(info.getValue())} showLabel />,
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => <CurrencyCell value={Number(info.getValue())} currency="USD" />,
  }),
  columnHelper.accessor('isActive', {
    header: 'Active',
    cell: (info) => <BooleanCell value={Boolean(info.getValue())} />,
  }),
];

function App() {
  return (
    <LuxTable
      data={data}
      columns={columns}
      options={{
        sorting: true,
        pagination: true,
        filtering: true,
        showToolbar: true,
        showGlobalSearch: true,
      }}
    />
  );
}
```

### Custom Cell Configuration

You can customize auto-detection behavior:

```tsx
<LuxTable
  data={data}
  cellConfig={{
    // Custom field configurations
    fields: {
      customStatus: { type: "status" },
      customDate: { type: "date", format: "long" },
      progress: { type: "progress", showLabel: true },
    },
    // Custom auto-detection patterns
    patterns: {
      status: ["status", "state", "customStatus"],
      date: ["date", "createdAt", "customDate"],
      currency: ["price", "amount", "cost"],
    },
    // Default status colors
    defaultStatusColors: {
      active: { bg: "bg-green-100", text: "text-green-800" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    },
    // Disable auto-detection if needed
    autoDetect: true, // default: true
  }}
/>
```

### With Row Selection

```tsx
import { useState } from 'react';
import { LuxTable, RowSelectionState } from 'luxtable';

function App() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleSelectedRowsChange = (selectedRows: typeof data) => {
    console.log('Selected rows:', selectedRows);
    // Do something with selected rows
  };

  const handleBulkDelete = () => {
    const selectedRows = data.filter((_, index) => rowSelection[index]);
    console.log('Deleting:', selectedRows);
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
        options={{
          selection: "multiple", // or "single" or "none"
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onSelectedRowsChange={handleSelectedRowsChange}
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
  options={{
    // Toolbar options
    showToolbar: true,              // Show the toolbar
    showGlobalSearch: true,          // Enable global search input
    showColumnVisibility: true,      // Enable column visibility toggle
    
    // Filtering & Sorting
    sorting: true,                   // Enable column sorting
    multiSort: true,                 // Enable multi-column sorting (Shift+Click)
    filtering: true,                 // Enable column-level filters
    
    // Pagination
    pagination: true,                // Enable pagination
    pageSize: 10,                    // Default page size
    
    // Row Selection
    selection: "multiple",           // "single" | "multiple" | "none"
    showSelectionCheckbox: true,     // Show selection checkbox
  }}
/>
```

---

## 🔧 Full Configuration Options

```tsx
interface LuxTableProps<TData> {
  // Required
  data: TData[];
  
  // Optional
  columns?: ColumnDef<TData, any>[];  // Auto-generated if not provided
  className?: string;
  
  // Options
  options?: {
    pagination?: boolean;              // Default: false
    pageSize?: number;                 // Default: 10
    sorting?: boolean;                 // Default: true
    multiSort?: boolean;               // Default: true
    maxMultiSortColCount?: number;     // Default: undefined (unlimited)
    filtering?: boolean;               // Default: false
    selection?: "single" | "multiple" | "none";  // Default: "none"
    showSelectionCheckbox?: boolean;   // Default: true (when selection enabled)
    showToolbar?: boolean;             // Default: false
    showGlobalSearch?: boolean;        // Default: true
    showColumnVisibility?: boolean;    // Default: true
  };
  
  // Cell Configuration
  cellConfig?: GlobalCellConfig;      // Custom cell auto-detection config
  
  // Controlled State
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  onSelectedRowsChange?: (rows: TData[]) => void;
  
  // Utilities
  getRowId?: (row: TData, index: number) => string;  // Default: uses "id" field or index
}
```

---

## 📚 Available Cell Renderers

| Renderer | Description | Props |
|----------|-------------|-------|
| `StatusCell` | Displays status badges with colors | `value`, `colors`, `className` |
| `DateCell` | Formats date values | `value`, `format` ("short" \| "long" \| "relative"), `locale` |
| `CopyableCell` | Copyable text with icon | `value`, `tooltip`, `alwaysShowIcon`, `onCopy`, `className` |
| `ProgressCell` | Progress bar visualization | `value`, `showLabel`, `barColor`, `className` |
| `CurrencyCell` | Formatted currency values | `value`, `currency`, `locale` |
| `BooleanCell` | Yes/No indicators | `value`, `trueLabel`, `falseLabel`, `trueColor`, `falseColor` |

### Auto-Detection Patterns

Cell renderers are automatically applied based on field names:

- **Status**: `status`, `state`, `stage`, `phase`
- **Date**: `date`, `createdAt`, `updatedAt`, `joinDate`, `startDate`, `endDate`, `birthDate`, `publishedAt`
- **Currency**: `price`, `amount`, `salary`, `cost`, `revenue`, `total`, `balance`, `fee`
- **Boolean**: `isActive`, `isVerified`, `isEnabled`, `isDeleted`, `isPublished`, `isPublic`
- **Copyable**: `id`, `email`, `phone`, `code`, `token`, `reference`, `orderId`

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

// Option 1: Zero-config (auto-generated columns)
function App() {
  return (
    <LuxTable
      data={data}
      options={{
        pagination: true,
        sorting: true,
        filtering: true,
        showToolbar: true,
      }}
    />
  );
}

// Option 2: Manual column definitions
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
- **GitHub**: [https://github.com/Huseyin-altun/luxtable](https://github.com/Huseyin-altun/luxtable)
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
