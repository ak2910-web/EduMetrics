import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RiskBadge from '../../components/RiskBadge';
import StatCard from '../../components/StatCard';

const sampleTrend = [
  { period: 'Sem 1', score: 68 },
  { period: 'Sem 2', score: 72 },
  { period: 'Sem 3', score: 75 },
  { period: 'Sem 4', score: 78 },
];

export default function StudentDashboard() {
  const predictedGrade = 78.2;
  const riskLevel = 'Low';

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Predicted Grade" value={predictedGrade} hint="Based on latest academic records" />
        <StatCard title="Risk Level" value={<RiskBadge level={riskLevel} />} hint="Current intervention priority" />
        <StatCard title="Class Avg Comparison" value="+4.8" hint="Above class average" />
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-lg font-semibold">Performance Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleTrend}>
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold">Recommendations</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Your attendance is below 75% in two subjects. Increase class participation.</li>
          <li>Boost weekly study time by 3 hours to improve projected scores.</li>
          <li>Prioritize midterm-focused revision in weaker subjects.</li>
        </ul>
      </div>
    </div>
  );
}
