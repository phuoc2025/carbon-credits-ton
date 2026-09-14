"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCTPayload = parseCTPayload;
function parseCTPayload(packet, wallet) {
    return {
        walletAddress: wallet,
        streamType: 'CT_CLAMP',
        inverterSN: `CT_${packet.deviceId}`,
        kwhRecorded: packet.accumulatedKwh,
        cycleDate: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        metadata: { hardwareSignature: packet.signature }
    };
}
