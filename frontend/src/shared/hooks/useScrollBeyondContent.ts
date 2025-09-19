import { useState, useEffect, useCallback, useRef } from 'react';


export const useScrollBeyondContent = (): boolean => {
  const [isBeyondContent, setIsBeyondContent] = useState(false);
  const hasScrolledPastInitialLoad = useRef(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    const isScrollable = scrollHeight > innerHeight;

    if (isScrollable) {
      if (scrollY + innerHeight >= scrollHeight - 1) {
        hasScrolledPastInitialLoad.current = true;
        setIsBeyondContent(true);
      } else {
        setIsBeyondContent(false);
      }
    } else {
      setIsBeyondContent(false);
    }
  }, []);

  useEffect(() => {
    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return isBeyondContent;
};