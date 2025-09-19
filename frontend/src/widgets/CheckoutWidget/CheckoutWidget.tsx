import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/entities/cart';
import { Button } from '@/shared/ui/Button';

export const CheckoutWidget: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);

  const { totalItems, totalPrice } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += Math.round(parseFloat(item.price) * 100) * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );
  }, [items]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="vintage-card-dark p-6 sticky top-28" data-testid="checkout-widget">
      <h3 className="font-heading text-2xl text-text-light mb-4 border-b border-text-light/10 pb-4">Итог</h3>
      <div className="space-y-2 mb-4 font-body text-text-light/80">
        <div className="flex justify-between">
          <span>Товары ({totalItems} шт.):</span>
          <span className="font-semibold text-text-light">{(totalPrice / 100).toFixed(2)} ₽</span>
        </div>
        <div className="flex justify-between">
          <span>Доставка:</span>
          <span className="font-semibold text-text-light">Бесплатно</span>
        </div>
      </div>
      <div className="flex justify-between font-heading font-bold text-xl border-t border-text-light/10 pt-4 text-text-light">
        <span>Всего:</span>
        <span>{(totalPrice / 100).toFixed(2)} ₽</span>
      </div>
      <Button onClick={handleCheckout} disabled={totalItems === 0} className="w-full mt-6" data-testid="checkout-button">
        Перейти к оформлению
      </Button>
    </div>
  );
};