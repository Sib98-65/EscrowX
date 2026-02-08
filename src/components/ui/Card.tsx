import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

const Card = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
    ({ className, ...props }, ref) => (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('glass-card p-6 md:p-8', className)}
            {...props}
        />
    )
);
Card.displayName = 'Card';

export { Card };
