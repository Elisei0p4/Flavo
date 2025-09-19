import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

export const CallToAction: React.FC = () => {
  return (
    <section className="relative bg-main-light bg-light-engraving text-text-dark py-24">
      <SectionDivider variant="top" className="z-10" /> 
      <div className="page-container text-center">
        <SectionHeader 
          title="Готовы начать творить?"
          subtitle="Исследуйте наше меню и найдите идеальные блюда, которые вдохновят вас на новые кулинарные подвиги."
          className="!text-text-dark"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NavLink to="/products">
            <Button variant="primary">
              Изучить меню
            </Button>
          </NavLink>
        </motion.div>
      </div>
      <SectionDivider variant="bottom" className="z-10" />
    </section>
  );
};