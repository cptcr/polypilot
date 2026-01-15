import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Database, Thermometer, Droplets, Layers, Info, Tag } from 'lucide-react';
import { materials } from '../data/materials';

export default function Materials() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(mat => {
    const search = searchTerm.toLowerCase();
    return (
      (mat.name && mat.name.toLowerCase().includes(search)) || 
      (mat.id && mat.id.toLowerCase().includes(search)) ||
      (mat.category && mat.category.toLowerCase().includes(search)) ||
      (mat.description && mat.description.toLowerCase().includes(search)) ||
      (mat.tradeNames && mat.tradeNames.some(tn => tn.toLowerCase().includes(search)))
    );
  });

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
       {/* Header & Search */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
           <div>
               <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                   <Database className="text-purple-500" />
                   {t('materials_header')}
               </h1>
               <p className="text-slate-400 text-sm mt-1">
                   {filteredMaterials.length} materials found
               </p>
           </div>
           
           <div className="relative w-full md:w-96">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search size={18} className="text-slate-500" />
               </div>
               <input
                 type="text"
                 className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl leading-5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all shadow-inner"
                 placeholder={t('search_material')}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
           </div>
       </div>

       {/* Material Grid/Table */}
       <div className="flex-1 overflow-y-auto pr-2">
           <div className="grid grid-cols-1 gap-4">
               {filteredMaterials.map((mat) => (
                   <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:bg-slate-800/50 group relative overflow-hidden">
                       
                       {/* Background Category Label */}
                       <div className="absolute top-0 right-0 px-4 py-1 bg-slate-800 rounded-bl-xl text-xs font-bold uppercase tracking-wider text-slate-500 border-l border-b border-slate-800">
                            {mat.category}
                       </div>

                       <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 mt-2">
                           <div>
                               <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-purple-400 transition-colors">{mat.name}</h2>
                                    <span className="px-2 py-0.5 bg-purple-900/20 text-purple-400 rounded border border-purple-900/30 text-[10px] font-mono font-bold uppercase whitespace-nowrap">
                                        {mat.id}
                                    </span>
                               </div>
                               <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">{mat.description}</p>
                               
                               {/* Trade Names */}
                               {mat.tradeNames.length > 0 && (
                                   <div className="flex flex-wrap gap-2 mt-3 items-center">
                                       <Tag size={12} className="text-slate-600" />
                                       {mat.tradeNames.map(tn => (
                                           <span key={tn} className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                               {tn}
                                           </span>
                                       ))}
                                   </div>
                               )}
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                           <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                               <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                                   <Layers size={12} /> {t('prop_density')}
                               </div>
                               <div className="text-slate-200 font-mono">{mat.density}</div>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                               <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                                   <Droplets size={12} /> {t('prop_shrinkage')}
                               </div>
                               <div className="text-slate-200 font-mono">{mat.shrinkage}</div>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                               <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                                   <Thermometer size={12} className="text-red-500"/> {t('prop_melt')}
                               </div>
                               <div className="text-slate-200 font-mono">{mat.meltTemp}</div>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                               <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                                   <Thermometer size={12} className="text-blue-500"/> {t('prop_mold')}
                               </div>
                               <div className="text-slate-200 font-mono">{mat.moldTemp}</div>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                               <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                                   <Info size={12} /> {t('prop_drying')}
                               </div>
                               <div className="text-slate-200 font-mono">{mat.drying}</div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
}