import { cn } from '@/lib/utility/tailwind-merge';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { User } from '@/lib/types/auth';

type HeaderlocationProps = {
  isborder: boolean;
  user: User | null;
};

interface SessionUser {
  addresses?: Array<{
    city?: string;
  }>;
}

export default function Headerlocation({
  isborder,
  user,
}: HeaderlocationProps) {
  const t = useTranslations('header');

  return (
    <>
      {user ? (
        <div
          className={cn(
            'flex flex-col pl-6 text-sm',
            isborder ? 'border-l border-gray-200' : '',
          )}
        >
          <span className="font-normal text-zinc-500">{t('deliver to')}</span>
          <div className="flex items-center gap-1 font-semibold text-red-800 dark:text-softpink-200">
            <MapPin className="h-4 w-4" />
            <span>{(user as SessionUser).addresses?.at(-1)?.city}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
