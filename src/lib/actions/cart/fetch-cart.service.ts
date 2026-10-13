import type { CartResponse } from '@/lib/types/cart';

export async function fetchCartService(): Promise<ApiResponse<CartResponse>> {
  const resp = await fetch(`/api/cart`, {
    cache: 'no-store',
  });

  const payload: ApiResponse<CartResponse> = await resp.json();
  return payload;
}
