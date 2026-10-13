'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { User } from '@/lib/types/auth';
import LoginPopover from '@/app/[locale]/(auth)/login/_components/login-popover';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

interface HeaderUsernameClientProps {
  user: User | null;
}

export default function HeaderUsernameClient({ user }: HeaderUsernameClientProps) {
  const t = useTranslations();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-start text-sm outline-none">
            <span className="text-xs font-normal text-zinc-500">
              {t('header.greeting')}
            </span>
            <div className="flex items-center gap-1 font-semibold text-red-900 dark:text-softpink-200">
              {user.firstName}{' '}
              <ChevronDown className="h-4 w-4 dark:text-zinc-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t('my-account')}</DropdownMenuItem>
            <DropdownMenuItem>{t('orders.title')}</DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="text-red-500 focus:text-red-700 dark:text-red-400 dark:focus:text-red-500"
            >
              <button
                className="w-full text-left"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                {t('log-out')}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="group relative">
          <button className="px-4 py-2 font-medium dark:text-white">
            {t('header.login')}
          </button>

          {/* Hover Login */}
          <LoginPopover />
        </div>
      )}
    </>
  );
}
