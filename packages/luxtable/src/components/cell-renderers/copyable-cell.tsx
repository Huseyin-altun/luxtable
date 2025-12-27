"use client";

import * as React from "react";

// ============================================================================
// COPYABLE CELL - Copyable Cell
// ============================================================================
// This component is used for content that can be copied by clicking on it in tables.
// Ideal for values like Email, ID, codes that users frequently copy.
//
// Features:
// - Copy to clipboard with a single click
// - Visual feedback (✓ icon)
// - Hover effects
// - Optional callback
// ============================================================================

// ============================================================================
// Icon Components
// ============================================================================

function CopyIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

// ============================================================================
// Component
// ============================================================================

export interface CopyableCellProps {
    /** Value to display and copy */
    value: string | number;
    /** 
     * Duration of feedback shown after copying (ms) 
     * @default 2000
     */
    feedbackDuration?: number;
    /** Callback called after copying */
    onCopy?: (value: string) => void;
    /** Additional CSS classes */
    className?: string;
    /** 
     * Tooltip text 
     * @default "Click to copy"
     */
    tooltip?: string;
    /** 
     * Always show icon? 
     * If false, only visible on hover
     * @default false
     */
    alwaysShowIcon?: boolean;
}

/**
 * Cell component that copies value to clipboard when clicked
 * 
 * Ideal for values users frequently need to copy such as
 * Email addresses, reference codes, IDs.
 * 
 * Features:
 * - Single click copy
 * - Shows ✓ icon when copied
 * - Option to show icon on hover or always
 * - Capable of capturing copy event with optional callback
 * 
 * @example
 * // Simple usage
 * ```tsx
 * <CopyableCell value="user@example.com" />
 * ```
 * 
 * @example
 * // With Callback
 * ```tsx
 * <CopyableCell 
 *   value="ABC123" 
 *   onCopy={(val) => console.log('Copied:', val)}
 *   tooltip="Copy reference code"
 * />
 * ```
 * 
 * @example
 * // Icon always visible
 * ```tsx
 * <CopyableCell 
 *   value="order-12345" 
 *   alwaysShowIcon 
 * />
 * ```
 * 
 * @example
 * // Usage within TanStack Table column
 * ```tsx
 * columnHelper.accessor("email", {
 *   header: "Email",
 *   cell: (info) => <CopyableCell value={info.getValue()} />,
 * })
 * ```
 */
export function CopyableCell({
    value,
    feedbackDuration = 2000,
    onCopy,
    className,
    tooltip = "Click to copy",
    alwaysShowIcon = false,
}: CopyableCellProps) {
    const [copied, setCopied] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const textToCopy = String(value);

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            onCopy?.(textToCopy);

            setTimeout(() => {
                setCopied(false);
            }, feedbackDuration);
        } catch (err) {
            console.error("Copy error:", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={tooltip}
            className={`
                group inline-flex items-center gap-2 
                px-2 py-1 -mx-2 -my-1
                rounded-md
                transition-all duration-200
                hover:bg-slate-100 dark:hover:bg-slate-800
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                cursor-pointer
                ${className || ""}
            `}
        >
            <span className="select-none">{value}</span>

            {/* Copy/Check icon */}
            <span
                className={`
                    inline-flex items-center justify-center
                    transition-all duration-200
                    ${alwaysShowIcon || isHovered || copied ? "opacity-100" : "opacity-0"}
                `}
            >
                {copied ? (
                    <CheckIcon className="text-green-600 dark:text-green-400" />
                ) : (
                    <CopyIcon className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                )}
            </span>
        </button>
    );
}

/**
 * Factory function for CopyableCell
 * 
 * Designed for easy use with column helper.
 * Creates CopyableCell by passing the value directly.
 * 
 * @example
 * ```tsx
 * const columnHelper = createColumnHelper<User>();
 * 
 * const columns = [
 *   columnHelper.accessor("email", {
 *     header: "Email",
 *     cell: (info) => createCopyableCell(info.getValue()),
 *   }),
 *   columnHelper.accessor("orderId", {
 *     header: "Order No",
 *     cell: (info) => createCopyableCell(info.getValue(), { 
 *       tooltip: "Copy order number" 
 *     }),
 *   }),
 * ];
 * ```
 */
export function createCopyableCell(
    value: string | number,
    options?: Omit<CopyableCellProps, "value">
) {
    return <CopyableCell value={value} {...options} />;
}
