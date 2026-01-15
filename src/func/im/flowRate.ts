/**
 * Calculates the volumetric flow rate of the plastic into the mold.
 *
 * @param shotVolume - The volume of the shot (in cm³).
 * @param injectionTime - The time it takes to inject the plastic (in seconds).
 * @returns The flow rate in cm³/s.
 */
export default function calculateFlowRate(shotVolume: number, injectionTime: number): number {
  if (shotVolume <= 0 || injectionTime <= 0) {
    return 0;
  }
  return shotVolume / injectionTime;
}
