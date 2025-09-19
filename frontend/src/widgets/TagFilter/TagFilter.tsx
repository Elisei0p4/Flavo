import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTags } from '@/entities/product';
import { motion } from 'framer-motion';

export const TagFilter: React.FC = () => {
    const { data: tags, isLoading } = useTags();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTag = searchParams.get('tags__slug');

    const handleTagClick = (slug?: string | null) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (slug) {
            newSearchParams.set('tags__slug', slug);
        } else {
            newSearchParams.delete('tags__slug');
        }
        newSearchParams.delete('page');
        setSearchParams(newSearchParams);
    };

    if (isLoading) {
        return (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 w-28 bg-main-dark/10 animate-pulse rounded-full" />
                ))}
            </div>
        );
    }

    if (!tags || tags.length === 0) return null;

    return (
        <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <button
                onClick={() => handleTagClick(null)}
                className={`font-sans text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 border-2 
                    ${!activeTag 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-transparent text-text-light/70 border-main-dark/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                }
            >
                Все
            </button>
            {tags.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.slug)}
                    className={`font-sans text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 border-2 
                        ${activeTag === tag.slug 
                            ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                            : 'bg-transparent text-text-light/70 border-main-dark/20 hover:border-accent-gold hover:text-accent-gold'
                        }`
                    }
                >
                    {tag.name}
                </button>
            ))}
        </motion.div>
    );
};