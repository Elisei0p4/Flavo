import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecipeCategories } from '@/entities/recipe';
import { motion } from 'framer-motion';

const SkeletonItem: React.FC = () => (
    <div className="h-12 w-full bg-white/10 animate-pulse rounded-md mb-3" />
);

export const RecipeCategorySidebar: React.FC = () => {
    const { data: categories, isLoading } = useRecipeCategories();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category__slug');

    const handleCategoryClick = (slug: string | null) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (slug) {
            newSearchParams.set('category__slug', slug);
        } else {
            newSearchParams.delete('category__slug');
        }
        newSearchParams.delete('page');
        setSearchParams(newSearchParams);
    };

    return (
        <aside 
            className="w-full lg:w-64 flex-shrink-0 sticky top-28 self-start p-4 rounded-lg bg-main-dark/90 backdrop-blur-sm z-20"
        >
            <h3 className="font-display text-3xl text-text-light mb-6 border-b-2 border-accent-gold/20 pb-2">
                Категории Рецептов
            </h3>
            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
                ) : (
                    <>
                        <motion.button
                            onClick={() => handleCategoryClick(null)}
                            className={`w-full text-left font-heading text-lg p-3 rounded-md transition-all duration-300 flex items-center gap-3 
                                ${!activeCategory 
                                    ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-2 border-accent-gold shadow-md' 
                                    : 'bg-dark-card text-text-light/80 hover:bg-main-dark/80 hover:text-accent-gold' 
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Все Рецепты
                        </motion.button>
                        {categories?.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.slug || null)} 
                                className={`w-full text-left font-heading text-lg p-3 rounded-md transition-all duration-300 flex items-center gap-4 
                                    ${activeCategory === category.slug 
                                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-2 border-accent-gold shadow-md' 
                                        : 'bg-dark-card text-text-light/80 hover:bg-main-dark/80 hover:text-accent-gold' 
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {category.icon && (
                                    <img 
                                        src={category.icon}
                                        alt={category.name} 
                                        className="w-5 h-5 object-contain flex-shrink-0 filter invert"
                                    />
                                )}
                                <span>{category.name}</span>
                            </motion.button>
                        ))}
                    </>
                )}
            </div>
        </aside>
    );
};