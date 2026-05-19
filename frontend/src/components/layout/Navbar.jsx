// src/components/layout/Navbar.jsx
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 glass-sidebar flex items-center justify-between px-4 md:px-6 shrink-0 border-b-0">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Page title spacer */}
      <div className="hidden lg:block" />

      {/* Right side: user + logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-md">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <User size={15} className="text-white" />
          </div>
          <span className="text-sm font-medium text-slate-200 hidden sm:block">
            {user?.name || 'User'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 transition-all duration-300 border border-white/10 hover:border-rose-500/50 backdrop-blur-md"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
