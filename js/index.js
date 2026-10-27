
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

/* quiz de perfil */
const PERFIS={
  bebe:{t:"Do nascimento aos 2 anos",v:[["Hexavalente acelular"],["Pneumocócica 20","pneumococica-20"],["Meningite B","meningite-b"],["Meningite ACWY","meningite-acwy"],["Rotavírus"],["Gripe","gripe"]],cal:["Criança","calend-sbim-crianca.pdf"],extra:'Veja abaixo os <a href="#ciclos" style="color:var(--ouro-claro);font-weight:700">Ciclos VMais</a>, com o calendário do bebê organizado em pacotes.'},
  crianca:{t:"Dos 2 aos 9 anos",v:[["Gripe (todo ano)","gripe"],["Dengue (a partir de 4 anos)","dengue"],["Reforços de tríplice bacteriana e ACWY","meningite-acwy"],["HPV (a partir de 9 anos)","hpv"]],cal:["Criança","calend-sbim-crianca.pdf"]},
  adolescente:{t:"Dos 10 aos 19 anos",v:[["HPV","hpv"],["Meningite ACWY","meningite-acwy"],["Meningite B","meningite-b"],["dTpa (reforço)"],["Dengue","dengue"],["Gripe","gripe"]],cal:["Adolescente","calend-sbim-adolescente.pdf"]},
  adulto:{t:"Dos 20 aos 59 anos",v:[["Gripe (todo ano)","gripe"],["dTpa a cada 10 anos"],["Hepatite B"],["HPV (até 45 anos)","hpv"],["Dengue (até 60 anos)","dengue"],["Herpes zóster (a partir de 50)","herpes-zoster"]],cal:["Adulto","calend-sbim-adulto.pdf"]},
  idoso:{t:"A partir dos 60 anos",v:[["Gripe (todo ano)","gripe"],["Pneumocócica 20","pneumococica-20"],["Herpes zóster","herpes-zoster"],["VSR","vsr"],["dTpa"]],cal:["Idoso","calend-sbim-idoso.pdf"]},
  gestante:{t:"Durante a gestação",v:[["dTpa"],["Gripe","gripe"],["Hepatite B"],["VSR (Abrysvo), de 24 a 36 semanas","vsr"]],cal:["Gestante","calend-sbim-gestante.pdf"]},
  empresa:{t:"Para a sua equipe",v:[["Gripe","gripe"],["Dengue","dengue"],["Hepatite B"],["dT (tétano e difteria)"]],cal:["Ocupacional","calend-sbim-ocupacional.pdf"],emp:true}
};
$$('.pill').forEach(b=>b.addEventListener('click',()=>{
  const p=b.dataset.p,d=PERFIS[p];
  $$('.pill').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const tags=d.v.map((v,i)=>v[1]?`<a class="vtag" href="vacinas/${v[1]}.html" style="animation-delay:${i*60}ms">${v[0]} →</a>`:`<span class="vtag" style="animation-delay:${i*60}ms">${v[0]}</span>`).join('');
  const msg=encodeURIComponent(`Olá! Vim pelo site e quero saber das vacinas para: ${d.t.toLowerCase()}. (S4)`);
  $('#answerIn').innerHTML=`<div class="tiny">${d.t} · vacinas que costumam entrar no calendário</div><div class="vlist">${tags}</div>`+(d.extra?`<div class="tiny">${d.extra}</div>`:'')+
   `<div class="links">${d.emp?'<a href="empresarial.html">Ver a área para empresas →</a>':`<a href="${WA+msg}" target="_blank" rel="noopener">Falar com a enfermagem →</a>`}<a href="${vmCal(d.cal[1])}" target="_blank" rel="noopener">Calendário SBIm ${d.cal[0]} (PDF oficial)</a></div>`+
   `<div class="tiny">Orientação geral. A indicação de cada vacina é confirmada pela nossa equipe ou pelo seu médico.</div>`;
  $('#answer').classList.add('open');
  $$('[data-soon2]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=$('#toast');t.textContent='Esta página vem nas próximas etapas.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}));
}));

/* cartões de vacina */
const VAC=[
  ["Herpes zóster","50 anos ou mais","Previne o cobreiro e a dor que pode ficar depois dele.",["2 doses","Intervalo de 2 meses","Pode tomar quem já teve zóster"],"herpes-zoster"],
  ["Dengue","4 a 60 anos","Duas doses com três meses entre elas.",["2 doses","Intervalo de 3 meses","Comece em novembro"],"dengue"],
  ["HPV","De 9 a 45 anos","Protege contra os tipos de HPV que mais causam câncer.",["2 doses até 14 anos","3 doses a partir de 15"],"hpv"],
  ["Meningite B","De 2 meses a 50 anos","Protege contra o meningococo B, que não está no SUS.",["Esquema conforme a idade","Pode ser feita com outras vacinas"],"meningite-b"],
  ["Meningite ACWY","Bebês a adultos","Protege contra quatro tipos de meningococo.",["Esquema conforme a idade","Reforços na infância e adolescência"],"meningite-acwy"],
  ["Pneumocócica 20","Crianças e 60+","Protege contra pneumonia e outras infecções por pneumococo.",["Dose única para adultos","Bebês: 2 ou 3 doses e reforço"],"pneumococica-20"],
  ["VSR","Adultos, 60+ e gestantes","Previne a doença respiratória pelo vírus sincicial respiratório, inclusive a grave.",["Dose única","Gestantes: Abrysvo, de 24 a 36 semanas"],"vsr"],
  ["Gripe","A partir de 6 meses","A vacina muda todo ano para acompanhar o vírus.",["1 dose por ano","Alta dose para 60+"],"gripe"]
];
$('#vgrid').innerHTML=VAC.map(v=>`<button class="flip reveal" aria-pressed="false" aria-label="${v[0]}: toque para ver as doses"><div class="inner">
 <div class="face front"><div class="tagline">${v[1]}</div><h3>${v[0]}</h3><p class="who">${v[2]}</p><span class="turn">Toque para virar ↻</span></div>
 <div class="face back"><div class="tagline" style="color:var(--ouro-claro)">Doses</div><h3>${v[0]}</h3><ul>${v[3].map(d=>`<li>${d}</li>`).join('')}</ul><a href="vacinas/${v[4]}.html">Ver página da vacina →</a></div></div></button>`).join('');
$$('.flip').forEach(c=>c.addEventListener('click',e=>{if(e.target.closest('a'))return;c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')!=='true')}));

/* ciclos */
function ciclo(){
  const m=+$('#bAge').value;
  $('#bOut').textContent=m===0?'Recém-nascido':m+(m===1?' mês':' meses');
  let keys=[],msg='';
  if(m<2){msg='Antes dos 2 meses, o bebê recebe as vacinas da maternidade. Os ciclos começam aos 2 meses: o Semear ou o Florescer, que vai até os 18 meses.';keys=['semear','florescer']}
  else if(m<=9){msg='Na idade do seu bebê, o Semear cobre as vacinas até os 9 meses. O Florescer cobre de uma vez dos 2 aos 18 meses.';keys=['semear','florescer']}
  else if(m<12){msg='Entre 10 e 11 meses, fale com a equipe: ela ajusta o ciclo às doses que já foram feitas.';keys=['cultivar']}
  else if(m<=18){msg='O Cultivar reúne as vacinas dos 12 aos 18 meses.';keys=['cultivar']}
  else{msg='Depois dos 18 meses, a equipe monta o calendário de acordo com a caderneta.';keys=[]}
  $('#bMsg').textContent=msg;
  $$('.ciclo').forEach(c=>c.classList.toggle('match',keys.includes(c.dataset.c)));
}
if($('#bAge')){$('#bAge').addEventListener('input',ciclo);ciclo()}

/* entrada */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
(function(){const h=$('.hero');if(!h)return;for(let i=0;i<9;i++){const l=document.createElement('span');l.className='leaf';l.style.left=(5+i*11)+'%';l.style.animationDelay=(-i*1.6)+'s';l.style.animationDuration=(12+i%4*3)+'s';h.appendChild(l)}})();
