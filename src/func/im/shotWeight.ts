/**
 * Calculates shot weight in grams.
 * @param volume - Total volume (cm³)
 * @param density - Material density (g/cm³)
 * @returns - Weight in grams
 */
export default function calculateShotWeight(volume: number, density: number): number {
    return volume * density;
}