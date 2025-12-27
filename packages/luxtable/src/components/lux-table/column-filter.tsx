"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { cn } from "../../lib/utils";

// ============================================================================
// Column Filter Component
// ============================================================================

interface ColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
}

/**
 * Column filter component
 * Rendered as text input or select dropdown
 * 
 * @example
 * ```tsx
 * <ColumnFilter column={column} />
 * ```
 */
export function ColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
    const columnFilterValue = column.getFilterValue();

    // Get filter type from column meta (default: text)
    const filterVariant = (column.columnDef.meta as { filterVariant?: "text" | "select" })?.filterVariant ?? "text";

    // For select filter, get unique values from the column
    const sortedUniqueValues = React.useMemo(() => {
        if (filterVariant !== "select") return [];

        const values = new Set<string>();
        column.getFacetedUniqueValues().forEach((_, key) => {
            if (key !== null && key !== undefined) {
                values.add(String(key));
            }
        });
        return Array.from(values).sort();
    }, [column, filterVariant]);

    // Select (dropdown) filter
    if (filterVariant === "select") {
        return (
            <select
                value={(columnFilterValue ?? "") as string}
                onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                className={cn(
                    "w-full h-8 px-2 text-xs rounded-md",
                    "border border-slate-200 dark:border-slate-700",
                    "bg-white dark:bg-slate-900",
                    "text-slate-900 dark:text-slate-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
                    "cursor-pointer transition-colors"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <option value="">All</option>
                {sortedUniqueValues.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        );
    }

    // Text input filter (default)
    return (
        <input
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value || undefined)}
            placeholder="Filter..."
            className={cn(
                "w-full h-8 px-2 text-xs rounded-md",
                "border border-slate-200 dark:border-slate-700",
                "bg-white dark:bg-slate-900",
                "text-slate-900 dark:text-slate-100",
                "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
                "transition-colors"
            )}
            onClick={(e) => e.stopPropagation()}
        />
    );
}
