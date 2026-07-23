import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Briefcase, GraduationCap, FileText, Newspaper, ShieldAlert } from "lucide-react";

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-gray-900 transition-colors";
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <Link to="/" className="text-lg font-bold tracking-tight text-gray-900">
              Edu<span className="text-indigo-600">Portal</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm ${isActive("/")}`}>
              Home
            </Link>
            <Link to="/placements" className={`text-sm ${isActive("/placements")}`}>
              Placements
            </Link>
            <Link to="/notes" className={`text-sm ${isActive("/notes")}`}>
              Notes
            </Link>
            <Link to="/news" className={`text-sm ${isActive("/news")}`}>
              News
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-gray-100">
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