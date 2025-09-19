import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import { motion, AnimatePresence } from 'framer-motion';

import { useAuthStore } from '@/entities/user';
import { UserChip } from '@/entities/user';
import { CartIcon } from '@/entities/cart';
import { useScrollPosition } from '@/shared/hooks/useScrollPosition';

const NavLinkItem: React.FC<{ to: string; text: string; onClick?: () => void; testId?: string; }> = ({ to, text, onClick, testId }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    data-testid={testId}
  >
    {text}
  </NavLink>
);

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuthStore(useShallow(state => ({ isAuthenticated: state.isAuthenticated })));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(50);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const shouldBeVisible = !isHomePage || isScrolled; 

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { to: '/', text: 'Главная', show: true, testId: 'nav-home' },
    { to: '/products', text: 'Меню', show: true, testId: 'nav-products' },
    { to: '/recipes', text: 'Рецепты', show: true, testId: 'nav-recipes' },
  ];

  const mobileNavLinks = [
    ...navLinks,
    ...(isAuthenticated ? 
      [{ to: '/profile', text: 'Профиль', show: true }] : 
      [{ to: '/login', text: 'Войти', show: true }])
  ].filter(l => l.show);

  const headerVariants = {
    hidden: { y: '-100%', opacity: 0 },
    visible: { y: '0%', opacity: 1 },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate={shouldBeVisible ? "visible" : "hidden"} 
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-40 py-4 bg-main-dark/80 backdrop-blur-sm" 
      style={{ boxShadow: '0 8px 16px -8px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="page-container flex items-center justify-between">
        <NavLink to="/" className="group flex items-center gap-2">
          <span className="font-display text-4xl tracking-widest bg-gradient-to-r from-red-600 to-accent-gold bg-clip-text text-transparent group-hover:brightness-110 transition-all">
            FLAVO
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center justify-center gap-8">
          {navLinks.filter(l => l.show).map((l) => (
            <NavLinkItem key={l.to} text={l.text} to={l.to} testId={l.testId} />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <UserChip />
          <CartIcon />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-text-light hover:text-hover-gold transition-colors">
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-main-dark border-t border-text-light/10 overflow-hidden"
          >
            <nav className="flex flex-col items-center space-y-4 py-4">
              {mobileNavLinks.map((link) => (
                <NavLinkItem key={link.to} to={link.to} text={link.text} onClick={closeMobileMenu} />
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};