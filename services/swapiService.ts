
import { PaginatedResponse, Character, Homeworld, Species, Vehicle, Starship, CharacterDetails } from '../types';

const BASE_URL = 'https://swapi.dev/api';

// A generic fetch function to handle SWAPI requests and errors
async function fetcher<T>(url: string): Promise<T> {
  // Use https for all API calls
  const secureUrl = url.startsWith('http://') ? 'https://' + url.substring(7) : url;
  const response = await fetch(secureUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${secureUrl}. Status: ${response.status}`);
  }
  return response.json();
}

export const fetchCharacters = async (page: number, search: string): Promise<PaginatedResponse<Character>> => {
  const url = new URL(`${BASE_URL}/people/`);
  url.searchParams.append('page', page.toString());
  if (search) {
    url.searchParams.append('search', search);
  }
  return fetcher<PaginatedResponse<Character>>(url.toString());
};

export const fetchGeneric = async <T>(url: string): Promise<T> => {
    return fetcher<T>(url);
}

export const fetchCharacterDetails = async (character: Character): Promise<CharacterDetails> => {
    const homeworldPromise = fetchGeneric<Homeworld>(character.homeworld);
    const vehiclePromises = character.vehicles.map(url => fetchGeneric<Vehicle>(url).then(v => v.name));
    const starshipPromises = character.starships.map(url => fetchGeneric<Starship>(url).then(s => s.name));
  
    const [homeworld, vehicleNames, starshipNames] = await Promise.all([
      homeworldPromise,
      Promise.all(vehiclePromises),
      Promise.all(starshipPromises),
    ]);
  
    return { character, homeworld, vehicleNames, starshipNames };
};
