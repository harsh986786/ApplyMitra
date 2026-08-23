export async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const allowedIds = process.env.TELEGRAM_ALLOWED_CHAT_IDS?.split(',') || [];

  if (!token || allowedIds.length === 0) {
    console.error('Telegram config missing in .env.local');
    return;
  }

  // Sirf aap dono ki IDs par loop chalega
  for (const chatId of allowedIds) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text: message,
          parse_mode: 'HTML',
        }),
      });
    } catch (error) {
      console.error(`Error sending to ${chatId}:`, error);
    }
  }
}