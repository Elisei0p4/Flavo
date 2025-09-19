import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatMoneyInteger } from '@/shared/lib/money';
import type { Product } from '../../model/types';
import { FaStar } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
  actionSlot?: React.ReactNode;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" as const },
  }),
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, actionSlot, index }) => {
  const outOfStock = product.stock === 0;

  const cardClasses = `
    bg-dark-card text-parchment flex flex-col group transition-all duration-300 rounded-lg overflow-hidden
    relative 
    ${product.is_featured ? 'shadow-golden-glow' : 'shadow-lg shadow-black/30'}
  `;

  return (
    <motion.div
      data-testid="product-card"
      className={cardClasses}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      whileHover={{ y: -5 }}
    >
      {product.is_featured && (
        <div className="absolute top-2 right-2 bg-accent-gold text-main-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20">
          <FaStar /> РЕКОМЕНДУЕМ
        </div>
      )}
      
      <Link to={`/products/${product.slug}`} className="relative vintage-image-frame block">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full aspect-[4/3] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 shadow-inner" 
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-deep-black/70 flex items-center justify-center text-parchment font-bold uppercase tracking-wider text-xl z-10">
            Нет в наличии
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`}>
          <h3 data-testid="product-name" className="text-2xl font-heading mb-2 text-parchment group-hover:text-golden-accent transition-colors">{product.name}</h3>
        </Link>
        <p className="text-subtle-gray mb-4 flex-grow line-clamp-3 font-body text-base">{product.description}</p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-parchment/10">
          <span className="text-3xl font-heading font-bold text-parchment">{formatMoneyInteger(product.price)}</span>
          {actionSlot}
        </div>
      </div>
    </motion.div>
  );
};