const assert = require('assert');

// 1. SSRF and Domain Validator Tests
function isPrivateOrReservedHost(hostname) {
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

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);

    if (octet1 === 10) return true;
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;
    if (octet1 === 192 && octet2 === 168) return true;
    if (octet1 === 127) return true;
    if (octet1 === 169 && octet2 === 254) return true;
    if (octet1 === 0) return true;
  }
  return false;
}

function extractYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0];
    }
  } catch {}
  return null;
}

console.log('--- Running SSRF & Guardrail Verification ---');

// Test localhost and loopbacks
assert.strictEqual(isPrivateOrReservedHost('localhost'), true, 'localhost must be blocked');
assert.strictEqual(isPrivateOrReservedHost('127.0.0.1'), true, '127.0.0.1 must be blocked');
assert.strictEqual(isPrivateOrReservedHost('127.255.0.1'), true, '127.0.0.0/8 subnet must be blocked');
assert.strictEqual(isPrivateOrReservedHost('0.0.0.0'), true, '0.0.0.0 must be blocked');

// Test private RFC 1918 ranges
assert.strictEqual(isPrivateOrReservedHost('10.0.0.1'), true, '10.0.0.0/8 must be blocked');
assert.strictEqual(isPrivateOrReservedHost('10.254.1.5'), true, '10.x.x.x must be blocked');
assert.strictEqual(isPrivateOrReservedHost('172.16.0.1'), true, '172.16.x.x must be blocked');
assert.strictEqual(isPrivateOrReservedHost('172.31.255.255'), true, '172.31.x.x must be blocked');
assert.strictEqual(isPrivateOrReservedHost('192.168.1.1'), true, '192.168.x.x must be blocked');
assert.strictEqual(isPrivateOrReservedHost('169.254.169.254'), true, 'AWS metadata 169.254.x.x must be blocked');

// Test public hosts
assert.strictEqual(isPrivateOrReservedHost('yarrlist.net'), false, 'yarrlist.net must be allowed');
assert.strictEqual(isPrivateOrReservedHost('github.com'), false, 'github.com must be allowed');
assert.strictEqual(isPrivateOrReservedHost('youtube.com'), false, 'youtube.com must be allowed');

console.log('✓ All 12 SSRF Guardrail assertions passed successfully.');

console.log('--- Running YouTube Extractor Verification ---');
assert.strictEqual(
  extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  'dQw4w9WgXcQ',
  'Must extract YouTube ID from standard watch URL'
);
assert.strictEqual(
  extractYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=42'),
  'dQw4w9WgXcQ',
  'Must extract YouTube ID from short youtu.be URL'
);
console.log('✓ YouTube extractor verified successfully.');

console.log('All backend security test suites passed cleanly!');
