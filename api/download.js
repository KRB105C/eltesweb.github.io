
import { NextResponse } from 'next/server';
import axios from 'axios';

export default async function handler(req, res) {

export async function GET(request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Ambil data dari URL Instagram
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 });
  }
}