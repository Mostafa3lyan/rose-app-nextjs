'use client';
import { useSyncLocalWishlistToServer } from '@/lib/hooks/local-storage/use-sync-local-whishlist-to-server';
import { LoginFormFields } from '@/lib/schema/login.schema';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useSyncGuestCartToServer } from '@/lib/hooks/cart/use-sync-guest-cart-to-server';

export default function useLogin() {
  // Hooks
  const { sendWhishlistProductsFromStorageToServer } =
    useSyncLocalWishlistToServer();
  const { sendCartItemsFromStorageToServer } = useSyncGuestCartToServer();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (credentials: LoginFormFields) => {
      const response = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        rememberMe: credentials.rememberMe ? 'true' : 'false',
      });
      if (response?.ok) {
        return (
          new URLSearchParams(location.search).get('callbackUrl') || '/'
        );
      }
      // Handle authentication error
      if (response?.error) {
        throw new Error(response.error);
      }
      throw new Error('Unable to sign in');
    },

    onSuccess: async (callbackUrl) => {
      try {
        await sendWhishlistProductsFromStorageToServer();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Unable to sync your wishlist',
        );
      }

      try {
        await sendCartItemsFromStorageToServer();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Unable to sync your cart',
        );
      }

      location.assign(callbackUrl);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isPending, error, login: mutate };
}
