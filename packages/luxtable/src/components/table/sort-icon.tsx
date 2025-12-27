"use client";

// ============================================================================
// Sort Icon Component
// ============================================================================

export interface SortIconProps {
    direction?: "asc" | "desc" | false;
}

/**
 * Sort status icon
 * - no direction: double arrow (sortable)
 * - asc: up arrow (A-Z)
 * - desc: down arrow (Z-A)
 */
export function SortIcon({ direction }: SortIconProps) {
    // When no sorting (default) - show double arrow
    if (!direction) {
        return (
            <div className="flex flex-col -space-y-1">
                <svg
                    className="h-3 w-3 text-slate-400 dark:text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m18 15-6-6-6 6" />
                </svg>
                <svg
                    className="h-3 w-3 text-slate-400 dark:text-slate-500"
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

    // Ascending (A-Z) - up arrow
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

    // Descending (Z-A) - down arrow
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
