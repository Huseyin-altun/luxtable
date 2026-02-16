"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { cn } from "../../lib/utils";

// ============================================================================
// Column Filter Component
// ============================================================================

interface ColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
}

/**
 * Column filter component
 * Rendered as text input or select dropdown using shadcn/ui components
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

    // Select (dropdown) filter using shadcn/ui Select
    if (filterVariant === "select") {
        return (
            <Select
                value={(columnFilterValue ?? "") as string}
                onValueChange={(value) => column.setFilterValue(value === "__all__" ? undefined : value)}
            >
                <SelectTrigger
                    className={cn(
                        "h-8 text-xs",
                        "border-[hsl(var(--lux-filter-border))]",
                        "bg-[hsl(var(--lux-filter-background))]",
                        "text-[hsl(var(--lux-filter-foreground))]"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {sortedUniqueValues.map((value) => (
                        <SelectItem key={value} value={value}>
                            {value}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    // Text input filter using shadcn/ui Input
    return (
        <Input
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value || undefined)}
            placeholder="Filter..."
            className={cn(
                "h-8 text-xs",
                "border-[hsl(var(--lux-filter-border))]",
                "bg-[hsl(var(--lux-filter-background))]",
                "text-[hsl(var(--lux-filter-foreground))]",
                "placeholder:text-[hsl(var(--lux-toolbar-input-placeholder))]"
            )}
            onClick={(e) => e.stopPropagation()}
        />
    );
}

