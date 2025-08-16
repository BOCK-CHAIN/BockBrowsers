// --- Settings Page Logic ---

// Show a section and mark the corresponding button active
function showSection(id, button) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.sidebar button').forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });

  button.classList.add('active');
  button.setAttribute('aria-current', 'page');
}

// Filter sidebar menu buttons based on search
function filterMenu(query) {
  const lowerQuery = query.toLowerCase();
  document.querySelectorAll('.sidebar button').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    btn.style.display = text.includes(lowerQuery) ? 'flex' : 'none';
  });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('light-theme');
      themeToggle.setAttribute('aria-checked', 'true');
    } else {
      document.body.classList.remove('light-theme');
      themeToggle.setAttribute('aria-checked', 'false');
    }
  });
}

// Reset all settings to default
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    document.querySelectorAll('form').forEach(form => form.reset());
    if (themeToggle) {
      themeToggle.checked = false;
      document.body.classList.remove('light-theme');
      themeToggle.setAttribute('aria-checked', 'false');
    }
    alert('Settings have been reset.');
  }
}

// Navigate back to home/index.html
function goHome() {
  if (window.electronAPI && window.electronAPI.navigateTo) {
    window.electronAPI.navigateTo('home');
  } else {
    console.warn('Electron API navigateTo not available');
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
// Sidebar button click handling
  document.querySelectorAll('.sidebar button[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      showSection(sectionId, btn);
    });
  });
});
