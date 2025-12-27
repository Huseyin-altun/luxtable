"use client";

// ============================================================================
// BOOLEAN CELL - Evet/Hayır Gösterimi
// ============================================================================
// Bu bileşen, tablolarda boolean (true/false) değerlerini
// okunabilir ve renkli metin olarak göstermek için kullanılır.
//
// Özellikler:
// - Özelleştirilebilir etiketler (Yes/No, Evet/Hayır, ✓/✗ vb.)
// - Özelleştirilebilir renkler
// - Dark mode desteği
// ============================================================================

export interface BooleanCellProps {
    /** Boolean değer */
    value: boolean;
    /** 
     * True değeri için metin 
     * @default "Yes"
     */
    trueLabel?: string;
    /** 
     * False değeri için metin 
     * @default "No"
     */
    falseLabel?: string;
    /** 
     * True değeri için renk sınıfları 
     * @default "text-green-600 dark:text-green-400"
     */
    trueColor?: string;
    /** 
     * False değeri için renk sınıfları 
     * @default "text-red-600 dark:text-red-400"
     */
    falseColor?: string;
}

/**
 * Boolean değerler için hazır bileşen
 * 
 * True değerleri yeşil, false değerleri kırmızı renkte gösterir.
 * Etiketler ve renkler tamamen özelleştirilebilir.
 * 
 * @example
 * // Basit kullanım
 * ```tsx
 * <BooleanCell value={true} />
 * // Çıktı: "Yes" (yeşil)
 * ```
 * 
 * @example
 * // Türkçe etiketlerle
 * ```tsx
 * <BooleanCell value={false} trueLabel="Evet" falseLabel="Hayır" />
 * // Çıktı: "Hayır" (kırmızı)
 * ```
 * 
 * @example
 * // İkon kullanımı
 * ```tsx
 * <BooleanCell value={true} trueLabel="✓" falseLabel="✗" />
 * // Çıktı: "✓" (yeşil)
 * ```
 * 
 * @example
 * // Özel renklerle
 * ```tsx
 * <BooleanCell 
 *   value={true} 
 *   trueLabel="Onaylandı"
 *   trueColor="text-blue-600 dark:text-blue-400"
 * />
 * ```
 * 
 * @example
 * // TanStack Table column içinde kullanım
 * ```tsx
 * columnHelper.accessor("isActive", {
 *   header: "Aktif",
 *   cell: (info) => (
 *     <BooleanCell 
 *       value={info.getValue()} 
 *       trueLabel="Aktif" 
 *       falseLabel="Pasif" 
 *     />
 *   ),
 * })
 * ```
 */
export function BooleanCell({
    value,
    trueLabel = "Yes",
    falseLabel = "No",
    trueColor = "text-green-600 dark:text-green-400",
    falseColor = "text-red-600 dark:text-red-400",
}: BooleanCellProps) {
    return (
        <span className={`font-medium ${value ? trueColor : falseColor}`}>
            {value ? trueLabel : falseLabel}
        </span>
    );
}
