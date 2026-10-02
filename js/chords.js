// Detecção de acordes, transposição e formatação da cifra.
import { esc } from './utils.js';

// Acorde: raiz + qualidade/extensões (m, 7M, 7+, °, (9), (13-), (4/9)) + baixo ou
// extensão após barra (D/F#, Eb7/5-, F#7/4/9). Parêntese solto no início/fim cobre
// grupos como "(D#m7  A#7)".
const CHORD_RE=/^\(?[A-G][#b]?(?:maj|min|dim|aug|sus|add|m|M|\d|[+\-°º]|\(\d+[+\-]?(?:\/\d+[+\-]?)*\))*(?:\/(?:[A-G][#b]?|\d+[+\-]?)(?:\/\d+[+\-]?)*)?\)?$/;

function isChord(line) {
  let t=line.trim();
  if(!t)return false;
  if(/^\(.*\)$/.test(t)) t=t.slice(1,-1).trim();     // linha toda entre parênteses: ( A G A Bm )
  t=t.replace(/\s+\([^()]*\)\s*$/,'').trim();        // anotação no fim: (2x), (Frase 1)
  if(!t)return false;
  return t.split(/\s+/).every(tk=>CHORD_RE.test(tk));
}

// Escala cromática com notação preferida (Ab, Bb, Eb padrão; C#, F# padrão)
const CHROMATIC=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

// Equivalências enarmônicas → normaliza para CHROMATIC
const ENHARMONIC={'Db':'C#','D#':'Eb','Gb':'F#','G#':'Ab','A#':'Bb','Cb':'B','Fb':'E','E#':'F','B#':'C'};

function shiftNote(n,steps){
  const norm=ENHARMONIC[n]||n;
  const i=CHROMATIC.indexOf(norm);
  if(i<0)return n;
  return CHROMATIC[((i+steps)%12+12)%12];
}

function transposeToken(tok,steps){
  if(!steps)return tok;
  if(tok.startsWith('(')) return '('+transposeToken(tok.slice(1),steps);
  // Slash chord: transpõe cada parte separadamente
  const si=tok.indexOf('/');
  if(si>0) return transposeToken(tok.slice(0,si),steps)+'/'+transposeToken(tok.slice(si+1),steps);
  const m=tok.match(/^([A-G][#b]?)(.*)$/);
  if(!m)return tok;
  return shiftNote(m[1],steps)+m[2];
}

function transposeContent(content,steps){
  if(!steps)return content;
  return content.split('\n').map(line=>{
    if(!isChord(line))return line;
    // split preservando grupos de espaço (alinhamento dos acordes)
    // só transpõe o que é acorde — anotações como "(Frase 1)" ficam intactas
    return line.split(/(\s+)/).map(p=>CHORD_RE.test(p)?transposeToken(p,steps):p).join('');
  }).join('\n');
}

function transposeKey(key,steps){
  if(!steps)return key;
  const isMin=/^[A-G][#b]?m$/.test(key);
  const root=isMin?key.slice(0,-1):key;
  return shiftNote(root,steps)+(isMin?'m':'');
}

function fmtContent(raw){
  if(!raw)return '';
  return raw.split('\n').map(line=>{
    const e=esc(line);
    if(/^\[.+\]$/.test(line.trim())) return `<span class="cs-section">${e}</span>`;
    if(isChord(line)) return `<span class="cs-chord">${e}</span>`;
    if(!line.trim()) return `<span class="cs-empty"> </span>`;
    return `<span class="cs-lyric">${e}</span>`;
  }).join('');
}

export { fmtContent, transposeContent, transposeKey };
