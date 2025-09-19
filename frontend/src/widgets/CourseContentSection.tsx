import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

interface CourseBlockItem {
  id: string;
  title: string;
  image: string;
}

interface CourseWeek {
  id: string;
  title: string;
  items: {
    title: string;
    description: string;
  }[];
}

interface CourseModule {
  id: string;
  title: string;
  content: CourseBlockItem[];
}

const courseData: CourseModule[] = [
  { id: 'I', title: 'Свежайшие ингредиенты', content: [{ id: 'item1', title: 'Ежедневные поставки', image: '/course-icon-zoom.svg' }, { id: 'item2', title: 'Строгий отбор качества', image: '/course-icon-platform.svg' }] },
  { id: 'II', title: 'Традиционные рецепты', content: [{ id: 'item1', title: 'Классика французской кухни', image: '/course-icon-recipes.svg' }, { id: 'item2', title: 'Авторские интерпретации', image: '/course-icon-video.svg' }] },
  { id: 'III', title: 'Профессиональные повара', content: [{ id: 'item1', title: 'Мастера своего дела', image: '/course-icon-cook.svg' }, { id: 'item2', title: 'Кулинарные эксперты', image: '/course-icon-taste.svg' }] },
  { id: 'IV', title: 'Контроль качества', content: [{ id: 'item1', title: 'От закупки до подачи', image: '/course-icon-feedback.svg' }, { id: 'item2', title: 'Стандарты гигиены', image: '/course-icon-mentor.svg' }] },
  { id: 'V', title: 'Быстрая доставка', content: [{ id: 'item1', title: 'Сохранение температуры', image: '/course-icon-chat.svg' }, { id: 'item2', title: 'Точно в срок', image: '/course-icon-discuss.svg' }] },
];

const weekContent: CourseWeek[] = [
  { id: 'week1', title: 'Сезонные предложения', items: [{ title: 'Обновляемое меню', description: 'Регулярное добавление уникальных блюд из свежих сезонных продуктов.' }, { title: 'Праздничные сеты', description: 'Специальные подборки для особых случаев и торжеств.' }, { title: 'Вегетарианские опции', description: 'Изысканные блюда для приверженцев растительного питания.' }, { title: 'Детское меню', description: 'Вкусные и полезные блюда, разработанные с заботой о самых маленьких гурманах.' }] },
  { id: 'week2', title: 'Искусство выпечки', items: [{ title: 'Свежий хлеб и багеты', description: 'Каждодневная выпечка по традиционным французским рецептам.' }, { title: 'Изысканные десерты', description: 'Широкий выбор пирожных, тортов и других сладостей ручной работы.' }, { title: 'Заказные торты', description: 'Создание уникальных тортов для любого торжества по вашему дизайну.' }, { title: 'Кофейная карта', description: 'Идеальное дополнение к десертам: от классического эспрессо до авторских напитков.' }] },
  { id: 'week3', title: 'Вина и напитки', items: [{ title: 'Подбор вин к блюдам', description: 'Экспертные рекомендации по выбору идеального вина для каждого блюда.' }, { title: 'Коллекция французских вин', description: 'Широкий ассортимент от классических до редких вин из разных регионов Франции.' }, { title: 'Авторские коктейли', description: 'Освежающие и оригинальные напитки от наших барменов.' }, { title: 'Безалкогольные опции', description: 'Натуральные лимонады, свежевыжатые соки и другие прохладительные напитки.' }] },
  { id: 'week4', title: 'Специальные услуги', items: [{ title: 'Кейтеринг для мероприятий', description: 'Полное гастрономическое обслуживание для любых событий: от корпоративов до свадеб.' }, { title: 'Приватные ужины с шеф-поваром', description: 'Эксклюзивный ужин, приготовленный нашим шеф-поваром прямо у вас дома.' }, { title: 'Кулинарные консультации', description: 'Индивидуальные советы и рекомендации по выбору меню и организации ужина.' }, { title: 'Подарочные сертификаты', description: 'Идеальный подарок для ценителей высокой кухни.' }] },
  { id: 'week5-13', title: 'Гастрономические путешествия', items: [{ title: 'Тематические вечера', description: 'Ежемесячные гастрономические вечера, посвященные кухням разных регионов Франции.' }, { title: 'Дегустации сыров и вин', description: 'Профессиональные дегустации с сомелье и экспертами по сырам.' }, { title: 'Мастер-классы от приглашенных шефов', description: 'Уникальная возможность учиться у лучших кулинаров мира.' }, { title: 'Партнерские предложения', description: 'Скидки и специальные условия от наших партнеров — производителей деликатесов и вин.' }] },
];

const CourseBlock: React.FC<{ module: CourseModule; delay: number }> = ({ module, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay }}
    className="flex flex-col items-center text-center p-6 border border-accent-gold/20 bg-main-dark/50 transform hover:-translate-y-1 hover:border-accent-gold transition-all duration-300 shadow-inner-dark"
  >
    <h3 className="font-heading text-xl text-accent-gold mb-4">{module.id}</h3>
    <p className="font-heading text-lg text-text-light text-center">{module.title}</p>
    <div className="mt-4 flex flex-col items-center space-y-3">
        {module.content.map((item: CourseBlockItem) => (
            <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="w-8 h-8 object-contain filter invert" />
                <span className="font-body text-text-light/80">{item.title}</span>
            </div>
        ))}
    </div>
  </motion.div>
);

const CourseWeekBlock: React.FC<{ week: CourseWeek; delay: number }> = ({ week, delay }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className="bg-main-light text-text-dark border border-main-dark/20 p-6 shadow-card-shadow"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center w-full font-heading text-xl text-text-dark hover:text-accent-gold transition-colors"
      >
        <span>{week.title}</span>
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-2xl text-accent-gold">
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2"
          >
            {week.items.map((item, itemIndex) => (
              <div key={itemIndex}>
                <h4 className="font-heading text-lg text-text-dark">{item.title}</h4>
                <p className="font-body text-sm text-text-dark/80">{item.description}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CourseContentSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-main-dark bg-dark-map-bg text-text-light">
      <SectionDivider variant="top" className="z-10" />
      <div className="page-container">
        <SectionHeader title="Наше предложение" />
        <div className="grid md:grid-cols-5 gap-6 mt-12">
          {courseData.map((module, index) => (
            <CourseBlock key={module.id} module={module} delay={0.1 * index} />
          ))}
        </div>
        <div className="mt-16 grid lg:grid-cols-2 gap-6">
          {weekContent.map((week, index) => (
            <CourseWeekBlock key={week.id} week={week} delay={0.1 * index} />
          ))}
        </div>
      </div>
      <SectionDivider variant="bottom" className="z-10" />
    </section>
  );
};