from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

import joblib
import pandas as pd
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from pydantic import BaseModel, Field

from preprocessing import FEATURE_COLUMNS, clean_dataframe, transform_features
from train import train_models

app = FastAPI(title="EduMetrics ML Service")
MODELS_DIR = Path(__file__).parent / "models"
DATA_DIR = Path(__file__).parent / "data"


class PredictionInput(BaseModel):
    attendance_pct: float = Field(ge=0, le=100)
    assignment_score: float = Field(ge=0, le=100)
    quiz_score: float = Field(ge=0, le=100)
    midterm_score: float = Field(ge=0, le=100)
    study_hours: float = Field(ge=0)


class PredictionOutput(BaseModel):
    predicted_grade: float
    risk_level: str
    confidence_score: float
    model_version: str


def load_artifacts():
    try:
        classifier = joblib.load(MODELS_DIR / "risk_classifier.pkl")
        regressor = joblib.load(MODELS_DIR / "grade_regressor.pkl")
        scaler = joblib.load(MODELS_DIR / "scaler.pkl")
        return classifier, regressor, scaler
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail="Model artifacts not found. Run training first.") from exc


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PredictionInput):
    classifier, regressor, scaler = load_artifacts()
    frame = pd.DataFrame([payload.model_dump()])[FEATURE_COLUMNS]
    frame = clean_dataframe(frame)
    features = transform_features(frame, scaler)

    risk_level = classifier.predict(features)[0]
    predicted_grade = float(regressor.predict(features)[0])

    proba = classifier.predict_proba(features)
    confidence = float(proba.max()) if proba.size else 0.0

    return {
        "predicted_grade": round(predicted_grade, 2),
        "risk_level": str(risk_level),
        "confidence_score": round(confidence, 4),
        "model_version": os.getenv("MODEL_VERSION", "v1"),
    }


@app.post("/retrain")
async def retrain(
    file: UploadFile = File(...),
    x_api_key: Optional[str] = Header(default=None),
):
    expected = os.getenv("ML_ADMIN_API_KEY", "dev-ml-key")
    if x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    dataset_path = DATA_DIR / "retrain_upload.csv"
    content = await file.read()
    dataset_path.write_bytes(content)

    metrics = train_models(dataset_path)
    return {"status": "retrained", "metrics": metrics}
