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
            <ChevronsUpDown className="h-4 w-4 text-slate-400/60 dark:text-slate-600" />
        );
    }

    // Ascending (A-Z) - up arrow with highlight
    if (direction === "asc") {
        return (
            <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/15 to-teal-500/15 dark:from-emerald-400/20 dark:to-teal-400/20 p-0.5 ring-1 ring-emerald-500/20 dark:ring-emerald-400/25">
                <ChevronUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            </div>
        );
    }

    // Descending (Z-A) - down arrow with highlight
    return (
        <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/15 to-teal-500/15 dark:from-emerald-400/20 dark:to-teal-400/20 p-0.5 ring-1 ring-emerald-500/20 dark:ring-emerald-400/25">
            <ChevronDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
        </div>
    );
}
