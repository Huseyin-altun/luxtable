"use client";

import * as React from "react";
import {
    LuxTable,
    createColumnHelper,
    StatusCell,
    ProgressCell,
    createColumnsFromData,
    CopyableCell,
    Button,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "luxtable";
import { MoreHorizontal, Edit, Trash, Copy, User } from "lucide-react";

// =====================================================
// SHARED DATA
// =====================================================
type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const defaultData: Person[] = [
    { firstName: "Tanner", lastName: "Linsley", age: 24, visits: 100, status: "Active", progress: 50 },
    { firstName: "Tandy", lastName: "Miller", age: 40, visits: 40, status: "Active", progress: 80 },
    { firstName: "Joe", lastName: "Dirte", age: 45, visits: 20, status: "Inactive", progress: 10 },
    { firstName: "Jane", lastName: "Doe", age: 32, visits: 75, status: "Active", progress: 90 },
    { firstName: "John", lastName: "Smith", age: 28, visits: 55, status: "Pending", progress: 65 },
];

// =====================================================
// METHOD 1: With createColumnHelper (Recommended)
// =====================================================
const columnHelper = createColumnHelper<Person>();

const columns = [
    columnHelper.accessor("firstName", { header: "First Name" }),
    columnHelper.accessor("lastName", { header: "Last Name" }),
    columnHelper.accessor("age", { header: "Age" }),
    columnHelper.accessor("visits", { header: "Visits" }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusCell value={info.getValue() as string} />,
    }),
    columnHelper.accessor("progress", {
        header: "Progress",
        cell: (info) => <ProgressCell value={info.getValue() as number} showLabel />,
    }),
];

export function LuxTableDemo() {
    return (
        <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <LuxTable
                data={defaultData}
                columns={columns}
                options={{ pagination: true, sorting: true }}
            />
        </div>
    );
}

// =====================================================
// METHOD 2: createColumnsFromData - Auto from JSON
// =====================================================
const autoColumns = createColumnsFromData(defaultData, {
    headers: {
        firstName: "First Name",
        lastName: "Last Name",
        age: "Age",
        visits: "Visits",
        status: "Status",
        progress: "Progress",
    },
    cells: {
        status: (info) => <StatusCell value={info.getValue() as string} />,
        progress: (info) => <ProgressCell value={info.getValue() as number} showLabel />,
    },
});

export function LuxTableAutoDemo() {
    return (
        <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <LuxTable
                data={defaultData}
                columns={autoColumns}
                options={{ pagination: true, sorting: true }}
            />
        </div>
    );
}

// =====================================================
// METHOD 3: Sorting Demo - Sorting Feature
// =====================================================
const sortingColumns = [
    columnHelper.accessor("firstName", {
        header: "First Name",
        enableSorting: true, // Default true, optional to specify
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
        enableSorting: true,
    }),
    columnHelper.accessor("age", {
        header: "Age",
        enableSorting: true,
    }),
    columnHelper.accessor("visits", {
        header: "Visits",
        enableSorting: true,
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusCell value={info.getValue() as string} />,
        enableSorting: false, // Sorting disabled for this column
    }),
    columnHelper.accessor("progress", {
        header: "Progress",
        cell: (info) => <ProgressCell value={info.getValue() as number} showLabel />,
        enableSorting: true,
    }),
];

export function LuxTableSortingDemo() {
    return (
        <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                💡 You can sort by clicking column headers. Status column sorting is disabled.
            </p>
            <LuxTable
                data={defaultData}
                columns={sortingColumns}
                options={{ pagination: true, sorting: true }}
            />
        </div>
    );
}

// =====================================================
// METHOD 4: CopyableCell - Click to Copy
// =====================================================
type PersonWithEmail = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    status: string;
    id: string; // ID required for selection
};

const copyableData: PersonWithEmail[] = [
    { id: "1", firstName: "Ahmet", lastName: "Yılmaz", email: "ahmet.yilmaz@example.com", phone: "+90 555 123 4567", department: "Software", status: "Active" },
    { id: "2", firstName: "Ayşe", lastName: "Kaya", email: "ayse.kaya@example.com", phone: "+90 555 234 5678", department: "Marketing", status: "Active" },
    { id: "3", firstName: "Mehmet", lastName: "Demir", email: "mehmet.demir@example.com", phone: "+90 555 345 6789", department: "Finance", status: "Inactive" },
    { id: "4", firstName: "Fatma", lastName: "Öztürk", email: "fatma.ozturk@example.com", phone: "+90 555 456 7890", department: "Human Resources", status: "Active" },
    { id: "5", firstName: "Ali", lastName: "Çelik", email: "ali.celik@example.com", phone: "+90 555 567 8901", department: "Software", status: "Pending" },
];

const copyableColumnHelper = createColumnHelper<PersonWithEmail>();

const copyableColumns = [
    copyableColumnHelper.accessor("firstName", { header: "First Name" }),
    copyableColumnHelper.accessor("lastName", { header: "Last Name" }),
    copyableColumnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <CopyableCell value={info.getValue() as string} />,
    }),
    copyableColumnHelper.accessor("phone", {
        header: "Phone",
        cell: (info) => <CopyableCell value={info.getValue() as string} tooltip="Copy phone" />,
    }),
    copyableColumnHelper.accessor("department", { header: "Department" }),
    copyableColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusCell value={info.getValue() as string} />,
    }),
];

