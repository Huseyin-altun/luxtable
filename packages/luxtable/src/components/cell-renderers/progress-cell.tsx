"use client";

import { cn } from "../../lib/utils";

export interface ProgressCellProps extends React.HTMLAttributes<HTMLDivElement> {
    
    value: number;
    
    barColor?: string;
    
    bgColor?: string;
    
    showLabel?: boolean;
}


export function ProgressCell({
    value,
    barColor = "bg-[hsl(var(--lux-progress-bar))]",
    bgColor = "bg-[hsl(var(--lux-progress-bg))]",
    showLabel = false,
    className,
    ...props
}: ProgressCellProps) {
    
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div 
            className={cn("flex items-center gap-2", className)}
            {...props}
        >
            <div className={cn("w-full rounded-full h-2.5", bgColor)}>
                <div
                    className={cn("h-2.5 rounded-full transition-all", barColor)}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-xs text-[hsl(var(--lux-progress-text))] w-8">
                    {value}%
                </span>
            )}
        </div>
    );
}
