/**
 * Calculates the volume of a cylinder.
 * @param radius - Radius of the base
 * @param height - Height of the cylinder
 * @returns - Volume
 */
export default function cylinderVolume(radius: number, height: number): number {
    return Math.PI * radius * radius * height;
}