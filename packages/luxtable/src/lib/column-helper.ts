import { createColumnHelper as tanstackCreateColumnHelper, ColumnDef, CellContext, HeaderContext } from "@tanstack/react-table";
import * as React from "react";

export type { ColumnDef };

export interface ColumnOptions<TData, TValue> {
  id?: string;
  header?: string | ((context: HeaderContext<TData, TValue>) => React.ReactNode);
  cell?: (info: CellContext<TData, TValue>) => React.ReactNode;
  /** Sıralamayı aktif/pasif yap (varsayılan: true) */
  enableSorting?: boolean;
  /** Kolon meta bilgileri (ör: filterVariant) */
  meta?: {
    /** Filtre tipi: "text" (varsayılan) veya "select" (dropdown) */
    filterVariant?: "text" | "select";
  };
}

// Özel kolon tipleri için interface
export type ColumnType = "text" | "status" | "progress" | "boolean" | "date" | "currency" | "custom";

export interface SmartColumnOptions<TData, TValue> extends ColumnOptions<TData, TValue> {
  /** 
   * Kolon tipi - otomatik render için kullanılır
   * - text: Değeri düz metin olarak gösterir (varsayılan)
   * - status: StatusCell bileşeni ile gösterir
   * - progress: ProgressCell bileşeni ile gösterir
   * - boolean: BooleanCell bileşeni ile gösterir
   * - date: DateCell bileşeni ile gösterir
   * - currency: CurrencyCell bileşeni ile gösterir
   * - custom: Sizin verdiğiniz cell fonksiyonunu kullanır
   */
  type?: ColumnType;
  /** Status tipi için özel renkler */
  statusColors?: Record<string, { bg: string; text: string; darkBg?: string; darkText?: string }>;
  /** Progress tipi için bar rengi */
  progressBarColor?: string;
  /** Progress tipi için label gösterilsin mi */
  showProgressLabel?: boolean;
  /** Boolean tipi için etiketler */
  booleanLabels?: { true: string; false: string };
  /** Date tipi için format */
  dateFormat?: "short" | "long" | "relative";
  /** Currency tipi için para birimi */
  currency?: string;
  /** Locale */
  locale?: string;
}

export function createColumnHelper<TData>() {
  const helper = tanstackCreateColumnHelper<TData>();
  
  return {
    /**
     * Basit accessor - cell verilmezse değer otomatik render edilir
     */
    accessor: <TValue,>(
      accessor: keyof TData & string,
      column?: ColumnOptions<TData, TValue>
    ): ColumnDef<TData, TValue> => {
      const finalColumn = {
        ...column,
        // enableSorting varsayılan olarak true
        enableSorting: column?.enableSorting !== false,
        // Meta bilgilerini aktar (filterVariant vb.)
        meta: column?.meta,
        // Eğer cell tanımlanmamışsa, değeri direkt göster
        cell: column?.cell || ((info: CellContext<TData, TValue>) => {
          const value = info.getValue();
          // null veya undefined ise - göster
          if (value === null || value === undefined) {
            return "-";
          }
          // String veya number ise direkt göster
          return String(value);
        }),
      };
      return helper.accessor(accessor as any, finalColumn as any);
    },

    /**
     * Display kolon (actions vs için)
     */
    display: (column: {
      id: string;
      header?: string | (() => React.ReactNode);
      cell?: (info: { row: { original: TData } }) => React.ReactNode;
    }): ColumnDef<TData, unknown> => {
      return helper.display(column as any);
    },

    /**
     * Tüm kolonları otomatik oluştur - JSON'dan direkt tablo
     * Sadece header'ları belirtmeniz yeterli, cell otomatik render edilir
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
          header: col.header,
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
 * JSON datasından otomatik kolonlar oluşturur
 * Kolon isimlerini header olarak kullanır (camelCase -> Title Case)
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

  // Include/exclude filtrele
  if (options?.include) {
    keys = keys.filter((k) => options.include?.includes(k));
  }
  if (options?.exclude) {
    keys = keys.filter((k) => !options.exclude?.includes(k));
  }

  // camelCase -> Title Case dönüşümü
  const toTitleCase = (str: string) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  };

  return keys.map((key) => {
    const headerText = options?.headers?.[key] || toTitleCase(key as string);
    const cellRenderer = options?.cells?.[key];

    return helper.accessor(key as any, {
      header: headerText,
      cell: cellRenderer || ((info) => {
        const value = info.getValue();
        if (value === null || value === undefined) return "-";
        return String(value);
      }),
    } as any);
  });
}
