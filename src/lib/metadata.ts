import * as cheerio from 'cheerio';
import { ExtractedMetadata, ContentType } from '@/types';

// SSRF Defense: Check whether hostname resolves or is a private/reserved address
function isPrivateOrReservedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // IPv4 regex check for private ranges
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);

    // 10.0.0.0/8
    if (octet1 === 10) return true;
    // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;
    // 192.168.0.0/16
    if (octet1 === 192 && octet2 === 168) return true;
    // 127.0.0.0/8
    if (octet1 === 127) return true;
    // 169.254.0.0/16 (Link local / AWS metadata)
    if (octet1 === 169 && octet2 === 254) return true;
    // 0.0.0.0/8
    if (octet1 === 0) return true;
  }

  return false;
}

// Extract YouTube Video ID
export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0];
    }
  } catch {
    // ignore
  }
  return null;
}

// Detect content type from domain and metadata
function detectContentType(url: string, title: string = '', desc: string = ''): ContentType {
  const lowerUrl = url.toLowerCase();
  const lowerText = `${title} ${desc}`.toLowerCase();

  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('vimeo.com')) {
    return 'youtube';
  }
  if (lowerUrl.includes('dribbble.com') || lowerUrl.includes('behance.net') || lowerUrl.includes('awwwards.com') || lowerUrl.includes('godly.website')) {
    return 'design';
  }
  if (lowerUrl.includes('github.com') || lowerUrl.includes('stackoverflow.com') || lowerUrl.includes('react.dev') || lowerUrl.includes('nextjs.org')) {
    return 'development';
  }
  if (lowerUrl.includes('openai.com') || lowerUrl.includes('anthropic.com') || lowerUrl.includes('midjourney.com') || lowerUrl.includes('huggingface.co')) {
    return 'ai_tools';
  }
  if (lowerText.includes('tutorial') || lowerText.includes('crash course') || lowerText.includes('guide') || lowerUrl.includes('learn')) {
    return 'tutorial';
  }
  if (lowerUrl.includes('medium.com') || lowerUrl.includes('dev.to') || lowerUrl.includes('blog') || lowerUrl.includes('article')) {
    return 'article';
  }
  if (lowerText.includes('inspiration') || lowerText.includes('showcase')) {
    return 'inspiration';
  }
  return 'website';
}

export async function fetchUrlMetadata(targetUrl: string): Promise<ExtractedMetadata> {
  let urlObj: URL;
  try {
    const cleanUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    urlObj = new URL(cleanUrl);
  } catch (e) {
    throw new Error('Invalid URL provided');
  }

  // SSRF Check: protocols must be http or https
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    throw new Error('Unsafe protocol rejected');
  }

  // SSRF Check: disallow private IP ranges or internal hostnames
  if (isPrivateOrReservedHost(urlObj.hostname)) {
    throw new Error('Access to private or local network resources is restricted');
  }

  const domain = urlObj.hostname.replace(/^www\./, '');
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  // Check for YouTube specific handling
  const ytId = extractYouTubeId(targetUrl);
  if (ytId) {
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (oembedRes.ok) {
        const ytData = await oembedRes.json();
        return {
          url: targetUrl,
          domain: 'youtube.com',
          title: ytData.title || 'YouTube Video',
          description: `By ${ytData.author_name || 'YouTube Creator'}`,
          thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
          faviconUrl: googleFavicon,
          contentType: 'youtube',
          author: ytData.author_name,
        };
      }
    } catch {
      // fallback to standard scraping or default yt thumbnail
      return {
        url: targetUrl,
        domain: 'youtube.com',
        title: 'YouTube Video',
        description: 'Watch on YouTube',
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        faviconUrl: googleFavicon,
        contentType: 'youtube',
      };
    }
  }

  // General Web Page Scraping
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(urlObj.href, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LinkVault/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const contentTypeHeader = response.headers.get('content-type') || '';
    if (!contentTypeHeader.includes('text/html') && !contentTypeHeader.includes('application/xhtml+xml')) {
      // Non-HTML content (e.g. image, pdf, json)
      return {
        url: targetUrl,
        domain,
        title: domain,
        description: `Resource at ${domain}`,
        thumbnailUrl: '',
        faviconUrl: googleFavicon,
        contentType: 'website',
      };
    }

    // Limit read size to 1MB to prevent memory exhaustion
    const reader = response.body?.getReader();
    let html = '';
    let totalBytes = 0;
    const maxBytes = 1024 * 1024; // 1MB

    if (reader) {
      const decoder = new TextDecoder('utf-8');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        html += decoder.decode(value, { stream: true });
        if (totalBytes >= maxBytes) {
          reader.cancel();
          break;
        }
      }
    } else {
      html = await response.text();
    }

    const $ = cheerio.load(html);

    // Extract Title
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');
    const docTitle = $('title').first().text();
    const title = (ogTitle || twitterTitle || docTitle || domain).trim();

    // Extract Description
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const twitterDesc = $('meta[name="twitter:description"]').attr('content');
    const metaDesc = $('meta[name="description"]').attr('content');
    const description = (ogDesc || twitterDesc || metaDesc || `Explore ${domain}`).trim();

    // Extract Thumbnail / Image
    let ogImage =
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') ||
      '';

    // Normalize relative image URLs
    if (ogImage && !ogImage.startsWith('http')) {
      try {
        ogImage = new URL(ogImage, urlObj.origin).href;
      } catch {
        ogImage = '';
      }
    }

    // Extract Favicon
    let favicon =
      $('link[rel="icon"][sizes="32x32"]').attr('href') ||
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '';

    if (favicon && !favicon.startsWith('http')) {
      try {
        favicon = new URL(favicon, urlObj.origin).href;
      } catch {
        favicon = googleFavicon;
      }
    } else if (!favicon) {
      favicon = googleFavicon;
    }

    const contentType = detectContentType(targetUrl, title, description);

    return {
      url: targetUrl,
      domain,
      title: title || domain,
      description: description || `Resource from ${domain}`,
      thumbnailUrl: ogImage,
      faviconUrl: favicon,
      contentType,
    };
  } catch (error) {
    // Graceful fallback if website has anti-bot, timeout, or block
    return {
      url: targetUrl,
      domain,
      title: domain,
      description: `Saved resource from ${domain}`,
      thumbnailUrl: '',
      faviconUrl: googleFavicon,
      contentType: detectContentType(targetUrl),
    };
  }
}
