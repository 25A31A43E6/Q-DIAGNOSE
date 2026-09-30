"""
Preprocessing pipeline: StandardScaler + 4-Component PCA for Quantum & Classical ML.
"""
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from typing import Dict, Any, List, Tuple
from backend.dataset import wdbc_dataset

class PreprocessingPipeline:
    def __init__(self):
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=4, random_state=42)
        
        # Fit on real WDBC dataset
        self.X_scaled = self.scaler.fit_transform(wdbc_dataset.X)
        self.X_pca = self.pca.fit_transform(self.X_scaled)
        
        self.explained_variance_ratio = [
            round(float(v), 4) for v in self.pca.explained_variance_ratio_
        ]
        self.total_variance_explained = round(float(np.sum(self.pca.explained_variance_ratio_)) * 100, 2)

    def transform_single_30d(self, features: List[float]) -> Tuple[np.ndarray, np.ndarray]:
        """
        Transforms a single 30-feature vector.
        Returns:
            scaled_30d: (1, 30) numpy array
            pca_4d: (1, 4) numpy array
        """
        arr = np.array(features, dtype=float).reshape(1, -1)
        scaled = self.scaler.transform(arr)
        pca_4d = self.pca.transform(scaled)
        return scaled, pca_4d

    def get_info(self) -> Dict[str, Any]:
        """Returns details about the preprocessing pipeline for frontend inspection."""
        return {
            "features_before": 30,
            "features_after": 4,
            "pca_variance_explained": self.explained_variance_ratio,
            "total_variance_explained": self.total_variance_explained,
            "steps": [
                {
                    "step": 1,
                    "name": "StandardScaler",
                    "description": "Z-score normalization (zero mean, unit variance) across all 30 cytology features."
                },
                {
                    "step": 2,
                    "name": "Principal Component Analysis (PCA)",
                    "description": f"Dimensionality reduction from 30D to 4D capturing {self.total_variance_explained}% cumulative variance."
                },
                {
                    "step": 3,
                    "name": "Hilbert Space Angle Encoding",
                    "description": "ZZFeatureMap (reps=2) maps the 4 principal components into a 16-dimensional quantum state space."
                }
            ]
        }

pipeline = PreprocessingPipeline()
