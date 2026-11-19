const LS_KEY = "projeto-perfeicao-v1";
let state = {done:{}, ev:{}, goals:[], log:[], updated:0};
let dbRef = null, writing = false, dirty = false, saveTimer = null;
try { const raw = localStorage.getItem(LS_KEY); if (raw) { const s = JSON.parse(raw); if (s && typeof s === "object") state = normalize(s); } } catch(e) {}

function normalize(s){
  const obj = v => (v && typeof v === "object" && !Array.isArray(v)) ? {...v} : {};
  const ev = {}; Object.entries(obj(s.ev)).forEach(([k,v]) => { if (v && typeof v === "object") ev[k] = {t:String(v.t||""), u:String(v.u||""), at:Number(v.at)||0}; });
  return {done: obj(s.done), ev,
          goals: Array.isArray(s.goals) ? s.goals.slice(0,300).map(g=>({...g})) : [],
          log: Array.isArray(s.log) ? s.log.slice(0,300).map(l=>({...l})) : [],
          updated: Number(s.updated)||0,
          tk: (s.tk && typeof s.tk === "object" && !Array.isArray(s.tk)) ? JSON.parse(JSON.stringify(Object.assign({}, s.tk, {img: undefined}))) : undefined};
}
function saveLocal(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch(e) {} }
function touch(){
  state.updated = Date.now(); saveLocal(); dirty = true;
  if (dbRef){ setSync("busy","Salvando…"); clearTimeout(saveTimer); saveTimer = setTimeout(flush, 700); }
}
async function flush(){
  if (!dbRef || writing || !dirty) return;
  writing = true; dirty = false;
  try { await dbRef.set(JSON.parse(JSON.stringify(state))); setSync("cloud","Salvo na sua conta"); }
  catch(e){
    if (e && e.code === "invalid_argument"){ dbRef = null; setSync("","Salvo só neste navegador"); }
    else { dirty = true; setSync("busy","Não salvou ainda, tentando de novo"); setTimeout(flush, 3000 + Math.random()*2000); }
  }
  writing = false;
  if (dirty && dbRef) flush();
}
function setSync(cls, txt){ const el = document.getElementById("sync"); if (!el) return; el.className = "sync " + cls; el.lastElementChild.textContent = txt; }

async function connectDb(){
  if (!window.claude || typeof window.claude.use !== "function") return;
  let db = null;
  try { db = await window.claude.use("db"); } catch(e) { db = null; }
  if (!db) return;
  let ref;
  try { ref = db.doc("progress/main"); } catch(e){ return; }
  setSync("busy","Conectando à sua conta…");
  const timer = setTimeout(()=>setSync("", "Sem conexão com a conta, salvo neste navegador"), 10000);
  let first = true;
  ref.onSnapshot(snap => {
    if (snap.metadata && snap.metadata.fromCache === false) clearTimeout(timer);
    if (snap.metadata && snap.metadata.hasPendingWrites) return;
    dbRef = ref;
    if (snap.exists){
      const remote = normalize(snap.data() || {});
      if (remote.updated > state.updated){ state = remote; saveLocal(); render(); }
      else if (first && state.updated > remote.updated){ dirty = true; flush(); }
    } else if (first && state.updated > 0){ dirty = true; flush(); }
    if (!writing && !dirty) setSync("cloud","Salvo na sua conta");
    first = false;
  }, () => { clearTimeout(timer); dbRef = null; setSync("", "Salvo só neste navegador"); });
}

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const ALL = []; TRACKS.forEach((t,ti)=>t.steps.forEach(s=>ALL.push({id:s[0],f:s[1],t:s[2],d:s[3],r:s[4],p:s[5],h:HOURS[s[0]]||0,labs:STEP_LABS[s[0]]||[],track:t,ti})));
const isDone = id => !!state.done[id];
const hasEv = id => !!(state.ev[id] && state.ev[id].t);
const trackPct = t => { const n=t.steps.length, d=t.steps.filter(s=>isDone(s[0])).length; return {n,d,p:Math.round(100*d/n)}; };
function currentPhase(){ const today = new Date().toISOString().slice(0,10); for (let i=0;i<PHASES.length;i++) if (today <= PHASES[i].end) return i; return PHASES.length-1; }
function monthsTo(dateStr){ const a=new Date(), b=new Date(dateStr+"T12:00:00"); return Math.max(0,(b.getFullYear()-a.getFullYear())*12 + (b.getMonth()-a.getMonth())); }
function url(u){ if (!u) return ""; if (u.startsWith("yt:")) return "https://www.youtube.com/results?search_query="+encodeURIComponent(u.slice(3)); return u; }
function safeLink(u){ u = String(u||"").trim(); return /^https?:\/\//i.test(u) ? u : ""; }
const TYPE = {c:"Curso",y:"YouTube",l:"Livro",f:"Ferramenta",s:"Site / doc"};
const COST = {g:["g","Grátis"],p:["p","Pago"],gp:["g","Grátis · opção paga"]};
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove("on"),2200); }
function fmtDate(iso){ if(!iso) return ""; const [y,m,d]=iso.split("-"); return `${d}/${m}/${y}`; }
function fmtTs(ts){ try { return new Date(ts).toLocaleDateString("pt-BR"); } catch(e){ return ""; } }
const nf = n => Number(n).toLocaleString("pt-BR");
const pad2 = n => String(n).padStart(2,"0");

