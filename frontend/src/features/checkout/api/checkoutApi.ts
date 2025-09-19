import { api } from '@/shared/api/base';
import type { PromoCode } from '@/entities/order/model/types'; 

interface CreateCheckoutPayload {
  address: string;
  items: { product_id: number; quantity: number }[];
  promo_code?: string | null;
}

export const validatePromoCode = async (code: string): Promise<PromoCode> => {
    const { data } = await api.post<PromoCode>('/promocodes/validate/', { code });
    return data;
};

export const createCheckoutSession = async (payload: CreateCheckoutPayload): Promise<{ url: string }> => {
  const { data } = await api.post<{ url: string }>(`/payments/create-checkout-session/`, payload);
  return data;
};