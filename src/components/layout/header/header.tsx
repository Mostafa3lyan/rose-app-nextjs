import React from 'react';
import HeaderDetails from './header-details';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import HeaderMobile from './header-mobile';
import Headerlocation from './header-location';
import HeaderInfo from './header-info';
import HeaderSearch from './header-search';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { authOption } from '@/auth';
import { User } from '@/lib/types/auth';

export default async function Header() {
  const session = await getServerSession(authOption);
  const t = await getTranslations('header');

  return (
    <header>
      <div className="mx-auto hidden items-center gap-4 px-4 py-4 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              width={60}
              height={60}
              alt={t('logo-alt')}
              className="hidden lg:flex"
            />
          </Link>
          <Headerlocation isborder={true} user={(session?.user as User) ?? null}   />
        </div>

        {/* Search Bar */}
        <div className="flex flex-1">
          <HeaderSearch />
        </div>

        {/* Header Info */}
        <HeaderInfo user={(session?.user as User) ?? null} />
      </div>

      {/* Header Details  */}
      <HeaderDetails />

      {/* Header on Mobile */}
      <HeaderMobile user={(session?.user as User) ?? null} />
    </header>
  );
}
