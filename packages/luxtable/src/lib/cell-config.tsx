"use client";

import * as React from "react";
import { CellContext } from "@tanstack/react-table";
import { StatusCell, defaultStatusColors } from "../components/cell-renderers/status-cell";
import { ProgressCell } from "../components/cell-renderers/progress-cell";
import { BooleanCell } from "../components/cell-renderers/boolean-cell";
import { DateCell } from "../components/cell-renderers/date-cell";
import { CurrencyCell } from "../components/cell-renderers/currency-cell";
import { CopyableCell } from "../components/cell-renderers/copyable-cell";









export type CellRendererType =
    | "status"
    | "progress"
    | "boolean"
    | "date"
    | "currency"
    | "copyable"
    | "custom";


export interface StatusCellConfig {
    type: "status";
    
    colors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
}


export interface ProgressCellConfig {
    type: "progress";
    
    barColor?: string;
    
    showLabel?: boolean;
}


export interface BooleanCellConfig {
    type: "boolean";
    
    trueLabel?: string;
    
    falseLabel?: string;
    
    trueColor?: string;
    
    falseColor?: string;
}


export interface DateCellConfig {
    type: "date";
    
    format?: "short" | "long" | "relative";
    
    locale?: string;
}


export interface CurrencyCellConfig {
    type: "currency";
    
    currency?: string;
    
    locale?: string;
}


export interface CopyableCellConfig {
    type: "copyable";
    
    alwaysShowIcon?: boolean;
    
    tooltip?: string;
    
    onCopy?: (value: string) => void;
}


export interface CustomCellConfig {
    type: "custom";
    
    render: (context: CellContext<any, unknown>) => React.ReactNode;
}


export type FieldCellConfig =
    | StatusCellConfig
    | ProgressCellConfig
    | BooleanCellConfig
    | DateCellConfig
    | CurrencyCellConfig
    | CopyableCellConfig
    | CustomCellConfig;


export interface GlobalCellConfig {
    
    fields?: Record<string, FieldCellConfig>;
    
    defaultStatusColors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
    
    autoDetect?: boolean;
    
    patterns?: {
        
        status?: string[];
        
        date?: string[];
        
        currency?: string[];
        
        boolean?: string[];
        
        copyable?: string[];
    };
}


const defaultPatterns = {
    status: ['status', 'state', 'stage', 'phase'],
    date: ['date', 'createdAt', 'updatedAt', 'joinDate', 'startDate', 'endDate', 'birthDate', 'publishedAt'],
    currency: ['price', 'amount', 'salary', 'cost', 'revenue', 'total', 'balance', 'fee'],
    boolean: ['isActive', 'isVerified', 'isEnabled', 'isDeleted', 'isPublished', 'isPublic'],
    copyable: ['id', 'email', 'phone', 'code', 'token', 'reference', 'orderId'],
};


function detectFieldTypeFromName(fieldName: string, patterns: GlobalCellConfig['patterns']): CellRendererType | null {
    const name = fieldName.toLowerCase();
    const mergedPatterns = {
        status: [...defaultPatterns.status, ...(patterns?.status || [])],
        date: [...defaultPatterns.date, ...(patterns?.date || [])],
        currency: [...defaultPatterns.currency, ...(patterns?.currency || [])],
        boolean: [...defaultPatterns.boolean, ...(patterns?.boolean || [])],
        copyable: [...defaultPatterns.copyable, ...(patterns?.copyable || [])],
    };

    
    if (mergedPatterns.status.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'status';
    }

    
    if (mergedPatterns.date.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'date';
    }

    
    if (mergedPatterns.currency.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'currency';
    }

    
    if (mergedPatterns.boolean.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'boolean';
    }

    
    if (mergedPatterns.copyable.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'copyable';
    }

    return null;
}


