'use client';
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeroCarousel from './hero-carousel';
import { heroSlider } from '@/lib/constants/hero-slider-image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utility/tailwind-merge';
import { useFormatter, useTranslations } from 'use-intl';

const PRICE = 10.99;
export default function Hero() {
  // Translation
  const t = useTranslations('hero');

  // Hook
  const router = useRouter();
  const locale = useLocale();
  const format = useFormatter();

  // Function
  const goToProductPage = () => {
    router.push('/products');
  };

  // Variables
  const price =
    locale === 'ar'
      ? format.number(PRICE, 'currency-after-number')
      : format
          .number(PRICE, 'currency-after-number')
          .replace(/^(\D+)?(\d+(\.\d+)?)/, '$2\u00A0$1');

  return (
    <section className="mx-auto flex w-full flex-col items-center justify-center gap-6 px-10 pb-6 pt-10 sm:px-20 lg:flex lg:flex-row lg:items-center lg:justify-between">
      {/* Static Image */}
      <figure className="relative h-full max-h-[27.5rem] w-full flex-1 lg:max-w-[18.8125rem]">
        <Image
          src={'/assets/images/gift.jpg'}
          width={301}
          height={440}
          alt="gift"
          priority
          sizes="(max-width: 639px) calc(100vw - 5rem), 301px"
          className="h-full max-h-[27.5rem] w-full rounded-2xl"
        />

        {/* Caption For Image */}
        <figcaption
          className={cn(
            'absolute bottom-0 flex flex-col gap-3 pb-6 text-white',
            locale === 'ar' ? 'pr-6' : 'pl-6',
          )}
        >
          <Badge
            variant={'secondary'}
            className={cn(
              'w-fit rounded-full py-[.125rem] pl-2 text-xs font-medium dark:bg-maroon-50 dark:hover:bg-maroon-100',
              locale === 'ar' ? 'px-2' : 'pl-2',
            )}
          >
            <span className="first-letter:uppercase">
              {' '}
              {t('gift-price', {
                price,
              })}
            </span>
          </Badge>

          <p className="h-20 w-full max-w-64 text-2xl font-semibold capitalize">
            {t('special-gift')}
          </p>
          <Button
            variant={'secondary'}
            onClick={goToProductPage}
            className="flex w-full max-w-32 items-center justify-center gap-1 rounded-xl px-4 py-2 text-base font-normal capitalize dark:bg-maroon-50 dark:hover:bg-maroon-100"
          >
            {locale === 'en' ? <ArrowRight /> : <ArrowLeft />}
            {t('static-image.button')}
          </Button>
        </figcaption>
      </figure>

      {/* Carousel */}
      <div className="w-full flex-1">
        <HeroCarousel
          slides={heroSlider}
          options={{ loop: false }}
          locale={locale}
        />
      </div>
    </section>
  );
}
