(function(){
const q = (r,s) => r.querySelector(s), qa = (r,s) => [...r.querySelectorAll(s)];
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
function setupCanvas(cv, w, h){ const d = window.devicePixelRatio || 1; cv.width = w*d; cv.height = h*d; cv.style.width = "100%"; cv.style.maxWidth = w+"px"; cv.style.aspectRatio = w+"/"+h; const c = cv.getContext("2d"); c.setTransform(d,0,0,d,0,0); return c; }
const ls = { get(k,d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }, set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} } };

Object.assign(STEP_LABS, {a1:["forget"], a2:["srs"], a3:["focus"], a4:["review"], b3:["term"], b4:["logic"], b6:["os"], b8:["security"]});
STEP_LABS.b7 = (STEP_LABS.b7||[]).concat("logic");
["a1","a2","a3","a4","b3","b4","b6","b8"].forEach(k => delete PLANNED[k]);

const st = document.createElement("style");
st.textContent = `
.days{display:grid;grid-template-columns:repeat(15,1fr);gap:4px}.days button{border:1px solid var(--line);background:var(--surface);border-radius:6px;font:600 12px var(--mono);padding:6px 0;cursor:pointer}.days button[aria-pressed="true"]{background:var(--accent);color:#fff;border-color:var(--accent)}
.cv{background:var(--paper);border:1px solid var(--line);border-radius:10px}
.boxes{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.box{border:2px solid var(--line);border-radius:10px;padding:8px;text-align:center;background:var(--paper)}.box b{font-family:var(--display);font-size:22px;display:block}.box.due{border-color:var(--warn)}
.flash{perspective:900px;min-height:170px}.flash .card{min-height:170px;display:grid;place-items:center;text-align:center;font-size:20px;cursor:pointer}.flash .card .t{font-family:var(--display);font-size:28px;font-weight:800}
.timer{display:grid;justify-items:center;gap:10px}.timer .big{font:800 clamp(48px,9vw,84px) var(--display);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.term2{background:#0c1118;color:#d6e2f0;font:14px/1.5 var(--mono);border-radius:12px;padding:12px;min-height:280px;max-height:420px;overflow:auto;cursor:text}.term2 .pr{color:#7ee787}.term2 .dir{color:#79c0ff;font-weight:700}.term2 .err{color:#ff7b72}.term2 input{background:transparent;border:0;color:inherit;font:inherit;outline:none;width:60%}
.missions{list-style:none;padding:0;margin:0;display:grid;gap:6px}.missions li{display:flex;gap:8px;align-items:baseline;font-size:15px}.missions li.ok{color:var(--ok)}.missions li.ok::before{content:"✓";font-weight:800}.missions li:not(.ok)::before{content:"○";color:var(--muted)}
.gate{display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center}.lsw{width:64px;height:64px;border-radius:12px;border:2px solid var(--line);background:var(--surface);font:800 22px var(--mono);cursor:pointer}.lsw.on{background:var(--mark);border-color:var(--accent)}
.bulb{width:64px;height:64px;border-radius:50%;background:var(--line);display:grid;place-items:center;font:800 22px var(--mono)}.bulb.on{background:var(--mark);box-shadow:0 0 24px var(--mark)}
.tt td,.tt th{text-align:center;font-family:var(--mono)}.tt tr.cur td{background:color-mix(in srgb,var(--mark) 40%,transparent);font-weight:800}
.gantt{display:flex;gap:2px;flex-wrap:wrap;min-height:44px;align-items:stretch;background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:6px}.gantt span{min-width:22px;padding:4px 2px;border-radius:5px;color:#fff;font:700 11px var(--mono);text-align:center}
.procs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.proc{border:2px solid var(--line);border-radius:10px;padding:8px;font-size:14px;background:var(--surface)}.proc.run{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}.proc.fin{opacity:.55}
.meter{height:14px;border-radius:99px;background:var(--line);overflow:hidden}.meter span{display:block;height:100%;transition:width .3s}
.msg{border:1px solid var(--line);border-radius:12px;padding:14px;background:var(--surface);display:grid;gap:6px}.msg .from{font:600 13px var(--mono);color:var(--muted)}.flag{background:color-mix(in srgb,var(--warn) 18%,transparent);border-radius:4px;padding:0 3px}
.weeks{display:flex;align-items:flex-end;gap:6px;height:140px;padding:8px;background:var(--paper);border:1px solid var(--line);border-radius:10px}.weeks div{flex:1;display:grid;justify-items:center;gap:4px;font:11px var(--mono);color:var(--muted)}.weeks i{display:block;width:100%;background:var(--accent);border-radius:4px 4px 0 0;min-height:2px}
`;
document.head.appendChild(st);

