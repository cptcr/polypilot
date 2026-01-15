/**
 * Calculates required clamping force in kN.
 * @param projectedArea - Total projected area of all cavities (cm²)
 * @param specificInjectionPressure - Specific injection pressure (bar)
 * @returns - Clamping Force in kN
 */
export default function calculateClampingForce(projectedArea: number, specificInjectionPressure: number): number {
    // F (kN) = (A (cm²) * p (bar)) / 100
    // Usually we take mean cavity pressure which is lower than injection pressure, but for safety often injection pressure is used or a factor.
    // We will return the raw force.
    return (projectedArea * specificInjectionPressure) / 100;
}