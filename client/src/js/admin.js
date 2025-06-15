// client/src/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const bookingsTableBody = document.getElementById('bookingsTableBody');
  const errorContainer = document.getElementById('adminError');
  const statusFilter = document.getElementById('statusSort');

  console.log("🧪 Loaded Token:", token);
  console.log("🧪 Loaded Role:", role);

  if (!token || role !== 'admin') {
    if (errorContainer) {
      errorContainer.textContent = 'Access denied. Admins only.';
      errorContainer.style.display = 'block';
    }
    return;
  }

  async function fetchBookings() {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch bookings');
      const bookings = await res.json();
      console.log("📦 Bookings fetched:", bookings);
      renderBookings(bookings);
    } catch (err) {
      console.error('❌ Admin error:', err);
      if (errorContainer) {
        errorContainer.textContent = 'Error loading bookings.';
        errorContainer.style.display = 'block';
      }
    }
  }

  function renderBookings(bookings) {
    const filter = statusFilter?.value || 'all';
    bookingsTableBody.innerHTML = '';

    const filtered = filter === 'all'
      ? bookings
      : bookings.filter(b => b.status === filter);

    if (filtered.length === 0) {
      bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
      return;
    }

    filtered.forEach(b => {
      const row = document.createElement('tr');
      const formattedDate = new Date(b.date).toLocaleDateString();
      const user = b.user?.username || 'N/A';
      const sessionType = b.sessionType || '—';
      const location = b.location || '—';
      const time = b.time || '—';
      const statusOptions = ['pending', 'approved', 'cancelled'].map(s =>
        `<option value="${s}" ${b.status === s ? 'selected' : ''}>${s}</option>`
      ).join('');

      row.innerHTML = `
        <td>${user}</td>
        <td>${sessionType}</td>
        <td>${formattedDate}</td>
        <td>${time}</td>
        <td>${location}</td>
        <td>${b.status}</td>
        <td>
          <select class="status-dropdown" data-id="${b._id}">
            ${statusOptions}
          </select>
        </td>
      `;

      bookingsTableBody.appendChild(row);
    });

    attachStatusHandlers();
  }

  function attachStatusHandlers() {
    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', async (e) => {
        const bookingId = e.target.dataset.id;
        const newStatus = e.target.value;

        try {
          await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
          });
          fetchBookings(); // Refresh after update
        } catch (err) {
          alert('Failed to update booking status.');
          console.error(err);
        }
      });
    });
  }

  // Initial load and filter change handling
  fetchBookings();
  if (statusFilter) {
    statusFilter.addEventListener('change', fetchBookings);
  }
});
