import React from 'react';
import { analyzeCastText } from '@/common/helpers/castText';
import { ExpandableText } from '@/components/ui/expandable-text';
import { LongCastIndicator } from '@/components/ui/long-cast-indicator';
import { cn } from '@/lib/utils';

interface CastTextProps {
    text: string;
    className?: string;
    showLongCastIndicator?: boolean;
    defaultExpanded?: boolean;
}

export function CastText({
    text,
    className,
    showLongCastIndicator = true,
    defaultExpanded = false
}: CastTextProps) {
    const analysis = analyzeCastText(text);

    return (
        <div className={cn('space-y-2', className)}>
            {showLongCastIndicator && (
                <LongCastIndicator isLongCast={analysis.isLongCast} />
            )}

            <ExpandableText
                analysis={analysis}
                defaultExpanded={defaultExpanded}
            />
        </div>
    );
}