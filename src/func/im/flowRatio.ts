/**
 * Calculates the Flow Path to Wall Thickness Ratio (L/T).
 * Indicates if a part can be filled.
 * @param flowLength - Longest flow path from gate to end of fill (mm)
 * @param wallThickness - Average or thinnest wall thickness (mm)
 * @returns - Ratio
 */
export default function calculateFlowRatio(flowLength: number, wallThickness: number): number {
    if (wallThickness <= 0) return 0;
    return flowLength / wallThickness;
}