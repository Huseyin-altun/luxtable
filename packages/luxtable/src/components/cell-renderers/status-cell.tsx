"use client";
















const createStatusColor = (bg: string, text: string, darkBg: string, darkText: string) => ({
    bg,
    text,
    darkBg,
    darkText,
});


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
    
    colors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
    
    className?: string;
}


export function StatusCell({ value, colors, className }: StatusCellProps) {
    const mergedColors = { ...defaultStatusColors, ...colors };

    
    const normalizedValue = value.toLowerCase();
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    
    const colorConfig = mergedColors[normalizedValue] || mergedColors[value] || mergedColors[capitalizedValue];

    
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
