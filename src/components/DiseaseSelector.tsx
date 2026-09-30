import React from 'react';
import { Activity, Heart, Brain, ChevronDown } from 'lucide-react';
import { DiseaseId, DiseaseConfig } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseDatasets';

interface DiseaseSelectorProps {
  selectedDisease: DiseaseId;
  onSelectDisease: (disease: DiseaseId) => void;
  className?: string;
}

export const DiseaseSelector: React.FC<DiseaseSelectorProps> = ({
  selectedDisease,
  onSelectDisease,
  className = '',
}) => {
  const diseases: DiseaseId[] = ['breast_cancer', 'cardiovascular', 'neurological'];

  const getDiseaseIcon = (id: DiseaseId) => {
    switch (id) {
      case 'breast_cancer':
        return <Activity className="w-4 h-4" />;
      case 'cardiovascular':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'neurological':
        return <Brain className="w-4 h-4 text-purple-500" />;
    }
  };

  const getActivePillStyle = (id: DiseaseId) => {
    switch (id) {
      case 'breast_cancer':
        return 'bg-blue-600 text-white shadow-sm shadow-blue-500/25';
      case 'cardiovascular':
        return 'bg-rose-600 text-white shadow-sm shadow-rose-500/25';
      case 'neurological':
        return 'bg-purple-600 text-white shadow-sm shadow-purple-500/25';
    }
  };

  return (
    <div id="global-disease-selector-container" className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 shrink-0">
        <span>Target Pathology:</span>
      </span>

      {/* Button Tab Group for Desktop */}
      <div id="disease-tab-group" className="hidden sm:inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200 shadow-2xs">
        {diseases.map((dId) => {
          const cfg = DISEASE_CONFIGS[dId];
          const isSelected = selectedDisease === dId;
          return (
            <button
              key={dId}
              id={`disease-tab-${dId}`}
              onClick={() => onSelectDisease(dId)}
              className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? getActivePillStyle(dId)
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown for Mobile / Small Screens */}
      <div className="sm:hidden relative flex-1 min-w-[200px]">
        <select
          id="disease-mobile-select"
          value={selectedDisease}
          onChange={(e) => onSelectDisease(e.target.value as DiseaseId)}
          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-800 appearance-none pr-8 cursor-pointer"
        >
          {diseases.map((dId) => (
            <option key={dId} value={dId}>
              {DISEASE_CONFIGS[dId].name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
      </div>
    </div>
  );
};
