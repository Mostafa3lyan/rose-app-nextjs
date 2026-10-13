'use client';

import React from 'react';
import Image from 'next/image';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import { HeroSlider } from '@/lib/types/home/hero-slider';
import { cn } from '@/lib/utility/tailwind-merge';
import { DotButton, useDotButton } from './hero-carousel-dot';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './hero-carousel-button';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type PropType = {
  slides: HeroSlider[];
  options?: EmblaOptionsType;
  locale?: string;
};

const HeroCarousel: React.FC<PropType> = ({ slides, options, locale }) => {
  // Translation
  const t = useTranslations('hero');

  // Navigation
  const router = useRouter();

  // Hook
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    direction: locale === 'ar' ? 'rtl' : 'ltr',
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // Function
  const goToProductPage = () => {
    router.push('/products');
  };

  // RTL-aware navigation functions
  const handlePrev = () => {
    onPrevButtonClick();
  };

  const handleNext = () => {
    onNextButtonClick();
  };

  return (
    <section
      className={cn(
        'relative h-[27.5rem] w-full max-w-[59.6875rem] overflow-hidden rounded-2xl xl:max-w-none',
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:bg-gradient-to-r after:from-black after:via-transparent after:to-transparent after:opacity-80 after:content-['']",
      )}
    >
      {/* viewport */}
      <div className="h-full overflow-hidden" ref={emblaRef}>
        {/* container */}
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative h-[27.5rem] flex-[0_0_100%]"
            >
              <Image
                src={slide.img}
                alt={slide.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 65vw"
                className="max-w-[59.6875rem] rounded-2xl object-center sm:object-cover xl:max-w-none"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div
        className={cn(
          'absolute bottom-10 z-20 flex flex-col gap-[.375rem] sm:bottom-0',
          locale === 'ar' ? 'pr-9 text-right' : 'pl-9 text-left',
        )}
      >
        <p className="text-start text-4xl font-semibold capitalize text-white">
          {t('carousel-title')}
        </p>
        <span className="h-12 text-start text-base text-white first-letter:capitalize">
          {t('carousel-subtitle')}
        </span>
        <Button
          onClick={goToProductPage}
          variant={'secondary'}
          className="mb-9 flex w-32 items-center justify-center rounded-xl px-4 py-2 text-base font-normal dark:bg-maroon-50 dark:hover:bg-maroon-100"
        >
          {t('carousel-button')}
        </Button>
      </div>

      {/* Buttons */}
      <div
        className={cn(
          'absolute bottom-8 mt-4 hidden h-9 w-20 items-center justify-center rounded-full bg-maroon-50 px-4 sm:flex',
          locale === 'ar' ? 'left-8 z-20' : 'right-8',
        )}
      >
        {locale === 'ar' ? (
          <>
            <PrevButton
              onClick={handlePrev}
              disabled={prevBtnDisabled}
              locale={locale}
              className=""
            />

            <NextButton
              onClick={handleNext}
              disabled={nextBtnDisabled}
              locale={locale}
            />
          </>
        ) : (
          <>
            {' '}
            <PrevButton
              onClick={handlePrev}
              disabled={prevBtnDisabled}
              locale={locale}
              className=""
            />
            <NextButton
              onClick={handleNext}
              disabled={nextBtnDisabled}
              locale={locale}
            />
          </>
        )}
      </div>

      {/* Dots */}
      <div
        className={cn(
          'absolute top-6 mt-2 flex justify-center gap-2',
          locale === 'ar' ? 'left-8 z-20' : 'right-8',
        )}
      >
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            // TODO Waiting for the design system
            className={cn(
              'h-2 w-2 rounded-full',
              index === selectedIndex ? 'w-9 bg-maroon-600' : 'bg-maroon-50',
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
