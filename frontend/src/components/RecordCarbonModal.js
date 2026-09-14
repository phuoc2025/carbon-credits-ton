"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecordCarbonModal;
exports.default = RecordCarbonModal;
const react_1 = __importStar(require("react"));
function RecordCarbonModal({ isOpen, onClose, onSubmit }) {
    const [dmrvType, setDmrvType] = (0, react_1.useState)('ocr');
    const [filesCount, setFilesCount] = (0, react_1.useState)(1);
    if (!isOpen)
        return null;
    const handleSubmit = () => {
        if (dmrvType === 'ocr' && filesCount <= 0) {
            alert('⚠️ Vui lòng xác nhận số lượng ảnh minh chứng công tơ / Inverter trước khi chốt sổ!');
            return;
        }
        const totalKwh = filesCount > 0 ? filesCount * 50 : 100;
        onSubmit({
            dmrvType,
            filesCount,
            totalKwh
        });
    };
    return (<div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            fontFamily: 'sans-serif'
        }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '450px', textAlign: 'left' }}>
        <h3 style={{ marginTop: 0, textAlign: 'center', marginBottom: '20px' }}>Chốt Sổ Cuối Ngày (PV 0 kW)</h3>
        
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: '#334155' }}>Phương thức dMRV:</label>
        <select value={dmrvType} onChange={(e) => {
            setDmrvType(e.target.value);
            setFilesCount(1);
        }} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <option value="ocr">AI OCR (Tải album ảnh công tơ / Inverter)</option>
          <option value="api">Live API Batch Sync</option>
          <option value="ct">HNSM Smart CT Clamp Log</option>
          <option value="enterprise">Enterprise SCADA Daily Report</option>
        </select>

        {dmrvType === 'ocr' && (<div style={{ border: '2px dashed #cbd5e1', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', backgroundColor: '#f8fafc' }}>
            
            {/* Ẩn hoàn toàn input mặc định và thay bằng nút bấm tùy chỉnh để loại bỏ dòng "Không có tệp nào được chọn" */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'inline-block',
                backgroundColor: '#2563eb',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                📁 Chọn ảnh từ thiết bị
                <input type="file" multiple accept="image/*" onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    setFilesCount(e.target.files.length);
                }
            }} style={{ display: 'none' }}/>
              </label>
            </div>

            {/* Bảng điều khiển số lượng tệp trực quan, rõ ràng */}
            <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                📌 Xác nhận số lượng ảnh đã chọn:
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <button type="button" onClick={() => setFilesCount(prev => Math.max(1, prev - 1))} style={{ width: '36px', height: '36px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1e293b' }}>
                  -
                </button>
                
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', minWidth: '40px', textAlign: 'center' }}>
                  {filesCount}
                </span>

                <button type="button" onClick={() => setFilesCount(prev => Math.min(10, prev + 1))} style={{ width: '36px', height: '36px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  +
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                (Bạn có thể chỉnh lại số lượng bằng nút + / - nếu cần).
              </p>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', lineHeight: '1.4', textAlign: 'left' }}>
              📸 <b>Lưu ý tải ảnh:</b> Chọn các hình chụp cuối ngày (lúc PV tắt, công suất về 0 kW):
              <br />• Chỉ số tổng kWh trên Inverter / Biến tần.
              <br />• Ảnh chụp đồng hồ công tơ điện.
            </p>
          </div>)}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} style={{ padding: '10px 16px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Hủy
          </button>
          <button onClick={handleSubmit} style={{
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
        }}>
            Chốt & Nhận Thưởng
          </button>
        </div>
      </div>
    </div>);
}
const useCarbonContract_1 = require("@/hooks/useCarbonContract"); // Đường dẫn tùy thuộc vào cấu trúc thư mục của bạn
function RecordCarbonModal({ isOpen, onClose, onSubmit }) {
    // 1. Gọi hook vừa tạo
    const { claimRewardOnChain } = (0, useCarbonContract_1.useCarbonContract)();
    const handleSubmit = async () => {
        // ... các logic kiểm tra cũ của bạn ...
        const totalKwh = filesCount > 0 ? filesCount * 50 : 100;
        // 2. Gọi hàm gửi giao dịch lên Smart Contract
        await claimRewardOnChain(totalKwh);
        // 3. Sau khi gọi ví xong thì gọi tiếp hàm onSubmit cũ để cập nhật UI nếu muốn
        onSubmit({
            dmrvType,
            filesCount,
            totalKwh
        });
    };
    // ... phần giao diện return bên dưới giữ nguyên ...
}
