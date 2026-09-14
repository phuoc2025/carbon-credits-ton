"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ton_1 = require("@ton/ton");
async function convertMain() {
    const client = new ton_1.TonClient({
        endpoint: 'https://ton-testnet.drpc.org',
    });
    console.log("Client chuyển đổi đã kết nối dRPC Testnet thành công.");
    // Thực hiện các logic convert hoặc kiểm tra dữ liệu chuỗi tại đây
}
convertMain().catch(console.error);
