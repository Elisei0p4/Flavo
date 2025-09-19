import React, { useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FaTelegramPlane, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SocialIcon: React.FC<{ href: string; icon: IconType; }> = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-text-light hover:text-hover-gold transition-colors duration-300">
        <Icon size={24} />
    </a>
);

interface FooterProps {
  isVisible: boolean;
  setFooterHeight: (height: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ isVisible, setFooterHeight }) => {
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, [setFooterHeight]);

  return (
    <motion.div
      ref={footerRef}
      className="bg-main-dark text-text-light py-6 fixed bottom-0 left-0 right-0 z-30" 
      initial={{ y: '100%', opacity: 0, pointerEvents: 'none' }}
      animate={{ 
        y: isVisible ? '0%' : '100%',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }} 
      transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.3 }}
    >
      <div className="page-container">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-display text-4xl tracking-wider text-text-light mb-4">FLAVO</h3>
            <p className="font-body text-sm text-text-light/80">Мир изысканных вкусов для вашей кухни.</p>
          </div>
          <div>
            <h4 className="font-heading text-lg text-text-light uppercase tracking-wide mb-4">Навигация</h4>
            <nav className="flex flex-col space-y-2 text-text-light/80 font-body text-base">
              <NavLink to="/" className="block w-fit hover:text-hover-gold transition-colors">
                <span className="py-2">Главная</span>
              </NavLink>
              <NavLink to="/products" className="block w-fit hover:text-hover-gold transition-colors">
                <span className="py-2">Меню</span>
              </NavLink>
              <NavLink to="/recipes" className="block w-fit hover:text-hover-gold transition-colors">
                <span className="py-2">Рецепты</span>
              </NavLink>
            </nav>
          </div>
          <div>
            <h4 className="font-heading text-lg text-text-light uppercase tracking-wide mb-4">Свяжитесь с нами</h4>
             <div className="flex justify-center md:justify-start space-x-6">
                <SocialIcon href="#" icon={FaTelegramPlane} />
                <SocialIcon href="#" icon={FaInstagram} />
                <SocialIcon href="#" icon={FaFacebookF} />
            </div>
            <p className="font-body text-sm text-text-light/80 mt-4">Email: info@flavo.com</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-text-light/10 text-center text-sm text-text-light/60 font-body">
          <p>&copy; {new Date().getFullYear()} FLAVO. Все права защищены.</p>
        </div>
      </div>
    </motion.div>
  );
};