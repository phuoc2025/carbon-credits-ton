require('dotenv').config();
const { WalletContractV4, internal, toNano, TonClient } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');
const { CarbonRewards } = require('../build/CarbonRewards/carbon_rewards_CarbonRewards');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    // Khởi tạo TonClient trỏ đến Toncenter Testnet sử dụng API Key bảo mật từ file .env
    const client = new TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: process.env.TONCENTER_API_KEY
    });

    console.log("Đã kết nối thành công với TON Testnet qua Toncenter.");

    // Lấy chuỗi mnemonic từ biến môi trường
    const mnemonicWords = process.env.MNEMONIC || "";
    if (!mnemonicWords) {
        console.error("Lỗi: Thiếu biến MNEMONIC trong file .env");
        process.exit(1);
    }
    const mnemonic = mnemonicWords.trim().split(/\s+/);

    const key = await mnemonicToPrivateKey(mnemonic);
    const workchain = 0;
    const wallet = WalletContractV4.create({ workchain, publicKey: key.publicKey });
    const contractClient = client.open(wallet);

    await sleep(1500);

    try {
        const balance = await contractClient.getBalance();
        console.log("Số dư ví hiện tại:", Number(balance) / 1e9, "TON");
    } catch (e) {
        console.log("⚠️ Lưu ý: Ví chưa kích hoạt hoặc chưa có số dư trên blockchain, nhưng vẫn có thể tiến hành deploy nếu ví đã được nạp tiền qua Faucet.");
    }

    // Khởi tạo contract từ Tact
    const carbonRewards = client.open(await CarbonRewards.fromInit());
    console.log("Địa chỉ Contract cần deploy:", carbonRewards.address.toString());

    await sleep(1500);

    const seqno = await contractClient.getSeqno();
    console.log("Đang gửi giao dịch deploy lên Testnet...");

    await contractClient.sendTransfer({
        seqno,
        secretKey: key.secretKey,
        messages: [
            internal({
                to: carbonRewards.address,
                value: toNano('0.05'),
                init: carbonRewards.init,
                body: null,
            })
        ]
    });

    console.log("🚀 Đã phát lệnh deploy thành công! Hãy đợi vài giây để mạng lưới xác nhận.");
}

main().catch(console.error);