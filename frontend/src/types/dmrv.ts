// src/types/dmrv.ts
export type DMRVStreamType = 'LIVE_API' | 'AI_OCR' | 'CT_CLAMP' | 'ENTERPRISE_SCADA';

export interface DMRVInputPayload {
  walletAddress: string;          // Địa chỉ ví Tonkeeper (UQ...)
  streamType: DMRVStreamType;     // Phân loại luồng đầu vào
  inverterSN: string;             // Mã Serial Number máy Inverter / Meter (Bắt buộc)
  loggerSN?: string;              // Mã Logger / Datalogger (nếu có)
  kwhRecorded: number;            // Sản lượng phát thực tế trong chu kỳ (kWh)
  cycleDate: string;              // Ngày ghi nhận (YYYY-MM-DD)
  timestamp: number;              // Thời gian gửi dữ liệu (Epoch ms)
  metadata: {
    gpsLocation?: { lat: number; lng: number }; // Tọa độ vị trí (cho OCR & Weather Cross-check)
    proofUri?: string;            // Link lưu ảnh xác minh (IPFS / Cloud Storage)
    apiVendor?: string;           // Tên nhà cung cấp API (Solarman, Deye, Huawei...)
    hardwareSignature?: string;   // Chữ ký mã hóa từ HNSM Smart CT Clamp
  };
}