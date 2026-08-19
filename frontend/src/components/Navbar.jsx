import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-600">
          EduMetrics
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="text-slate-600">{user?.name} ({user?.role})</span>
              <button
                className="rounded bg-slate-800 px-3 py-1.5 text-white"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded border px-3 py-1.5">Login</Link>
              <Link to="/register" className="rounded bg-indigo-600 px-3 py-1.5 text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
