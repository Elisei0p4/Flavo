import { useState, useEffect } from 'react';

/**
 * Хук для отслеживания позиции скролла и определения,
 * проскроллил ли пользователь страницу ниже определенного порога.
 * @param threshold - Порог в пикселях, после которого хук вернет `true`. По умолчанию 10px.
 * @returns `true`, если страница проскроллена ниже порога, иначе `false`.
 */
export const useScrollPosition = (threshold = 10): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};