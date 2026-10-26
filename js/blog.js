
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


const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
let cat='todos';
function filt(){const q=norm($('#bq').value.trim());let n=0;const all=cat==='todos'&&!q;
 $$('.row').forEach(r=>{const ok=(cat==='todos'||r.dataset.cat===cat)&&(!q||norm(r.dataset.q).includes(q))&&!(all&&r.hasAttribute('data-feat'));r.hidden=!ok;if(ok)n++});
 $('#feat').hidden=!all;$('#empty').hidden=n>0}
$$('.bcats button').forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.c;$$('.bcats button').forEach(x=>x.setAttribute('aria-pressed',x===b));filt()}));
$('#bq').addEventListener('input',filt);
function fromHash(){const h=decodeURIComponent(location.hash.slice(1)),b=h&&$(`.bcats [data-c="${h}"]`);if(b)b.click();else filt()}
addEventListener('hashchange',fromHash);fromHash();
