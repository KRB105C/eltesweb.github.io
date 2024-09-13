import http from 'http';
import axios from 'axios';

export async function GET(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
  
  if (!url) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'URL is required' }));
    return;
  }

  try {
    const response = await axios.get(url);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.data));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error occurred while fetching data' }));
  }
}