import { useState, useEffect } from 'react';
import { LuxTable } from 'luxtable';
import './App.css';

// Tema sınıfını html üzerinde senkronize et (light/dark)
function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);
  return [isDark, () => setIsDark((d) => !d)] as const;
}

// Sample data type
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
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Developer', status: 'active', joinDate: '2024-02-20', salary: 65000 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Designer', status: 'inactive', joinDate: '2023-11-10', salary: 55000 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'active', joinDate: '2023-08-05', salary: 85000 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Developer', status: 'pending', joinDate: '2024-03-01', salary: 60000 },
  { id: 6, name: 'Diana Ross', email: 'diana@example.com', role: 'HR', status: 'active', joinDate: '2023-06-15', salary: 58000 },
  { id: 7, name: 'Edward Lee', email: 'edward@example.com', role: 'Developer', status: 'active', joinDate: '2024-01-28', salary: 70000 },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'Designer', status: 'inactive', joinDate: '2023-09-12', salary: 52000 },
  { id: 9, name: 'George White', email: 'george@example.com', role: 'Manager', status: 'active', joinDate: '2022-12-01', salary: 90000 },
  { id: 10, name: 'Hannah Black', email: 'hannah@example.com', role: 'Developer', status: 'pending', joinDate: '2024-03-15', salary: 62000 },
];

// Tree + Expandable row demo: recursive subRows
interface TreeNode {
  id: string;
  name: string;
  role: string;
  status: string;
  subRows?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    id: 't1',
    name: 'Engineering',
    role: 'Department',
    status: 'active',
    subRows: [
      {
        id: 't1-1',
        name: 'Frontend Team',
        role: 'Team',
        status: 'active',
        subRows: [
          { id: 't1-1-1', name: 'Alice', role: 'Developer', status: 'active', subRows: undefined },
          { id: 't1-1-2', name: 'Bob', role: 'Developer', status: 'active', subRows: undefined },
        ],
      },
      {
        id: 't1-2',
        name: 'Backend Team',
        role: 'Team',
        status: 'active',
        subRows: [
          { id: 't1-2-1', name: 'Charlie', role: 'Developer', status: 'active', subRows: undefined },
        ],
      },
    ],
  },
  {
    id: 't2',
    name: 'Product',
    role: 'Department',
    status: 'active',
    subRows: [
      { id: 't2-1', name: 'Design', role: 'Team', status: 'active', subRows: undefined },
      { id: 't2-2', name: 'PM', role: 'Team', status: 'active', subRows: undefined },
    ],
  },
];

function App() {
  const [isDark, toggleTheme] = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🚀 LuxTable Demo
            </h1>
            <p className="text-muted-foreground">
              Enterprise-Grade Data Management. Minimalist Aesthetics.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ✨ Otomatik column oluşturma + Default Cell Config (field isimlerine göre otomatik algılama - hiç config gerekmez!)
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
          >
            {isDark ? '☀️ Light tema' : '🌙 Dark tema'}
          </button>
        </div>

        <div className="bg-card backdrop-blur-sm rounded-xl border border-border overflow-hidden shadow-2xl mb-8">
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

        <h2 className="text-2xl font-semibold mb-4">Tree + Expandable Row (Hiyerarşi + Detay)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sol chevron ile dalları aç/kapa; Detay sütunundaki ok ile satır altında özel bileşen açılır.
        </p>
        <div className="bg-card backdrop-blur-sm rounded-xl border border-border overflow-hidden shadow-2xl">
          <LuxTable<TreeNode>
            data={treeData}
            getSubRows={(row) => row.subRows}
            renderSubComponent={(row) => (
              <div className="p-4 bg-muted/30 border-t border-border text-sm">
                <p className="font-medium">{row.original.name}</p>
                <p className="text-muted-foreground">Role: {row.original.role} · Status: {row.original.status}</p>
                <p className="text-muted-foreground mt-2">ID: {row.original.id}</p>
              </div>
            )}
            options={{
              pagination: false,
              filtering: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
