import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
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

export function LuxDataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: LuxDataTableColumnHeaderProps<TData, TValue>) {
    const isSorted = column.getIsSorted()

    // If sorting is not enabled, just show the title
    if (!column.getCanSort()) {
        return (
            <div className={cn("flex items-center justify-between", className)}>
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
        )
    }

    // Sortable column - clickable title for quick sort + actions menu
    return (
        <div className={cn("flex items-center justify-between gap-1", className)}>
            {/* Clickable title + sort icon for quick sorting */}
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 hover:bg-accent"
                onClick={() => column.toggleSorting(isSorted === "asc")}
            >
                <span>{title}</span>
                {isSorted === "desc" ? (
                    <ArrowDown className="ml-1.5 h-4 w-4 text-primary" />
                ) : isSorted === "asc" ? (
                    <ArrowUp className="ml-1.5 h-4 w-4 text-primary" />
                ) : (
                    <ChevronsUpDown className="ml-1.5 h-4 w-4 text-muted-foreground/50" />
                )}
            </Button>

            {/* Actions dropdown menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">Column actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Sort Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Sort Descending
                    </DropdownMenuItem>
                    {isSorted && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => column.clearSorting()}>
                                <X className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Clear sorting
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide column
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

