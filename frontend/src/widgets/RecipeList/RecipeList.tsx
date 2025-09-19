import React, { useRef, useEffect } from 'react';
import { useRecipes, RecipeCard, RecipeCardSkeleton } from '@/entities/recipe';
import { getErrorMessage } from '@/shared/lib/errorHandler';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { motion } from 'framer-motion';

interface RecipeListProps {
  filters: string;
  search: string;
  ordering: string;
}

export const RecipeList: React.FC<RecipeListProps> = ({ filters, search, ordering }) => {
  const loadMoreRef = useRef(null);
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useRecipes({ filters, search, ordering });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }, { threshold: 1.0 }
    );
    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recipes = data?.pages.flatMap(page => page.results) ?? [];

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => <RecipeCardSkeleton key={index} />)}
      </div>
    );
  }

  if (error && !isFetching && recipes.length === 0) {
    return (
      <div className="text-center py-20 border border-red-error/50 bg-red-error/10 p-8 text-text-light rounded-lg">
        <p className="font-heading text-2xl text-red-error">Ошибка загрузки рецептов</p>
        <p>{getErrorMessage(error)}</p>
      </div>
    );
  }

  if (recipes.length === 0 && !isFetching) {
    return (
      <div className="text-center py-20 text-text-light">
        <p className="font-heading text-2xl">К сожалению, по вашему запросу ничего не найдено.</p>
        <p className="font-body text-lg mt-4">Попробуйте изменить фильтры или вернуться к полному списку рецептов.</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {isFetching && !isFetchingNextPage && recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-main-dark/50 flex items-center justify-center z-20 rounded-lg"
        >
          <Spinner />
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, recipeIndex) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={recipeIndex} 
          />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && recipes.length > 0 && !isFetchingNextPage && (
          <p className="font-body text-text-light/70 text-center mt-8">Все рецепты загружены.</p>
        )}
      </div>
    </div>
  );
};