function chk(id, label, extra=""){
  const d = isDone(id);
  return `<label class="chk" for="ck-${extra}${id}"><input type="checkbox" id="ck-${extra}${id}" data-step="${id}" ${d?"checked":""}><span class="${d?"done-title":""}">${label}</span></label>`;
}
function ring(p, size=132){
  const r = (size-16)/2, c = 2*Math.PI*r, off = c*(1-p/100);
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${p}% concluído"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size/2} ${size/2})"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="ringtxt">${p}%</text></svg>`;
}

let selTrack = TRACKS[0].id, selPhase = -1, glossQ = "", editingEv = null;

function totals(){
  const total = ALL.length, done = ALL.filter(s=>isDone(s.id)).length;
  const hTot = ALL.reduce((a,s)=>a+s.h,0), hDone = ALL.filter(s=>isDone(s.id)).reduce((a,s)=>a+s.h,0);
  const evs = ALL.filter(s=>hasEv(s.id)).length;
  return {total, done, hTot, hDone, evs};
}
function nextSteps(n){
  const cp = currentPhase();
  let list = ALL.filter(s=>!isDone(s.id) && s.f<=cp).sort((a,b)=>a.f-b.f || a.ti-b.ti);
  if (!list.length) list = ALL.filter(s=>!isDone(s.id)).sort((a,b)=>a.f-b.f || a.ti-b.ti);
  return list.slice(0,n);
}

function viewHome(){
  const T = totals(), cp = currentPhase(), ph = PHASES[cp], pct = Math.round(100*T.done/T.total);
  const next = nextSteps(6);
  const feat = ["microbit","ohm","trace","play"].map(id=>LAB_BY_ID[id]).filter(Boolean);
  return `
  <section class="hero">
    <div class="herotxt">
      <p class="eyebrow">Projeto Marcio · ${esc(ph.n)} · ${esc(ph.p)}</p>
      <h1>Um passo de cada vez, até a formatura em 2030.</h1>
      <p class="lead">Siga a fase atual, registre uma evidência para cada etapa concluída e use o Laboratório para ver os conceitos funcionando antes de estudá-los a fundo.</p>
      <div class="herobtns">${next[0]?`<a class="btn" href="#trilhas" data-goto="${next[0].track.id}">Continuar: ${esc(next[0].t)}</a>`:""}<a class="btn ghost" href="#laboratorio">Abrir o Laboratório</a></div>
    </div>
    <div class="heroring">${ring(pct)}<span class="small muted">do caminho completo</span></div>
  </section>
  <section class="stats sec" aria-label="Resumo">
    <div class="stat"><div class="n">${T.done}<span class="of"> / ${T.total}</span></div><div class="l">etapas concluídas</div></div>
    <div class="stat"><div class="n">${T.evs}</div><div class="l">evidências no portfólio</div>${T.done>T.evs?`<a class="small" href="#evidencias">${T.done-T.evs} concluída(s) sem evidência</a>`:""}</div>
    <div class="stat"><div class="n">${nf(T.hDone)}<span class="of"> h</span></div><div class="l">de ~${nf(T.hTot)} h estimadas</div><div class="bar" style="margin-top:8px"><span style="width:${100*T.hDone/T.hTot}%"></span></div></div>
    <div class="stat"><div class="n">${monthsTo(GRAD)}</div><div class="l">meses até a formatura</div></div>
  </section>
  <section class="two sec">
    <div class="card">
      <div class="cardhead"><h2>Próximos passos</h2><a class="small" href="#linha-do-tempo">Ver linha do tempo</a></div>
      <ul class="next">${next.map(s=>`<li>${chk(s.id, `<b>${esc(s.t)}</b><br><span class="small muted">${esc(s.track.name)} · ${PHASES[s.f].n} · ~${s.h} h</span>`, "h-")}</li>`).join("") || `<li>Tudo concluído. Parabéns!</li>`}</ul>
    </div>
    <div class="card">
      <div class="cardhead"><h2>Progresso por trilha</h2><a class="small" href="#trilhas">Abrir trilhas</a></div>
      <div>${TRACKS.map((t,i)=>{const p=trackPct(t);return `<a class="trow" href="#trilhas" data-goto="${t.id}"><span class="tnum" style="--tc:${TC[t.g]}">${pad2(i+1)}</span><span><span class="tname">${esc(t.name)}</span><div class="bar thin"><span style="width:${p.p}%;background:${TC[t.g]}"></span></div></span><span class="pct">${p.d}/${p.n}</span></a>`}).join("")}</div>
    </div>
  </section>
  <section class="sec">
    <div class="cardhead"><h2>Experimente no Laboratório</h2><a class="small" href="#laboratorio">Ver as ${LABS.length} simulações</a></div>
    <div class="labgrid">${feat.map(labCard).join("")}</div>
  </section>
  <section class="two sec">
    <div class="card">
      <h2>Regras de ouro para estudar com IA</h2>
      <ol class="rules">
        <li><b>Tente sozinho primeiro</b>, por 20 a 30 minutos. A luta é onde o aprendizado acontece.</li>
        <li><b>Peça explicação, dicas e perguntas</b>, não a solução pronta.</li>
        <li><b>Nunca use código que você não sabe explicar linha por linha.</b></li>
        <li><b>Depois de usar IA, refaça sem ela.</b> Se não conseguir, ainda não aprendeu.</li>
        <li><b>Use a IA para criar provas para você</b>: exercícios, quizzes, flashcards.</li>
        <li><b>Verifique fatos e fontes.</b> IA erra com confiança.</li>
        <li><b>Dados de alunos nunca entram em IA.</b></li>
      </ol>
    </div>
    <div class="card">
      <h2>Prompt de tutor</h2>
      <p class="muted small">Cole no início de uma conversa ou nas instruções de um Projeto no Claude.</p>
      <pre class="prompt" id="tutor">Você é meu tutor de [TEMA]. Sou estudante de Ciência da Computação e professor de Educação Digital.
Não me dê a resposta pronta. Primeiro me pergunte o que eu já sei.
Depois me dê dicas em níveis, da mais leve à mais forte.
Só mostre a solução completa quando eu escrever "mostrar solução".
No fim, me passe 3 exercícios parecidos e corrija as minhas respostas.</pre>
      <button class="btn ghost" data-copy="tutor">Copiar prompt</button>
    </div>
  </section>`;
}

function evBlock(s){
  const e = state.ev[s.id];
  if (e && e.t && editingEv !== s.id){
    const link = safeLink(e.u);
    return `<div class="evbox"><span class="pill ok">Evidência</span><p>${esc(e.t)}${link?` · <a href="${esc(link)}" target="_blank" rel="noopener">abrir link</a>`:""}</p><button class="linkbtn" data-evedit="${s.id}">Editar</button></div>`;
  }
  const open = editingEv === s.id || (isDone(s.id) && !hasEv(s.id));
  return `<details class="evform" ${open?"open":""}><summary>${isDone(s.id)?'<span class="pill warn">Sem evidência</span> ':""}Registrar evidência</summary>
    <form data-ev="${s.id}">
      <label class="f" for="evt-${s.id}">O que você fez que prova que aprendeu<input id="evt-${s.id}" name="t" required maxlength="300" value="${esc(e?e.t:"")}" placeholder="${esc(s.p||"Ex.: resolvi todos os exercícios sem consultar a resposta")}"></label>
      <label class="f" for="evu-${s.id}">Link (GitHub, Drive, vídeo, foto) · opcional<input id="evu-${s.id}" name="u" type="url" maxlength="400" value="${esc(e?e.u:"")}" placeholder="https://"></label>
      <div class="row"><button class="btn" type="submit">Salvar evidência</button>${e&&e.t?`<button class="btn danger" type="button" data-evdel="${s.id}">Remover</button>`:""}${editingEv===s.id?`<button class="btn ghost" type="button" data-evcancel="1">Cancelar</button>`:""}</div>
    </form></details>`;
}

function stepCard(s){
  const d = isDone(s.id);
  const res = s.r.map(r=>{
    const [ty,name,u,cost,lang]=r, c=COST[cost]||COST.g, href=url(u);
    const nm = href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(name)}</a>` : `<span>${esc(name)}</span>`;
    return `<li><span class="rtype">${TYPE[ty]||""}</span><span>${nm} <span class="pill ${c[0]}">${c[1]}</span> <span class="pill l">${esc(lang)}</span></span></li>`;
  }).join("");
  let labs = s.labs.map(id=>LAB_BY_ID[id]).filter(Boolean).map(L=>`<a class="lablink" href="#lab-${L.id}"><span class="dot ${L.area}"></span>Simular: ${esc(L.title)}</a>`).join("");
  if (!labs && PLANNED[s.id]) labs = `<span class="lablink planned"><span class="dot"></span>Simulação no Lote ${PLANNED[s.id][0]}: ${esc(PLANNED[s.id][1])}</span>`;
  return `<article class="step ${d?"isdone":""}" id="step-${s.id}">
    <div class="stephead">${chk(s.id, `<strong class="stitle">${esc(s.t)}</strong>`)}<span class="pill l">~${s.h} h</span></div>
    <div class="stepbody">
      <div class="meta"><span class="pill">${PHASES[s.f].n} · ${esc(PHASES[s.f].p)}</span></div>
      <p class="desc">${esc(s.d)}</p>
      ${res?`<ul class="res">${res}</ul>`:""}
      ${s.p?`<p class="proj"><b>Prática:</b> ${esc(s.p)}</p>`:""}
      ${labs?`<div class="labs">${labs}</div>`:""}
      ${evBlock(s)}
    </div>
  </article>`;
}

