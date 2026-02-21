"use client";

import type { ReactNode } from "react";
import { ColumnDef, SortingState, RowSelectionState, Row } from "@tanstack/react-table";
import type { GlobalCellConfig } from "../../lib/cell-config";

// ============================================================================
// LuxTable Types
// ============================================================================

/**
 * All type definitions for LuxTable
 */

export interface LuxTableOptions {
    /** Pagination feature (default: false) */
    pagination?: boolean;
    /** Rows per page (default: 10) */
    pageSize?: number;
    /** Sorting feature (default: true) */
    sorting?: boolean;
    /** Multi-column sorting - hold Shift and click to sort by multiple columns (default: true) */
    multiSort?: boolean;
    /** Maximum number of columns that can be sorted at once (default: unlimited) */
    maxMultiSortColCount?: number;
    /** Column filtering feature (default: false) */
    filtering?: boolean;
    /** Row selection mode - "single": single select, "multiple": multi-select, "none": disabled */
    selection?: "single" | "multiple" | "none";
    /** Show selection checkbox (default: true if selection !== "none") */
    showSelectionCheckbox?: boolean;

    /** Enable tree/hierarchical structure (uses getSubRows; default: false) */
    enableTree?: boolean;
    /** Enable expandable row detail (uses renderSubComponent; default: false) */
    enableExpandableRows?: boolean;

    // Toolbar Options
    /** Show toolbar with search and controls (default: false) */
    showToolbar?: boolean;
    /** Show global search in toolbar (default: true when toolbar is shown) */
    showGlobalSearch?: boolean;
    /** Show column visibility controls in toolbar (default: true when toolbar is shown) */
    showColumnVisibility?: boolean;
}

export interface LuxTableProps<TData> {
    /** Column definitions - if not provided, columns will be auto-generated from data */
    columns?: ColumnDef<TData, any>[];
    /** Table data */
    data: TData[];
    /** Additional CSS classes */
    className?: string;
    /** Table options */
    options?: LuxTableOptions;
    /** Global cell config - field bazlı otomatik cell renderer'ları tanımlar */
    cellConfig?: GlobalCellConfig;
    /** Controlled sorting state */
    sorting?: SortingState;
    /** Called when sorting changes */
    onSortingChange?: (sorting: SortingState) => void;
    /** Controlled row selection state */
    rowSelection?: RowSelectionState;
    /** Called when row selection changes */
    onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
    /** Called when selected rows change (with row data) */
    onSelectedRowsChange?: (rows: TData[]) => void;
    /** Unique ID field for each row (default: "id") */
    getRowId?: (row: TData, index: number) => string;

    /** Tree: returns child rows for hierarchical data (e.g. (row) => row.subRows) */
    getSubRows?: (row: TData) => TData[] | undefined;
    /** Expandable row: custom component rendered below the row when expanded */
    renderSubComponent?: (row: Row<TData>) => ReactNode;
}

/**
 * Extended type for Column meta
 * Can be used in the meta field in column definitions
 */
export interface ColumnMeta {
    /** Filter type: text, select, date, slider, or status */
    filterVariant?: "text" | "select" | "date" | "slider" | "status";
}

/**
 * Pagination information
 */
export interface PaginationInfo {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
}
