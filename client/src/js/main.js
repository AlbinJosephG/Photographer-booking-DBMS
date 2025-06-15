// client/src/js/main.js
function showToast(message, type = 'info') {
  let toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.right = '30px';
  toast.style.padding = '12px 20px';
  toast.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
  toast.style.color = 'white';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  toast.style.zIndex = '9999';
  toast.style.fontWeight = 'bold';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1800); // Hide after 1.8 seconds
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginError = document.getElementById('loginError');

  // Login form handling
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      loginError.textContent = '';
      loginError.style.display = 'none';

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          window.location.href = data.role === 'admin' ? 'admin.html' : 'index.html';
        } else {
          loginError.textContent = data.message || 'Invalid credentials';
          loginError.style.display = 'block';
        }
      } catch (err) {
        loginError.textContent = 'Server error. Please try again later.';
        loginError.style.display = 'block';
      }
    });
  }

  // Registration form handling
  if (registerForm) {
    const usernameInput = document.getElementById('regUsername');
    const feedback = document.getElementById('usernameFeedback');
    const registerBtn = registerForm.querySelector('button[type="submit"]');
    let debounceTimer;

    // Real-time username check
    usernameInput?.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const username = usernameInput.value.trim();

      feedback.textContent = '';
      feedback.style.color = '';
      registerBtn.disabled = false;

      if (username.length === 0) return;

      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/auth/check-username?username=${encodeURIComponent(username)}`);
          const data = await res.json();

          if (data.exists) {
            feedback.textContent = 'Username already exists';
            feedback.style.color = 'red';
            registerBtn.disabled = true;
          } else {
            feedback.textContent = 'Username available';
            feedback.style.color = 'green';
            registerBtn.disabled = false;
          }
        } catch (err) {
          feedback.textContent = 'Error checking username';
          feedback.style.color = 'red';
          registerBtn.disabled = false;
        }
      }, 400); // debounce delay
    });

    // Submit handler
    // Submit handler
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = document.getElementById('regPassword').value.trim();

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    let data = { message: 'Unknown error' };

    // Safely try to parse JSON only if response has JSON content type
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    }

    if (res.ok) {
  showToast('Registered successfully! Redirecting to login...', 'success');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000); // redirect after 2 seconds
}
 else {
      alert(`❌ ${data.message || 'Registration failed'}`);
    }
  } catch (err) {
    console.error('Registration error:', err);
    alert('❌ Server error. Please try again later.');
  }
});

}
});

