// Exportação do repertório em TXT e PDF.
import { $id, esc, toast } from './utils.js';
import { S, songsInBlock } from './state.js';

function exportTXT(){
  const d=new Date().toLocaleDateString('pt-BR');
  let t='';
  t+='================================================================================\n';
  t+='REPERTÓRIO DE PALCO\n';
  t+=`Exportado em: ${d}  |  Total: ${S.songs.length} músicas  |  ${S.blocks.length} blocos\n`;
  t+='================================================================================\n';
  for(const blk of S.blocks){
    const bs=songsInBlock(blk);
    if(!bs.length) continue;
    t+=`\n${'═'.repeat(80)}\n${blk.toUpperCase()}\n${'═'.repeat(80)}\n\n`;
    bs.forEach((s,i)=>{
      t+=`${String(i+1).padStart(2,'0')}. ${s.title} — ${s.artist} (Tom: ${s.key})\n`;
      if(s.observations) t+=`    ${s.observations}\n`;
      t+='\n';
      t+='========================================\n';
      t+=`TÍTULO: ${s.title}\n`;
      t+=`ARTISTA: ${s.artist}\n`;
      t+=`TOM: ${s.key}\n`;
      t+=`BLOCO: ${s.block}\n`;
      if(s.observations) t+=`OBS: ${s.observations}\n`;
      t+='========================================\n\n';
      t+=(s.content||'')+'\n\n';
    });
  }
  const blob=new Blob([t],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`repertorio_${new Date().toISOString().slice(0,10)}.txt`;
  a.click(); URL.revokeObjectURL(url);
  toast('Repertório exportado em TXT!');
}

function exportPDF(){
  let html='';
  for(const blk of S.blocks){
    const bs=songsInBlock(blk);
    if(!bs.length) continue;
    bs.forEach(s=>{
      html+=`<div class="pr-song">
        <div class="pr-blk">${esc(s.block)}</div>
        <div class="pr-title">${esc(s.title)}</div>
        <div class="pr-artist">${esc(s.artist)}</div>
        <div class="pr-meta">
          <span class="pr-key">Tom: ${esc(s.key)}</span>
          ${s.observations?`<span class="pr-obs">${esc(s.observations)}</span>`:''}
        </div>
        <hr class="pr-sep">
        <pre class="pr-content">${esc(s.content||'')}</pre>
      </div>`;
    });
  }
  $id('print-area').innerHTML=html;
  window.print();
  toast('Abrindo diálogo de impressão…');
}

export { exportPDF, exportTXT };
