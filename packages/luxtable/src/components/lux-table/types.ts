"use client";

import type { ReactNode } from "react";
import { ColumnDef, SortingState, RowSelectionState, Row } from "@tanstack/react-table";
import type { GlobalCellConfig } from "../../lib/cell-config";







export interface LuxTableOptions {
    
    pagination?: boolean;
    
    pageSize?: number;
    
    sorting?: boolean;
    
    multiSort?: boolean;
    
    maxMultiSortColCount?: number;
    
    filtering?: boolean;
    
    selection?: "single" | "multiple" | "none";
    
    showSelectionCheckbox?: boolean;

    
    enableTree?: boolean;
    
    enableExpandableRows?: boolean;

    
    
    showToolbar?: boolean;
    
    showGlobalSearch?: boolean;
    
    showColumnVisibility?: boolean;
}

export interface LuxTableProps<TData> {
    
    columns?: ColumnDef<TData, any>[];
    
    data: TData[];
    
    className?: string;
    
    options?: LuxTableOptions;
    
    cellConfig?: GlobalCellConfig;
    
    sorting?: SortingState;
    
    onSortingChange?: (sorting: SortingState) => void;
    
    rowSelection?: RowSelectionState;
    
    onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
    
    onSelectedRowsChange?: (rows: TData[]) => void;
    
    getRowId?: (row: TData, index: number) => string;

    
    getSubRows?: (row: TData) => TData[] | undefined;
    
    renderSubComponent?: (row: Row<TData>) => ReactNode;
}


export interface ColumnMeta {
    
    filterVariant?: "text" | "select" | "date" | "slider" | "status";
}


export interface PaginationInfo {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
}
