import { beginCell, Address, toNano } from '@ton/core';
import { useTonConnectUI } from '@tonconnect/ui-react';

export function useCarbonContract() {
  const [tonConnectUI] = useTonConnectUI();

  const claimRewardOnChain = async (totalKwh: number) => {
    // Quy đổi kWh ra số điểm thưởng (ví dụ: 1 kWh = 1 token/point nhỏ nhất)
    const pointsToMint = totalKwh * 10; 

    // Địa chỉ Smart Contract của bạn trên Testnet
    const contractAddress = "EQC...YourSmartContractAddressHere"; 

    // Tạo Body message gửi lên contract theo chuẩn Tact/FunC
    const body = beginCell()
      .storeUint(0x12345678, 32) // Opcode tượng trưng cho hàm nhận thưởng
      .storeCoins(toNano(pointsToMint))
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
    } catch (error) {
      console.error("Lỗi giao dịch:", error);
      alert("❌ Giao dịch thất bại hoặc bị hủy.");
    }
  };

  return { claimRewardOnChain };
}