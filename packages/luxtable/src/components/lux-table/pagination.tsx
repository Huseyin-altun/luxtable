"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

// ============================================================================
// Pagination Button
// ============================================================================

interface PaginationButtonProps {
    onClick: () => void;
    disabled: boolean;
    title: string;
    children: React.ReactNode;
}

function PaginationButton({ onClick, disabled, title, children }: PaginationButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                "h-9 w-9",
                "border border-slate-200 dark:border-slate-800",
                "bg-white dark:bg-slate-950",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "disabled:pointer-events-none disabled:opacity-50",
                "transition-colors"
            )}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </button>
    );
}

// ============================================================================
// Page Number Button
// ============================================================================

interface PageNumberButtonProps {
    pageNum: number;
    isActive: boolean;
    onClick: () => void;
}

function PageNumberButton({ pageNum, isActive, onClick }: PageNumberButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                "h-9 w-9",
                "transition-colors",
                isActive
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
        >
            {pageNum + 1}
        </button>
    );
}

// ============================================================================
// Pagination Component
// ============================================================================

interface TablePaginationProps<TData> {
    table: Table<TData>;
}

/**
 * Table pagination component
 * Provides page navigation, record info and page size selection
 */
export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = table.getFilteredRowModel().rows.length;

    // Calculate visible range
    const startRow = currentPage * pageSize + 1;
    const endRow = Math.min((currentPage + 1) * pageSize, totalRows);

    // Generate page numbers to display
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // Show all pages if 7 or less
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current
            for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 4) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
            {/* Left side: Records info + Page size selector */}
            <div className="flex items-center gap-4">
                {/* Records info */}
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        {startRow}
                    </span>
                    -
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        {endRow}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        {totalRows}
                    </span>{" "}
                    records shown
                </div>

                {/* Page size selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className={cn(
                            "h-9 rounded-md border border-slate-200 dark:border-slate-800",
                            "bg-white dark:bg-slate-950",
                            "px-3 py-1 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                            "cursor-pointer"
                        )}
                    >
                        {[10, 20, 30, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Right side: Navigation */}
            <div className="flex items-center gap-2">
                {/* First page */}
                <PaginationButton
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    title="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </PaginationButton>

                {/* Previous page */}
                <PaginationButton
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    title="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </PaginationButton>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (page === "...") {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        return (
                            <PageNumberButton
                                key={pageNum}
                                pageNum={pageNum}
                                isActive={pageNum === currentPage}
                                onClick={() => table.setPageIndex(pageNum)}
                            />
                        );
                    })}
                </div>

                {/* Next page */}
                <PaginationButton
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    title="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </PaginationButton>

                {/* Last page */}
                <PaginationButton
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    title="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </PaginationButton>
            </div>
        </div>
    );
}