function viewTracks(){
  const t = TRACKS.find(x=>x.id===selTrack) || TRACKS[0], ti = TRACKS.indexOf(t), p = trackPct(t);
  const steps = ALL.filter(s=>s.track===t && (selPhase<0 || s.f===selPhase));
  const phasesIn = [...new Set(t.steps.map(s=>s[1]))].sort();
  const hrs = ALL.filter(s=>s.track===t).reduce((a,s)=>a+s.h,0);
  return `<div class="tracks">
    <aside class="card tlist" aria-label="Trilhas">
      ${TRACKS.map((x,i)=>{const q=trackPct(x);return `<button data-track="${x.id}" aria-pressed="${x.id===t.id}"><span class="tnum" style="--tc:${TC[x.g]}">${pad2(i+1)}</span><span class="tname">${esc(x.name)}</span><span class="pct">${q.p}%</span></button>`}).join("")}
    </aside>
    <section>
      <div class="card thead" style="--tc:${TC[t.g]}">
        <span class="eyebrow">Trilha ${pad2(ti+1)} de ${TRACKS.length} · ~${nf(hrs)} h no total</span>
        <h1 class="h1s">${esc(t.name)}</h1>
        <p class="tw"><b>O que é:</b> ${esc(t.what)}</p>
        <p class="tw muted"><b>Por que importa:</b> ${esc(t.why)}</p>
        <div class="row" style="margin-top:12px"><div class="bar" style="flex:1;max-width:320px"><span style="width:${p.p}%;background:${TC[t.g]}"></span></div><span class="pct">${p.d} de ${p.n} etapas</span></div>
      </div>
      <div class="filters" role="group" aria-label="Filtrar por fase">
        <button data-phase="-1" aria-pressed="${selPhase<0}">Todas as fases</button>
        ${phasesIn.map(f=>`<button data-phase="${f}" aria-pressed="${selPhase===f}">${PHASES[f].n} · ${esc(PHASES[f].p)}</button>`).join("")}
      </div>
      <div class="grid">${steps.map(stepCard).join("") || `<p class="muted">Nenhuma etapa desta trilha nesta fase.</p>`}</div>
    </section>
  </div>`;
}

