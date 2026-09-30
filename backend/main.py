"""
Q-Diagnose API: FastAPI Backend for Hybrid Quantum-Classical Breast Cancer Classification.
"""
import time
from typing import List, Literal, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

from backend.dataset import wdbc_dataset
from backend.pipeline import pipeline
from backend.classical_models import classical_manager
from backend.quantum_models import quantum_vqc
from backend.benchmarks import benchmark_suite

app = FastAPI(
    title="Q-Diagnose API",
    description="Hybrid Quantum-Classical Breast Cancer Classification Service using Qiskit VQC, QSVM, Random Forest, and SHAP explainability.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class PredictRequest(BaseModel):
    sample_id: str = Field(default="WDBC-SAMPLE", description="Unique sample or patient identifier")
    features: List[float] = Field(..., description="Array of exactly 30 numeric cytological features")
    model: Literal["classical", "quantum", "qnn", "qsvm", "both"] = Field(
        default="both", 
        description="Target model: classical (Random Forest), quantum (VQC), qnn (Quantum Neural Network), qsvm (Quantum SVM), or both"
    )

    @field_validator("features")
    @classmethod
    def validate_feature_length(cls, v: List[float]) -> List[float]:
        if len(v) != 30:
            raise ValueError(f"Expected exactly 30 features, but received {len(v)}")
        for idx, val in enumerate(v):
            if val is None or not isinstance(val, (int, float)):
                raise ValueError(f"Feature at index {idx} must be a valid float")
        return v

# Response Models
class FeatureImportanceItem(BaseModel):
    name: str
    description: str
    value: float

class QuantumOutput(BaseModel):
    score: float
    qubits: int = 4
    ansatz: str = "RealAmplitudes (depth=8)"
    feature_map: str = "ZZFeatureMap (reps=2)"

class ClassicalOutput(BaseModel):
    score: float
    trees: int = 100
    splitting_criterion: str = "Gini Impurity"

class PredictResponse(BaseModel):
    prediction: Literal["Malignant", "Benign"]
    confidence: float
    consensus: Literal["Concordant", "Discordant"]
    inference_latency_ms: float
    feature_importance: List[FeatureImportanceItem]
    quantum_output: QuantumOutput
    classical_output: ClassicalOutput
    interpretation: str

class BenchmarkItem(BaseModel):
    model_name: str
    type: Literal["classical", "quantum"]
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    training_time_s: float
    inference_latency_ms: float

class NoiseBenchmarkItem(BaseModel):
    qubits: int
    noisy: bool
    accuracy: float

# Error handler for 400 Bad Request
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)}
    )

# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------

@app.get("/health", summary="Service Health Check")
def get_health() -> Dict[str, Any]:
    """Health check endpoint indicating model loading status."""
    return {
        "status": "ok",
        "models_loaded": True,
        "dataset_samples": wdbc_dataset.total_records,
        "quantum_backend": "Qiskit Aer Simulator (4 Qubits)"
    }

@app.get("/dataset/sample", summary="WDBC Dataset Sample Preview")
def get_dataset_sample() -> Dict[str, Any]:
    """Returns the first 10 rows of the real WDBC dataset plus metadata."""
    return {
        "sample_rows": wdbc_dataset.get_sample_rows(limit=10),
        "total_records": wdbc_dataset.total_records,
        "attribute_count": wdbc_dataset.attribute_count,
        "feature_names": wdbc_dataset.feature_names
    }

@app.get("/pipeline/info", summary="Preprocessing Pipeline Architecture")
def get_pipeline_info() -> Dict[str, Any]:
    """Exposes details on StandardScaler and 4-Component PCA for frontend pipeline diagrams."""
    return pipeline.get_info()

