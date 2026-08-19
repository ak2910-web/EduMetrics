from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


def generate(output_path: Path, size: int = 500, seed: int = 42):
    rng = np.random.default_rng(seed)

    attendance = rng.uniform(45, 100, size)
    assignment = rng.uniform(35, 100, size)
    quiz = rng.uniform(30, 100, size)
    midterm = rng.uniform(25, 100, size)
    study_hours = rng.uniform(1, 30, size)

    weighted = (
        attendance * 0.15
        + assignment * 0.2
        + quiz * 0.2
        + midterm * 0.3
        + np.clip(study_hours * 2.2, 0, 35) * 0.15
    )
    noise = rng.normal(0, 6, size)
    final_score = np.clip(weighted + noise, 0, 100)
    pass_fail = (final_score >= 50).astype(int)

    df = pd.DataFrame(
        {
            "attendance_pct": attendance.round(2),
            "assignment_score": assignment.round(2),
            "quiz_score": quiz.round(2),
            "midterm_score": midterm.round(2),
            "study_hours": study_hours.round(2),
            "final_score": final_score.round(2),
            "pass_fail": pass_fail,
        }
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)


if __name__ == "__main__":
    output = Path(__file__).parent / "data" / "sample_students.csv"
    generate(output)
    print(f"Generated dataset at {output}")
