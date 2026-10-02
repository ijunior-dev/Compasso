// Ações do usuário: seleção, edição, modais, Palco, busca e teclado.
import { $id, esc, toast } from './utils.js';
import { S, allSongsOrdered, save, songById, uid } from './state.js';
import { scheduleFit } from './fit.js';
import { render, renderSidebar, renderStage } from './render.js';

function changeTranspose(delta){
  S.transpose=((S.transpose+delta)%12+12)%12;
  renderStage();
}

function resetTranspose(){
  S.transpose=0;
  renderStage();
}

function selectSong(id){
  S.activeId=id;
  S.view='stage';
  S.transpose=0;
  render();
  if(window.innerWidth<=768) closeMobileSidebar();
}

function openEdit(id){
  S.editId = (id===null) ? -1 : id;
  S.view='edit';
  render();
}

function cancelEdit(){
  S.view='stage';
  render();
}

function saveSong(){
  const title=$id('f-title').value.trim();
  const artist=$id('f-artist').value.trim();
  if(!title){toast('Informe o título da música.','err');return;}
  if(!artist){toast('Informe o artista.','err');return;}
  const data={
    title, artist,
    key:$id('f-key').value,
    block:$id('f-block').value,
    observations:$id('f-obs').value.trim(),
    content:$id('f-content').value
  };
  if(S.editId===-1){
    const maxOrd=S.songs.reduce((m,s)=>Math.max(m,s.order),0);
    const newSong={id:uid(),...data,order:maxOrd+1};
    S.songs.push(newSong);
    S.activeId=newSong.id;
    toast('Música adicionada!');
  } else {
    const idx=S.songs.findIndex(s=>s.id===S.editId);
    if(idx>=0) Object.assign(S.songs[idx],data);
    S.activeId=S.editId;
    toast('Música salva!');
  }
  S.view='stage';
  save();
  render();
}

function deleteSongEdit(){
  if(S.editId>0) openDelete(S.editId);
}

let _delId=null;

function openDelete(id){
  _delId=id;
  const s=songById(id);
  $id('del-msg').innerHTML=`Remover <strong>${esc(s?.title||'')}</strong>?<br><br>Esta ação não pode ser desfeita.`;
  $id('ov-del').classList.add('open');
}

function confirmDelete(){
  if(_delId){
    S.songs=S.songs.filter(s=>s.id!==_delId);
    if(S.activeId===_delId) S.activeId=null;
    if(S.editId===_delId){S.editId=-1;S.view='stage';}
    _delId=null;
    save();
    toast('Música removida.','ok');
  }
  closeModal('ov-del');
  render();
}

let _moveId=null;

function openMove(id){
  _moveId=id;
  const s=songById(id);
  const opts=S.blocks.filter(b=>b!==s?.block).map(b=>`<option value="${esc(b)}">${esc(b)}</option>`).join('');
  $id('move-sel').innerHTML=opts;
  $id('ov-move').classList.add('open');
}

function confirmMove(){
  if(_moveId){
    const idx=S.songs.findIndex(s=>s.id===_moveId);
    if(idx>=0){
      S.songs[idx].block=$id('move-sel').value;
      save();
      toast(`Movida para ${S.songs[idx].block}!`);
    }
    _moveId=null;
  }
  closeModal('ov-move');
  render();
}

function closeModal(id){
  $id(id).classList.remove('open');
}

function toggleBlock(name){
  const i=S.collapsed.indexOf(name);
  if(i>=0) S.collapsed.splice(i,1);
  else S.collapsed.push(name);
  save();
  renderSidebar();
}

function toggleSidebar(){
  if(window.innerWidth<=768){
    const open=$id('sb').classList.toggle('mob-open');
    $id('mob-ov').classList.toggle('show',open);
  } else {
    $id('sb').classList.toggle('hide');
  }
}

function closeMobileSidebar(){
  $id('sb').classList.remove('mob-open');
  $id('mob-ov').classList.remove('show');
}

function toggleTheme(){
  S.theme=S.theme==='dark'?'light':'dark';
  save();
  document.documentElement.setAttribute('data-theme',S.theme==='light'?'light':'');
}

function toggleStage(){
  S.stageMode=!S.stageMode;
  document.body.classList.toggle('stage', S.stageMode);
  if(S.stageMode && window.innerWidth<=768) closeMobileSidebar();
  scheduleFit();
}

function navSong(dir){
  const all=allSongsOrdered();
  if(!all.length) return;
  const idx=all.findIndex(s=>s.id===S.activeId);
  let next=idx+dir;
  if(next<0) next=all.length-1;
  if(next>=all.length) next=0;
  S.activeId=all[next].id;
  S.transpose=0;
  render();
  $id('vs').scrollTo({top:0,behavior:'smooth'});
}

function onSearch(q){
  S.search=q;
  const w=$id('cifra-wrap');
  if(w) w.style.display=q.trim()?'flex':'none';
  renderSidebar();
}

function searchCifraClub(){
  const q=S.search.trim();
  if(!q) return;
  window.open('https://www.cifraclub.com.br/busca/?q='+encodeURIComponent(q),'_blank','noopener');
}

document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
  if(e.key==='Escape' && S.stageMode){toggleStage();return;}
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){navSong(1);e.preventDefault();}
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){navSong(-1);e.preventDefault();}
  if(e.key==='f'||e.key==='F'){toggleStage();}
});

// Close modals on backdrop click
document.querySelectorAll('.ov').forEach(ov=>{
  ov.addEventListener('click',e=>{if(e.target===ov) ov.classList.remove('open');});
});

export { cancelEdit, changeTranspose, closeMobileSidebar, closeModal, confirmDelete, confirmMove, deleteSongEdit, navSong, onSearch, openDelete, openEdit, openMove, resetTranspose, saveSong, searchCifraClub, selectSong, toggleBlock, toggleSidebar, toggleStage, toggleTheme };
