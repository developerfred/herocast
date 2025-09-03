import { convertCastPlainTextToStructured } from './farcaster';
import { analyzeCastText, CastTextAnalysis } from './castText';

const MAX_BYTE_LENGTH = 320;

/**
 * @deprecated Use analyzeCastText from castText.ts for new implementations
 * Maintained for backward compatibility
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
    analysis: analysis as CastTextAnalysis,
  };
}
