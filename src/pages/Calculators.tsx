import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Scale, Ruler, Thermometer, Clock, Activity, Zap, MoveHorizontal, Wind, Circle, CornerUpLeft, Sigma, Droplet, RefreshCw, Percent } from 'lucide-react';

// Volume Functions
import cylinderVolume from '../func/volumes/cylinder';
import cuboidVolume from '../func/volumes/cuboid';
import ballVolume from '../func/volumes/ball';

// Area Functions
import rectangleArea from '../func/areas/rectangle';
import circleArea from '../func/areas/circle';

// Injection Molding Functions
import calculateClampingForce from '../func/im/clampingForce';
import calculateShotWeight from '../func/im/shotWeight';
import calculateCoolingTime from '../func/im/coolingTime';
import calculateResidenceTime from '../func/im/residenceTime';
import calculateScrewSpeed from '../func/im/screwSpeed';
import calculateDosingStroke from '../func/im/dosingStroke';
import calculateFlowRatio from '../func/im/flowRatio';
import calculateProjectedArea from '../func/im/projectedArea';
import calculateCycleTime from '../func/im/cycleTime';
import calculateFlowRate from '../func/im/flowRate';
import calculateShotVsBarrel from '../func/im/shotVsBarrel';


export default function Calculators() {
  const { t } = useTranslation();
  const [activeCalc, setActiveCalc] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!activeCalc) return;
    
    let res = 0;
    // NOTE: The logic for projected area might need to be more complex, 
    // for now, we assume a simple calculation or direct input.
    switch (activeCalc) {
      // Process
      case 'clamping_force':
        res = calculateClampingForce(inputs.area || 0, inputs.pressure || 0);
        break;
      case 'shot_weight':
        res = calculateShotWeight(inputs.volume || 0, inputs.density || 0);
        break;
      case 'cooling_time_calc':
        res = calculateCoolingTime(inputs.wall_thickness || 0, inputs.thermal_diffusivity || 0.1, inputs.melt_temp || 0, inputs.mold_temp || 0, inputs.eject_temp || 0);
        break;
      case 'residence_time':
        res = calculateResidenceTime(inputs.barrel_cap || 0, inputs.shot_weight_g || 0, inputs.cycle_time_s || 0);
        break;
      case 'screw_speed':
        res = calculateScrewSpeed(inputs.screw_diameter || 0, inputs.rpm || 0);
        break;
      case 'dosing_stroke':
        res = calculateDosingStroke(inputs.shot_weight_g || 0, inputs.density || 0, inputs.screw_diameter || 0);
        break;
      case 'flow_ratio':
        res = calculateFlowRatio(inputs.flow_length || 0, inputs.wall_thickness || 0);
        break;
      case 'cycle_time':
        res = calculateCycleTime(inputs.injection_time || 0, inputs.cooling_time || 0, inputs.mold_movement_time || 0);
        break;
      case 'flow_rate':
        res = calculateFlowRate(inputs.shot_volume_cm3 || 0, inputs.injection_time || 0);
        break;
      case 'shot_vs_barrel':
        res = calculateShotVsBarrel(inputs.shot_volume_cm3 || 0, inputs.barrel_volume_cm3 || 0);
        break;
        
      // Area
      case 'projected_area':
        res = calculateProjectedArea(inputs.length || 0, inputs.width || 0); // This is a simplification
        break;
      case 'rectangle_area':
        res = rectangleArea(inputs.length || 0, inputs.width || 0);
        break;
      case 'circle_area':
        res = circleArea(inputs.radius || 0);
        break;

      // Volume
      case 'cylinder_volume':
        res = cylinderVolume(inputs.radius || 0, inputs.height || 0);
        break;
      case 'cuboid_volume':
        res = cuboidVolume(inputs.length || 0, inputs.width || 0, inputs.height || 0);
        break;
      case 'ball_volume':
        res = ballVolume(inputs.radius || 0);
        break;
    }
    setResult(res);
  };

  const calculatorGroups = [
    {
      group: 'Process',
      icon: <Activity />,
      calculators: [
        { id: 'clamping_force', icon: <Scale size={24} />, inputs: ['area', 'pressure'], unit: 'kN' },
        { id: 'shot_weight', icon: <Box size={24} />, inputs: ['volume', 'density'], unit: 'g' },
        { id: 'cooling_time_calc', icon: <Thermometer size={24} />, inputs: ['wall_thickness', 'thermal_diffusivity', 'melt_temp', 'mold_temp', 'eject_temp'], unit: 's' },
        { id: 'residence_time', icon: <Clock size={24} />, inputs: ['barrel_cap', 'shot_weight_g', 'cycle_time_s'], unit: 's' },
        { id: 'screw_speed', icon: <Zap size={24} />, inputs: ['screw_diameter', 'rpm'], unit: 'm/s' },
        { id: 'dosing_stroke', icon: <MoveHorizontal size={24} />, inputs: ['shot_weight_g', 'density', 'screw_diameter'], unit: 'mm' },
        { id: 'flow_ratio', icon: <Wind size={24} />, inputs: ['flow_length', 'wall_thickness'], unit: ':1' },
        { id: 'cycle_time', icon: <RefreshCw size={24} />, inputs: ['injection_time', 'cooling_time', 'mold_movement_time'], unit: 's' },
        { id: 'flow_rate', icon: <Droplet size={24} />, inputs: ['shot_volume_cm3', 'injection_time'], unit: 'cm³/s' },
        { id: 'shot_vs_barrel', icon: <Percent size={24} />, inputs: ['shot_volume_cm3', 'barrel_volume_cm3'], unit: '%' },
      ]
    },
    {
      group: 'Area',
      icon: <CornerUpLeft />,
      calculators: [
        { id: 'projected_area', icon: <Sigma size={24} />, inputs: ['length', 'width'], unit: 'cm²' },
        { id: 'rectangle_area', icon: <Box size={24} />, inputs: ['length', 'width'], unit: 'cm²' },
        { id: 'circle_area', icon: <Circle size={24} />, inputs: ['radius'], unit: 'cm²' },
      ]
    },
    {
        group: 'Volume',
        icon: <Box />,
        calculators: [
            { id: 'cylinder_volume', icon: <Ruler size={24} />, inputs: ['radius', 'height'], unit: 'cm³' },
            { id: 'cuboid_volume', icon: <Box size={24} />, inputs: ['length', 'width', 'height'], unit: 'cm³' },
            { id: 'ball_volume', icon: <Circle size={24} />, inputs: ['radius'], unit: 'cm³' },
        ]
    }
  ];

  const allCalculators = calculatorGroups.flatMap(g => g.calculators);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Sidebar Selection */}
      <div className="w-1/3 bg-slate-800 rounded-xl border border-slate-700 overflow-y-auto">
        <div className="p-4 border-b border-slate-700">
             <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                 <Activity className="text-blue-500" />
                 {t('calculators')}
             </h2>
        </div>
        <div className="p-2 space-y-1">
          {calculatorGroups.map(group => (
            <div key={group.group}>
                <h3 className="px-4 pt-4 pb-2 text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">{group.icon} {t(group.group)}</h3>
                {group.calculators.map((calc) => (
                    <button
                    key={calc.id}
                    onClick={() => { setActiveCalc(calc.id); setResult(null); setInputs({}); }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                        activeCalc === calc.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                        : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                    }`}
                    >
                    {calc.icon}
                    <span className="font-medium">{t(calc.id)}</span>
                    </button>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Calculation Area */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-8 flex flex-col relative overflow-hidden">
        {activeCalc ? (
            <div className="max-w-2xl w-full mx-auto animate-fade-in z-10 overflow-y-auto max-h-full pr-2">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                        {allCalculators.find(c => c.id === activeCalc)?.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{t(activeCalc)}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {allCalculators.find(c => c.id === activeCalc)?.inputs.map((inp) => (
                    <div key={inp} className="space-y-2">
                        <label className="text-sm font-mono text-slate-400 uppercase tracking-wider">
                        {t(inp)}
                        </label>
                        <input
                        type="number"
                        step="any"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                        placeholder="0.00"
                        onChange={(e) => setInputs({...inputs, [inp]: parseFloat(e.target.value)})}
                        />
                    </div>
                    ))}
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] mb-8"
                >
                    CALCULATE
                </button>

                {result !== null && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center">
                        <span className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-2 block">Calculated Result</span>
                        <div className="text-5xl font-mono font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                            <span className="text-2xl text-green-600 ml-2">{allCalculators.find(c => c.id === activeCalc)?.unit}</span>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                <Activity size={64} className="mb-4 opacity-20" />
                <p className="text-xl font-light">Select a function from the sidebar to begin</p>
            </div>
        )}
        
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>
    </div>
  );
}
