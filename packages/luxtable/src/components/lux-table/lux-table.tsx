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
    getExpandedRowModel,
    SortingState,
    ColumnFiltersState,
    RowSelectionState,
    ColumnDef,
    Row,
    ExpandedState,
} from "@tanstack/react-table";
import { CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";
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

/**
 * Creates column definition for tree expand/collapse (chevron)
 */
function createTreeExpanderColumn<TData>(): ColumnDef<TData, unknown> {
    return {
        id: "__tree_expander__",
        header: () => null,
        cell: ({ row }) => {
            if (!row.getCanExpand()) {
                return <span className="inline-block w-6" aria-hidden />;
            }
            return (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        row.toggleExpanded();
                    }}
                    className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-[hsl(var(--lux-table-row-hover))] text-[hsl(var(--lux-table-cell-foreground))]"
                    aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </button>
            );
        },
        size: 40,
        enableSorting: false,
        enableHiding: false,
    };
}

/**
 * Creates column definition for expandable row detail (Expand button)
 */
function createDetailExpanderColumn<TData>(props: {
    expandedDetail: Record<string, boolean>;
    onToggle: (rowId: string) => void;
}): ColumnDef<TData, unknown> {
    return {
        id: "__detail_expander__",
        header: () => <span className="text-xs font-medium text-[hsl(var(--lux-table-cell-muted))]">Detay</span>,
        cell: ({ row }) => {
            const isExpanded = Boolean(props.expandedDetail[row.id]);
            return (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onToggle(row.id);
                    }}
                    className={cn(
                        "inline-flex items-center justify-center w-8 h-8 rounded text-[hsl(var(--lux-table-cell-muted))]",
                        "hover:bg-[hsl(var(--lux-table-row-hover))] hover:text-[hsl(var(--lux-table-cell-foreground))]",
                        "transition-transform",
                        isExpanded && "rotate-180"
                    )}
                    aria-label={isExpanded ? "Close detail" : "Expand detail"}
                >
                    <ChevronDown className="w-4 h-4" />
                </button>
            );
        },
        size: 48,
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
    getSubRows,
    renderSubComponent,
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

    // Tree expansion state (for hierarchical subRows)
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    // Detail expansion state (for renderSubComponent per row)
    const [expandedDetail, setExpandedDetail] = React.useState<Record<string, boolean>>({});

    const enableTree = Boolean(getSubRows);
    const enableExpandableRows = Boolean(renderSubComponent);

    const toggleDetailExpanded = React.useCallback((rowId: string) => {
        setExpandedDetail((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
    }, []);

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

    // Custom filter functions
    const dateFilterFn = React.useCallback((row: any, columnId: string, filterValue: { from?: string; to?: string }) => {
        if (!filterValue || (!filterValue.from && !filterValue.to)) return true;

        const cellValue = row.getValue(columnId);
        if (!cellValue) return false;

        const cellDate = new Date(String(cellValue));
        if (isNaN(cellDate.getTime())) return false;

        if (filterValue.from) {
            const fromDate = new Date(filterValue.from);
            fromDate.setHours(0, 0, 0, 0);
            if (cellDate < fromDate) return false;
        }

        if (filterValue.to) {
            const toDate = new Date(filterValue.to);
            toDate.setHours(23, 59, 59, 999);
            if (cellDate > toDate) return false;
        }

        return true;
    }, []);

    const sliderFilterFn = React.useCallback((row: any, columnId: string, filterValue: { min?: number; max?: number }) => {
        if (!filterValue || (filterValue.min === undefined && filterValue.max === undefined)) return true;

        const cellValue = row.getValue(columnId);
        const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(String(cellValue));

        if (isNaN(numValue)) return false;

        if (filterValue.min !== undefined && numValue < filterValue.min) return false;
        if (filterValue.max !== undefined && numValue > filterValue.max) return false;

        return true;
    }, []);

    const statusFilterFn = React.useCallback((row: any, columnId: string, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true;

        const cellValue = String(row.getValue(columnId)).toLowerCase();
        return filterValue.some(status => status.toLowerCase() === cellValue);
    }, []);

    // Build columns with selection column if needed and apply cellConfig
    const tableColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
        let processedColumns = autoColumns.map((col) => {
            // Check if column has accessorKey (for accessor columns)
            const accessorKey = 'accessorKey' in col ? col.accessorKey : undefined;
            // Fallback to id if accessorKey is not available
            const fieldName = accessorKey ? String(accessorKey) : ('id' in col ? String(col.id) : undefined);

            // Auto-detect filter type and add filter function
            let filterFn = col.filterFn;
            const meta = (col.meta || {}) as { filterVariant?: "text" | "select" | "date" | "slider" | "status" };

            if (fieldName && !meta.filterVariant) {
                const fieldNameLower = fieldName.toLowerCase();
                // Auto-detect date columns
                const datePatterns = ['date', 'createdat', 'updatedat', 'joindate', 'startdate', 'enddate', 'birthdate', 'publishedat'];
                if (datePatterns.some(pattern => fieldNameLower.includes(pattern))) {
                    meta.filterVariant = "date";
                    filterFn = dateFilterFn as any;
                }
                // Auto-detect status columns
                const statusPatterns = ['status', 'state', 'stage', 'phase'];
                if (statusPatterns.some(pattern => fieldNameLower.includes(pattern))) {
                    meta.filterVariant = "status";
                    filterFn = statusFilterFn as any;
                }
                // Auto-detect numeric/currency columns
                const numericPatterns = ['salary', 'price', 'amount', 'cost', 'revenue', 'total', 'balance', 'fee'];
                if (numericPatterns.some(pattern => fieldNameLower.includes(pattern))) {
                    meta.filterVariant = "slider";
                    filterFn = sliderFilterFn as any;
                }
            } else if (meta.filterVariant) {
                // Use explicit filter variant
                if (meta.filterVariant === "date" && !filterFn) {
                    filterFn = dateFilterFn as any;
                } else if (meta.filterVariant === "slider" && !filterFn) {
                    filterFn = sliderFilterFn as any;
                } else if (meta.filterVariant === "status" && !filterFn) {
                    filterFn = statusFilterFn as any;
                }
            }

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
                        filterFn,
                        meta,
                    };
                }
            }

            // If column already has a cell renderer, use it
            if (col.cell || filterFn || meta.filterVariant) {
                return {
                    ...col,
                    filterFn,
                    meta,
                };
            }

            return {
                ...col,
                filterFn,
                meta,
            };
        });

        const prefix: ColumnDef<TData, unknown>[] = [];
        if (enableTree) prefix.push(createTreeExpanderColumn<TData>());
        if (enableExpandableRows) prefix.push(createDetailExpanderColumn<TData>({ expandedDetail, onToggle: toggleDetailExpanded }));
        if (showCheckbox && enableRowSelection) prefix.push(createSelectionColumn<TData>());
        if (prefix.length) return [...prefix, ...processedColumns] as ColumnDef<TData, unknown>[];
        return processedColumns as ColumnDef<TData, unknown>[];
    }, [autoColumns, showCheckbox, enableRowSelection, enableTree, enableExpandableRows, expandedDetail, toggleDetailExpanded, mergedCellConfig, data, dateFilterFn, sliderFilterFn, statusFilterFn]);

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
            ...(enableTree && { expanded }),
        },
        ...(enableTree && {
            getSubRows,
            onExpandedChange: setExpanded,
            getExpandedRowModel: getExpandedRowModel(),
        }),
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
                                    const isTreeExpander = header.id === "__tree_expander__";
                                    const isDetailExpander = header.id === "__detail_expander__";

                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={
                                                isSelectionColumn ? { width: 40, padding: "0 12px" }
                                                    : isTreeExpander ? { width: 40 }
                                                        : isDetailExpander ? { width: 48 } : undefined
                                            }
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
                                    const isSpecial = header.id === "__selection__" || header.id === "__tree_expander__" || header.id === "__detail_expander__";
                                    return (
                                        <TableHead key={`filter-${header.id}`} className="py-2">
                                            {!isSpecial && header.column.getCanFilter() ? (
                                                <ColumnFilter column={header.column} data={data} />
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
                                <React.Fragment key={row.id}>
                                    <TableRow
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
                                            const isTreeExpander = cell.column.id === "__tree_expander__";
                                            const isDetailExpander = cell.column.id === "__detail_expander__";
                                            const depth = "depth" in row ? (row as Row<TData> & { depth?: number }).depth ?? 0 : 0;
                                            const indentPx = isTreeExpander && enableTree ? depth * 20 : 0;
                                            const style: React.CSSProperties | undefined = isSelectionColumn
                                                ? { width: 40, padding: "0 12px" }
                                                : isTreeExpander && indentPx
                                                    ? { width: 40, paddingLeft: 8 + indentPx }
                                                    : isDetailExpander ? { width: 48 } : undefined;
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={style}
                                                    onClick={isSelectionColumn || isTreeExpander || isDetailExpander ? (e) => e.stopPropagation() : undefined}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                    {enableExpandableRows && renderSubComponent && expandedDetail[row.id] && (
                                        <TableRow className="bg-[hsl(var(--lux-table-row-hover))]/50">
                                            <TableCell
                                                colSpan={visibleColumnCount}
                                                className="p-0 align-top"
                                            >
                                                {renderSubComponent(row)}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
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

