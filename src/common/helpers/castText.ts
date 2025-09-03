import { CAST_TEXT_LIMITS, CastTypeEnum } from '../constants/farcaster';
import { convertCastPlainTextToStructured } from './farcaster';

export interface CastTextAnalysis {
    type: CastTypeEnum;
    lengthInBytes: number;
    isValid: boolean;
    isLongCast: boolean;
    previewText: string;
    fullText: string;
    exceedsPreview: boolean;
    tailwindColor: string;
    warningLabel: string;
}


export function analyzeCastText(text: string): CastTextAnalysis {
    const structuredTextUnits = convertCastPlainTextToStructured({ text });
    const textWithoutMentions = structuredTextUnits.reduce((acc, unit) => {
        if (unit.type !== 'mention') acc += unit.serializedContent;
        return acc;
    }, '');

    const lengthInBytes = new TextEncoder().encode(textWithoutMentions).length;
    const isLongCast = lengthInBytes > CAST_TEXT_LIMITS.SHORT_CAST_MAX_BYTES;
    const isValid = lengthInBytes <= CAST_TEXT_LIMITS.LONG_CAST_MAX_BYTES;
    const type = isLongCast ? CastTypeEnum.LONG_CAST : CastTypeEnum.CAST;

    // Create preview text (first N characters)
    const previewText = text.length > CAST_TEXT_LIMITS.PREVIEW_CHARS
        ? text.substring(0, CAST_TEXT_LIMITS.PREVIEW_CHARS).trim() + '...'
        : text;

    const exceedsPreview = text.length > CAST_TEXT_LIMITS.PREVIEW_CHARS;

    // Color coding for UI feedback
    const ninetyPercentShort = CAST_TEXT_LIMITS.SHORT_CAST_MAX_BYTES * 0.9;
    const ninetyPercentLong = CAST_TEXT_LIMITS.LONG_CAST_MAX_BYTES * 0.9;

    let tailwindColor: string;
    let warningLabel: string;

    if (!isValid) {
        tailwindColor = 'text-red-500 font-semibold';
        warningLabel = `Exceeds limit by ${lengthInBytes - CAST_TEXT_LIMITS.LONG_CAST_MAX_BYTES} bytes`;
    } else if (isLongCast) {
        if (lengthInBytes > ninetyPercentLong) {
            tailwindColor = 'text-orange-500';
            warningLabel = `Long cast: ${CAST_TEXT_LIMITS.LONG_CAST_MAX_BYTES - lengthInBytes} bytes left`;
        } else {
            tailwindColor = 'text-blue-500';
            warningLabel = 'Long cast';
        }
    } else {
        if (lengthInBytes > ninetyPercentShort) {
            tailwindColor = 'text-orange-500';
            warningLabel = `${CAST_TEXT_LIMITS.SHORT_CAST_MAX_BYTES - lengthInBytes} bytes left`;
        } else {
            tailwindColor = 'text-foreground/60';
            warningLabel = '';
        }
    }

    return {
        type,
        lengthInBytes,
        isValid,
        isLongCast,
        previewText,
        fullText: text,
        exceedsPreview,
        tailwindColor,
        warningLabel
    };
}

/**
 * Hook for text length analysis with consistent API
 */
export function useTextLength({ text }: { text: string }) {
    const analysis = analyzeCastText(text);

    return {
        length: analysis.lengthInBytes,
        isValid: analysis.isValid,
        tailwindColor: analysis.tailwindColor,
        label: analysis.warningLabel,
        isLongCast: analysis.isLongCast,
        castType: analysis.type,
        analysis // Full analysis for advanced usage
    };
}

// src/common/helpers/farcaster.ts - Update submitCast function
export const submitCast = async ({
    text,
    embeds,
    mentions,
    mentionsPositions,
    parentCastId,
    parentUrl,
    signerPrivateKey,
    fid,
}: SubmitCastParams) => {
    const writeClient = new HubRestAPIClient({
        hubUrl: process.env.NEXT_PUBLIC_HUB_HTTP_URL,
        axiosInstance,
    });

    const dataOptions = getDataOptions(fid);

    // Determine cast type based on text length
    const textAnalysis = analyzeCastText(text);

    const castAdd: CastAddBody = {
        text,
        embeds: embeds ?? [],
        embedsDeprecated: [],
        mentions: mentions ?? [],
        mentionsPositions: mentionsPositions ?? [],
        parentUrl,
        type: textAnalysis.type, // Add cast type
    };

    if (parentCastId !== undefined) {
        const parentHashBytes = hexStringToBytes(parentCastId.hash);
        const parentFid = parentCastId.fid;
        parentHashBytes.match(
            (bytes) => {
                castAdd.parentCastId = {
                    fid: parentFid,
                    hash: bytes,
                };
            },
            (err) => {
                console.log('submitCast parentCastId error', err);
                throw err;
            }
        );
    }

    const msg = await makeCastAdd(castAdd, dataOptions, new NobleEd25519Signer(toBytes(signerPrivateKey)));
    if (msg.isErr()) {
        throw msg.error;
    }

    const messageBytes = Buffer.from(Message.encode(msg.value).finish());
    const response = await writeClient.apis.submitMessage.submitMessage({
        body: messageBytes,
    });

    const publishCastResponse = response.data as CastAdd;
    console.log(`new cast hash: ${publishCastResponse.hash}`);
    return publishCastResponse.hash;
};
