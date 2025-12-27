"use client";

// ============================================================================
// DATE CELL - Date Display
// ============================================================================
// This component is used to display date values in tables in different formats.
//
// Features:
// - 3 different formats: short, long, relative
// - Locale support (language and region formatting)
// - Accepts String or Date object
// - Safe fallback for invalid dates
// ============================================================================

export interface DateCellProps {
    /** Date value (ISO string or Date object) */
    value: string | Date;
    /** 
     * Date format
     * - "short": Short format (e.g., 12/28/2024)
     * - "long": Long format (e.g., December 28, 2024)
     * - "relative": Relative format (e.g., "Today", "Yesterday", "3 days ago")
     * @default "short"
     */
    format?: "short" | "long" | "relative";
    /** 
     * Locale (language and region)
     * @default "en-US"
     */
    locale?: string;
}

/**
 * Ready-to-use component for date values
 * 
 * Supported formats:
 * - **short**: Standard short date format (e.g., 12/28/2024)
 * - **long**: Long format with month name (e.g., December 28, 2024)
 * - **relative**: Relative time (Today, Yesterday, X days ago)
 * 
 * Invalid dates are automatically displayed as "-".
 * 
 * @example
 * // Simple usage (short format)
 * ```tsx
 * <DateCell value="2024-12-28" />
 * // Output: "12/28/2024"
 * ```
 * 
 * @example
 * // Long format
 * ```tsx
 * <DateCell value={new Date()} format="long" />
 * // Output: "December 28, 2024"
 * ```
 * 
 * @example
 * // Relative format
 * ```tsx
 * <DateCell value={new Date()} format="relative" />
 * // Output: "Today"
 * ```
 * 
 * @example
 * // Different locale
 * ```tsx
 * <DateCell value="2024-12-28" format="long" locale="fr-FR" />
 * // Output: "28 décembre 2024"
 * ```
 * 
 * @example
 * // Usage within TanStack Table column
 * ```tsx
 * columnHelper.accessor("createdAt", {
 *   header: "Created At",
 *   cell: (info) => <DateCell value={info.getValue()} format="long" />,
 * })
 * ```
 */
export function DateCell({ value, format = "short", locale = "en-US" }: DateCellProps) {
    const date = typeof value === "string" ? new Date(value) : value;

    // Invalid date check
    if (isNaN(date.getTime())) {
        return <span className="text-gray-400">-</span>;
    }

    let formatted: string;

    switch (format) {
        case "long":
            formatted = date.toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            break;
        case "relative": {
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) formatted = "Today";
            else if (diffDays === 1) formatted = "Yesterday";
            else if (diffDays < 7) formatted = `${diffDays} days ago`;
            else formatted = date.toLocaleDateString(locale);
            break;
        }
        default:
            formatted = date.toLocaleDateString(locale);
    }

    return <span>{formatted}</span>;
}
