import { useState, ChangeEvent } from 'react';
import './Search.css';

interface Definition {
    definition: string;
    example?: string;
    synonyms?: string[];
  }
  
  interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
  }

  interface Phonetic {
    text: string;
    audio: string;
  }
  
  interface WordResult {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
  }


const Search = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [results, setResults] = useState<WordResult[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [inputError, setInputError] = useState<string | null>(null);

    // Ändrar sökbarens värde när det skrivs i inputfältet, tar bort error när en börjar skriva
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        setInputError(null);
    };

    // Knapptryck för Search, tar bort gammalt resultat söker sedan nytt mot API
    const handleSearch = () => {
        setResults(null)

        if (inputValue.trim() === '') {
          setInputError('Input cannot be empty');
          setResults(null);
          setError(null);
        } else {
          fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Cannot find a definition');
              }
              return response.json();
            })
            .then(data => {
              setResults(data);
              setError(null);
              setInputError(null);
            })
            .catch(error => {
              setError(error.message);
              setResults(null);
            });
        }
      };

    return (
        <div className='search'>
            <input 
                type="text" 
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Type a word to search'
            />
            <button onClick={handleSearch}>Search</button>
            {inputError && <p style={{ color: 'red' }}>{inputError}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {results && (
            <div className='search-results'>
            {results.map((result, index) => (
                <div className='search-result' key={index}>
                <h2>{result.word}</h2>
                {result.phonetics.map((phonetic, pIndex) => (
                    <div key={pIndex}>
                    {phonetic.audio && (
                        <audio controls>
                        <source src={phonetic.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                        </audio>
                    )}
                    </div>
                ))}
                {result.meanings.map((meaning, mIndex) => (
                    <div key={mIndex}>
                    <h3>{meaning.partOfSpeech}</h3>
                    <ul>
                        {meaning.definitions.map((definition, dIndex) => (
                        <li key={dIndex}>{definition.definition}</li>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default Search;