function viewTimeline(){
  const cp = currentPhase();
  const metro = PHASES.map((ph,i)=>{ const st=ALL.filter(s=>s.f===i), d=st.filter(s=>isDone(s.id)).length, p=Math.round(100*d/st.length);
    return `<a class="stop ${i===cp?"now":(i<cp?"past":"")}" href="#fase-${i}" data-scroll="fase-${i}"><span class="node"></span><b>${esc(ph.n)}</b><span class="small muted">${esc(ph.p)}</span><span class="pct">${p}%</span></a>`; }).join("");
  return `<section class="pagehead"><h1>Linha do tempo até 2030</h1>
  <p class="lead">Seis fases. Cada uma junta etapas de várias trilhas para você avançar em tudo ao mesmo tempo, sem pular fundamentos.</p></section>
  <nav class="metro sec" aria-label="Fases">${metro}</nav>
  <div class="grid sec" style="gap:32px">
  ${PHASES.map((ph,i)=>{
    const st = ALL.filter(s=>s.f===i), d = st.filter(s=>isDone(s.id)).length, h = st.reduce((a,s)=>a+s.h,0);
    const groups = TRACKS.map(t=>({t,items:st.filter(s=>s.track===t)})).filter(g=>g.items.length);
    return `<section class="phase ${i===cp?"now":(i<cp?"past":"")}" id="fase-${i}">
      <div class="row wrap"><h2>${ph.n} · ${esc(ph.t)}</h2><span class="pill">${esc(ph.p)}</span>${i===cp?'<span class="pill warn">Você está aqui</span>':""}<span class="pct muted">${d}/${st.length} etapas · ~${nf(h)} h</span></div>
      <p class="muted tw">${esc(ph.g)}</p>
      <div class="pgroup">${groups.map(g=>`<div class="card"><div class="tlabel" style="--tc:${TC[g.t.g]}"><i></i>${esc(g.t.name)}</div>${g.items.map(s=>chk(s.id, `${esc(s.t)}${isDone(s.id)&&!hasEv(s.id)?' <span class="pill warn">sem evidência</span>':""}`, "t-")).join("")}</div>`).join("")}</div>
    </section>`;}).join("")}
  </div>`;
}

