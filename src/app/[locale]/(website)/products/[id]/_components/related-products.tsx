import { getTranslations } from 'next-intl/server';
import MainHeading from '@/app/[locale]/(website)/(home)/_components/main-heading';
import ProductsCarousel from '@/components/shared/products-carousel';
import type { getRelatedProducts } from '@/lib/services/reviews/get-related-products';
import type { SettledPromise } from './settle-promise';

type RelatedProductsProps = {
  relatedProductsPromise: SettledPromise<
    Awaited<ReturnType<typeof getRelatedProducts>>
  >;
};

export default async function RelatedProducts({
  relatedProductsPromise,
}: RelatedProductsProps) {
  const [t, fetchedRelatedProducts] = await Promise.all([
    getTranslations('reviews'),
    relatedProductsPromise,
  ]);
  if (fetchedRelatedProducts.status === 'rejected') {
    throw fetchedRelatedProducts.reason;
  }

  if (!fetchedRelatedProducts.value || fetchedRelatedProducts.value.length === 0) {
    return null;
  }

  return (
    <div className="container p-8">
      {/* Title */}
      <MainHeading
        className="mb-5 items-start text-start"
        paragraph={t('related-products')}
      />
      <ProductsCarousel relatedProducts={fetchedRelatedProducts.value} />
    </div>
  );
}
