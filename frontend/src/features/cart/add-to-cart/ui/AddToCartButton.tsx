import React from 'react';
import { useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { FaCartPlus } from "react-icons/fa";
import { motion } from 'framer-motion';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = product.stock === 0;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={() => addItem(product)}
      disabled={outOfStock}
      className="bg-accent-gold text-main-dark p-3 transition-colors hover:bg-hover-gold disabled:bg-gray-600 disabled:cursor-not-allowed"
      aria-label="Добавить в корзину"
    >
      {outOfStock ? 'X' : <FaCartPlus size={20} />}
    </motion.button>
  );
};