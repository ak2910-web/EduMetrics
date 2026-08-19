import { useMemo, useState } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import DataTable from '../../components/DataTable';
import RiskBadge from '../../components/RiskBadge';

const students = [
  { name: 'Aarav', subject: 'Math', risk: 'High', predictedGrade: 48 },
  { name: 'Riya', subject: 'Math', risk: 'Medium', predictedGrade: 63 },
  { name: 'Kabir', subject: 'Physics', risk: 'Low', predictedGrade: 81 },
  { name: 'Isha', subject: 'Math', risk: 'High', predictedGrade: 45 },
];

const riskColors = { Low: '#16a34a', Medium: '#d97706', High: '#dc2626' };

export default function TeacherDashboard() {
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  const filtered = useMemo(() => {
    return students.filter(
      (item) =>
        (subjectFilter === 'All' || item.subject === subjectFilter) &&
        (riskFilter === 'All' || item.risk === riskFilter)
    );
  }, [subjectFilter, riskFilter]);

  const riskDistribution = useMemo(() => {
    const counts = filtered.reduce((acc, cur) => ({ ...acc, [cur.risk]: (acc[cur.risk] || 0) + 1 }), {});
    return ['Low', 'Medium', 'High'].map((risk) => ({ name: risk, value: counts[risk] || 0 }));
  }, [filtered]);

  const scoreDistribution = filtered.map((s) => ({ name: s.name, score: s.predictedGrade }));

  const onCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    alert(`Previewing first line: ${text.split('\n')[0]}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <select className="rounded border p-2" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option>All</option>
          <option>Math</option>
          <option>Physics</option>
        </select>
        <select className="rounded border p-2" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <label className="cursor-pointer rounded bg-indigo-600 px-3 py-2 text-sm text-white">
          Bulk Upload CSV
          <input type="file" className="hidden" accept=".csv" onChange={onCsvUpload} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Class Score Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={scoreDistribution}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">Risk-Level Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" outerRadius={95} label>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={riskColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Student' },
          { key: 'subject', label: 'Subject' },
          { key: 'predictedGrade', label: 'Predicted Grade' },
          { key: 'risk', label: 'Risk Level', render: (value) => <RiskBadge level={value} /> },
        ]}
        rows={filtered}
      />
    </div>
  );
}
