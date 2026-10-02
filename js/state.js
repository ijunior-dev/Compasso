// Estado do app, persistência no navegador e consultas ao repertório.
import { INITIAL_SONGS } from './songs.js';

const ST_KEY = 'rp_v1';

let S = {
  songs: [],
  blocks: ['Ele','Ela'],
  activeId: null,
  view: 'stage',   // 'stage' | 'edit'
  editId: -1,      // -1 = new, else = id
  search: '',
  theme: 'dark',
  stageMode: false,
  collapsed: [],   // collapsed block names
  transpose: 0     // semitom offset da música ativa (não é salvo)
};

// Músicas novas do código precisam chegar em aparelhos que já têm repertório salvo.
// SEEDED guarda os títulos do repertório-base já oferecidos ao aparelho — assim uma
// música que o usuário apagou não reaparece.
// Migração única para dados salvos antes desse controle existir: tudo que já estava
// no código antes da leva de out/2026 conta como já oferecido.
const SEED_ADDED_2026_10=['Um Dia Um Adeus','De Tanto Amor','Chove Chuva','Palpite','Águas de Março','Nada Mais','Você É Linda','Todo Homem','Wave'];

let SEEDED=[];

function save() {
  localStorage.setItem(ST_KEY, JSON.stringify({
    songs: S.songs, blocks: S.blocks, theme: S.theme, collapsed: S.collapsed, seeded: SEEDED
  }));
}

function mergeNewSeedSongs(){
  const have=new Set(S.songs.map(s=>s.title));
  const offered=new Set(SEEDED);
  let maxId=Math.max(0,...S.songs.map(s=>s.id));
  let maxOrder=Math.max(0,...S.songs.map(s=>s.order||0));
  let added=0;
  INITIAL_SONGS.forEach(seed=>{
    if(offered.has(seed.title)||have.has(seed.title)) return;
    S.songs.push({...seed, playCount:0, id:++maxId, order:++maxOrder});
    if(!S.blocks.includes(seed.block)) S.blocks.push(seed.block);
    added++;
  });
  SEEDED=INITIAL_SONGS.map(s=>s.title);
  if(added) save();
  return added;
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(ST_KEY)||'null');
    if (d) {
      S.songs = d.songs || INITIAL_SONGS.map(s=>({...s}));
      S.blocks = d.blocks || S.blocks;
      S.theme = d.theme || 'dark';
      S.collapsed = d.collapsed || [];
      SEEDED = d.seeded || INITIAL_SONGS.map(s=>s.title).filter(t=>!SEED_ADDED_2026_10.includes(t));
    } else {
      S.songs = INITIAL_SONGS.map(s=>({...s}));
    }
  } catch(e) {
    S.songs = INITIAL_SONGS.map(s=>({...s}));
  }
  S.songs = S.songs.map(s=>({playCount:0,...s}));
  return mergeNewSeedSongs();
}

let _tid=0;

const uid=()=>++_tid+(Date.now()%1000000);

function filteredSongs(){
  const q=S.search.toLowerCase().trim();
  if(!q) return S.songs;
  return S.songs.filter(s=>
    s.title.toLowerCase().includes(q)||
    s.artist.toLowerCase().includes(q)||
    s.block.toLowerCase().includes(q)
  );
}

function songsInBlock(block){
  return S.songs.filter(s=>s.block===block).sort((a,b)=>a.order-b.order);
}

function allSongsOrdered(){
  return S.blocks.flatMap(b=>songsInBlock(b));
}

function songById(id){return S.songs.find(s=>s.id===id)}

export function setIdCounter(n){ _tid=n; }

export { S, allSongsOrdered, filteredSongs, load, save, songById, songsInBlock, uid };
