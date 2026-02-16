import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    EyeOff,
    MoreVertical,
    X,
} from "lucide-react"

import { Column } from "@tanstack/react-table"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface LuxDataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

/**
 * Column header component with sort indicator and actions menu
 */
export function LuxDataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: LuxDataTableColumnHeaderProps<TData, TValue>) {
    const isSorted = column.getIsSorted()
    const canSort = column.getCanSort()

    // Sort icon component
    const SortIndicator = () => {
        if (isSorted === "desc") {
            return <ArrowDown className="h-4 w-4 text-[hsl(var(--lux-sort-active))]" />
        }
        if (isSorted === "asc") {
            return <ArrowUp className="h-4 w-4 text-[hsl(var(--lux-sort-active))]" />
        }
        // Default - show subtle icon to indicate sortable
        if (canSort) {
            return <ArrowUpDown className="h-4 w-4 text-[hsl(var(--lux-sort-idle))]" />
        }
        return null
    }

    // If sorting is not enabled, just show the title
    if (!canSort) {
        return (
            <span className={cn("text-sm font-medium", className)}>
                {title}
            </span>
        )
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Sort indicator icon */}
            <SortIndicator />

            {/* Title */}
            <span className="text-sm font-medium">{title}</span>

            {/* Actions dropdown menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">Column actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); column.toggleSorting(false); }}>
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Sort Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); column.toggleSorting(true); }}>
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Sort Descending
                    </DropdownMenuItem>
                    {isSorted && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); column.clearSorting(); }}>
                                <X className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Clear sorting
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); column.toggleVisibility(false); }}>
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide column
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
