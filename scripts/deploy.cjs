require('dotenv').config();
const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');
const { CarbonRewards } = require('../build/CarbonRewards/carbon_rewards_CarbonRewards');

async function main() {
    const client = new TonClient({
        endpoint: 'https://ton-testnet.drpc.org',
    });

    console.log("Đã kết nối thành công với TON Testnet qua dRPC.");

    const mnemonic = (process.env.MNEMONIC || "").split(" ");
    const key = await mnemonicToPrivateKey(mnemonic);

    const workchain = 0;
    const wallet = WalletContractV4.create({ workchain, publicKey: key.publicKey });
    const contractClient = client.open(wallet);

    // Khởi tạo contract thông qua hàm init tiêu chuẩn của Tact
    const init = await CarbonRewards.init();
    const carbonRewards = client.open(CarbonRewards.fromInit());

    console.log("Địa chỉ Contract định nghĩa chuẩn:", carbonRewards.address.toString());
}

main().catch(console.error);
