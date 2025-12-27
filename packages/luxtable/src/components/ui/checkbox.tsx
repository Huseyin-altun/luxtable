"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ============================================================================
// Checkbox Component
// ============================================================================

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Checkbox indeterminate state (some selected) */
    indeterminate?: boolean;
    /** Label text */
    label?: string;
}

/**
 * Checkbox - Modern checkbox component
 * 
 * Designed for row selection, supports indeterminate state.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isSelected}
 *   onChange={(e) => setSelected(e.target.checked)}
 *   indeterminate={someSelected}
 * />
 * ```
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, indeterminate, label, id, ...props }, ref) => {
        const internalRef = React.useRef<HTMLInputElement>(null);
        const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

        React.useEffect(() => {
            if (resolvedRef.current) {
                resolvedRef.current.indeterminate = indeterminate ?? false;
            }
        }, [resolvedRef, indeterminate]);

        const checkboxId = id || React.useId();

        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={checkboxId}
                    ref={resolvedRef}
                    className={cn(
                        // Base styles
                        "h-4 w-4 shrink-0 rounded border cursor-pointer",
                        "transition-all duration-200 ease-in-out",

                        // Border & background
                        "border-slate-300 dark:border-slate-600",
                        "bg-white dark:bg-slate-900",

                        // Checked state
                        "checked:bg-blue-600 checked:border-blue-600",
                        "dark:checked:bg-blue-500 dark:checked:border-blue-500",

                        // Focus state
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0",

                        // Hover state
                        "hover:border-blue-500 dark:hover:border-blue-400",

                        // Disabled state
                        "disabled:cursor-not-allowed disabled:opacity-50",

                        // Indeterminate visual indicator via accent
                        "accent-blue-600 dark:accent-blue-500",

                        className
                    )}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
