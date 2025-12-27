"use client";

// ============================================================================
// CURRENCY CELL - Para Birimi Gösterimi
// ============================================================================
// Bu bileşen, tablolarda sayısal değerleri para birimi formatında
// göstermek için kullanılır.
//
// Özellikler:
// - Otomatik para birimi sembolü
// - Binlik ayracı ve ondalık formatı
// - Locale desteği
// - Tüm dünya para birimleri desteği (TRY, USD, EUR, GBP vb.)
// ============================================================================

export interface CurrencyCellProps {
    /** Sayısal değer */
    value: number;
    /** 
     * Para birimi kodu (ISO 4217)
     * @default "TRY"
     * @example "USD", "EUR", "GBP", "JPY"
     */
    currency?: string;
    /** 
     * Locale (dil ve bölge formatı)
     * @default "tr-TR"
     */
    locale?: string;
}

/**
 * Para birimi için hazır bileşen
 * 
 * Intl.NumberFormat kullanarak sayısal değerleri yerel formatta gösterir.
 * Para birimi sembolü, binlik ayracı ve ondalık formatı otomatik ayarlanır.
 * 
 * @example
 * // Türk Lirası (varsayılan)
 * ```tsx
 * <CurrencyCell value={1234.56} />
 * // Çıktı: "₺1.234,56"
 * ```
 * 
 * @example
 * // Amerikan Doları
 * ```tsx
 * <CurrencyCell value={1234.56} currency="USD" locale="en-US" />
 * // Çıktı: "$1,234.56"
 * ```
 * 
 * @example
 * // Euro
 * ```tsx
 * <CurrencyCell value={1234.56} currency="EUR" locale="de-DE" />
 * // Çıktı: "1.234,56 €"
 * ```
 * 
 * @example
 * // TanStack Table column içinde kullanım
 * ```tsx
 * columnHelper.accessor("price", {
 *   header: "Fiyat",
 *   cell: (info) => <CurrencyCell value={info.getValue()} />,
 * })
 * ```
 * 
 * @example
 * // Çoklu para birimi desteği
 * ```tsx
 * columnHelper.accessor("amount", {
 *   header: "Tutar",
 *   cell: (info) => (
 *     <CurrencyCell 
 *       value={info.getValue()} 
 *       currency={info.row.original.currency}
 *     />
 *   ),
 * })
 * ```
 */
export function CurrencyCell({ value, currency = "TRY", locale = "tr-TR" }: CurrencyCellProps) {
    const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);

    return <span className="font-medium">{formatted}</span>;
}
