/**
 * Calculates residence time in the barrel.
 * @param screwDiameter - Diameter of the screw (mm)
 * @param maxDosageVolume - Max dosage volume of machine (cm³) or Stroke (mm) - simplified to Barrel Cap here.
 *                        Actually, let's use: (Inventory Weight / Shot Weight) * Cycle Time
 *                        But usually calculated via Volume:
 *                        Inventory Volume = (Melt Cushion + Dosing Stroke) * Area? 
 *                        Standard formula: t = (V_barrel_inventory / V_shot) * t_cycle
 *                        Let's use a simplified approach:
 * @param shotWeight - Weight of one shot (g)
 * @param cycleTime - Cycle time (s)
 * @param barrelCapacity - Max barrel capacity (g) (often given in datasheet)
 * @param utilizationFactor - How full the barrel is (0-1). If unknown, assume inventory is roughly 2-3 shots.
 * 
 * Let's use the precise formula: Residence Time = (Barrel Inventory Weight / Shot Weight) * Cycle Time
 */
export default function calculateResidenceTime(
    barrelCapacityWeight: number, 
    shotWeight: number, 
    cycleTime: number
): number {
    if (shotWeight <= 0) return 0;
    // Assuming the barrel is fully utilized or calculating max residence time based on capacity
    // A better approximation for actual residence time is usually 2 to 3 * CycleTime if properly sized,
    // but here we calculate POTENTIAL residence time if full.
    // Let's refine: "Number of shots in barrel" * Cycle Time.
    
    const shotsInBarrel = barrelCapacityWeight / shotWeight;
    return shotsInBarrel * cycleTime;
}