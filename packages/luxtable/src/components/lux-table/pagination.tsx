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
                "text-slate-900 dark:text-slate-100",
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
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
        >
            {pageNum + 1}
        </button>
    );
}





interface TablePaginationProps<TData> {
    table: Table<TData>;
}


export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = table.getFilteredRowModel().rows.length;

    
    const startRow = currentPage * pageSize + 1;
    const endRow = Math.min((currentPage + 1) * pageSize, totalRows);

    
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            
            pages.push(0);

            if (currentPage > 3) {
                pages.push("...");
            }

            
            for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 4) {
                pages.push("...");
            }

            
            pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
            {}
            <div className="flex items-center gap-4">
                {}
                <div className="text-sm text-[hsl(var(--lux-table-cell-muted))]">
                    <span className="font-medium text-[hsl(var(--lux-table-foreground))]">
                        {startRow}
                    </span>
                    -
                    <span className="font-medium text-[hsl(var(--lux-table-foreground))]">
                        {endRow}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[hsl(var(--lux-table-foreground))]">
                        {totalRows}
                    </span>{" "}
                    records shown
                </div>

                {}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[hsl(var(--lux-table-cell-muted))]">Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className={cn(
                            "h-9 rounded-md border border-slate-200 dark:border-slate-800",
                            "bg-white dark:bg-slate-950",
                            "px-3 py-1 text-sm text-slate-900 dark:text-slate-100",
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

            {}
            <div className="flex items-center gap-2">
                {}
                <PaginationButton
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    title="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </PaginationButton>

                {}
                <PaginationButton
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    title="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </PaginationButton>

                {}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (page === "...") {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 text-[hsl(var(--lux-table-cell-muted))]">
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

                {}
                <PaginationButton
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    title="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </PaginationButton>

                {}
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
