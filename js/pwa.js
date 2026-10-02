// Gera o ícone 🎸 via canvas em vários tamanhos e injeta no apple-touch-icon
// e no manifest (Android exige ícones dentro do manifest, não usa apple-touch-icon)
(function(){
  function drawIcon(size){
    var c=document.createElement('canvas');
    c.width=c.height=size;
    var ctx=c.getContext('2d');
    var r=size*0.2;
    ctx.fillStyle='#0e0f14';
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(0,0,size,size,r);ctx.fill();}
    else{ctx.fillRect(0,0,size,size);}
    ctx.strokeStyle='#252630';
    ctx.lineWidth=Math.max(2,size*0.022);
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(ctx.lineWidth/2,ctx.lineWidth/2,size-ctx.lineWidth,size-ctx.lineWidth,r-2);ctx.stroke();}
    ctx.font=Math.round(size*0.5)+'px serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('🎸',size/2,size*0.51);
    if(size>=120){
      ctx.fillStyle='#5a5c70';
      ctx.font='bold '+Math.round(size*0.088)+'px -apple-system,sans-serif';
      ctx.fillText('REPERTÓRIO',size/2,size*0.878);
    }
    return c.toDataURL('image/png');
  }

  var icon180=drawIcon(180);
  var l=document.createElement('link');
  l.rel='apple-touch-icon';
  l.href=icon180;
  document.head.appendChild(l);

  var icon192=drawIcon(192);
  var icon512=drawIcon(512);
  var manifest={
    name:'Repertório de Palco',
    short_name:'Repertório',
    display:'standalone',
    background_color:'#0e0f14',
    theme_color:'#0e0f14',
    orientation:'any',
    start_url:'./',
    icons:[
      {src:icon192,sizes:'192x192',type:'image/png',purpose:'any'},
      {src:icon512,sizes:'512x512',type:'image/png',purpose:'any'}
    ]
  };
  var blob=new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'});
  var ml=document.createElement('link');
  ml.rel='manifest';
  ml.href=URL.createObjectURL(blob);
  document.head.appendChild(ml);
})();
