/**
 * Calculates the cooling time (simplified).
 * @param wallThickness - Part wall thickness (mm)
 * @param thermalDiffusivity - Material thermal diffusivity (mm²/s) (approx 0.1 for general plastics if unknown)
 * @param meltTemp - Melt temperature (°C)
 * @param moldTemp - Mold temperature (°C)
 * @param ejectTemp - Ejection temperature (°C)
 * @returns - Cooling time in seconds
 */
export default function calculateCoolingTime(
    wallThickness: number,
    thermalDiffusivity: number,
    meltTemp: number,
    moldTemp: number,
    ejectTemp: number
): number {
    // Formula: t = (s^2 / (pi^2 * a)) * ln( (4/pi) * ( (Tm - Tw) / (Te - Tw) ) )
    // s = thickness, a = diffusivity
    if (thermalDiffusivity <= 0) return 0;
    
    const factor1 = (Math.pow(wallThickness, 2)) / (Math.PI * Math.PI * thermalDiffusivity);
    
    const numerator = meltTemp - moldTemp;
    const denominator = ejectTemp - moldTemp;
    
    if (denominator === 0 || numerator / denominator <= 0) return 0;

    const factor2 = Math.log((4 / Math.PI) * (numerator / denominator));
    
    return Math.max(0, factor1 * factor2);
}