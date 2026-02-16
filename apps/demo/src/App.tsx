import { LuxTable } from 'luxtable';
import './App.css';

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

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 LuxTable Demo
          </h1>
          <p className="text-gray-400">
            Enterprise-Grade Data Management. Minimalist Aesthetics.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ✨ Otomatik column oluşturma + Default Cell Config (field isimlerine göre otomatik algılama - hiç config gerekmez!)
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
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
      </div>
    </div>
  );
}

export default App;
