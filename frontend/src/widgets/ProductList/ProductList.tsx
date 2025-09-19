import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, ProductCard, ProductCardSkeleton } from '@/entities/product';
import { AddToCartButton } from '@/features/cart/add-to-cart';
import { getErrorMessage } from '@/shared/lib/errorHandler';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { Button } from '@/shared/ui/Button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ProductListProps {
  filters: string;
}

export const ProductList: React.FC<ProductListProps> = ({ filters }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useProducts(currentPage, filters);
  
  const products = data?.results ?? [];
  const totalProducts = data?.count ?? 0;
  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    window.scrollTo(0, 0);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(newPage));
    setSearchParams(newSearchParams);
  };

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 border border-red-error/50 bg-red-error/10 p-8 text-text-light rounded-lg">
        <p className="font-heading text-2xl text-red-error">Ошибка загрузки продуктов</p>
        <p>{getErrorMessage(error)}</p>
      </div>
    );
  }

  if (products.length === 0 && !isFetching) {
    return (
      <div className="text-center py-20 text-text-light">
        <p className="font-heading text-2xl">К сожалению, по вашему запросу ничего не найдено.</p>
        <p className="font-body text-lg mt-4">Попробуйте изменить фильтры или вернуться к полному меню.</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute inset-0 bg-main-dark/50 flex items-center justify-center z-20 rounded-lg">
          <Spinner />
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, productIndex) => (
          <ProductCard
            key={product.id}
            product={product}
            index={productIndex} 
            actionSlot={<AddToCartButton product={product} />}
          />
        ))}
      </div>
      
      {/* ИЗМЕНЕНО: Добавляем блок пагинации */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!data?.previous}
            variant="secondary"
            aria-label="Предыдущая страница"
          >
            <FaChevronLeft />
          </Button>
          <span className="font-body text-lg text-text-light/80">
            Страница {currentPage} из {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!data?.next}
            variant="secondary"
            aria-label="Следующая страница"
          >
            <FaChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};