lab({id:"forget", tr:"aprender", area:"sw", title:"Curva do esquecimento",
 blurb:"Escolha os dias em que você revisa e veja quanto da matéria continua na sua memória depois de 30 dias.",
 learn:["Sem revisão, esquecemos a maior parte em poucos dias.","Cada revisão faz a memória durar mais que a anterior.","Testar a si mesmo (recuperação ativa) fortalece mais do que reler."],
 html:()=>`<div class="row wrap ctrls"><span class="small muted">Atalhos:</span><button class="btn ghost sm" data-pre="none">Sem revisão</button><button class="btn ghost sm" data-pre="cram">Tudo na véspera da prova</button><button class="btn ghost sm" data-pre="spaced">Espaçado: dias 1, 3, 7, 14</button>
 <label class="f inline" for="fmode">Como revisa <select id="fmode"><option value="active">Testando a si mesmo</option><option value="reread">Só relendo</option></select></label></div>
 <div class="k">Clique nos dias em que você revisa</div><div class="days" id="fdays"></div>
 <canvas id="fcv" class="cv"></canvas>
 <div class="readout"><div><span class="k">Lembra no dia 30</span><b id="fr30"></b></div><div><span class="k">Revisões</span><b id="fn"></b></div><div><span class="k">Minutos gastos (10 por revisão)</span><b id="fmin"></b></div></div>
 <div class="note" id="fnote"></div>`,
 mount(root){
  let rev = new Set([1,3,7,14]);
  const cv=q(root,"#fcv"), W=640, H=260, c=setupCanvas(cv,W,H);
  q(root,"#fdays").innerHTML = Array.from({length:30},(_,i)=>`<button data-d="${i+1}">${i+1}</button>`).join("");
  function sim(){ const mult = q(root,"#fmode").value==="active" ? 2.6 : 1.4; let S=1.2, last=0; const pts=[]; for(let t=0;t<=30;t+=0.1){ const day=Math.round(t*10)/10; if (rev.has(Math.round(day)) && Math.abs(day-Math.round(day))<0.05 && Math.round(day)>last){ last=Math.round(day); S*=mult; } pts.push([t, Math.exp(-(t-last)/S)]); } return pts; }
  function draw(){
    qa(root,"#fdays button").forEach(b=>b.setAttribute("aria-pressed", rev.has(+b.dataset.d)));
    const pts=sim(); c.clearRect(0,0,W,H);
    const X=t=>40+t*(W-60)/30, Y=r=>H-30-r*(H-50);
    c.strokeStyle=css("--line"); c.fillStyle=css("--muted"); c.font="11px system-ui"; c.lineWidth=1;
    [0,.25,.5,.75,1].forEach(r=>{ c.beginPath(); c.moveTo(40,Y(r)); c.lineTo(W-20,Y(r)); c.stroke(); c.fillText(Math.round(r*100)+"%",6,Y(r)+4); });
    [0,5,10,15,20,25,30].forEach(d=>c.fillText("dia "+d,X(d)-14,H-10));
    c.beginPath(); pts.forEach(([t,r],i)=>i?c.lineTo(X(t),Y(r)):c.moveTo(X(t),Y(r))); c.lineTo(X(30),Y(0)); c.lineTo(X(0),Y(0)); c.closePath(); c.fillStyle=css("--accent")+"22"; c.fill();
    c.beginPath(); pts.forEach(([t,r],i)=>i?c.lineTo(X(t),Y(r)):c.moveTo(X(t),Y(r))); c.strokeStyle=css("--accent"); c.lineWidth=3; c.stroke();
    rev.forEach(d=>{ c.fillStyle=css("--warn"); c.beginPath(); c.arc(X(d),Y(1),5,0,7); c.fill(); });
    const r30=pts[pts.length-1][1]; q(root,"#fr30").textContent=Math.round(r30*100)+"%"; q(root,"#fn").textContent=rev.size; q(root,"#fmin").textContent=rev.size*10;
    q(root,"#fnote").textContent = rev.size===0 ? "Sem nenhuma revisão, quase tudo some em uma semana. Por isso estudar uma vez só não basta." :
      r30>0.7 ? "Excelente: poucas revisões bem espaçadas mantêm a matéria viva por muito mais tempo. O Anki faz esse cálculo para você." :
      r30>0.35 ? "Melhorou, mas dá para espaçar melhor. Tente revisões cada vez mais distantes: 1, 3, 7, 14 dias." : "Revisões concentradas no fim ajudam no dia da prova, mas a memória cai rápido depois.";
  }
  root.addEventListener("click", e=>{ const d=e.target.closest("[data-d]"); if(d){ const n=+d.dataset.d; rev.has(n)?rev.delete(n):rev.add(n); draw(); }
    const p=e.target.closest("[data-pre]"); if(p){ rev = new Set({none:[],cram:[27,28,29],spaced:[1,3,7,14]}[p.dataset.pre]); draw(); } });
  root.addEventListener("change", draw);
  draw();
 }});

lab({id:"srs", tr:"aprender", area:"sw", title:"Flashcards com repetição espaçada",
 blurb:"Estude os termos do Glossário com o método das caixas de Leitner: acertou, a carta demora mais para voltar.",
 learn:["Cartas que você erra voltam logo; as que você sabe aparecem cada vez menos.","Primeiro tente lembrar, depois vire a carta.","É o mesmo princípio do Anki, que você vai usar no dia a dia."],
 html:()=>`<div class="boxes" id="sboxes"></div>
 <div class="row wrap ctrls"><span class="pill" id="sday"></span><button class="btn ghost sm" id="snextday">Avançar 1 dia</button><button class="btn ghost sm" id="sreset">Recomeçar</button><label class="f inline" for="scat">Tema <select id="scat">${GLOSS.map(([c],i)=>`<option value="${i}">${esc(c)}</option>`).join("")}</select></label></div>
 <div class="flash"><div class="card" id="scard" tabindex="0" role="button" aria-label="Virar carta"></div></div>
 <div class="row wrap ctrls" id="sbtns"></div><p class="small muted">Caixa 1: revisa todo dia · Caixa 2: a cada 2 dias · Caixa 3: a cada 4 · Caixa 4: a cada 8 · Caixa 5: a cada 16. Seu progresso fica salvo neste navegador.</p>`,
 mount(root){
  const EVERY=[1,2,4,8,16];
  let S = ls.get("pp-srs", null);
  function fresh(cat){ return {cat, day:1, cards:GLOSS[cat][1].map(([t,d])=>({t,d,box:0,last:0})), i:-1, flipped:false}; }
  if (!S || !GLOSS[S.cat]) S = fresh(0);
  q(root,"#scat").value = S.cat;
  const due = () => S.cards.map((c,i)=>i).filter(i => S.cards[i].last===0 || (S.day - S.cards[i].last) >= EVERY[S.cards[i].box]);
  function pick(){ const d=due().filter(i=>S.cards[i].last!==S.day); S.i = d.length ? d[Math.floor(Math.random()*d.length)] : -1; S.flipped=false; }
  function draw(){
    q(root,"#sday").textContent=`Dia ${S.day}`;
    const dueSet=new Set(due().filter(i=>S.cards[i].last!==S.day));
    q(root,"#sboxes").innerHTML=EVERY.map((e,b)=>{ const n=S.cards.filter(c=>c.box===b).length, dn=S.cards.filter((c,i)=>c.box===b&&dueSet.has(i)).length; return `<div class="box ${dn?"due":""}"><span class="small muted">Caixa ${b+1}</span><b>${n}</b><span class="small muted">${dn?dn+" para hoje":"em dia"}</span></div>`; }).join("");
    const card=q(root,"#scard"), btns=q(root,"#sbtns");
    if (S.i<0){ card.innerHTML=`<div><div class="t">Tudo revisado hoje!</div><p class="muted">Clique em “Avançar 1 dia” para ver quais cartas voltam.</p></div>`; btns.innerHTML=""; }
    else { const c=S.cards[S.i]; card.innerHTML = S.flipped ? `<div><div class="t">${esc(c.t)}</div><p style="margin-top:8px">${esc(c.d)}</p></div>` : `<div><div class="t">${esc(c.t)}</div><p class="muted">O que significa? Pense antes de virar.</p></div>`;
      btns.innerHTML = S.flipped ? `<button class="btn danger" data-a="0">Errei: volta para a caixa 1</button><button class="btn" data-a="1">Acertei: sobe uma caixa</button>` : `<button class="btn" data-a="flip">Virar carta</button>`; }
    ls.set("pp-srs", S);
  }
  root.addEventListener("click", e=>{
    const a=e.target.closest("[data-a]"); if (e.target.closest("#scard") && S.i>=0 && !S.flipped){ S.flipped=true; draw(); return; }
    if (a){ if (a.dataset.a==="flip"){ S.flipped=true; } else { const c=S.cards[S.i]; c.box = a.dataset.a==="1" ? Math.min(4,c.box+1) : 0; c.last=S.day; pick(); } draw(); }
    if (e.target.id==="snextday"){ S.day++; pick(); draw(); }
    if (e.target.id==="sreset"){ S=fresh(+q(root,"#scat").value); pick(); draw(); }
  });
  root.addEventListener("keydown", e=>{ if(e.target.id==="scard"&&(e.key==="Enter"||e.key===" ")){ e.preventDefault(); if(S.i>=0){ S.flipped=true; draw(); } } });
  root.addEventListener("change", e=>{ if(e.target.id==="scat"){ S=fresh(+e.target.value); pick(); draw(); } });
  if (S.i<0 || !S.cards[S.i]) pick(); draw();
 }});

