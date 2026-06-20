"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { StatusCell } from "../cell-renderers/status-cell";
import { cn } from "../../lib/utils";
import { format } from "date-fns";





interface ColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
    data?: TData[];
}


function detectFilterType<TData, TValue>(
    column: Column<TData, TValue>,
    data?: TData[]
): "text" | "select" | "date" | "slider" | "status" {
    
    const meta = column.columnDef.meta as { filterVariant?: "text" | "select" | "date" | "slider" | "status" };
    if (meta?.filterVariant) {
        return meta.filterVariant;
    }

    
    const columnId = column.id.toLowerCase();
    const accessorKey = 'accessorKey' in column.columnDef ? String(column.columnDef.accessorKey || '').toLowerCase() : '';

    // Check for date columns
    const datePatterns = ['date', 'createdat', 'updatedat', 'joindate', 'startdate', 'enddate', 'birthdate', 'publishedat'];
    if (datePatterns.some(pattern => columnId.includes(pattern) || accessorKey.includes(pattern))) {
        return "date";
    }

    
    const statusPatterns = ['status', 'state', 'stage', 'phase'];
    if (statusPatterns.some(pattern => columnId.includes(pattern) || accessorKey.includes(pattern))) {
        return "status";
    }

    
    const numericPatterns = ['salary', 'price', 'amount', 'cost', 'revenue', 'total', 'balance', 'fee'];
    if (numericPatterns.some(pattern => columnId.includes(pattern) || accessorKey.includes(pattern))) {
        return "slider";
    }

    
    if (data && data.length > 0) {
        const firstValue = column.getFacetedUniqueValues().keys().next().value;
        if (firstValue !== undefined) {
            
            if (typeof firstValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(firstValue)) {
                const date = new Date(firstValue);
                if (!isNaN(date.getTime())) {
                    return "date";
                }
            }
            
            if (typeof firstValue === 'number') {
                return "slider";
            }
            
            const statusValues = ['active', 'inactive', 'pending', 'completed', 'cancelled', 'approved', 'rejected'];
            if (typeof firstValue === 'string' && statusValues.includes(firstValue.toLowerCase())) {
                return "status";
            }
        }
    }

    
    return "text";
}


