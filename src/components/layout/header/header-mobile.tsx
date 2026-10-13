'use client';

import { cn } from '@/lib/utility/tailwind-merge';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import HeaderInfo from './header-info';
import HeaderSearch from './header-search';
import Headerlocation from './header-location';
import { User } from '@/lib/types/auth';
import { homeheadercolumnItems } from '@/lib/constants/home-header';

interface HeaderInfoProps {
  user: User | null;
}
export default function HeaderMobile({ user }: HeaderInfoProps) {
  // Translation
  const t = useTranslations('homepage');
  const tHeader = useTranslations('header');

  // State
  const [isOpen, setIsOpen] = useState(false);

  // hook
  const pathname = usePathname();

  // Variable
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-4 px-4 py-2 pb-10 sm:px-4 lg:hidden">
        {/* Burger button */}
        <button
          className="right-0"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('header.open-menu')}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="hidden sm:flex">
          <Headerlocation isborder={true} user={user} />
        </div>

        <div className="hidden flex-1 sm:flex">
          <HeaderSearch />
        </div>
        {/* Header Info */}
        <HeaderInfo user={user} />
      </div>

      {/* Mobile sliding menu */}
      <nav
        aria-label={t('header.navigation-label')}
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-40 transform bg-maroon-700 shadow-lg transition-transform duration-300 ease-in-out dark:bg-softpink-200',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Close button */}
        <button
          className="flex w-full justify-end p-3"
          onClick={() => setIsOpen(false)}
          aria-label={t('header.close-menu')}
        >
          <svg
            className="h-5 w-5 text-zinc-50 dark:text-zinc-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Menu */}
        <ul className="flex h-[calc(100%-48px)] flex-col gap-4 overflow-y-auto">
          {/* Logo */}
          <li className="flex justify-center py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/logo.png"
                width={60}
                height={60}
                alt={tHeader('logo-alt')}
              />
            </Link>
          </li>

          {/* Links */}
          {homeheadercolumnItems.map((item) => {
            const { Icon } = item;
            const isActive =
              item.link === '/'
                ? pathnameWithoutLocale === '/'
                : pathnameWithoutLocale.startsWith(item.link);

            return (
              <li key={item.id} className="px-6">
                <Link
                  href={item.link}
                  className={cn(
                    'flex items-center gap-3 border-b py-4',
                    isActive
                      ? 'border-softpink-200 text-softpink-200 dark:border-maroon-800 dark:text-maroon-800'
                      : 'border-transparent text-zinc-50 dark:text-zinc-800',
                  )}
                >
                  {/* Icon */}
                  <span className="flex w-6 shrink-0 justify-center">
                    <Icon className="size-6" />
                  </span>

                  {/* Text */}
                  <span className="text-sm font-medium capitalize sm:text-base">
                    {t(item.name)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
