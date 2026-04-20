import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const displayName = user?.fullName?.trim() || user?.email || 'User';

  const applicantLinks = (
    <>
      <Link
        to="/"
        className="text-white hover:text-gray-200 transition py-2 border-b border-white/10 lg:border-0"
        onClick={() => setMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        to="/academic-qualifications"
        className="text-white hover:text-gray-200 transition py-2 border-b border-white/10 lg:border-0"
        onClick={() => setMenuOpen(false)}
      >
        Qualifications
      </Link>
      <Link
        to="/work-experience"
        className="text-white hover:text-gray-200 transition py-2 border-b border-white/10 lg:border-0"
        onClick={() => setMenuOpen(false)}
      >
        Experience
      </Link>
      <Link
        to="/research-publications"
        className="text-white hover:text-gray-200 transition py-2 border-b border-white/10 lg:border-0"
        onClick={() => setMenuOpen(false)}
      >
        Publications
      </Link>
      <Link
        to="/score-card"
        className="text-white hover:text-gray-200 transition font-semibold py-2 lg:border-0"
        onClick={() => setMenuOpen(false)}
      >
        Score Card
      </Link>
      <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        Settings
    </Link>
    </>
  );

  return (
    <nav className="bg-primary shadow-lg">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center min-h-14 sm:min-h-16 py-2 gap-2">
          <div className="flex items-center gap-2 min-w-0 shrink">
            <Link
              to={isAdmin ? '/admin' : '/'}
              className="text-white text-lg sm:text-xl font-bold truncate"
            >
              Faculty Induction
            </Link>
            {isAuthenticated && !isAdmin && (
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white border border-white/30 hover:bg-white/10"
                aria-expanded={menuOpen}
                aria-label="Open menu"
                onClick={() => setMenuOpen((o) => !o)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>

          {isAuthenticated && !isAdmin && (
            <div className="hidden lg:flex flex-wrap items-center gap-4 text-sm">{applicantLinks}</div>
          )}

          {isAuthenticated && isAdmin && (
            <div className="hidden md:flex items-center">
              <Link to="/admin" className="text-white hover:text-gray-200 transition font-semibold text-sm">
                Admin panel
              </Link>
            </div>
          )}

          <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3 ml-auto shrink-0">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <p className="text-white/90 text-[11px] sm:text-xs text-right max-w-[10rem] sm:max-w-xs leading-snug hidden sm:block lg:hidden">
                      Submit via{' '}
                      <Link to="/score-card" className="underline font-medium">
                        Score Card
                      </Link>
                    </p>
                    <p
                      className="text-white/90 text-xs sm:text-sm text-right max-w-xs leading-snug hidden lg:block"
                      title="Applicants submit their final application from the Score Card page."
                    >
                      Submit your application from{' '}
                      <Link to="/score-card" className="underline font-medium hover:text-white">
                        Score Card
                      </Link>{' '}
                      when all forms are complete.
                    </p>
                  </>
                )}
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-white text-xs sm:text-sm text-right max-w-[140px] sm:max-w-none truncate">
                    Welcome, <span className="font-semibold">{displayName}</span>
                    {isAdmin && (
                      <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs bg-white/20 px-1.5 py-0.5 rounded whitespace-nowrap">
                        Admin
                      </span>
                    )}
                  </span>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="md:hidden text-white text-xs font-semibold border border-white/40 px-2 py-1 rounded"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-red-700 transition whitespace-nowrap"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && !isAdmin && menuOpen && (
          <div className="lg:hidden border-t border-white/20 py-2 flex flex-col">{applicantLinks}</div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
