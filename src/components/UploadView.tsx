import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Atom, 
  Sparkles, 
  Play, 
  RefreshCw, 
  FileText, 
  Check, 
  ChevronDown,
  Info,
  Sliders
} from 'lucide-react';
import { ModelType, PredictionResult, DiseaseId } from '../types';
import { ParsedCSV, parseCSV, SAMPLE_WDBC_CSV } from '../data/sampleDataset';
import { 
  DISEASE_CONFIGS, 
  SAMPLE_HEART_DISEASE_CSV, 
  SAMPLE_NEUROLOGICAL_CSV 
} from '../data/diseaseDatasets';

interface UploadViewProps {
  onRunPrediction: (data: any, model: ModelType, sampleId: string, datasetName: string) => Promise<void>;
  isLoading: boolean;
  onLoadSample: () => void;
  parsedData: ParsedCSV | null;
  setParsedData: (data: ParsedCSV | null) => void;
  selectedDisease: DiseaseId;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onRunPrediction,
  isLoading,
  parsedData,
  setParsedData,
  selectedDisease,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('Both (Compare)');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('Preparing state...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const diseaseConfig = DISEASE_CONFIGS[selectedDisease];

  const getDefaultCSV = () => {
    switch (selectedDisease) {
      case 'breast_cancer':
        return { csv: SAMPLE_WDBC_CSV, name: diseaseConfig.sampleFileName };
      case 'cardiovascular':
        return { csv: SAMPLE_HEART_DISEASE_CSV, name: diseaseConfig.sampleFileName };
      case 'neurological':
        return { csv: SAMPLE_NEUROLOGICAL_CSV, name: diseaseConfig.sampleFileName };
    }
  };

  // If no data loaded yet or disease changed, fall back to default sample for current disease
  const defaultInfo = getDefaultCSV();
  const activeData = parsedData || parseCSV(defaultInfo.csv, defaultInfo.name);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setUploadError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setUploadError(`Invalid file type: Please upload a valid CSV file (e.g. ${diseaseConfig.name} dataset).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setUploadError('Validation error: The uploaded CSV file is completely empty.');
          return;
        }

        const parsed = parseCSV(text, file.name);
        if (parsed.rows.length === 0) {
          setUploadError('Validation error: No valid data rows found in CSV. Please verify column headers and row formatting.');
          return;
        }

        if (parsed.headers.length < 3) {
          setUploadError(`Validation error: CSV has only ${parsed.headers.length} columns. ${diseaseConfig.shortName} datasets require clinical feature columns.`);
          return;
        }

        // Validate numeric fields in the first rows
        for (let r = 0; r < Math.min(parsed.rows.length, 10); r++) {
          const row = parsed.rows[r];
          for (const header of parsed.headers) {
            if (header.toLowerCase() === 'id' || header.toLowerCase() === 'diagnosis' || header.toLowerCase() === 'target') continue;
            const val = row[header];
            if (val !== undefined && val !== '' && isNaN(Number(val))) {
              setUploadError(`Invalid CSV format: Row ${r + 1} column "${header}" contains non-numeric value "${val}". Features must be real-valued measurements.`);
              return;
            }
          }
        }

        setUploadError(null);
        setParsedData(parsed);
        setSelectedRowIndex(0);
      } catch (err: any) {
        setUploadError(`CSV parsing error: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading file from disk. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleDataset = () => {
    setUploadError(null);
    const sampleInfo = getDefaultCSV();
    const sample = parseCSV(sampleInfo.csv, sampleInfo.name);
    setParsedData(sample);
    setSelectedRowIndex(0);
  };

  const handleSubmitPrediction = async () => {
    if (!activeData || activeData.rows.length === 0) {
      setUploadError('Please upload a dataset before running prediction.');
      return;
    }

    const targetRow = activeData.rows[selectedRowIndex] || activeData.rows[0];
    const sampleId = targetRow.id || `SAMPLE-${selectedRowIndex + 1}`;

    setLoadingStage(`Mapping ${diseaseConfig.shortName} features to 4-qubit Hilbert space...`);
    
    // Simulate multi-phase quantum preparation feedback
    const quantumStageName = 
      selectedModel === 'Quantum (QNN)' 
        ? 'Executing Quantum Neural Network (QNN) Hybrid Layers...' 
        : selectedModel === 'Quantum (QSVM)'
        ? 'Evaluating Quantum Support Vector Machine (QSVM) Kernel Fidelity...'
        : selectedModel === 'Quantum (VQC)'
        ? 'Executing Variational Quantum Classifier (VQC) Ansatz...'
        : 'Executing Quantum Circuit & Random Forest Parallel Inference...';

    const stage1 = setTimeout(() => {
      setLoadingStage(quantumStageName);
    }, 600);
    const stage2 = setTimeout(() => {
      setLoadingStage('Calculating Ensemble Impurity & Quantum Expectation Values...');
    }, 1200);

    try {
      await onRunPrediction(targetRow, selectedModel, sampleId, activeData.fileName);
    } finally {
      clearTimeout(stage1);
      clearTimeout(stage2);
      setLoadingStage('Finalizing consensus metrics...');
    }
  };

  // Preview up to 10 rows and 12 columns
  const previewRows = activeData.rows.slice(0, 10);
  const previewHeaders = activeData.headers.slice(0, 12);

  return (
    <div id="upload-view" className="space-y-8 max-w-7xl mx-auto">
      {/* Upload & Model Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag and Drop Upload Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B1E3D]">
                  1. Upload {diseaseConfig.name} Patient Features
                </h2>
                <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
                  {diseaseConfig.formatDescription}
                </p>
              </div>
              <button
                id="btn-load-sample-csv-upload"
                onClick={handleLoadSampleDataset}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs border border-teal-200 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Load {diseaseConfig.shortName} Demo Dataset</span>
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              id="csv-drop-zone"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                dragOver
                  ? 'border-teal-500 bg-teal-50/60 scale-[0.99]'
                  : 'border-[#DCE8F6] hover:border-teal-400 bg-[#F4F8FA]/60 hover:bg-[#F4F8FA]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-file-input"
              />
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mb-3 shadow-xs">
                <UploadCloud className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-bold text-[#0B1E3D]">
                Click to browse or drag and drop your patient CSV here
              </p>
              <p className="text-xs text-[#2D3748] opacity-80 mt-1 max-w-sm">
                {diseaseConfig.formatDescription}
              </p>

              {activeData && (
                <div className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Loaded: <strong className="font-mono text-[#0B1E3D]">{activeData.fileName}</strong> ({activeData.rowCount}-sample demo preview; full {diseaseConfig.shortName} cohort: <span className="font-bold text-[#C59B27]">{diseaseConfig.recordsCount}</span> samples, {activeData.headers.length} attributes)
                  </span>
                </div>
              )}
            </div>

            {uploadError && (
              <div id="upload-error-alert" className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Model Selection & Prediction Trigger */}
        <div className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-6 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#DCE8F6] mb-4">
              <h2 className="text-base font-bold text-[#0B1E3D]">2. Model Selection</h2>
              <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">Select inference algorithm architecture</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1E3D] uppercase tracking-wider mb-2">
                  Machine Learning Model
                </label>
                <div className="relative">
                  <select
                    id="select-model-dropdown"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                    className="w-full bg-[#F4F8FA] border border-[#DCE8F6] rounded-xl px-4 py-3 text-sm font-semibold text-[#0B1E3D] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none cursor-pointer"
                  >
                    <option value="Both (Compare)">Both (Compare Quantum & Classical)</option>
                    <option value="Quantum (VQC)">Quantum (VQC - Variational Quantum Classifier)</option>
                    <option value="Quantum (QNN)">Quantum (QNN - Quantum Neural Network)</option>
                    <option value="Quantum (QSVM)">Quantum (QSVM - Quantum Support Vector Machine)</option>
                    <option value="Classical (Random Forest)">Classical (Random Forest - 100 Trees)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-teal-600 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Model Description badge */}
              <div className="p-3.5 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#0B1E3D]">
                  <span className="flex items-center gap-1.5">
                    {selectedModel.includes('Quantum') ? (
                      <Atom className="w-3.5 h-3.5 text-teal-600" />
                    ) : selectedModel.includes('Both') ? (
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <Cpu className="w-3.5 h-3.5 text-teal-600" />
                    )}
                    Architecture Details
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedModel.includes('Both') ? 'Hybrid Mode' : selectedModel.includes('Quantum') ? 'Quantum Native' : 'Ensemble'}
                  </span>
                </div>
                <p className="text-[11px] text-[#2D3748] opacity-80 leading-relaxed">
                  {selectedModel === 'Both (Compare)' &&
                    `Runs parallel evaluations on Quantum (VQC, QNN, and QSVM available; VQC default) and Classical Random Forest, calculating cross-paradigm consensus for ${diseaseConfig.shortName}.`}
                  {selectedModel === 'Quantum (VQC)' &&
                    `Uses ZZFeatureMap for 16-dimensional quantum state encoding of ${diseaseConfig.shortName} attributes and a parameterized RealAmplitudes ansatz.`}
                  {selectedModel === 'Quantum (QNN)' &&
                    `Hybrid classical-quantum layer with a 4-qubit parameterized variational circuit coupled with classical dense layers.`}
                  {selectedModel === 'Quantum (QSVM)' &&
                    `Evaluates quantum kernel state fidelity in 2^6 Hilbert space using ZZFeatureMap inner product projection.`}
                  {selectedModel === 'Classical (Random Forest)' &&
                    `Evaluates 100 decision tree estimators using Gini impurity splitting criteria on bootstrap sub-samples.`}
                </p>
              </div>

              {/* Target Sample Row Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0B1E3D] uppercase tracking-wider mb-1.5">
                  Target Sample from Dataset
                </label>
                <div className="flex items-center justify-between text-xs text-[#2D3748] mb-2">
                  <span className="opacity-80">Selected Row:</span>
                  <span className="font-mono font-bold text-teal-700">
                    Row {selectedRowIndex + 1} ({activeData.rows[selectedRowIndex]?.id || `${diseaseConfig.id.toUpperCase()}-Sample`})
                  </span>
                </div>
                <select
                  id="select-sample-row-dropdown"
                  value={selectedRowIndex}
                  onChange={(e) => setSelectedRowIndex(Number(e.target.value))}
                  className="w-full bg-[#F4F8FA] border border-[#DCE8F6] rounded-lg px-3 py-2 text-xs font-mono text-[#0B1E3D] focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  {previewRows.map((row, idx) => {
                    const featKeys = Object.keys(row).filter(k => k !== 'id' && k !== 'diagnosis' && k !== 'target');
                    const featSummary = featKeys.slice(0, 2).map(k => `${k}: ${row[k]}`).join(', ');
                    return (
                      <option key={idx} value={idx}>
                        Row {idx + 1}: {row.id || `SAMPLE-${idx + 1}`} ({featSummary || 'Features loaded'})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Prominent Run Prediction Button */}
          <div className="mt-6 pt-4 border-t border-[#DCE8F6]">
            <button
              id="btn-run-prediction"
              onClick={handleSubmitPrediction}
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isLoading
                  ? 'bg-teal-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-500 active:scale-[0.99] shadow-teal-600/30'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{loadingStage}</span>
                </>
              ) : (
                <span>Run Prediction</span>
              )}
            </button>
            <p className="text-[11px] text-center text-[#2D3748] opacity-60 mt-2 font-medium">
              Evaluates {diseaseConfig.name} pathology via hybrid quantum-classical engine
            </p>
          </div>
        </div>
      </div>

      {/* Preprocessing Active Pipeline Notification Line */}
      <div id="preprocessing-active-badge" className="bg-[#F4F8FA] border border-[#DCE8F6] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#2D3748] shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse shrink-0"></span>
          <span>
            <strong className="text-[#0B1E3D]">Preprocessing Pipeline Active:</strong> StandardScaler + PCA reduces <span className="font-bold text-[#C59B27]">{diseaseConfig.featureCount}</span> {diseaseConfig.shortName} features down to 4 principal components capturing <span className="font-bold text-[#C59B27]">{diseaseConfig.pcaVariance}</span> cumulative variance for 4-qubit Hilbert space mapping.
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold bg-white text-teal-700 px-2.5 py-1 rounded-lg border border-teal-200 shrink-0">
          StandardScaler + PCA ({diseaseConfig.featureCount}D → 4D)
        </span>
      </div>

      {/* Dataset Preview Table Card (First 10 rows) */}
      <div className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 overflow-hidden">
        <div className="p-5 border-b border-[#DCE8F6] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0B1E3D]">Dataset Preview ({diseaseConfig.name})</h2>
              <span className="text-xs font-mono bg-[#F4F8FA] border border-[#DCE8F6] text-teal-700 px-2 py-0.5 rounded-md font-semibold">
                Showing First 10 Rows
              </span>
            </div>
            <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
              Click any row to select it as the target sample for the prediction engine
            </p>
          </div>
          <div className="text-xs text-[#2D3748] opacity-80 font-mono">
            Total Records: <strong className="text-[#C59B27]">{activeData.rowCount}</strong> | Attributes: <strong className="text-[#0B1E3D]">{activeData.headers.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table id="table-dataset-preview" className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F4F8FA] text-[#0B1E3D] uppercase font-bold text-[11px] border-b border-[#DCE8F6] tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-12 text-[#2D3748] opacity-70">#</th>
                <th className="px-4 py-3">Sample ID</th>
                {previewHeaders.filter(h => h !== 'id').map((header) => (
                  <th key={header} className="px-4 py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F6]">
              {previewRows.map((row, idx) => {
                const isSelected = selectedRowIndex === idx;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedRowIndex(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-50/80 font-bold text-teal-900' : 'hover:bg-[#F4F8FA] text-[#2D3748]'
                    }`}
                  >
                    <td className="px-4 py-3 text-center font-sans font-semibold text-[#2D3748] opacity-60">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0B1E3D] whitespace-nowrap flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      <span>{row.id || `SAMPLE-${idx + 1}`}</span>
                    </td>
                    {previewHeaders.filter(h => h !== 'id').map((header) => (
                      <td key={header} className="px-4 py-3 whitespace-nowrap">
                        {row[header] !== undefined ? row[header] : '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
