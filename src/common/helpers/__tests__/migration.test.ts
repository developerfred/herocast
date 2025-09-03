import { describe, expect, test } from '@jest/globals';
import { migrateDraftsToSupportLongCasts } from '../migration';
import { DraftType, DraftStatus, CastType } from '../../constants/farcaster';

describe('Draft Migration', () => {
    test('should add castType to drafts without it', () => {
        const draftsWithoutType: DraftType[] = [
            {
                id: '1',
                status: DraftStatus.draft,
                createdAt: Date.now(),
                accountId: 'account1',
                text: 'Short cast',
                // No castType property
            } as DraftType,
            {
                id: '2',
                status: DraftStatus.draft,
                createdAt: Date.now(),
                accountId: 'account1',
                text: 'a'.repeat(400), // Long cast
                // No castType property
            } as DraftType,
        ];

        const migratedDrafts = migrateDraftsToSupportLongCasts(draftsWithoutType);

        expect(migratedDrafts[0].castType).toBe(CastTypeEnum.CAST);
        expect(migratedDrafts[1].castType).toBe(CastTypeEnum.LONG_CAST);
    });

    test('should preserve existing castType', () => {
        const draftsWithType: DraftType[] = [
            {
                id: '1',
                status: DraftStatus.draft,
                createdAt: Date.now(),
                accountId: 'account1',
                text: 'Short cast',
                castType: CastTypeEnum.CAST,
            } as DraftType,
        ];

        const migratedDrafts = migrateDraftsToSupportLongCasts(draftsWithType);

        expect(migratedDrafts[0].castType).toBe(CastTypeEnum.CAST);
    });

    test('should handle drafts without text', () => {
        const draftsWithoutText: DraftType[] = [
            {
                id: '1',
                status: DraftStatus.draft,
                createdAt: Date.now(),
                accountId: 'account1',
                text: '',
            } as DraftType,
        ];

        const migratedDrafts = migrateDraftsToSupportLongCasts(draftsWithoutText);

        // Should not crash and should add appropriate cast type for empty text
        expect(migratedDrafts[0]).toBeDefined();
        expect(migratedDrafts[0].castType).toBe(CastTypeEnum.CAST);
    });
});