lab({id:"focus", tr:"aprender", area:"sw", title:"Timer de foco",
 blurb:"Blocos de foco com pausas, no ritmo da sua Rotina. O tempo continua contando mesmo se você trocar de aba.",
 learn:["Um bloco curto e sem distração rende mais que horas com o celular por perto.","A pausa faz parte do método: o cérebro consolida o que viu.","Registrar as sessões mostra quanto você realmente estudou."],
 html:()=>`<div class="timer"><div class="filters" role="group" aria-label="Duração">${[[25,5],[40,10],[50,10]].map(([f,p])=>`<button data-len="${f}|${p}">${f} min + ${p} de pausa</button>`).join("")}</div>
 <span class="pill" id="fphase"></span><div class="big" id="fclock">25:00</div><div class="bar" style="width:min(420px,90%)"><span id="fbar" style="width:0%"></span></div>
 <div class="row wrap"><button class="btn" id="fstart">Começar</button><button class="btn ghost" id="fskip">Pular etapa</button><button class="btn ghost" id="freset">Zerar</button></div></div>
 <div class="two-even"><div class="infobox"><b>Antes de começar</b><label class="chk" for="fc1"><input type="checkbox" id="fc1"><span>Celular em outro cômodo ou no modo foco</span></label><label class="chk" for="fc2"><input type="checkbox" id="fc2"><span>Uma única tarefa escolhida (uma etapa das trilhas)</span></label><label class="chk" for="fc3"><input type="checkbox" id="fc3"><span>Água por perto e abas desnecessárias fechadas</span></label></div>
 <div class="infobox"><b>Hoje</b><div class="readout"><div><span class="k">Blocos de foco</span><b id="fdone">0</b></div><div><span class="k">Minutos focados</span><b id="fmins">0</b></div></div><div class="small muted" id="fhist"></div></div></div>`,
 mount(root){
  const today=()=>new Date().toISOString().slice(0,10);
  let T = ls.get("pp-focus", {f:25,p:5,phase:"foco",end:0,left:25*60,running:false,log:{}});
  let ctx=null;
  function beep(){ try { ctx = ctx || new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.value=880; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(.2,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.8); o.start(); o.stop(ctx.currentTime+.8); } catch(e){} }
  const total=()=> (T.phase==="foco"?T.f:T.p)*60;
  function remaining(){ return T.running ? Math.max(0, Math.round((T.end-Date.now())/1000)) : T.left; }
  function finish(){
    if (T.phase==="foco"){ const d=today(); T.log[d]=T.log[d]||{n:0,m:0}; T.log[d].n++; T.log[d].m+=T.f; T.phase="pausa"; toast("Bloco concluído! Hora da pausa."); }
    else { T.phase="foco"; toast("Pausa acabou. Bora para o próximo bloco."); }
    T.left=total(); T.running=false; beep(); save(); draw();
  }
  function save(){ ls.set("pp-focus", T); }
  function draw(){
    const r=remaining(); q(root,"#fclock").textContent=`${String(Math.floor(r/60)).padStart(2,"0")}:${String(r%60).padStart(2,"0")}`;
    q(root,"#fbar").style.width=(100*(1-r/total()))+"%"; q(root,"#fphase").textContent= T.phase==="foco"?"Foco":"Pausa";
    q(root,"#fstart").textContent = T.running ? "Pausar" : (r<total()?"Continuar":"Começar");
    qa(root,"[data-len]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.len===`${T.f}|${T.p}`));
    const d=T.log[today()]||{n:0,m:0}; q(root,"#fdone").textContent=d.n; q(root,"#fmins").textContent=d.m;
    const days=Object.entries(T.log).sort().slice(-7); q(root,"#fhist").textContent = days.length ? "Últimos dias: "+days.map(([k,v])=>`${k.slice(8)}/${k.slice(5,7)}: ${v.m} min`).join(" · ") : "Nenhuma sessão registrada ainda.";
  }
  labEvery(()=>{ if(T.running){ if(remaining()<=0) finish(); else draw(); } }, 500);
  root.addEventListener("click", e=>{
    const l=e.target.closest("[data-len]"); if(l&&!T.running){ const [f,p]=l.dataset.len.split("|").map(Number); T.f=f; T.p=p; T.phase="foco"; T.left=f*60; save(); draw(); }
    if(e.target.id==="fstart"){ if(T.running){ T.left=remaining(); T.running=false; } else { T.end=Date.now()+remaining()*1000; T.running=true; beep(); } save(); draw(); }
    if(e.target.id==="fskip"){ T.running=false; finish(); }
    if(e.target.id==="freset"){ T.running=false; T.phase="foco"; T.left=T.f*60; save(); draw(); }
  });
  draw();
 }});

lab({id:"review", tr:"aprender", area:"sw", title:"Painel de revisão mensal",
 blurb:"Um retrato do seu mês gerado pelo seu próprio progresso, com perguntas guiadas que viram uma entrada no Diário de bordo.",
 learn:["Revisar o mês mostra o que funcionou e o que precisa mudar.","Números reais vencem a sensação de “não fiz nada”.","Escrever a revisão ajuda a decidir o próximo passo."],
 html:()=>`<div class="readout" id="rstats"></div><div class="k">Etapas concluídas por semana (últimas 8)</div><div class="weeks" id="rweeks"></div>
 <div class="two-even"><label class="f" for="rq1">O que eu concluí e me deixou orgulhoso?<textarea id="rq1"></textarea></label><label class="f" for="rq2">Onde eu travei e por quê?<textarea id="rq2"></textarea></label></div>
 <label class="f" for="rq3">O que vou mudar no próximo mês?<textarea id="rq3"></textarea></label>
 <div class="row wrap"><button class="btn" id="rsave">Salvar revisão no Diário de bordo</button><a class="small" href="#metas">Ver o Diário</a></div>`,
 mount(root){
  const now=new Date(), mStart=new Date(now.getFullYear(),now.getMonth(),1).getTime();
  const doneTs=Object.entries(state.done).map(([k,v])=>[k,Number(v)||0]);
  const month=doneTs.filter(([,t])=>t>=mStart), hrs=month.reduce((a,[k])=>a+(HOURS[k]||0),0);
  const evM=Object.values(state.ev).filter(e=>e.at>=mStart).length, logM=state.log.filter(l=>l.at>=mStart).length;
  const goalsLate=state.goals.filter(g=>!g.done&&g.due&&g.due<now.toISOString().slice(0,10)).length;
  q(root,"#rstats").innerHTML=[["Etapas no mês",month.length],["Horas estimadas",hrs+" h"],["Evidências no mês",evM],["Entradas no diário",logM],["Metas atrasadas",goalsLate]].map(([k,v])=>`<div><span class="k">${k}</span><b>${v}</b></div>`).join("");
  const W=7*864e5, weeks=Array.from({length:8},(_,i)=>{ const end=now.getTime()-(7-i)*W+W, start=end-W; return {n:doneTs.filter(([,t])=>t>=start&&t<end).length, label:new Date(start).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}; });
  const mx=Math.max(1,...weeks.map(w=>w.n));
  q(root,"#rweeks").innerHTML=weeks.map(w=>`<div><span>${w.n}</span><i style="height:${Math.max(2,w.n/mx*90)}px"></i><span>${w.label}</span></div>`).join("");
  root.addEventListener("click", e=>{ if(e.target.id!=="rsave") return; const a=q(root,"#rq1").value.trim(), b=q(root,"#rq2").value.trim(), c=q(root,"#rq3").value.trim();
    if(!a&&!b&&!c){ toast("Responda pelo menos uma pergunta."); return; }
    const mes=now.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
    state.log.unshift({at:Date.now(), text:`Revisão de ${mes}: ${month.length} etapas, ~${hrs} h, ${evM} evidências.\nConcluí: ${a||"—"}\nTravei: ${b||"—"}\nVou mudar: ${c||"—"}`}); touch(); toast("Revisão salva no Diário de bordo"); qa(root,"textarea").forEach(t=>t.value=""); });
 }});

lab({id:"term", tr:"base", area:"sw", title:"Terminal: seus primeiros comandos",
 blurb:"Um terminal de verdade simulado, como o zsh do seu Mac. Cumpra as missões usando pwd, ls, cd, mkdir, touch, cat e mais.",
 learn:["O terminal faz por texto o que o Finder faz com cliques.","Caminhos mostram onde você está: ~ é a sua pasta pessoal.","Digite help para ver os comandos; seta para cima repete o anterior."],
 html:()=>`<div class="two-even" style="grid-template-columns:1.6fr 1fr"><div class="term2" id="tbox"><div id="tout2"></div><div><span class="pr" id="tps"></span> <input id="tin" aria-label="Comando" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
 <div class="infobox"><b>Missões</b><ul class="missions" id="tmis"></ul><button class="btn ghost sm" id="treset2">Recomeçar</button></div></div>`,
 mount(root){
  const M=[["Descubra onde você está (pwd)",h=>h.includes("pwd")],["Liste os arquivos (ls)",h=>h.some(x=>x.startsWith("ls"))],["Entre na pasta Documentos (cd)",(h,fs,cwd)=>cwd==="/Users/marcio/Documentos"],["Crie a pasta projetos (mkdir)",(h,fs)=>!!fs["/Users/marcio/Documentos/projetos"]],["Crie o arquivo ola.py dentro de projetos (touch)",(h,fs)=>"/Users/marcio/Documentos/projetos/ola.py" in fs],["Escreva nele: echo \"print('oi')\" > ola.py",(h,fs)=>(fs["/Users/marcio/Documentos/projetos/ola.py"]||"").includes("print")],["Leia o arquivo (cat)",h=>h.some(x=>x.startsWith("cat"))],["Volte uma pasta (cd ..)",h=>h.includes("cd ..")]];
  const HOME="/Users/marcio";
  let fs, cwd, hist, hi;
  function reset(){ fs={"/":"d","/Users":"d",[HOME]:"d",[HOME+"/Documentos"]:"d",[HOME+"/Downloads"]:"d",[HOME+"/Desktop"]:"d",[HOME+"/Documentos/notas.txt"]:"Estudar Git amanhã.\n",[HOME+"/Downloads/foto.png"]:"(imagem)"}; cwd=HOME; hist=[]; hi=0; q(root,"#tout2").innerHTML=""; print("Bem-vindo ao terminal simulado. Digite help para ver os comandos."); draw(); }
  const short=p=>p.replace(HOME,"~");
  function norm(p){ if(!p||p==="~") return HOME; if(p.startsWith("~")) p=HOME+p.slice(1); if(!p.startsWith("/")) p=cwd+"/"+p; const out=[]; p.split("/").forEach(s=>{ if(!s||s===".") return; if(s==="..") out.pop(); else out.push(s); }); return "/"+out.join("/"); }
  const isDir=p=>fs[p]==="d", exists=p=>p in fs;
  const kids=p=>Object.keys(fs).filter(k=>k!==p&&k.startsWith(p==="/"?"/":p+"/")&&!k.slice(p==="/"?1:p.length+1).includes("/")).map(k=>k.split("/").pop()).sort();
  function print(t,cls){ const d=document.createElement("div"); if(cls) d.className=cls; d.innerHTML=t; q(root,"#tout2").appendChild(d); const b=q(root,"#tbox"); b.scrollTop=b.scrollHeight; }
  function run(line){
    print(`<span class="pr">marcio@MacBook ${esc(short(cwd))} %</span> ${esc(line)}`);
    const m=line.match(/^echo\s+(.+?)\s*(>>?)\s*(\S+)$/); if(m){ const p=norm(m[3]); const txt=m[1].replace(/^["']|["']$/g,"")+"\n"; if(isDir(p)) return print("zsh: é uma pasta","err"); fs[p]= m[2]===">>" ? (fs[p]||"")+txt : txt; return; }
    const [cmd,...a]=line.trim().split(/\s+/); const arg=a.join(" ");
    const H={
     help:()=>print("pwd · ls · cd PASTA · cd .. · mkdir NOME · touch ARQUIVO · cat ARQUIVO · echo TEXTO > ARQUIVO · rm ARQUIVO · mv A B · cp A B · tree · clear · whoami · date · history"),
     pwd:()=>print(esc(cwd)),
     ls:()=>{ const p=norm(arg||"."); if(!isDir(p)) return print(`ls: ${esc(arg)}: pasta não encontrada`,"err"); const k=kids(p); print(k.length?k.map(n=>isDir(p==="/"?"/"+n:p+"/"+n)?`<span class="dir">${esc(n)}/</span>`:esc(n)).join("   "):'<span class="muted">(vazia)</span>'); },
     cd:()=>{ const p=norm(arg); if(!isDir(p)) return print(`cd: pasta não encontrada: ${esc(arg)}`,"err"); cwd=p; },
     mkdir:()=>{ if(!arg) return print("mkdir: diga o nome da pasta","err"); const p=norm(arg); if(exists(p)) return print("mkdir: já existe","err"); fs[p]="d"; },
     touch:()=>{ if(!arg) return print("touch: diga o nome do arquivo","err"); const p=norm(arg); if(!exists(p)) fs[p]=""; },
     cat:()=>{ const p=norm(arg); if(!exists(p)) return print(`cat: ${esc(arg)}: arquivo não encontrado`,"err"); if(isDir(p)) return print("cat: isso é uma pasta","err"); print(esc(fs[p]||"").replace(/\n/g,"<br>")||'<span class="muted">(arquivo vazio)</span>'); },
     rm:()=>{ const p=norm(arg); if(!exists(p)) return print("rm: não encontrado","err"); if(isDir(p)) return print("rm: para apagar pasta use rm -r (aqui está desativado por segurança)","err"); delete fs[p]; print('<span class="muted">Apagado. No terminal não existe lixeira: cuidado!</span>'); },
     mv:()=>{ const [x,y]=a; const s=norm(x), d=norm(y); if(!exists(s)||isDir(s)) return print("mv: arquivo não encontrado","err"); const dest=isDir(d)?d+"/"+s.split("/").pop():d; fs[dest]=fs[s]; delete fs[s]; },
     cp:()=>{ const [x,y]=a; const s=norm(x), d=norm(y); if(!exists(s)||isDir(s)) return print("cp: arquivo não encontrado","err"); fs[isDir(d)?d+"/"+s.split("/").pop():d]=fs[s]; },
     tree:()=>{ const walk=(p,pre)=>kids(p).map(n=>{ const f=p==="/"?"/"+n:p+"/"+n; return pre+(isDir(f)?`<span class="dir">${esc(n)}/</span>`:esc(n))+(isDir(f)?"<br>"+walk(f,pre+"&nbsp;&nbsp;&nbsp;"):""); }).join("<br>"); print(esc(short(cwd))+"<br>"+walk(cwd,"&nbsp;&nbsp;")); },
     clear:()=>{ q(root,"#tout2").innerHTML=""; },
     whoami:()=>print("marcio"), date:()=>print(esc(new Date().toString())), history:()=>print(hist.map((h,i)=>`${i+1}  ${esc(h)}`).join("<br>"))
    };
    if(!cmd) return; if(H[cmd]) H[cmd](); else print(`zsh: comando não encontrado: ${esc(cmd)}. Digite help.`,"err");
  }
  function draw(){ q(root,"#tps").textContent=`marcio@MacBook ${short(cwd)} %`; q(root,"#tmis").innerHTML=M.map(([t,f])=>`<li class="${f(hist,fs,cwd)?"ok":""}">${esc(t)}</li>`).join(""); }
  root.addEventListener("keydown", e=>{ if(e.target.id!=="tin") return; const inp=e.target;
    if(e.key==="Enter"){ const v=inp.value; inp.value=""; if(v.trim()) hist.push(v.trim()); hi=hist.length; run(v); draw(); if(M.every(([,f])=>f(hist,fs,cwd))) print('<b style="color:#7ee787">Todas as missões cumpridas! Agora tente no Terminal do seu Mac.</b>'); }
    if(e.key==="ArrowUp"){ e.preventDefault(); if(hi>0){ hi--; inp.value=hist[hi]; } }
    if(e.key==="ArrowDown"){ e.preventDefault(); if(hi<hist.length-1){ hi++; inp.value=hist[hi]; } else { hi=hist.length; inp.value=""; } } });
  root.addEventListener("click", e=>{ if(e.target.closest("#tbox")) q(root,"#tin").focus(); if(e.target.id==="treset2") reset(); });
  reset();
 }});

lab({id:"logic", tr:"base", area:"hw", title:"Portas lógicas e o meio-somador",
 blurb:"Ligue as entradas A e B, troque a porta lógica e veja a tabela-verdade. Depois junte duas portas e faça o computador somar.",
 learn:["Tudo no computador é feito de portas lógicas com 0 e 1.","AND precisa das duas entradas; OR, de pelo menos uma; XOR, de exatamente uma.","Com XOR e AND você monta um circuito que soma: é assim que a CPU calcula."],
 html:()=>`<div class="filters" role="group" aria-label="Porta lógica">${["AND","OR","NOT","XOR","NAND","NOR"].map((g,i)=>`<button data-gate="${g}" aria-pressed="${i===0}">${g}</button>`).join("")}<button data-gate="HALF">Meio-somador</button></div>
 <div class="gate"><div class="grid" style="gap:10px"><button class="lsw" id="gA">A<br>0</button><button class="lsw" id="gB">B<br>0</button></div><svg id="gsvg" viewBox="0 0 260 140" style="width:100%;max-width:340px"></svg><div class="grid" style="gap:10px" id="gouts"></div></div>
 <div class="two-even"><div><div class="k">Tabela-verdade</div><table class="tt" id="gtt"></table></div><div><div class="k">Em Python</div><pre class="console" id="gpy"></pre><div class="note" id="gnote"></div></div></div>`,
 mount(root){
  let A=0,B=0,G="AND";
  const F={AND:(a,b)=>a&b,OR:(a,b)=>a|b,NOT:a=>1-a,XOR:(a,b)=>a^b,NAND:(a,b)=>1-(a&b),NOR:(a,b)=>1-(a|b)};
  const PY={AND:"a and b",OR:"a or b",NOT:"not a",XOR:"a != b   # ou a ^ b",NAND:"not (a and b)",NOR:"not (a or b)"};
  const NOTE={AND:"AND (E): só acende se A E B estiverem ligados. Ex.: a porta só abre com crachá E senha.",OR:"OR (OU): acende se pelo menos uma entrada estiver ligada. Ex.: a luz acende pelo interruptor da porta OU da cama.",NOT:"NOT (NÃO): inverte. Entra 1, sai 0. Só usa a entrada A.",XOR:"XOR (OU exclusivo): acende quando as entradas são diferentes. É a base da soma binária.",NAND:"NAND: o contrário do AND. Curiosidade: dá para construir um computador inteiro só com portas NAND.",NOR:"NOR: o contrário do OR. Só acende quando as duas entradas estão desligadas.",HALF:"Meio-somador: soma dois bits. 1 + 1 = 10 em binário, ou seja, soma 0 e “vai um” 1. Soma = A XOR B. Vai um = A AND B."};
  const shapes={AND:"M60 30 H120 A50 50 0 0 1 120 110 H60 Z",NAND:"M60 30 H120 A50 50 0 0 1 120 110 H60 Z",OR:"M55 30 Q140 30 180 70 Q140 110 55 110 Q85 70 55 30 Z",NOR:"M55 30 Q140 30 180 70 Q140 110 55 110 Q85 70 55 30 Z",XOR:"M65 30 Q150 30 185 70 Q150 110 65 110 Q95 70 65 30 Z",NOT:"M70 30 L160 70 L70 110 Z"};
  function svg(){
    const s=q(root,"#gsvg"), on=c=>c?"var(--warn)":"var(--line)";
    if(G==="HALF"){ const sum=A^B, car=A&B; s.innerHTML=`<rect x="70" y="10" width="120" height="120" rx="12" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/><text x="130" y="60" text-anchor="middle" font-size="14" fill="var(--ink)" font-weight="700">XOR → soma</text><text x="130" y="90" text-anchor="middle" font-size="14" fill="var(--ink)" font-weight="700">AND → vai um</text><line x1="0" y1="45" x2="70" y2="45" stroke="${on(A)}" stroke-width="5"/><line x1="0" y1="95" x2="70" y2="95" stroke="${on(B)}" stroke-width="5"/><line x1="190" y1="55" x2="260" y2="55" stroke="${on(sum)}" stroke-width="5"/><line x1="190" y1="90" x2="260" y2="90" stroke="${on(car)}" stroke-width="5"/>`; return; }
    const out=G==="NOT"?F.NOT(A):F[G](A,B), neg=["NAND","NOR","NOT"].includes(G), x=G==="NOT"?160:(G.includes("OR")?180:170);
    s.innerHTML=`<line x1="0" y1="${G==="NOT"?70:50}" x2="${G==="NOT"?70:72}" y2="${G==="NOT"?70:50}" stroke="${on(A)}" stroke-width="5"/>${G!=="NOT"?`<line x1="0" y1="90" x2="72" y2="90" stroke="${on(B)}" stroke-width="5"/>`:""}${G==="XOR"?`<path d="M52 30 Q82 70 52 110" fill="none" stroke="var(--ink)" stroke-width="3"/>`:""}<path d="${shapes[G]}" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>${neg?`<circle cx="${x+8}" cy="70" r="7" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>`:""}<line x1="${neg?x+15:x}" y1="70" x2="260" y2="70" stroke="${on(out)}" stroke-width="5"/><text x="${G==="NOT"?82:80}" y="76" font-size="16" font-weight="800" fill="var(--ink)">${G}</text>`;
  }
  function draw(){
    q(root,"#gA").className="lsw "+(A?"on":""); q(root,"#gA").innerHTML=`A<br>${A}`; q(root,"#gB").className="lsw "+(B?"on":""); q(root,"#gB").innerHTML=`B<br>${B}`; q(root,"#gB").style.visibility=G==="NOT"?"hidden":"visible";
    let rows, head;
    if(G==="HALF"){ q(root,"#gouts").innerHTML=`<div class="bulb ${A&B?"on":""}" title="vai um">${A&B}</div><div class="bulb ${A^B?"on":""}" title="soma">${A^B}</div><span class="small muted">vai um · soma</span>`; head="<tr><th>A</th><th>B</th><th>Vai um</th><th>Soma</th><th>Decimal</th></tr>"; rows=[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>`<tr class="${a===A&&b===B?"cur":""}"><td>${a}</td><td>${b}</td><td>${a&b}</td><td>${a^b}</td><td>${a}+${b}=${a+b}</td></tr>`).join(""); q(root,"#gpy").textContent="soma = a ^ b\nvai_um = a & b\nprint(vai_um, soma)"; }
    else if(G==="NOT"){ const o=F.NOT(A); q(root,"#gouts").innerHTML=`<div class="bulb ${o?"on":""}">${o}</div>`; head="<tr><th>A</th><th>Saída</th></tr>"; rows=[0,1].map(a=>`<tr class="${a===A?"cur":""}"><td>${a}</td><td>${1-a}</td></tr>`).join(""); q(root,"#gpy").textContent=`a = ${A?"True":"False"}\nprint(${PY[G]})  # ${o?"True":"False"}`; }
    else { const o=F[G](A,B); q(root,"#gouts").innerHTML=`<div class="bulb ${o?"on":""}">${o}</div>`; head="<tr><th>A</th><th>B</th><th>Saída</th></tr>"; rows=[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>`<tr class="${a===A&&b===B?"cur":""}"><td>${a}</td><td>${b}</td><td>${F[G](a,b)}</td></tr>`).join(""); q(root,"#gpy").textContent=`a = ${A?"True":"False"}\nb = ${B?"True":"False"}\nprint(${PY[G]})  # ${o?"True":"False"}`; }
    q(root,"#gtt").innerHTML=`<thead>${head}</thead><tbody>${rows}</tbody>`; q(root,"#gnote").textContent=NOTE[G]; svg();
  }
  root.addEventListener("click", e=>{ if(e.target.closest("#gA")){ A^=1; draw(); } if(e.target.closest("#gB")){ B^=1; draw(); }
    const g=e.target.closest("[data-gate]"); if(g){ G=g.dataset.gate; qa(root,"[data-gate]").forEach(x=>x.setAttribute("aria-pressed",x===g)); draw(); } });
  draw();
 }});

lab({id:"os", tr:"base", area:"sw", title:"Sistema operacional: quem usa a CPU agora?",
 blurb:"Veja o sistema operacional revezando a CPU entre programas. Compare “um de cada vez” com “fatias de tempo” e crie um programa travado.",
 learn:["A CPU executa um programa por vez, mas troca tão rápido que parece tudo junto.","Round Robin dá uma fatia de tempo (quantum) para cada programa.","Um programa travado não congela tudo, porque o sistema tira a vez dele."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline" for="oalg">Escalonador <select id="oalg"><option value="rr">Round Robin (fatias de tempo)</option><option value="fcfs">Um de cada vez (FCFS)</option></select></label><label class="f inline" for="oq">Fatia: <b id="oqv">2</b><input type="range" id="oq" min="1" max="6" value="2"></label>
 <button class="btn sm" id="oplay">▶ Rodar</button><button class="btn ghost sm" id="ostep">Passo</button><button class="btn ghost sm" id="oreset">Recomeçar</button><button class="btn danger sm" id="ohang">Adicionar programa travado</button></div>
 <div class="procs" id="oprocs"></div><div class="k">Linha do tempo da CPU (cada bloco = 1 unidade de tempo)</div><div class="gantt" id="ogantt"></div>
 <div class="readout"><div><span class="k">Tempo</span><b id="ot">0</b></div><div><span class="k">Espera média</span><b id="ow">–</b></div><div><span class="k">Trocas de contexto</span><b id="osw">0</b></div></div><div class="note" id="onote2"></div>`,
 mount(root){
  const BASE=[["Navegador",5,"#2747C7"],["Música",2,"#0F766E"],["Python",4,"#A21CAF"],["Antivírus",3,"#C2410C"]];
  let P,t,queue,cur,slice,gantt,switches,playing=false,tm=null;
  function reset(){ P=BASE.map(([n,b,c])=>({n,b,left:b,c,wait:0,end:-1,hang:false})); t=0; queue=P.map((_,i)=>i); cur=-1; slice=0; gantt=[]; switches=0; stop(); draw(); q(root,"#onote2").textContent="Clique em Rodar ou Passo. Observe a ordem em que os programas usam a CPU."; }
  function tick(){
    const alg=q(root,"#oalg").value, Q=+q(root,"#oq").value;
    if(cur>=0 && (P[cur].left<=0 || (alg==="rr" && slice>=Q))){ if(P[cur].left>0) queue.push(cur); cur=-1; }
    if(cur<0){ if(!queue.length){ stop(); finishNote(); return; } cur=queue.shift(); slice=0; if(gantt.length && gantt[gantt.length-1]!==cur) switches++; }
    const p=P[cur]; if(!p.hang) p.left--; slice++; gantt.push(cur); queue.forEach(i=>P[i].wait++); t++;
    if(p.left<=0&&!p.hang){ p.end=t; }
    if(t>60){ stop(); q(root,"#onote2").textContent= alg==="fcfs" ? "Travou tudo! No modo “um de cada vez”, o programa travado nunca devolve a CPU e os outros esperam para sempre." : "O programa travado continua recebendo fatias, mas os outros terminaram normalmente. Por isso o sistema não congela."; }
    draw();
  }
  function finishNote(){ const done=P.filter(p=>!p.hang); const avg=done.reduce((a,p)=>a+p.wait,0)/done.length; q(root,"#onote2").textContent = q(root,"#oalg").value==="rr" ? `Todos terminaram em ${t} unidades. Programas curtos, como a Música, terminaram cedo porque ganharam a vez rápido.` : `Todos terminaram em ${t} unidades. Repare: a Música, que é curta, esperou o Navegador inteiro terminar.`; q(root,"#ow").textContent=avg.toFixed(1); }
  function draw(){
    q(root,"#oqv").textContent=q(root,"#oq").value;
    q(root,"#oprocs").innerHTML=P.map((p,i)=>`<div class="proc ${i===cur?"run":""} ${p.left<=0&&!p.hang?"fin":""}"><b style="color:${p.c}">${esc(p.n)}</b><div class="bar thin"><span style="width:${p.hang?100:100*(p.b-p.left)/p.b}%;background:${p.c}"></span></div><span class="small muted">${p.hang?"travado (loop infinito)":p.left<=0?`terminou em t=${p.end}`:i===cur?"usando a CPU":`na fila · esperou ${p.wait}`}</span></div>`).join("");
    q(root,"#ogantt").innerHTML=gantt.map(i=>`<span style="background:${P[i].c}" title="${esc(P[i].n)}">${esc(P[i].n[0])}</span>`).join("");
    q(root,"#ot").textContent=t; q(root,"#osw").textContent=switches;
  }
  function stop(){ playing=false; clearInterval(tm); const b=q(root,"#oplay"); if(b) b.textContent="▶ Rodar"; }
  root.addEventListener("click", e=>{
    if(e.target.id==="oplay"){ if(playing) stop(); else { playing=true; e.target.textContent="❚❚ Pausar"; tm=labEvery(tick,350); } }
    if(e.target.id==="ostep"){ stop(); tick(); }
    if(e.target.id==="oreset") reset();
    if(e.target.id==="ohang"&&!P.some(p=>p.hang)){ P.push({n:"Programa travado",b:1,left:1,c:"#6b7280",wait:0,end:-1,hang:true}); queue.push(P.length-1); draw(); q(root,"#onote2").textContent="Um programa com loop infinito entrou na fila. Rode e compare os dois escalonadores."; }
  });
  root.addEventListener("change", e=>{ if(e.target.id==="oalg") reset(); });
  root.addEventListener("input", e=>{ if(e.target.id==="oq") q(root,"#oqv").textContent=e.target.value; });
  reset();
 }});

const COMMON=["123456","123456789","12345678","password","senha","senha123","qwerty","111111","abc123","iloveyou","admin","brasil","flamengo","corinthians","palmeiras","102030","marcio","000000","1q2w3e","123123"];
const MSGS=[
 {c:"E-mail",from:"suporte@banco-brasiI-seguranca.com",subj:"Sua conta será bloqueada em 24h",body:"Detectamos acesso suspeito. <span class=\"flag\">Clique agora</span> e confirme seus dados para evitar o bloqueio: <span class=\"flag\">http://bb-seguranca-atualiza.top/login</span>",scam:true,why:"Remetente falso (a letra I maiúscula imita o l), urgência para assustar e um link que não é do banco."},
 {c:"SMS",from:"+55 11 9xxxx-1234",subj:"",body:"Correios: sua encomenda está retida. Pague a <span class=\"flag\">taxa de R$ 4,90</span> em <span class=\"flag\">correios-entrega.info</span>",scam:true,why:"Os Correios não cobram taxa por SMS com link. O site não é o oficial."},
 {c:"E-mail",from:"no-reply@github.com",subj:"[GitHub] A new SSH key was added",body:"Uma nova chave foi adicionada à sua conta. Se não foi você, acesse github.com/settings/keys digitando o endereço no navegador.",scam:false,why:"Remetente oficial, nenhuma urgência exagerada e a mensagem sugere que você digite o endereço, sem clicar em link."},
 {c:"WhatsApp",from:"Número desconhecido · foto do seu diretor",subj:"",body:"Oi, sou eu, troquei de número. <span class=\"flag\">Preciso de um Pix urgente</span> de R$ 800, te devolvo amanhã. <span class=\"flag\">Não comenta com ninguém</span>.",scam:true,why:"Golpe do número novo: pressa, pedido de dinheiro e pedido de segredo. Ligue para o número antigo para confirmar."},
 {c:"E-mail",from:"classroom-noreply@google.com",subj:"Nova atividade: Lista de Python",body:"O professor publicou uma nova atividade na turma Computação 1. Abra o Google Sala de Aula para ver.",scam:false,why:"Remetente oficial do Google, sem pedido de senha nem de dinheiro e sem urgência."},
 {c:"E-mail",from:"premios@sorteio-claude-ai.net",subj:"Você ganhou um ano grátis!",body:"Parabéns! Para receber o prêmio, <span class=\"flag\">informe o número do seu cartão</span> para validação em até 1 hora.",scam:true,why:"Prêmio que você não pediu, domínio estranho e pedido de cartão. Nenhuma empresa séria pede isso por e-mail."}];
lab({id:"security", tr:"base", area:"sw", title:"Senhas fortes e golpes digitais",
 blurb:"Teste quanto tempo um ataque levaria para descobrir uma senha e treine o olho para reconhecer golpes por e-mail, SMS e WhatsApp.",
 learn:["Tamanho vale mais que complexidade: uma frase longa é mais forte que uma senha curta cheia de símbolos.","Urgência, prêmio, pedido de segredo e link estranho são sinais clássicos de golpe.","Use gerenciador de senhas e verificação em duas etapas."],
 html:()=>`<div class="two-even"><div class="infobox"><b>Teste de senha</b><p class="small warntext">Não digite uma senha que você usa de verdade. Invente uma parecida.</p>
 <div class="row"><input id="spw" type="password" class="search" autocomplete="off" placeholder="Digite uma senha de exemplo" aria-label="Senha de exemplo"><button class="btn ghost sm" id="sshow">Mostrar</button></div>
 <div class="meter"><span id="smeter"></span></div><div class="readout"><div><span class="k">Tempo para descobrir</span><b id="stime2">–</b></div><div><span class="k">Combinações</span><b id="scomb">–</b></div></div><ul class="plain small" id="stips"></ul>
 <p class="small muted">Supondo um computador testando 10 bilhões de senhas por segundo.</p></div>
 <div class="infobox"><b>É golpe ou é confiável?</b><div class="row"><span class="pill" id="pscore">0 de 0</span><span class="small muted" id="pcount"></span></div><div id="pmsg"></div><div class="row wrap" id="pbtns"></div><div id="pwhy"></div></div></div>`,
 mount(root){
  let i=0, score=0, answered=false;
  function fmt(s){ if(s<1) return "instantâneo"; const U=[["séculos",3153600000],["anos",31536000],["dias",86400],["horas",3600],["minutos",60],["segundos",1]]; for(const [n,v] of U) if(s>=v){ const x=s/v; return (x>1e6?"mais de 1 milhão de ":Math.round(x).toLocaleString("pt-BR")+" ")+n; } return "instantâneo"; }
  function pw(){
    const p=q(root,"#spw").value; let set=0; if(/[a-z]/.test(p)) set+=26; if(/[A-Z]/.test(p)) set+=26; if(/[0-9]/.test(p)) set+=10; if(/[^a-zA-Z0-9]/.test(p)) set+=33;
    const tips=[]; let comb=Math.pow(set||1,p.length); const low=p.toLowerCase();
    if(COMMON.some(c=>low.includes(c))){ comb=Math.min(comb,1e4); tips.push("Contém uma senha ou palavra muito comum: ela é testada primeiro."); }
    if(/(.)\1\1/.test(p)) tips.push("Evite repetir o mesmo caractere.");
    if(/(012|123|234|345|456|567|678|789|abc|qwe)/i.test(p)) tips.push("Sequências como 123 ou abc são fáceis de adivinhar.");
    if(p.length<12) tips.push("Use pelo menos 12 caracteres. Uma frase de 4 palavras é ótima.");
    if(!tips.length&&p) tips.push("Boa! Agora guarde num gerenciador de senhas e ative a verificação em duas etapas.");
    const secs=comb/1e10/2, bits=Math.log2(comb); const pct=Math.min(100,bits/80*100);
    q(root,"#smeter").style.width=(p?pct:0)+"%"; q(root,"#smeter").style.background= bits<40?"#c0392b":bits<60?"var(--warn)":"var(--ok)";
    q(root,"#stime2").textContent=p?fmt(secs):"–"; q(root,"#scomb").textContent=p?(comb>1e15?"10^"+Math.round(Math.log10(comb)):Math.round(comb).toLocaleString("pt-BR")):"–";
    q(root,"#stips").innerHTML=p?tips.map(t=>`<li>${esc(t)}</li>`).join(""):"<li>Compare: “Gato2026!” com “cafe azul pula janela”.</li>";
  }
  function msg(){
    const m=MSGS[i]; answered=false;
    q(root,"#pcount").textContent=`Mensagem ${i+1} de ${MSGS.length}`; q(root,"#pscore").textContent=`${score} acerto(s)`;
    q(root,"#pmsg").innerHTML=`<div class="msg"><span class="from">${esc(m.c)} · de: ${esc(m.from)}</span>${m.subj?`<b>${esc(m.subj)}</b>`:""}<p>${m.body.replace(/<span class="flag">|<\/span>/g,"")}</p></div>`;
    q(root,"#pbtns").innerHTML=`<button class="btn danger" data-ans="1">É golpe</button><button class="btn" data-ans="0">É confiável</button>`; q(root,"#pwhy").innerHTML="";
  }
  root.addEventListener("input", e=>{ if(e.target.id==="spw") pw(); });
  root.addEventListener("click", e=>{
    if(e.target.id==="sshow"){ const f=q(root,"#spw"); f.type=f.type==="password"?"text":"password"; e.target.textContent=f.type==="password"?"Mostrar":"Ocultar"; }
    const a=e.target.closest("[data-ans]"); if(a&&!answered){ answered=true; const m=MSGS[i], right=(a.dataset.ans==="1")===m.scam; if(right) score++;
      q(root,"#pmsg").querySelector("p").innerHTML=m.body; q(root,"#pscore").textContent=`${score} acerto(s)`;
      q(root,"#pwhy").innerHTML=`<div class="note"><b>${right?"Acertou!":"Não foi dessa vez."}</b> ${m.scam?"Era golpe.":"Era confiável."} ${esc(m.why)}</div>`;
      q(root,"#pbtns").innerHTML = i<MSGS.length-1 ? `<button class="btn" id="pnext">Próxima mensagem</button>` : `<b>Fim: ${score} de ${MSGS.length}.</b> <button class="btn ghost sm" id="pagain">Recomeçar</button>`; }
    if(e.target.id==="pnext"){ i++; msg(); } if(e.target.id==="pagain"){ i=0; score=0; msg(); }
  });
  pw(); msg();
 }});
})();
