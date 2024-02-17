const axios = require('axios');

module.exports = {
  config: {
    name: 'taylor',
    version: '1.0',
    author: 'Liane',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: {
      en: `This AI is designed to emulate the charm and wit of Taylor Swift, offering a delightful conversation experience.`
    },
    longDescription: {
      en: `This AI is designed to emulate the charm and wit of Taylor Swift, offering a delightful conversation experience.`
    },
    guide: {
      en: '{pn}taylor [query]'
    },
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const query = args.join(" ") || "hello";
      const { name } = (await usersData.get(event.senderID));

      if (query) {
        api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
        const processingMessage = await api.sendMessage(
          `Asking Taylor Swift. Please wait a moment...`,
          event.threadID
        );

        const apiUrl = `https://lianeapi.onrender.com/@nealianacagara/api/taylor?key=j86bwkwo-8hako-12C&userName=${encodeURIComponent(name || "a user")}&query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
          const trimmedMessage = response.data.message.trim();
          api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
          await api.sendMessage({ body: trimmedMessage }, event.threadID, event.m