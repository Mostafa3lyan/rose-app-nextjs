'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Star, Package, HeartPlus } from 'lucide-react';
import type { Product } from '@/lib/types/products/product';
import { cn } from '@/lib/utility/tailwind-merge';
import { Button } from '@/components/ui/button';
import { FaSpinner } from 'react-icons/fa';
import { useAddToCart } from '@/lib/hooks/cart/use-add-to-cart';

export default function ProductDetailsUpper({ product }: { product: Product }) {
  // Translation
  const t = useTranslations('product');

  // State
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(product.isInWishlist);

  // Hooks
  const { onAddToCard, isPending: isAddingToCart } = useAddToCart();

  // Variables => This is a flexible choice
  const gallery = [product.imgCover, ...product.images].filter(Boolean);
  const inStock = product.quantity !== 0;

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
      {/* Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={gallery[selectedIndex]}
            alt={product.title}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            // Use contain to ensure the entire image is visible without cropping ✅
            className="object-contain"
            priority
          />
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-3">
          {gallery.map((url, idx) => (
            <button
              aria-label={`view image ${idx + 1}`}
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative size-20 flex-shrink-0 overflow-hidden rounded-xl border-2 opacity-80 transition-all duration-300 hover:opacity-100',
                idx === selectedIndex
                  ? 'border-maroon-600 opacity-100 dark:border-softpink-300'
                  : 'border-zinc-200 hover:border-maroon-400 dark:border-zinc-700',
              )}
            >
              <Image
                src={url}
                alt={`${product.title} - ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between space-y-2">
        <div>
          {/* Title */}
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-white md:text-3xl">
            {product.title}
          </h1>

          {/* Price & Stock */}
          <div className="flex flex-wrap items-center gap-2">
            {product.priceAfterDiscount && (
              <span className="text-3xl font-bold text-zinc-400 line-through dark:text-zinc-500">
                {product.price}
              </span>
            )}
            <span className="text-3xl font-bold">
              {product.priceAfterDiscount || product.price}
            </span>
            <span className="relative top-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {t('currency')}
            </span>
            <div className="ms-3 flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-600 dark:text-zinc-300">
              <Package className="h-4 w-4" />
              <span>{t('inStock', { count: product.quantity })}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="!my-4 flex items-center gap-2 border-y border-zinc-200 py-5 dark:border-zinc-600">
            <Star className="size-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-zinc-900 dark:text-white">
              Rating: {product.rateAvg.toFixed(1)}/5
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-500">
              ({product.rateCount} ratings)
            </span>
          </div>

          {/* Description - Scrollable */}
          <div className="overflow-y-auto md:max-h-48">
            <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="Subtle"
            size="icon"
            className="size-12 border-2 border-zinc-200 dark:border-zinc-700"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <HeartPlus
              size={20}
              className={cn(
                'size-10 transition-colors',
                isWishlisted
                  ? 'fill-maroon-600 text-maroon-600 dark:fill-softpink-300 dark:text-softpink-300'
                  : 'text-zinc-600 dark:text-zinc-400',
              )}
            />
          </Button>

          <Button
            variant="primary"
            className="h-12 flex-1 bg-maroon-600 transition-colors hover:bg-maroon-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-softpink-300 dark:hover:bg-softpink-400"
            disabled={!inStock || isAddingToCart}
            onClick={() => onAddToCard({ productId: product._id, quantity: 1 })}
          >
            {isAddingToCart ? (
              <FaSpinner className="size-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="size-6" />
                {t('addToCart')}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