function evMarkdown(){
  let md = "# Portfólio de evidências · Projeto Perfeição\n\n";
  TRACKS.forEach(t=>{
    const items = ALL.filter(s=>s.track===t && hasEv(s.id));
    if (!items.length) return;
    md += `## ${t.name}\n\n`;
    items.forEach(s=>{ const e=state.ev[s.id], l=safeLink(e.u); md += `- **${s.t}**: ${e.t}${l?` ([link](${l}))`:""}\n`; });
    md += "\n";
  });
  return md;
}
function viewEvidence(){
  const T = totals();
  const missing = ALL.filter(s=>isDone(s.id) && !hasEv(s.id));
  const groups = TRACKS.map(t=>({t,items:ALL.filter(s=>s.track===t && hasEv(s.id))})).filter(g=>g.items.length);
  return `<section class="pagehead"><h1>Portfólio de evidências</h1>
  <p class="lead">Marcar a caixinha não prova que você aprendeu. A evidência prova: um link, um projeto, um exercício resolvido sem ajuda. Esta página vira o seu portfólio.</p></section>
  <section class="stats sec"><div class="stat"><div class="n">${T.evs}</div><div class="l">evidências registradas</div></div><div class="stat"><div class="n">${missing.length}</div><div class="l">concluídas sem evidência</div></div><div class="stat"><div class="n">${ALL.filter(s=>hasEv(s.id)&&safeLink(state.ev[s.id].u)).length}</div><div class="l">com link para mostrar</div></div></section>
  ${missing.length?`<section class="card sec warnbox"><h2>Falta evidência</h2><ul class="plain">${missing.map(s=>`<li><a href="#trilhas" data-goto="${s.track.id}" data-step-focus="${s.id}">${esc(s.t)}</a> <span class="small muted">· ${esc(s.track.name)}</span></li>`).join("")}</ul></section>`:""}
  <section class="sec grid">${groups.length?groups.map(g=>`<div class="card"><div class="tlabel" style="--tc:${TC[g.t.g]}"><i></i>${esc(g.t.name)}</div><ul class="evlist">${g.items.map(s=>{const e=state.ev[s.id],l=safeLink(e.u);return `<li><b>${esc(s.t)}</b><p>${esc(e.t)}</p><span class="small muted">${fmtTs(e.at)}</span>${l?` · <a class="small" href="${esc(l)}" target="_blank" rel="noopener">abrir link</a>`:""}</li>`}).join("")}</ul></div>`).join(""):`<div class="card"><p class="muted">Nenhuma evidência ainda. Abra uma etapa em Trilhas e use “Registrar evidência”.</p></div>`}</section>
  <section class="card sec"><h2>Levar para o GitHub</h2><p class="muted small">Copie em Markdown e cole no README do seu perfil ou de um repositório.</p>
  <textarea id="evmd" readonly class="mono">${esc(evMarkdown())}</textarea><button class="btn ghost" data-copy="evmd">Copiar Markdown</button></section>`;
}

