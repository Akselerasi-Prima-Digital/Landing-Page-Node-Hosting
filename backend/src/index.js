/**
 * Cloudflare Worker — Landing Page API (Multi-Server)
 *
 * Endpoint: GET /api/get-status?monitor=MONITOR_ID
 *
 * Environment Variables (set di wrangler.jsonc atau Cloudflare Dashboard):
 *   - HT_API_SERVER  : Base URL HetrixTools API (variable)
 *   - HT_API_KEY     : API Key HetrixTools (secret, set via `npx wrangler secret put HT_API_KEY`)
 *   - ALLOWED_ORIGIN : Origin yang diizinkan untuk CORS (default: '*')
 *                      Mendukung wildcard subdomain, contoh: '*.example.com'
 */

const CACHE_TTL_SECONDS = 60; // Cache response selama 60 detik

/**
 * Resolve CORS origin — mendukung wildcard subdomain (*.example.com)
 * Mencocokkan request Origin dengan pola yang diizinkan.
 */
function resolveOrigin(allowedPattern, requestOrigin) {
  if (!allowedPattern || allowedPattern === '*') return '*';
  if (!requestOrigin) return allowedPattern;

  // Wildcard subdomain: *.example.com
  if (allowedPattern.startsWith('*.')) {
    const baseDomain = allowedPattern.slice(2); // 'example.com'
    try {
      const originUrl = new URL(requestOrigin);
      // Cocokkan: hostname harus diakhiri '.example.com' atau sama persis 'example.com'
      if (
        originUrl.hostname === baseDomain ||
        originUrl.hostname.endsWith('.' + baseDomain)
      ) {
        return requestOrigin; // Kirim origin request yang cocok
      }
    } catch {
      // requestOrigin bukan URL valid, tolak
    }
    return ''; // Tidak cocok — browser akan blokir
  }

  // Exact match
  return requestOrigin === allowedPattern ? allowedPattern : '';
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get('Origin');
    const allowedOrigin = resolveOrigin(env.ALLOWED_ORIGIN, requestOrigin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(allowedOrigin);
    }

    const url = new URL(request.url);

    // Routing — hanya handle /api/get-status
    if (url.pathname === '/api/get-status') {
      return handleGetStatus(url, env, allowedOrigin);
    }

    return jsonResponse({ message: 'Not Found' }, 404, allowedOrigin);
  },
};

/**
 * Handler utama: ambil data monitor dari HetrixTools API (dengan caching)
 */
async function handleGetStatus(url, env, allowedOrigin) {
  // Ambil monitor ID dari query parameter
  const monitorId = url.searchParams.get('monitor');

  if (!monitorId) {
    return jsonResponse(
      { message: 'Parameter "monitor" wajib diisi. Contoh: /api/get-status?monitor=MONITOR_ID' },
      400,
      allowedOrigin,
    );
  }

  // Buat cache key berdasarkan monitor ID
  const cacheKey = new Request(`https://cache-internal/status/${monitorId}`, {
    method: 'GET',
  });
  const cache = caches.default;

  // Cek apakah ada response yang sudah di-cache
  let cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    // Kembalikan cached response dengan CORS headers yang benar
    const body = await cachedResponse.text();
    return new Response(body, {
      status: cachedResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    const apiServer = env.HT_API_SERVER;
    const apiKey = env.HT_API_KEY;

    if (!apiKey) {
      return jsonResponse(
        { message: 'HT_API_KEY belum dikonfigurasi. Jalankan: npx wrangler secret put HT_API_KEY' },
        500,
        allowedOrigin,
      );
    }

    // Request ke HetrixTools API
    const apiUrl = `${apiServer}/uptime-monitors?id=${encodeURIComponent(monitorId)}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return jsonResponse(
        { message: `HetrixTools API error: ${response.status}` },
        response.status >= 500 ? 502 : response.status,
        allowedOrigin,
      );
    }

    const data = await response.json();

    // Filter dan proses data
    const monitor = data.monitors?.[0];

    if (monitor && monitor.locations) {
      // 1. Ambil uptime dan lokasi server
      const uptime = monitor.uptime;
      const city = monitor.resolve_address_info?.City;
      const country = monitor.resolve_address_info?.Country;
      const serverLocation = city && country ? `${city}, ${country}` : 'Lokasi tidak diketahui';

      // 2. Kalkulasi rata-rata response time
      const locations = Object.values(monitor.locations);
      const totalResponseTime = locations.reduce((sum, loc) => sum + loc.response_time, 0);
      const averageResponseTime = locations.length > 0 ? totalResponseTime / locations.length : 0;

      // 3. Kirim data yang sudah difilter
      const filteredData = {
        uptime: uptime,
        average_response_time: averageResponseTime,
        location: serverLocation,
      };

      const jsonBody = JSON.stringify(filteredData);

      // Simpan ke cache dengan TTL
      const cacheableResponse = new Response(jsonBody, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `s-maxage=${CACHE_TTL_SECONDS}`,
        },
      });
      await cache.put(cacheKey, cacheableResponse);

      return new Response(jsonBody, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-Cache': 'MISS',
        },
      });
    } else {
      return jsonResponse({ message: 'Data monitor atau lokasi tidak ditemukan.' }, 404, allowedOrigin);
    }
  } catch (error) {
    console.error('Gagal mengambil data dari HetrixTools API:', error);
    return jsonResponse({ message: 'Gagal mengambil data dari HetrixTools API' }, 500, allowedOrigin);
  }
}

/**
 * Helper: buat JSON response dengan CORS headers
 */
function jsonResponse(data, status = 200, allowedOrigin = '*') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Helper: handle CORS preflight request
 */
function handleCORS(allowedOrigin = '*') {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
