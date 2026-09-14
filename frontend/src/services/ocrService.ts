// src/services/ocrService.ts
import { DMRVInputPayload } from '../types/dmrv';
import { createWorker } from 'tesseract.js';

export async function processOcrImage(file: File, gpsData?: { lat: number; lng: number }): Promise<Partial<DMRVInputPayload>> {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();

  // Trích xuất số kWh (Ví dụ: regex tìm mảng "Today 28.90 kWh")
  const kwhMatch = text.match(/(?:Today|E-Today|Ngày)[:\s]*([\d.]+)\s*kWh/i);
  const snMatch = text.match(/(?:SN|S\/N|Serial)[:\s]*([A-Z0-9]{8,16})/i);

  return {
    streamType: 'AI_OCR',
    kwhRecorded: kwhMatch ? parseFloat(kwhMatch[1]) : 0,
    inverterSN: snMatch ? snMatch[1] : 'UNKNOWN_SN',
    cycleDate: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    metadata: { gpsLocation: gpsData }
  };
}