"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "../../lib/utils";

export type CalendarProps = DayPickerProps;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    "border border-[hsl(var(--lux-filter-border))] rounded-md",
                    "hover:bg-[hsl(var(--lux-table-row-hover))]",
                    "inline-flex items-center justify-center"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-[hsl(var(--lux-toolbar-icon))] rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[hsl(var(--lux-table-row-hover))]/50 [&:has([aria-selected])]:bg-[hsl(var(--lux-focus-ring))]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    "rounded-md hover:bg-[hsl(var(--lux-table-row-hover))]",
                    "inline-flex items-center justify-center"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-[hsl(var(--lux-focus-ring))] text-[hsl(var(--lux-filter-background))] hover:bg-[hsl(var(--lux-focus-ring))] hover:text-[hsl(var(--lux-filter-background))] focus:bg-[hsl(var(--lux-focus-ring))] focus:text-[hsl(var(--lux-filter-background))]",
                day_today: "bg-[hsl(var(--lux-filter-border))] text-[hsl(var(--lux-filter-foreground))]",
                day_outside:
                    "day-outside text-[hsl(var(--lux-toolbar-icon))] opacity-50 aria-selected:bg-[hsl(var(--lux-table-row-hover))]/50 aria-selected:text-[hsl(var(--lux-toolbar-icon))] aria-selected:opacity-30",
                day_disabled: "text-[hsl(var(--lux-toolbar-icon))] opacity-50",
                day_range_middle:
                    "aria-selected:bg-[hsl(var(--lux-focus-ring))]/20 aria-selected:text-[hsl(var(--lux-filter-foreground))]",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };

