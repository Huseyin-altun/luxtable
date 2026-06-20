"use client";













export interface DateCellProps {
    
    value: string | Date;
    
    format?: "short" | "long" | "relative";
    
    locale?: string;
}


export function DateCell({ value, format = "short", locale = "en-US" }: DateCellProps) {
    const date = typeof value === "string" ? new Date(value) : value;

    
    if (isNaN(date.getTime())) {
        return <span className="text-[hsl(var(--lux-table-cell-muted))]">-</span>;
    }

    let formatted: string;

    switch (format) {
        case "long":
            formatted = date.toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            break;
        case "relative": {
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) formatted = "Today";
            else if (diffDays === 1) formatted = "Yesterday";
            else if (diffDays < 7) formatted = `${diffDays} days ago`;
            else formatted = date.toLocaleDateString(locale);
            break;
        }
        default:
            formatted = date.toLocaleDateString(locale);
    }

    return <span className="text-[hsl(var(--lux-table-cell-foreground))]">{formatted}</span>;
}
