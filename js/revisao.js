/* Revisão de outubro de 2026: calendários vigentes, menu das páginas de vacina e banners da página inicial */
(function(){
  // toda página nova abre no topo (sem herdar a rolagem da página anterior), salvo links para uma seção (#)
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  // quem exibe o site (a prévia, o navegador do celular) às vezes devolve a rolagem da página anterior
  // depois que a página nova já abriu; nos primeiros segundos, sem a pessoa mexer, a página volta ao topo
  var mexeu=false, t0=Date.now(), JANELA=3500;
  function secao(){try{return location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch(e){return null}}
  function topo(){
    if(mexeu||secao())return;
    var h=document.documentElement,sb=h.style.scrollBehavior;
    h.style.scrollBehavior='auto';
    if(window.scrollY||h.scrollTop||document.body.scrollTop){window.scrollTo(0,0);h.scrollTop=0;document.body.scrollTop=0}
    h.style.scrollBehavior=sb;
  }
  ['wheel','touchstart','touchmove','pointerdown','mousedown','keydown'].forEach(function(t){window.addEventListener(t,function(){mexeu=true},{capture:true,passive:true})});
  topo();
  document.addEventListener('DOMContentLoaded',topo);
  window.addEventListener('load',function(){topo();setTimeout(topo,250);setTimeout(topo,900);setTimeout(topo,2000)});
  window.addEventListener('pageshow',function(e){if(e.persisted)return;t0=Date.now();topo()});
  window.addEventListener('scroll',function(){if(Date.now()-t0<JANELA)topo()},{passive:true});
  // dentro de uma moldura que cresce com a página, quem rola é a moldura: traz o começo da página para a vista
  if(window.top!==window&&'IntersectionObserver' in window){
    document.addEventListener('DOMContentLoaded',function(){
      var m=document.createElement('div');m.setAttribute('aria-hidden','true');
      m.style.cssText='position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
      document.body.appendChild(m);
      var io=new IntersectionObserver(function(es){
        io.disconnect();m.remove();
        if(!es[0].isIntersecting&&!mexeu&&!secao()&&!window.scrollY)try{document.body.scrollIntoView({block:'start',behavior:'auto'})}catch(e){}
      });
      io.observe(m);
    });
  }
  // endereço vigente de cada calendário da SBIm (o WordPress atualiza este bloco sozinho)
  var CAL={};
  try{CAL=JSON.parse(document.getElementById('vm-cal').textContent)}catch(e){}
  window.vmCal=function(f){
    var k=String(f||'').replace('calend-sbim-','').replace('.pdf','');
    return CAL[k]||'https://sbim.org.br/calendarios-de-vacinacao';
  };

  // menu das páginas de vacina no celular
  var bt=document.querySelector('.vm-menu'), nv=document.getElementById('vmnav');
  if(bt&&nv){
    var fecha=function(){nv.classList.remove('open');bt.setAttribute('aria-expanded','false')};
    bt.addEventListener('click',function(e){e.stopPropagation();var o=nv.classList.toggle('open');bt.setAttribute('aria-expanded',o?'true':'false')});
    nv.addEventListener('click',function(e){e.stopPropagation()});
    document.addEventListener('click',fecha);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fecha()});
  }

  // menu único: nas páginas cujo script não traz o menu (páginas de vacina)
  if(document.body.getAttribute('data-menu')==='revisao'){
    var Q=function(s){return [].slice.call(document.querySelectorAll(s))};
    var fechaTudo=function(){Q('nav.main li.open').forEach(function(x){x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')})};
    Q('nav.main li > button.top').forEach(function(b){
      var li=b.parentElement, larga=function(){return window.matchMedia('(min-width:1021px)').matches};
      b.addEventListener('click',function(e){e.stopPropagation();var o=!li.classList.contains('open');fechaTudo();li.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false')});
      li.addEventListener('mouseenter',function(){if(larga()){li.classList.add('open');b.setAttribute('aria-expanded','true')}});
      li.addEventListener('mouseleave',function(){if(larga()){li.classList.remove('open');b.setAttribute('aria-expanded','false')}});
    });
    document.addEventListener('click',fechaTudo);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fechaTudo()});
    var mb=document.getElementById('menuBtn'), mn=document.getElementById('nav');
    if(mb&&mn){
      mb.addEventListener('click',function(e){e.stopPropagation();var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o?'true':'false')});
      mn.addEventListener('click',function(e){e.stopPropagation()});
    }
  }

  // banners da página inicial: giram sozinhos, pausam quando a pessoa interage
  var hb=document.querySelector('.hb');
  if(!hb) return;
  var slides=[].slice.call(hb.querySelectorAll('.hb-slide')), dots=hb.querySelector('.hb-dots'), pb=hb.querySelector('.hb-pause');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i=0, timer=null, parado=reduce, hover=false;
  slides.forEach(function(s,k){
    var b=document.createElement('button');b.type='button';
    b.setAttribute('aria-label','Mostrar destaque '+(k+1)+': '+(s.getAttribute('data-t')||''));
    b.addEventListener('click',function(){go(k);pausa(true)});
    dots.appendChild(b);
  });
  var primeira=true;
  function go(k,dir){
    var antes=i;
    i=(k+slides.length)%slides.length;
    if(!primeira){ hb.classList.add('anim'); hb.setAttribute('data-dir',dir||(k<antes?'prev':'next')); }
    primeira=false;
    slides.forEach(function(s,j){
      var on=j===i; s.classList.toggle('on',on);
      s.setAttribute('aria-hidden',on?'false':'true');
      if(on) s.removeAttribute('inert'); else s.setAttribute('inert','');
    });
    [].forEach.call(dots.children,function(d,j){d.setAttribute('aria-current',j===i?'true':'false')});
  }
  function start(){ if(parado||hover||timer) return; hb.classList.remove('rodando'); void hb.offsetWidth; hb.classList.add('rodando'); timer=setInterval(function(){go(i+1,'next')},7000); }
  function stop(){ clearInterval(timer); timer=null; hb.classList.remove('rodando'); }
  function pausa(sim){ parado=sim; pb.setAttribute('aria-pressed',sim?'true':'false'); pb.textContent=sim?'Continuar':'Pausar'; if(sim) stop(); else start(); }
  pb.addEventListener('click',function(){pausa(!parado)});
  hb.querySelector('.hb-prev').addEventListener('click',function(){go(i-1,'prev');pausa(true)});
  hb.querySelector('.hb-next').addEventListener('click',function(){go(i+1,'next');pausa(true)});
  hb.addEventListener('mouseenter',function(){hover=true;stop()});
  hb.addEventListener('mouseleave',function(){hover=false;start()});
  hb.addEventListener('focusin',function(){hover=true;stop()});
  hb.addEventListener('focusout',function(){hover=false;start()});
  var sx=null;
  hb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  hb.addEventListener('touchend',function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50){go(i+(dx<0?1:-1),dx<0?'next':'prev');pausa(true)} sx=null; });
  document.addEventListener('visibilitychange',function(){ if(document.hidden) stop(); else start(); });
  if(reduce) pausa(true);
  go(0); start();
})();

