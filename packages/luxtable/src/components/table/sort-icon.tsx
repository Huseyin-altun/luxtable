"use client";

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
            <svg
                className="h-4 w-4 text-slate-400 dark:text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
            </svg>
        );
    }

    // Ascending (A-Z) - up arrow with highlight
    if (direction === "asc") {
        return (
            <div className="flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 p-0.5">
                <svg
                    className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m18 15-6-6-6 6" />
                </svg>
            </div>
        );
    }

    // Descending (Z-A) - down arrow with highlight
    return (
        <div className="flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 p-0.5">
            <svg
                className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </div>
    );
}
