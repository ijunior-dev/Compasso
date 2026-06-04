const { createClient } = require('@supabase/supabase-js');

const SUPA_URL = process.env.SUPABASE_URL || '';
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY || '';

console.log('SUPABASE_URL configured:', SUPA_URL ? SUPA_URL.slice(0, 30) + '...' : 'MISSING');
console.log('SUPABASE_KEY configured:', SUPA_KEY ? 'SET (length=' + SUPA_KEY.length + ')' : 'MISSING');

const supabase = createClient(SUPA_URL, SUPA_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key } = req.body || {};

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ valid: false, message: 'Chave inválida.' });
  }

  const normalizedKey = key.trim().toUpperCase();

  const { data, error } = await supabase
    .from('licenses')
    .select('id, status, email, activated_at')
    .eq('key', normalizedKey)
    .single();

  if (error || !data) {
    console.error('Supabase error:', JSON.stringify(error));
    return res.status(200).json({ valid: false, message: 'Chave não encontrada.', debug: error?.message });
  }

  if (data.status === 'revoked') {
    return res.status(200).json({ valid: false, message: 'Licença revogada. Entre em contato com o suporte.' });
  }

  if (data.status === 'pending') {
    // Primeira ativação — marca como ativa
    await supabase
      .from('licenses')
      .update({ status: 'active', activated_at: new Date().toISOString() })
      .eq('id', data.id);
  }

  return res.status(200).json({ valid: true, message: 'Licença ativada com sucesso!' });
};
