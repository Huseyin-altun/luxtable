"use client";

export interface BooleanCellProps {
    value: boolean;
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
}

export function BooleanCell({
    value,
    trueLabel = "Yes",
    falseLabel = "No",
    trueColor = "text-[hsl(var(--lux-boolean-true))]",
    falseColor = "text-[hsl(var(--lux-boolean-false))]",
}: BooleanCellProps) {
    return (
        <span className={`font-medium ${value ? trueColor : falseColor}`}>
            {value ? trueLabel : falseLabel}
        </span>
    );
}
