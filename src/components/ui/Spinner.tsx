import clsx from 'clsx';

export const Spinner = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      'h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400',
      className,
    )}
  />
);
