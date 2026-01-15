import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Calculator, Settings, Info, Languages, Menu, X, Database, Activity } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en');
  };

  const navItems = [
    { path: '/', label: 'home', icon: <Home size={18} /> },
    { path: '/process', label: 'process_sheet', icon: <Activity size={18} /> },
    { path: '/calculators', label: 'calculators', icon: <Calculator size={18} /> },
    { path: '/machines', label: 'machines', icon: <Settings size={18} /> },
    { path: '/materials', label: 'materials', icon: <Database size={18} /> },
    { path: '/buttons', label: 'buttons', icon: <Info size={18} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-slate-900/80 backdrop-blur-md border-slate-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xl font-bold tracking-wider transition-colors text-slate-100 hover:text-white">
                POLYPILOT
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="flex items-center ml-10 space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      location.pathname === item.path
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    {t(item.label)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Language Switcher */}
            <div className="hidden md:block">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors border rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              >
                <Languages size={16} />
                {i18n.language.toUpperCase()}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-slate-900 border-slate-800 shrink-0">
        <div className="flex flex-col items-center justify-between gap-4 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:flex-row">
          <div className="font-mono text-sm text-slate-500">
            Made by <span className="font-bold text-blue-500">CPTCR</span>
          </div>
          <div className="text-slate-600 text-[10px] uppercase tracking-widest flex items-center gap-2">
            <span>Released under the</span>
            <span className="font-bold text-slate-400">GNU General Public License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}