import { describe, expect, test } from '@jest/globals';
import { analyzeCastText, useTextLength } from '../castText';
import { CastTypeEnum, CAST_TEXT_LIMITS } from '../../constants/farcaster';

describe('analyzeCastText', () => {
    test('should identify short cast', () => {
        const shortText = 'This is a short cast';
        const analysis = analyzeCastText(shortText);

        expect(analysis.type).toBe(CastTypeEnum.CAST);
        expect(analysis.isLongCast).toBe(false);
        expect(analysis.isValid).toBe(true);
        expect(analysis.exceedsPreview).toBe(false);
        expect(analysis.previewText).toBe(shortText);
        expect(analysis.fullText).toBe(shortText);
    });

    test('should identify long cast', () => {
        const longText = 'a'.repeat(400); 
        const analysis = analyzeCastText(longText);

        expect(analysis.type).toBe(CastTypeEnum.LONG_CAST);
        expect(analysis.isLongCast).toBe(true);
        expect(analysis.isValid).toBe(true);
        expect(analysis.lengthInBytes).toBe(400);
    });

    test('should identify invalid cast (too long)', () => {
        const tooLongText = 'a'.repeat(1100); 
        const analysis = analyzeCastText(tooLongText);

        expect(analysis.isValid).toBe(false);
        expect(analysis.tailwindColor).toBe('text-red-500 font-semibold');
        expect(analysis.warningLabel).toContain('Exceeds limit');
    });

    test('should handle text with mentions correctly', () => {
        const textWithMention = 'Hello @username this is a test';
        const analysis = analyzeCastText(textWithMention);

        // The actual byte calculation should exclude the mention
        expect(analysis.lengthInBytes).toBeLessThan(new TextEncoder().encode(textWithMention).length);
    });

    test('should create preview for long text', () => {
        const longText = 'a'.repeat(300);
        const analysis = analyzeCastText(longText);

        expect(analysis.exceedsPreview).toBe(true);
        expect(analysis.previewText).toBe('a'.repeat(280) + '...');
        expect(analysis.previewText.length).toBeLessThan(analysis.fullText.length);
    });

    test('should show warning colors at 90% thresholds', () => {
        // Test 90% of short cast limit
        const ninetyPercentShort = Math.floor(CAST_TEXT_LIMITS.SHORT_CAST_MAX_BYTES * 0.9) + 1;
        const almostLongText = 'a'.repeat(ninetyPercentShort);
        const shortAnalysis = analyzeCastText(almostLongText);

        expect(shortAnalysis.tailwindColor).toBe('text-orange-500');

        // Test 90% of long cast limit  
        const ninetyPercentLong = Math.floor(CAST_TEXT_LIMITS.LONG_CAST_MAX_BYTES * 0.9) + 1;
        const almostTooLongText = 'a'.repeat(ninetyPercentLong);
        const longAnalysis = analyzeCastText(almostTooLongText);

        expect(longAnalysis.tailwindColor).toBe('text-orange-500');
        expect(longAnalysis.isLongCast).toBe(true);
    });
});

describe('useTextLength', () => {
    test('should maintain backward compatibility', () => {
        const text = 'Test text';
        const result = useTextLength({ text });

        expect(result).toHaveProperty('length');
        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('tailwindColor');
        expect(result).toHaveProperty('label');

        // New properties
        expect(result).toHaveProperty('isLongCast');
        expect(result).toHaveProperty('castType');
        expect(result).toHaveProperty('analysis');
    });

    test('should work with existing editor integration', () => {
        const shortText = 'Short cast text';
        const longText = 'a'.repeat(400);

        const shortResult = useTextLength({ text: shortText });
        const longResult = useTextLength({ text: longText });

        expect(shortResult.isLongCast).toBe(false);
        expect(shortResult.castType).toBe(CastTypeEnum.CAST);

        expect(longResult.isLongCast).toBe(true);
        expect(longResult.castType).toBe(CastTypeEnum.LONG_CAST);
    });
});