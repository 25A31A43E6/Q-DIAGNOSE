"""
Dataset loader and metadata definitions for Wisconsin Diagnostic Breast Cancer (WDBC).
"""
import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from typing import Dict, Any, List

FEATURE_DESCRIPTIONS: Dict[str, str] = {
    "radius_mean": "Mean of distances from center to points on the cell perimeter",
    "texture_mean": "Standard deviation of gray-scale values across the cell nucleus",
    "perimeter_mean": "Mean nuclear contour boundary distance",
    "area_mean": "Mean nuclear cross-sectional area in square micrometers",
    "smoothness_mean": "Local variation in radius lengths along the nuclear perimeter",
    "compactness_mean": "Perimeter^2 / area - 1.0 (measure of nuclear pleomorphism)",
    "concavity_mean": "Severity and depth of concave portions of the nuclear contour",
    "concave_points_mean": "Count of inward indentations on the boundary contour",
    "symmetry_mean": "Nuclear mirror axis alignment coefficient",
    "fractal_dimension_mean": "Coastline approximation of nuclear boundary roughness",
    "radius_se": "Standard error for the mean distance from center to perimeter",
    "texture_se": "Standard error for gray-scale value variation",
    "perimeter_se": "Standard error for nuclear contour perimeter",
    "area_se": "Standard error for nuclear cross-sectional area",
    "smoothness_se": "Standard error for local radius length variation",
    "compactness_se": "Standard error for compactness (perimeter^2 / area - 1.0)",
    "concavity_se": "Standard error for contour concavity severity",
    "concave_points_se": "Standard error for count of concave contour points",
    "symmetry_se": "Standard error for nuclear symmetry alignment",
    "fractal_dimension_se": "Standard error for fractal dimension coastline estimate",
    "radius_worst": "Largest (mean of three largest) nuclear radius measurements",
    "texture_worst": "Largest standard deviation of gray-scale values",
    "perimeter_worst": "Largest nuclear boundary contour perimeter",
    "area_worst": "Largest nuclear cross-sectional area in square micrometers",
    "smoothness_worst": "Largest local variation in nuclear radius lengths",
    "compactness_worst": "Largest compactness ratio (irregular boundary shape)",
    "concavity_worst": "Largest concavity depth along the nuclear boundary",
    "concave_points_worst": "Highest count of inward contour indentations",
    "symmetry_worst": "Highest degree of nuclear mirror axis asymmetry",
    "fractal_dimension_worst": "Highest fractal dimension boundary irregularity"
}

class WDBCLoader:
    def __init__(self):
        # Load the real Wisconsin Diagnostic Breast Cancer dataset from scikit-learn
        # Note in sklearn target: 0 = Malignant, 1 = Benign.
        # We standardize to: 1 = Malignant, 0 = Benign for intuitive medical risk scoring.
        raw_data = load_breast_cancer(as_frame=True)
        self.df: pd.DataFrame = raw_data.frame.copy()
        
        # In sklearn, feature names use spaces (e.g. 'mean radius'). Convert to standard WDBC snake_case
        self.raw_feature_names: List[str] = list(raw_data.feature_names)
        self.standard_feature_names: List[str] = [
            f.replace(" ", "_").replace("mean_", "").replace("worst_", "").replace("error", "se") 
            for f in self.raw_feature_names
        ]
        # Exact canonical 30 names
        self.feature_names: List[str] = [
            "radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean",
            "compactness_mean", "concavity_mean", "concave_points_mean", "symmetry_mean", "fractal_dimension_mean",
            "radius_se", "texture_se", "perimeter_se", "area_se", "smoothness_se",
            "compactness_se", "concavity_se", "concave_points_se", "symmetry_se", "fractal_dimension_se",
            "radius_worst", "texture_worst", "perimeter_worst", "area_worst", "smoothness_worst",
            "compactness_worst", "concavity_worst", "concave_points_worst", "symmetry_worst", "fractal_dimension_worst"
        ]
        
        # Align column names in dataframe
        rename_map = dict(zip(self.raw_feature_names, self.feature_names))
        self.df.rename(columns=rename_map, inplace=True)
        
        # Target: 0 in sklearn is malignant, 1 is benign
        # Let's map target to 1 for Malignant, 0 for Benign
        self.y: np.ndarray = (raw_data.target == 0).astype(int) # 1 = Malignant, 0 = Benign
        self.X: np.ndarray = self.df[self.feature_names].values
        
        self.total_records: int = len(self.df)
        self.attribute_count: int = len(self.feature_names)

    def get_sample_rows(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Returns the first N rows as formatted JSON dicts with sample IDs and diagnosis."""
        samples = []
        for idx in range(min(limit, self.total_records)):
            row_dict = {col: round(float(self.df.iloc[idx][col]), 4) for col in self.feature_names}
            diag = "Malignant" if self.y[idx] == 1 else "Benign"
            row_dict["sample_id"] = f"WDBC-{842302 + idx * 7}"
            row_dict["diagnosis"] = diag
            samples.append(row_dict)
        return samples

# Singleton instance
wdbc_dataset = WDBCLoader()
