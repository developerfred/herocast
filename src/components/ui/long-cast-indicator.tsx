import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DocumentTextIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface LongCastIndicatorProps {
    isLongCast: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LongCastIndicator({
    isLongCast,
    className,
    size = 'sm'
}: LongCastIndicatorProps) {
    if (!isLongCast) return null;

    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5',
        md: 'text-sm px-2 py-1',
        lg: 'text-base px-3 py-1.5'
    };

    return (
        <Badge
            variant="secondary"
            className={cn(
                'inline-flex items-center gap-1 text-blue-600 bg-blue-50 border-blue-200',
                sizeClasses[size],
                className
            )}
        >
            <DocumentTextIcon className="w-3 h-3" />
            Long cast
        </Badge>
    );
}