export function ColumnFilter<TData, TValue>({ column, data }: ColumnFilterProps<TData, TValue>) {
    const columnFilterValue = column.getFilterValue();
    const filterVariant = detectFilterType(column, data);

    
    const sortedUniqueValues = React.useMemo(() => {
        if (filterVariant !== "select" && filterVariant !== "status") return [];

        const values = new Set<string>();
        column.getFacetedUniqueValues().forEach((_, key) => {
            if (key !== null && key !== undefined) {
                values.add(String(key));
            }
        });
        return Array.from(values).sort();
    }, [column, filterVariant]);

    
    if (filterVariant === "date") {
        const dateRange = (columnFilterValue as { from?: string; to?: string }) || {};
        const [fromDate, setFromDate] = React.useState<Date | undefined>(
            dateRange.from ? new Date(dateRange.from) : undefined
        );
        const [toDate, setToDate] = React.useState<Date | undefined>(
            dateRange.to ? new Date(dateRange.to) : undefined
        );
        const [fromOpen, setFromOpen] = React.useState(false);
        const [toOpen, setToOpen] = React.useState(false);

        React.useEffect(() => {
            if (columnFilterValue) {
                const range = columnFilterValue as { from?: string; to?: string };
                setFromDate(range.from ? new Date(range.from) : undefined);
                setToDate(range.to ? new Date(range.to) : undefined);
            } else {
                setFromDate(undefined);
                setToDate(undefined);
            }
        }, [columnFilterValue]);

        const handleFromDateChange = (date: Date | undefined) => {
            setFromDate(date);
            const newRange = {
                from: date ? format(date, "yyyy-MM-dd") : undefined,
                to: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
            };
            column.setFilterValue(
                newRange.from || newRange.to ? newRange : undefined
            );
        };

        const handleToDateChange = (date: Date | undefined) => {
            setToDate(date);
            const newRange = {
                from: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
                to: date ? format(date, "yyyy-MM-dd") : undefined,
            };
            column.setFilterValue(
                newRange.from || newRange.to ? newRange : undefined
            );
        };

        const clearDates = () => {
            setFromDate(undefined);
            setToDate(undefined);
            column.setFilterValue(undefined);
        };

        return (
            <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                <Popover open={fromOpen} onOpenChange={setFromOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "h-8 text-xs w-32 justify-start text-left font-normal",
                                !fromDate && "text-[hsl(var(--lux-toolbar-input-placeholder))]",
                                "border-[hsl(var(--lux-filter-border))]",
                                "bg-[hsl(var(--lux-filter-background))]",
                                "text-[hsl(var(--lux-filter-foreground))]"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {fromDate ? format(fromDate, "MMM dd, yyyy") : "From"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={handleFromDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <span className="text-xs text-[hsl(var(--lux-toolbar-icon))]">-</span>

                <Popover open={toOpen} onOpenChange={setToOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "h-8 text-xs w-32 justify-start text-left font-normal",
                                !toDate && "text-[hsl(var(--lux-toolbar-input-placeholder))]",
                                "border-[hsl(var(--lux-filter-border))]",
                                "bg-[hsl(var(--lux-filter-background))]",
                                "text-[hsl(var(--lux-filter-foreground))]"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {toDate ? format(toDate, "MMM dd, yyyy") : "To"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={handleToDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {(fromDate || toDate) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDates}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        );
    }

    
    if (filterVariant === "slider") {
        
        const numericValues = React.useMemo(() => {
            const values: number[] = [];
            column.getFacetedUniqueValues().forEach((_, key) => {
                if (typeof key === 'number') {
                    values.push(key);
                } else if (typeof key === 'string') {
                    const num = parseFloat(key);
                    if (!isNaN(num)) {
                        values.push(num);
                    }
                }
            });
            return values;
        }, [column]);

        const min = numericValues.length > 0 ? Math.min(...numericValues) : 0;
        const max = numericValues.length > 0 ? Math.max(...numericValues) : 100;
        const avg = numericValues.length > 0 ? (min + max) / 2 : 50;

        const sliderValue = (columnFilterValue as { min?: number; max?: number }) || { min: min, max: max };
        const [range, setRange] = React.useState<number[]>([
            sliderValue.min ?? min,
            sliderValue.max ?? max
        ]);

        React.useEffect(() => {
            if (columnFilterValue) {
                const val = columnFilterValue as { min?: number; max?: number };
                setRange([val.min ?? min, val.max ?? max]);
            } else {
                setRange([min, max]);
            }
        }, [columnFilterValue, min, max]);

        const handleSliderChange = (newRange: number[]) => {
            setRange(newRange);
            column.setFilterValue({ min: newRange[0], max: newRange[1] });
        };

        const clearSlider = () => {
            setRange([min, max]);
            column.setFilterValue(undefined);
        };

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-8 text-xs w-full justify-start",
                            "border-[hsl(var(--lux-filter-border))]",
                            "bg-[hsl(var(--lux-filter-background))]",
                            "text-[hsl(var(--lux-filter-foreground))]"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>
                            {range[0] === min && range[1] === max
                                ? "All"
                                : `${Math.round(range[0])} - ${Math.round(range[1])}`}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[hsl(var(--lux-filter-foreground))]">Range</span>
                            <span className="text-[hsl(var(--lux-toolbar-icon))]">
                                {Math.round(range[0])} - {Math.round(range[1])}
                            </span>
                        </div>
                        <Slider
                            value={range}
                            onValueChange={handleSliderChange}
                            min={min}
                            max={max}
                            step={(max - min) / 100}
                        />
                        <div className="flex items-center justify-between text-xs text-[hsl(var(--lux-toolbar-icon))]">
                            <span>Min: {Math.round(min)}</span>
                            <span>Avg: {Math.round(avg)}</span>
                            <span>Max: {Math.round(max)}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSlider}
                            className="w-full h-7 text-xs"
                        >
                            Clear
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    
    if (filterVariant === "status") {
        const selectedStatuses = (columnFilterValue as string[]) || [];
        const [open, setOpen] = React.useState(false);

        const toggleStatus = (status: string) => {
            const newSelection = selectedStatuses.includes(status)
                ? selectedStatuses.filter(s => s !== status)
                : [...selectedStatuses, status];
            column.setFilterValue(newSelection.length > 0 ? newSelection : undefined);
        };

        const clearStatuses = () => {
            column.setFilterValue(undefined);
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-8 text-xs w-full justify-start",
                            "border-[hsl(var(--lux-filter-border))]",
                            "bg-[hsl(var(--lux-filter-background))]",
                            "text-[hsl(var(--lux-filter-foreground))]"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                    >
                        <span>
                            {selectedStatuses.length === 0
                                ? "All Status"
                                : `${selectedStatuses.length} selected`}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="start" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[hsl(var(--lux-filter-foreground))]">Status</span>
                            {selectedStatuses.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearStatuses}
                                    className="h-6 text-xs"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            {sortedUniqueValues.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => toggleStatus(status)}
                                    className={cn(
                                        "w-full flex items-center gap-2 p-2 rounded-md text-left text-xs transition-colors",
                                        selectedStatuses.includes(status)
                                            ? "bg-[hsl(var(--lux-focus-ring))]/20"
                                            : "hover:bg-[hsl(var(--lux-table-row-hover))]"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStatuses.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                        className="h-3 w-3"
                                    />
                                    <StatusCell value={status} />
                                </button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    
    if (filterVariant === "select") {
        return (
            <Select
                value={(columnFilterValue ?? "") as string}
                onValueChange={(value) => column.setFilterValue(value === "__all__" ? undefined : value)}
            >
                <SelectTrigger
                    className={cn(
                        "h-8 text-xs",
                        "border-[hsl(var(--lux-filter-border))]",
                        "bg-[hsl(var(--lux-filter-background))]",
                        "text-[hsl(var(--lux-filter-foreground))]"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {sortedUniqueValues.map((value) => (
                        <SelectItem key={value} value={value}>
                            {value}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    
    return (
        <Input
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value || undefined)}
            placeholder="Filter..."
            className={cn(
                "h-8 text-xs",
                "border-[hsl(var(--lux-filter-border))]",
                "bg-[hsl(var(--lux-filter-background))]",
                "text-[hsl(var(--lux-filter-foreground))]",
                "placeholder:text-[hsl(var(--lux-toolbar-input-placeholder))]"
            )}
            onClick={(e) => e.stopPropagation()}
        />
    );
}