function glossList(){
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  const nq = norm(glossQ.trim());
  let out = "";
  GLOSS.forEach(([cat,items])=>{
    const f = items.filter(([t,d])=>!nq || norm(t).includes(nq) || norm(d).includes(nq));
    if (f.length) out += `<div class="gcat">${esc(cat)}</div>` + f.map(([t,d])=>`<dl class="card gterm"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></dl>`).join("");
  });
  return out || `<p class="muted">Nenhum termo encontrado. Pergunte ao Claude e anote no Diário de bordo.</p>`;
}
function viewGlossary(){
  return `<section class="pagehead"><h1>Glossário</h1>
  <p class="lead">Os nomes que mais confundem, explicados em uma ou duas frases. Comece por aqui antes de qualquer trilha.</p>
  <label for="gq" class="small muted">Buscar termo</label>
  <input id="gq" class="search" type="search" placeholder="Ex.: API, Git, framework" value="${esc(glossQ)}"></section>
  <div class="gloss" id="glist">${glossList()}</div>`;
}

function viewRoutine(){
  return `<section class="pagehead"><h1>Rotina semanal</h1>
  <p class="lead">Cerca de 8 a 10 horas por semana além da faculdade e do trabalho. Constância vence intensidade. Ajuste ao seu horário real e bloqueie no Google Agenda.</p></section>
  <div class="tablewrap sec"><table>
    <thead><tr><th>Dia</th><th>Inglês</th><th>Bloco técnico</th><th>Projeto e revisão</th></tr></thead>
    <tbody>${ROUTINE.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}</tbody>
  </table></div>
  <section class="two sec">
    <div class="card"><h2>Como fazer cada bloco de 1 hora</h2>
      <ol class="rules">
        <li>5 min: revise no Anki o que viu antes.</li>
        <li>40 min: estude ou pratique, sem celular. Use o Laboratório para ver o conceito funcionando.</li>
        <li>10 min: explique em voz alta ou por escrito o que aprendeu, sem olhar.</li>
        <li>5 min: marque a etapa, registre a evidência e anote uma linha no Diário de bordo.</li>
      </ol></div>
    <div class="card"><h2>Regras da rotina</h2>
      <ul class="rules">
        <li>Semana de provas da faculdade: só inglês e revisão. A faculdade vem primeiro.</li>
        <li>Perdeu um dia? Não compense dobrando. Só não perca dois seguidos.</li>
        <li>Férias: avance a trilha que mais atrasou ou faça um projeto maior.</li>
        <li>Descanso e sono fazem parte do treino. Cérebro cansado não fixa conteúdo.</li>
      </ul></div>
  </section>`;
}

