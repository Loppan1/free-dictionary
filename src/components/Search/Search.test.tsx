import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './Search';


// Mockar fetch-funktionen
global.fetch = jest.fn();

describe('Search Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Tar bort tidigare mockning innan varje test
    });

    test('should render search input and button', () => {
        render(<Search />);
        const input = screen.getByPlaceholderText('Type a word to search');
        const button = screen.getByText('Search');

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    test('should display error message when input is empty and button is clicked', () => {
        render(<Search />);
        const button = screen.getByText('Search');
        fireEvent.click(button);

        const errorMessage = screen.getByText('Input cannot be empty');
        expect(errorMessage).toBeInTheDocument();
    });

    test('should display results when a valid word is searched', async () => {
        const mockResponse = [
            {
                word: 'example',
                phonetics: [{ audio: 'audio.mp3' }],
                meanings: [
                    {
                        partOfSpeech: 'noun',
                        definitions: [{ definition: 'Something that is representative of all such things in a group' }],
                    },
                ],
            },
        ];

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        render(<Search />);
        const input = screen.getByPlaceholderText('Type a word to search');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'example' } });
        fireEvent.click(button);

        // Väntar att resultatet av sökningen ska visas
        await waitFor(() => {
            const wordElement = screen.getByText('example');
            expect(wordElement).toBeInTheDocument();
            expect(screen.getByText('Something that is representative of all such things in a group')).toBeInTheDocument();
        });
    });

    test('should display error message when an invalid word is searched', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({}),
        });

        render(<Search />);
        const input = screen.getByPlaceholderText('Type a word to search');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'invalidword' } });
        fireEvent.click(button);

        // Väntar in att error-meddelandet ska visas
        await waitFor(() => {
            const errorMessage = screen.getByText('Cannot find a definition');
            expect(errorMessage).toBeInTheDocument();
        });
    });
});