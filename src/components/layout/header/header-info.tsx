'use client';

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import ToggleLocal from './toggle-local';
import { Badge } from '@/components/ui/badge';
import ThemeToggleIcon from '../app/theme-toggle';
import HeaderUsernameClient from './header-username-client';
import { User } from '@/lib/types/auth';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCart } from '@/lib/hooks/cart/use-cart';
import { useGuestCartContext } from '@/lib/hooks/cart/use-guest-cart-context';

interface HeaderInfoProps {
  user: User | null;
}

export default function HeaderInfo({ user }: HeaderInfoProps) {
  // Translation
  const locale = useLocale();
  const t = useTranslations();

  // navigation
  const router = useRouter();

  // Querys
  const { data } = useCart();

  // Hooks
  const { totalQuantity } = useGuestCartContext();

  // Variables
  const numOfCartItems = user
    ? (data?.cart.cartItems.reduce((total, item) => total + item.quantity, 0) ??
      0)
    : totalQuantity;

  return (
    <div className="flex items-center gap-1">
      <HeaderUsernameClient user={user} />

      <div className="mx-2 h-8 w-[1px] bg-gray-200" />

      <div className="flex items-center gap-4 text-gray-600">
        <button
          aria-label={t('header.wishlist')}
          className="hover:text-red-800"
        >
          <Heart className="h-6 w-6 dark:text-white" />
        </button>

        <button
          aria-label={t('cart')}
          onClick={() => {
            router.push('/cart', { locale });
          }}
          className="relative hover:text-red-800"
        >
          <ShoppingCart className="h-6 w-6 dark:text-white" />
          <Badge className="absolute -right-2 -top-2 flex size-3.5 items-center justify-center bg-red-500 dark:bg-red-600 text-[.625rem] p-0 hover:bg-red-500 dark:text-white">
            {numOfCartItems}
          </Badge>
        </button>

      </div>

      <div className="hidden lg:flex">
        <div className="mx-2 h-8 w-[1px] bg-gray-200" />
        <ThemeToggleIcon />
        <div className="mx-2 h-8 w-[1px] bg-gray-200" />
        <ToggleLocal />
      </div>
    </div>
  );
}
