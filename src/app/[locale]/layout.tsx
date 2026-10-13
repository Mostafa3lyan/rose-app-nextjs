import Providers from '@/components/providers';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter, Mulish, Sarabun, Tajawal, Zain } from 'next/font/google';
import { notFound } from 'next/navigation';

const sarabun = Sarabun({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
});
const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
});

const zain = Zain({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-zain',
  display: 'swap',
  preload: false,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-inter',
  preload: false,
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mulish',
  preload: false,
});

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Pick<LayoutProps, 'params'>) {
  const t = await getTranslations({ locale } as never);
  return {
    title: t('title'),
    alternates: {
      canonical: '/',
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={` ${locale === 'ar' ? tajawal.className : sarabun.className} ${zain.variable} ${mulish.variable} ${inter.variable} antialiased [@media(min-width:1920px)]:container dark:bg-zinc-800 [@media(min-width:1920px)]:mx-auto`}
      >
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
