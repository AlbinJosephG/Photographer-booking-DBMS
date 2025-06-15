import loadHeader from './utils/loadHeader.js';
loadHeader();

const token = localStorage.getItem('token');
const API_BASE = 'http://localhost:5000';

let bookingsCache = [];

async function fetchBookings() {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    bookingsCache = await res.json();
    renderBookings(bookingsCache);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    document.getElementById('userBookings').innerHTML =
      '<tr><td colspan="5" class="no-results">❌ Failed to load bookings.</td></tr>';
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function renderBookings(bookings) {
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';

  const filtered = bookings.filter(
    b => statusFilter === 'all' || b.status === statusFilter
  );

  const container = document.getElementById('userBookings');

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" class="no-results">No bookings match your criteria.</td>
      </tr>`;
    return;
  }

  const rows = filtered.map(b => {
    const formattedDate = formatDate(b.date);
    const time = b.time || '—';
    return `
      <tr>
        <td>${b.sessionType}</td>
        <td>${b.location}</td>
        <td>${formattedDate}</td>
        <td>${time}</td>
        <td class="status ${b.status}">${b.status}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = rows;
}

// Filters
document.getElementById('statusFilter')?.addEventListener('change', () => {
  renderBookings(bookingsCache);
});

// Initial load
fetchBookings();





