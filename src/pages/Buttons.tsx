import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, ChevronsRight, Minimize2, Maximize2, Play, Pause, AlertTriangle, Thermometer } from 'lucide-react';

export default function Buttons() {
  const { t } = useTranslation();

  const buttons = [
    { icon: <ChevronsRight className="text-green-500" />, key: 'Injection', desc: 'Injects molten plastic into the mold.' },
    { icon: <Maximize2 className="text-blue-500" />, key: 'Mold Open', desc: 'Opens the mold halves.' },
    { icon: <Minimize2 className="text-blue-500" />, key: 'Mold Close', desc: 'Clamps the mold halves together.' },
    { icon: <ArrowUp className="text-orange-500" />, key: 'Ejector Forward', desc: 'Push parts out of the mold.' },
    { icon: <ArrowDown className="text-orange-500" />, key: 'Ejector Back', desc: 'Retract ejector pins.' },
    { icon: <Play className="text-green-500" />, key: 'Cycle Start', desc: 'Starts the automatic cycle.' },
    { icon: <Pause className="text-red-500" />, key: 'Cycle Stop', desc: 'Stops the cycle at the next step.' },
    { icon: <Thermometer className="text-red-400" />, key: 'Heating On/Off', desc: 'Controls barrel heaters.' },
    { icon: <AlertTriangle className="text-yellow-500" />, key: 'Alarm Reset', desc: 'Acknowledge and clear active alarms.' },
  ];

  return (
    <div className="space-y-8">
       <h1 className="text-2xl font-bold text-slate-100 mb-6 font-mono uppercase tracking-wider border-b border-slate-800 pb-4">
           {t('buttons_header')}
       </h1>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {buttons.map((btn, idx) => (
               <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-colors group">
                   <div className="flex items-start gap-4">
                       <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 shadow-inner group-hover:border-slate-700 transition-colors">
                           {React.cloneElement(btn.icon as React.ReactElement, { size: 32 })}
                       </div>
                       <div>
                           <h3 className="font-bold text-slate-200 text-lg mb-1">{btn.key}</h3>
                           <p className="text-slate-500 text-sm leading-relaxed">{btn.desc}</p>
                       </div>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
}