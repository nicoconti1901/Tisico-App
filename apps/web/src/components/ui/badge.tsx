import { cn } from '@/lib/utils';
import * as React from 'react';

function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'success' | 'destructive';
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' &&
          'border-transparent bg-primary text-primary-foreground',
        variant === 'secondary' &&
          'border-transparent bg-secondary text-secondary-foreground',
        variant === 'success' &&
          'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        variant === 'destructive' &&
          'border-transparent bg-destructive text-destructive-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
