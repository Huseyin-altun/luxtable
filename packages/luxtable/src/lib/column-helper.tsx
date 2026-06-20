import { createColumnHelper as tanstackCreateColumnHelper, ColumnDef, CellContext, HeaderContext } from "@tanstack/react-table";
import * as React from "react";
import { LuxDataTableColumnHeader } from "../components/lux-table/column-header";


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
  
  size?: number;
  enableSorting?: boolean;
  
  meta?: {
    
    filterVariant?: "text" | "select";
  };
}


export type ColumnType = "text" | "status" | "progress" | "boolean" | "date" | "currency" | "custom";

export interface SmartColumnOptions<TData, TValue> extends ColumnOptions<TData, TValue> {
  
  type?: ColumnType;
  
  statusColors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
  
  progressBarColor?: string;
  
  showProgressLabel?: boolean;
  
  booleanLabels?: { true: string; false: string };
  
  dateFormat?: "short" | "long" | "relative";
  
  currency?: string;
  
  locale?: string;
}

export function createColumnHelper<TData>() {
  const helper = tanstackCreateColumnHelper<TData>();

  return {
    
    accessor: <TValue,>(
      accessor: keyof TData & string,
      column?: ColumnOptions<TData, TValue>
    ): ColumnDef<TData, TValue> => {
      const headerContent = column?.header;

      const finalColumn = {
        ...column,
        
        enableSorting: column?.enableSorting !== false,
        
        size: column?.size,
        
        meta: column?.meta,
        
        header: typeof headerContent === 'function'
          ? headerContent
          : ({ column: colParam }: HeaderContext<TData, TValue>) => (
            <LuxDataTableColumnHeader
              column={colParam}
              title={typeof headerContent === 'string' ? headerContent : toTitleCase(accessor)}
            />
          ),
        
        
        ...(column?.cell ? { cell: column.cell } : {}),
      };
      return helper.accessor(accessor as any, finalColumn as any);
    },

    
    display: (column: {
      id: string;
      header?: string | (() => React.ReactNode);
      cell?: (info: CellContext<TData, unknown>) => React.ReactNode;
      enableSorting?: boolean;
      enableHiding?: boolean;
    }): ColumnDef<TData, unknown> => {
      return helper.display(column as any);
    },

    
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
      
      ...(cellRenderer ? { cell: cellRenderer } : {}),
    } as any);
  });
}
