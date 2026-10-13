import { ProductsReviews } from './product-reviews';
import RelatedProducts from './related-products';
import { Suspense } from 'react';
import type { getReviews } from '@/lib/services/reviews/get-product-reviews';
import type { getRelatedProducts } from '@/lib/services/reviews/get-related-products';
import type { SettledPromise } from './settle-promise';

type ReviewsSectionProps = {
  productId: string;
  reviewsPromise: SettledPromise<Awaited<ReturnType<typeof getReviews>>>;
  relatedProductsPromise: SettledPromise<
    Awaited<ReturnType<typeof getRelatedProducts>>
  >;
};

export default function ReviewsSection({
  productId,
  reviewsPromise,
  relatedProductsPromise,
}: ReviewsSectionProps) {
  return (
    <section className="flex w-full flex-col gap-10">
      <Suspense
        fallback={
          <div
            aria-label="Loading reviews"
            aria-busy="true"
            className="h-64 animate-pulse rounded-xl bg-muted"
          />
        }
      >
        <ProductsReviews
          productId={productId}
          reviewsPromise={reviewsPromise}
        />
      </Suspense>
      <Suspense fallback={null}>
        <RelatedProducts relatedProductsPromise={relatedProductsPromise} />
      </Suspense>
    </section>
  );
}
