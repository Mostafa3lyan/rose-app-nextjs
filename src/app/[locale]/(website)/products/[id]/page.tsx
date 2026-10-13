import React from 'react';
import ReviewsSection from './_components/reviews-section';
import ProductDetailsUpper from './_components/product-details-upper';
import { getProductById } from '@/lib/services/product/product.service';
import { ErrorMessage } from '@/components/error/error-message';
import { getReviews } from '@/lib/services/reviews/get-product-reviews';
import { getRelatedProducts } from '@/lib/services/reviews/get-related-products';
import { settlePromise } from './_components/settle-promise';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;
  const reviewsPromise = settlePromise(getReviews(productId));
  const relatedProductsPromise = settlePromise(getRelatedProducts(productId));
  const payload = await getProductById(productId);

  if ('error' in payload) {
    return (
      <div className="container mx-auto flex w-11/12 flex-col gap-10 py-10">
        <ErrorMessage message={payload.error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex w-11/12 flex-col gap-10 py-10">
      <ProductDetailsUpper product={payload.product} />
      <ReviewsSection
        productId={productId}
        reviewsPromise={reviewsPromise}
        relatedProductsPromise={relatedProductsPromise}
      />
    </div>
  );
}
