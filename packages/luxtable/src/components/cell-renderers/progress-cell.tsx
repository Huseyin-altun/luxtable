"use client";














export interface ProgressCellProps {
    
    value: number;
    
    barColor?: string;
    
    bgColor?: string;
    
    showLabel?: boolean;
    
    className?: string;
}


export function ProgressCell({
    value,
    barColor = "bg-[hsl(var(--lux-progress-bar))]",
    bgColor = "bg-[hsl(var(--lux-progress-bg))]",
    showLabel = false,
    className,
}: ProgressCellProps) {
    
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
                <span className="text-xs text-[hsl(var(--lux-progress-text))] w-8">
                    {value}%
                </span>
            )}
        </div>
    );
}
