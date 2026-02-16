"use client";

import * as React from "react";
import { CellContext } from "@tanstack/react-table";
import { StatusCell, defaultStatusColors } from "../components/cell-renderers/status-cell";
import { ProgressCell } from "../components/cell-renderers/progress-cell";
import { BooleanCell } from "../components/cell-renderers/boolean-cell";
import { DateCell } from "../components/cell-renderers/date-cell";
import { CurrencyCell } from "../components/cell-renderers/currency-cell";
import { CopyableCell } from "../components/cell-renderers/copyable-cell";

// ============================================================================
// GLOBAL CELL CONFIG - Global Hücre Yapılandırması
// ============================================================================
// Bu sistem, field bazlı otomatik cell renderer'ları tanımlamanıza olanak sağlar.
// Örneğin "status" field'ı için otomatik olarak StatusCell kullanılabilir.
// ============================================================================

/**
 * Cell renderer tipi
 */
export type CellRendererType =
    | "status"
    | "progress"
    | "boolean"
    | "date"
    | "currency"
    | "copyable"
    | "custom";

/**
 * Status cell config
 */
export interface StatusCellConfig {
    type: "status";
    /** Custom status colors - default status'leri override eder veya üzerine ekler */
    colors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
}

/**
 * Progress cell config
 */
export interface ProgressCellConfig {
    type: "progress";
    /** Bar color */
    barColor?: string;
    /** Show percentage label */
    showLabel?: boolean;
}

/**
 * Boolean cell config
 */
export interface BooleanCellConfig {
    type: "boolean";
    /** True label */
    trueLabel?: string;
    /** False label */
    falseLabel?: string;
    /** True color classes */
    trueColor?: string;
    /** False color classes */
    falseColor?: string;
}

/**
 * Date cell config
 */
export interface DateCellConfig {
    type: "date";
    /** Date format */
    format?: "short" | "long" | "relative";
    /** Locale */
    locale?: string;
}

/**
 * Currency cell config
 */
export interface CurrencyCellConfig {
    type: "currency";
    /** Currency code (e.g., "USD", "EUR") */
    currency?: string;
    /** Locale */
    locale?: string;
}

/**
 * Copyable cell config
 */
export interface CopyableCellConfig {
    type: "copyable";
    /** Always show icon */
    alwaysShowIcon?: boolean;
    /** Tooltip text */
    tooltip?: string;
    /** Callback called after copying */
    onCopy?: (value: string) => void;
}

/**
 * Custom cell config
 */
export interface CustomCellConfig {
    type: "custom";
    /** Custom renderer function */
    render: (context: CellContext<any, unknown>) => React.ReactNode;
}

/**
 * Field cell config - her field için cell renderer tanımı
 */
export type FieldCellConfig =
    | StatusCellConfig
    | ProgressCellConfig
    | BooleanCellConfig
    | DateCellConfig
    | CurrencyCellConfig
    | CopyableCellConfig
    | CustomCellConfig;

/**
 * Global cell config - field bazlı cell renderer'ları tanımlar
 */
export interface GlobalCellConfig {
    /** Field bazlı cell config'leri - field adı -> config */
    fields?: Record<string, FieldCellConfig>;
    /** Default status colors - tüm status field'ları için geçerli */
    defaultStatusColors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
    /** Auto-detect field types from field names and values (default: true) */
    autoDetect?: boolean;
    /** Field name patterns for auto-detection */
    patterns?: {
        /** Field names that should be treated as status (default: ['status', 'state', 'stage']) */
        status?: string[];
        /** Field names that should be treated as date (default: ['date', 'createdAt', 'updatedAt', 'joinDate', 'startDate', 'endDate']) */
        date?: string[];
        /** Field names that should be treated as currency (default: ['price', 'amount', 'salary', 'cost', 'revenue', 'total']) */
        currency?: string[];
        /** Field names that should be treated as boolean (default: ['isActive', 'isVerified', 'isEnabled', 'isDeleted']) */
        boolean?: string[];
        /** Field names that should be treated as copyable (default: ['id', 'email', 'phone', 'code', 'token']) */
        copyable?: string[];
    };
}

/**
 * Default field name patterns for auto-detection
 */
const defaultPatterns = {
    status: ['status', 'state', 'stage', 'phase'],
    date: ['date', 'createdAt', 'updatedAt', 'joinDate', 'startDate', 'endDate', 'birthDate', 'publishedAt'],
    currency: ['price', 'amount', 'salary', 'cost', 'revenue', 'total', 'balance', 'fee'],
    boolean: ['isActive', 'isVerified', 'isEnabled', 'isDeleted', 'isPublished', 'isPublic'],
    copyable: ['id', 'email', 'phone', 'code', 'token', 'reference', 'orderId'],
};

/**
 * Detect field type from field name
 */
