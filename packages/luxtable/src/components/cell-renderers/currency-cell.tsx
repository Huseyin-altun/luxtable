"use client";

import { cn } from "../../lib/utils";

export interface CurrencyCellProps extends React.HTMLAttributes<HTMLSpanElement> {
    
    value: number;
    
    currency?: string;
    
    locale?: string;
}


export function CurrencyCell({ value, currency = "TRY", locale = "tr-TR", className, ...props }: CurrencyCellProps) {
    const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);

    return (
        <span 
            className={cn("font-medium text-[hsl(var(--lux-table-cell-foreground))]", className)}
            {...props}
        >
            {formatted}
        </span>
    );
}
