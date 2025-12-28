"use client";

import * as React from "react";
import { cn } from "../../lib/utils";


// ============================================================================
// Table Root
// ============================================================================

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

// ============================================================================
// Table Header
// ============================================================================

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn("[&_tr]:border-b [&_tr]:border-slate-200 dark:[&_tr]:border-slate-800", className)}
        {...props}
    />
));
TableHeader.displayName = "TableHeader";

// ============================================================================
// Table Body
// ============================================================================

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

// ============================================================================
// Table Footer
// ============================================================================

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";

// ============================================================================
// Table Row
// ============================================================================

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-slate-200 dark:border-slate-800 transition-colors",
            "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
            "data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

// ============================================================================
// Table Head (th)
// ============================================================================

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
    return (
        <th
            ref={ref}
            className={cn(
                "h-10 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400",
                "[&:has([role=checkbox])]:pr-0",
                "group", // Enable group-hover for action buttons
                className
            )}
            {...props}
        >
            {children}
        </th>
    );
});
TableHead.displayName = "TableHead";



// ============================================================================
// Table Cell (td)
// ============================================================================

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "p-4 align-middle [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
));
TableCell.displayName = "TableCell";

// ============================================================================
// Table Caption
// ============================================================================

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)}
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
