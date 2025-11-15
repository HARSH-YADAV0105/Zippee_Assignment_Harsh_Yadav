
import React, { useState, useEffect, useCallback } from 'react';
import { Character, CharacterDetails, Species } from './types';
import { fetchCharacters, fetchCharacterDetails, fetchGeneric } from './services/swapiService';
import { useDebounce } from './hooks/useDebounce';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { Pagination } from './components/Pagination';
import { SearchBar } from './components/SearchBar';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [modalData, setModalData] = useState<CharacterDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [speciesMap, setSpeciesMap] = useState<Map<string, string>>(new Map());
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadCharacters = useCallback(async (page: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCharacters(page, search);
      setCharacters(data.results);
      setTotalPages(Math.ceil(data.count / 10));

      const speciesUrls = [...new Set(data.results.flatMap(c => c.species))];
      if (speciesUrls.length > 0) {
        const speciesPromises = speciesUrls.map(url => fetchGeneric<Species>(url));
        const speciesData = await Promise.all(speciesPromises);
        const newSpeciesMap = new Map<string, string>();
        speciesData.forEach(s => newSpeciesMap.set(s.url, s.name));
        setSpeciesMap(newSpeciesMap);
      } else {
        setSpeciesMap(new Map());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setCharacters([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    loadCharacters(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, loadCharacters]);
  
  useEffect(() => {
    // This effect runs when currentPage changes, but not for the initial load caused by debouncedSearchTerm
    if (currentPage > 1 || !debouncedSearchTerm) {
        loadCharacters(currentPage, debouncedSearchTerm);
    }
  }, [currentPage, debouncedSearchTerm, loadCharacters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleSelectCharacter = async (character: Character) => {
    // Open modal immediately with basic info to show loader inside
    setModalData({ character });
    setError(null);
    try {
      const details = await fetchCharacterDetails(character);
      // Once details are fetched, update the modal data to show content
      setModalData(details);
    } catch (err) {
      setError(err instanceof Error ? `Failed to load character details: ${err.message}` : 'An unknown error occurred.');
      setModalData(null); // Close modal on error
    }
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-white">
            Star Wars Character Finder
          </h1>
          {/* <p className="mt-2 text-lg text-gray-400">Explore the galaxy and its iconic characters</p> */}
        </header>

        <main>
          <div className="mb-8">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : characters.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {characters.map((character) => {
                  const speciesName = character.species.length > 0
                    ? speciesMap.get(character.species[0]) || 'Unknown'
                    : 'Human';
                  return (
                    <CharacterCard
                      key={character.url}
                      character={character}
                      onSelect={handleSelectCharacter}
                      speciesName={speciesName}
                    />
                  );
                })}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-300">No Characters Found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
      {modalData && (
        <CharacterModal details={modalData} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
