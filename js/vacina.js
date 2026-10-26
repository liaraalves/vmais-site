
(function(){
  var scene=document.getElementById('scene'), box=document.getElementById('box3d');
  if(!scene||!box) return;
  // fotos da embalagem oficial: preencha os data-* com a URL de cada face
  var map={front:'.fc.front',back:'.fc.back',left:'.fc.left',right:'.fc.right',top:'.lid3d .fc'};
  Object.keys(map).forEach(function(k){
    var url=box.getAttribute('data-'+k);
    if(url){ var el=box.querySelector(map[k]); if(el) el.style.backgroundImage='url("'+url+'")'; }
  });
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rx=-14, ry=-30, vx=0, vy=reduce?0:0.25, dragging=false, moved=0, lx=0, ly=0, idle=true, last=0;
  function render(){ box.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)'; }
  function tick(t){
    if(!dragging){
      ry+=vy; rx+=vx;
      vy+= ((idle&&!reduce?0.25:0)-vy)*0.04;   // volta a girar devagar sozinha
      vx*=0.92; rx+=(-14-rx)*0.03;              // inclinação volta ao repouso
    }
    render(); requestAnimationFrame(tick);
  }
  scene.addEventListener('pointerdown',function(e){
    dragging=true; moved=0; lx=e.clientX; ly=e.clientY; idle=false;
    scene.setPointerCapture&&scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove',function(e){
    if(!dragging) return;
    var dx=e.clientX-lx, dy=e.clientY-ly; lx=e.clientX; ly=e.clientY;
    moved+=Math.abs(dx)+Math.abs(dy);
    ry+=dx*0.6; rx=Math.max(-45,Math.min(30,rx-dy*0.4));
    vy=dx*0.6; vx=-dy*0.2;
  });
  function end(){ if(!dragging) return; dragging=false; clearTimeout(last); last=setTimeout(function(){idle=true;},2500); if(moved<6) toggle(); }
  scene.addEventListener('pointerup',end);
  scene.addEventListener('pointercancel',function(){dragging=false;});
  function toggle(){
    var open=scene.classList.toggle('open');
    scene.setAttribute('aria-pressed',open?'true':'false');
    if(open){ vy=6; idle=false; clearTimeout(last); last=setTimeout(function(){idle=true;},2500); }
  }
  scene.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }
    if(e.key==='ArrowLeft'){ ry-=15; idle=false; }
    if(e.key==='ArrowRight'){ ry+=15; idle=false; }
  });
  render(); requestAnimationFrame(tick);
})();

