import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';

const users = [
  { name: 'Aarav', email: 'aarav@example.com', role: 'student' },
  { name: 'Riya', email: 'riya@example.com', role: 'teacher' },
  { name: 'Admin', email: 'admin@example.com', role: 'admin' },
];

const subjects = [
  { code: 'MATH101', name: 'Mathematics I', semester: 1 },
  { code: 'PHY102', name: 'Physics I', semester: 1 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Overall Pass Rate" value="86%" />
        <StatCard title="Dropout Risk (High)" value="9%" />
        <StatCard title="Predictions Generated" value="1,240" />
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Model Retraining</h2>
          <button className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">Trigger Retraining</button>
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">User Management</h2>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
          ]}
          rows={users}
        />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Subject Management</h2>
        <DataTable
          columns={[
            { key: 'code', label: 'Code' },
            { key: 'name', label: 'Name' },
            { key: 'semester', label: 'Semester' },
          ]}
          rows={subjects}
        />
      </section>
    </div>
  );
}
