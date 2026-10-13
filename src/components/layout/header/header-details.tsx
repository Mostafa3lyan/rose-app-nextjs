'use client';

import { homeheadercolumnItems } from '@/lib/constants/home-header';
import { cn } from '@/lib/utility/tailwind-merge';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function HeaderDetails() {
  // Translation
  const t = useTranslations('homepage');

  // hook
  const pathname = usePathname();
  const locale = useLocale();

  //   Variables
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  return (
    <nav aria-label={t('header.navigation-label')} className="hidden lg:flex">
      <ul className="flex w-full items-center justify-center gap-4 bg-maroon-700 dark:bg-softpink-200">
        {homeheadercolumnItems.map((item) => {
          const { Icon } = item;
          const isActive =
            item.link === '/'
              ? pathnameWithoutLocale === '/'
              : pathnameWithoutLocale.startsWith(item.link);
          const hrefWithLocale = `/${locale}${item.link === '/' ? '' : item.link}`;
          return (
            <li
              key={item.id}
              className={cn(
                'flex items-center justify-center gap-2 px-3',
                isActive
                  ? 'border-b-2 border-softpink-200 dark:border-maroon-800'
                  : '',
              )}
            >
              <Icon
                className={cn(
                  'size-6',
                  isActive
                    ? 'text-softpink-200 dark:text-maroon-800'
                    : 'text-zinc-50 dark:text-zinc-800',
                )}
              />

              <Link
                href={hrefWithLocale}
                locale={locale}
                className={cn(
                  'py-4 text-base font-medium capitalize',
                  isActive
                    ? 'text-softpink-200 dark:text-maroon-800'
                    : 'text-zinc-50 dark:text-zinc-800',
                )}
              >
                {t(item.name)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
