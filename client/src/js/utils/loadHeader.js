// loadHeader.js
export default async function loadHeader() {
  const headerEl = document.getElementById('header');
  if (!headerEl) return;

  const res = await fetch('/src/components/header.html');
  const html = await res.text();
  headerEl.innerHTML = html;
}
