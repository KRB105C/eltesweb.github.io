import express from 'express';
import ytdl from 'ytdl-core';
import TikTokScraper from 'tiktok-scraper';
import Instagram from 'instagram-scraper-api';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// YouTube Video Downloader
app.get('/download/youtube', async (req, res) => {
    const url = req.query.url;
    if (!ytdl.validateURL(url)) {
        return res.status(400).send("Invalid YouTube URL");
    }

    const videoInfo = await ytdl.getInfo(url);
    res.header('Content-Disposition', `attachment; filename="${videoInfo.videoDetails.title}.mp4"`);
    ytdl(url).pipe(res);
});

// TikTok Video Downloader
app.get('/download/tiktok', async (req, res) => {
    const url = req.query.url;
    try {
        const videoMeta = await TikTokScraper.getVideoMeta(url);
        res.redirect(videoMeta.collector[0].videoUrl);
    } catch (error) {
        res.status(400).send("Failed to download TikTok video");
    }
});

// Instagram Video Downloader
app.get('/download/instagram', async (req, res) => {
    const url = req.query.url;
    try {
        const media = await Instagram.getMedia(url);
        res.redirect(media.media_url);
    } catch (error) {
        res.status(400).send("Failed to download Instagram content");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});