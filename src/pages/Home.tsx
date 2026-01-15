import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calculator, Settings, Info, Activity, Database } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { path: '/process', label: 'process_sheet', icon: <Activity size={32} />, descKey: 'process_sheet_desc', color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
    { path: '/calculators', label: 'calculators', icon: <Calculator size={32} />, descKey: 'calculators_desc', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { path: '/machines', label: 'machines', icon: <Settings size={32} />, descKey: 'machines_desc', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
    { path: '/materials', label: 'materials', icon: <Database size={32} />, descKey: 'materials_desc', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    { path: '/buttons', label: 'buttons', icon: <Info size={32} />, descKey: 'buttons_desc', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16 relative">
      <div className="text-center space-y-6 z-10">
        <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full border border-slate-700 shadow-xl mb-4 animate-fade-in">
             <Activity className="text-blue-500 mr-2" />
             <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">v1.0.0 Online</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
          INJECTION MOLDING <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">POLYPILOT</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          {t('welcome')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10 px-4">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className={`flex flex-col p-8 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-all duration-300 group shadow-xl`}
          >
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} transition-transform group-hover:scale-110`}>
              {feature.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">{t(feature.label)}</h2>
            <p className="text-slate-500 group-hover:text-slate-400 transition-colors">{t(feature.descKey)}</p>
          </Link>
        ))}
      </div>
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}