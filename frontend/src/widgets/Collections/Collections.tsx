import React from "react";
import { useCollections } from '@/entities/product';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getErrorMessage } from "@/shared/lib/errorHandler";

const CollectionCard: React.FC<{ collection: any; delay: number }> = ({ collection, delay }) => (
    <motion.div
        className="relative h-64 bg-main-dark border border-accent-gold/20 shadow-inner-dark overflow-hidden group transform hover:-translate-y-1 hover:border-accent-gold transition-all duration-300 hover:shadow-gold-glow rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay }}
    >
        <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center p-4">
            <h3 className="font-display text-4xl text-text-light group-hover:text-hover-gold transition-colors z-10 text-center">{collection.name}</h3>
        </div>
        <Link to={`/collections/${collection.slug}`} className="absolute inset-0 z-20" aria-label={`Перейти к коллекции ${collection.name}`}></Link>
    </motion.div>
);

export const Collections: React.FC = () => {
    const { data: collections, isLoading, error } = useCollections();

    if (isLoading) return <Spinner />;
    if (error) return (
      <div className="text-center py-20 border border-red-error/50 bg-red-error/10 p-8 text-text-dark rounded-lg">
        <p className="font-heading text-2xl text-red-error">Ошибка загрузки коллекций</p><p>{getErrorMessage(error)}</p>
      </div>
    );
    if (!collections || collections.length === 0) return (
      <div className="text-center py-20 text-text-dark">
        <p className="font-heading text-2xl">Коллекции пока отсутствуют.</p>
        <p className="font-body text-lg mt-4">Мы работаем над новыми подборками!</p>
      </div>
    );

  return (
    <section className="py-16 bg-main-light bg-light-engraving text-text-dark">
      <div className="page-container">
        <SectionHeader title="Наши коллекции" subtitle="Уникальные подборки блюд, созданные специально для ценителей." className="!text-text-dark" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} delay={0.1 * index} />
            ))}
        </div>
      </div>
    </section>
  );
};