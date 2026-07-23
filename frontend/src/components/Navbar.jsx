import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Briefcase, GraduationCap, FileText, Newspaper, ShieldAlert } from "lucide-react";

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary-600 dark:text-primary-400 font-semibold border-b-2 border-primary-600 dark:border-primary-400"
      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors";
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-navbar backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse-subtle" />
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              Edu<span className="text-primary-500">Portal</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`pb-1 text-sm ${isActive("/")}`}>
              Home
            </Link>
            <Link to="/placements" className={`pb-1 text-sm ${isActive("/placements")}`}>
              Placements
            </Link>
            <Link to="/notes" className={`pb-1 text-sm ${isActive("/notes")}`}>
              Notes
            </Link>
            <Link to="/news" className={`pb-1 text-sm ${isActive("/news")}`}>
              News
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              to="/admin"
              className="flex items-center gap-1 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-full text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800">
          <Link to="/" className={`text-xs px-2 py-1 ${isActive("/")}`}>
            Home
          </Link>
          <Link to="/placements" className={`text-xs px-2 py-1 ${isActive("/placements")}`}>
            Placements
          </Link>
          <Link to="/notes" className={`text-xs px-2 py-1 ${isActive("/notes")}`}>
            Notes
          </Link>
          <Link to="/news" className={`text-xs px-2 py-1 ${isActive("/news")}`}>
            News
          </Link>
        </div>
      </div>
    </nav>
  );
}