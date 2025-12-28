"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
    Search,
    Filter,
    FilterX,
    Columns3,
    Eye,
    EyeOff,
    RotateCcw,
    ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";

// ============================================================================
// TableToolbar Component
// ============================================================================

interface TableToolbarProps<TData> {
    /** TanStack Table instance */
    table: Table<TData>;
    /** Whether column filtering is enabled */
    showFiltering?: boolean;
    /** Callback to toggle column filtering UI */
    onFilteringToggle?: (enabled: boolean) => void;
    /** Current filtering state */
    filteringEnabled?: boolean;
    /** Show global search input */
    showGlobalSearch?: boolean;
    /** Show column visibility controls */
    showColumnVisibility?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * TableToolbar - A toolbar component for LuxTable
 * 
 * Provides controls for:
 * - Global search across all columns
 * - Column visibility toggle (show/hide columns)
 * - Column filtering toggle (on/off)
 */
export function TableToolbar<TData>({
    table,
    showFiltering = true,
    onFilteringToggle,
    filteringEnabled = false,
    showGlobalSearch = true,
    showColumnVisibility = true,
    className,
}: TableToolbarProps<TData>) {
    const [globalFilter, setGlobalFilter] = React.useState("");

    // Get all columns that can be hidden
    const hidableColumns = table
        .getAllColumns()
        .filter((column) => column.getCanHide() && column.id !== "__selection__");

    // Get hidden columns
    const hiddenColumns = hidableColumns.filter((column) => !column.getIsVisible());

    // Handle global search
    const handleGlobalSearch = React.useCallback(
        (value: string) => {
            setGlobalFilter(value);
            table.setGlobalFilter(value);
        },
        [table]
    );

    // Reset all column visibility
    const handleResetVisibility = React.useCallback(() => {
        table.resetColumnVisibility();
    }, [table]);

    // Show all hidden columns
    const handleShowAllColumns = React.useCallback(() => {
        hidableColumns.forEach((column) => {
            column.toggleVisibility(true);
        });
    }, [hidableColumns]);

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50",
                className
            )}
        >
            {/* Global Search */}
            {showGlobalSearch && (
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search in all columns..."
                        value={globalFilter}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                        className={cn(
                            "w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700",
                            "bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100",
                            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                            "transition-colors"
                        )}
                    />
                    {globalFilter && (
                        <button
                            onClick={() => handleGlobalSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <FilterX className="h-3 w-3 text-slate-400" />
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
                {/* Toggle Column Filtering */}
                {showFiltering && onFilteringToggle && (
                    <Button
                        variant={filteringEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilteringToggle(!filteringEnabled)}
                        className="gap-2"
                    >
                        {filteringEnabled ? (
                            <>
                                <FilterX className="h-4 w-4" />
                                <span className="hidden sm:inline">Hide Filters</span>
                            </>
                        ) : (
                            <>
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Show Filters</span>
                            </>
                        )}
                    </Button>
                )}

                {/* Column Visibility Dropdown */}
                {showColumnVisibility && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Columns3 className="h-4 w-4" />
                                <span className="hidden sm:inline">Columns</span>
                                {hiddenColumns.length > 0 && (
                                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
                                        {hiddenColumns.length}
                                    </span>
                                )}
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex items-center gap-2">
                                <Columns3 className="h-4 w-4" />
                                Toggle Columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Quick actions */}
                            <div className="flex items-center gap-1 px-2 py-1.5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleShowAllColumns}
                                    disabled={hiddenColumns.length === 0}
                                    className="h-7 flex-1 text-xs"
                                >
                                    <Eye className="mr-1 h-3 w-3" />
                                    Show All
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetVisibility}
                                    className="h-7 flex-1 text-xs"
                                >
                                    <RotateCcw className="mr-1 h-3 w-3" />
                                    Reset
                                </Button>
                            </div>

                            <DropdownMenuSeparator />

                            {/* Column list */}
                            <div className="max-h-[300px] overflow-y-auto">
                                {hidableColumns.map((column) => {
                                    const columnDef = column.columnDef;
                                    const headerText =
                                        typeof columnDef.header === "string"
                                            ? columnDef.header
                                            : column.id;

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            className="capitalize"
                                        >
                                            <span className="flex items-center gap-2">
                                                {column.getIsVisible() ? (
                                                    <Eye className="h-3.5 w-3.5 text-green-500" />
                                                ) : (
                                                    <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                                                )}
                                                {headerText}
                                            </span>
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                            </div>

                            {hiddenColumns.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <div className="px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        {hiddenColumns.length} column(s) hidden
                                    </div>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
