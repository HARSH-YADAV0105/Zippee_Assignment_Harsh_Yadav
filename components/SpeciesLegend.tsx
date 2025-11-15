
import React from 'react';
import { stringToHslColor } from '../utils/colorUtils';

interface SpeciesLegendProps {
  speciesMap: Map<string, string>;
}

export const SpeciesLegend: React.FC<SpeciesLegendProps> = ({ speciesMap }) => {
  const speciesList = Array.from(speciesMap.values());
  if (speciesList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800/50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Species Key</h3>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {speciesList.map((name) => {  
          const color = stringToHslColor(name as string, 70, 60);
          return (
            <div key={name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs text-gray-400 capitalize">{name}</span>
            </div>
          );
        })}
        {/* Manually add Human if not in the map, as it's a default */}
        {!speciesList.includes('Human') && (
             <div className="flex items-center space-x-2">
             <div
               className="w-3 h-3 rounded-full"
               style={{ backgroundColor: stringToHslColor('Human', 70, 60) }}
             ></div>
             <span className="text-xs text-gray-400">Human</span>
           </div>
        )}
      </div>
    </div>
  );
};
