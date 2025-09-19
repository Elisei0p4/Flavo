import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-main-light bg-light-engraving text-text-dark h-screen overflow-hidden flex flex-col items-center justify-start">
      <div className="page-container pt-24 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <h1 className="font-display text-6xl text-text-dark mb-4">404</h1>
          <h2 className="font-heading text-3xl text-text-dark mb-6">Страница не найдена</h2>
          <p className="font-body text-lg text-text-dark/80 max-w-lg mb-8">
            Ох! Похоже, мы не смогли найти то, что вы искали. Возможно, блюдо уже съели!
          </p>
          <img src="/длдл.png" alt="Страница не найдена" className="max-w-full h-auto max-h-[300px] object-contain mb-8" />
          <Link to="/">
            <Button variant="primary">Вернуться на главную</Button>
          </Link>
        </motion.div>
      </div>

    </div>
  );
};

export default NotFoundPage;