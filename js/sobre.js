
const WA="https://wa.me/5585991019162?text=", SBIM="https://sbim.org.br/images/calendarios/";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

/* páginas que ainda vão ser construídas */
let tt;
$$('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=$('#toast');t.textContent='Esta página vem nas próximas etapas.';t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}));

/* menu */
$$('nav.main li > button.top').forEach(b=>{
  const li=b.parentElement;
  b.addEventListener('click',e=>{e.stopPropagation();const o=!li.classList.contains('open');$$('nav.main li.open').forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});li.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
  li.addEventListener('mouseenter',()=>{if(matchMedia('(min-width:1021px)').matches){li.classList.add('open');b.setAttribute('aria-expanded','true')}});
  li.addEventListener('mouseleave',()=>{if(matchMedia('(min-width:1021px)').matches){li.classList.remove('open');b.setAttribute('aria-expanded','false')}});
});
document.addEventListener('click',()=>$$('nav.main li.open').forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('nav.main li.open').forEach(x=>x.classList.remove('open'))});
$('#menuBtn').addEventListener('click',e=>{e.stopPropagation();const o=$('#nav').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o)});
$('#nav').addEventListener('click',e=>e.stopPropagation());


const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* tour da clínica */
$$('.tour-list [role=tab]').forEach(t=>t.addEventListener('click',()=>{
  $$('.tour-list [role=tab]').forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);document.getElementById(x.getAttribute('aria-controls')).classList.toggle('on',on)});
}));
(function(){const s=$('#sc-infantil.mar');if(!s)return;for(let i=0;i<14;i++){const b=document.createElement('i');b.className='bub';const z=8+Math.round(Math.random()*18);b.style.cssText=`left:${4+Math.random()*92}%;width:${z}px;height:${z}px;animation-duration:${7+Math.random()*7}s;animation-delay:${-Math.random()*12}s`;s.insertBefore(b,s.querySelector('.cap'))}})();

/* caminho da vacina */
const ROTA=[
  {t:'Chegada à clínica',tag:'Recebimento',p:'As vacinas chegam do fornecedor em transporte refrigerado. Na chegada, as doses vão direto para a refrigeração da clínica, sem ficar esperando em temperatura ambiente.'},
  {t:'Guardada entre +2 °C e +8 °C',tag:'Armazenamento',p:'Na clínica, as vacinas ficam em equipamento de refrigeração próprio para imunobiológicos, sempre dentro da faixa de +2 °C a +8 °C, que é a indicada para elas.'},
  {t:'Se faltar energia',tag:'Gerador',p:'Queda de energia não interrompe o frio. A VMais tem geradores que assumem a refrigeração, para as doses continuarem na faixa segura. Teste no termômetro ao lado.'},
  {t:'Até você',tag:'Aplicação',p:'A dose só sai da refrigeração na hora de aplicar. Para vacinar em casa ou na empresa, ela viaja em caixa térmica, preparada para manter a temperatura até a aplicação.'}
];
let rIdx=0,rTimer=null,auto=!RM;
function rota(i){
  rIdx=i;
  $$('.route button').forEach((b,j)=>{b.setAttribute('aria-selected',j===i);const bar=b.querySelector('.bar i');bar.style.animation='none';bar.offsetWidth;bar.style.animation=''});
  const d=ROTA[i];
  $('#routePanel').innerHTML=`<div class="fade"><span class="tag">${d.tag}</span><h3 style="margin-top:12px">${d.t}</h3><p style="margin-top:10px">${d.p}</p></div>`;
  clearTimeout(rTimer);if(auto)rTimer=setTimeout(()=>rota((rIdx+1)%ROTA.length),6000);
}
$$('.route button').forEach((b,j)=>b.addEventListener('click',()=>{auto=false;$('.route').classList.add('paused');rota(j)}));
if($('.route')){if(!auto)$('.route').classList.add('paused');rota(0)}

/* termômetro com simulação de falta de energia (ilustrativo) */
(function(){
  const n=$('#needle'),r=$('#tRead'),btn=$('#blackout');let off=false,t=0;if(!n)return;
  function draw(v){n.style.left=((v+2)/22*100)+'%';r.textContent='+'+v.toFixed(1).replace('.',',')+' °C'}
  btn&&btn.addEventListener('click',()=>{
    off=!off;btn.setAttribute('aria-pressed',off);btn.textContent=off?'Voltar a energia':'Simular falta de energia';
    $('#thermo').classList.toggle('blackout',off);
    $('#stRede').className='st'+(off?' off':'');$('#stRede').lastChild.textContent=off?'Energia da rua: desligada':'Energia da rua: ligada';
    $('#stGer').className='st'+(off?'':' idle');$('#stGer').lastChild.textContent=off?'Gerador: ligado, frio mantido':'Gerador: em espera';
    if(RM)draw(off?5.6:5);
  });
  if(RM){draw(5);return}
  setInterval(()=>{t+=.15;const v=5+1.4*Math.sin(t)+.4*Math.sin(t*2.7)+(off?.5:0);draw(v)},200);
})();

/* horário: aberto agora (hora de Fortaleza) */
(function(){
  const now=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Fortaleza'}));
  const d=now.getDay(),h=now.getHours()+now.getMinutes()/60;
  const li=$(`#hours li[data-d="${d}"]`);if(li)li.classList.add('today');
  const open=(d>=1&&d<=5&&h>=8&&h<18)||(d===6&&h>=8&&h<12);
  const el=$('#openNow');el.classList.toggle('yes',open);el.lastChild.textContent=open?'Aberto agora':'Fechado agora · veja os horários';
})();

/* subnavegação acompanha a rolagem */
(function(){
  const links=$$('.subnav a'),secs=links.map(a=>document.querySelector(a.getAttribute('href')));
  function spy(){let cur=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<180)cur=i});links.forEach((a,i)=>a.classList.toggle('on',i===cur))}
  addEventListener('scroll',spy,{passive:true});spy();
})();

/* entrada e contador */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
(function(){const b=$('[data-count]');if(!b||RM)return;const o=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;o.disconnect();const to=+b.dataset.count,t0=performance.now();(function s(t){const p=Math.min(1,(t-t0)/1400);b.textContent='+'+Math.round(to*(1-Math.pow(1-p,3)))+' mil';if(p<1)requestAnimationFrame(s)})(t0)});o.observe(b)})();
