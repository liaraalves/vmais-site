
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


/* catálogo: mesma lista do site atual, sem os medicamentos (Ajovy, Prolia, Densis e imunoglobulina anti-Rh) */
const FASES={bebe:'Bebês',crianca:'Crianças',adolescente:'Adolescentes',adulto:'Adultos',idoso:'60+',gestante:'Gestantes',viajante:'Viajantes',empresa:'Empresas'};
const V=[
 {n:'Dengue',m:'Qdenga',s:'dengue',c:'D',p:'Dengue causada pelos quatro sorotipos do vírus.',q:'Pessoas de 4 a 60 anos.',d:'2 doses, com 3 meses entre elas.',t:['crianca','adolescente','adulto','empresa'],k:'aedes mosquito'},
 {n:'VSR (Arexvy)',m:'Arexvy',s:'vsr',c:'V',p:'Doença do trato respiratório inferior pelo vírus sincicial respiratório, inclusive a forma grave.',q:'Adultos a partir de 18 anos. A recomendação de rotina é a partir dos 60 anos.',d:'Dose única.',t:['idoso','adulto'],k:'virus sincicial respiratorio bronquiolite pneumonia'},
 {n:'VSR (Abrysvo)',m:'Abrysvo',s:'vsr',c:'V',p:'Doença do trato respiratório inferior pelo VSR. Na gestação, protege o bebê do nascimento aos 6 meses.',q:'Pessoas a partir de 60 anos, adultos de 18 a 59 anos com alto risco e gestantes entre 24 e 36 semanas.',d:'Dose única.',t:['idoso','adulto','gestante'],k:'virus sincicial respiratorio bronquiolite gestacao'},
 {n:'dTpa',m:'Refortrix',s:'dtpa',c:'TB',p:'Difteria, tétano e coqueluche.',q:'Adolescentes, adultos, pessoas 60+ e gestantes, em cada gestação.',d:'Reforço a cada 10 anos. Gestantes: uma dose a cada gestação.',t:['adolescente','adulto','idoso','gestante','empresa'],k:'triplice bacteriana coqueluche tetano difteria'},
 {n:'Febre amarela',m:'Stamaril',s:'febre-amarela',c:'FA',p:'Febre amarela.',q:'A partir de 9 meses e viajantes para áreas com circulação do vírus.',d:'Esquema conforme a idade e o histórico de vacinas.',t:['bebe','crianca','adolescente','adulto','viajante'],k:'viagem'},
 {n:'Gripe',m:'Fluarix Tetra · Efluelda',s:'gripe',c:'G',p:'Gripe (influenza). A composição é atualizada todo ano.',q:'A partir de 6 meses. Para 60+, existe a versão de alta dose.',d:'1 dose por ano. Crianças até 8 anos que nunca tomaram: 2 doses na primeira vez.',t:['bebe','crianca','adolescente','adulto','idoso','gestante','empresa'],k:'influenza tetravalente trivalente efluelda alta dose'},
 {n:'Herpes zóster',m:'Shingrix',s:'herpes-zoster',c:'Z',p:'Herpes zóster (cobreiro) e a dor que pode ficar depois dele.',q:'A partir de 50 anos, e adultos a partir de 18 anos com imunidade baixa.',d:'2 doses, com 2 meses entre elas.',t:['adulto','idoso'],k:'cobreiro zoster'},
 {n:'Hexavalente acelular',m:'Infanrix Hexa · Hexaxim',s:'hexavalente',c:'HX',p:'Difteria, tétano, coqueluche, poliomielite, Haemophilus influenzae tipo b e hepatite B.',q:'Bebês a partir de 2 meses.',d:'Aos 2, 4 e 6 meses, e reforço de preferência antes dos 18 meses.',t:['bebe','crianca'],k:'polio hib hepatite b coqueluche'},
 {n:'HPV nonavalente',m:null,s:'hpv',c:'H',p:'Os 9 tipos de HPV incluídos na vacina, entre eles os que mais causam câncer e verrugas genitais.',q:'De 9 a 45 anos.',d:'2 doses até 14 anos. 3 doses a partir de 15 anos.',t:['crianca','adolescente','adulto'],k:'papilomavirus cancer colo utero verruga novavalente'},
 {n:'Meningite ACWY',m:'Menveo · Nimenrix',s:'meningite-acwy',c:'MA',p:'Meningite e infecções pelos meningococos A, C, W e Y.',q:'Bebês, crianças, adolescentes e adultos.',d:'Esquema conforme a idade, com reforços.',t:['bebe','crianca','adolescente','adulto'],k:'meningococica meningococo'},
 {n:'Meningite B',m:'Bexsero',s:'meningite-b',c:'MB',p:'Meningite e infecções pelo meningococo B.',q:'De 2 meses a 50 anos.',d:'Esquema conforme a idade.',t:['bebe','crianca','adolescente','adulto'],k:'meningococica meningococo bexsero'},
 {n:'Pentavalente acelular',m:'Infanrix Penta',s:'pentavalente',c:'PT',p:'Difteria, tétano, coqueluche, poliomielite e Haemophilus influenzae tipo b.',q:'De 2 meses a 5 anos.',d:'3 doses nos primeiros 6 meses e reforço no 2º ano de vida.',t:['bebe','crianca'],k:'polio hib coqueluche'},
 {n:'Pneumocócica 13',m:'Prevenar 13',s:'pneumococica-13',c:'P13',p:'Pneumonia, meningite e otite causadas por 13 tipos de pneumococo.',q:'A partir de 6 semanas de vida, sem idade máxima.',d:'Bebês: 3 doses e reforço. Adultos: dose única.',t:['bebe','crianca','adulto','idoso'],k:'pneumonia pneumococo otite prevenar 13'},
 {n:'Pneumocócica 15',m:'Vaxneuvance',s:'pneumococica-15',c:'P15',p:'Pneumonia, meningite e otite causadas por 15 tipos de pneumococo.',q:'Bebês a partir de 6 semanas, crianças e adultos.',d:'Esquema conforme a idade.',t:['bebe','crianca','adulto','idoso'],k:'pneumonia pneumococo otite vaxneuvance'},
 {n:'Pneumocócica 20',m:'Prevenar 20',s:'pneumococica-20',c:'P',p:'Pneumonia, meningite e otite causadas por 20 tipos de pneumococo.',q:'Bebês e adultos, principalmente a partir de 60 anos.',d:'Adultos: dose única. Bebês: 2 ou 3 doses e reforço.',t:['bebe','crianca','adulto','idoso'],k:'pneumonia pneumococo otite prevenar'},
 {n:'Pneumocócica 23',m:'Pneumovax 23',s:'pneumococica-23',c:'P23',p:'Pneumonia e outras infecções por 23 tipos de pneumococo.',q:'Pessoas a partir de 60 anos e grupos de risco, como complemento das vacinas conjugadas.',d:'Conforme o esquema com a vacina conjugada.',t:['adulto','idoso'],k:'pneumonia pneumococo'},
 {n:'Rotavírus pentavalente',m:'RotaTeq',s:'rotavirus',c:'R',p:'Diarreia grave causada pelo rotavírus.',q:'Bebês: 1ª dose entre 6 e 12 semanas, última até 32 semanas.',d:'3 doses pela boca, aos 2, 4 e 6 meses.',t:['bebe'],k:'diarreia gotinha oral'},
 {n:'Tríplice viral',m:'M-M-R II',s:'triplice-viral',c:'TV',p:'Sarampo, caxumba e rubéola.',q:'A partir de 12 meses, e adultos que não completaram o esquema.',d:'2 doses ao longo da vida.',t:['bebe','crianca','adolescente','adulto','empresa'],k:'sarampo caxumba rubeola scr'},
 {n:'Tetraviral',m:null,s:'tetraviral',c:'TT',p:'Sarampo, caxumba, rubéola e catapora.',q:'Crianças a partir de 12 meses.',d:'Conforme o calendário infantil.',t:['bebe','crianca'],k:'sarampo caxumba rubeola catapora varicela scrv'},
 {n:'Varicela',m:null,s:'varicela',c:'VA',p:'Catapora (varicela).',q:'A partir de 12 meses, e quem nunca teve catapora.',d:'2 doses.',t:['bebe','crianca','adolescente','adulto'],k:'catapora'},
 {n:'Hepatite A',m:'Vaqta',s:'hepatite-a',c:'HA',p:'Hepatite A, transmitida por água e alimentos contaminados.',q:'Crianças a partir de 12 meses, adolescentes e adultos.',d:'2 doses, com 6 meses ou mais entre elas.',t:['bebe','crianca','adolescente','adulto','viajante','empresa'],k:'hepatite a vaqta figado viagem'},
 {n:'Hepatite A e B',m:'Twinrix',s:'hepatite-a-b',c:'HAB',p:'Hepatites A e B em uma só vacina.',q:'A partir de 1 ano, para quem não tem as duas proteções.',d:'A partir de 16 anos, 3 doses. De 1 a 15 anos, 2 doses.',t:['crianca','adolescente','adulto','viajante','empresa'],k:'hepatite a b twinrix combinada figado'},
 {n:'Nirsevimabe (Beyfortus)',m:'Beyfortus',s:'nirsevimabe',c:'NV',p:'Anticorpo pronto que protege o bebê contra a bronquiolite pelo VSR.',q:'Recém-nascidos e bebês na primeira temporada do VSR, e crianças de risco na segunda.',d:'Dose única por temporada.',t:['bebe'],k:'vsr bronquiolite anticorpo monoclonal beyfortus nirsevimabe bebe'},
];
const norm=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let fase='todas',q='';
function hl(txt){if(!q)return esc(txt);const n=norm(txt),i=n.indexOf(norm(q));if(i<0)return esc(txt);return esc(txt.slice(0,i))+'<mark>'+esc(txt.slice(i,i+q.length))+'</mark>'+esc(txt.slice(i+q.length))}
function waMsg(v){return WA+encodeURIComponent(`Olá! Vim pelo site e quero saber sobre a vacina ${v.n}. (V-${v.c})`)}
function render(){
  const nq=norm(q);
  const list=V.filter(v=>(fase==='todas'||v.t.includes(fase))&&(!nq||norm([v.n,v.m,v.p,v.k].join(' ')).includes(nq)));
  $('#grid').innerHTML=list.map((v,i)=>`<a class="vc" href="vacinas/${v.s}.html" style="animation-delay:${Math.min(i,12)*35}ms">
    <div class="top"><div>${v.m&&v.m!==v.n?`<div class="brand">${esc(v.m)}</div>`:''}<h3>${hl(v.n)}</h3></div></div>
    <p class="prev">${hl(v.p)}</p>
    <div class="meta">${v.t.filter(t=>t!=='empresa').slice(0,4).map(t=>`<span>${FASES[t]}</span>`).join('')}</div>
    <span class="go">Conhecer a vacina <span aria-hidden="true">→</span></span></a>`).join('');
  $('#count').innerHTML=`<b>${list.length}</b> ${list.length===1?'vacina':'vacinas'}${fase!=='todas'?' para '+FASES[fase].toLowerCase():''}${q?` com “${esc(q)}”`:''}`;
  $('#empty').hidden=list.length>0;
  $('#emptyWa').href=WA+encodeURIComponent(`Olá! Procurei "${q}" no site e não encontrei. Vocês têm essa vacina? (S1)`);
}
$('#q').addEventListener('input',e=>{q=e.target.value.trim();$('#qClear').hidden=!q;render()});
$('#qClear').addEventListener('click',()=>{$('#q').value='';q='';$('#qClear').hidden=true;render();$('#q').focus()});
$$('#sug button').forEach(b=>b.addEventListener('click',()=>{$('#q').value=b.textContent==='Pneumonia'?'pneumo':b.dataset.q;q=$('#q').value;$('#qClear').hidden=false;render();$('.vx-list').scrollIntoView({behavior:'smooth'})}));
function setFase(f){fase=FASES[f]?f:'todas';$$('#fases .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.f===fase));render()}
$$('#fases .chip').forEach(c=>c.addEventListener('click',()=>{setFase(c.dataset.f);try{history.replaceState(null,'',fase==='todas'?location.pathname:'#'+fase)}catch(e){}}));
setFase(location.hash.slice(1));
addEventListener("hashchange",()=>setFase(location.hash.slice(1)));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
