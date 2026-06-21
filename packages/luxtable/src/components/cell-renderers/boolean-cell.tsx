"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const booleanVariants = cva("font-medium inline-flex items-center gap-1", {
    variants: {
        value: {
            true: "text-[hsl(var(--lux-boolean-true))]",
            false: "text-[hsl(var(--lux-boolean-false))]",
        },
    },
});

export interface BooleanCellProps extends React.HTMLAttributes<HTMLSpanElement>, Omit<VariantProps<typeof booleanVariants>, "value"> {
    value: boolean;
    trueLabel?: string;
    falseLabel?: string;
}

export function BooleanCell({
    value,
    trueLabel = "Yes",
    falseLabel = "No",
    className,
    ...props
}: BooleanCellProps) {
    return (
        <span 
            className={cn(booleanVariants({ value }), className)}
            {...props}
        >
            {value ? trueLabel : falseLabel}
        </span>
    );
}
