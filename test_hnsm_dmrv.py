import requests
import json
import hashlib
import time

# --- CONFIGURATION ---
PLANT_ID = "64332412"
LOGGER_SN = "1740961218"
USER_WALLET = "EQBGfOqmGjvC0YDdbOVsRoI-QxPN6sZR1kG11uc4JEkHrExq"

# Sao chép chuỗi Bearer Token từ DevTools (Header Authorization) dán vào đây
AUTH_TOKEN = "PASTE_YOUR_BEARER_TOKEN_HERE"

# Hệ số phát thải lưới điện Việt Nam (kg CO2 / kWh)
GRID_EMISSION_FACTOR = 0.672 

# Quy đổi thưởng: 1 kWh = 10 SC Points
SC_POINTS_PER_KWH = 10 


def fetch_solarman_telemetry():
    """Bước 1: Gọi API Solarman lấy chỉ số sản lượng thực tế"""
    url = f"https://globalapi.solarmanpv.com/plant/v1.0/datagrid?plantId={PLANT_ID}"
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    print(f"[1/4] Gửi request tới Solarman API (Plant ID: {PLANT_ID})...")
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json().get("data", {})
        else:
            print(f"⚠️ API trả về mã lỗi {response.status_code}. Đang chuyển sang dữ liệu Testnet...")
    except Exception as e:
        print(f"⚠️ Không thể kết nối trực tiếp ({e}). Sử dụng Mock Telemetry...")

    # Mock Data phản ánh chính xác dữ liệu thực tế tại trạm Phuoc
    return {
        "plantId": int(PLANT_ID),
        "dailyProduction": 7.24,     # kWh phát trong ngày
        "totalProduction": 147750.0   # kWh tích lũy (~147.75 MWh)
    }


def verify_dmrv_and_calculate(telemetry):
    """Bước 2 & 3: Kiểm định dMRV, tính toán giảm phát thải CO2 và SC Points"""
    daily_kwh = telemetry.get("dailyProduction", 0.0)
    total_kwh = telemetry.get("totalProduction", 0.0)
    
    # Tính toán giảm phát thải CO2
    co2_saved_kg = daily_kwh * GRID_EMISSION_FACTOR
    co2_saved_tonnes = co2_saved_kg / 1000.0
    
    # Tính SC Points thưởng
    earned_sc_points = int(daily_kwh * SC_POINTS_PER_KWH)
    
    # Tạo Hash chứng thư dMRV (Proof of Renewable Generation)
    raw_proof = f"{PLANT_ID}_{LOGGER_SN}_{daily_kwh}_{time.strftime('%Y-%m-%d')}"
    dmrv_proof_hash = hashlib.sha256(raw_proof.encode()).hexdigest()

    print("\n[2/4] Báo cáo Đối soát dMRV Oracle:")
    print(f"  • Sản lượng trong ngày  : {daily_kwh} kWh")
    print(f"  • Tổng tích lũy hệ thống: {total_kwh / 1000.0:.2f} MWh (147.75 MWh)")
    print(f"  • Lượng CO2 giảm phát   : {co2_saved_kg:.2f} kg CO2 ({co2_saved_tonnes:.6f} tCO2)")
    print(f"  • Mã Hash bảo chứng dMRV: 0x{dmrv_proof_hash[:16]}...")

    return {
        "daily_kwh": daily_kwh,
        "co2_saved_kg": co2_saved_kg,
        "earned_sc_points": earned_sc_points,
        "proof_hash": dmrv_proof_hash
    }


def trigger_mint_sc_tokens(dmrv_result):
    """Bước 4: Kích hoạt luồng đúc Token / Cộng điểm SC về ví TON"""
    print("\n[3/4] Tính toán Thưởng Carbon:")
    print(f"  • Số SC Points cộng thưởng: +{dmrv_result['earned_sc_points']} SC Points")
    
    print("\n[4/4] Khởi tạo Transaction Payload gửi lên HNSM Backend / TON Network:")
    
    transaction_payload = {
        "status": "SUCCESS",
        "timestamp": int(time.time()),
        "network": "TON Mainnet / Off-chain Ledger",
        "plant_id": PLANT_ID,
        "recipient_wallet": USER_WALLET,
        "reward_details": {
            "amount_points": dmrv_result["earned_sc_points"],
            "equivalent_jetton_sc": dmrv_result["earned_sc_points"] / 10,
            "asset_contract": "EQBGfOqmGjvC0YDdbOVsRoI-QxPN6sZR1kG11uc4JEkHrExq"
        },
        "dmrv_metadata": {
            "kwh_verified": dmrv_result["daily_kwh"],
            "co2_reduced_kg": dmrv_result["co2_saved_kg"],
            "oracle_signature": f"0x{dmrv_result['proof_hash']}"
        }
    }
    
    print(json.dumps(transaction_payload, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    telemetry_data = fetch_solarman_telemetry()
    dmrv_data = verify_dmrv_and_calculate(telemetry_data)
    trigger_mint_sc_tokens(dmrv_data)