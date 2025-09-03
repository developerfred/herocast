import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';
import { CastTextAnalysis } from '@/common/helpers/castText';

interface ExpandableTextProps {
    analysis: CastTextAnalysis;
    className?: string;
    showExpandButton?: boolean;
    defaultExpanded?: boolean;
}

export function ExpandableText({
    analysis,
    className,
    showExpandButton = true,
    defaultExpanded = false
}: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    if (!analysis.exceedsPreview) {
        return (
            <div className={cn('whitespace-pre-wrap', className)}>
                {analysis.fullText}
            </div>
        );
    }

    return (
        <div className={cn('space-y-2', className)}>
            <div className="whitespace-pre-wrap">
                {isExpanded ? analysis.fullText : analysis.previewText}
            </div>

            {showExpandButton && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-auto p-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUpIcon className="w-4 h-4 mr-1" />
                            Show less
                        </>
                    ) : (
                        <>
                            <ChevronDownIcon className="w-4 h-4 mr-1" />
                            Show more
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}