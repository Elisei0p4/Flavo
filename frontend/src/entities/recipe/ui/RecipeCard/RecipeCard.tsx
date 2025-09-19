import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaFire, FaUserFriends, FaStar } from 'react-icons/fa';
import type { Recipe } from '../../model/types';

interface RecipeCardProps {
  recipe: Recipe;
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

const difficultyMap: Record<Recipe['difficulty'], { text: string; color: string }> = {
    EASY: { text: 'Легкий', color: 'text-green-400' },
    MEDIUM: { text: 'Средний', color: 'text-yellow-400' },
    HARD: { text: 'Сложный', color: 'text-red-400' },
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  const { text: difficultyText, color: difficultyColor } = difficultyMap[recipe.difficulty || 'MEDIUM'];

  return (
    <motion.div
      data-testid="recipe-card"
      className="bg-dark-card text-parchment flex flex-col group transition-all duration-300 rounded-lg overflow-hidden shadow-lg shadow-black/30"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      whileHover={{ y: -5, boxShadow: '0 0 15px rgba(181, 146, 79, 0.6)' }}
    >
      <Link to={`/recipes/${recipe.slug}`} className="relative vintage-image-frame block">
        <img 
          src={recipe.image || ''} 
          alt={recipe.title} 
          className="w-full h-full aspect-[4/3] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 shadow-inner" 
        />
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/recipes/${recipe.slug}`}>
          <h3 data-testid="recipe-title" className="text-2xl font-heading mb-2 text-parchment group-hover:text-golden-accent transition-colors">
            {recipe.title}
          </h3>
        </Link>
        <p className="text-subtle-gray mb-4 flex-grow line-clamp-3 font-body text-base">
          {recipe.short_description}
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-body text-text-light/70 mb-4">
          <span className="flex items-center gap-1.5"><FaClock className="text-accent-gold"/> {recipe.prep_time} мин</span>
          <span className="flex items-center gap-1.5"><FaFire className="text-accent-gold"/> {recipe.cook_time} мин</span>
          <span className="flex items-center gap-1.5"><FaUserFriends className="text-accent-gold"/> {recipe.servings} порц.</span>
          <span className={`flex items-center gap-1.5 font-bold ${difficultyColor}`}><FaStar /> {difficultyText}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
            {recipe.category && (
                <Link to={`/recipes?category__slug=${recipe.category.slug}`} className="flex items-center gap-1.5 font-sans text-xs bg-main-dark/10 text-text-dark/80 px-3 py-1 rounded-full hover:bg-accent-gold hover:text-main-dark transition-colors">
                    {recipe.category.icon && <img src={recipe.category.icon} alt={recipe.category.name} className="w-4 h-4 object-contain filter invert" />}
                    {recipe.category.name}
                </Link>
            )}
            {recipe.tags && recipe.tags.map(tag => (
                tag.slug && <Link to={`/recipes?tags__slug=${tag.slug}`} key={tag.id} className="flex items-center gap-1.5 font-sans text-xs bg-main-dark/10 text-text-dark/80 px-3 py-1 rounded-full hover:bg-accent-gold hover:text-main-dark transition-colors">
                    {tag.name}
                </Link>
            ))}
        </div>

        <div className="mt-auto pt-4 border-t border-parchment/10">
          <Link to={`/recipes/${recipe.slug}`} className="btn-vintage-primary w-full text-center">
            Посмотреть рецепт
          </Link>
        </div>
      </div>
    </motion.div>
  );
};