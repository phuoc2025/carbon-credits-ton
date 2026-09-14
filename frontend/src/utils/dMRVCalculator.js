"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCarbonReward = void 0;
const calculateCarbonReward = (kwh) => {
    const GRID_EMISSION_FACTOR = 0.72; // kg CO2 per kWh
    const SC_POINT_RATIO = 10; // 1 kWh = 10 SC Points
    return {
        co2ReducedKg: parseFloat((kwh * GRID_EMISSION_FACTOR).toFixed(2)),
        scPoints: Math.floor(kwh * SC_POINT_RATIO),
    };
};
exports.calculateCarbonReward = calculateCarbonReward;
