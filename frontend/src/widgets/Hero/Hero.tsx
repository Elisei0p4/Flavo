import React from 'react';
import { motion } from 'framer-motion';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

const CurriculumBlock: React.FC<{ number: string; title: string; subtitle: string; image: string; delay: number }> = ({ number, title, subtitle, image, delay }) => (
  <motion.div 
    className="relative flex flex-col items-center text-center p-4 lg:p-6" 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay }}
  >
    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex items-center justify-center font-display text-2xl text-text-light z-10">
      {number}
    </div>
    <img src={image} alt={title} className="h-40 w-auto object-contain mb-4" /> 
    <h3 className="font-heading text-2xl text-text-light mb-2 text-center">{title}</h3>
    <p className="font-body text-base text-text-light/80 text-center">{subtitle}</p>
  </motion.div>
);

const Hero: React.FC = () => {
  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const headerOffset = 80; 
      const elementPosition = aboutSection.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-between bg-dark-engraving bg-fixed bg-cover bg-center text-text-light">
      <div className="absolute inset-0 bg-main-dark/70" />

      <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center pt-32 pb-12">
        <motion.h1
          className="font-display text-6xl md:text-8xl tracking-widest leading-none mb-6 animate-fadeIn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
        >
          FLAVO - Изысканные вкусы
        </motion.h1>
        
        <motion.p
          className="font-body text-xl md:text-2xl text-text-light/80 max-w-2xl mx-auto mb-12 animate-fadeIn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4 }}
        >
          Откройте для себя мир кулинарных шедевров с доставкой прямо к вашей двери.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 page-container">
          <CurriculumBlock number="I" title="Свежие ингредиенты" subtitle="" image="/curriculum-icon-1.png" delay={0.6} />
          <CurriculumBlock number="II" title="Традиционные рецепты" subtitle="" image="/curriculum-icon-2.png" delay={0.8} />
          <CurriculumBlock number="III" title="Авторские десерты" subtitle="" image="/curriculum-icon-3.png" delay={1.0} />
          <CurriculumBlock number="IV" title="Изысканная подача" subtitle="" image="/curriculum-icon-4.png" delay={1.2} />
        </div>

        <a 
          onClick={handleScrollToAbout}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-light/80 hover:text-hover-gold transition-colors group animate-bounceArrow cursor-pointer"
        >
            <span className="font-heading text-sm uppercase">О нас</span>
            <div className="w-px h-8 bg-accent-gold"></div>
            <img 
              src="/bells-ornament.png" 
              alt="Орнамент колокольчики" 
              className="w-12 h-auto" 
            />
        </a>
      </div>
      
      <SectionDivider variant="bottom" className="z-20" />
    </section>
  );
};

export default Hero;