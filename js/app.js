// Ponto de entrada: inicializa o app e expõe ao HTML as funções dos botões.
import { $id, toast } from './utils.js';
import { S, load, setIdCounter } from './state.js';
import { scheduleFit } from './fit.js';
import { render } from './render.js';
import { cancelEdit, changeTranspose, closeMobileSidebar, closeModal, confirmDelete, confirmMove, deleteSongEdit, navSong, onSearch, openDelete, openEdit, openMove, resetTranspose, saveSong, searchCifraClub, selectSong, toggleBlock, toggleSidebar, toggleStage, toggleTheme } from './actions.js';
import { exportPDF, exportTXT } from './export.js';
import { adjustFont, applyFont, loadFontPref, navTo, onHomeSearch, openSongFromHome, setHomeGenre, setTheme } from './pages.js';
import { initLicense } from './license.js';

function init(){
  setIdCounter(200);
  const novas = load();
  if(novas) setTimeout(()=>toast(`${novas} música${novas>1?'s novas adicionadas':' nova adicionada'} ao repertório`),600);
  loadFontPref();
  applyFont();
  if(S.songs.length){
    setIdCounter(Math.max(...S.songs.map(s=>s.id))+1);
  }
  if(!S.activeId && S.songs.length){ S.activeId=S.songs[0].id; }
  document.getElementById('app').classList.add('hidden');
  navTo(1);
  render();
  initLicense();
  // Reajusta a cifra quando a largura útil muda (girar celular, abrir/fechar sidebar, redimensionar)
  if('ResizeObserver' in window){
    let lastW=0;
    new ResizeObserver(entries=>{
      const w=Math.round(entries[0].contentRect.width);
      if(w!==lastW){ lastW=w; scheduleFit(); }
    }).observe($id('vs'));
  } else {
    window.addEventListener('resize',scheduleFit);
  }
}


// Funções chamadas por onclick/oninput no HTML
Object.assign(window, { adjustFont, cancelEdit, changeTranspose, closeMobileSidebar, closeModal, confirmDelete, confirmMove, deleteSongEdit, exportPDF, exportTXT, navSong, navTo, onHomeSearch, onSearch, openDelete, openEdit, openMove, openSongFromHome, resetTranspose, saveSong, searchCifraClub, selectSong, setHomeGenre, setTheme, toggleBlock, toggleSidebar, toggleStage, toggleTheme });

init();
