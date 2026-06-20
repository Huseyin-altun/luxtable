"use client";

import * as React from "react";
import { cn } from "../../lib/utils";






const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
));
Table.displayName = "Table";





const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn("[&_tr]:border-b [&_tr]:border-[hsl(var(--lux-table-header-border))]", className)}
        {...props}
    />
));
TableHeader.displayName = "TableHeader";





const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";





const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t border-[hsl(var(--lux-table-footer-border))] bg-[hsl(var(--lux-table-footer-background))] text-[hsl(var(--lux-table-footer-foreground))] font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";





const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-[hsl(var(--lux-table-row-border))] transition-colors",
            "hover:bg-[hsl(var(--lux-table-row-hover))]",
            "data-[state=selected]:bg-[hsl(var(--lux-table-row-selected))]",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";





const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
    return (
        <th
            ref={ref}
            className={cn(
                "h-10 px-4 text-left align-middle font-medium text-[hsl(var(--lux-table-header-foreground))]",
                "[&:has([role=checkbox])]:pr-0",
                "group", 
                className
            )}
            {...props}
        >
            {children}
        </th>
    );
});
TableHead.displayName = "TableHead";







const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "p-4 align-middle text-[hsl(var(--lux-table-cell-foreground))] [&:has([role=checkbox])]:pr-0",
            "[&>*]:text-[hsl(var(--lux-table-cell-foreground))]",
            "[&_*]:text-[hsl(var(--lux-table-cell-foreground))]",
            className
        )}
        style={{
            color: 'hsl(var(--lux-table-cell-foreground))',
            ...props.style,
        }}
        {...props}
    />
));
TableCell.displayName = "TableCell";





const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-[hsl(var(--lux-table-cell-muted))]", className)}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};
