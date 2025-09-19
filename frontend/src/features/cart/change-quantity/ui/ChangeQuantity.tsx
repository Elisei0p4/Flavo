import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCartStore } from '@/entities/cart';
import { motion } from 'framer-motion';

interface ChangeQuantityProps {
  productId: number;
  quantity: number;
}

export const ChangeQuantity: React.FC<ChangeQuantityProps> = ({ productId, quantity }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div className="flex items-center space-x-3 text-text-light">
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => updateQuantity(productId, quantity - 1)} 
        className="p-2 text-accent-gold hover:text-hover-gold transition-colors"
        aria-label="Уменьшить количество"
      >
        <FaMinus />
      </motion.button>
      <span className="w-8 text-center font-heading font-bold">{quantity}</span>
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => updateQuantity(productId, quantity + 1)} 
        className="p-2 text-accent-gold hover:text-hover-gold transition-colors"
        aria-label="Увеличить количество"
      >
        <FaPlus />
      </motion.button>
    </div>
  );
};