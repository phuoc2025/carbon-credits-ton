// src/services/ctClampService.ts
import { DMRVInputPayload } from '../types/dmrv';
export interface CTClampPacket {
  device_sn: string;
  total_kwh: number;
  timestamp: number;
  signature: string;
}
export interface CTClampPacket {
  deviceId: string;       // S/N của thiết bị CT Clamp
  accumulatedKwh: number; // Tổng sản lượng đếm được
  signature: string;      // Chữ ký điện tử HMAC-SHA256 từ phần cứng
}

export function parseCTPayload(packet: CTClampPacket, wallet: string): DMRVInputPayload {
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