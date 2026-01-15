/**
 * Calculates the dosing stroke (mm) required for a specific shot weight/volume.
 * @param shotWeight - Target shot weight (g)
 * @param density - Melt density (g/cm³)
 * @param screwDiameter - Screw diameter (mm)
 * @returns - Stroke in mm
 */
export default function calculateDosingStroke(shotWeight: number, density: number, screwDiameter: number): number {
    if (density <= 0 || screwDiameter <= 0) return 0;
    
    // Volume (cm³) = Weight / Density
    const volumeCm3 = shotWeight / density;
    
    // Volume (mm³) = Volume (cm³) * 1000
    const volumeMm3 = volumeCm3 * 1000;
    
    // Area (mm²) = pi * r² = pi * (d/2)²
    const radius = screwDiameter / 2;
    const area = Math.PI * radius * radius;
    
    // Stroke = Volume / Area
    return volumeMm3 / area;
}