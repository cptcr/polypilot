/**
 * Calculates the peripheral speed of the screw (m/s).
 * Critical for shear sensitive materials.
 * @param diameter - Screw diameter (mm)
 * @param rpm - Screw speed (min⁻¹)
 * @returns - Peripheral speed in m/s
 */
export default function calculateScrewSpeed(diameter: number, rpm: number): number {
    // v = (d * pi * n) / (60 * 1000)
    return (diameter * Math.PI * rpm) / 60000;
}