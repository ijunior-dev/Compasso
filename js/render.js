// Renderização da barra lateral, do palco e do formulário de edição.
import { $id, esc } from './utils.js';
import { KEYS } from './songs.js';
import { fmtContent, transposeContent, transposeKey } from './chords.js';
import { S, allSongsOrdered, filteredSongs, songById, songsInBlock } from './state.js';
import { scheduleFit } from './fit.js';

function render(){
  renderSidebar();
  if(S.view==='stage') renderStage();
  else renderEdit();
  document.documentElement.setAttribute('data-theme', S.theme==='light'?'light':'');
}

function renderSidebar(){
  const filtered=filteredSongs();
  const filteredIds=new Set(filtered.map(s=>s.id));
  let html='';
  for(const blk of S.blocks){
    const blkSongs=songsInBlock(blk).filter(s=>filteredIds.has(s.id));
    if(S.search && blkSongs.length===0) continue;
    const isOpen=!S.collapsed.includes(blk);
    html+=`<div class="blk">
      <div class="blk-hd" onclick="toggleBlock('${esc(blk)}')">
        <span class="blk-arr ${isOpen?'open':''}">▶</span>
        <span class="blk-name">${esc(blk)}</span>
        <span class="blk-cnt">${blkSongs.length}</span>
      </div>`;
    if(isOpen){
      html+='<div class="blk-songs">';
      blkSongs.forEach((s,i)=>{
        html+=`<div class="si${S.activeId===s.id?' active':''}" onclick="selectSong(${s.id})">
          <span class="si-num">${i+1}</span>
          <div class="si-info">
            <div class="si-title">${esc(s.title)}</div>
            <div class="si-artist">${esc(s.artist)}</div>
          </div>
          <span class="si-key">${esc(s.key)}</span>
        </div>`;
      });
      html+='</div>';
    }
    html+='</div>';
  }
  if(!html) html=`<div style="padding:20px 16px;font-size:13px;color:var(--muted);line-height:1.8">Nenhuma música encontrada.${S.search.trim()?`<br><br><button class="btn btn-primary btn-sm" style="width:100%;justify-content:center" onclick="searchCifraClub()">🌐 Buscar "${esc(S.search)}" no CifraClub</button>`:''}</div>`;
  $id('sb-body').innerHTML=html;
}

function renderStage(){
  $id('vs').className='show';
  $id('ve').className='';
  const s=songById(S.activeId);
  if(!s){
    $id('s-empty').style.display='flex';
    $id('s-wrap').style.display='none';
    $id('tb-bc').innerHTML='<strong>Selecione uma música</strong>';
    $id('tb-acts').innerHTML=`
      <button class="btn btn-ghost btn-sm hide-sm" onclick="exportTXT()">⬇ TXT</button>
      <button class="btn btn-ghost btn-sm hide-sm" onclick="exportPDF()">⬇ PDF</button>
      <button class="btn btn-ghost btn-sm" id="btn-stage" onclick="toggleStage()">⚡ Palco</button>`;
    $id('s-pos').textContent='';
    $id('s-pos2').textContent='';
    return;
  }
  $id('s-empty').style.display='none';
  $id('s-wrap').style.display='block';
  $id('s-blk').textContent=s.block;
  $id('s-title').textContent=s.title;
  $id('s-artist').textContent=s.artist;
  const steps=S.transpose||0;
  const dispKey=transposeKey(s.key,steps);
  $id('s-key').textContent='Tom: '+dispKey;
  const origEl=$id('tp-orig');
  if(steps){origEl.style.display='inline';origEl.textContent='↩ '+s.key;}
  else{origEl.style.display='none';}
  $id('s-obs').textContent=s.observations||'';
  $id('s-content').innerHTML=fmtContent(transposeContent(s.content,steps));
  scheduleFit();

  const all=allSongsOrdered();
  const idx=all.findIndex(x=>x.id===S.activeId);
  const pos=`${idx+1} / ${all.length} — ${esc(s.title)}`;
  $id('s-pos').textContent=pos;
  $id('s-pos2').textContent=pos;

  $id('tb-bc').innerHTML=`${esc(s.block)} › <strong>${esc(s.title)}</strong>`;
  $id('tb-acts').innerHTML=`
    <button class="btn btn-ghost btn-sm hide-sm" onclick="exportTXT()">⬇ TXT</button>
    <button class="btn btn-ghost btn-sm hide-sm" onclick="exportPDF()">⬇ PDF</button>
    <button class="btn btn-ghost btn-sm" onclick="openMove(${s.id})">⇄ Mover</button>
    <button class="btn btn-ghost btn-sm" onclick="openEdit(${s.id})">✎ Editar</button>
    <button class="btn btn-ghost btn-sm" onclick="openDelete(${s.id})">✕</button>
    <button class="btn btn-ghost btn-sm" id="btn-stage" onclick="toggleStage()">⚡ Palco</button>`;
}

function renderEdit(){
  $id('vs').className='';
  $id('ve').className='show';
  const isNew=S.editId===-1;
  $id('form-h').textContent=isNew?'Adicionar Música':'Editar Música';

  // Populate key select
  let ksHtml=KEYS.map(k=>`<option value="${k}">${k}</option>`).join('');
  $id('f-key').innerHTML=ksHtml;

  // Populate block select
  let bsHtml=S.blocks.map(b=>`<option value="${esc(b)}">${esc(b)}</option>`).join('');
  $id('f-block').innerHTML=bsHtml;

  if(isNew){
    $id('f-title').value='';
    $id('f-artist').value='';
    $id('f-key').value='G';
    $id('f-block').value=S.blocks[0]||'Bloco 1';
    $id('f-obs').value='';
    $id('f-content').value='';
    $id('btn-del-edit').style.display='none';
  } else {
    const s=songById(S.editId);
    if(s){
      $id('f-title').value=s.title;
      $id('f-artist').value=s.artist;
      $id('f-key').value=s.key;
      $id('f-block').value=s.block;
      $id('f-obs').value=s.observations||'';
      $id('f-content').value=s.content||'';
      $id('btn-del-edit').style.display='inline-flex';
    }
  }

  $id('tb-bc').innerHTML=isNew?'<strong>Nova Música</strong>':`Editando › <strong>${esc(songById(S.editId)?.title||'')}</strong>`;
  $id('tb-acts').innerHTML=`
    <button class="btn btn-ghost btn-sm" onclick="cancelEdit()">← Voltar</button>`;
}

export { render, renderSidebar, renderStage };
