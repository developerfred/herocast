import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { ExpandableText } from '../expandable-text';
import { CastTextAnalysis } from '@/common/helpers/castText';

describe('ExpandableText', () => {
    const createMockAnalysis = (overrides: Partial<CastTextAnalysis> = {}): CastTextAnalysis => ({
        type: 'cast' as const,
        lengthInBytes: 100,
        isValid: true,
        isLongCast: false,
        previewText: 'Short text',
        fullText: 'Short text',
        exceedsPreview: false,
        tailwindColor: 'text-foreground/60',
        warningLabel: '',
        ...overrides
    });

    test('should render full text when not exceeding preview limit', () => {
        const analysis = createMockAnalysis();
        render(<ExpandableText analysis={analysis} />);

        expect(screen.getByText('Short text')).toBeInTheDocument();
        expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    });

    test('should render preview text with expand button when exceeding limit', () => {
        const analysis = createMockAnalysis({
            exceedsPreview: true,
            previewText: 'This is a preview...',
            fullText: 'This is a preview with much more content that exceeds the limit'
        });

        render(<ExpandableText analysis={analysis} />);

        expect(screen.getByText('This is a preview...')).toBeInTheDocument();
        expect(screen.getByText('Show more')).toBeInTheDocument();
    });

    test('should expand and collapse text when button is clicked', () => {
        const analysis = createMockAnalysis({
            exceedsPreview: true,
            previewText: 'Preview...',
            fullText: 'Full content here'
        });

        render(<ExpandableText analysis={analysis} />);

        // Initially showing preview
        expect(screen.getByText('Preview...')).toBeInTheDocument();
        expect(screen.queryByText('Full content here')).not.toBeInTheDocument();

        // Click to expand
        fireEvent.click(screen.getByText('Show more'));
        expect(screen.getByText('Full content here')).toBeInTheDocument();
        expect(screen.getByText('Show less')).toBeInTheDocument();

        // Click to collapse
        fireEvent.click(screen.getByText('Show less'));
        expect(screen.getByText('Preview...')).toBeInTheDocument();
        expect(screen.getByText('Show more')).toBeInTheDocument();
    });

    test('should respect defaultExpanded prop', () => {
        const analysis = createMockAnalysis({
            exceedsPreview: true,
            previewText: 'Preview...',
            fullText: 'Full content here'
        });

        render(<ExpandableText analysis={analysis} defaultExpanded={true} />);

        expect(screen.getByText('Full content here')).toBeInTheDocument();
        expect(screen.getByText('Show less')).toBeInTheDocument();
    });

    test('should hide expand button when showExpandButton is false', () => {
        const analysis = createMockAnalysis({
            exceedsPreview: true,
            previewText: 'Preview...',
            fullText: 'Full content here'
        });

        render(<ExpandableText analysis={analysis} showExpandButton={false} />);

        expect(screen.queryByText('Show more')).not.toBeInTheDocument();
        expect(screen.getByText('Preview...')).toBeInTheDocument();
    });
});