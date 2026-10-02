const { createClient } = require('@supabase/supabase-js');

// Chamada diariamente pelo cron da Vercel (vercel.json). O Supabase gratuito pausa
// o projeto após 7 dias sem atividade — essa consulta mínima mantém ele ativo.
module.exports = async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { error } = await supabase.from('licenses').select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Keep-alive falhou:', error.message);
    return res.status(500).json({ ok: false });
  }
  return res.status(200).json({ ok: true });
};
