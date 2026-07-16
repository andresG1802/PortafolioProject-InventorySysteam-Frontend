import { forwardRef, type SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'rounded-lg border bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/60',
            error ? 'border-rose-500/70' : 'border-slate-700 focus:border-indigo-500',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';
