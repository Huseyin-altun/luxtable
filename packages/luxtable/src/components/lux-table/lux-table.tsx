"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getFacetedUniqueValues,
    SortingState,
    ColumnFiltersState,
    RowSelectionState,
    ColumnDef,
    Row,
} from "@tanstack/react-table";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../table";
import { ColumnFilter } from "./column-filter";
import { TablePagination } from "./pagination";
import { TableToolbar } from "./table-toolbar";
import { Checkbox } from "../ui/checkbox";
import type { LuxTableProps } from "./types";

// ============================================================================
// Selection Checkbox Column Helper
// ============================================================================

/**
 * Creates column definition for selection checkbox
 */
function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
    return {
        id: "__selection__",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all rows"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
    };
}

// ============================================================================
// LuxTable Component
// ============================================================================

/**
 * LuxTable - Advanced React table component
 * 
 * Modern table built on top of TanStack Table, comes with ready-to-use features.
 * 
 * @example
 * ```tsx
 * // Simple usage
 * <LuxTable
 *   columns={columns}
 *   data={data}
 *   options={{
 *     pagination: true,
 *     pageSize: 20,
 *     filtering: true,
 *     sorting: true
 *   }}
 * />
 * 
 * // With row selection
 * <LuxTable
 *   columns={columns}
 *   data={data}
 *   options={{
 *     selection: "multiple", // or "single"
 *   }}
 *   onSelectedRowsChange={(selectedRows) => {
 *     console.log("Selected rows:", selectedRows);
 *   }}
 * />
 * ```
 */
export function LuxTable<TData>({
    columns,
    data,
    className,
    options,
    sorting: controlledSorting,
    onSortingChange,
    rowSelection: controlledRowSelection,
    onRowSelectionChange,
    onSelectedRowsChange,
    getRowId,
}: LuxTableProps<TData>) {
    // Internal sorting state (used when not controlled)
    const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);

    // Column filters state
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    // Global filter state
    const [globalFilter, setGlobalFilter] = React.useState("");

    // Column filtering visibility (controlled by toolbar)
    const [filteringVisible, setFilteringVisible] = React.useState(options?.filtering ?? false);

    // Row selection state
    const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});

    // Determine if we're in controlled mode
    const isControlledSorting = controlledSorting !== undefined;
    const sorting = isControlledSorting ? controlledSorting : internalSorting;

    const isControlledRowSelection = controlledRowSelection !== undefined;
    const rowSelection = isControlledRowSelection ? controlledRowSelection : internalRowSelection;

    // Selection mode configuration
    const selectionMode = options?.selection ?? "none";
    const showCheckbox = options?.showSelectionCheckbox ?? (selectionMode !== "none");
    const enableRowSelection = selectionMode !== "none";
    const enableMultiRowSelection = selectionMode === "multiple";

    // Build columns with selection column if needed
    const tableColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
        if (showCheckbox && enableRowSelection) {
            return [createSelectionColumn<TData>(), ...columns] as ColumnDef<TData, unknown>[];
        }
        return columns as ColumnDef<TData, unknown>[];
    }, [columns, showCheckbox, enableRowSelection]);

    // Handle row selection change
    const handleRowSelectionChange = React.useCallback(
        (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
            const newSelection = typeof updater === "function" ? updater(rowSelection) : updater;

            if (isControlledRowSelection && onRowSelectionChange) {
                onRowSelectionChange(newSelection);
            } else {
                setInternalRowSelection(newSelection);
            }
        },
        [isControlledRowSelection, onRowSelectionChange, rowSelection]
    );

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(sorting) : updater;

            if (isControlledSorting && onSortingChange) {
                onSortingChange(newSorting);
            } else {
                setInternalSorting(newSorting);
            }
        },
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: handleRowSelectionChange,
        enableRowSelection,
        enableMultiRowSelection,
        getRowId: getRowId ?? ((row: TData, index: number) => {
            // Try to use "id" field if exists, otherwise use index
            if (typeof row === "object" && row !== null && "id" in row) {
                return String((row as { id: unknown }).id);
            }
            return String(index);
        }),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: options?.pagination ? getPaginationRowModel() : undefined,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        initialState: {
            pagination: {
                pageSize: options?.pageSize ?? 10,
            },
        },
    });

    // Call onSelectedRowsChange when selection changes
    React.useEffect(() => {
        if (onSelectedRowsChange) {
            const selectedRows = table.getSelectedRowModel().rows.map((row: Row<TData>) => row.original);
            onSelectedRowsChange(selectedRows);
        }
    }, [rowSelection, onSelectedRowsChange, table]);

    // Calculate visible column count (for empty state colspan)
    const visibleColumnCount = tableColumns.length;

    // Toolbar visibility
    const showToolbar = options?.showToolbar ?? false;
    const showGlobalSearch = options?.showGlobalSearch ?? true;
    const showColumnVisibility = options?.showColumnVisibility ?? true;

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Toolbar */}
            {showToolbar && (
                <TableToolbar
                    table={table}
                    showFiltering={options?.filtering !== undefined}
                    filteringEnabled={filteringVisible}
                    onFilteringToggle={setFilteringVisible}
                    showGlobalSearch={showGlobalSearch}
                    showColumnVisibility={showColumnVisibility}
                />
            )}

            {/* Selection info bar */}
            {enableRowSelection && Object.keys(rowSelection).length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                        <strong>{Object.keys(rowSelection).length}</strong> rows selected
                        {table.getFilteredRowModel().rows.length > 0 && (
                            <span className="text-blue-500 dark:text-blue-400">
                                {" / "}{table.getFilteredRowModel().rows.length} total
                            </span>
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleRowSelectionChange({})}
                        className="ml-auto text-xs hover:text-blue-900 dark:hover:text-blue-100 underline underline-offset-2"
                    >
                        Clear selection
                    </button>
                </div>
            )}

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isSelectionColumn = header.id === "__selection__";

                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={isSelectionColumn ? { width: 40, padding: "0 12px" } : undefined}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : (flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                ) as React.ReactNode)}
                                        </TableHead>
                                    );
                                })}

                            </TableRow>
                        ))}

                        {/* Filter Row */}
                        {filteringVisible && (
                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                                {table.getHeaderGroups()[0]?.headers.map((header) => {
                                    const isSelectionColumn = header.id === "__selection__";
                                    return (
                                        <TableHead key={`filter-${header.id}`} className="py-2">
                                            {!isSelectionColumn && header.column.getCanFilter() ? (
                                                <ColumnFilter column={header.column} />
                                            ) : null}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        )}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(
                                        enableRowSelection && "cursor-pointer",
                                        row.getIsSelected() && "bg-blue-50/50 dark:bg-blue-950/30"
                                    )}
                                    onClick={
                                        enableRowSelection && !showCheckbox
                                            ? () => {
                                                if (selectionMode === "single") {
                                                    handleRowSelectionChange({ [row.id]: true });
                                                } else {
                                                    row.toggleSelected();
                                                }
                                            }
                                            : undefined
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const isSelectionColumn = cell.column.id === "__selection__";
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                style={isSelectionColumn ? { width: 40, padding: "0 12px" } : undefined}
                                                onClick={isSelectionColumn ? (e) => e.stopPropagation() : undefined}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={visibleColumnCount} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {options?.pagination && <TablePagination table={table} />}
        </div>
    );
}

