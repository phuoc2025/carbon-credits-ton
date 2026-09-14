require('dotenv').config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error('Lỗi: Thiếu TELEGRAM_BOT_TOKEN trong file .env');
  process.exit(1);
}

const WEB_APP_URL = process.env.WEB_APP_URL || 'https://hnsm-carbon-rewards.vercel.app';
const API_URL = `https://api.telegram.org/bot${TOKEN}`;

let offset = 0;

// Xóa Webhook cũ để chạy Long Polling ổn định
async function deleteWebhook() {
  try {
    await fetch(`${API_URL}/deleteWebhook`);
  } catch (e) {
    console.error('Lỗi xóa Webhook:', e.message);
  }
}

async function sendMessage(chatId, firstName, referrerId) {
  const welcomeMessage = `👋 *Chào ${firstName}!* Chào mừng bạn đến với SCCe Rewards.\n` +
    (referrerId ? `🎁 Bạn nhận được lời mời từ thành viên #${referrerId}!\n\n` : '') +
    `Nhấn vào nút bên dưới để điểm danh hàng ngày và mở Mini App:`;

  const webAppUrlWithRef = referrerId 
    ? `${WEB_APP_URL}?ref=${referrerId}` 
    : WEB_APP_URL;

  try {
    await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeMessage,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Mở App & Nhận thưởng',
                web_app: { url: webAppUrlWithRef }
              }
            ]
          ]
        }
      })
    });
  } catch (err) {
    console.error('Lỗi gửi tin nhắn:', err.message);
  }
}

async function startBot() {
  await deleteWebhook();
  console.log('🤖 Bot SCCe Rewards đã khởi chạy thành công...');

  while (true) {
    try {
      const res = await fetch(`${API_URL}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const firstName = update.message.from.first_name || 'bạn';
            const text = update.message.text;

            if (text.startsWith('/start')) {
              const parts = text.split(' ');
              const referrerId = parts[1] ? parts[1].replace('ref_', '') : null;
              await sendMessage(chatId, firstName, referrerId);
            }
          }
        }
      }
    } catch (err) {
      console.error('Lỗi nhận tin nhắn:', err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startBot();