function viewGoals(){
  const areas = ["Geral",...TRACKS.map(t=>t.name)];
  const goals = state.goals.slice().sort((a,b)=>(a.done?1:0)-(b.done?1:0) || String(a.due||"9999").localeCompare(String(b.due||"9999")));
  return `<section class="pagehead"><h1>Metas e diário de bordo</h1>
  <p class="lead">Metas com prazo transformam o plano em ação. O diário mostra sua evolução e me ajuda a acompanhar você nas próximas conversas.</p></section>
  <section class="card sec"><h2>Suas metas</h2>
    <form id="gform" class="form">
      <label class="f" for="g-text">Meta<input id="g-text" required maxlength="200" placeholder="Ex.: Terminar o Mundo 1 de Python"></label>
      <label class="f" for="g-due">Prazo<input id="g-due" type="date"></label>
      <label class="f" for="g-area">Área<select id="g-area">${areas.map(a=>`<option>${esc(a)}</option>`).join("")}</select></label>
      <button class="btn" type="submit">Adicionar meta</button>
    </form>
    <div>${goals.length?goals.map(g=>`<div class="goal"><label class="chk" for="gl-${esc(g.id)}"><input type="checkbox" id="gl-${esc(g.id)}" data-goal="${esc(g.id)}" ${g.done?"checked":""}><span class="${g.done?"done-title":""}"><b>${esc(g.text)}</b><br><span class="small muted">${esc(g.area||"Geral")}${g.due?" · até "+fmtDate(g.due):""}</span></span></label><button class="linkbtn" data-delgoal="${esc(g.id)}">Remover</button></div>`).join(""):`<p class="muted">Nenhuma meta ainda. Sugestão: “Fazer o teste de inglês EF SET até o fim do mês”.</p>`}</div>
  </section>
  <section class="card sec"><h2>Diário de bordo</h2>
    <form id="lform" class="grid" style="gap:10px">
      <label class="f" for="l-text">O que aprendi, o que travou, o que vou fazer
      <textarea id="l-text" maxlength="2000" placeholder="Ex.: Entendi laços for. Travei em listas dentro de listas. Amanhã: 5 exercícios no Beecrowd."></textarea></label>
      <div><button class="btn" type="submit">Salvar entrada</button></div>
    </form>
    <div>${state.log.length?state.log.map(l=>`<div class="logitem"><time>${esc(new Date(l.at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}))}</time><p>${esc(l.text)}</p></div>`).join(""):`<p class="muted">Nenhuma entrada ainda.</p>`}</div>
  </section>`;
}

function viewBackup(){
  return `<section class="pagehead"><h1>Backup e sincronização</h1>
  <p class="lead">A versão do Claude salva na sua conta do Claude. A versão do GitHub salva no seu Google Drive depois que você conecta abaixo. O backup serve para levar o progresso de uma para a outra.</p></section>
  <section class="two sec">
    <div class="card"><h2>Exportar</h2><p class="muted small">Copie e guarde num arquivo ou no Drive.</p>
      <textarea id="exp" readonly class="mono">${esc(JSON.stringify(state))}</textarea>
      <button class="btn ghost" data-copy="exp">Copiar backup</button></div>
    <div class="card"><h2>Importar</h2><p class="muted small">Cole um backup. Ele substitui o progresso atual.</p>
      <textarea id="imp" class="mono" placeholder='{"done":{...},"ev":{...},"goals":[...],"log":[...]}'></textarea>
      <button class="btn" id="doimp">Importar backup</button></div>
  </section>
  <section class="card sec"><h2>Recomeçar do zero</h2><p class="muted small">Apaga etapas, evidências, metas e diário. Exporte antes.</p>
    <div id="resetbox"><button class="btn danger" id="reset1">Apagar todo o progresso</button></div></section>`;
}

