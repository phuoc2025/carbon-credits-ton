const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { toNano, beginCell, storeStateInit } = require('@ton/core');

const buildDir = path.join(__dirname, '../build/CarbonRewards');

if (!fs.existsSync(buildDir)) {
    console.error('❌ Thư mục build chưa tồn tại. Hãy chạy: npx tact --config tact.config.json');
    process.exit(1);
}

// 1. Tìm file wrapper .ts do Tact sinh ra
const files = fs.readdirSync(buildDir);
const tsWrapper = files.find(f => f.endsWith('.ts') && !f.endsWith('.spec.ts'));

if (!tsWrapper) {
    console.error('❌ Không tìm thấy file wrapper .ts trong build/CarbonRewards.');
    process.exit(1);
}

const tsPath = path.join(buildDir, tsWrapper);
const jsPath = tsPath.replace(/\.ts$/, '.js');

// 2. Biên dịch file .ts thành .js bằng esbuild tích hợp sẵn
execSync(`npx esbuild "${tsPath}" --outfile="${jsPath}" --format=cjs --platform=node`, { stdio: 'ignore' });

// 3. Nạp module wrapper đã được chuyển đổi
const wrapperModule = require(jsPath);
const CarbonRewards = wrapperModule.CarbonRewards;

async function main() {
    const carbonRewards = await CarbonRewards.fromInit();
    const address = carbonRewards.address.toString({ testOnly: true });

    // Đóng gói StateInit thành chuỗi Base64 URL-safe
    const stateInitCell = beginCell().store(storeStateInit(carbonRewards.init)).endCell();
    const stateInitB64 = stateInitCell.toBoc().toString('base64url');

    // Tạo liên kết chuyển giao dịch kèm StateInit trực tiếp đến ví Tonkeeper
    const tonLink = `ton://transfer/${address}?amount=${toNano('0.05')}&init=${stateInitB64}`;

    console.log('\n==================================================');
    console.log('🚀 CHUẨN BỊ DEPLOY CONTRACT LÊN TESTNET');
    console.log('==================================================');
    console.log('📍 Địa chỉ Contract mới:', address);
    console.log('\n🔗 COPY LINK NÀY VÀ MỞ BẰNG TONKEEPER (hoặc gửi qua Telegram Saved Messages rồi nhấp vào):');
    console.log(tonLink);
    console.log('==================================================\n');
}

main().catch(console.error);