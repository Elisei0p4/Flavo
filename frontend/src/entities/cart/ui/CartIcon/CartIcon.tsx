import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelectTotalItems } from '../../model/selectors';

export const CartIcon: React.FC = () => {
  const totalItems = useSelectTotalItems();

  return (
    <NavLink 
      to="/cart" 
      className="relative text-text-light hover:text-hover-gold transition-colors"
      data-testid="header-cart"
    >
      <FaShoppingCart size={22} />
      {totalItems > 0 && (
        <motion.span 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="absolute -top-2 -right-2 bg-red-error text-text-light text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-text-light"
        >
          {totalItems}
        </motion.span>
      )}
    </NavLink>
  );
};