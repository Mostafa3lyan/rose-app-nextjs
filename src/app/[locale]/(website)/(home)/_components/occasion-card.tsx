import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utility/tailwind-merge';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export default function OccasionCard({
  img,
  alt,
  text,
  badge,
}: {
  img: string;
  alt: string;
  text: string;
  badge: string;
}) {
   // Translation
  const t = useTranslations('hero');
  return (
    <figure
      className={cn(
        'relative w-full overflow-hidden rounded-2xl',
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-2xl after:bg-gradient-to-l after:from-black after:via-transparent after:to-transparent after:opacity-50 after:content-['']",
      )}
    >
      <Image
        src={img}
        width={410}
        height={271}
        alt={alt}
        sizes="(max-width: 767px) calc(100vw - 5rem), (max-width: 1023px) 50vw, 33vw"
        className="w-full rounded-2xl"
      />
      <figcaption className="absolute bottom-0 z-20 flex flex-col gap-2 p-6">
        <Badge
          variant={'secondary'}
          className={`w-fit rounded-full px-2 text-xs font-medium capitalize dark:bg-maroon-50 dark:hover:bg-maroon-100`}
        >
          {t(badge)}
        </Badge>
        <p className="text-sm font-semibold text-white sm:text-xl xl:text-xl 2xl:w-[22.625rem] 2xl:text-2xl">
          {t(text)}
        </p>
      </figcaption>
    </figure>
  );
}
