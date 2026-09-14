export const calculateCarbonReward = (kwh: number) => {
  const GRID_EMISSION_FACTOR = 0.72; // kg CO2 per kWh
  const SC_POINT_RATIO = 10; // 1 kWh = 10 SC Points

  return {
    co2ReducedKg: parseFloat((kwh * GRID_EMISSION_FACTOR).toFixed(2)),
    scPoints: Math.floor(kwh * SC_POINT_RATIO),
  };
};