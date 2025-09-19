import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '@/widgets/Hero/Hero';
import { 
  AboutSection,
  WhyUs,
  ReviewsSection,
  InteractiveFaqSection,
} from '@/widgets';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import React from 'react';

const WhoIsItForSection: React.FC = () => {
  const listItems = [
    "Кто хочет погрузиться в мир изысканной французской кухни — понять основные принципы и узнать, что принято считать эталоном вкуса в этой кулинарной традиции.",
    "Кто ищет рецепты из-за рубежа либо планирует гастрономическое путешествие — быть готовым уже на этапе выбора блюд и их приготовления.",
    "Кому не хватает уверенности на кухне — отточить навыки в типичных рецептах и легко применять готовые техники и кулинарные приёмы.",
  ];

  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
  });

  const imagesGroupX = useTransform(scrollYProgress, [0, 0.4, 1], ["-100%", "0%", "-90%"]); 
  const imagesGroupOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);


  return (
    <section 
        className="relative py-8 bg-full-parchment-bg bg-cover bg-no-repeat bg-center text-text-dark overflow-hidden" 
        ref={ref}
    > 
      <SectionDivider variant="top" className="z-10" /> 
      <div className="page-container relative z-20">
        <h2 className="font-display text-5xl text-center mb-6 text-text-dark">Кому пригодится?</h2>
        <ul className="list-none space-y-4 mt-8 max-w-3xl mx-auto font-body text-lg">
          {listItems.map((item, index) => (
            <motion.li 
              key={index} 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="font-heading text-xl text-accent-gold">{index + 1}.</span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div
            className="absolute bottom-[-50px] left-0 flex items-end z-10" 
            style={{ x: imagesGroupX, opacity: imagesGroupOpacity }}
        >
            <img src="/bg-chef.jpg" alt="Знаток кухни" className="w-auto h-[160px] object-contain mb-[7px]" />
            <img src="/bg-cooking-pot.jpg" alt="Алхимический котел" className="w-auto h-[160px] object-contain ml-1" />
        </motion.div>

      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <AboutSection /> 
      <WhyUs />
      <WhoIsItForSection /> 

      <div className="relative bg-faq-reviews-combined-bg bg-cover bg-center bg-no-repeat">
        <InteractiveFaqSection /> 
        <ReviewsSection />
      </div>
    </>
  );
};

export default HomePage;