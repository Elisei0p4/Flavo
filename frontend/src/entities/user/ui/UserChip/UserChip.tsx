import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import { useAuthStore } from '../../model/store';
import { formatMoneyInteger } from '@/shared/lib/money';
import type { User } from '../../model/types';

const UserDropdown: React.FC<{ user: User; onLogout: () => void; closeMenu: () => void }> = ({ user, onLogout, closeMenu }) => {
  const flavoCoins = user.flavo_coins ? formatMoneyInteger(user.flavo_coins) : '0 ₽';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ transformOrigin: 'top right' }}
      className="absolute top-full right-0 mt-2 w-64 bg-parchment-texture-bg bg-cover p-4 z-50 shadow-xl shadow-black/30 border border-accent-gold/50 rounded-md text-text-dark"
    >
      <div className="border-b border-accent-gold/20 pb-3 mb-3">
        <p className="font-heading text-xl text-text-dark">{user.username}</p>
        <p className="font-body text-sm text-text-dark/80">Баланс: <span className="font-bold text-accent-gold">{flavoCoins}</span></p>
      </div>
      <NavLink 
        to="/profile" 
        onClick={closeMenu} 
        className="font-heading flex items-center w-full text-left p-2 rounded-md hover:bg-accent-gold/20 transition-colors text-text-dark" 
      >
        <FaUserCircle className="mr-3 text-text-dark/80" /> Профиль
      </NavLink>
      <button 
        onClick={onLogout} 
        className="font-heading flex items-center w-full text-left p-2 rounded-md hover:bg-red-error transition-colors text-red-error hover:text-white" 
        data-testid="logout-button"
      >
        <FaSignOutAlt className="mr-3" /> Выйти
      </button>
    </motion.div>
  );
};

export const UserChip: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore(useShallow(state => ({ isAuthenticated: state.isAuthenticated, user: state.user, logout: state.logout })));
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="font-heading text-lg text-text-light hover:text-hover-gold transition-colors duration-200 py-2"
        data-testid="login-button"
      >
        Войти
      </button>
    );
  }

  return (
    <div className="relative" ref={userMenuRef}>
      <button 
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
        className="flex items-center gap-2 p-2 text-text-light hover:text-hover-gold transition-colors duration-200"
        aria-label="Меню пользователя"
        data-testid="user-menu-toggle"
      >
        <FaUserCircle size={22} />
        <span className="font-heading text-lg hidden lg:inline">{user.username}</span>
        <FaCaretDown className={`transition-transform text-text-light/60 ${isUserMenuOpen ? 'rotate-180' : ''} hidden lg:inline`} />
      </button>
      <AnimatePresence>
        {isUserMenuOpen && <UserDropdown user={user} onLogout={handleLogout} closeMenu={() => setIsUserMenuOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};