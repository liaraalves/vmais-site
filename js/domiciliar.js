
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


function marcados(id){return $$(`#${id} button[aria-pressed="true"]`).map(b=>b.dataset.v)}
function lista(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' e '+a[a.length-1]}
function resumo(){
  const n=+$('#pp').value;$('#ppOut').textContent=n>=10?'10 ou mais':n;
  const q=marcados('quem'),v=marcados('vacs'),b=$('#bairro').value.trim();
  $('#sum').innerHTML=`<b>${n>=10?'10 ou mais pessoas':n+(n===1?' pessoa':' pessoas')}</b>${q.length?' · '+lista(q):''}${v.length?'<br>Vacinas: '+lista(v):''}${b?'<br>Bairro: '+b.replace(/[<>&]/g,''):''}`;
  const msg=`Olá! Quero vacinar em casa. Somos ${n>=10?'10 ou mais':n} ${n===1?'pessoa':'pessoas'}${q.length?' ('+lista(q)+')':''}.${v.length?' Vacinas: '+lista(v)+'.':''}${b?' Bairro: '+b+'.':''} (S2)`;
  $('#domCta').href=WA+encodeURIComponent(msg);
}
$$('.chk button').forEach(b=>b.addEventListener('click',()=>{b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');resumo()}));
$('#pp').addEventListener('input',resumo);$('#bairro').addEventListener('input',resumo);
resumo();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
