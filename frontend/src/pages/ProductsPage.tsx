import { useSearchParams } from 'react-router-dom';
import { ProductList } from '@/widgets/ProductList/ProductList';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { motion } from 'framer-motion';
import { TagFilter } from '@/widgets';
import { CategorySidebar } from '@/widgets/CategorySidebar/CategorySidebar';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const filters = searchParams.toString();

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
          
          <div className="flex flex-col lg:flex-row gap-12">
            <CategorySidebar />
            <main className="flex-grow">
              <SectionHeader
                title="Наше Меню"
                subtitle="Откройте для себя блюда, созданные с вдохновением и страстью."
                className="!text-text-light"
              />
              <TagFilter />
              <ProductList filters={filters} />
            </main>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;