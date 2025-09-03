import { render, screen } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { CastText } from '../CastText';

describe('CastText Component', () => {
    test('should render short text without indicators', () => {
        render(<CastText text="Short cast text" />);

        expect(screen.getByText('Short cast text')).toBeInTheDocument();
        expect(screen.queryByText('Long cast')).not.toBeInTheDocument();
        expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    });

    test('should render long cast with indicator', () => {
        const longText = 'a'.repeat(400);
        render(<CastText text={longText} />);

        expect(screen.getByText('Long cast')).toBeInTheDocument();
    });

    test('should hide long cast indicator when prop is false', () => {
        const longText = 'a'.repeat(400);
        render(<CastText text={longText} showLongCastIndicator={false} />);

        expect(screen.queryByText('Long cast')).not.toBeInTheDocument();
    });

    test('should start expanded when defaultExpanded is true', () => {
        const longText = 'a'.repeat(300) + ' Full content visible';
        render(<CastText text={longText} defaultExpanded={true} />);

        expect(screen.getByText(/Full content visible/)).toBeInTheDocument();
    });
});