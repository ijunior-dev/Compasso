// Tela de ativação de licença.

const LIC_KEY = 'compasso_license_v1';

const API_URL = '/api/validate-license';

function formatLicenseInput(val) {
  const clean = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 16);
  const parts = clean.match(/.{1,4}/g) || [];
  return parts.join('-');
}

async function activateLicense(key) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  });
  return res.json();
}

function showApp() {
  document.getElementById('license-gate').classList.add('hidden');
}

function initLicense() {
  const stored = localStorage.getItem(LIC_KEY);
  if (stored) { showApp(); return; }

  const gate  = document.getElementById('license-gate');
  const input = document.getElementById('lg-input');
  const btn   = document.getElementById('lg-btn');
  const msg   = document.getElementById('lg-msg');

  input.addEventListener('input', () => {
    input.value = formatLicenseInput(input.value);
    msg.textContent = '';
    msg.className = 'lg-msg';
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

  btn.addEventListener('click', async () => {
    const key = input.value.trim();
    if (key.length < 14) {
      msg.textContent = 'Digite a chave completa.';
      msg.className = 'lg-msg err';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Verificando…';
    msg.textContent = '';
    msg.className = 'lg-msg';

    try {
      const data = await activateLicense(key);
      if (data.valid) {
        localStorage.setItem(LIC_KEY, key);
        msg.textContent = data.message;
        msg.className = 'lg-msg ok';
        setTimeout(showApp, 800);
      } else {
        msg.textContent = data.message || 'Chave inválida.';
        msg.className = 'lg-msg err';
        btn.disabled = false;
        btn.textContent = 'Ativar Licença';
      }
    } catch {
      msg.textContent = 'Erro de conexão. Verifique sua internet.';
      msg.className = 'lg-msg err';
      btn.disabled = false;
      btn.textContent = 'Ativar Licença';
    }
  });
}

export { initLicense };
