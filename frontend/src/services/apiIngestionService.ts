// src/services/apiIngestionService.ts
import { DMRVInputPayload } from '../types/dmrv';
// Định nghĩa tạm các hằng số nếu chưa có
const VENDOR_ENDPOINTS: Record<string, string> = {
  solarman: 'https://api.solarmanpv.com/v1',
  deye: 'https://api.deye.com/v1',
  huawei: 'https://api.huawei.com/v1'
};
const getUserWallet = () => 'UQ_DEFAULT_WALLET_ADDRESS';
export async function syncLiveApiPlant(vendor: string, plantId: string, apiToken: string): Promise<DMRVInputPayload> {
  // 1. Gọi API của đối tác (ví dụ: Solarman Open API)
  const response = await fetch(`${VENDOR_ENDPOINTS[vendor]}/plant/daily-energy?plantId=${plantId}`, {
    headers: { Authorization: `Bearer ${apiToken}` }
  });
  const data = await response.json();

  // 2. Chuẩn hóa về Payload HNSM
  return {
    walletAddress: getUserWallet(),
    streamType: 'LIVE_API',
    inverterSN: data.inverter_sn,
    loggerSN: data.logger_sn,
    kwhRecorded: data.today_kwh,
    cycleDate: data.date_string,
    timestamp: Date.now(),
    metadata: { apiVendor: vendor }
  };
}