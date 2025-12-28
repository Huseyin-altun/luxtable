import { createColumnHelper as tanstackCreateColumnHelper, ColumnDef, CellContext, HeaderContext } from "@tanstack/react-table";
import * as React from "react";
import { LuxDataTableColumnHeader } from "../components/lux-table/column-header";

// camelCase -> Title Case conversion
const toTitleCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

export type { ColumnDef };

export interface ColumnOptions<TData, TValue> {
  id?: string;
  header?: string | ((context: HeaderContext<TData, TValue>) => React.ReactNode);
  cell?: (info: CellContext<TData, TValue>) => React.ReactNode;

  enableSorting?: boolean;
  /** Column meta information (e.g. filterVariant) */
  meta?: {
    /** Filter type: "text" (default) or "select" (dropdown) */
    filterVariant?: "text" | "select";
  };
}

// Interface for special column types
export type ColumnType = "text" | "status" | "progress" | "boolean" | "date" | "currency" | "custom";

export interface SmartColumnOptions<TData, TValue> extends ColumnOptions<TData, TValue> {
  /** 
   * Column type - used for automatic rendering
   * - text: Displays value as plain text (default)
   * - status: Displays with StatusCell component
   * - progress: Displays with ProgressCell component
   * - boolean: Displays with BooleanCell component
   * - date: Displays with DateCell component
   * - currency: Displays with CurrencyCell component
   * - custom: Uses your provided cell function
   */
  type?: ColumnType;
  /** Custom colors for Status type */
  statusColors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
  /** Bar color for Progress type */
  progressBarColor?: string;
  /** Whether to show label for Progress type */
  showProgressLabel?: boolean;
  /** Labels for Boolean type */
  booleanLabels?: { true: string; false: string };
  /** Format for Date type */
  dateFormat?: "short" | "long" | "relative";
  /** Currency code for Currency type */
  currency?: string;
  /** Locale */
  locale?: string;
}

export function createColumnHelper<TData>() {
  const helper = tanstackCreateColumnHelper<TData>();

  return {
    /**
     * Simple accessor - if cell is not provided, value is rendered automatically
     */
    accessor: <TValue,>(
      accessor: keyof TData & string,
      column?: ColumnOptions<TData, TValue>
    ): ColumnDef<TData, TValue> => {
      const headerContent = column?.header;

      const finalColumn = {
        ...column,
        // enableSorting is true by default
        enableSorting: column?.enableSorting !== false,
        // Pass meta information (filterVariant etc.)
        meta: column?.meta,
        // Use LuxDataTableColumnHeader if header is string or undefined
        header: typeof headerContent === 'function'
          ? headerContent
          : ({ column: colParam }: HeaderContext<TData, TValue>) => (
            <LuxDataTableColumnHeader
              column={colParam}
              title={typeof headerContent === 'string' ? headerContent : toTitleCase(accessor)}
            />
          ),
        // If cell is not defined, show value directly
        cell: column?.cell || ((info: CellContext<TData, TValue>) => {
          const value = info.getValue();
          // if null or undefined, show -
          if (value === null || value === undefined) {
            return "-";
          }
          // If string or number, show directly
          return String(value);
        }),
      };
      return helper.accessor(accessor as any, finalColumn as any);
    },

    /**
     * Display column (for actions etc.)
     */
    display: (column: {
      id: string;
      header?: string | (() => React.ReactNode);
      cell?: (info: CellContext<TData, unknown>) => React.ReactNode;
      enableSorting?: boolean;
      enableHiding?: boolean;
    }): ColumnDef<TData, unknown> => {
      return helper.display(column as any);
    },

    /**
     * Action column - specialized display column for row actions
     * Disables sorting by default
     */
    action: (column: {
      cell: (info: CellContext<TData, unknown>) => React.ReactNode;
      id?: string;
      header?: string | (() => React.ReactNode);
    }): ColumnDef<TData, unknown> => {
      return helper.display({
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        ...column,
      } as any);
    },

    /**
     * Create all columns automatically - Table directly from JSON
     * Just specifying headers is enough, cell is rendered automatically
     */
    auto: (
      columns: Array<{
        accessor: keyof TData & string;
        header: string;
        cell?: (info: CellContext<TData, unknown>) => React.ReactNode;
      }>
    ): ColumnDef<TData, unknown>[] => {
      return columns.map((col) => {
        return helper.accessor(col.accessor as any, {
          header: ({ column }: HeaderContext<TData, unknown>) => (
            <LuxDataTableColumnHeader column={column} title={col.header} />
          ),
          cell: col.cell || ((info: CellContext<TData, unknown>) => {
            const value = info.getValue();
            if (value === null || value === undefined) return "-";
            return String(value);
          }),
        } as any);
      });
    },
  };
}

/**
 * Creates automatic columns from JSON data
 * Uses column names as header (camelCase -> Title Case)
 */
export function createColumnsFromData<TData extends Record<string, unknown>>(
  data: TData[],
  options?: {
    exclude?: (keyof TData)[];
    include?: (keyof TData)[];
    headers?: Partial<Record<keyof TData, string>>;
    cells?: Partial<Record<keyof TData, (info: CellContext<TData, unknown>) => React.ReactNode>>;
  }
): ColumnDef<TData, unknown>[] {
  if (!data || data.length === 0) return [];

  const helper = tanstackCreateColumnHelper<TData>();
  const firstRow = data[0];
  let keys = Object.keys(firstRow) as (keyof TData & string)[];

  // Filter include/exclude
  if (options?.include) {
    keys = keys.filter((k) => options.include?.includes(k));
  }
  if (options?.exclude) {
    keys = keys.filter((k) => !options.exclude?.includes(k));
  }



  return keys.map((key) => {
    const headerText = options?.headers?.[key] || toTitleCase(key as string);
    const cellRenderer = options?.cells?.[key];

    return helper.accessor(key as any, {
      header: ({ column }: HeaderContext<TData, unknown>) => <LuxDataTableColumnHeader column={column} title={headerText} />,
      cell: cellRenderer || ((info) => {
        const value = info.getValue();
        if (value === null || value === undefined) return "-";
        return String(value);
      }),
    } as any);
  });
}
