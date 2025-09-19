import { motion, type HTMLMotionProps } from 'framer-motion';
import type React from 'react';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: ButtonVariant;
  children?: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-vintage-primary',
  secondary: 'btn-vintage-secondary',
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};