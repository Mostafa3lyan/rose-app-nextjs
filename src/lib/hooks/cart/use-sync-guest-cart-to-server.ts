'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useGuestCartContext } from './use-guest-cart-context';
import { addToCartAction } from '@/lib/actions/cart/add-to-cart.action';
import { fetchCartService } from '@/lib/actions/cart/fetch-cart.service';
import { updateCartAction } from '@/lib/actions/cart/update-cart.action';
import type { CartResponse } from '@/lib/types/cart';

export function useSyncGuestCartToServer() {
  // Hooks
  const queryClient = useQueryClient();
  const { cartItems, removeItem } = useGuestCartContext();

  const sendCartItemsFromStorageToServer = useCallback(async () => {
    if (!cartItems.length) return;

    const serverCart: ApiResponse<CartResponse> = await fetchCartService();
    if ('error' in serverCart) {
      throw new Error(serverCart.error || 'Unable to fetch your account cart');
    }

    const serverQuantities = new Map(
      serverCart.cart.cartItems.map((item) => [
        item.product._id,
        item.quantity,
      ]),
    );
    const guestQuantities = new Map<string, number>();

    for (const item of cartItems) {
      const productId = item.product._id;
      guestQuantities.set(
        productId,
        (guestQuantities.get(productId) ?? 0) + item.quantity,
      );
    }

    const failures: string[] = [];

    for (const [productId, guestQuantity] of Array.from(
      guestQuantities.entries(),
    )) {
      const existingQuantity = serverQuantities.get(productId) ?? 0;
      const quantity = existingQuantity + guestQuantity;

      try {
        const payload = existingQuantity
          ? await updateCartAction({ productId, quantity })
          : await addToCartAction({ product: productId, quantity });

        if ('error' in payload) {
          throw new Error(payload.error || 'Unable to sync cart item');
        }
        if ('guest' in payload) {
          throw new Error('Your cart could not be synced because you are signed out');
        }

        removeItem(productId);
      } catch (error) {
        failures.push(
          error instanceof Error ? error.message : 'Unable to sync cart item',
        );
      }
    }

    // Refresh server cart queries once
    await queryClient.invalidateQueries({ queryKey: ['cart'] });

    if (failures.length) {
      throw new Error(`Some cart items could not be synced: ${failures.join('; ')}`);
    }
  }, [cartItems, removeItem, queryClient]);

  return { sendCartItemsFromStorageToServer };
}
