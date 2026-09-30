"""
Classical Machine Learning models and explainability engine (Logistic Regression, Random Forest, XGBoost, SHAP).
"""
import time
import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    from sklearn.ensemble import GradientBoostingClassifier as XGBClassifier
    HAS_XGBOOST = False

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

from backend.dataset import wdbc_dataset, FEATURE_DESCRIPTIONS
from backend.pipeline import pipeline

class ClassicalModelsManager:
    def __init__(self):
        X_train_30d = pipeline.X_scaled
        y_train = wdbc_dataset.y
        
        # 1. Logistic Regression
        self.lr = LogisticRegression(max_iter=1000, random_state=42)
        self.lr.fit(X_train_30d, y_train)
        
        # 2. Random Forest (100 trees, Gini impurity, max_features='sqrt')
        self.rf = RandomForestClassifier(
            n_estimators=100,
            criterion='gini',
            max_features='sqrt',
            random_state=42
        )
        self.rf.fit(X_train_30d, y_train)
        
        # 3. XGBoost
        if HAS_XGBOOST:
            self.xgb = XGBClassifier(
                n_estimators=100,
                max_depth=4,
                learning_rate=0.08,
                random_state=42,
                eval_metric='logloss'
            )
        else:
            self.xgb = XGBClassifier(
                n_estimators=100,
                max_depth=4,
                learning_rate=0.08,
                random_state=42
            )
        self.xgb.fit(X_train_30d, y_train)
        
        # Initialize SHAP explainer for Random Forest
        self.explainer = None
        if HAS_SHAP:
            try:
                self.explainer = shap.TreeExplainer(self.rf)
            except Exception:
                self.explainer = None

    def predict_rf(self, scaled_30d: np.ndarray) -> Tuple[float, int, float]:
        """
        Returns:
            probability_malignant (float),
            predicted_class (int),
            latency_ms (float)
        """
        t0 = time.perf_counter()
        prob_malignant = float(self.rf.predict_proba(scaled_30d)[0, 1])
        pred_class = 1 if prob_malignant >= 0.5 else 0
        latency_ms = (time.perf_counter() - t0) * 1000
        return prob_malignant, pred_class, latency_ms

    def get_top_features(self, scaled_30d: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Computes SHAP or Gini-based feature contributions for the top 5 original features.
        Returns list of dicts with name, description, and normalized percentage value.
        """
        if self.explainer is not None:
            try:
                shap_values = self.explainer.shap_values(scaled_30d)
                # In binary classification, shap_values might be a list of [benign_shap, malignant_shap] or 2D array
                if isinstance(shap_values, list) and len(shap_values) == 2:
                    contribs = np.abs(shap_values[1][0])
                elif hasattr(shap_values, "values"):
                    contribs = np.abs(shap_values.values[0, :, 1] if len(shap_values.shape) == 3 else shap_values.values[0])
                else:
                    contribs = np.abs(shap_values[0])
            except Exception:
                contribs = self.rf.feature_importances_ * np.abs(scaled_30d[0])
        else:
            # Fallback: Gini feature importance weighted by sample z-score magnitude
            contribs = self.rf.feature_importances_ * (np.abs(scaled_30d[0]) + 0.5)

        total_contrib = np.sum(contribs) if np.sum(contribs) > 0 else 1.0
        normalized_pct = (contribs / total_contrib) * 100.0
        
        # Rank top K features
        top_indices = np.argsort(normalized_pct)[::-1][:top_k]
        
        # Renormalize top K to sum to ~100% or relative scale
        top_sum = np.sum(normalized_pct[top_indices])
        
        results = []
        for idx in top_indices:
            feat_name = wdbc_dataset.feature_names[idx]
            val = float(round((normalized_pct[idx] / top_sum) * 100.0, 1))
            desc = FEATURE_DESCRIPTIONS.get(feat_name, "Cytological morphological property")
            results.append({
                "name": feat_name,
                "description": desc,
                "value": val
            })
            
        return results

classical_manager = ClassicalModelsManager()