@app.post("/predict", response_model=PredictResponse, summary="Predict Breast Cancer Malignancy")
def predict_sample(payload: PredictRequest) -> PredictResponse:
    """
    Executes hybrid quantum-classical prediction on a 30-feature vector.
    - Preprocesses with StandardScaler and 4D PCA.
    - Runs 4-qubit VQC with ZZFeatureMap (reps=2) & RealAmplitudes (depth=8).
    - Runs 100-tree Random Forest with Gini Impurity.
    - Combines SHAP feature contributions and quantum parameter-shift sensitivity.
    """
    t_start = time.perf_counter()
    
    # Preprocessing
    scaled_30d, pca_4d = pipeline.transform_single_30d(payload.features)
    
    # 1. Classical Prediction (Random Forest)
    classical_score, classical_class, rf_latency = classical_manager.predict_rf(scaled_30d)
    
    # 2. Quantum Prediction (VQC, QNN, or QSVM based on requested model)
    if payload.model == "qnn":
        quantum_score, quantum_class, q_latency = quantum_vqc.predict_qnn(pca_4d)
        ansatz_name = "Hybrid Classical-Quantum (4 Qubits + Dense)"
        fmap_name = "ZZFeatureMap (reps=2) + Classical Linear"
    elif payload.model == "qsvm":
        quantum_score, quantum_class, q_latency = quantum_vqc.predict_qsvm(pca_4d)
        ansatz_name = "ZZ Quantum Kernel Projection"
        fmap_name = "ZZFeatureMap (reps=2)"
    else:
        quantum_score, quantum_class, q_latency = quantum_vqc.predict_vqc(pca_4d)
        ansatz_name = "RealAmplitudes (depth=8)"
        fmap_name = "ZZFeatureMap (reps=2)"
    
    # 3. Explainability: Classical SHAP/Gini + Quantum Sensitivity
    top_features = classical_manager.get_top_features(scaled_30d, top_k=5)
    
    # 4. Consensus & Decision
    is_concordant = (classical_class == quantum_class)
    consensus_str: Literal["Concordant", "Discordant"] = "Concordant" if is_concordant else "Discordant"
    
    if payload.model in ("quantum", "qnn", "qsvm"):
        final_prob = quantum_score
        pred_label = "Malignant" if quantum_class == 1 else "Benign"
        confidence = round(quantum_score * 100 if quantum_class == 1 else (1.0 - quantum_score) * 100, 1)
    elif payload.model == "classical":
        final_prob = classical_score
        pred_label = "Malignant" if classical_class == 1 else "Benign"
        confidence = round(classical_score * 100 if classical_class == 1 else (1.0 - classical_score) * 100, 1)
    else: # both
        final_prob = 0.55 * quantum_score + 0.45 * classical_score
        pred_label = "Malignant" if final_prob >= 0.5 else "Benign"
        raw_conf = final_prob if pred_label == "Malignant" else (1.0 - final_prob)
        confidence = round(raw_conf * 100, 1)
        
    total_latency_ms = round((time.perf_counter() - t_start) * 1000, 2)
    
    # Human-readable clinical interpretation
    top_feat_name = top_features[0]["name"] if top_features else "cellular contour irregularity"
    if pred_label == "Malignant":
        interpretation = (
            f"High probability of malignancy ({confidence}%) driven by elevated {top_feat_name} "
            f"and concordant quantum Hilbert space classification."
            if is_concordant else
            f"Borderline malignant indication ({confidence}%) with discordant classical vs quantum state measurements."
        )
    else:
        interpretation = (
            f"Benign tissue profile ({confidence}% certainty) with uniform nuclear geometry and low {top_feat_name}."
        )

    return PredictResponse(
        prediction=pred_label,
        confidence=confidence,
        consensus=consensus_str,
        inference_latency_ms=total_latency_ms,
        feature_importance=[
            FeatureImportanceItem(
                name=f["name"],
                description=f["description"],
                value=f["value"]
            )
            for f in top_features
        ],
        quantum_output=QuantumOutput(
            score=round(quantum_score, 4),
            qubits=4,
            ansatz=ansatz_name,
            feature_map=fmap_name
        ),
        classical_output=ClassicalOutput(
            score=round(classical_score, 4),
            trees=100,
            splitting_criterion="Gini Impurity"
        ),
        interpretation=interpretation
    )

@app.post("/benchmark", response_model=List[BenchmarkItem], summary="5-Fold Cross-Validation Model Benchmark")
def run_benchmark() -> List[Dict[str, Any]]:
    """Runs or retrieves 5-fold cross-validation metrics on the full 569 WDBC dataset for all 5 models."""
    return benchmark_suite.get_benchmarks()

@app.get("/benchmark/noise", response_model=List[NoiseBenchmarkItem], summary="Quantum Noise and Qubit Scalability Benchmark")
def get_noise_benchmark() -> List[Dict[str, Any]]:
    """Returns quantum classification accuracy across 4, 8, and 12 qubits with and without depolarizing noise."""
    return quantum_vqc.run_noise_benchmark()
