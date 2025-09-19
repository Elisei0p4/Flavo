import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';
import { SectionHeader } from '@/shared/ui/SectionHeader/SectionHeader';

interface Review {
  id: number;
  name: string;
  avatar: string;
  text: string;
}

const reviewsData: Review[] = [
  { id: 1, name: "Игорь П.", avatar: "/ava1.png", text: "В июне 2023 года заказал у FLAVO ужин для всей семьи. Каждое блюдо было настоящим шедевром! Особенно впечатлили десерты. Обязательно закажем еще!" },
  { id: 2, name: "Дарья Л.", avatar: "/ava2.png", text: "Огромное спасибо за быструю доставку и великолепное качество! Еда приехала горячей и очень вкусной. Попробовали новое блюдо из вашей коллекции — это восторг!" },
  { id: 3, name: "Алексей П.", avatar: "/ava3.png", text: "FLAVO is simply amazing! The food quality is consistently high, and every dish I've tried has been delicious. Their attention to detail, from preparation to delivery, is truly commendable. Highly recommend for any occasion!" },
  { id: 4, name: "Елена К.", avatar: "/ava4.png", text: "Отличный сервис и превосходная еда! Заказывали банкет для небольшой компании, все гости остались в восторге. Каждое блюдо было идеально, а подача — как в лучших ресторанах." },
  { id: 5, name: "Сергей В.", avatar: "/ava5.png", text: "Практически каждый праздник заказываю у FLAVO. Качество всегда на высоте, а меню постоянно обновляется. Это то, что отличает вас от других. Спасибо за вкус и профессионализм!" },
  { id: 6, name: "Ольга Н.", avatar: "/ava6.png", text: "Прекрасная атмосфера и очень много вкусной еды. Теперь мои ужины стали гораздо разнообразнее и интереснее. Это было незабываемое гастрономическое приключение!" },
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <motion.div
    className="vintage-card flex-shrink-0 w-[280px] sm:w-[360px] flex flex-col items-center text-center p-6 mx-4 rounded-lg"
  >
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 border-2 border-accent-gold shadow-md flex items-center justify-center bg-main-light">
      <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
    </div>
    <h3 className="font-heading text-xl text-text-dark mb-2">{review.name}</h3>
    <p className="font-body text-sm text-text-dark/80 italic flex-grow">"{review.text}"</p>
  </motion.div>
);

export const ReviewsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const duplicatedReviews = [...reviewsData, ...reviewsData];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 360; 
      const cardMargin = 16 * 2;
      const scrollAmount = cardWidth + cardMargin;
      
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth } = container;
      const halfwayPoint = scrollWidth / 2;

      if (scrollLeft >= halfwayPoint) {
        container.scrollLeft = scrollLeft - halfwayPoint;
      }
      if (scrollLeft <= 0) {
        container.scrollLeft = halfwayPoint;
      }
    }
  };

  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft += 1;
        }
      }, 25);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    if (!isHovering) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isHovering]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
        container.scrollLeft = 1;
        container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <section 
      className="relative pt-12 pb-24 text-text-dark overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="page-container relative z-20">
        <SectionHeader title="Отзывы клиентов" subtitle="Посмотрите, что говорят о нас наши гурманы" />
        
        <div 
          ref={scrollContainerRef} 
          className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4"
        >
          <div className="flex w-max">
            {duplicatedReviews.map((review, index) => (
              <ReviewCard key={`${review.id}-${index}`} review={review} />
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 pointer-events-none z-20">
          <button 
            onClick={() => scroll('left')} 
            aria-label="Прокрутить влево" 
            className="pointer-events-auto p-3 rounded-full bg-main-light/80 border-2 border-accent-gold/50 text-accent-gold hover:bg-accent-gold hover:text-main-dark transition-colors shadow-lg"
          >
            <FaChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            aria-label="Прокрутить вправо" 
            className="pointer-events-auto p-3 rounded-full bg-main-light/80 border-2 border-accent-gold/50 text-accent-gold hover:bg-accent-gold hover:text-main-dark transition-colors shadow-lg"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
      <SectionDivider variant="bottom" className="z-10" />
    </section>
  );
};