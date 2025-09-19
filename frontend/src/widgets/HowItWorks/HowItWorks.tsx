import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

const StepCard: React.FC<{
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  delay: number;
}> = ({ number, title, description, imageSrc, delay }) => (
  <motion.div
    className="flex flex-col items-center text-center p-6 border border-accent-gold/20 bg-main-dark/50 transform hover:-translate-y-1 hover:border-accent-gold transition-all duration-300 shadow-inner-dark rounded-lg"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, delay }}
  >
    <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <img src={imageSrc} alt={title} className="w-full h-full object-contain filter invert" />
    </div>
    <div className="font-heading text-xl text-accent-gold mb-2">{number}</div>
    <h3 className="font-heading text-2xl text-text-light mb-2">{title}</h3>
    <p className="font-body text-sm text-text-light/80 flex-grow">{description}</p>
  </motion.div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section className="relative py-24 bg-main-dark bg-dark-engraving text-text-light">
      <SectionDivider variant="top" className="z-10" />
      <div className="page-container">
        <SectionHeader
          title="От закупки до Вашей тарелки"
          subtitle="Мы контролируем каждый этап, чтобы гарантировать непревзойденное качество и свежесть наших блюд."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <StepCard
            number="I."
            title="Отборные продукты"
            description="Мы сотрудничаем с лучшими фермерами, которые выращивают овощи и мясо без использования химикатов."
            imageSrc="/process-step-1.svg"
            delay={0.1}
          />
          <StepCard
            number="II."
            title="Бережная готовка"
            description="Свежие ингредиенты готовятся по традиционным рецептам, сохраняя все свои вкусы и полезные свойства."
            imageSrc="/process-step-2.svg"
            delay={0.3}
          />
          <StepCard
            number="III."
            title="Фирменная подача"
            description="Наши мастера создают уникальные блюда, которые идеально подходят для любого случая."
            imageSrc="/process-step-3.svg"
            delay={0.5}
          />
        </div>
      </div>
      <SectionDivider variant="bottom" className="z-10" />
    </section>
  );
};