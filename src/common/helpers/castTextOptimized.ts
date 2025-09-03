import { useMemo } from 'react';
import { analyzeCastText, CastTextAnalysis } from './castText';

/**
 * Memoized version of analyzeCastText for performance-critical components
 */
export function useOptimizedCastTextAnalysis(text: string): CastTextAnalysis {
    return useMemo(() => {
        if (!text) {
            return {
                type: 'cast' as const,
                lengthInBytes: 0,
                isValid: true,
                isLongCast: false,
                previewText: '',
                fullText: '',
                exceedsPreview: false,
                tailwindColor: 'text-foreground/60',
                warningLabel: ''
            };
        }

        return analyzeCastText(text);
    }, [text]);
}