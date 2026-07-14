import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: Variant;
  isLoading?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-500',
  danger: 'bg-rose-500/90 text-white hover:bg-rose-500 focus-visible:outline-rose-400',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 focus-visible:outline-slate-600',
};

export const Button = ({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
        'transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </motion.button>
  );
};
