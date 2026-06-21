"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusVariants = cva("px-2 py-1 rounded-full text-xs font-medium", {
    variants: {
        variant: {
            active: "bg-[hsl(var(--lux-status-active-bg))] text-[hsl(var(--lux-status-active-text))]",
            inactive: "bg-[hsl(var(--lux-status-inactive-bg))] text-[hsl(var(--lux-status-inactive-text))]",
            pending: "bg-[hsl(var(--lux-status-pending-bg))] text-[hsl(var(--lux-status-pending-text))]",
            completed: "bg-[hsl(var(--lux-status-completed-bg))] text-[hsl(var(--lux-status-completed-text))]",
            cancelled: "bg-[hsl(var(--lux-status-cancelled-bg))] text-[hsl(var(--lux-status-cancelled-text))]",
            default: "bg-[hsl(var(--lux-status-default-bg))] text-[hsl(var(--lux-status-default-text))]",
        }
    },
    defaultVariants: {
        variant: "default",
    }
});

type StatusVariant = VariantProps<typeof statusVariants>["variant"];

export interface StatusCellProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Status value to display (e.g., "Active", "Pending") */
    value: string;

    colors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
}

export function StatusCell({ value, colors, className, ...props }: StatusCellProps) {
    const normalizedValue = value.toLowerCase();
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    const colorConfig = colors?.[normalizedValue] || colors?.[value] || colors?.[capitalizedValue];

    const displayValue = capitalizedValue;

    if (colorConfig) {
        return (
            <span
                className={cn("px-2 py-1 rounded-full text-xs font-medium", colorConfig.bg, colorConfig.text, className)}
                {...props}
            >
                {displayValue}
            </span>
        );
    }

    const predefinedVariants: Record<string, StatusVariant> = {
        active: "active",
        inactive: "inactive",
        pending: "pending",
        completed: "completed",
        cancelled: "cancelled",
    };

    const variant = predefinedVariants[normalizedValue] || "default";

    return (
        <span
            className={cn(statusVariants({ variant }), className)}
            {...props}
        >
            {displayValue}
        </span>
    );
}
