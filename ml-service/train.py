from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from preprocessing import FEATURE_COLUMNS, build_risk_labels, clean_dataframe, fit_scaler, transform_features

MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def train_models(csv_path: Path):
    df = pd.read_csv(csv_path)
    df = clean_dataframe(df)

    if "final_score" not in df.columns:
        raise ValueError("Dataset must include final_score column")

    if "pass_fail" not in df.columns:
        df["pass_fail"] = (df["final_score"] >= 50).astype(int)

    risk_labels = build_risk_labels(df["final_score"].tolist())

    X_train, X_test, y_reg_train, y_reg_test, y_cls_train, y_cls_test = train_test_split(
        df[FEATURE_COLUMNS],
        df["final_score"],
        risk_labels,
        test_size=0.2,
        random_state=42,
        stratify=risk_labels,
    )

    scaler = fit_scaler(X_train)
    X_train_scaled = transform_features(X_train, scaler)
    X_test_scaled = transform_features(X_test, scaler)

    clf = RandomForestClassifier(n_estimators=200, random_state=42)
    reg = RandomForestRegressor(n_estimators=250, random_state=42)

    clf.fit(X_train_scaled, y_cls_train)
    reg.fit(X_train_scaled, y_reg_train)

    cls_pred = clf.predict(X_test_scaled)
    reg_pred = reg.predict(X_test_scaled)

    metrics = {
        "classification": {
            "accuracy": float(accuracy_score(y_cls_test, cls_pred)),
            "f1_weighted": float(f1_score(y_cls_test, cls_pred, average="weighted")),
        },
        "regression": {
            "rmse": float(mean_squared_error(y_reg_test, reg_pred) ** 0.5),
            "mae": float(mean_absolute_error(y_reg_test, reg_pred)),
            "r2": float(r2_score(y_reg_test, reg_pred)),
        },
    }

    joblib.dump(clf, MODELS_DIR / "risk_classifier.pkl")
    joblib.dump(reg, MODELS_DIR / "grade_regressor.pkl")
    joblib.dump(scaler, MODELS_DIR / "scaler.pkl")
    (MODELS_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/sample_students.csv")
    args = parser.parse_args()
    metrics = train_models(Path(args.data))
    print(json.dumps(metrics, indent=2))
