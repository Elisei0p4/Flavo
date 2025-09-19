import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRecipe, RecipeDifficulty, RecipeTag } from '@/entities/recipe'; 
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { motion } from 'framer-motion';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { FaClock, FaFire, FaUserFriends, FaStar, FaTag, FaBookOpen } from 'react-icons/fa';

const difficultyMap: Record<RecipeDifficulty, { text: string; color: string }> = {
    EASY: { text: 'Легкий', color: 'text-green-400' },
    MEDIUM: { text: 'Средний', color: 'text-yellow-400' },
    HARD: { text: 'Сложный', color: 'text-red-400' },
};

const RecipeDetailPage: React.FC = () => {
  const { recipeSlug } = useParams<{ recipeSlug: string }>();
  
  const { data: recipe, isLoading, error } = useRecipe(recipeSlug || '');

  if (!recipeSlug) return <div className="text-center py-20 text-red-error font-body text-lg bg-main-light">Неверный URL рецепта.</div>; 
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-main-light"><Spinner /></div>;
  if (error || !recipe) return <div className="text-center py-20 text-red-error font-body text-lg bg-main-light">Не удалось загрузить рецепт.</div>;

  const { text: difficultyText, color: difficultyColor } = difficultyMap[recipe.difficulty as RecipeDifficulty || 'MEDIUM'];

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
              <img src={recipe.image || ''} alt={recipe.title} className="w-full h-full object-cover shadow-lg" />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
          >
            {recipe.category && (
              <Link to={`/recipes?category__slug=${recipe.category.slug}`} className="font-sans text-sm uppercase tracking-widest text-accent-gold hover:underline">
                {recipe.category.name}
              </Link>
            )}
            <h1 className="font-display text-5xl text-text-dark my-2">{recipe.title}</h1>
            <p className="font-body text-lg text-text-dark/80 mb-6 leading-relaxed">{recipe.short_description}</p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-base font-body text-text-dark/80 mb-6 bg-main-light border-2 border-accent-gold/20 p-4 shadow-card-shadow rounded-lg">
                <span className="flex items-center gap-2"><FaClock className="text-accent-gold" /> Подготовка: {recipe.prep_time} мин</span>
                <span className="flex items-center gap-2"><FaFire className="text-accent-gold" /> Приготовление: {recipe.cook_time} мин</span>
                <span className="flex items-center gap-2"><FaUserFriends className="text-accent-gold" /> Порций: {recipe.servings}</span>
                <span className={`flex items-center gap-2 font-bold ${difficultyColor}`}><FaStar /> Сложность: {difficultyText}</span>
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.tags.map((tag: RecipeTag) => (
                  tag.slug && <Link to={`/recipes?tags__slug=${tag.slug}`} key={tag.id} className="flex items-center gap-1.5 font-sans text-xs bg-main-dark/10 text-text-dark/80 px-3 py-1 rounded-full hover:bg-accent-gold hover:text-main-dark transition-colors">
                    <FaTag size={10} />
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="mt-8 border-t-2 border-accent-gold/20 pt-8">
                <h3 className="font-heading text-2xl flex items-center gap-3 text-text-dark mb-4">
                    <FaBookOpen className="text-accent-gold"/> Инструкция по приготовлению
                </h3>
                <div className="font-body text-base text-text-dark/80 leading-relaxed whitespace-pre-line">
                    {recipe.full_description}
                </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
      <SectionDivider variant="bottom" className="z-10" />
    </div>
  );
};

export default RecipeDetailPage;