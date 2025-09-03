import { describe, expect, test, jest } from '@jest/globals';
import { useOptimizedCastTextAnalysis } from '../castTextOptimized';
import { renderHook } from '@testing-library/react';

describe('Performance Optimizations', () => {
    test('should memoize results for same input', () => {
        const { result, rerender } = renderHook(
            ({ text }) => useOptimizedCastTextAnalysis(text),
            { initialProps: { text: 'Test text' } }
        );

        const firstResult = result.current;

        // Re-render with same text
        rerender({ text: 'Test text' });
        const secondResult = result.current;

        // Should be the same object reference (memoized)
        expect(firstResult).toBe(secondResult);
    });

    test('should recalculate when text changes', () => {
        const { result, rerender } = renderHook(
            ({ text }) => useOptimizedCastTextAnalysis(text),
            { initialProps: { text: 'First text' } }
        );

        const firstResult = result.current;

        // Re-render with different text
        rerender({ text: 'Second text' });
        const secondResult = result.current;

        // Should be different objects
        expect(firstResult).not.toBe(secondResult);
        expect(firstResult.fullText).toBe('First text');
        expect(secondResult.fullText).toBe('Second text');
    });

    test('should handle empty text gracefully', () => {
        const { result } = renderHook(() => useOptimizedCastTextAnalysis(''));

        expect(result.current.isValid).toBe(true);
        expect(result.current.isLongCast).toBe(false);
        expect(result.current.lengthInBytes).toBe(0);
    });
});