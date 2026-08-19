from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import pandas as pd
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    "attendance_pct",
    "assignment_score",
    "quiz_score",
    "midterm_score",
    "study_hours",
]


@dataclass
class PreprocessingArtifacts:
    scaler: StandardScaler


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = df.copy()
    for col in FEATURE_COLUMNS:
        cleaned[col] = pd.to_numeric(cleaned[col], errors="coerce")

    cleaned[FEATURE_COLUMNS] = cleaned[FEATURE_COLUMNS].fillna(cleaned[FEATURE_COLUMNS].median())
    return cleaned


def fit_scaler(df: pd.DataFrame) -> StandardScaler:
    scaler = StandardScaler()
    scaler.fit(df[FEATURE_COLUMNS])
    return scaler


def transform_features(df: pd.DataFrame, scaler: StandardScaler):
    return scaler.transform(df[FEATURE_COLUMNS])


def build_risk_labels(final_scores: Iterable[float]) -> list[str]:
    labels = []
    for score in final_scores:
        if score < 50:
            labels.append("High")
        elif score < 70:
            labels.append("Medium")
        else:
            labels.append("Low")
    return labels
