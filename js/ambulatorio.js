
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


const IC={
 inj:'<path d="M18 2l4 4M15 5l4 4M8 12l4 4M17 7L7 17l-3 1 1-3L15 5"/>',
 ear:'<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><circle cx="12" cy="20" r="1.4"/>',
 band:'<rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M10 11h.01M14 13h.01"/>',
 drop:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
 heart:'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z"/><path d="M6 12h3l2-3 2 5 1-2h4"/>',
 cut:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>'
};
const AMB=[
 {k:'inj',c:'A1',n:'Aplicação de injetáveis',s:'Intramuscular e endovenosa, com prescrição.',d:'A enfermagem aplica o medicamento indicado pelo seu médico, por via intramuscular ou endovenosa, conferindo a prescrição, a dose e a validade antes da aplicação.',l:['Receita médica com nome, dose e via do medicamento','O medicamento, dentro da validade e bem conservado','Documento com foto']},
 {k:'ear',c:'A2',n:'Furo de orelha humanizado',s:'Técnica System 75, sem pistola.',d:'O furo é feito com o System 75, em que a perfuração é por pressão manual, sem o barulho e o impacto da pistola. O brinco vem estéril e lacrado, e a equipe ensina os cuidados de limpeza.',l:['Caderneta do bebê, se for criança','Escolha do modelo do brinco na hora','Disponibilidade para seguir os cuidados nas semanas seguintes']},
 {k:'band',c:'A3',n:'Curativo simples',s:'Limpeza e troca de curativos.',d:'Limpeza e troca de curativos simples, com material estéril. Se o ferimento precisar de avaliação médica, a equipe orienta onde procurar atendimento.',l:['Orientação médica, se houver','Materiais indicados pelo médico, quando for o caso']},
 {k:'drop',c:'A4',n:'Glicemia capilar',s:'Resultado na hora, com uma gotinha.',d:'Medição do açúcar no sangue com uma pequena picada no dedo. O resultado sai em poucos segundos e você leva o valor anotado.',l:['Informe se está em jejum e há quanto tempo','Se usa medicação para diabetes, diga qual']},
 {k:'heart',c:'A5',n:'Aferição de pressão',s:'Medição da pressão arterial.',d:'Medição da pressão com o paciente em repouso, sentado e com o braço apoiado. Você leva o valor anotado para mostrar ao seu médico.',l:['Evite café e exercício antes da medição, se possível','Se faz controle, traga as anotações anteriores']},
 {k:'cut',c:'A6',n:'Retirada de pontos',s:'Na data indicada pelo médico.',d:'Retirada dos pontos na data orientada pelo médico ou pelo serviço que fez a sutura, com avaliação do local e orientação dos cuidados depois.',l:['Orientação médica com a data da retirada','Informações sobre o procedimento que foi feito']}
];
let sel=0;
function svg(k){return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`}
if($('#amb')){$('#amb').innerHTML=AMB.map((a,i)=>`<button aria-pressed="${i===0}" data-i="${i}"><span class="ic">${svg(a.k)}</span><span class="txt"><b>${a.n}</b><span>${a.s}</span></span></button>`).join('');
function show(i){
  sel=i;$$('#amb button').forEach((b,j)=>b.setAttribute('aria-pressed',j===i));
  const a=AMB[i],wa=WA+encodeURIComponent(`Olá! Quero agendar: ${a.n}. (${a.c})`);
  $('#ambD').innerHTML=`<div class="fade"><div class="eyebrow">Como funciona</div><h3 style="margin-top:8px">${a.n}</h3><p>${a.d}</p></div>
   <div class="box fade"><b>O que levar</b><ul>${a.l.map(x=>`<li>${x}</li>`).join('')}</ul><a class="btn btn-gold" href="${wa}" target="_blank" rel="noopener">Agendar ${a.n.toLowerCase()}</a></div>`;
}
$$('#amb button').forEach(b=>b.addEventListener('click',()=>{show(+b.dataset.i);if(matchMedia('(max-width:600px)').matches)$('#ambD').scrollIntoView({behavior:'smooth',block:'nearest'})}));
show(0)}

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
