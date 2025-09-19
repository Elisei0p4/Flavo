import React from 'react';
import { motion } from 'framer-motion';
import { FaGift } from 'react-icons/fa';
import { useAuthStore } from '@/entities/user';
import { ProfileCardSkeleton } from '@/entities/user/ui';
import { formatMoneyInteger } from '@/shared/lib/money';

export const ProfileCard: React.FC = () => {
    const { user, isLoading } = useAuthStore();
    
    if (isLoading) {
        return <ProfileCardSkeleton />;
    }
    
    if (!user) return (
      <div className="vintage-card-dark p-8 flex flex-col items-center text-center rounded-lg">
        <p className="font-heading text-xl text-red-error">Не удалось загрузить данные пользователя.</p>
        <p className="font-body text-text-light/80 mt-2">Пожалуйста, попробуйте перезагрузить страницу или войти снова.</p>
      </div>
    );

    const flavoCoins = user.flavo_coins ? formatMoneyInteger(user.flavo_coins) : '0 ₽';

    return (
        <motion.div
            className="vintage-card-dark p-8 flex flex-col items-center text-center rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-32 h-32 rounded-full bg-main-dark flex items-center justify-center mb-4 border border-accent-gold/20">
                <span className="font-display text-6xl text-accent-gold">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="font-heading text-3xl text-text-light">{user.username}</h1>
            <p className="font-body text-text-light/80 mb-6">{user.email || 'Email не указан'}</p>
            <div className="w-full bg-main-dark border border-accent-gold/20 p-6 mt-4 rounded-lg">
                <div className="flex justify-between items-center mb-4"><p className="text-sm uppercase tracking-widest font-sans text-text-light/60">Flavo Balance</p><FaGift size={20} className="text-accent-gold" /></div>
                <p className="font-heading text-4xl tracking-tighter text-text-light">{flavoCoins}</p>
            </div>
        </motion.div>
    );
};