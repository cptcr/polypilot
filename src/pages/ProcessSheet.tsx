import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Database, RotateCcw, 
    Box, Activity, DollarSign, Settings,
    AlertTriangle, Clock, ShieldCheck, Printer, BarChart3,
    XCircle, CheckCircle, FlaskConical, Scale, Thermometer, Gauge, Component
} from 'lucide-react';
import { materials, Material } from '../data/materials';
import { machines, Machine } from '../data/machineData';

// Import all calculation functions
import calculateClampingForce from '../func/im/clampingForce';
import calculateCoolingTime from '../func/im/coolingTime';
import calculateResidenceTime from '../func/im/residenceTime';
import calculateScrewSpeed from '../func/im/screwSpeed';
import calculateDosingStroke from '../func/im/dosingStroke';
import calculateFlowRatio from '../func/im/flowRatio';
import calculateCycleTime from '../func/im/cycleTime'; // Newly added
import calculateFlowRate from '../func/im/flowRate'; // Newly added
import calculateShotVsBarrel from '../func/im/shotVsBarrel'; // Newly added

export default function ProcessSheet() {
  const { t } = useTranslation();

  // --- STATE MANAGEMENT ---
  
  const [currentMachine, setCurrentMachine] = useState<Machine | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedClampingForce, setSelectedClampingForce] = useState<number | ''>('');
  const [selectedInjectionUnit, setSelectedInjectionUnit] = useState<string>('');
  const [selectedScrewDiameter, setSelectedScrewDiameter] = useState<number | ''>('');

  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);

  const groupedMaterials = useMemo(() => materials.reduce((acc, mat) => {
    if (!acc[mat.category]) acc[mat.category] = [];
    acc[mat.category].push(mat);
    return acc;
  }, {} as Record<string, Material[]>), [materials]);

  const [inputs, setInputs] = useState({
    // Material
    materialId: '',
    density: 0,
    meltTemp: 0,
    moldTemp: 0,
    ejectTemp: 100,
    thermalDiff: 0.1,
    matCost: 0, 

    // Mold
    cavities: 1,
    partVolume: 0, 
    runnerWeight: 0, 
    projectedArea: 0, 
    wallThickness: 0, 
    flowLength: 0,
    safetyFactor: 1.2,
    moldSteel: '1.2311',
    moldWeight: 0,

    // Cycle & Process
    timeInjection: 1.5,
    timeCoolingSet: 0, // User-set cooling time
    timeMoldMove: 2.5,
    timeEject: 1.0,
    specInjPressure: 1000,
    screwRPM: 60,
    plasticizingRate: 25, 

    // Costing
    machineRate: 65, 
    laborRate: 45,
    energyRate: 0.25,
    scrapRate: 2.0,
    toolInvestment: 25000,
    annualVolume: 100000,
    desiredMargin: 20,
    volumeDiscount: 0,
    robotUsed: false,
    dryerTemp: 80,
    tempControllers: 1,
  });

  const [results, setResults] = useState({
    shotWeightTotal: 0,
    shotVolumeTotal: 0,
    clampingForce: 0,
    coolingTimeCalc: 0, // Calculated cooling time
    totalCycleTime: 0,
    residenceTime: 0,
    dosingStroke: 0,
    screwSpeed: 0,
    flowRatio: 0,
    flowRate: 0, // Newly added
    shotVsBarrel: 0, // Newly added
    partCost: 0,
    partsPerHour: 0,
    cushionMin: 0, // Needs calculation
    cushionMax: 0, // Needs calculation
    recoveryTime: 0,
    amortizationPerPart: 0,
    materialCostPerPart: 0,
    energyCostPerPart: 0,
    laborCostPerPart: 0,
    quotedPrice: 0,
    totalRevenue: 0,
  });

  // --- HANDLERS ---

  const handlePrint = () => {
      window.print();
  };

  const handleInput = (field: string, val: string) => {
      setInputs(prev => ({...prev, [field]: parseFloat(val) || 0}));
  };

  const handleBoolInput = (field: string, val: boolean) => {
      setInputs(prev => ({...prev, [field]: val}));
  };

  const handleStrInput = (field: string, val: string) => {
      setInputs(prev => ({...prev, [field]: val}));
  };

  // --- MACHINE SELECTION LOGIC ---
  const availableManufacturers = useMemo(() => {
    return [...new Set(machines.map(m => m.manufacturer))].sort();
  }, []);

  const availableModels = useMemo(() => {
    if (!selectedManufacturer) return [];
    return [...new Set(machines.filter(m => m.manufacturer === selectedManufacturer).map(m => m.model))].sort();
  }, [selectedManufacturer]);

  const availableClampingForces = useMemo(() => {
    if (!selectedManufacturer || !selectedModel) return [];
    return [...new Set(machines.filter(m => m.manufacturer === selectedManufacturer && m.model === selectedModel).map(m => m.clampingForce))].sort((a, b) => a - b);
  }, [selectedManufacturer, selectedModel]);

  const availableInjectionUnits = useMemo(() => {
    if (!selectedManufacturer || !selectedModel || selectedClampingForce === '') return [];
    return [...new Set(machines.filter(m => 
      m.manufacturer === selectedManufacturer && 
      m.model === selectedModel && 
      m.clampingForce === selectedClampingForce
    ).map(m => m.injectionUnit))].sort();
  }, [selectedManufacturer, selectedModel, selectedClampingForce]);

  const availableScrewDiameters = useMemo(() => {
    if (!selectedManufacturer || !selectedModel || selectedClampingForce === '' || !selectedInjectionUnit) return [];
    return [...new Set(machines.filter(m => 
      m.manufacturer === selectedManufacturer && 
      m.model === selectedModel && 
      m.clampingForce === selectedClampingForce &&
      m.injectionUnit === selectedInjectionUnit
    ).map(m => m.screwDiameter))].sort((a, b) => a - b);
  }, [selectedManufacturer, selectedModel, selectedClampingForce, selectedInjectionUnit]);

  useEffect(() => {
    if (selectedManufacturer && selectedModel && selectedClampingForce !== '' && selectedInjectionUnit && selectedScrewDiameter !== '') {
      const machine = machines.find(m => 
        m.manufacturer === selectedManufacturer &&
        m.model === selectedModel &&
        m.clampingForce === selectedClampingForce &&
        m.injectionUnit === selectedInjectionUnit &&
        m.screwDiameter === selectedScrewDiameter
      );
      setCurrentMachine(machine || null);
    } else {
      setCurrentMachine(null);
    }
  }, [selectedManufacturer, selectedModel, selectedClampingForce, selectedInjectionUnit, selectedScrewDiameter]);


  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matId = e.target.value;
    const mat = materials.find(m => m.id === matId);
    setCurrentMaterial(mat || null);
    if (mat) {
      const parseRange = (str: string) => {
        const parts = str.split('-').map(s => parseFloat(s.trim()));
        if (parts.length === 2) return (parts[0] + parts[1]) / 2;
        return parseFloat(str) || 0;
      };
      setInputs(prev => ({
        ...prev,
        materialId: matId,
        density: parseRange(mat.density),
        meltTemp: parseRange(mat.meltTemp),
        moldTemp: parseRange(mat.moldTemp),
        ejectTemp: parseRange(mat.moldTemp) + 40, // Estimate
        matCost: mat.costPerKg,
        dryerTemp: parseInt(mat.drying.split('°')[0]) || 80 // Extract temp, default 80
      }));
    } else {
        setInputs(prev => ({
            ...prev,
            materialId: '', density: 0, meltTemp: 0, moldTemp: 0, ejectTemp: 100, matCost: 0, dryerTemp: 80
        }));
    }
  };

  // --- CALCULATION LOOP ---
  useEffect(() => {
    // 1. Part & Shot
    const partWeight = inputs.partVolume * inputs.density;
    const totalShotWeight = (partWeight * inputs.cavities) + inputs.runnerWeight;
    const totalShotVolume = totalShotWeight / (inputs.density || 1);

    // 2. Clamp
    const clampForce = calculateClampingForce(inputs.projectedArea, inputs.specInjPressure) * inputs.safetyFactor;

    // 3. Cooling & Cycle
    const coolTime = calculateCoolingTime(
        inputs.wallThickness, inputs.thermalDiff, 
        inputs.meltTemp, inputs.moldTemp, inputs.ejectTemp
    );
    const effectiveCooling = Math.max(coolTime, inputs.timeCoolingSet); 
    const totalCycle = calculateCycleTime(
        inputs.timeInjection, effectiveCooling, inputs.timeMoldMove + inputs.timeEject + (inputs.robotUsed ? 1.5 : 0)
    );

    // 4. Machine Dependant
    const screwDia = currentMachine ? currentMachine.screwDiameter : 40;
    // Assuming maxShotVolume from machine properties, not hardcoded. Needs to be defined in Machine interface or calculated.
    // For now, let's derive it. This is a simplification and needs proper machine data integration.
    const theoreticalMaxShotVolume = Math.PI * Math.pow(screwDia / 2, 2) * 200; // Assuming 200mm max stroke for simplicity
    const barrelCap = theoreticalMaxShotVolume; 

    const resTime = calculateResidenceTime(barrelCap, totalShotWeight, totalCycle);
    const stroke = calculateDosingStroke(totalShotWeight, inputs.density, screwDia);
    const speed = calculateScrewSpeed(screwDia, inputs.screwRPM);
    const flowRatio = calculateFlowRatio(inputs.flowLength, inputs.wallThickness);
    const flowRate = calculateFlowRate(totalShotVolume, inputs.timeInjection);
    const shotVsBarrel = calculateShotVsBarrel(totalShotVolume, barrelCap);


    // Cushion (5-15% of theoretical max shot volume for the selected screw)
    const cushionMin = theoreticalMaxShotVolume * 0.05;
    const cushionMax = theoreticalMaxShotVolume * 0.15;

    // Recovery Time = Weight / Plasticizing Rate
    const recoveryTime = inputs.plasticizingRate > 0 ? totalShotWeight / inputs.plasticizingRate : 0;

    // 5. Business Costing
    const partsPerHour = totalCycle > 0 ? (3600 / totalCycle) * inputs.cavities : 0;
    const goodPartsPerHour = partsPerHour * (1 - (inputs.scrapRate / 100));
    
    const materialCostPerPart = inputs.cavities > 0 ? (totalShotWeight / 1000 * inputs.matCost) / inputs.cavities : 0;
    const machineCostPerPart = goodPartsPerHour > 0 ? inputs.machineRate / goodPartsPerHour : 0;
    const laborCostPerPart = goodPartsPerHour > 0 ? inputs.laborRate / goodPartsPerHour : 0;
    const amortPerPart = inputs.annualVolume > 0 ? inputs.toolInvestment / inputs.annualVolume : 0;
    
    // Simplified energy cost
    const energyCostPerPart = 0.02 * inputs.energyRate; 

    const totalCost = materialCostPerPart + machineCostPerPart + laborCostPerPart + amortPerPart + energyCostPerPart;

    // 6. Quotation
    const quotedPrice = totalCost * (1 + (inputs.desiredMargin / 100)) * (1 - (inputs.volumeDiscount / 100));
    const totalRevenue = quotedPrice * inputs.annualVolume;

    setResults({
        shotWeightTotal: totalShotWeight,
        shotVolumeTotal: totalShotVolume,
        clampingForce: clampForce,
        coolingTimeCalc: coolTime,
        totalCycleTime: totalCycle,
        residenceTime: resTime,
        dosingStroke: stroke,
        screwSpeed: speed,
        flowRatio: flowRatio,
        flowRate: flowRate,
        shotVsBarrel: shotVsBarrel,
        partCost: totalCost,
        partsPerHour: goodPartsPerHour,
        cushionMin,
        cushionMax,
        recoveryTime,
        amortizationPerPart: amortPerPart,
        materialCostPerPart,
        energyCostPerPart,
        laborCostPerPart,
        quotedPrice,
        totalRevenue
      });

  }, [inputs, currentMachine]);

  return (
    <div className="flex flex-col gap-6 min-h-screen">
        {/* HEADER */}
        <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 shrink-0 shadow-xl print:hidden">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <ShieldCheck className="text-green-500" size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-100 tracking-tight uppercase">
                        {t('process_sheet')}
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Shop Floor Operations Terminal</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700 text-sm font-bold"
                >
                    <Printer size={16} /> PRINT SHEET
                </button>
                <button onClick={() => window.location.reload()} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700">
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 flex-1 overflow-hidden print:block">
            
            {/* LEFT COLUMN: DETAILED INPUTS */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar print:overflow-visible print:pr-0">
                
                {/* SECTION 1: MACHINE SELECTION */}
                <div className="card-input border-blue-500/30">
                    <h3 className="section-title text-blue-400"><Settings size={16}/> {t('machine_selection')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select 
                            className="input-field-alt"
                            value={selectedManufacturer}
                            onChange={(e) => {
                                setSelectedManufacturer(e.target.value);
                                setSelectedModel('');
                                setSelectedClampingForce('');
                                setSelectedInjectionUnit('');
                                setSelectedScrewDiameter('');
                            }}
                        >
                            <option value="">-- {t('select_manufacturer')} --</option>
                            {availableManufacturers.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select 
                            className="input-field-alt"
                            value={selectedModel}
                            onChange={(e) => {
                                setSelectedModel(e.target.value);
                                setSelectedClampingForce('');
                                setSelectedInjectionUnit('');
                                setSelectedScrewDiameter('');
                            }}
                            disabled={!selectedManufacturer}
                        >
                            <option value="">-- {t('select_model')} --</option>
                            {availableModels.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select 
                            className="input-field-alt"
                            value={selectedClampingForce}
                            onChange={(e) => {
                                setSelectedClampingForce(parseFloat(e.target.value));
                                setSelectedInjectionUnit('');
                                setSelectedScrewDiameter('');
                            }}
                            disabled={!selectedModel}
                        >
                            <option value="">-- {t('select_clamping_force')} (kN) --</option>
                            {availableClampingForces.map(cf => (
                                <option key={cf} value={cf}>{cf}</option>
                            ))}
                        </select>

                        <select 
                            className="input-field-alt"
                            value={selectedInjectionUnit}
                            onChange={(e) => {
                                setSelectedInjectionUnit(e.target.value);
                                setSelectedScrewDiameter('');
                            }}
                            disabled={selectedClampingForce === ''}
                        >
                            <option value="">-- {t('select_injection_unit')} --</option>
                            {availableInjectionUnits.map(iu => (
                                <option key={iu} value={iu}>{iu}</option>
                            ))}
                        </select>

                        <select 
                            className="input-field-alt"
                            value={selectedScrewDiameter}
                            onChange={(e) => {
                                setSelectedScrewDiameter(parseFloat(e.target.value));
                            }}
                            disabled={!selectedInjectionUnit}
                        >
                            <option value="">-- {t('select_screw_diameter')} (mm) --</option>
                            {availableScrewDiameters.map(sd => (
                                <option key={sd} value={sd}>{sd}</option>
                            ))}
                        </select>
                    </div>
                    {currentMachine && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 border-t border-slate-800 mt-2">
                            <LimitSpec label="Clamping Force" val={`${currentMachine.clampingForce} kN`} />
                            {/* Max shot volume calculation here needs proper implementation */}
                            <LimitSpec label="Tie Bars" val={currentMachine.tieBarDistance || 'N/A'} />
                            <LimitSpec label="Injection Unit" val={currentMachine.injectionUnit} />
                            <LimitSpec label="Screw Ø" val={`${currentMachine.screwDiameter} mm`} />
                        </div>
                    )}
                </div>

                {/* SECTION 2: MATERIAL SELECTION */}
                <div className="card-input border-purple-500/30">
                    <h3 className="section-title text-purple-400"><Database size={16}/> {t('material_selection')}</h3>
                    <div className="space-y-4">
                        <select value={inputs.materialId} onChange={handleMaterialChange} className="input-field-alt print:bg-white print:text-black">
                            <option value="">-- {t('select_material')} --</option>
                            {Object.entries(groupedMaterials).map(([cat, mats]) => (
                                <optgroup key={cat} label={cat}>{mats.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>
                            ))}
                        </select>
                        {currentMaterial && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 border-t border-slate-800 mt-2">
                                <LimitSpec label="Density" val={`${currentMaterial.density} g/cm³`} />
                                <LimitSpec label="Melt Temp" val={`${currentMaterial.meltTemp} °C`} />
                                <LimitSpec label="Mold Temp" val={`${currentMaterial.moldTemp} °C`} />
                                <LimitSpec label="Drying" val={currentMaterial.drying} />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label={t('density')} value={inputs.density} onChange={(v: string) => handleInput('density', v)} step="0.01" />
                            <InputGroup label={t('melt_temp')} value={inputs.meltTemp} onChange={(v: string) => handleInput('meltTemp', v)} />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: MOLD DATA */}
                <div className="card-input border-orange-500/30">
                    <h3 className="section-title text-orange-400"><Box size={16}/> {t('mold_data')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label={t('cavities')} value={inputs.cavities} onChange={(v: string) => handleInput('cavities', v)} />
                        <InputGroup label="Part Vol (cm³)" value={inputs.partVolume} onChange={(v: string) => handleInput('partVolume', v)} />
                        <InputGroup label="Runner (g)" value={inputs.runnerWeight} onChange={(v: string) => handleInput('runnerWeight', v)} />
                        <InputGroup label="Projected Area (cm²)" value={inputs.projectedArea} onChange={(v: string) => handleInput('projectedArea', v)} />
                        <InputGroup label="Wall Thickness (mm)" value={inputs.wallThickness} onChange={(v: string) => handleInput('wallThickness', v)} step="0.1" />
                        <InputGroup label="Flow Length (mm)" value={inputs.flowLength} onChange={(v: string) => handleInput('flowLength', v)} />
                        <InputGroup label="Mold Steel" type="text" value={inputs.moldSteel} onChange={(v: string) => handleStrInput('moldSteel', v)} />
                        <InputGroup label="Safety Factor" value={inputs.safetyFactor} onChange={(v: string) => handleInput('safetyFactor', v)} step="0.1" />
                    </div>
                </div>
                
                {/* SECTION 4: PROCESS PARAMETERS */}
                <div className="card-input border-green-500/30">
                    <h3 className="section-title text-green-400"><Clock size={16}/> {t('process_parameters')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Injection Time (s)" value={inputs.timeInjection} onChange={(v: string) => handleInput('timeInjection', v)} step="0.1" />
                        <InputGroup label="Cooling (Set, s)" value={inputs.timeCoolingSet} onChange={(v: string) => handleInput('timeCoolingSet', v)} placeholder={results.coolingTimeCalc.toFixed(1)} />
                        <InputGroup label="Mold Open/Close (s)" value={inputs.timeMoldMove} onChange={(v: string) => handleInput('timeMoldMove', v)} step="0.1" />
                        <InputGroup label="Ejection Time (s)" value={inputs.timeEject} onChange={(v: string) => handleInput('timeEject', v)} step="0.1" />
                        <InputGroup label="Spec. Inj. Pressure (bar)" value={inputs.specInjPressure} onChange={(v: string) => handleInput('specInjPressure', v)} />
                        <InputGroup label="Screw RPM" value={inputs.screwRPM} onChange={(v: string) => handleInput('screwRPM', v)} />
                        <InputGroup label="Plasticizing Rate (g/s)" value={inputs.plasticizingRate} onChange={(v: string) => handleInput('plasticizingRate', v)} />
                        <div className="col-span-2 flex items-center gap-3">
                            <input type="checkbox" checked={inputs.robotUsed} onChange={(e) => handleBoolInput('robotUsed', e.target.checked)} className="w-5 h-5 rounded bg-slate-950 border-slate-700" />
                            <label className="lbl mb-0">{t('robot_used')}</label>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: COSTING & QUOTATION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card-input border-yellow-500/30">
                        <h3 className="section-title text-yellow-400"><BarChart3 size={16}/> {t('costing_data')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Machine Rate (€/h)" value={inputs.machineRate} onChange={(v: string) => handleInput('machineRate', v)} />
                            <InputGroup label="Labor Rate (€/h)" value={inputs.laborRate} onChange={(v: string) => handleInput('laborRate', v)} />
                            <InputGroup label="Energy Rate (€/kWh)" value={inputs.energyRate} onChange={(v: string) => handleInput('energyRate', v)} step="0.01" />
                            <InputGroup label="Scrap Rate (%)" value={inputs.scrapRate} onChange={(v: string) => handleInput('scrapRate', v)} />
                        </div>
                    </div>

                    <div className="card-input border-pink-500/30">
                        <h3 className="section-title text-pink-400"><DollarSign size={16}/> {t('quotation')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Desired Margin (%)" value={inputs.desiredMargin} onChange={(v: string) => handleInput('desiredMargin', v)} />
                            <InputGroup label="Annual Volume" value={inputs.annualVolume} onChange={(v: string) => handleInput('annualVolume', v)} />
                            <InputGroup label="Discount (%)" value={inputs.volumeDiscount} onChange={(v: string) => handleInput('volumeDiscount', v)} />
                            <InputGroup label="Tool Investment (€)" value={inputs.toolInvestment} onChange={(v: string) => handleInput('toolInvestment', v)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: RESULTS DASHBOARD */}
            <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0 print:w-full print:mt-8">
                
                {/* QUOTATION SUMMARY */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 bg-gradient-to-r from-blue-600/20 to-transparent border-b border-slate-800 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-100 uppercase tracking-widest">{t('quoted_price')}</span>
                        <ShieldCheck size={18} className="text-blue-500" />
                    </div>
                    <div className="p-6">
                        <div className="text-5xl font-mono font-black text-white mb-2">
                            €{results.quotedPrice.toFixed(3)}
                        </div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-4">Per Unit</div>
                        <div className="space-y-3 pt-4 border-t border-slate-800">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">{t('total_revenue')}</span>
                                <span className="text-slate-100 font-mono font-bold">€{results.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Base Cost/Part</span>
                                <span className="text-slate-300 font-mono italic">€{results.partCost.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OPERATIONAL LIMITS */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl flex-1 overflow-y-auto custom-scrollbar print:overflow-visible">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-slate-500" size={16}/>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Technical Validation</h4>
                    </div>

                    <ValidationCard label="Clamping Force" val={results.clampingForce} limit={currentMachine?.clampingForce || 0} unit="kN" />
                    <ValidationCard label="Shot Volume" val={results.shotVolumeTotal} limit={calculateMaxShotVolume(currentMachine?.screwDiameter || 0)} unit="cm³" />
                    <ValidationCard label="Barrel Fill" val={results.shotVsBarrel} limit={80} minLimit={20} unit="%" invertedLimits={true} />


                    <div className="space-y-3 pt-4 border-t border-slate-800">
                        <ResultSummary label="Dosing Stroke" value={`${results.dosingStroke.toFixed(1)} mm`} />
                        <ResultSummary label="Screw Speed" value={`${results.screwSpeed.toFixed(2)} m/s`} warn={results.screwSpeed > 1.0} />
                        <ResultSummary label="Residence Time" value={`${results.residenceTime.toFixed(0)} s`} warn={results.residenceTime > 300} />
                        <ResultSummary label="Recovery Time" value={`${results.recoveryTime.toFixed(1)} s`} info={`Cycle: ${results.totalCycleTime.toFixed(1)}s`} />
                        <ResultSummary label="Flow Ratio" value={`${results.flowRatio.toFixed(0)} : 1`} warn={results.flowRatio > 200} />
                        <ResultSummary label="Flow Rate" value={`${results.flowRate.toFixed(1)} cm³/s`} />
                        <ResultSummary label="Yield / Hour" value={`${results.partsPerHour.toFixed(0)} pcs`} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

// Helper to calculate theoretical max shot volume based on screw diameter
// This is a simplification. Actual max shot volume depends on screw design and machine.
const calculateMaxShotVolume = (screwDiameter: number): number => {
    if (screwDiameter === 0) return 0;
    // Assuming a max stroke length of 2.5 * screwDiameter for simplicity
    const maxStroke = 2.5 * screwDiameter; 
    return Math.PI * Math.pow(screwDiameter / 2, 2) * maxStroke;
}

const InputGroup = ({ label, value, onChange, type = "number", step = "1", placeholder = "", icon: Icon = null, unit = "" }: any) => (
    <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-wider">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
            <input 
                type={type} 
                step={step} 
                value={value} 
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)} 
                className={`input-field-alt ${Icon ? 'pl-9' : 'pl-3'}`} 
            />
            {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">{unit}</span>}
        </div>
    </div>
);

const LimitSpec = ({ label, val }: any) => (
    <div className="flex flex-col">
        <span className="text-[9px] text-slate-600 font-bold uppercase">{label}</span>
        <span className="text-xs font-mono text-slate-300">{val}</span>
    </div>
);

const ValidationCard = ({ label, val, limit, minLimit = 0, unit, invertedLimits = false }: any) => {
    let isExceeded = false;
    let isClose = false;

    if (invertedLimits) { // e.g., for shot vs barrel, we want it between min and max
        isExceeded = val < minLimit || val > limit;
        isClose = (val >= minLimit && val < minLimit + (limit - minLimit) * 0.1) || (val <= limit && val > limit - (limit - minLimit) * 0.1);
    } else { // standard limits, val should be <= limit
        isExceeded = limit > 0 && val > limit;
        isClose = limit > 0 && val > limit * 0.9 && val <= limit;
    }

    return (
        <div className={`p-4 rounded-xl border ${isExceeded ? 'bg-red-500/5 border-red-500/30' : isClose ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-slate-950/50 border-slate-800'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                {limit > 0 && (
                    <span className="text-[10px] text-slate-600 font-mono">
                        {invertedLimits ? `Range: ${minLimit}-${limit} ${unit}` : `Limit: ${limit} ${unit}`}
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between">
                <div className={`text-2xl font-mono font-black ${isExceeded ? 'text-red-500' : isClose ? 'text-yellow-500' : 'text-slate-100'}`}>
                    {val.toFixed(val > 100 ? 0 : 1)} <span className="text-sm font-bold text-slate-600">{unit}</span>
                </div>
                {limit > 0 && (
                    <div className="p-1.5 rounded-full">
                        {isExceeded ? <XCircle className="text-red-500" size={20}/> : isClose ? <AlertTriangle className="text-yellow-500" size={20}/> : <CheckCircle className="text-green-500" size={20}/>}
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultSummary = ({ label, value, warn = false, info = "" }: any) => (
    <div className="flex justify-between items-center py-1">
        <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase">{label}</span>
            {info && <span className="text-[9px] text-slate-600 italic">{info}</span>}
        </div>
        <span className={`text-sm font-mono font-bold ${warn ? 'text-red-400' : 'text-slate-200'}`}>{value}</span>
    </div>
);