(function(){
  // caixa original em foto: entrada, linhas explicativas e inclinação com o mouse
  var st=document.getElementById('pstage');
  if(!st) return;
  var tilt=document.getElementById('ptilt'), svg=document.getElementById('plines');
  var dots=[].slice.call(st.querySelectorAll('.pdot')), labels=[].slice.call(st.querySelectorAll('.plabel')), paths=[].slice.call(svg.querySelectorAll('path'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers=[], visible=false;
  // ponto dourado no fim de cada linha
  var ends=paths.map(function(p){var c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','2.6');svg.appendChild(c);return c});

  function draw(){
    if(getComputedStyle(svg).display==='none') return;
    var s=st.getBoundingClientRect();
    dots.forEach(function(d,i){
      var a=d.getBoundingClientRect(), b=labels[i].getBoundingClientRect(), left=labels[i].classList.contains('l');
      var x1=a.left+a.width/2-s.left, y1=a.top+a.height/2-s.top;
      var y2=b.top+Math.min(14,b.height/2)-s.top, x3=left?b.right-s.left+10:b.left-s.left-10, x2=left?x3+26:x3-26;
      ends[i].setAttribute('cx',x3.toFixed(1));ends[i].setAttribute('cy',y2.toFixed(1));
      paths[i].setAttribute('d','M'+x1.toFixed(1)+','+y1.toFixed(1)+' L'+x2.toFixed(1)+','+y2.toFixed(1)+' L'+x3.toFixed(1)+','+y2.toFixed(1));
    });
  }
  function loop(){ if(visible) draw(); requestAnimationFrame(loop); }

  function clear(){
    timers.forEach(clearTimeout); timers=[];
    st.classList.remove('in','sweep');
    [].concat(dots,labels,paths,ends).forEach(function(e){e.classList.remove('on')});
  }
  function play(){
    clear();
    if(reduce){ st.classList.add('in'); [].concat(dots,labels,paths,ends).forEach(function(e){e.classList.add('on')}); return; }
    void st.offsetWidth;
    st.style.setProperty('--sx','120%');
    timers.push(setTimeout(function(){st.classList.add('in')},60));
    timers.push(setTimeout(function(){st.classList.add('sweep')},650));
    timers.push(setTimeout(function(){st.style.setProperty('--sx','-60%');st.classList.remove('sweep')},2400));
    dots.forEach(function(d,i){
      var t=1000+i*420;
      timers.push(setTimeout(function(){d.classList.add('on');paths[i].classList.add('on')},t));
      timers.push(setTimeout(function(){ends[i].classList.add('on')},t+700));
      timers.push(setTimeout(function(){labels[i].classList.add('on')},t+380));
    });
  }

  // destaque de um item
  function focus(i){
    st.classList.toggle('focus',i!=null);
    [dots,labels,paths,ends].forEach(function(list){list.forEach(function(e,k){e.classList.toggle('act',k===i)})});
  }
  labels.forEach(function(l,i){
    l.addEventListener('mouseenter',function(){focus(i)}); l.addEventListener('mouseleave',function(){focus(null)});
    l.addEventListener('focus',function(){focus(i)}); l.addEventListener('blur',function(){focus(null)});
  });
  dots.forEach(function(d,i){
    d.addEventListener('mouseenter',function(){focus(i)}); d.addEventListener('mouseleave',function(){focus(null)});
    d.addEventListener('click',function(e){e.stopPropagation(); focus(i);
      if(getComputedStyle(svg).display==='none') labels[i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    });
  });

  // inclinação acompanhando o ponteiro
  function tiltTo(px,py){
    tilt.style.setProperty('--ry',((px-.5)*28).toFixed(1)+'deg');
    tilt.style.setProperty('--rx',(-(py-.5)*12).toFixed(1)+'deg');
    st.style.setProperty('--sx',(110-px*170).toFixed(0)+'%');
  }
  st.addEventListener('pointermove',function(e){
    if(reduce||!st.classList.contains('in')) return;
    var r=st.getBoundingClientRect(); tiltTo((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);
  });
  st.addEventListener('pointerleave',function(){ tilt.style.setProperty('--ry','0deg'); tilt.style.setProperty('--rx','0deg'); });

  if('IntersectionObserver' in window){
    var played=false;
    new IntersectionObserver(function(es){es.forEach(function(e){visible=e.isIntersecting; if(visible&&!played){played=true;play()}})},{threshold:.25}).observe(st);
  } else { visible=true; play(); }
  addEventListener('resize',draw);
  requestAnimationFrame(loop);
})();

(function(){
  // carrossel das avaliações: gira sozinho e pausa quando a pessoa interage
  var root=document.getElementById('revs'); if(!root) return;
  var track=document.getElementById('rtrack'), slides=track.children, n=slides.length, dots=document.getElementById('rdots'), i=0, timer=null;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(var k=0;k<n;k++){(function(k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Avaliação '+(k+1));b.addEventListener('click',function(){go(k);restart()});dots.appendChild(b)})(k)}
  function go(k){ i=(k+n)%n; track.style.transform='translateX('+(-100*i)+'%)';
    [].forEach.call(dots.children,function(d,j){d.setAttribute('aria-current',j===i?'true':'false')});
    [].forEach.call(slides,function(s,j){s.setAttribute('aria-hidden',j===i?'false':'true')}); }
  function start(){ if(!reduce&&n>1&&!timer) timer=setInterval(function(){go(i+1)},5000); }
  function stop(){ clearInterval(timer); timer=null; }
  function restart(){ stop(); start(); }
  document.getElementById('rprev').addEventListener('click',function(){go(i-1);restart()});
  document.getElementById('rnext').addEventListener('click',function(){go(i+1);restart()});
  root.addEventListener('mouseenter',stop); root.addEventListener('mouseleave',start);
  root.addEventListener('focusin',stop); root.addEventListener('focusout',start);
  var sx=null; track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;stop()},{passive:true});
  track.addEventListener('touchend',function(e){ if(sx!==null){var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) go(i+(dx<0?1:-1)); sx=null; start();} });
  go(0); start();
})();

(function(){
  // vírus do herpes zóster: linhas até as falas, estados da história e destaque ao passar o mouse
  var st=document.getElementById('vstage');
  if(!st) return;
  var svg=document.getElementById('vlines'), box=document.getElementById('vbox');
  var dots=[].slice.call(st.querySelectorAll('.vdot')), labels=[].slice.call(st.querySelectorAll('.vlabel'));
  var paths=[].slice.call(svg.querySelectorAll('path')), ends=[].slice.call(svg.querySelectorAll('circle'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible=false, cur=-1, auto=null, held=false;

  function draw(){
    if(getComputedStyle(svg).display==='none') return;
    var s=st.getBoundingClientRect();
    dots.forEach(function(d,i){
      var a=d.getBoundingClientRect(), b=labels[i].getBoundingClientRect(), left=labels[i].classList.contains('l');
      var x1=a.left+a.width/2-s.left, y1=a.top+a.height/2-s.top;
      var y2=b.top+Math.min(16,b.height/2)-s.top, x3=left?b.right-s.left+12:b.left-s.left-12, x2=left?x3+34:x3-34;
      paths[i].setAttribute('d','M'+x1.toFixed(1)+','+y1.toFixed(1)+' L'+x2.toFixed(1)+','+y2.toFixed(1)+' L'+x3.toFixed(1)+','+y2.toFixed(1));
      ends[i].setAttribute('cx',x3.toFixed(1)); ends[i].setAttribute('cy',y2.toFixed(1));
    });
  }
  function loop(){ if(visible) draw(); requestAnimationFrame(loop); }

  // mostra um capítulo da história (ou nenhum, com -1)
  function show(i){
    cur=i;
    st.dataset.s=i<0?'':String(i+1);
    st.classList.toggle('focus',i>=0);
    [dots,labels,paths,ends].forEach(function(list){list.forEach(function(e,k){e.classList.toggle('act',k===i)})});
  }
  function next(){ show((cur+1)%dots.length); }
  function startAuto(){ if(reduce||auto||held) return; auto=setInterval(next,3400); }
  function stopAuto(){ clearInterval(auto); auto=null; }
  function hold(i){ held=true; stopAuto(); show(i); }
  function release(){ held=false; startAuto(); }

  function enter(){
    if(st.classList.contains('in')) return;
    st.classList.add('in');
    if(reduce){ [].concat(dots,labels,paths,ends).forEach(function(e){e.classList.add('on')}); return; }
    dots.forEach(function(d,i){
      var t=700+i*380;
      setTimeout(function(){d.classList.add('on');paths[i].classList.add('on')},t);
      setTimeout(function(){labels[i].classList.add('on');ends[i].classList.add('on')},t+420);
    });
    setTimeout(function(){ next(); startAuto(); },700+dots.length*380+800);
  }

  labels.forEach(function(l,i){
    l.addEventListener('mouseenter',function(){hold(i)}); l.addEventListener('mouseleave',release);
    l.addEventListener('focus',function(){hold(i)}); l.addEventListener('blur',release);
    l.addEventListener('click',function(){hold(i)});
  });
  dots.forEach(function(d,i){
    d.addEventListener('mouseenter',function(){hold(i)}); d.addEventListener('mouseleave',release);
    d.addEventListener('focus',function(){hold(i)}); d.addEventListener('blur',release);
    d.addEventListener('click',function(e){e.stopPropagation(); hold(i);
      if(getComputedStyle(svg).display==='none') labels[i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    });
  });

  // (sem movimento com o ponteiro)
  if(false)
  st.addEventListener('pointermove',function(e){
    if(reduce||e.pointerType!=='mouse') return;
    var r=box.getBoundingClientRect();
    box.style.setProperty('--mx',(((e.clientX-r.left)/r.width-.5)*14).toFixed(1)+'px');
    box.style.setProperty('--my',(((e.clientY-r.top)/r.height-.5)*14).toFixed(1)+'px');
  });
  st.addEventListener('pointerleave',function(){ box.style.setProperty('--mx','0px'); box.style.setProperty('--my','0px'); });

  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){
      visible=e.isIntersecting;
      if(visible){ enter(); if(cur>=0) startAuto(); } else stopAuto();
    })},{threshold:.3}).observe(st);
  } else { visible=true; enter(); }
  addEventListener('resize',draw);
  requestAnimationFrame(loop);
})();