const VIEWS = {"inicio":viewHome,"trilhas":viewTracks,"linha-do-tempo":viewTimeline,"laboratorio":viewLabs,"evidencias":viewEvidence,"glossario":viewGlossary,"rotina":viewRoutine,"metas":viewGoals,"backup":viewBackup};
function curView(){
  const h = location.hash.slice(1);
  if (h.startsWith("lab-") && LAB_BY_ID[h.slice(4)]) return "lab";
  if (h.startsWith("fase-")) return "linha-do-tempo";
  return VIEWS[h] ? h : "inicio";
}
let lastView = "";
function render(){
  const v = curView(), tabv = v==="lab" ? "laboratorio" : v;
  document.querySelectorAll("#tabs a").forEach(a=>{ if (a.getAttribute("href")==="#"+tabv) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  const y = window.scrollY, labId = location.hash.slice(5);
  stopLabs();
  $("#view").innerHTML = v==="lab" ? viewLab(labId) : VIEWS[v]();
  if (v==="lab") mountLab(labId);
  if (v===lastView) window.scrollTo(0,y);
  lastView = v;
}

document.addEventListener("change", e=>{
  const el = e.target;
  if (el.dataset.step){
    const id = el.dataset.step;
    if (el.checked) state.done[id] = Date.now(); else delete state.done[id];
    touch(); render();
    if (el.checked) toast(hasEv(id) ? "Etapa concluída. Continue assim!" : "Etapa concluída. Registre a evidência para o seu portfólio.");
  }
  if (el.dataset.goal){ const g = state.goals.find(x=>x.id===el.dataset.goal); if (g){ g.done = el.checked; touch(); render(); } }
});
document.addEventListener("click", async e=>{
  const b = e.target.closest("[data-track],[data-phase],[data-goto],[data-copy],[data-delgoal],[data-evedit],[data-evdel],[data-evcancel],[data-scroll],#doimp,#reset1,#reset2,#reset0");
  if (!b) return;
  if (b.dataset.track){ selTrack = b.dataset.track; selPhase = -1; render(); window.scrollTo(0,0); }
  else if (b.dataset.phase !== undefined){ selPhase = Number(b.dataset.phase); render(); }
  else if (b.dataset.goto){
    selTrack = b.dataset.goto; selPhase = -1; const focus = b.dataset.stepFocus;
    if (curView()==="trilhas"){ e.preventDefault(); render(); }
    setTimeout(()=>{ const el = focus && document.getElementById("step-"+focus); if (el) el.scrollIntoView({block:"center"}); else window.scrollTo(0,0); }, 30);
  }
  else if (b.dataset.scroll){ e.preventDefault(); const el=document.getElementById(b.dataset.scroll); if (el) el.scrollIntoView({behavior:"smooth"}); }
  else if (b.dataset.copy){ const src = document.getElementById(b.dataset.copy); const txt = src.value ?? src.textContent; try { await navigator.clipboard.writeText(txt); toast("Copiado"); } catch(err){ if (src.select) src.select(); toast("Selecionei o texto: copie com Cmd+C"); } }
  else if (b.dataset.delgoal){ state.goals = state.goals.filter(g=>g.id!==b.dataset.delgoal); touch(); render(); }
  else if (b.dataset.evedit){ editingEv = b.dataset.evedit; render(); }
  else if (b.dataset.evcancel){ editingEv = null; render(); }
  else if (b.dataset.evdel){ delete state.ev[b.dataset.evdel]; editingEv = null; touch(); render(); toast("Evidência removida"); }
  else if (b.id==="doimp"){
    try { const s = JSON.parse($("#imp").value); if (!s || typeof s!=="object" || !s.done) throw 0; state = normalize(s); touch(); render(); toast("Backup importado"); }
    catch(err){ toast("Não reconheci esse backup. Cole o texto completo que você exportou."); }
  }
  else if (b.id==="reset1"){ $("#resetbox").innerHTML = `<p><b>Tem certeza?</b> Isso não pode ser desfeito.</p><div class="row"><button class="btn danger" id="reset2">Sim, apagar tudo</button><button class="btn ghost" id="reset0">Cancelar</button></div>`; }
  else if (b.id==="reset0"){ render(); }
  else if (b.id==="reset2"){ state = {done:{},ev:{},goals:[],log:[],updated:0}; touch(); render(); toast("Progresso apagado"); }
});
document.addEventListener("submit", e=>{
  const f = e.target;
  if (f.dataset.ev){
    e.preventDefault();
    const id = f.dataset.ev, t = f.elements.t.value.trim(), u = f.elements.u.value.trim();
    if (!t) return;
    state.ev[id] = {t, u, at:Date.now()}; editingEv = null;
    touch(); render(); toast("Evidência salva no portfólio"); return;
  }
  if (f.id==="gform"){
    e.preventDefault();
    const text = $("#g-text").value.trim(); if (!text) return;
    state.goals.push({id:"g"+Date.now().toString(36), text, due:$("#g-due").value||"", area:$("#g-area").value, done:false, at:Date.now()});
    touch(); render(); toast("Meta adicionada");
  }
  if (f.id==="lform"){
    e.preventDefault();
    const text = $("#l-text").value.trim(); if (!text) return;
    state.log.unshift({at:Date.now(), text}); state.log = state.log.slice(0,300);
    touch(); render(); toast("Entrada salva");
  }
});
document.addEventListener("input", e=>{ if (e.target.id==="gq"){ glossQ = e.target.value; $("#glist").innerHTML = glossList(); } });
window.addEventListener("hashchange", ()=>{ const v = curView(); render(); if (location.hash.startsWith("#fase-")){ const el=document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); } else if (v!=="trilhas") window.scrollTo(0,0); });

function boot(){ render(); connectDb(); }
