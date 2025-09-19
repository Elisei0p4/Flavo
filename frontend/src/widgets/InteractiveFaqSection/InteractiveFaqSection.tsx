import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '@/shared/hooks/useTypewriter';

const faqData = [
    { id: 1, question: "Как сделать заказ?", answer: "Вы можете оформить заказ через наш сайт, выбрав понравившиеся блюда из меню и добавив их в корзину." },
    { id: 2, question: "Способы оплаты", answer: "Мы принимаем оплату онлайн банковскими картами через безопасную систему Stripe." },
    { id: 3, question: "Время доставки", answer: "Среднее время доставки составляет от 60 до 90 минут, в зависимости от загруженности кухни и вашего адреса." },
    { id: 4, question: "Зона доставки", answer: "Мы доставляем по всему городу. Вы можете проверить доступность доставки, введя свой адрес при оформлении заказа." },
    { id: 5, question: "Есть особые пожелания?", answer: "Свяжитесь с нами, и мы постараемся учесть все ваши предпочтения!" }
];

export const InteractiveFaqSection: React.FC = () => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [currentAnswer, setCurrentAnswer] = useState('Нажмите на вопрос, чтобы узнать больше...');
    const typedAnswer = useTypewriter(currentAnswer, 25);

    const handleQuestionClick = (id: number, answer: string) => {
        if (activeId === id) { return; }
        setActiveId(id);
        setCurrentAnswer(answer);
    };
    
    useEffect(() => {
        if (faqData.length > 0 && activeId === null) {
            handleQuestionClick(faqData[0].id, faqData[0].answer);
        }
    }, []);

    return (
        <section className="relative pt-24 pb-12 text-text-dark flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">
            
            
            <div className="page-container relative z-10 w-full max-w-4xl">
                <motion.h2
                    className="font-display text-5xl text-center mb-12 text-text-dark"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                >
                    Часто задаваемые вопросы
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8 bg-main-light/90 p-8 shadow-card-shadow border border-accent-gold/20 rounded-md">
                    <div className="flex flex-col space-y-4">
                        {faqData.map((item, index) => (
                            <motion.button
                                key={item.id}
                                className={`font-heading text-left text-lg p-3 rounded-md transition-all duration-300 ${activeId === item.id ? 'bg-accent-gold text-main-dark shadow-md' : 'bg-main-dark/10 text-text-dark hover:bg-main-dark/20'}`}
                                onClick={() => handleQuestionClick(item.id, item.answer)}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {item.question}
                            </motion.button>
                        ))}
                    </div>
                    <div className="bg-main-dark p-6 rounded-md shadow-inner-dark flex items-start min-h-[200px]">
                        <p className="font-body text-lg text-text-light leading-relaxed">
                            {typedAnswer}
                            {typedAnswer.length === currentAnswer.length ? '' : <span className="inline-block w-[1.5px] h-[1em] bg-text-light/70 animate-blinkingCursor align-bottom ml-[1px]"></span>}
                        </p>
                    </div>
                </div>
            </div>
            
            
        </section>
    );
};