/**
 * Calculates the area of a circle.
 * @param radius - Radius of the circle
 * @returns - Total area of the circle
*/

export default async function calculateCircleArea(radius: number): Promise<number> {
    return Math.PI * radius * radius;
}