"use client";

// ============================================================================
// PROGRESS CELL - Progress Bar
// ============================================================================
// This component is used to display percentage values with a visual progress bar
// in tables.
//
// Features:
// - Customizable bar and background colors
// - Optional percentage label
// - Smooth animations
// - Value safety between 0-100
// ============================================================================

export interface ProgressCellProps {
    /** Progress value (between 0-100) */
    value: number;
    /** 
     * Progress bar color 
     * @default "bg-blue-600"
     */
    barColor?: string;
    /** 
     * Background color 
     * @default "bg-gray-200 dark:bg-gray-700"
     */
    bgColor?: string;
    /** 
     * Show percentage label 
     * @default false
     */
    showLabel?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Ready-to-use component for progress bar cells
 * 
 * Displays percentage values as a visual progress bar.
 * Value is automatically clamped between 0-100.
 * 
 * @example
 * // Basit kullanım
 * ```tsx
 * <ProgressCell value={75} />
 * ```
 * 
 * @example
 * // Etiket ile
 * ```tsx
 * <ProgressCell value={42} showLabel />
 * ```
 * 
 * @example
 * // Özel renklerle
 * ```tsx
 * <ProgressCell 
 *   value={60} 
 *   barColor="bg-green-500"
 *   bgColor="bg-green-100"
 *   showLabel
 * />
 * ```
 * 
 * @example
 * // TanStack Table column içinde kullanım
 * ```tsx
 * columnHelper.accessor("progress", {
 *   header: "İlerleme",
 *   cell: (info) => <ProgressCell value={info.getValue()} showLabel />,
 * })
 * ```
 */
export function ProgressCell({
    value,
    barColor = "bg-blue-600",
    bgColor = "bg-gray-200 dark:bg-gray-700",
    showLabel = false,
    className,
}: ProgressCellProps) {
    // Clamp value between 0-100
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className={`flex items-center gap-2 ${className || ""}`}>
            <div className={`w-full rounded-full h-2.5 ${bgColor}`}>
                <div
                    className={`${barColor} h-2.5 rounded-full transition-all`}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                    {value}%
                </span>
            )}
        </div>
    );
}
