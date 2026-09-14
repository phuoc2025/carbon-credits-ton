"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCarbonContract = useCarbonContract;
const core_1 = require("@ton/core");
const ui_react_1 = require("@tonconnect/ui-react");
function useCarbonContract() {
    const [tonConnectUI] = (0, ui_react_1.useTonConnectUI)();
    const claimRewardOnChain = async (totalKwh) => {
        // Quy đổi kWh ra số điểm thưởng (ví dụ: 1 kWh = 1 token/point nhỏ nhất)
        const pointsToMint = totalKwh * 10;
        // Địa chỉ Smart Contract của bạn trên Testnet
        const contractAddress = "EQC...YourSmartContractAddressHere";
        // Tạo Body message gửi lên contract theo chuẩn Tact/FunC
        const body = (0, core_1.beginCell)()
            .storeUint(0x12345678, 32) // Opcode tượng trưng cho hàm nhận thưởng
            .storeCoins((0, core_1.toNano)(pointsToMint))
            .endCell();
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // Hết hạn trong 60 giây
            messages: [
                {
                    address: contractAddress,
                    amount: "50000000", // Phí gas tối thiểu (0.05 TON)
                    payload: body.toBoc().toString("base64"),
                }
            ]
        };
        try {
            const result = await tonConnectUI.sendTransaction(transaction);
            console.log("Giao dịch thành công:", result);
            alert("🎉 Gửi giao dịch lên Smart Contract TON thành công!");
        }
        catch (error) {
            console.error("Lỗi giao dịch:", error);
            alert("❌ Giao dịch thất bại hoặc bị hủy.");
        }
    };
    return { claimRewardOnChain };
}
