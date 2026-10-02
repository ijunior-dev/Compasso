// Ajuste automático do tamanho da cifra à largura da tela.
import { $id } from './utils.js';

// Acorde depende de alinhamento monoespaçado, então a linha nunca pode quebrar.
// Em vez de fonte fixa por tamanho de tela, calcula por música o maior tamanho
// que faz a linha mais longa caber na largura útil (por coluna).
let _monoRatio=0, _fitT;

function monoCharRatio(fontFamily){
  if(_monoRatio) return _monoRatio;
  const probe=document.createElement('span');
  probe.style.cssText='position:absolute;visibility:hidden;white-space:pre;font-weight:700;font-size:100px';
  probe.style.fontFamily=fontFamily;
  probe.textContent='M'.repeat(20);
  document.body.appendChild(probe);
  _monoRatio=(probe.getBoundingClientRect().width/20/100)||0.6;
  probe.remove();
  return _monoRatio;
}

function fitCifra(){
  const el=$id('s-content');
  if(!el||!el.offsetParent||!el.children.length) return;
  el.style.fontSize='';
  el.style.columnCount='';
  const cs=getComputedStyle(el);
  const ratio=monoCharRatio(cs.fontFamily);
  const lens=Array.from(el.children).map(c=>c.textContent.replace(/\t/g,'    ').length);
  const maxChars=Math.max(20,...lens);   // piso evita fonte gigante em música curtíssima
  const avail=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  if(avail<=0) return;
  const gapPx=parseFloat(cs.columnGap);
  const gapEm=isNaN(gapPx)?1:gapPx/parseFloat(cs.fontSize);
  const fscale=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fscale'))||1;
  const stage=document.body.classList.contains('stage');
  const maxPx=(stage?30:22)*fscale;
  const minPx=10;
  const sizeFor=c=>(avail*0.97)/(c*maxChars*ratio+(c-1)*gapEm);
  let cols=parseInt(cs.columnCount,10)||1;
  let size=sizeFor(cols);
  if(cols>1&&size<15){ cols=1; size=sizeFor(1); el.style.columnCount='1'; }
  el.style.fontSize=Math.max(minPx,Math.min(maxPx,size)).toFixed(1)+'px';
}

function scheduleFit(){
  clearTimeout(_fitT);
  _fitT=setTimeout(fitCifra,60);
}

export { scheduleFit };
