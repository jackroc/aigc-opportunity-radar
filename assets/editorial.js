// Editorial pages remain readable without scripts. Only the saved colour
// preference is progressive enhancement; no model or session is initialized.
try {
  const theme = localStorage.getItem('opportunity-theme');
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch { /* Browser storage is optional. */ }
