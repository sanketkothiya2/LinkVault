import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { format, data } = await req.json();

    if (format === 'csv') {
      if (!Array.isArray(data) || data.length === 0) {
        return new NextResponse('url,title,domain,contentType,isFavorite,createdAt\n', {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="linkvault-resources.csv"',
          },
        });
      }

      const headers = ['id', 'title', 'url', 'domain', 'contentType', 'isFavorite', 'viewCount', 'createdAt'];
      const rows = data.map((item: any) =>
        headers
          .map((h) => {
            const val = item[h] !== undefined ? String(item[h]).replace(/"/g, '""') : '';
            return `"${val}"`;
          })
          .join(',')
      );

      const csvContent = [headers.join(','), ...rows].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="linkvault-resources.csv"',
        },
      });
    }

    // Default JSON
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="linkvault-backup.json"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Export failed' }, { status: 500 });
  }
}
