import Link from 'next/link';

const translations = {
    en: {
        title: 'LuxTable',
        subtitle: 'A powerful, flexible React data grid built on TanStack Table',
        description: 'Simple API, beautiful defaults, fully customizable.',
        viewDocs: 'View Documentation',
        features: {
            title: 'Features',
            items: [
                { icon: '🚀', title: 'Zero Config', desc: 'Just pass your data and columns' },
                { icon: '🎨', title: 'Built-in Cells', desc: 'StatusCell, ProgressCell, DateCell...' },
                { icon: '📦', title: 'Auto Columns', desc: 'Generate from JSON automatically' },
                { icon: '🔄', title: 'Pagination & Sorting', desc: 'Built-in with single prop' },
                { icon: '🔍', title: 'Column Filtering', desc: 'Text and dropdown filters' },
                { icon: '✅', title: 'Row Selection', desc: 'Single and multiple selection' },
            ],
        },
    },
    tr: {
        title: 'LuxTable',
        subtitle: 'TanStack Table üzerine kurulmuş güçlü ve esnek React veri tablosu',
        description: 'Basit API, güzel varsayılanlar, tamamen özelleştirilebilir.',
        viewDocs: 'Dokümantasyonu Görüntüle',
        features: {
            title: 'Özellikler',
            items: [
                { icon: '🚀', title: 'Sıfır Konfigurasyon', desc: 'Sadece veri ve sütunları ver' },
                { icon: '🎨', title: 'Hazır Hücreler', desc: 'StatusCell, ProgressCell, DateCell...' },
                { icon: '📦', title: 'Otomatik Sütunlar', desc: "JSON'dan otomatik üret" },
                { icon: '🔄', title: 'Sayfalama & Sıralama', desc: 'Tek prop ile hazır' },
                { icon: '🔍', title: 'Sütun Filtreleme', desc: 'Metin ve dropdown filtreler' },
                { icon: '✅', title: 'Satır Seçimi', desc: 'Tekli ve çoklu seçim' },
            ],
        },
    },
};

export default async function HomePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const lang = ((await params).lang as 'en' | 'tr') || 'en';
    const t = translations[lang] || translations.en;

    return (
        <div className="flex flex-col justify-center items-center text-center flex-1 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {t.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-2">
                        {t.subtitle}
                    </p>
                    <p className="text-lg text-muted-foreground mb-8">
                        {t.description}
                    </p>
                    <Link
                        href={`/${lang}/docs`}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-lg font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        {t.viewDocs} →
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-8">{t.features.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {t.features.items.map((feature, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                            >
                                <div className="text-3xl mb-2">{feature.icon}</div>
                                <h3 className="font-semibold mb-1">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Install */}
                <div className="mt-12 p-6 rounded-lg bg-muted/50">
                    <code className="text-lg font-mono">npm install luxtable</code>
                </div>
            </div>
        </div>
    );
}