/* Calendários: busca nos postos de saúde da Prefeitura */
(function(){
  var lista=document.getElementById('psLista');if(!lista)return;
  var itens=[].slice.call(lista.children),q=document.getElementById('psQ'),cnt=document.getElementById('psCount'),
      mais=document.getElementById('psMais'),vazio=document.getElementById('psVazio'),reg='',todos=false,LIM=9;
  function norm(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim()}
  function filtrar(){
    var t=norm(q.value),achados=0,filtro=!!(t||reg);
    itens.forEach(function(li){
      var ok=(!reg||li.dataset.r===reg)&&(!t||li.dataset.t.indexOf(t)>-1);
      if(ok)achados++;
      li.hidden=!ok||(!filtro&&!todos&&achados>LIM);
    });
    cnt.textContent=filtro?(achados===1?'1 posto encontrado':achados+' postos encontrados'):itens.length+' postos de saúde em Fortaleza';
    mais.hidden=filtro||todos||itens.length<=LIM;
    vazio.hidden=achados>0;
  }
  q.addEventListener('input',filtrar);
  [].forEach.call(document.querySelectorAll('#psReg .chip'),function(c){c.addEventListener('click',function(){
    reg=c.dataset.r;[].forEach.call(document.querySelectorAll('#psReg .chip'),function(x){x.setAttribute('aria-pressed',x===c)});filtrar();
  })});
  mais.addEventListener('click',function(){todos=true;filtrar()});
  filtrar();
})();

/* Ciclos na página inicial: botões com as idades do esquema da VMais */
(function(){
  var r=document.getElementById('bAge'),bs=[].slice.call(document.querySelectorAll('#ciclos .idades .chip'));
  if(!r||!bs.length)return;
  bs.forEach(function(b){b.addEventListener('click',function(){
    bs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    r.value=b.getAttribute('data-m');r.dispatchEvent(new Event('input'));
  })});
})();

/* vídeo institucional da clínica: botão grande de play sobre a capa */
(function(){
  [].forEach.call(document.querySelectorAll('.cl-tela'),function(t){
    var v=t.querySelector('video'),b=t.querySelector('.cl-play');if(!v||!b)return;
    v.controls=false;   // a barra do player só aparece depois do play
    b.addEventListener('click',function(){t.classList.add('tocando');v.controls=true;v.play()});
    v.addEventListener('play',function(){t.classList.add('tocando');v.controls=true});
  });
})();
