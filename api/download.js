import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // Ambil parameter URL dari query string
  const url = new URL(request.url).searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Ambil data dari URL Instagram
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error occurred while fetching data' }, { status: 500 });
  }
}