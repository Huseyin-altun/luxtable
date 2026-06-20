"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";














export interface CopyableCellProps {
    
    value: string | number;
    
    feedbackDuration?: number;
    
    onCopy?: (value: string) => void;
    
    className?: string;
    
    tooltip?: string;
    
    alwaysShowIcon?: boolean;
}


export function CopyableCell({
    value,
    feedbackDuration = 2000,
    onCopy,
    className,
    tooltip = "Click to copy",
    alwaysShowIcon = false,
}: CopyableCellProps) {
    const [copied, setCopied] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const textToCopy = String(value);

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            onCopy?.(textToCopy);

            setTimeout(() => {
                setCopied(false);
            }, feedbackDuration);
        } catch (err) {
            console.error("Copy error:", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={tooltip}
            className={`
                group inline-flex items-center gap-2 
                px-2 py-1 -mx-2 -my-1
                rounded-md
                transition-all duration-200
                hover:bg-slate-100 dark:hover:bg-slate-800
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                cursor-pointer
                ${className || ""}
            `}
        >
            <span className="select-none text-[hsl(var(--lux-table-cell-foreground))]">{value}</span>

            {}
            <span
                className={`
                    inline-flex items-center justify-center
                    transition-all duration-200
                    ${alwaysShowIcon || isHovered || copied ? "opacity-100" : "opacity-0"}
                `}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                )}
            </span>
        </button>
    );
}


export function createCopyableCell(
    value: string | number,
    options?: Omit<CopyableCellProps, "value">
) {
    return <CopyableCell value={value} {...options} />;
}
