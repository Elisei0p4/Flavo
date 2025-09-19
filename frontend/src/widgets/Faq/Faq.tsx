import React from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/base';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import type { components } from '@/api/schema';

type FAQItem = components['schemas']['FAQ'];

const fetchFaqs = async (): Promise<FAQItem[]> => {
  const { data } = await api.get<{ results: FAQItem[] }>('/faqs/');
  return data.results;
};

const FAQAccordionItem: React.FC<{ faq: FAQItem; delay: number }> = ({ faq, delay }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className="bg-main-dark/70 border border-accent-gold/20 shadow-inner-dark mb-4 last:mb-0 rounded-lg"
    >
      <button
        className="flex justify-between items-center w-full text-left font-heading text-lg text-text-light hover:text-hover-gold transition-colors p-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span>{faq.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl text-accent-gold"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${faq.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="p-4 pt-0 font-body text-text-light/80">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Faq: React.FC = () => {
  const { data: faqs, isLoading, error } = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFaqs,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-center text-red-error font-body">Не удалось загрузить вопросы.</div>;
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="relative py-24 bg-main-dark bg-dark-engraving text-text-light">
      <SectionDivider variant="top" className="z-10" /> 
      <div className="page-container max-w-3xl">
        <SectionHeader title="Вопросы и ответы" />
        <div className="mt-8">
          {faqs.map((faq, index) => (
            <FAQAccordionItem key={faq.id} faq={faq} delay={0.1 * index} />
          ))}
        </div>
      </div>
      <SectionDivider variant="bottom" className="z-10" />
    </section>
  );
};