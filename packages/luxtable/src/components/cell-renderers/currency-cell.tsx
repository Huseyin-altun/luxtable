"use client";














export interface CurrencyCellProps {
    
    value: number;
    
    currency?: string;
    
    locale?: string;
}


export function CurrencyCell({ value, currency = "TRY", locale = "tr-TR" }: CurrencyCellProps) {
    const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);

    return <span className="font-medium text-[hsl(var(--lux-table-cell-foreground))]">{formatted}</span>;
}
