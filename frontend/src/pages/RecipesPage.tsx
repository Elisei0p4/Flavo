import { useSearchParams } from 'react-router-dom';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { motion } from 'framer-motion';
import { RecipeList } from '@/widgets/RecipeList/RecipeList';
import { RecipeCategorySidebar } from '@/widgets/RecipeCategorySidebar/RecipeCategorySidebar';
import { RecipeFilter } from '@/widgets/RecipeFilter/RecipeFilter';

const RecipesPage = () => {
  const [searchParams] = useSearchParams();
  const filters = searchParams.toString();
  const searchQuery = searchParams.get('search') || '';
  const ordering = searchParams.get('ordering') || '';

  return (
    <motion.div
      className="bg-main-dark bg-menu-background bg-cover bg-center bg-fixed text-text-light min-h-screen relative" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-main-dark/80 via-main-dark/50 to-main-dark/50 z-0" />
      
      <div className="relative z-10 min-h-full">
        <div className="page-container py-16 pt-32">
          <SectionHeader
            title="Наши Рецепты"
            subtitle="Откройте для себя мир кулинарных шедевров и попробуйте приготовить их дома."
            className="!text-text-light"
          />
          
          <div className="flex flex-col lg:flex-row gap-12">
            <RecipeCategorySidebar />
            <main className="flex-grow">
              <RecipeFilter />
              <RecipeList filters={filters} search={searchQuery} ordering={ordering} />
            </main>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipesPage;