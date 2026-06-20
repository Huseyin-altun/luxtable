"use client";

import { Header, flexRender } from "@tanstack/react-table";
import { cn } from "../../lib/utils";





interface SortableHeaderProps<TData, TValue> {
    header: Header<TData, TValue>;
    showSortIndex?: boolean;
}


export function SortableHeader<TData, TValue>({
    header,
    showSortIndex = false,
}: SortableHeaderProps<TData, TValue>) {
    const column = header.column;
    const canSort = column.getCanSort();
    const isSorted = column.getIsSorted();
    const sortIndex = column.getSortIndex();

    
    const headerContent = header.isPlaceholder
        ? null
        : flexRender(column.columnDef.header, header.getContext());

    
    if (!canSort) {
        return <>{headerContent}</>;
    }

    return (
        <button
            type="button"
            className={cn(
                "flex items-center gap-1.5 w-full text-left font-medium group",
                "hover:text-[hsl(var(--lux-table-foreground))]",
                "transition-all duration-200",
                "-ml-2 px-2 py-1 rounded-md",
                "hover:bg-[hsl(var(--lux-table-row-hover))]",
                isSorted && "text-[hsl(var(--lux-sort-sorted-text))]"
            )}
            onClick={header.column.getToggleSortingHandler()}
        >
            {headerContent}

            {}
            {showSortIndex && isSorted && sortIndex > 0 && (
                <span className="ml-0.5 text-[10px] font-bold text-[hsl(var(--lux-sort-sorted-text))] bg-[hsl(var(--lux-sort-sorted-text))]/10 rounded-full w-4 h-4 flex items-center justify-center ring-1 ring-[hsl(var(--lux-sort-sorted-text))]/20">
                    {sortIndex + 1}
                </span>
            )}
        </button>
    );
}
