import React, { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaTags } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { useCartStore } from '@/entities/cart';
import type { PromoCode } from '@/entities/order/model/types';
import { getErrorMessage } from '@/shared/lib/errorHandler';
import { Button } from '@/shared/ui/Button';
import * as checkoutApi from '../api/checkoutApi';

type CheckoutFormInputs = { address: string };

export const CheckoutForm: React.FC = () => {
  const items = useCartStore((state) => state.items);
  
  const { totalItems, totalPrice } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += Number(item.price) * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );
  }, [items]);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormInputs>();

  const promoMutation = useMutation({
    mutationFn: checkoutApi.validatePromoCode,
    onSuccess: (data) => {
      setAppliedPromo(data);
      toast.success(`Промокод ${data.code} применен! Скидка ${data.discount_percent}%.`);
    },
    onError: (error) => {
      setAppliedPromo(null);
      toast.error(getErrorMessage(error));
    }
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutApi.createCheckoutSession,
    onSuccess: (data) => { window.location.href = data.url; },
    onError: (error) => { toast.error(`Ошибка: ${getErrorMessage(error)}`); }
  });

  const discountAmount = appliedPromo?.is_valid ? totalPrice * (appliedPromo.discount_percent / 100) : 0;
  const finalPrice = totalPrice - discountAmount;

  const onSubmit: SubmitHandler<CheckoutFormInputs> = (data) => {
    if (totalItems === 0) {
      toast.error("Ваша корзина пуста.");
      return;
    }
    checkoutMutation.mutate({
      address: data.address,
      items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
      promo_code: appliedPromo?.code,
    });
  };

  return (
    <div className="vintage-card-dark p-6 sticky top-28">
      <h3 className="font-heading text-2xl text-text-light mb-4 border-b border-text-light/10 pb-4">Итог заказа</h3>
      <div className="flex items-stretch mb-4">
          <input 
              type="text" 
              placeholder="Промокод"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
              className="font-body flex-grow p-2 bg-main-dark border border-r-0 border-accent-gold/20 rounded-none focus:outline-none focus:ring-2 focus:ring-accent-gold placeholder-text-light/60"
              disabled={promoMutation.isPending}
          />
          <button 
              onClick={() => promoCodeInput && promoMutation.mutate(promoCodeInput.trim())}
              disabled={promoMutation.isPending}
              className="bg-main-dark border border-accent-gold/20 px-4 hover:bg-main-dark/50 text-text-light transition-colors duration-200"
          >
              {promoMutation.isPending ? '...' : <FaTags />}
          </button>
      </div>
      <div className="space-y-2 mb-4 font-body text-text-light/80">
        <div className="flex justify-between"><span>Товары ({totalItems} шт.):</span><span className="font-semibold text-text-light">{Math.floor(totalPrice)} ₽</span></div>
        {appliedPromo && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between text-green-400"><span>Скидка ({appliedPromo.discount_percent}%):</span><span className="font-semibold">- {Math.floor(discountAmount)} ₽</span></motion.div>)}
      </div>
      <div className="flex justify-between font-heading font-bold text-xl border-t border-text-light/10 pt-4 text-text-light"><span>Всего к оплате:</span><span>{Math.floor(finalPrice)} ₽</span></div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="mb-4">
          <label htmlFor="address" className="block text-text-light/80 mb-2 font-body">Адрес доставки</label>
          <textarea
            id="address"
            {...register("address", { required: "Адрес не может быть пустым" })}
            rows={3}
            className={`font-body w-full p-2 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.address ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
            placeholder="Город, улица, дом, квартира"
            disabled={checkoutMutation.isPending}
          />
          {errors.address && <p className="text-red-error text-sm mt-1">{errors.address.message}</p>}
        </div>
        <Button type="submit" disabled={totalItems === 0 || checkoutMutation.isPending} className="w-full">
          {checkoutMutation.isPending ? 'Перенаправление...' : 'Перейти к оплате'}
        </Button>
      </form>
    </div>
  );
};