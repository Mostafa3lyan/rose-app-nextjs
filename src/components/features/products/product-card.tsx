import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { RatingStars } from '@/components/ui/ring-stars';
import ProductCardWhishlistButtons from './product-card-whishlist-button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utility/tailwind-merge';
import ProductAddButton from './product-add-button';
import { Product } from '@/lib/types/end-point-api/products';

// Types
type ProductCardProps = {
  src: StaticImageData | string;
  title?: string;
  rate: number;
  rateCount?: number;
  priceBeforeSale: number;
  priceAfterSale?: number;
  salesCount: number;
  productId: string;
  className?: string;
  createdAt: string;
  showWishListBtn?: boolean;
  quantity: number;
  productInfo: Product;
};
const DAYS = 100 * 24 * 60 * 60 * 1000;
export default function ProductCard({
  src,
  productId,
  rate,
  title = 'Flower App',
  salesCount,
  priceAfterSale,
  priceBeforeSale,
  showWishListBtn = false,
  createdAt,
  productInfo,
  className,
}: ProductCardProps) {
  // Translations
  const t = useTranslations();
  const locale = useLocale();

  // Variable
  const arabic = locale === 'ar';

  const isNew = Date.now() - new Date(createdAt).getTime() < DAYS;
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-t-xl dark:shadow-zinc-200',
        arabic ? 'lg:pr-3' : 'lg:pl-3',
        className,
      )}
    >
      <Link
        locale={locale}
        href={`/products/${productId}`}
        className="group relative inline-block aspect-[5/5] w-full overflow-hidden rounded-xl"
      >
        <Image
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          src={src}
          alt={title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
      </Link>

      {/* Titles */}
      <h2 className="dark:text-soft-pink-200 pb-3 text-xl font-semibold text-maroon-700">
        {title.split(' ').splice(0, 3).join(' ')}
      </h2>
      <div className="flex items-center justify-between pb-2">
        <div className="flex flex-col">
          {/* stars-component */}
          <RatingStars rateAvg={rate} />
          <div className="flex pt-3">
            <span className="dark:text-soft-pink-200 text-base font-medium text-maroon-700">
              {arabic
                ? t('price-number-currancy-base-0', { price: priceAfterSale })
                : t('price-number-currancy-base-0', {
                    price: priceAfterSale,
                  })
                    .replace(/^([^\d]+)\s*/, '')
                    .concat(' EGP')}
            </span>
            <span
              className={cn(
                'text-base text-zinc-400 line-through dark:text-zinc-500',
                arabic ? 'pr-3' : 'pl-3',
              )}
            >
              {arabic
                ? t('price-number-currancy-base-0', { price: priceBeforeSale })
                : t('price-number-currancy-base-0', {
                    price: priceBeforeSale,
                  })
                    .replace(/^([^\d]+)\s*/, '')
                    .concat(' EGP')}
            </span>
          </div>
        </div>

        {/* Add to cart button */}
        <ProductAddButton productInfo={productInfo} />
      </div>

      {/* Badge */}
      <div className="absolute end-4 top-3 flex gap-2">
        {salesCount >= 1 && (
          <div>
            <Badge
              className="z-10 h-6 w-fit text-sm font-medium uppercase dark:bg-softpink-200 dark:hover:bg-softpink-300"
              variant={'secondary'}
            >
              {t('product-hot')}
            </Badge>
          </div>
        )}

        {isNew && (
          <div>
            <Badge
              className="z-10 h-6 w-fit bg-zinc-100 text-sm font-medium uppercase text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-100 dark:text-zinc-700 dark:hover:bg-zinc-200"
              variant="secondary"
            >
              {t('product-new')}
            </Badge>
          </div>
        )}
      </div>

      {/*add & remove whishlist-buttons */}
      <div className="pointer-events-auto absolute top-0">
        {showWishListBtn && (
          <ProductCardWhishlistButtons productId={productId} />
        )}
      </div>
    </div>
  );
}
