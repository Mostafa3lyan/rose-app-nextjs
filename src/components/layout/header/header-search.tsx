import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function HeaderSearch() {
  const t = useTranslations('header');

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        aria-label={t('search')}
        placeholder={t('search')}
        className="h-12 w-full rounded-lg border-gray-200 pl-10 focus-visible:ring-red-800 dark:text-white"
      />
    </div>
  );
}