export function LuxTableCopyableDemo() {
    return (
        <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                📋 You can click Email and Phone cells to copy the value!
            </p>
            <LuxTable
                data={copyableData}
                columns={copyableColumns}
                options={{ pagination: true, sorting: true }}
            />
        </div>
    );
}

// =====================================================
// METHOD 5: Filtering Demo - Column Filtering
// =====================================================
type Employee = {
    id: number;
    name: string;
    department: string;
    role: string;
    salary: number;
    status: string;
};

const employeeData: Employee[] = [
    { id: 1, name: "Ahmet Yılmaz", department: "Software", role: "Frontend Developer", salary: 45000, status: "Active" },
    { id: 2, name: "Ayşe Kaya", department: "Marketing", role: "Marketing Manager", salary: 55000, status: "Active" },
    { id: 3, name: "Mehmet Demir", department: "Software", role: "Backend Developer", salary: 50000, status: "Active" },
    { id: 4, name: "Fatma Çelik", department: "Human Resources", role: "HR Specialist", salary: 40000, status: "Inactive" },
    { id: 5, name: "Ali Öztürk", department: "Finance", role: "Accountant", salary: 42000, status: "Active" },
    { id: 6, name: "Zeynep Arslan", department: "Software", role: "Full Stack Developer", salary: 60000, status: "Active" },
    { id: 7, name: "Mustafa Koç", department: "Marketing", role: "SEO Specialist", salary: 38000, status: "Pending" },
    { id: 8, name: "Elif Şahin", department: "Finance", role: "Financial Analyst", salary: 48000, status: "Active" },
    { id: 9, name: "Burak Aydın", department: "Software", role: "DevOps Engineer", salary: 65000, status: "Active" },
    { id: 10, name: "Seda Yıldız", department: "Human Resources", role: "Recruiter", salary: 35000, status: "Active" },
];

const filterColumnHelper = createColumnHelper<Employee>();

const filterColumns = [
    filterColumnHelper.accessor("id", { header: "ID" }),
    filterColumnHelper.accessor("name", { header: "Name" }),
    filterColumnHelper.accessor("department", {
        header: "Department",
        meta: { filterVariant: "select" as const },
    }),
    filterColumnHelper.accessor("role", { header: "Role" }),
    filterColumnHelper.accessor("salary", { header: "Salary" }),
    filterColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusCell value={info.getValue() as string} />,
        meta: { filterVariant: "select" as const },
    }),
];

export function LuxTableFilterDemo() {
    return (
        <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                🔍 You can use text filter for Name and Role, and dropdown filter for Department and Status!
            </p>
            <LuxTable
                data={employeeData}
                columns={filterColumns}
                options={{ pagination: true, sorting: true, filtering: true }}
            />
        </div>
    );
}

// =====================================================
// METHOD 6: Selection Demo - Row Selection
// =====================================================
export function LuxTableSelectionDemo() {
    const [selectedRows, setSelectedRows] = React.useState<Employee[]>([]);

    return (
        <div className="space-y-4">
            <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    ✅ You can test the row selection feature. Selected rows are listed below.
                </p>
                <LuxTable
                    data={employeeData}
                    columns={filterColumns}
                    options={{
                        pagination: true,
                        sorting: true,
                        filtering: true,
                        selection: "multiple" // Multi-select aktif
                    }}
                    onSelectedRowsChange={setSelectedRows}
                />
            </div>

            {selectedRows.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-4">
                    <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                        Selected Records ({selectedRows.length})
                    </h3>
                    <ul className="list-disc list-inside text-sm text-green-800 dark:text-green-400 max-h-40 overflow-auto">
                        {selectedRows.map((row) => (
                            <li key={row.id}>
                                {row.name} ({row.department}) - {row.role}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// =====================================================
// METHOD 7: Actions Demo - Column Actions (Dropdown)
// =====================================================
export function LuxTableActionsDemo() {
    const actionColumns = [
        filterColumnHelper.accessor("name", { header: "Name" }),
        filterColumnHelper.accessor("role", { header: "Role" }),
        filterColumnHelper.accessor("status", {
            header: "Status",
            cell: (info) => <StatusCell value={info.getValue() as string} />,
        }),
        // Actions Column utilizing the new .action() helper
        filterColumnHelper.action({
            header: "Actions", // Optional: Override default empty header
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex justify-end pr-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.name)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Name
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Employee
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Employee
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        })
    ];

    return (
        <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                ⚡️ Click the three dots on the right to see row actions!
            </p>
            <LuxTable
                data={employeeData.slice(0, 5)}
                columns={actionColumns}
                options={{ pagination: false }}
            />
        </div>
    );
}

// =====================================================
// METHOD 8: Toolbar Demo - Global Search, Column Visibility & Filter Toggle
// =====================================================
export function LuxTableToolbarDemo() {
    return (
        <div className="my-6 space-y-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    🔧 The toolbar includes global search, column visibility toggle, and filter controls!
                </p>
            </div>
            <LuxTable
                data={employeeData}
                columns={filterColumns}
                options={{
                    pagination: true,
                    sorting: true,
                    filtering: true,
                    showToolbar: true,
                    showGlobalSearch: true,
                    showColumnVisibility: true,
                }}
            />
        </div>
    );
}

