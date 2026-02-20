/**
 * Dashboard Status Monitor
 * Mengambil dan menampilkan data status server dari API.
 */

const REFRESH_INTERVAL_MS = 60000; // Auto-refresh setiap 60 detik

/**
 * Update timestamp "Terakhir dicek" di footer
 */
function updateTimestamp() {
  const lastCheckedEl = document.getElementById('last-checked');
  if (!lastCheckedEl) return;

  const now = new Date();
  lastCheckedEl.textContent = `Terakhir dicek: ${now.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
  })}`;
}

/**
 * Ambil data status server dari API dan tampilkan di UI
 */
async function fetchServerData() {
  const uptimeElement = document.getElementById('uptime');
  const responseTimeElement = document.getElementById('response-time');
  const locationElement = document.getElementById('location');

  // Ambil monitor ID dari data attribute di <body>
  const monitorId = document.body.dataset.monitorId;

  if (!monitorId) {
    console.error('Monitor ID belum dikonfigurasi. Tambahkan data-monitor-id pada <body>.');
    if (uptimeElement) uptimeElement.textContent = 'Error: No ID';
    if (responseTimeElement) responseTimeElement.textContent = 'Error: No ID';
    if (locationElement) locationElement.textContent = 'Error: No ID';
    return;
  }

  // Tampilkan status 'memuat' saat proses fetch dimulai
  if (uptimeElement) uptimeElement.textContent = 'Memuat...';
  if (responseTimeElement) responseTimeElement.textContent = 'Memuat...';
  if (locationElement) locationElement.textContent = 'Memuat...';

  try {
    const response = await fetch(`/api/get-status?monitor=${encodeURIComponent(monitorId)}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Tampilkan data uptime
    if (uptimeElement && data.uptime) {
      uptimeElement.textContent = parseFloat(data.uptime).toFixed(3) + ' %';
    }

    // Tampilkan data response time
    if (responseTimeElement && data.average_response_time) {
      responseTimeElement.textContent = Math.round(data.average_response_time) + ' ms';
    }

    // Tampilkan data lokasi
    if (locationElement && data.location) {
      locationElement.textContent = data.location;
    }

    // Update timestamp setelah fetch berhasil
    updateTimestamp();
  } catch (error) {
    console.error('Gagal memuat status:', error);
    if (uptimeElement) uptimeElement.textContent = 'Gagal';
    if (responseTimeElement) responseTimeElement.textContent = 'Gagal';
    if (locationElement) locationElement.textContent = 'Gagal';
  }
}

/**
 * Inisialisasi saat halaman selesai dimuat
 */
document.addEventListener('DOMContentLoaded', () => {
  updateTimestamp();
  fetchServerData();

  // Auto-refresh data setiap interval
  setInterval(fetchServerData, REFRESH_INTERVAL_MS);
});
