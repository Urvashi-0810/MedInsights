"""
ML Service: Load pre-trained ML model and predict risk scores.
"""

import joblib
import pickle
import numpy as np
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class MLService:
    """Service for loading ML model and making predictions."""
    
    def __init__(self, model_path: str):
        """
        Initialize ML service and load pre-trained model.
        
        Args:
            model_path: Path to the trained model file (.pkl or .joblib)
            
        Raises:
            Exception: If model cannot be loaded
        """
        self.model = None
        self.model_path = model_path
        self._load_model()
    
    def _load_model(self):
        """Load the pre-trained model from disk."""
        try:
            if self.model_path.endswith(".joblib"):
                self.model = joblib.load(self.model_path)
            elif self.model_path.endswith(".pkl"):
                with open(self.model_path, "rb") as f:
                    self.model = pickle.load(f)
            else:
                raise Exception(f"Unsupported model format: {self.model_path}")
            
            logger.info(f"Successfully loaded ML model from {self.model_path}")
        except FileNotFoundError:
            logger.error(f"Model file not found: {self.model_path}")
            raise Exception(f"Model file not found: {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise Exception(f"Failed to load ML model: {str(e)}")
    
    def predict_risk_scores(self, structured_data: Dict[str, any]) -> Dict[str, int]:
        """
        Use ML model to predict risk scores from structured medical data.
        
        Args:
            structured_data: Dictionary with medical parameters
            
        Returns:
            Dictionary with overall and disease-specific risk scores (0-100)
            
        Raises:
            Exception: If prediction fails
        """
        try:
            if self.model is None:
                raise Exception("Model not loaded. Call _load_model() first.")
            
            # Extract features in the order expected by the model
            # This should match the training data feature order
            feature_vector = self._extract_features(structured_data)
            
            # Make prediction
            prediction = self.model.predict([feature_vector])[0]
            
            # Convert to risk scores (scale 0-100 if necessary)
            risk_scores = self._format_risk_scores(prediction, structured_data)
            
            logger.info(f"Successfully predicted risk scores: {risk_scores}")
            return risk_scores
        except Exception as e:
            logger.error(f"Risk prediction failed: {str(e)}")
            # Return default scores on failure
            return self._default_risk_scores()
    
    def _extract_features(self, structured_data: Dict[str, any]) -> List[float]:
        """
        Extract feature vector from structured data for model input.
        Must match training feature order exactly.
        """

        feature_order = [
            "glucose_fasting",
            "hba1c",
            "systolic_bp",
            "diastolic_bp",
            "ldl",
            "hdl",
            "triglycerides",
            "hemoglobin",
            "mcv",
        ]

        features = []
        for feature in feature_order:
            value = structured_data.get(feature, 0)
            if value is None:
                value = 0
            features.append(float(value))

        return np.array(features)
    
    def _format_risk_scores(self, prediction: np.ndarray, structured_data: Dict) -> Dict[str, int]:
        """
        Format model prediction output into standardized risk score dictionary.
        
        Args:
            prediction: Raw model output
            structured_data: Original structured data for context
            
        Returns:
            Standardized risk scores dictionary
        """
        # If model outputs multiple values, assign to different risk categories
        if isinstance(prediction, (list, np.ndarray)) and len(prediction) > 1:
            scores = {
    "overall": int(min(100, max(0, prediction[0] * 100)) if prediction[0] <= 1 else prediction[0]),
    
    "diabetes": int(
        min(100, max(0, prediction[1] * 100))
        if len(prediction) > 1 and prediction[1] <= 1
        else (prediction[1] if len(prediction) > 1 else 0)
    ),
    
    "heart_disease": int(
        min(100, max(0, prediction[2] * 100))
        if len(prediction) > 2 and prediction[2] <= 1
        else (prediction[2] if len(prediction) > 2 else 0)
    ),
    
    "anemia": int(
        min(100, max(0, prediction[3] * 100))
        if len(prediction) > 3 and prediction[3] <= 1
        else (prediction[3] if len(prediction) > 3 else 0)
    ),
    
    "infection": int(
        min(100, max(0, prediction[4] * 100))
        if len(prediction) > 4 and prediction[4] <= 1
        else (prediction[4] if len(prediction) > 4 else 0)
    ),
}
        else:
            # Single value prediction, use for overall risk
            overall_risk = int(min(100, max(0, prediction * 100)) if prediction <= 1 else prediction)
            scores = {
                "overall": overall_risk,
                "diabetes": overall_risk // 2,
                "heart_disease": overall_risk // 3,
                "anemia": overall_risk // 4,
                "infection": overall_risk // 5,
            }
        
        return scores
    
    def _default_risk_scores(self) -> Dict[str, int]:
        """Return default risk scores when prediction fails."""
        return {
            "overall": 50,
            "diabetes": 45,
            "heart_disease": 40,
            "anemia": 20,
            "infection": 25,
        }
