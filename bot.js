const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ✅ حط التوكن الجديد هنا
const token = '8555592065:AAH0TaIhPe2GKcHGYMQu2A4seO55ijSrsqk';

// إنشاء البوت
const bot = new TelegramBot(token, { polling: true });

// عند كتابة /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 أهلاً بيك في بوت سعد للتحميل من TikTok 🎵

📩 أرسل أي رابط فيديو من تيكتوك وسأحمّله لك فورًا بدون العلامة المائية ✅`
  );
});

// استقبال الرسائل
bot.on('message', async (msg) => {
  const url = msg.text?.trim();

  // تجاهل أوامر مثل /start
  if (!url || url.startsWith('/')) return;

  // إرسال رسالة مؤقتة للمستخدم
  const waitingMsg = await bot.sendMessage(msg.chat.id, '⏳ جاري معالجة الرابط...');

  try {
    // نستخدم API مستقر وسريع جدًا
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;//APIs
    const { data } = await axios.get(api);

    if (data && data.data && data.data.play) {
      const videoUrl = data.data.play;

      // إرسال الفيديو مباشرة للمستخدم
      await bot.sendVideo(msg.chat.id, videoUrl, {
        caption: '✅ تم تحميل الفيديو بنجاح!',
      });

      // حذف رسالة "جاري المعالجة" بعد النجاح
      bot.deleteMessage(msg.chat.id, waitingMsg.message_id);
    } else {
      await bot.editMessageText('⚠️ لم أستطع تحميل الفيديو. تأكد من الرابط.', {
        chat_id: msg.chat.id,
        message_id: waitingMsg.message_id,
      });
    }
  } catch (err) {
    console.error('❌ خطأ:', err.message);
    await bot.editMessageText('⚠️ حدث خطأ أثناء التحميل. حاول لاحقًا.', {
      chat_id: msg.chat.id,
      message_id: waitingMsg.message_id,
    });
  }
});
