import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecipeTags } from '@/entities/recipe';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaTimes } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button';

export const RecipeFilter: React.FC = () => {
  const { data: tags, isLoading: isLoadingTags } = useRecipeTags();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTagSlug = searchParams.get('tags__slug');
  const activeDifficulty = searchParams.get('difficulty');
  const searchQuery = searchParams.get('search') || '';
  const ordering = searchParams.get('ordering') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

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

  const handleDifficultyClick = (difficulty?: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (difficulty) {
      newSearchParams.set('difficulty', difficulty);
    } else {
      newSearchParams.delete('difficulty');
    }
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (localSearchQuery) {
      newSearchParams.set('search', localSearchQuery);
    } else {
      newSearchParams.delete('search');
    }
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  };

  const handleOrderingChange = (newOrdering: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (ordering === newOrdering) {
      newSearchParams.delete('ordering');
    } else {
      newSearchParams.set('ordering', newOrdering);
    }
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalSearchQuery('');
  };

  const difficultyOptions = [
    { value: 'EASY', label: 'Легкий' },
    { value: 'MEDIUM', label: 'Средний' },
    { value: 'HARD', label: 'Сложный' },
  ];

  return (
    <div className="mb-12 sticky top-28 bg-main-dark/90 backdrop-blur-sm z-30 p-4 rounded-lg shadow-lg border border-accent-gold/20">
      {/* Поиск */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Поиск рецептов..."
          className="flex-grow p-3 bg-main-dark border border-accent-gold/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold placeholder-text-light/60 text-text-light font-body"
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" className="!px-4">
          <FaSearch />
        </Button>
        <Button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} variant="secondary" className="!px-4">
          <FaFilter />
        </Button>
      </form>

      {/* Меню фильтров */}
      <AnimatePresence>
        {isFilterMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-dark-card/80 p-4 rounded-md mt-4 border border-accent-gold/10"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-text-light/10">
              <h4 className="font-heading text-xl text-text-light">Фильтры</h4>
              <Button onClick={() => setIsFilterMenuOpen(false)} variant="secondary" className="!px-3 !py-1">
                <FaTimes />
              </Button>
            </div>

            {/* Фильтр по сложности */}
            <div className="mb-6">
              <p className="font-heading text-lg text-text-light mb-2">Сложность:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDifficultyClick(null)}
                  className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                    ${!activeDifficulty 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                  }
                >
                  Все
                </button>
                {difficultyOptions.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => handleDifficultyClick(diff.value)}
                    className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                      ${activeDifficulty === diff.value 
                          ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                          : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                      }`
                    }
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Фильтр по тегам */}
            <div className="mb-6">
              <p className="font-heading text-lg text-text-light mb-2">Теги:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagClick(null)}
                  className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                    ${!activeTagSlug 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                  }
                >
                  Все
                </button>
                {isLoadingTags ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 w-28 bg-white/10 animate-pulse rounded-full" />
                  ))
                ) : (
                  tags?.map((tag) => (
                    tag.slug && <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.slug)}
                      className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                        ${activeTagSlug === tag.slug 
                            ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                            : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                        }`
                      }
                    >
                      {tag.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Сортировка */}
            <div className="mb-6">
              <p className="font-heading text-lg text-text-light mb-2">Сортировка:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleOrderingChange('title')}
                  className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                    ${ordering === 'title' 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                  }
                >
                  <FaSortAlphaDown className="inline-block mr-2" /> По названию (А-Я)
                </button>
                <button
                  onClick={() => handleOrderingChange('-title')}
                  className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                    ${ordering === '-title' 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                  }
                >
                  <FaSortAlphaUp className="inline-block mr-2" /> По названию (Я-А)
                </button>
                <button
                  onClick={() => handleOrderingChange('-created_at')}
                  className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                    ${ordering === '-created_at' 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                  }
                >
                  Новые
                </button>
                <button
                  onClick={() => handleOrderingChange('created_at')}
                  className={`font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border-2 
                    ${ordering === 'created_at' 
                        ? 'bg-parchment-texture-bg bg-cover bg-center text-main-dark border-accent-gold' 
                        : 'bg-main-dark/50 text-text-light/70 border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold'
                    }`
                  }
                >
                  Старые
                </button>
              </div>
            </div>

            {(searchQuery || activeTagSlug || activeDifficulty || ordering) && (
              <Button onClick={clearAllFilters} variant="secondary" className="w-full mt-4 !text-red-400 !border-red-400 hover:!bg-red-400 hover:!text-white">
                <FaTimes className="inline-block mr-2" /> Сбросить все фильтры
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};