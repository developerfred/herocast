import { describe, expect, test, jest } from '@jest/globals';
import { useTextLength } from '../editor';
import { CastType } from '../../constants/farcaster';

describe('Editor Integration with Long Casts', () => {
    test('should maintain backward compatibility with existing useTextLength', () => {
        const shortText = 'Short cast';
        const result = useTextLength({ text: shortText });


        expect(result).toHaveProperty('length');
        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('tailwindColor');
        expect(result).toHaveProperty('label');

        expect(result.isValid).toBe(true);
        expect(typeof result.length).toBe('number');
    });

    test('should provide new long cast properties', () => {
        const longText = 'a'.repeat(400);
        const result = useTextLength({ text: longText });

        expect(result.isLongCast).toBe(true);
        expect(result.castType).toBe(CastTypeEnum.LONG_CAST);
        expect(result.analysis).toBeDefined();
        expect(result.analysis.previewText).toBeDefined();
    });

    test('should handle edge cases gracefully', () => {
        const emptyResult = useTextLength({ text: '' });
        expect(emptyResult.isValid).toBe(true);
        expect(emptyResult.isLongCast).toBe(false);

        const nullResult = useTextLength({ text: null as any });
        expect(nullResult.isValid).toBe(true); // Should handle gracefully
    });
});