
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


const CALS2={
 crianca:{n:'Criança',w:'Do nascimento aos 10 anos',f:'calend-sbim-crianca.pdf',fase:'crianca',v:['Hexavalente','Pneumocócica','Rotavírus','Meningites ACWY e B','Gripe','Febre amarela','Tetraviral','Hepatite A','Dengue (a partir de 4 anos)','HPV (a partir de 9 anos)']},
 adolescente:{n:'Adolescente',w:'Dos 10 aos 19 anos',f:'calend-sbim-adolescente.pdf',fase:'adolescente',v:['HPV','Meningite ACWY','Meningite B','dTpa','Dengue','Gripe']},
 adulto:{n:'Adulto',w:'Dos 20 aos 59 anos',f:'calend-sbim-adulto.pdf',fase:'adulto',v:['Gripe','dTpa','Hepatite B','Tríplice viral','HPV','Dengue (até 60 anos)','Herpes zóster (a partir de 50)']},
 idoso:{n:'Idoso',w:'A partir dos 60 anos',f:'calend-sbim-idoso.pdf',fase:'idoso',v:['Gripe alta dose','Pneumocócicas','Herpes zóster','VSR','dTpa']},
 gestante:{n:'Gestante',w:'Durante a gestação',f:'calend-sbim-gestante.pdf',fase:'gestante',v:['dTpa','Gripe','Hepatite B','VSR, na idade gestacional indicada']},
 prematuro:{n:'Prematuro',w:'Bebês nascidos antes de 37 semanas',f:'calend-sbim-prematuro.pdf',fase:'bebe',v:['Esquema ajustado ao peso e à idade','Atenção especial a VSR e pneumocócica']},
 ocupacional:{n:'Ocupacional',w:'Vacinas indicadas por profissão',f:'calend-sbim-ocupacional.pdf',fase:'empresa',v:['Gripe','Hepatite B','dTpa / dT','Tríplice viral','Febre amarela, conforme a atividade']}
};
let esp=null;
function chave(){if(esp)return esp;const a=+$('#clAge').value;return a<10?'crianca':a<20?'adolescente':a<60?'adulto':'idoso'}
function res(){
  const a=+$('#clAge').value;$('#clOut').textContent=a===0?'Menos de 1 ano':a+(a===1?' ano':' anos');
  const k=chave(),c=CALS2[k];
  const extra=k==='ocupacional'?'<a class="btn btn-line" href="empresarial.html">Vacinação na empresa</a>':`<a class="btn btn-line" href="vacinas.html#${c.fase}">Vacinas para essa fase</a>`;
  $('#clRes').innerHTML=`<div class="fade-in" style="display:flex;flex-direction:column;gap:12px;height:100%"><span class="k">Calendário SBIm</span><h3>${c.n}</h3><p class="who">${c.w}</p>
   <div><span class="tiny">Vacinas que costumam aparecer nesse calendário</span><ul>${c.v.map((v,i)=>`<li style="animation-delay:${i*40}ms">${v}</li>`).join('')}</ul></div>
   <div class="acts"><a class="btn btn-gold" href="${vmCal(c.f)}" target="_blank" rel="noopener">Abrir o PDF oficial</a>${extra}</div>
   <span class="tiny">Resumo geral. O PDF da SBIm traz o esquema completo, e a nossa equipe confirma o que vale para você.</span></div>`;
  $$('.clc').forEach(x=>x.classList.toggle('hl',x.dataset.k===k));
}
$('#clGrid').innerHTML=Object.entries(CALS2).map(([k,c])=>`<article class="clc reveal" data-k="${k}"><span class="ic" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3M8 17h6"/></svg></span><h3>${c.n}</h3><p>${c.w}</p>
  <div class="row"><a class="pdf" href="${vmCal(c.f)}" target="_blank" rel="noopener">Abrir PDF ↗</a><a href="vacinas.html#${c.fase}">Vacinas →</a></div></article>`).join('');
$('#clAge').addEventListener('input',()=>{if(esp){esp=null;$$('#clEsp .chip').forEach(x=>x.setAttribute('aria-pressed','false'))}res()});
$$('#clEsp .chip').forEach(b=>b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';$$('#clEsp .chip').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed',on);esp=on?b.dataset.e:null;res()}));
res();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
