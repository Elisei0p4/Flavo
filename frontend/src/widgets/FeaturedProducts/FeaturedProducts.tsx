import React from 'react';
import { useProducts, ProductCard, ProductCardSkeleton } from '@/entities/product';
import { AddToCartButton } from '@/features/cart/add-to-cart';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider'; 
import { getErrorMessage } from '@/shared/lib/errorHandler';
import { Product } from '@/entities/product/model/types';

export const FeaturedProducts: React.FC = () => {
    const { data, isLoading, error } = useProducts(1, 'is_featured=true');
    const products = data?.results ?? [];

    if (error) {
        return (
            <section className="relative py-24 bg-main-dark bg-dark-engraving text-text-light">
                <SectionDivider variant="top" className="z-10" />
                <div className="page-container text-center py-20 border border-red-error/50 bg-red-error/10 p-8">
                    <p className="font-heading text-2xl text-red-error">Ошибка загрузки рекомендуемых блюд</p>
                    <p className="font-body text-text-light/70">{getErrorMessage(error)}</p>
                </div>
                <SectionDivider variant="bottom" className="z-10" />
            </section>
        );
    }

    return (
        <section className="relative py-24 bg-main-dark bg-dark-engraving text-text-light">
            <SectionDivider variant="top" className="z-10" />
            <div className="page-container">
                <SectionHeader 
                    title="Рекомендуем попробовать"
                    subtitle="Эти блюда - выбор наших шеф-поваров и настоящие хиты продаж."
                    className="!text-text-light"
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
                    ) : (
                        products.slice(0, 3).map((product: Product, index: number) => (
                             <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                actionSlot={<AddToCartButton product={product} />}
                            />
                        ))
                    )}
                </div>
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </section>
    );
};