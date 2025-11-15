
import React from 'react';
import { CharacterDetails } from '../types';
import { formatDate } from '../utils/formatters';
import { Loader } from './Loader';

interface CharacterModalProps {
  details: CharacterDetails;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-400 capitalize">{label.replace('_', ' ')}</p>
    <p className="text-lg text-white font-semibold capitalize">{value}</p>
  </div>
);

const ResourceList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div>
      <h4 className="text-md font-semibold text-gray-300 mb-2">{title}</h4>
      <div className="bg-gray-900/70 p-3 rounded-md min-h-[100px]">
        <ul className="text-gray-300 text-sm space-y-1">
          {items.length > 0 ? (
            items.map((item, index) => <li key={index} className="truncate">{item}</li>)
          ) : (
            <li className="text-gray-500">None</li>
          )}
        </ul>
      </div>
    </div>
  );

export const CharacterModal: React.FC<CharacterModalProps> = ({ details, onClose }) => {
  const { character, homeworld, vehicleNames, starshipNames } = details;
  const isLoading = !homeworld || !vehicleNames || !starshipNames;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-name"
    >
      <div className="bg-black rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-700 animate-scaleUp">
        <div className="p-6 sm:p-8 ">
          <div className="flex justify-between items-start mb-6">
            <h2 id="character-name" className="text-3xl sm:text-4xl font-extrabold text-yellow-400">{character.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
              aria-label="Close modal"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader />
                </div>
            ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-yellow-300 mb-3 border-b-2 border-gray-700 pb-2">Physical Characteristics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900/50 p-4 rounded-lg">
                <DetailItem label="Gender" value={character.gender} />
                <DetailItem label="Birth Year" value={character.birth_year} />
                <DetailItem label="Height" value={`${character.height} cm`} />
                <DetailItem label="Mass" value={`${character.mass} kg`} />
                <DetailItem label="Hair Color" value={character.hair_color} />
                <DetailItem label="Skin Color" value={character.skin_color} />
                <DetailItem label="Eye Color" value={character.eye_color} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-yellow-300 mb-3 border-b-2 border-gray-700 pb-2">Homeworld</h3>
              <div className="bg-gray-900/50 p-4 rounded-lg min-h-[90px]">
                {homeworld ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DetailItem label="Name" value={homeworld.name} />
                    <DetailItem label="Terrain" value={homeworld.terrain} />
                    <DetailItem label="Climate" value={homeworld.climate} />
                    <DetailItem label="Population" value={Number(homeworld.population).toLocaleString()} />
                  </div>
                ) : (
                  <div className="text-red-400">Could not load homeworld data.</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-yellow-300 mb-3 border-b-2 border-gray-700 pb-2">Assets & Appearances</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900/50 p-4 rounded-lg">
                  <div className="md:col-span-1">
                    <h4 className="text-md font-semibold text-gray-300 mb-2">Film Apppxrances</h4>
                    <div className="bg-gray-900/70 p-3 rounded-md text-center min-h-[100px] flex items-center justify-center">
                        <p className="text-4xl font-bold text-white">{character.films.length}</p>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <ResourceList title="Vehicles" items={vehicleNames || []} />
                  </div>
                   <div className="md:col-span-1">
                    <ResourceList title="Starships" items={starshipNames || []} />
                  </div>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 pt-4">
              Data Added: {formatDate(character.created)}
            </div>
          </div>
          )}
        </div>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};