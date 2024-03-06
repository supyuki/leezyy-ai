const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchTikTokVideos(keyword) {
  try {
    const response = await axios.get(`https://tiktok-0woq.onrender.com/kshitiz?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "tiktok",
    aliases: [],
    author: "kshitiz au (modified by CLYDE JVSK)",  // Updated author information
    version: "1.1",  // Updated version number
    shortDescription: {
      en: "Play TikTok video",
    },
    longDescription: {
      en: "Play a random TikTok video based on the provided keyword",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [keyword]",
    },
  },
  onStart: async function ({ api, event, args }) {
    const keyword = args.join(' ');

    if (!keyword) {
      api.sendMessage({ body: 'Please provide a keyword.\nExample: {p}tiktok dance' }, event.threadID);
      return;
    }

    const videos = await fetchTikTokVideos(keyword);

    if (!videos || videos.length === 0) {
      api.sendMessage({ body: `No TikTok videos found for the keyword: ${keyword}.` }, event.threadID, event.messageID);
      return;
    }

    // Choose a random video from the fetched list
    const randomIndex = Math.floor(Math.random() * videos.length);
    const selectedVideo = videos[randomIndex];
    const videoUrl = selectedVideo.videoUrl;

    if (!videoUrl) {
      api.sendMessage({ body: 'Error: Video not found.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const videoStream = await getStreamFromURL(videoUrl);

      await api.sendMessage({
        body: `Here is your TikTok video:`,
        attachment: videoStream,
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID, event.messageID);
    }
  },
  onReply: async function ({ api, event, Reply, args }) {
    // ... (unchanged code)
  },
};