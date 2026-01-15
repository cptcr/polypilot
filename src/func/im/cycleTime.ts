/**
 * Calculates the estimated total cycle time for an injection molding process.
 *
 * @param injectionTime - The time it takes to inject the plastic into the mold (in seconds).
 * @param coolingTime - The time required for the part to cool down before ejection (in seconds).
 * @param moldOpenCloseTime - The time for the mold to open, eject the part, and close again (in seconds).
 * @returns The total estimated cycle time in seconds.
 */
export default function calculateCycleTime(
  injectionTime: number,
  coolingTime: number,
  moldOpenCloseTime: number
): number {
  if (injectionTime < 0 || coolingTime < 0 || moldOpenCloseTime < 0) {
    return 0;
  }
  return injectionTime + coolingTime + moldOpenCloseTime;
}
