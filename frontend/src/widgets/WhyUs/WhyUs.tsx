import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

const iconPaths = [
    "/1_rose.png",
    "/2_thistle.png",
    "/3_fleur_de_lis.webp"
];

const BenefitItem: React.FC<{ children: React.ReactNode; delay: number; iconIndex: number }> = ({ children, delay, iconIndex }) => {
    const currentIcon = iconPaths[iconIndex % iconPaths.length];
    return (
        <motion.div
            className="flex items-start gap-4 text-text-dark"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay }}
        >
            <img src={currentIcon} alt={`Пункт списка ${iconIndex + 1}`} className="w-6 h-6 object-contain mt-1" />
            <p className="font-body text-lg">{children}</p>
        </motion.div>
    );
};

export const WhyUs: React.FC = () => {
    return (
        <section
            id="why-us"
            className="relative py-24 bg-what-we-learn-bg bg-fixed bg-cover bg-center text-text-dark flex flex-col justify-center items-center"
        >
            {/* Оверлей для затемнения фона */}
            <div className="absolute inset-0 bg-white opacity-60 z-0"></div>

            <SectionDivider variant="top" className="z-10" />
            
            <div className="page-container relative z-20 flex flex-col items-center">
                <SectionHeader title="Почему выбирают нас?" className="!text-text-dark" />
                
                {/* Простая карточка с текстом */}
                <motion.div
                    className="max-w-2xl w-full mx-auto space-y-6 p-8 bg-main-light/90 rounded-lg shadow-lg border border-accent-gold/20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <BenefitItem delay={0.1} iconIndex={0}>
                        Мы используем только <span className="font-bold">свежайшие ингредиенты</span> от проверенных фермеров.
                    </BenefitItem>
                    <BenefitItem delay={0.2} iconIndex={1}>
                        Наши <span className="font-bold">шеф-повара</span> – настоящие виртуозы, мастера своего дела.
                    </BenefitItem>
                    <BenefitItem delay={0.3} iconIndex={2}>
                        Тщательно подобранное <span className="font-bold">меню</span> из классических и авторских блюд.
                    </BenefitItem>
                    <BenefitItem delay={0.4} iconIndex={0}>
                        <span className="font-bold">Безупречный сервис</span> и внимание к каждому клиенту.
                    </BenefitItem>
                    <BenefitItem delay={0.5} iconIndex={1}>
                        Быстрая и бережная <span className="font-bold">доставка</span>, сохраняющая аромат и вкус блюд.
                    </BenefitItem>
                    <BenefitItem delay={0.6} iconIndex={2}>
                        Мы создаем не просто еду, а <span className="font-bold">настоящие кулинарные впечатления</span>.
                    </BenefitItem>
                </motion.div>
            </div>

            <SectionDivider variant="bottom" className="z-10" />
        </section>
    );
};