/**
 * Calculates the volume of a sphere (ball).
 * @param radius - Radius of the sphere
 * @returns - Volume
 */
export default function sphereVolume(radius: number): number {
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
}