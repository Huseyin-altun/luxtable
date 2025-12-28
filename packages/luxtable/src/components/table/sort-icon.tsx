"use client";

import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

// ============================================================================
// Sort Icon Component
// ============================================================================

export interface SortIconProps {
    direction?: "asc" | "desc" | false;
}

/**
 * Sort status icon
 * - no direction: chevrons up-down icon (sortable indicator)
 * - asc: up arrow (A-Z)
 * - desc: down arrow (Z-A)
 */
export function SortIcon({ direction }: SortIconProps) {
    // When no sorting (default) - show chevrons up-down (single icon)
    if (!direction) {
        return (
            <ChevronsUpDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        );
    }

    // Ascending (A-Z) - up arrow with highlight
    if (direction === "asc") {
        return (
            <div className="flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 p-0.5">
                <ChevronUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
            </div>
        );
    }

    // Descending (Z-A) - down arrow with highlight
    return (
        <div className="flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 p-0.5">
            <ChevronDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
        </div>
    );
}
