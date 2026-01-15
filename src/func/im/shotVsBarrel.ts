/**
 * Calculates the ratio of the shot size to the total barrel capacity.
 * A value between 20% and 80% is generally recommended.
 *
 * @param shotVolume - The volume of the shot (in cm³).
 * @param barrelVolume - The total usable volume of the machine barrel (in cm³).
 * @returns The usage ratio as a percentage.
 */
export default function calculateShotVsBarrel(shotVolume: number, barrelVolume: number): number {
  if (shotVolume <= 0 || barrelVolume <= 0) {
    return 0;
  }
  return (shotVolume / barrelVolume) * 100;
}
