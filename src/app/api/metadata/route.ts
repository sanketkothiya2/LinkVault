import { NextRequest, NextResponse } from 'next/server';
import { fetchUrlMetadata } from '@/lib/metadata';
import { isValidUrl } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing "url" query parameter' }, { status: 400 });
    }

    if (!isValidUrl(targetUrl)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const metadata = await fetchUrlMetadata(targetUrl);
    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to extract website metadata' },
      { status: 500 }
    );
  }
}
