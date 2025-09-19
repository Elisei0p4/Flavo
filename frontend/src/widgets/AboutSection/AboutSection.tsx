import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider'; 

export const AboutSection: React.FC = () => {
    const ref = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center", "end start"] 
    });

    const x = useTransform(scrollYProgress, [0, 0.5, 1], ["100%", "0%", "0%"]); 
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]); 

    return (
        <section 
            id="about" 
            className="relative py-48 bg-why-us-decor-bottom bg-cover bg-center text-text-dark overflow-hidden min-h-[80vh]"
            ref={ref}
        > 
            <SectionDivider variant="top" className="z-10" /> 
            <div className="page-container relative z-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-display text-5xl mb-6 text-text-dark">О нас</h2>
                        <div className="space-y-4 text-lg text-text-dark/80 text-justify font-body">
                            <p>
                                FLAVO — это место, где традиции французской кухни встречаются с современным удобством. Мы предлагаем изысканные блюда, приготовленные с любовью и вниманием к каждой детали.
                            </p>
                            <p>
                                Наша миссия — принести вам гастрономическое удовольствие, используя только свежие и качественные ингредиенты от проверенных поставщиков.
                            </p>
                            <p>
                                Закажите еду у нас и окунитесь в мир неповторимых вкусов!
                            </p>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="hidden lg:block relative min-h-[350px]"
                        style={{ x, opacity }} 
                    >
                        <img 
                            src="/about-img.png" 
                            alt="Повара готовят на кухне" 
                            className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 w-full max-w-[500px] h-auto object-contain z-10"
                        />
                    </motion.div>
                </div>
            </div>
            <SectionDivider variant="bottom" className="z-10" />
        </section>
    );
}