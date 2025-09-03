import { DraftType } from "../constants/farcaster";
import { analyzeCastText } from "./castText";

export function migrateDraftsToSupportLongCasts(drafts: DraftType[]): DraftType[] {
    return drafts.map(draft => {
        if (!draft.castType && draft.text) {
            const analysis = analyzeCastText(draft.text);
            return {
                ...draft,
                castType: analysis.type
            };
        }
        return draft;
    });
}
