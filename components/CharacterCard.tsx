
import React, { useMemo } from 'react';
import { Character } from '../types';
import { stringToHslColor } from '../utils/colorUtils';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  speciesName: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onSelect, speciesName }) => {
  const accentColor = useMemo(() => stringToHslColor(speciesName, 70, 50), [speciesName]);
  const imageUrl = `https://picsum.photos/seed/${character.name}/500/500`;

  return (
    <div
      onClick={() => onSelect(character)}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400/30 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ease-in-out border-2 border-transparent"
      style={{ borderColor: accentColor }}
    >
      <div className="relative">
        <img className="w-full h-56 object-cover" src={imageUrl} alt={`Image of ${character.name}`} />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-800 to-transparent"></div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-yellow-400 truncate">{character.name}</h3>
        <p className="text-sm text-gray-400 capitalize" style={{ color: accentColor }}>
          {speciesName}
        </p>
      </div>
    </div>
  );
};
