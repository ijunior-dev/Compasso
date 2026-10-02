// Utilitários de DOM e texto.

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toast(msg, type='ok'){
  const el=document.getElementById('toast');
  el.textContent=msg; el.className='show '+(type==='ok'?'ok':'err');
  setTimeout(()=>el.className='',2800);
}

function $id(id){return document.getElementById(id)}

export { $id, esc, toast };
