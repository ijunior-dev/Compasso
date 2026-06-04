const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `CMPS-${segment()}-${segment()}-${segment()}`;
}

function verifyHotmartSignature(body, signature, secret) {
  if (!secret || !signature) return true; // pula verificação se não configurado
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return hmac === signature;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = JSON.stringify(req.body);
  const signature = req.headers['x-hotmart-hottok'] || '';

  if (!verifyHotmartSignature(rawBody, signature, process.env.HOTMART_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  const event = req.body?.event;
  const buyer = req.body?.data?.buyer;
  const transaction = req.body?.data?.purchase?.transaction;

  // Só processa compra aprovada
  if (event !== 'PURCHASE_APPROVED') {
    return res.status(200).json({ skipped: true });
  }

  const email = buyer?.email || null;
  const licenseKey = generateLicenseKey();

  const { error } = await supabase.from('licenses').insert({
    key: licenseKey,
    status: 'pending',
    email,
    hotmart_transaction: transaction || null,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Erro ao salvar licença' });
  }

  // Aqui você pode integrar envio de email (SendGrid, Resend, etc.)
  // Por ora a chave fica salva no banco — configure o email no painel Hotmart
  console.log(`Licença gerada: ${licenseKey} para ${email}`);

  return res.status(200).json({ ok: true, key: licenseKey });
};
