// Páginas Início e Mais: gêneros, busca, tema e tamanho de fonte.
import { esc } from './utils.js';
import { S, save } from './state.js';
import { scheduleFit } from './fit.js';
import { render, renderSidebar, renderStage } from './render.js';

const GENRE_MAP = {
  'Bloco 1':'MPB','Bloco 2':'MPB','Bloco 3':'Rock','Bloco 4':'Sertanejo',
  'Bloco 5':'Pop','Bloco 6':'Samba','Bloco 7':'Forró','Bloco 8':'Gospel',
  'Bloco 9':'Pop','Bloco 10':'Pop'
};

const GENRES = ['Todos','MPB','Sertanejo','Rock','Pop','Samba','Brega','Forró','Reggae'];

function getGenre(song){ return GENRE_MAP[song.block] || 'Outros'; }

let homeGenre = 'Todos';

let homeSearch = '';

let currentPage = 1;

function navTo(page){
  currentPage = page;
  const p1  = document.getElementById('page1');
  const p3  = document.getElementById('page3');
  const app = document.getElementById('app');
  document.getElementById('bn-inicio').classList.toggle('active', page===1);
  document.getElementById('bn-musicas').classList.toggle('active', page===2);
  document.getElementById('bn-mais').classList.toggle('active', page===3);
  p1.classList.toggle('hidden', page!==1);
  app.classList.toggle('hidden', page!==2);
  p3.classList.toggle('hidden', page!==3);
  if(page===1) renderHome();
  if(page===2) render();
  if(page===3) renderSettings();
}

function setTheme(t){
  S.theme=t; save();
  document.documentElement.setAttribute('data-theme', t==='light'?'light':'');
  renderSettings();
}

const FONT_STEPS=[0.8,0.9,1.0,1.1,1.2,1.3,1.4];

let fontIdx=2;

function applyFont(){
  const scale=FONT_STEPS[fontIdx];
  document.documentElement.style.setProperty('--fscale', scale);
  localStorage.setItem('compasso_font', fontIdx);
  const lbl=document.getElementById('font-label');
  if(lbl) lbl.textContent=Math.round(scale*100)+'%';
  scheduleFit();
}

function adjustFont(dir){
  fontIdx=Math.max(0,Math.min(FONT_STEPS.length-1, fontIdx+dir));
  applyFont();
}

function renderSettings(){
  const dark=document.getElementById('btn-dark');
  const light=document.getElementById('btn-light');
  if(dark) dark.classList.toggle('active', S.theme!=='light');
  if(light) light.classList.toggle('active', S.theme==='light');
  const scale=FONT_STEPS[fontIdx];
  const lbl=document.getElementById('font-label');
  if(lbl) lbl.textContent=Math.round(scale*100)+'%';
}

function onHomeSearch(val){ homeSearch=val; renderHome(); }

function setHomeGenre(g){ homeGenre=g; renderHome(); }

function renderHome(){
  const genresEl = document.getElementById('p1-genres');
  if(!genresEl) return;
  genresEl.innerHTML = GENRES.map(g=>
    `<button class="genre-chip${g===homeGenre?' active':''}" onclick="setHomeGenre('${g}')">${g}</button>`
  ).join('');

  let songs = [...S.songs];
  if(homeGenre!=='Todos') songs = songs.filter(s=>getGenre(s)===homeGenre);
  if(homeSearch){
    const q=homeSearch.toLowerCase();
    songs=songs.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q));
  }
  songs.sort((a,b)=>(b.playCount||0)-(a.playCount||0));

  const body = document.getElementById('p1-body');
  if(!songs.length){
    body.innerHTML='<div class="p1-empty">Nenhuma música encontrada</div>';
    return;
  }
  body.innerHTML=`
    <div class="p1-section-title">🔥 Favoritas e mais tocadas</div>
    ${songs.map((s,i)=>`
      <div class="p1-song" onclick="openSongFromHome(${s.id})">
        <div class="p1-song-num">${i+1}</div>
        <div class="p1-song-info">
          <div class="p1-song-title">${esc(s.title)}</div>
          <div class="p1-song-artist">${esc(s.artist)}</div>
        </div>
        <div class="p1-song-genre">${getGenre(s)}</div>
      </div>`).join('')}`;
}

function openSongFromHome(id){
  const song = S.songs.find(s=>s.id===id);
  if(song){ song.playCount=(song.playCount||0)+1; save(); }
  S.activeId=id;
  navTo(2);
  renderStage();
  renderSidebar();
}

export function loadFontPref(){ fontIdx=parseInt(localStorage.getItem('compasso_font')||'2',10); }

export { adjustFont, applyFont, navTo, onHomeSearch, openSongFromHome, setHomeGenre, setTheme };
