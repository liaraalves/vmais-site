
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


const pr=$('#prog'),art=$('.prose');
function onScroll(){const r=art.getBoundingClientRect(),t=Math.min(1,Math.max(0,(-r.top+120)/(r.height-innerHeight+200)));pr.style.transform=`scaleX(${t})`;
 let cur=null;$$('.prose h2').forEach(h=>{if(h.getBoundingClientRect().top<160)cur=h.id});$$('.toc a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur))}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const cp=$('#copy');if(cp)cp.addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href).then(()=>{const t=$('#toast');t.textContent='Link copiado.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}).catch(()=>{})});
