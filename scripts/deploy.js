"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const ton_1 = require("@ton/ton");
const crypto_1 = require("@ton/crypto");
const carbon_rewards_tact_CarbonRewards_1 = require("../contracts/carbon_rewards.tact_CarbonRewards");

async function main() {
    const apiKey = process.env.TONCENTER_API_KEY;
    if (!apiKey) {
        console.error("❌ Lỗi: Thiếu biến TONCENTER_API_KEY trong file .env");
        process.exit(1);
    }

    const client = new ton_1.TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: apiKey,
    });

    // Lấy chuỗi Mnemonic từ file .env
    const mnemonicStr = process.env.MNEMONIC;
    if (!mnemonicStr) {
        console.error("❌ Lỗi: Thiếu biến MNEMONIC trong file .env");
        process.exit(1);
    }
    
    const key = await (0, crypto_1.mnemonicToPrivateKey)(mnemonicStr.trim().split(/\s+/));
    const wallet = ton_1.WalletContractV4.create({
        publicKey: key.publicKey,
        workchain: 0,
    });
    const senderWallet = client.open(wallet);
    const walletAddress = wallet.address.toString({ testOnly: true, bounceable: false });
    
    console.log("----------------------------------------");
    console.log("Deployer Wallet Address:", walletAddress);
    
    const balance = await client.getBalance(wallet.address);
    console.log("Wallet Balance:", (Number(balance) / 1e9).toFixed(4), "TON");
    
    if (balance === 0n) {
        console.error("❌ Số dư ví bằng 0 TON.");
        return;
    }

    // Khởi tạo Smart Contract gắn kèm owner là ví Deployer
    const carbonContract = client.open(await carbon_rewards_tact_CarbonRewards_1.CarbonRewards.fromInit(wallet.address));
    const contractAddress = carbonContract.address.toString({ testOnly: true });
    
    console.log("Deploying Contract to:", contractAddress);
    console.log("----------------------------------------");

    // Gửi giao dịch kích hoạt StateInit cho Contract
    await carbonContract.send(senderWallet.sender(key.secretKey), { value: (0, ton_1.toNano)("0.2") }, { $$type: "Deploy", queryId: 0n });
    
    console.log("🚀 Đã gửi giao dịch Deploy!");
    console.log("Đang chờ 15 giây để Blockchain khởi tạo Contract state...");
    await new Promise((resolve) => setTimeout(resolve, 15000));
    console.log("✅ Hoàn tất Deploy!");
}

main().catch(console.error);