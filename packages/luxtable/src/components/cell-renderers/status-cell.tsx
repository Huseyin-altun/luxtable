"use client";

// ============================================================================
// STATUS CELL - Status Display
// ============================================================================
// This component is used to visually display status values with colored badges
// in tables.
//
// Features:
// - 5 predefined status colors (Active, Inactive, Pending, Completed, Cancelled)
// - Dark mode support
// - Customizable colors
// - Default gray badge for undefined statuses
// ============================================================================

/**
 * Default colors for Status Cell
 * 
 * 4 values are defined for each status:
 * - bg: Light theme background color
 * - text: Light theme text color
 * - darkBg: Dark theme background color
 * - darkText: Dark theme text color
 */
export const defaultStatusColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    Active: {
        bg: "bg-green-100",
        text: "text-green-800",
        darkBg: "dark:bg-green-900",
        darkText: "dark:text-green-300",
    },
    Inactive: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-300",
    },
    Pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        darkBg: "dark:bg-yellow-900",
        darkText: "dark:text-yellow-300",
    },
    Completed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        darkBg: "dark:bg-blue-900",
        darkText: "dark:text-blue-300",
    },
    Cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        darkBg: "dark:bg-gray-900",
        darkText: "dark:text-gray-300",
    },
};

export interface StatusCellProps {
    /** Status value to display (e.g., "Active", "Pending") */
    value: string;
    /** 
     * Custom color definitions
     * Used to override default colors or add new colors
     * 
     * @example
     * ```tsx
     * colors={{
     *   Custom: { bg: "bg-purple-100", text: "text-purple-800" }
     * }}
     * ```
     */
    colors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Ready-to-use component for status cells
 * 
 * Supports the following statuses by default:
 * - **Active** → Green badge
 * - **Inactive** → Red badge  
 * - **Pending** → Yellow badge
 * - **Completed** → Blue badge
 * - **Cancelled** → Gray badge
 * 
 * Undefined statuses are automatically shown with a gray badge.
 * 
 * @example
 * // Basit kullanım
 * ```tsx
 * <StatusCell value="Active" />
 * ```
 * 
 * @example
 * // Özel renklerle kullanım
 * ```tsx
 * <StatusCell 
 *   value="OnHold" 
 *   colors={{
 *     OnHold: { 
 *       bg: "bg-orange-100", 
 *       text: "text-orange-800",
 *       darkBg: "dark:bg-orange-900",
 *       darkText: "dark:text-orange-300"
 *     }
 *   }}
 * />
 * ```
 * 
 * @example
 * // TanStack Table column içinde kullanım
 * ```tsx
 * columnHelper.accessor("status", {
 *   header: "Durum",
 *   cell: (info) => <StatusCell value={info.getValue()} />,
 * })
 * ```
 */
export function StatusCell({ value, colors, className }: StatusCellProps) {
    const mergedColors = { ...defaultStatusColors, ...colors };
    const colorConfig = mergedColors[value];

    if (!colorConfig) {
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${className || ""}`}>
                {value}
            </span>
        );
    }

    const { bg, text, darkBg, darkText } = colorConfig;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text} ${darkBg || ""} ${darkText || ""} ${className || ""}`}>
            {value}
        </span>
    );
}
