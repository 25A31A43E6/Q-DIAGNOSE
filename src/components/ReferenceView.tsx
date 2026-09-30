import React from 'react';
import { BookOpen, FileSpreadsheet, Atom, Cpu, CheckCircle2, ShieldCheck, Download, ExternalLink, Activity, HeartPulse, Brain } from 'lucide-react';
import { DiseaseId } from '../types';
import { SAMPLE_WDBC_CSV } from '../data/sampleDataset';
import { 
  DISEASE_CONFIGS, 
  DISEASE_GLOSSARIES, 
  SAMPLE_HEART_DISEASE_CSV, 
  SAMPLE_NEUROLOGICAL_CSV 
} from '../data/diseaseDatasets';

interface ReferenceViewProps {
  onLoadSampleToUpload: () => void;
  selectedDisease: DiseaseId;
  onSelectDisease: (disease: DiseaseId) => void;
}

export const ReferenceView: React.FC<ReferenceViewProps> = ({ 
  onLoadSampleToUpload, 
  selectedDisease, 
  onSelectDisease 
}) => {
  const currentConfig = DISEASE_CONFIGS[selectedDisease];
  const glossary = DISEASE_GLOSSARIES[selectedDisease] || [];

  const handleDownloadDatasetCSV = () => {
    let csvData = SAMPLE_WDBC_CSV;
    let fileName = 'wisconsin_diagnostic_breast_cancer_wdbc_sample.csv';
    
    if (selectedDisease === 'cardiovascular') {
      csvData = SAMPLE_HEART_DISEASE_CSV;
      fileName = 'uci_heart_disease_clinical_sample.csv';
    } else if (selectedDisease === 'neurological') {
      csvData = SAMPLE_NEUROLOGICAL_CSV;
      fileName = 'parkinsons_biomarker_voice_sample.csv';
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDiseaseIcon = (id: DiseaseId) => {
    switch (id) {
      case 'breast_cancer':
        return Activity;
      case 'cardiovascular':
        return HeartPulse;
      case 'neurological':
        return Brain;
    }
  };

  return (
    <div id="reference-view" className="space-y-8 max-w-7xl mx-auto">
      {/* Disease Context Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F8FA] border border-[#DCE8F6] rounded-xl">
          {(['breast_cancer', 'cardiovascular', 'neurological'] as DiseaseId[]).map((diseaseKey) => {
            const config = DISEASE_CONFIGS[diseaseKey];
            const Icon = getDiseaseIcon(diseaseKey);
            const isSelected = selectedDisease === diseaseKey;
            return (
              <button
                key={diseaseKey}
                id={`btn-ref-select-${diseaseKey}`}
                onClick={() => onSelectDisease(diseaseKey)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#0B1E3D] shadow-xs border border-[#DCE8F6] font-bold'
                    : 'text-[#2D3748] opacity-80 hover:opacity-100 hover:text-[#0B1E3D] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-[#2D3748] opacity-50'}`} />
                <span>{config.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSelected ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-[#DCE8F6]/50 text-[#2D3748]'}`}>
                  {config.shortName}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#2D3748] opacity-80 font-mono px-3">
          Active Reference: <strong className="text-[#0B1E3D]">{currentConfig.shortName}</strong> (<span className="font-bold text-[#C59B27]">{currentConfig.recordsCount}</span> Cohort Samples, <span className="font-bold text-[#C59B27]">{currentConfig.featureCount}</span> Clinical Features)
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-teal-600" />
            </span>
            <h2 className="text-base font-bold text-[#0B1E3D]">
              {currentConfig.name} Reference & Feature Dictionary
            </h2>
          </div>
          <p className="text-xs text-[#2D3748] opacity-80 leading-relaxed mt-2">
            {selectedDisease === 'breast_cancer' && 
              "The Wisconsin Diagnostic Breast Cancer (WDBC) dataset was created by Dr. William H. Wolberg, W. Nick Street, and Olvi L. Mangasarian at the University of Wisconsin. Features are computed from digitized images of fine needle aspirates (FNA) of breast masses, characterizing cell nucleus geometry and chromatin texture."}
            {selectedDisease === 'cardiovascular' && 
              "The UCI Heart Disease dataset comprises clinical and hemodynamic measurements collected from the Cleveland Clinic Foundation by Dr. Robert Detrano. Features include cardiovascular stress markers, resting electrocardiographic outcomes, exercise-induced angina, and coronary vessel fluoroscopy attributes."}
            {selectedDisease === 'neurological' && 
              "The Parkinson's Disease Telemonitoring and Vocal Biomarker dataset was developed by Max Little in collaboration with the National Centre for Voice and Speech. Features quantify biomedical voice perturbations, fundamental frequency variations, and non-linear dynamical complexity measures discriminating neurodegenerative disorders."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#2D3748] opacity-80 font-mono">
            <span className="px-2 py-0.5 rounded bg-[#F4F8FA] text-[#0B1E3D] font-semibold border border-[#DCE8F6]">
              Cohort: <span className="font-bold text-[#C59B27]">{currentConfig.recordsCount}</span> Patients
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F4F8FA] text-[#0B1E3D] font-semibold border border-[#DCE8F6]">
              Features: <span className="font-bold text-[#C59B27]">{currentConfig.featureCount}</span> Attributes
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-200">
              PCA Mapping: {currentConfig.hilbertDimension}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-download-wdbc-csv-ref"
            onClick={handleDownloadDatasetCSV}
            className="px-3.5 py-2 rounded-xl bg-[#F4F8FA] hover:bg-slate-200 text-[#0B1E3D] font-semibold text-xs border border-[#DCE8F6] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Download {currentConfig.shortName} CSV Sample</span>
          </button>
          <button
            id="btn-load-to-predict-ref"
            onClick={onLoadSampleToUpload}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Load in Predictor</span>
          </button>
        </div>
      </div>

      {/* Feature Glossary Table */}
      <div className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 overflow-hidden">
        <div className="p-5 border-b border-[#DCE8F6] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1E3D]">
              {currentConfig.name} Feature Definitions & Clinical Significance
            </h3>
            <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
              Comprehensive clinical dictionary of <span className="font-bold text-[#C59B27]">{currentConfig.featureCount}</span> attributes utilized in StandardScaler + PCA quantum feature mapping.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-[#F4F8FA] border border-[#DCE8F6] text-teal-700 px-2.5 py-1 rounded-lg">
            {glossary.length} Documented Features
          </span>
        </div>

        <div className="overflow-x-auto">
          <table id="table-feature-glossary" className="w-full text-left text-xs">
            <thead className="bg-[#F4F8FA] text-[#0B1E3D] uppercase font-bold text-[11px] border-b border-[#DCE8F6] tracking-wider">
              <tr>
                <th className="px-5 py-3">Feature Name</th>
                <th className="px-4 py-3">Clinical / Mathematical Description</th>
                <th className="px-4 py-3">Typical Range</th>
                <th className="px-5 py-3">Diagnostic Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F6]">
              {glossary.map((f) => (
                <tr key={f.name} className="hover:bg-[#F4F8FA]/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-teal-700 whitespace-nowrap">
                    {f.name}
                  </td>
                  <td className="px-4 py-3.5 text-[#2D3748]">{f.description}</td>
                  <td className="px-4 py-3.5 font-mono text-[#C59B27] font-semibold whitespace-nowrap">{f.range}</td>
                  <td className="px-5 py-3.5 text-[#2D3748] opacity-80 text-[11px]">{f.clinicalNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
