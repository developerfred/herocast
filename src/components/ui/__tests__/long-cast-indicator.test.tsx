import { render, screen } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { LongCastIndicator } from '../long-cast-indicator';

describe('LongCastIndicator', () => {
    test('should not render when isLongCast is false', () => {
        const { container } = render(<LongCastIndicator isLongCast={false} />);
        expect(container.firstChild).toBeNull();
    });

    test('should render when isLongCast is true', () => {
        render(<LongCastIndicator isLongCast={true} />);
        expect(screen.getByText('Long cast')).toBeInTheDocument();
    });

    test('should apply custom className', () => {
        const { container } = render(
            <LongCastIndicator isLongCast={true} className="custom-class" />
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    test('should render different sizes correctly', () => {
        const { rerender, container } = render(
            <LongCastIndicator isLongCast={true} size="sm" />
        );
        expect(container.firstChild).toHaveClass('text-xs');

        rerender(<LongCastIndicator isLongCast={true} size="md" />);
        expect(container.firstChild).toHaveClass('text-sm');

        rerender(<LongCastIndicator isLongCast={true} size="lg" />);
        expect(container.firstChild).toHaveClass('text-base');
    });
});



