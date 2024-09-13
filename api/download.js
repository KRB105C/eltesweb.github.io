import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // Ambil parameter URL dari query string
  const url = new URL(request.url).searchParams.get('url');
  
  // Jika tidak ada parameter URL, kembalikan error 400
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Ambil data dari URL Instagram menggunakan axios
    const response = await axios.get(url);
    
    // Kembalikan respons dengan data yang diambil
    return NextResponse.json(response.data);
  } catch (error) {
    // Kembalikan error 500 jika terjadi kesalahan saat mengambil data
    return NextResponse.json({ error: 'Error occurred while fetching data' }, { status: 500 });
  }
}