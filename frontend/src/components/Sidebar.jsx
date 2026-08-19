import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const linksByRole = {
  student: [{ to: '/student', label: 'Student Dashboard' }],
  teacher: [{ to: '/teacher', label: 'Teacher Dashboard' }],
  admin: [{ to: '/admin', label: 'Admin Dashboard' }],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = linksByRole[user?.role] || [];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-3 md:block">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded px-3 py-2 text-sm ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
