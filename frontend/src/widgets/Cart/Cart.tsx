import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, CartItemRow } from '@/entities/cart';
import { CheckoutWidget } from '@/widgets/CheckoutWidget';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';

export const Cart = () => {
  const items = useCartStore((state) => state.items);

  return (
    <>
      <SectionHeader title="Ваша Корзина" className="!text-text-light" />
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 vintage-card-dark p-6">
          <AnimatePresence>
            {items.length > 0 ? (
              items.map(item => <CartItemRow key={item.id} item={item} />)
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <p className="font-body text-text-light/80 text-lg">Здесь пока пусто.</p>
                <Link to="/products" className="mt-4 inline-block font-heading text-xl text-accent-gold hover:text-hover-gold transition-colors">
                  Перейти к покупкам
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="lg:col-span-1">
          <CheckoutWidget />
        </div>
      </div>
    </>
  );
};