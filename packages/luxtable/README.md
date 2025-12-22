💎 LuxTable
Enterprise-Grade Data Management. Minimalist Aesthetics.
LuxTable is a high-performance, feature-rich data grid library designed specifically for the modern React ecosystem. It bridges the gap between complex data manipulation and the clean, modular philosophy of Shadcn UI. Built for developers who refuse to choose between power and beauty.

✨ Key Features
⚡ High-Velocity Performance: Optimized virtualization engine capable of rendering massive datasets with 60fps fluidity.

🎨 Shadcn-Native Design: Crafted with Tailwind CSS and Radix UI primitives. It doesn't just look like Shadcn; it feels like it.

🛠 Declarative API: A developer-friendly interface that makes complex features like grouping, pivoting, and column reordering intuitive.

🔒 Type-Safe Excellence: First-class TypeScript support ensures your data remains consistent and your DX remains seamless.

🖱 Advanced Interaction: Out-of-the-box support for cell editing, multi-column sorting, advanced filtering, and drag-and-drop.

📱 Fully Responsive: Adaptive layouts that transition gracefully from ultra-wide monitors to mobile screens.

🚀 Quick Start
Installation
Bash

npm install luxtable
Basic Usage
TypeScript

import { LuxTable } from "luxtable";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name", sortable: true },
  { accessorKey: "role", header: "Role", filterable: true },
];

export default function App() {
  return (
    <LuxTable 
      data={users} 
      columns={columns} 
      options={{
        pagination: true,
        selection: "multiple",
      }}
    />
  );
}
💡 Why LuxTable?
Most data grids are either too lightweight for complex tasks or too bloated with legacy styles. LuxTable is built from the ground up to be headless-first but styled-ready. It provides the engine you need for heavy data work, wrapped in the minimalist aesthetic that modern users expect.

🛠 Tech Stack
Core: React & TanStack Table (Logical Layer)

Styling: Tailwind CSS

Primitives: Radix UI

Icons: Lucide React


