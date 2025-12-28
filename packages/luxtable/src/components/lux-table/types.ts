"use client";

import { ColumnDef, SortingState, RowSelectionState } from "@tanstack/react-table";

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
    /** Column filtering feature (default: false) */
    filtering?: boolean;
    /** Row selection mode - "single": single select, "multiple": multi-select, "none": disabled */
    selection?: "single" | "multiple" | "none";
    /** Show selection checkbox (default: true if selection !== "none") */
    showSelectionCheckbox?: boolean;
    
    // Toolbar Options
    /** Show toolbar with search and controls (default: false) */
    showToolbar?: boolean;
    /** Show global search in toolbar (default: true when toolbar is shown) */
    showGlobalSearch?: boolean;
    /** Show column visibility controls in toolbar (default: true when toolbar is shown) */
    showColumnVisibility?: boolean;
}

export interface LuxTableProps<TData> {
    /** Column definitions */
    columns: ColumnDef<TData, any>[];
    /** Table data */
    data: TData[];
    /** Additional CSS classes */
    className?: string;
    /** Table options */
    options?: LuxTableOptions;
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
}

/**
 * Extended type for Column meta
 * Can be used in the meta field in column definitions
 */
export interface ColumnMeta {
    /** Filter type: text or select */
    filterVariant?: "text" | "select";
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
