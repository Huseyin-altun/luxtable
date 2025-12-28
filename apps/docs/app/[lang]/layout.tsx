import { RootProvider } from 'fumadocs-ui/provider/next';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { Inter } from 'next/font/google';
import { i18n } from '@/lib/i18n';
import '../global.css';

const inter = Inter({
    subsets: ['latin'],
});

const { provider } = defineI18nUI(i18n, {
    translations: {
        en: {
            displayName: 'English',
            search: 'Search documentation...',
            searchNoResult: 'No results found',
            toc: 'On this page',
            tocNoHeadings: 'No headings found',
            lastUpdate: 'Last updated',
            previousPage: 'Previous',
            nextPage: 'Next',
            chooseTheme: 'Theme',
            chooseLanguage: 'Language',
        },
        tr: {
            displayName: 'Türkçe',
            search: 'Dokümantasyonda ara...',
            searchNoResult: 'Sonuç bulunamadı',
            toc: 'Bu sayfada',
            tocNoHeadings: 'Başlık bulunamadı',
            lastUpdate: 'Son güncelleme',
            previousPage: 'Önceki',
            nextPage: 'Sonraki',
            chooseTheme: 'Tema',
            chooseLanguage: 'Dil',
        },
    },
});

export default async function RootLayout({
    params,
    children,
}: {
    params: Promise<{ lang: string }>;
    children: React.ReactNode;
}) {
    const lang = (await params).lang;

    return (
        <html lang={lang} className={inter.className} suppressHydrationWarning>
            <body className="flex flex-col min-h-screen">
                <RootProvider i18n={provider(lang)}>
                    {children}
                </RootProvider>
            </body>
        </html>
    );
}
