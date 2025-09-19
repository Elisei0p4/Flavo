import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/entities/product';
import { AddToCartButton } from '@/features/cart/add-to-cart';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { motion } from 'framer-motion';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { formatMoneyInteger } from '@/shared/lib/money';
import { FaTag, FaLeaf, FaStar } from 'react-icons/fa';

const ProductDetailPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  
  const { data: product, isLoading, error } = useProduct(productSlug || '');

  if (!productSlug) return <div>Продукт не найден.</div>; 
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-main-light"><Spinner /></div>;
  if (error || !product) return <div className="text-center py-20 text-red-error font-body text-lg bg-main-light">Не удалось загрузить продукт.</div>;

  return (
    <div className="bg-main-light bg-light-engraving text-text-dark min-h-screen pt-32"> 
      <SectionDivider variant="top" className="z-10" />
      <motion.div 
        className="page-container py-16"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <motion.div 
              className="lg:col-span-3"
              variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
          >
            <div className="vintage-image-frame">
              <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover shadow-lg" />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
          >
            {product.category && (
              <Link to={`/products?category__slug=${product.category.slug}`} className="font-sans text-sm uppercase tracking-widest text-accent-gold hover:underline">
                {product.category.name}
              </Link>
            )}
            <h1 className="font-display text-5xl text-text-dark my-2">{product.name}</h1>
            <p className="font-body text-lg text-text-dark/80 mb-6 leading-relaxed">{product.description}</p>
            
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  tag.slug && <Link to={`/products?tags__slug=${tag.slug}`} key={tag.id} className="flex items-center gap-1.5 font-sans text-xs bg-main-dark/10 text-text-dark/80 px-3 py-1 rounded-full hover:bg-accent-gold hover:text-main-dark transition-colors">
                    <FaTag size={10} />
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between bg-main-light border-2 border-accent-gold/20 p-4 shadow-card-shadow rounded-lg mb-6">
              <span className="font-heading text-4xl text-accent-gold">{formatMoneyInteger(product.price)}</span>
              <AddToCartButton product={product} />
            </div>

            {product.ingredients && (
                <div className="mb-6">
                    <h3 className="font-heading text-xl flex items-center gap-2 text-text-dark border-b-2 border-accent-gold/20 pb-2 mb-3">
                        <FaLeaf className="text-accent-gold"/> Состав
                    </h3>
                    <p className="font-body text-base text-text-dark/80">{product.ingredients}</p>
                </div>
            )}

            {product.chef_recommendation && (
                <div>
                    <h3 className="font-heading text-xl flex items-center gap-2 text-text-dark border-b-2 border-accent-gold/20 pb-2 mb-3">
                        <FaStar className="text-accent-gold"/> Рекомендация от шефа
                    </h3>
                    <p className="font-body text-base text-text-dark/80 italic">"{product.chef_recommendation}"</p>
                </div>
            )}

          </motion.div>
        </div>
      </motion.div>
      <SectionDivider variant="bottom" className="z-10" />
    </div>
  );
};

export default ProductDetailPage;