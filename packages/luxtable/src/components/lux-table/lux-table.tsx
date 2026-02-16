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
import { SortableHeader } from "./sortable-header";
import { Checkbox } from "../ui/checkbox";
import type { LuxTableProps } from "./types";
import { renderCell, defaultGlobalCellConfig, getFieldConfig } from "../../lib/cell-config";
import { createColumnsFromData } from "../../lib/column-helper";

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
    cellConfig,
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

    // Merge cellConfig with defaults - always use default config, merge with user's config if provided
    const mergedCellConfig = React.useMemo(() => {
        // Always start with default config
        const baseConfig = defaultGlobalCellConfig;

        // If user provided cellConfig, merge it
        if (cellConfig) {
            return {
                ...baseConfig,
                ...cellConfig,
                fields: {
                    ...cellConfig.fields, // User's fields override defaults
                },
                patterns: {
                    ...baseConfig.patterns,
                    ...cellConfig.patterns, // Merge patterns
                },
                defaultStatusColors: {
                    ...baseConfig.defaultStatusColors,
                    ...cellConfig.defaultStatusColors, // Merge status colors
                },
            };
        }

        // If no user config, use default config
        return baseConfig;
    }, [cellConfig]);

    // Auto-generate columns from data if not provided
    const autoColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
        if (columns) return columns;
        if (!data || data.length === 0) return [];

        // Generate columns from data - TData must extend Record<string, unknown>
        if (typeof data[0] === 'object' && data[0] !== null) {
            const generatedColumns = createColumnsFromData(data as TData[] & Record<string, unknown>[]);
            return generatedColumns as ColumnDef<TData, unknown>[];
        }
        return [];
    }, [columns, data]);

    // Build columns with selection column if needed and apply cellConfig
    const tableColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
        let processedColumns = autoColumns.map((col) => {
            // Check if column has accessorKey (for accessor columns)
            const accessorKey = 'accessorKey' in col ? col.accessorKey : undefined;
            // Fallback to id if accessorKey is not available
            const fieldName = accessorKey ? String(accessorKey) : ('id' in col ? String(col.id) : undefined);

            // If we have cellConfig and fieldName, try to get field config (with auto-detection)
            if (mergedCellConfig && fieldName) {
                // Get sample value from first row for auto-detection
                const sampleValue = data && data.length > 0 ? (data[0] as any)?.[fieldName] : undefined;

                // Use getFieldConfig which includes auto-detection
                const fieldConfig = getFieldConfig(fieldName, sampleValue, mergedCellConfig);

                if (fieldConfig) {
                    // cellConfig has priority - override existing cell if any
                    return {
                        ...col,
                        cell: (context: any) => renderCell(context, fieldName, mergedCellConfig),
                    };
                }
            }

            // If column already has a cell renderer, use it
            if (col.cell) {
                return col;
            }

            return col;
        });

        if (showCheckbox && enableRowSelection) {
            return [createSelectionColumn<TData>(), ...processedColumns] as ColumnDef<TData, unknown>[];
        }
        return processedColumns as ColumnDef<TData, unknown>[];
    }, [autoColumns, showCheckbox, enableRowSelection, mergedCellConfig, data]);

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

    // Sorting enabled at table level (default: true)
    const enableSorting = options?.sorting !== false;
    // Multi-column sorting enabled (default: true)
    const enableMultiSort = options?.multiSort !== false;

    const table = useReactTable({
        data,
        columns: tableColumns,
        enableSorting,
        enableMultiSort,
        // Shift+Click for multi-sort (default behavior)
        isMultiSortEvent: (e: unknown) => (e as MouseEvent).shiftKey,
        // Max columns for multi-sort (undefined = unlimited)
        maxMultiSortColCount: options?.maxMultiSortColCount,
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
                <div className="flex items-center gap-2 px-4 py-2 text-sm bg-[hsl(var(--lux-selection-info-background))] text-[hsl(var(--lux-selection-info-foreground))] rounded-lg border border-[hsl(var(--lux-selection-info-border))]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                        <strong>{Object.keys(rowSelection).length}</strong> rows selected
                        {table.getFilteredRowModel().rows.length > 0 && (
                            <span className="opacity-80">
                                {" / "}{table.getFilteredRowModel().rows.length} total
                            </span>
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleRowSelectionChange({})}
                        className="ml-auto text-xs hover:opacity-80 underline underline-offset-2"
                    >
                        Clear selection
                    </button>
                </div>
            )}

            <div className="rounded-md border border-[hsl(var(--lux-table-border))] bg-[hsl(var(--lux-table-background))] overflow-hidden">
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
                                            {header.isPlaceholder ? null : (
                                                isSelectionColumn ? (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    ) as React.ReactNode
                                                ) : (
                                                    <SortableHeader
                                                        header={header}
                                                        showSortIndex={enableMultiSort && sorting.length > 1}
                                                    />
                                                )
                                            )}
                                        </TableHead>
                                    );
                                })}

                            </TableRow>
                        ))}

                        {/* Filter Row */}
                        {filteringVisible && (
                            <TableRow className="bg-[hsl(var(--lux-filter-background))]">
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
                                        row.getIsSelected() && "bg-[hsl(var(--lux-selection-background))]"
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

