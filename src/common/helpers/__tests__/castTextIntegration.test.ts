import { describe, expect, test } from '@jest/globals';
import { analyzeCastText } from '../castText';
import { submitCast } from '../farcaster';
import { CastTypeEnum, CAST_TEXT_LIMITS } from '../../constants/farcaster';

// Mock the external dependencies
jest.mock('../farcaster', () => ({
    ...jest.requireActual('../farcaster'),
    submitCast: jest.fn()
}));

describe('Cast Text Integration Tests', () => {
    test('should correctly identify cast types for submission', async () => {
        const shortText = 'Short cast text';
        const longText = 'a'.repeat(400);

        const shortAnalysis = analyzeCastText(shortText);
        const longAnalysis = analyzeCastText(longText);

        expect(shortAnalysis.type).toBe(CastTypeEnum.CAST);
        expect(longAnalysis.type).toBe(CastTypeEnum.LONG_CAST);

        // Verify that the analysis would work with submit function
        expect(shortAnalysis.isValid).toBe(true);
        expect(longAnalysis.isValid).toBe(true);
    });

    test('should handle mentions correctly in long casts', () => {
        const textWithMentions = `This is a longer cast with @user1 and @user2 mentions that exceeds the normal limit. ${'a'.repeat(300)}`;
        const analysis = analyzeCastText(textWithMentions);

        expect(analysis.isLongCast).toBe(true);
        expect(analysis.isValid).toBe(true);
        // The byte count should be less than the raw text due to mention processing
        expect(analysis.lengthInBytes).toBeLessThan(new TextEncoder().encode(textWithMentions).length);
    });

    test('should provide accurate preview for UI display', () => {
        const longText = 'a'.repeat(300) + ' This should not appear in preview';
        const analysis = analyzeCastText(longText);

        expect(analysis.exceedsPreview).toBe(true);
        expect(analysis.previewText.length).toBeLessThan(analysis.fullText.length);
        expect(analysis.previewText).toContain('...');
        expect(analysis.previewText).not.toContain('should not appear in preview');
    });

    test('should handle edge case of exactly at limits', () => {
        // Text exactly at short cast limit
        const exactShortLimit = 'a'.repeat(CAST_TEXT_LIMITS.SHORT_CAST_MAX_BYTES);
        const shortAnalysis = analyzeCastText(exactShortLimit);

        expect(shortAnalysis.type).toBe(CastTypeEnum.CAST);
        expect(shortAnalysis.isValid).toBe(true);
        expect(shortAnalysis.isLongCast).toBe(false);

        // Text exactly at long cast limit
        const exactLongLimit = 'a'.repeat(CAST_TEXT_LIMITS.LONG_CAST_MAX_BYTES);
        const longAnalysis = analyzeCastText(exactLongLimit);

        expect(longAnalysis.type).toBe(CastTypeEnum.LONG_CAST);
        expect(longAnalysis.isValid).toBe(true);
        expect(longAnalysis.isLongCast).toBe(true);
    });

    test('should handle unicode characters correctly', () => {
        const unicodeText = '🔥'.repeat(100) + ' Some regular text';
        const analysis = analyzeCastText(unicodeText);

        // Unicode emojis are 4 bytes each
        expect(analysis.lengthInBytes).toBeGreaterThan(100);
        expect(analysis.isValid).toBe(true);
    });
});