function detectFieldTypeFromName(fieldName: string, patterns: GlobalCellConfig['patterns']): CellRendererType | null {
    const name = fieldName.toLowerCase();
    const mergedPatterns = {
        status: [...defaultPatterns.status, ...(patterns?.status || [])],
        date: [...defaultPatterns.date, ...(patterns?.date || [])],
        currency: [...defaultPatterns.currency, ...(patterns?.currency || [])],
        boolean: [...defaultPatterns.boolean, ...(patterns?.boolean || [])],
        copyable: [...defaultPatterns.copyable, ...(patterns?.copyable || [])],
    };

    // Check status patterns
    if (mergedPatterns.status.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'status';
    }

    // Check date patterns
    if (mergedPatterns.date.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'date';
    }

    // Check currency patterns
    if (mergedPatterns.currency.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'currency';
    }

    // Check boolean patterns
    if (mergedPatterns.boolean.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'boolean';
    }

    // Check copyable patterns
    if (mergedPatterns.copyable.some(pattern => name.includes(pattern.toLowerCase()))) {
        return 'copyable';
    }

    return null;
}

/**
 * Detect field type from value
 */
function detectFieldTypeFromValue(value: unknown): CellRendererType | null {
    if (value === null || value === undefined) return null;

    // Boolean
    if (typeof value === 'boolean') {
        return 'boolean';
    }

    // Date string or Date object
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return 'date';
        }
    }
    if (value instanceof Date) {
        return 'date';
    }

    // Number - could be currency if large
    if (typeof value === 'number') {
        // Could be currency, but we'll let patterns handle it
        return null;
    }

    // String - could be status if it's a known status value
    if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        const statusValues = ['active', 'inactive', 'pending', 'completed', 'cancelled', 'approved', 'rejected'];
        if (statusValues.includes(lowerValue)) {
            return 'status';
        }
    }

    return null;
}

/**
 * Get field config with auto-detection
 */
export function getFieldConfig(
    fieldName: string,
    value: unknown,
    config?: GlobalCellConfig
): FieldCellConfig | null {
    // First check explicit field config
    if (config?.fields?.[fieldName]) {
        return config.fields[fieldName];
    }

    // If auto-detect is disabled, return null
    if (config?.autoDetect === false) {
        return null;
    }

    // Auto-detect from field name
    const nameType = detectFieldTypeFromName(fieldName, config?.patterns);
    if (nameType) {
        // Create default config based on detected type
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

    // Auto-detect from value
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

/**
 * Default global cell config
 */
export const defaultGlobalCellConfig: GlobalCellConfig = {
    defaultStatusColors,
    autoDetect: true,
    patterns: defaultPatterns,
};

/**
 * Cell renderer'ı çalıştırır
 */
export function renderCell<TData>(
    context: CellContext<TData, unknown>,
    fieldName: string,
    config?: GlobalCellConfig
): React.ReactNode {
    const value = context.getValue();

    // Get field config (with auto-detection)
    const fieldConfig = getFieldConfig(fieldName, value, config);

    if (!fieldConfig) {
        // Config yoksa, default davranış
        if (value === null || value === undefined) {
            return <span className="text-[hsl(var(--lux-table-cell-foreground))]">-</span>;
        }
        return <span className="text-[hsl(var(--lux-table-cell-foreground))]">{String(value)}</span>;
    }

    // Custom renderer
    if (fieldConfig.type === "custom") {
        return fieldConfig.render(context);
    }

    // Status cell
    if (fieldConfig.type === "status") {
        const statusValue = String(value);
        const colors = {
            ...config?.defaultStatusColors,
            ...defaultStatusColors,
            ...fieldConfig.colors,
        };
        // StatusCell handles case-insensitive matching internally
        return <StatusCell value={statusValue} colors={colors} />;
    }

    // Progress cell
    if (fieldConfig.type === "progress") {
        return (
            <ProgressCell
                value={Number(value)}
                barColor={fieldConfig.barColor}
                showLabel={fieldConfig.showLabel ?? false}
            />
        );
    }

    // Boolean cell
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

    // Date cell
    if (fieldConfig.type === "date") {
        return (
            <DateCell
                value={value as string | Date}
                format={fieldConfig.format}
                locale={fieldConfig.locale}
            />
        );
    }

    // Currency cell
    if (fieldConfig.type === "currency") {
        return (
            <CurrencyCell
                value={Number(value)}
                currency={fieldConfig.currency || "USD"}
                locale={fieldConfig.locale || "en-US"}
            />
        );
    }

    // Copyable cell
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

    // Fallback
    if (value === null || value === undefined) {
        return <span className="text-[hsl(var(--lux-table-cell-foreground))]">-</span>;
    }
    return <span className="text-[hsl(var(--lux-table-cell-foreground))]">{String(value)}</span>;
}

