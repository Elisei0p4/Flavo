import React from 'react';
import { motion } from 'framer-motion';
import { ChangeQuantity } from '@/features/cart/change-quantity';
import { RemoveFromCartButton } from '@/features/cart/remove-from-cart';
import { formatMoneyInteger, calculateItemTotal } from '@/shared/lib/money';
import type { CartItem } from '../../model/types';

export const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-4 py-4 border-b border-text-light/10 last:border-b-0"
    >
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover border border-text-light/20" />
      <div className="flex-grow">
        <h3 className="font-heading text-lg text-text-light">{item.name}</h3>
        <p className="font-body text-sm text-text-light/80">{formatMoneyInteger(item.price)}</p>
      </div>
      <ChangeQuantity productId={item.id} quantity={item.quantity} />
      <div className="w-24 text-right font-heading font-bold text-text-light">
        {formatMoneyInteger(calculateItemTotal(item.price, item.quantity))}
      </div>
      <RemoveFromCartButton productId={item.id} />
    </motion.div>
  );
};