function detectFieldTypeFromValue(value: unknown): CellRendererType | null {
    if (value === null || value === undefined) return null;

    
    if (typeof value === 'boolean') {
        return 'boolean';
    }

    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return 'date';
        }
    }
    if (value instanceof Date) {
        return 'date';
    }

    
    if (typeof value === 'number') {
        
        return null;
    }

    
    if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        const statusValues = ['active', 'inactive', 'pending', 'completed', 'cancelled', 'approved', 'rejected'];
        if (statusValues.includes(lowerValue)) {
            return 'status';
        }
    }

    return null;
}


export function getFieldConfig(
    fieldName: string,
    value: unknown,
    config?: GlobalCellConfig
): FieldCellConfig | null {
    
    if (config?.fields?.[fieldName]) {
        return config.fields[fieldName];
    }

    
    if (config?.autoDetect === false) {
        return null;
    }

    
    const nameType = detectFieldTypeFromName(fieldName, config?.patterns);
    if (nameType) {
        
        switch (nameType) {
            case 'status':
                return { type: 'status' };
            case 'date':
                return { type: 'date', format: 'short' };
            case 'currency':
                return { type: 'currency', currency: 'USD' };
            case 'boolean':
                return { type: 'boolean' };
            case 'copyable':
                return { type: 'copyable' };
        }
    }

    
    const valueType = detectFieldTypeFromValue(value);
    if (valueType) {
        switch (valueType) {
            case 'status':
                return { type: 'status' };
            case 'date':
                return { type: 'date', format: 'short' };
            case 'boolean':
                return { type: 'boolean' };
        }
    }

    return null;
}


export const defaultGlobalCellConfig: GlobalCellConfig = {
    defaultStatusColors,
    autoDetect: true,
    patterns: defaultPatterns,
};


export function renderCell<TData>(
    context: CellContext<TData, unknown>,
    fieldName: string,
    config?: GlobalCellConfig
): React.ReactNode {
    const value = context.getValue();

    
    const fieldConfig = getFieldConfig(fieldName, value, config);

    if (!fieldConfig) {
        
        if (value === null || value === undefined) {
            return <span className="text-[hsl(var(--lux-table-cell-foreground))]">-</span>;
        }
        return <span className="text-[hsl(var(--lux-table-cell-foreground))]">{String(value)}</span>;
    }

    
    if (fieldConfig.type === "custom") {
        return fieldConfig.render(context);
    }

    
    if (fieldConfig.type === "status") {
        const statusValue = String(value);
        const colors = {
            ...config?.defaultStatusColors,
            ...defaultStatusColors,
            ...fieldConfig.colors,
        };
        
        return <StatusCell value={statusValue} colors={colors} />;
    }

    
    if (fieldConfig.type === "progress") {
        return (
            <ProgressCell
                value={Number(value)}
                barColor={fieldConfig.barColor}
                showLabel={fieldConfig.showLabel ?? false}
            />
        );
    }

    
    if (fieldConfig.type === "boolean") {
        return (
            <BooleanCell
                value={Boolean(value)}
                trueLabel={fieldConfig.trueLabel}
                falseLabel={fieldConfig.falseLabel}
                trueColor={fieldConfig.trueColor}
                falseColor={fieldConfig.falseColor}
            />
        );
    }

    
    if (fieldConfig.type === "date") {
        return (
            <DateCell
                value={value as string | Date}
                format={fieldConfig.format}
                locale={fieldConfig.locale}
            />
        );
    }

    
    if (fieldConfig.type === "currency") {
        return (
            <CurrencyCell
                value={Number(value)}
                currency={fieldConfig.currency || "USD"}
                locale={fieldConfig.locale || "en-US"}
            />
        );
    }

    
    if (fieldConfig.type === "copyable") {
        return (
            <CopyableCell
                value={String(value)}
                alwaysShowIcon={fieldConfig.alwaysShowIcon}
                tooltip={fieldConfig.tooltip}
                onCopy={fieldConfig.onCopy}
            />
        );
    }

    
    if (value === null || value === undefined) {
        return <span className="text-[hsl(var(--lux-table-cell-foreground))]">-</span>;
    }
    return <span className="text-[hsl(var(--lux-table-cell-foreground))]">{String(value)}</span>;
}

