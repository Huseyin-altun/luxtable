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
// Helper function to create status color entries for both cases
const createStatusColor = (bg: string, text: string, darkBg: string, darkText: string) => ({
    bg,
    text,
    darkBg,
    darkText,
});

// Base status colors using CSS variables
const statusColorMap = {
    active: createStatusColor(
        "bg-[hsl(var(--lux-status-active-bg))]",
        "text-[hsl(var(--lux-status-active-text))]",
        "",
        ""
    ),
    inactive: createStatusColor(
        "bg-[hsl(var(--lux-status-inactive-bg))]",
        "text-[hsl(var(--lux-status-inactive-text))]",
        "",
        ""
    ),
    pending: createStatusColor(
        "bg-[hsl(var(--lux-status-pending-bg))]",
        "text-[hsl(var(--lux-status-pending-text))]",
        "",
        ""
    ),
    completed: createStatusColor(
        "bg-[hsl(var(--lux-status-completed-bg))]",
        "text-[hsl(var(--lux-status-completed-text))]",
        "",
        ""
    ),
    cancelled: createStatusColor(
        "bg-[hsl(var(--lux-status-cancelled-bg))]",
        "text-[hsl(var(--lux-status-cancelled-text))]",
        "",
        ""
    ),
};

// Create defaultStatusColors with both lowercase and capitalized versions
export const defaultStatusColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    // Lowercase versions
    ...statusColorMap,
    // Capitalized versions
    Active: statusColorMap.active,
    Inactive: statusColorMap.inactive,
    Pending: statusColorMap.pending,
    Completed: statusColorMap.completed,
    Cancelled: statusColorMap.cancelled,
};

export interface StatusCellProps {
    /** Status value to display (e.g., "Active", "Pending") */
    value: string;
    /** 
     * Custom color definitions
     * Used to override default colors or add new colors
     * 
     * Note: CSS variables automatically handle dark mode, so darkBg and darkText are optional.
     * You can use CSS variables like: bg-[hsl(var(--lux-status-active-bg))] or custom colors.
     * 
     * @example
     * ```tsx
     * colors={{
     *   Custom: { bg: "bg-[hsl(var(--lux-status-active-bg))]", text: "text-[hsl(var(--lux-status-active-text))]" }
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

    // Normalize value to lowercase for lookup
    const normalizedValue = value.toLowerCase();
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    // Try to find color config - check normalized, original, and capitalized versions
    const colorConfig = mergedColors[normalizedValue] || mergedColors[value] || mergedColors[capitalizedValue];

    // Use capitalized value for display
    const displayValue = capitalizedValue;

    if (!colorConfig) {
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--lux-status-default-bg))] text-[hsl(var(--lux-status-default-text))] ${className || ""}`}>
                {displayValue}
            </span>
        );
    }

    const { bg, text } = colorConfig;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text} ${className || ""}`}>
            {displayValue}
        </span>
    );
}
