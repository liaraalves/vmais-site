
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


const CAMP={
  dengue:{nome:"vacina da dengue",tl:[["Agora","Conversa inicial e proposta"],["Outubro","Divulgação interna e inscrições"],["Novembro","1ª dose na empresa"],["Fevereiro","2ª dose e relatório final"]]},
  gripe:{nome:"vacina da gripe",tl:[["Agora","Reserva das doses da próxima campanha"],["Fevereiro","Divulgação interna e inscrições"],["Março e abril","Vacinação na empresa, com a vacina do ano"],["Depois","Lista de vacinados e relatório"]]},
  bio:{nome:"vacinas para riscos biológicos do PGR",tl:[["Agora","Conversa com o SESMT sobre os riscos de cada função"],["Semana 1","Proposta com as vacinas indicadas"],["Semanas 2 a 4","Vacinação na empresa"],["Depois","Lista de vacinados e relatório para o PGR"]]},
  outra:{nome:"campanha personalizada",tl:[["Agora","Conversa inicial sobre a equipe e os objetivos"],["Semana 1","Proposta com vacinas e datas"],["Combinado","Vacinação na empresa"],["Depois","Lista de vacinados e relatório"]]}
};
let camp="dengue";
function plan(){
  const n=+$('#nEmp').value;$('#nOut').textContent=n>=1000?'1.000 ou mais':n;
  const c=CAMP[camp];
  $('#tl').innerHTML=c.tl.map((s,i)=>`<li style="animation-delay:${i*70}ms"><b>${s[0]}</b><span>${s[1]}</span></li>`).join('');
  const emp=$('#empName').value.trim();
  const msg=`Olá! Vim pelo site da VMais. ${emp?`Sou da empresa ${emp}. `:''}Temos cerca de ${n>=1000?'1.000 ou mais':n} colaboradores e queremos uma campanha de ${c.nome}. (EMP)`;
  $('#planCta').href=WA+encodeURIComponent(msg);
}
$('#nEmp').addEventListener('input',plan);$('#empName').addEventListener('input',plan);
$$('#camp button').forEach(b=>b.addEventListener('click',()=>{camp=b.dataset.c;$$('#camp button').forEach(x=>x.setAttribute('aria-pressed',x===b));plan()}));
plan();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
