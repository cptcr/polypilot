import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { machines } from '../data/machineData';
import { ChevronDown, Search } from 'lucide-react';

const MANUFACTURERS = [...new Set(machines.map(m => m.manufacturer))];

export default function Machines() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    manufacturer: '',
    query: '',
    minClampingForce: '',
    maxClampingForce: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredMachines = useMemo(() => {
    let filtered = machines;

    if (filters.manufacturer) {
      filtered = filtered.filter(m => m.manufacturer === filters.manufacturer);
    }

    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      filtered = filtered.filter(m => m.model.toLowerCase().includes(lowerQuery));
    }
      
    if (filters.minClampingForce) {
      filtered = filtered.filter(m => m.clampingForce >= parseInt(filters.minClampingForce, 10));
    }

    if (filters.maxClampingForce) {
      filtered = filtered.filter(m => m.clampingForce <= parseInt(filters.maxClampingForce, 10));
    }

    return filtered;
  }, [filters]);

  const paginatedMachines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMachines.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMachines, currentPage]);
    
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 text-slate-100 p-4">
      <h1 className="text-3xl font-bold font-mono uppercase tracking-wider">{t('machines_header')}</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        {/* Manufacturer Filter */}
        <div className="relative">
          <select
            name="manufacturer"
            value={filters.manufacturer}
            onChange={handleFilterChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Manufacturers</option>
            {MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Search Filter */}
        <div className="relative col-span-1 md:col-span-3">
          <input
            type="text"
            name="query"
            placeholder="Search by model name..."
            value={filters.query}
            onChange={handleFilterChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        
        {/* Clamping Force Filter */}
        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
            <input
                type="number"
                name="minClampingForce"
                placeholder="Min Clamp (kN)"
                value={filters.minClampingForce}
                onChange={handleFilterChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-500">-</span>
            <input
                type="number"
                name="maxClampingForce"
                placeholder="Max Clamp (kN)"
                value={filters.maxClampingForce}
                onChange={handleFilterChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      {/* Machine Table */}
      <div className="flex-1 overflow-auto bg-slate-900/50 rounded-lg border border-slate-800">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="sticky top-0 bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Manufacturer</th>
              <th className="p-4">Model</th>
              <th className="p-4 text-right">Clamping Force (kN)</th>
              <th className="p-4">Tie Bar (mm)</th>
              <th className="p-4 text-right">Screw (mm)</th>
              <th className="p-4">Injection Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedMachines.map(machine => (
              <tr key={machine.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-semibold">{machine.manufacturer}</td>
                <td className="p-4">{machine.model}</td>
                <td className="p-4 text-right font-mono">{machine.clampingForce}</td>
                <td className="p-4 font-mono">{machine.tieBarDistance || 'N/A'}</td>
                <td className="p-4 text-right font-mono">{machine.screwDiameter}</td>
                <td className="p-4 font-mono">{machine.injectionUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-slate-400 text-sm">
            Showing {Math.min(filteredMachines.length, itemsPerPage * currentPage)} of {filteredMachines.length} machines
        </span>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-800 rounded-md disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-slate-800 rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
}
