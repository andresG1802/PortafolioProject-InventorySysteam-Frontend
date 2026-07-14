import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'rounded-lg border bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/60',
            error ? 'border-rose-500/70' : 'border-slate-700 focus:border-indigo-500',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
