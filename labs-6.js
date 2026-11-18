(function(){
const q = (r,s) => r.querySelector(s), qa = (r,s) => [...r.querySelectorAll(s)];
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const ls = { get(k,d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }, set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} } };
function setupCanvas(cv, w, h){ const d = window.devicePixelRatio || 1; cv.width = w*d; cv.height = h*d; cv.style.width = "100%"; cv.style.maxWidth = w+"px"; cv.style.aspectRatio = w+"/"+h; const c = cv.getContext("2d"); c.setTransform(d,0,0,d,0,0); return c; }
const cssv = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
function say(text, rate){
  try {
    if (!("speechSynthesis" in window)) { toast("Este navegador não tem voz sintetizada"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = rate || 0.95;
    const v = speechSynthesis.getVoices().find(v => /en[-_]US/i.test(v.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch(e){ toast("Não consegui tocar o áudio"); }
}
function copyText(t){ (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(()=>toast("Copiado"), ()=>toast("Selecione e copie com Cmd+C")); }
function download(name, text, type){ const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], {type: type||"text/plain"})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 2000); }

const MAP = {d0:"studpack", h2:"gscript", i3:"aicompare", i4:"aiethics", i9:"aimap", k8:"makerlab",
 l1:"typing", l2:"drive", l3:"sheet", l4:"gform", l5:"poster", l6:"wordstyles", l7:"crap", l8:"video", l9:"educator",
 m1:"bncc", m4:"spiral", m5:"logo", m6:"rubric", m7:"cidadania", m9:"coursesite", m10:"relato",
 n1:"leveltest", n2:"vocab", n3:"pairs", n4:"docsvocab", n5:"dialogue", n6:"reading", n7:"readme", n8:"certs",
 o1:"careerquiz", o2:"cave", o3:"market", o4:"linkedin", o5:"communities", o6:"star", o7:"portfolio", o8:"tcc", o9:"techint"};
Object.entries(MAP).forEach(([k,v]) => { STEP_LABS[k] = (STEP_LABS[k]||[]).concat(v); delete PLANNED[k]; });

const st = document.createElement("style");
st.textContent = `
.qz{display:grid;gap:10px}.qz .opt{display:block;width:100%;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:10px 12px;font:inherit;cursor:pointer}.qz .opt:hover{border-color:var(--accent)}.qz .opt.right{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--surface))}.qz .opt.wrong{border-color:var(--warn);background:color-mix(in srgb,var(--warn) 12%,var(--surface))}.qz .opt[disabled]{cursor:default}
.qz .scn{font-size:16px;line-height:1.5}.qbar{height:6px;border-radius:9px;background:var(--line);overflow:hidden}.qbar i{display:block;height:100%;background:var(--accent);transition:width .3s}
.typebox{font:20px/1.7 var(--mono);background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px;min-height:90px;overflow-wrap:anywhere}.typebox .ok{color:var(--ok)}.typebox .bad{color:#fff;background:var(--warn);border-radius:3px}.typebox .cur{border-left:2px solid var(--accent)}
.kbd{display:inline-block;font:700 13px var(--mono);border:1px solid var(--line);border-bottom-width:3px;border-radius:6px;padding:2px 7px;background:var(--surface)}
.dz{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.dz .fold{border:2px dashed var(--line);border-radius:12px;padding:10px;min-height:110px;background:var(--surface);cursor:pointer}.dz .fold.hot{border-color:var(--accent)}.dz .fold b{display:block;margin-bottom:6px}
.chipf{display:inline-flex;gap:5px;align-items:center;border:1px solid var(--line);background:var(--paper);border-radius:8px;padding:4px 8px;margin:3px;font:13px var(--mono);cursor:grab}.chipf.sel{outline:2px solid var(--accent)}.chipf.okf{border-color:var(--ok)}.chipf.badf{border-color:var(--warn)}
.ss{border-collapse:collapse;font:13px var(--mono);width:100%}.ss td,.ss th{border:1px solid var(--line);padding:0;height:28px;min-width:64px}.ss th{background:var(--paper);color:var(--muted);font-weight:600;padding:0 6px}.ss td{background:var(--surface);padding:0 6px;cursor:cell;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px}.ss td.sel{outline:2px solid var(--accent);outline-offset:-2px}.ss td.red{background:color-mix(in srgb,var(--warn) 22%,var(--surface))}.ss td.green{background:color-mix(in srgb,var(--ok) 18%,var(--surface))}.ss td.err{color:var(--warn)}
.fbar{display:flex;gap:6px;align-items:center;font:13px var(--mono)}.fbar input{flex:1;font:13px var(--mono)}
.gf{background:#f0ebf8;border-radius:12px;padding:12px;color:#202124;display:grid;gap:10px}.gf .card{background:#fff;border-radius:8px;padding:12px;border-top:8px solid #673ab7}.gf .qq{background:#fff;border-radius:8px;padding:12px;display:grid;gap:6px}.gf label{font-weight:400}.gf .btnp{background:#673ab7;color:#fff;border:0;border-radius:4px;padding:8px 18px;font-weight:600;cursor:pointer;justify-self:start}
.posterwrap{position:relative;aspect-ratio:3/4;max-width:360px;width:100%;margin:auto;border-radius:6px;overflow:hidden;touch-action:none;box-shadow:var(--shadow)}.pel{position:absolute;cursor:move;user-select:none;padding:2px}.pel.sel{outline:2px dashed #0af}.posterwrap .grid12{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(to right,rgba(0,160,255,.18) 1px,transparent 1px);background-size:calc(100%/12) 100%}
.wdoc{background:#fff;color:#222;border-radius:8px;padding:18px 22px;box-shadow:var(--shadow);font-family:Georgia,serif;display:grid;gap:4px}.wdoc p{margin:0;padding:3px 6px;border-radius:4px;cursor:pointer}.wdoc p.sel{background:#e8f0fe}.wdoc .h1{font:700 22px Calibri,Arial,sans-serif;color:#1f3864;margin-top:10px}.wdoc .h2{font:700 17px Calibri,Arial,sans-serif;color:#2f5496;margin-top:6px}.wdoc .fake{font-weight:700;font-size:20px}.wdoc .pg{border-top:1px dashed #bbb;margin:10px 0 4px;font:11px var(--mono);color:#999;text-align:right}
.toc{font-family:Georgia,serif;background:#fff;color:#222;border-radius:8px;padding:12px 16px;box-shadow:var(--shadow)}.toc div{display:flex;gap:6px}.toc div span.dots{flex:1;border-bottom:1px dotted #999;margin-bottom:5px}.toc .t2{padding-left:18px;font-size:14px}
.flyer{border-radius:10px;padding:16px;min-height:300px;transition:all .35s;font-family:system-ui;position:relative}
.vtl{position:relative;background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:26px 8px 8px;overflow-x:auto}.vtl .trk{position:relative;height:40px;margin:4px 0;background:var(--surface);border-radius:6px}.vtl .clip{position:absolute;top:3px;bottom:3px;border-radius:6px;color:#fff;font:600 11px var(--mono);padding:3px 5px;overflow:hidden;cursor:pointer;white-space:nowrap}.vtl .clip.sel{outline:2px solid var(--ink)}.vtl .ph{position:absolute;top:4px;bottom:4px;width:2px;background:#e33;pointer-events:none}.vtl .ruler{position:absolute;top:4px;left:8px;right:8px;height:16px;font:10px var(--mono);color:var(--muted);cursor:pointer}
.mapn{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}.mapn button{text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:12px;font:inherit;cursor:pointer;transition:transform .2s,opacity .2s}.mapn button.on{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent)}.mapn button.dim{opacity:.4}.mapn button b{display:block;margin-bottom:4px}
.rgrid{border-collapse:collapse;width:100%}.rgrid td,.rgrid th{border:1px solid var(--line);padding:6px;vertical-align:top;font-size:13px}.rgrid td[contenteditable]{background:var(--surface)}.rgrid td.pick{background:color-mix(in srgb,var(--accent) 22%,var(--surface))}.rgrid th[contenteditable]{background:var(--paper)}
.wordt{cursor:pointer;border-bottom:1px dotted var(--accent)}.wordt:hover{background:var(--accent-soft)}.gloss-pop{background:var(--ink);color:var(--paper);border-radius:8px;padding:8px 10px;font-size:14px;min-height:40px}
.bubble{max-width:85%;padding:8px 12px;border-radius:14px;margin:4px 0;line-height:1.4}.bubble.them{background:var(--paper);border:1px solid var(--line)}.bubble.me{background:var(--accent);color:#fff;margin-left:auto}.chatbox{display:flex;flex-direction:column;min-height:220px;max-height:340px;overflow:auto;padding:6px}
.lin{background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden}.lin .cover{height:70px;background:linear-gradient(120deg,#0a66c2,#5fa0e8)}.lin .av{width:72px;height:72px;border-radius:50%;background:#d9d9d9;border:4px solid var(--surface);margin:-36px 0 0 16px;display:grid;place-content:center;font:700 26px var(--display);color:#555}.lin .bd{padding:6px 16px 14px}
.gantt{display:grid;gap:4px;font-size:13px}.gantt .gr{display:grid;grid-template-columns:150px 1fr;gap:8px;align-items:center}.gantt .gb{position:relative;height:18px;background:var(--paper);border-radius:5px}.gantt .gb i{position:absolute;top:0;bottom:0;border-radius:5px;background:var(--accent)}.gantt .gb i.done{background:var(--ok)}
.roomg{display:grid;grid-template-columns:repeat(10,1fr);gap:2px;background:var(--line);border-radius:8px;padding:2px;aspect-ratio:10/7}.roomg div{background:var(--surface);display:grid;place-content:center;font-size:18px;cursor:pointer;position:relative}.roomg div.win{background:color-mix(in srgb,#5fa0e8 25%,var(--surface))}.roomg div.door{background:color-mix(in srgb,#c88330 30%,var(--surface))}.roomg div.out::after{content:"⚡";position:absolute;font-size:9px;right:2px;top:1px}
.shelf{display:flex;gap:6px;align-items:flex-end;flex-wrap:wrap;border-bottom:8px solid #8a5a2b;padding:6px 4px 0;min-height:130px}.book{width:34px;border-radius:3px 3px 0 0;color:#fff;font:600 11px var(--body);writing-mode:vertical-rl;transform:rotate(180deg);padding:6px 3px;cursor:pointer;text-align:left;overflow:hidden}.book.read{box-shadow:inset 0 -6px 0 #2e9e5b}.book.reading{box-shadow:inset 0 -6px 0 #e0a100}
`;
document.head.appendChild(st);

function quizEngine(root, items, opts){
  opts = opts || {};
  let i = 0, score = 0, answers = [];
  const box = q(root, opts.sel || "#qz");
  function draw(){
    if (i >= items.length){
      const res = opts.result ? opts.result(score, answers) : `<p>Você acertou <b>${score}</b> de ${items.length}.</p>`;
      box.innerHTML = `<div class="qbar"><i style="width:100%"></i></div>${res}<button class="btn sm" data-qrestart>Refazer</button>`;
      return;
    }
    const it = items[i];
    const order = opts.noShuffle ? it.o.map((_,k)=>k) : shuffle(it.o.map((_,k)=>k));
    box.innerHTML = `<div class="qbar"><i style="width:${i/items.length*100}%"></i></div><div class="small muted">${i+1} de ${items.length}${it.tag?" · "+esc(it.tag):""}</div><div class="scn">${it.q}</div>${it.say?`<button class="btn ghost sm" data-qsay>🔊 Ouvir</button>`:""}
    ${order.map(k=>`<button class="opt" data-k="${k}">${esc(it.o[k])}</button>`).join("")}<div id="qfb"></div>`;
  }
  root.addEventListener("click", e => {
    if (e.target.closest("[data-qrestart]")){ i = 0; score = 0; answers = []; draw(); return; }
    if (e.target.closest("[data-qsay]")){ say(items[i].say); return; }
    if (e.target.closest("[data-qnext]")){ i++; draw(); return; }
    const b = e.target.closest(".opt[data-k]"); if (!b || !box.contains(b) || b.disabled) return;
    const it = items[i], k = +b.dataset.k, right = it.a === undefined ? true : k === it.a;
    answers.push(k); if (it.a !== undefined && right) score++;
    qa(box, ".opt").forEach(o => { o.disabled = true; const kk = +o.dataset.k; if (it.a !== undefined && kk === it.a) o.classList.add("right"); });
    if (it.a !== undefined && !right) b.classList.add("wrong"); if (it.a === undefined) b.classList.add("right");
    const why = Array.isArray(it.w) ? it.w[k] : it.w;
    q(box, "#qfb").innerHTML = `<div class="note">${it.a===undefined?"":right?'<b class="oktext">Isso.</b> ':'<b class="warntext">Não exatamente.</b> '}${why||""}</div><button class="btn sm" data-qnext>${i+1<items.length?"Próxima":"Ver resultado"}</button>`;
  });
  draw();
}

// ================= OFFICE =================

const TYPE_TEXTS = [
 "O computador só faz o que mandamos, então precisamos explicar cada passo com clareza.",
 "Aprender a digitar sem olhar para o teclado economiza horas todas as semanas.",
 "A internet é uma rede de redes que conversam usando protocolos combinados.",
 "Um bom professor transforma dúvidas em perguntas e perguntas em descobertas.",
 "Python é uma linguagem simples de ler, por isso é ótima para começar a programar."
];
const SHORTCUTS = [
 ["Copiar", "c"], ["Colar", "v"], ["Recortar", "x"], ["Desfazer", "z"], ["Selecionar tudo", "a"], ["Salvar", "s"], ["Localizar", "f"], ["Negrito", "b"], ["Nova aba", "t"], ["Imprimir", "p"]
];
lab({id:"typing", tr:"office", area:"sw", title:"Treino de digitação e atalhos",
 blurb:"Digite o texto e veja a velocidade (palavras por minuto) e a precisão em tempo real. Depois treine os atalhos que você mais vai usar.",
 learn:["Velocidade sem precisão não ajuda: corrigir erros custa mais tempo do que digitar devagar.","Os dedos voltam sempre para a linha de base: ASDF e JKLÇ (as teclas F e J têm um relevo).","No Mac, os atalhos usam Cmd. No Windows e no Chromebook, usam Ctrl."],
 html:()=>`<div class="row wrap ctrls"><button class="btn sm" id="tynew">Novo texto</button><span class="small muted">Clique na caixa e comece a digitar. O tempo começa na primeira tecla.</span></div>
 <div class="typebox" id="tybox" tabindex="0" aria-label="Área de digitação"></div>
 <input id="tyin" autocomplete="off" autocapitalize="off" spellcheck="false" style="position:absolute;opacity:0;width:1px;height:1px" aria-label="Digitação">
 <div class="readout" style="margin-top:10px"><div><span class="k">Palavras por minuto</span><b id="tywpm">0</b></div><div><span class="k">Precisão</span><b id="tyacc">100%</b></div><div><span class="k">Tempo</span><b id="tyt">0 s</b></div><div><span class="k">Melhor marca</span><b id="tybest">–</b></div></div>
 <div class="k" style="margin-top:16px">Treino de atalhos</div>
 <div class="infobox"><div class="row wrap"><span>Faça o atalho para:</span><b id="scq" style="font-size:20px"></b><span id="schint" class="small muted"></span></div><div class="small muted" style="margin-top:6px">Clique aqui antes para o site receber o teclado. Acertos: <b id="scok">0</b> · Erros: <b id="scbad">0</b></div><div id="scfb" class="small"></div></div>`,
 mount(root){
  let text = "", typed = "", t0 = 0, errs = 0, keys = 0, done = false;
  const box = q(root,"#tybox"), inp = q(root,"#tyin"), best = () => ls.get("pp-typing-best", 0);
  function pick(){ text = TYPE_TEXTS[rnd(0,TYPE_TEXTS.length-1)]; typed = ""; t0 = 0; errs = 0; keys = 0; done = false; inp.value=""; draw(); }
  function draw(){
    box.innerHTML = [...text].map((ch,k) => { const cls = k < typed.length ? (typed[k] === ch ? "ok" : "bad") : (k === typed.length ? "cur" : ""); return `<span class="${cls}">${esc(ch)}</span>`; }).join("");
    const secs = t0 ? (Date.now()-t0)/1000 : 0, correct = [...typed].filter((c,k)=>c===text[k]).length;
    q(root,"#tywpm").textContent = secs > 1 ? Math.round(correct/5/(secs/60)) : 0;
    q(root,"#tyacc").textContent = keys ? Math.round((keys-errs)/keys*100)+"%" : "100%";
    q(root,"#tyt").textContent = Math.round(secs)+" s";
    q(root,"#tybest").textContent = best() ? best()+" ppm" : "–";
  }
  box.addEventListener("click", ()=>inp.focus()); box.addEventListener("focus", ()=>inp.focus());
  inp.addEventListener("input", () => {
    if (done) { inp.value = typed; return; }
    if (!t0) t0 = Date.now();
    const v = inp.value;
    if (v.length > typed.length){ keys++; const k = v.length-1; if (v[k] !== text[k]) errs++; }
    typed = v.slice(0, text.length); draw();
    if (typed === text){ done = true; const w = +q(root,"#tywpm").textContent; const acc = q(root,"#tyacc").textContent;
      if (w > best()) ls.set("pp-typing-best", w); draw(); toast(`Pronto: ${w} ppm com ${acc} de precisão`); }
  });
  labEvery(()=>{ if (t0 && !done) draw(); }, 500);
  q(root,"#tynew").addEventListener("click", pick);
  const mac = /Mac|iPad|iPhone/.test(navigator.platform||navigator.userAgent);
  let cur = 0, ok = 0, bad = 0;
  function nextSc(){ cur = rnd(0, SHORTCUTS.length-1); q(root,"#scq").textContent = SHORTCUTS[cur][0]; q(root,"#schint").innerHTML = ""; }
  const info = q(root,".infobox"); info.tabIndex = 0;
  info.addEventListener("keydown", e => {
    if (["Meta","Control","Shift","Alt"].includes(e.key)) return;
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    e.preventDefault();
    const want = SHORTCUTS[cur][1];
    if (e.key.toLowerCase() === want){ ok++; q(root,"#scfb").innerHTML = `<span class="oktext">Certo: <span class="kbd">${mac?"⌘ Cmd":"Ctrl"}</span> + <span class="kbd">${want.toUpperCase()}</span></span>`; nextSc(); }
    else { bad++; q(root,"#scfb").innerHTML = `<span class="warntext">Esse foi ${mac?"Cmd":"Ctrl"} + ${esc(e.key.toUpperCase())}.</span>`; q(root,"#schint").innerHTML = `Dica: <span class="kbd">${mac?"⌘":"Ctrl"}</span> + <span class="kbd">${want.toUpperCase()}</span>`; }
    q(root,"#scok").textContent = ok; q(root,"#scbad").textContent = bad;
  });
  pick(); nextSc();
 }});

const DRIVE_FILES = [
 ["Plano de aula - robótica 6A.docx","aulas"],["Notas 1º bimestre 7B.xlsx","notas"],["foto_feira_ciencias.jpg","midia"],["Prova Scratch 6A.pdf","aulas"],
 ["Lista de presença março.xlsx","notas"],["video_microbit_turma.mp4","midia"],["Certificado curso Arduino.pdf","pessoal"],["Slides - cidadania digital.pptx","aulas"],
 ["Rubrica projeto final.docx","aulas"],["Holerite fevereiro.pdf","pessoal"],["logo_clube_maker.png","midia"],["Notas recuperação 8C.xlsx","notas"]
];
lab({id:"drive", tr:"office", area:"sw", title:"Drive organizado: cada arquivo na pasta certa",
 blurb:"Toque num arquivo e depois na pasta onde ele deve ficar (ou arraste, no computador). Depois teste um padrão de nomes para achar tudo pela busca.",
 learn:["Poucas pastas com nomes claros funcionam melhor do que muitas pastas aninhadas.","Um padrão de nome (ano, turma, assunto) faz a busca do Drive achar tudo em segundos.","Compartilhe pastas, não arquivos soltos: quem entra na pasta vê tudo o que você colocar depois."],
 html:()=>`<div class="k">Arquivos soltos no Meu Drive</div><div id="dvloose" class="infobox" style="min-height:60px"></div>
 <div class="dz" id="dvfolders" style="margin-top:10px">${[["aulas","📚 Aulas"],["notas","📊 Notas e presença"],["midia","🖼 Fotos e vídeos"],["pessoal","🔒 Pessoal"]].map(([k,l])=>`<div class="fold" data-fold="${k}"><b>${l}</b><div class="fin"></div></div>`).join("")}</div>
 <div class="row wrap ctrls" style="margin-top:10px"><button class="btn sm" id="dvcheck">Conferir</button><button class="btn ghost sm" id="dvreset">Embaralhar de novo</button><span id="dvres" class="small"></span></div>
 <div class="k" style="margin-top:14px">Teste de nomes: busque como você buscaria no Drive</div>
 <div class="row wrap ctrls"><input id="dvq" placeholder="ex.: 6A, notas, 2026" style="flex:1"><label class="chk inline"><input type="checkbox" id="dvpat"> Usar padrão AAAA-turma-assunto</label></div><div id="dvhits" class="console small"></div>`,
 mount(root){
  let place = {}, sel = null;
  const fileHTML = (f,i) => `<span class="chipf${sel===i?" sel":""}" draggable="true" data-fi="${i}">${/xlsx/.test(f[0])?"📊":/jpg|png/.test(f[0])?"🖼":/mp4/.test(f[0])?"🎬":/pdf/.test(f[0])?"📕":/pptx/.test(f[0])?"📙":"📄"} ${esc(f[0])}</span>`;
  function draw(checked){
    q(root,"#dvloose").innerHTML = DRIVE_FILES.map((f,i)=>place[i]?"":fileHTML(f,i)).join("") || '<span class="small muted">Nenhum arquivo solto. Clique em Conferir.</span>';
    qa(root,".fold").forEach(fd => { const k = fd.dataset.fold; q(fd,".fin").innerHTML = DRIVE_FILES.map((f,i)=>place[i]===k? fileHTML(f,i).replace('class="chipf', `class="chipf${checked?(f[1]===k?" okf":" badf"):""}`) : "").join(""); });
  }
  root.addEventListener("click", e => {
    const c = e.target.closest("[data-fi]"); if (c){ sel = +c.dataset.fi; draw(); e.stopPropagation(); return; }
    const fd = e.target.closest("[data-fold]"); if (fd && sel !== null){ place[sel] = fd.dataset.fold; sel = null; draw(); }
  });
  root.addEventListener("dragstart", e => { const c = e.target.closest("[data-fi]"); if (c) e.dataTransfer.setData("text/plain", c.dataset.fi); });
  root.addEventListener("dragover", e => { const fd = e.target.closest("[data-fold]"); if (fd){ e.preventDefault(); fd.classList.add("hot"); } });
  root.addEventListener("dragleave", e => { const fd = e.target.closest("[data-fold]"); if (fd) fd.classList.remove("hot"); });
  root.addEventListener("drop", e => { const fd = e.target.closest("[data-fold]"); if (fd){ e.preventDefault(); fd.classList.remove("hot"); place[e.dataTransfer.getData("text/plain")] = fd.dataset.fold; draw(); } });
  q(root,"#dvcheck").addEventListener("click", () => {
    const n = Object.keys(place).length, ok = DRIVE_FILES.filter((f,i)=>place[i]===f[1]).length;
    q(root,"#dvres").innerHTML = n < DRIVE_FILES.length ? `<span class="warntext">Ainda faltam ${DRIVE_FILES.length-n} arquivos.</span>` : ok === DRIVE_FILES.length ? '<span class="oktext">Tudo no lugar. O holerite ficou na pasta pessoal, que você não compartilha com ninguém.</span>' : `<span class="warntext">${ok} de ${DRIVE_FILES.length} certos. Os de borda laranja estão na pasta errada.</span>`;
    draw(true);
  });
  q(root,"#dvreset").addEventListener("click", () => { place = {}; sel = null; q(root,"#dvres").textContent = ""; draw(); });
  const renamed = f => { const turma = (f[0].match(/\b(\d[A-C])\b/)||[])[1] || "geral"; const base = f[0].replace(/\.[a-z0-9]+$/,""), ext = f[0].split(".").pop();
    return `2026-${turma}-${base.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/-(\d[a-c])(-|$)/,"$2").replace(/^-|-$/g,"")}.${ext}`; };
  function search(){
    const qv = q(root,"#dvq").value.trim().toLowerCase(), pat = q(root,"#dvpat").checked;
    const names = DRIVE_FILES.map(f => pat ? renamed(f) : f[0]);
    const words = qv.split(/\s+/).filter(Boolean);
    const hits = words.length ? names.filter(n => words.every(w => n.toLowerCase().includes(w))) : names;
    q(root,"#dvhits").innerHTML = `<div class="muted">${hits.length} resultado(s)${pat?" com o padrão de nomes":""}:</div>` + hits.map(h=>`<div>${esc(h)}</div>`).join("");
  }
  root.addEventListener("input", e => { if (e.target.id === "dvq") search(); });
  q(root,"#dvpat").addEventListener("change", search);
  draw(); search();
 }});

// ---- Planilha com fórmulas em português ----
const SHEET_INIT = {
 A1:"Aluno", B1:"Nota 1", C1:"Nota 2", D1:"Média", E1:"Situação",
 A2:"Ana", B2:"8", C2:"9", D2:"=MÉDIA(B2:C2)", E2:'=SE(D2>=6;"Aprovado";"Recuperação")',
 A3:"Bruno", B3:"5", C3:"6", D3:"=MÉDIA(B3:C3)", E3:'=SE(D3>=6;"Aprovado";"Recuperação")',
 A4:"Carla", B4:"7", C4:"4", D4:"=MÉDIA(B4:C4)", E4:'=SE(D4>=6;"Aprovado";"Recuperação")',
 A5:"Davi", B5:"10", C5:"8", D5:"=MÉDIA(B5:C5)", E5:'=SE(D5>=6;"Aprovado";"Recuperação")',
 A6:"Elisa", B6:"6", C6:"5", D6:"=MÉDIA(B6:C6)", E6:'=SE(D6>=6;"Aprovado";"Recuperação")',
 A8:"Média da turma", D8:"=MÉDIA(D2:D6)",
 A9:"Aprovados", D9:'=CONT.SE(E2:E6;"Aprovado")',
 A11:"Buscar aluno:", B11:"Carla", C11:"Média:", D11:"=PROCV(B11;A2:D6;4;0)"
};
const SHEET_TASKS = [
 ["Em D8, troque MÉDIA por MÁXIMO e veja a maior média.", s => /MÁXIMO|MAXIMO/i.test(s.D8||"")],
 ["Mude a nota 2 do Bruno (C3) para 8 e veja a situação dele mudar.", s => s.C3 === "8"],
 ["Em B11, digite outro nome para o PROCV buscar.", s => s.B11 && s.B11 !== "Carla"],
 ["Em D10, escreva =SOMA(B2:B6) para somar as notas 1.", s => /^=SOMA\(B2:B6\)$/i.test((s.D10||"").replace(/\s/g,""))]
];
lab({id:"sheet", tr:"office", area:"sw", title:"Planilha de notas com fórmulas de verdade",
 blurb:"Uma planilha que calcula de verdade: MÉDIA, SOMA, SE, CONT.SE e PROCV, com as fórmulas em português e o ponto e vírgula, como no Google Planilhas e no Excel em português. Média abaixo de 6 fica vermelha.",
 learn:["Toda fórmula começa com =. Um intervalo como B2:C2 significa “de B2 até C2”.","SE(teste; se verdadeiro; se falso) decide; PROCV(valor; tabela; coluna; 0) procura numa tabela.","Formatação condicional pinta a célula sozinha quando a regra é atendida, sem você mexer."],
 html:()=>`<div class="fbar"><b id="shname">A1</b><span>ƒx</span><input id="shf" aria-label="Fórmula da célula"></div>
 <div class="tablewrap" style="margin-top:8px"><table class="ss" id="shtab"></table></div>
 <div class="row wrap ctrls" style="margin-top:8px"><label class="chk inline"><input type="checkbox" id="shcond" checked> Formatação condicional (média &lt; 6 em vermelho, ≥ 6 em verde)</label><button class="btn ghost sm" id="shreset">Restaurar planilha</button></div>
 <div class="k">Desafios</div><div id="shtasks"></div>`,
 mount(root){
  const COLS = "ABCDEF".split(""), ROWS = 12;
  let s = Object.assign({}, ls.get("pp-sheet", SHEET_INIT)), cur = "A1";
  const save = () => ls.set("pp-sheet", s);
  function rangeVals(a, b, getv){ const c1 = a.charCodeAt(0), c2 = b.charCodeAt(0), r1 = +a.slice(1), r2 = +b.slice(1); const out = []; for (let r=Math.min(r1,r2); r<=Math.max(r1,r2); r++){ const row=[]; for (let c=Math.min(c1,c2); c<=Math.max(c1,c2); c++) row.push(getv(String.fromCharCode(c)+r)); out.push(row); } return out; }
  const nums = arr => arr.flat(Infinity).map(v=>typeof v==="number"?v:(v!==""&&!isNaN(+v)?+v:null)).filter(v=>v!==null);
  const F = {
    SOMA: (...a) => nums(a).reduce((x,y)=>x+y,0),
    "MÉDIA": (...a) => { const n = nums(a); if (!n.length) throw "#DIV/0!"; return n.reduce((x,y)=>x+y,0)/n.length; },
    "MÁXIMO": (...a) => Math.max(...nums(a)), "MÍNIMO": (...a) => Math.min(...nums(a)),
    SE: (c, a, b) => c ? a : (b === undefined ? false : b),
    "CONT.SE": (r, crit) => { const flat = r.flat(); const m = String(crit).match(/^(>=|<=|<>|>|<|=)?(.*)$/); const op = m[1]||"=", val = m[2];
      return flat.filter(v => { const a = isNaN(+v)||v===""?String(v):+v, b = isNaN(+val)?val:+val; return op==="="?a==b:op==="<>"?a!=b:op===">"?a>b:op==="<"?a<b:op===">="?a>=b:a<=b; }).length; },
    PROCV: (v, r, col, exato) => { const row = r.find(rw => String(rw[0]).toLowerCase() === String(v).toLowerCase()); if (!row) throw "#N/D"; return row[col-1]; },
    ARRED: (x, d) => { const p = Math.pow(10, d||0); return Math.round(x*p)/p; }
  };
  F["MEDIA"] = F["MÉDIA"]; F["MAXIMO"] = F["MÁXIMO"]; F["MINIMO"] = F["MÍNIMO"]; F["CONTSE"] = F["CONT.SE"];
  function evalCell(id, stack){
    const raw = s[id] ?? "";
    if (typeof raw !== "string" || raw[0] !== "=") return raw === "" ? "" : (isNaN(+raw) ? raw : +raw);
    if (stack.includes(id)) throw "#REF! (circular)";
    const getv = ref => { const v = evalCell(ref, stack.concat(id)); return v; };
    let expr = raw.slice(1), strs = [];
    expr = expr.replace(/"([^"]*)"/g, (m,t) => { strs.push(t); return `__S${strs.length-1}__`; });
    const rgs = [];
    expr = expr.replace(/\b([A-F])(\d{1,2}):([A-F])(\d{1,2})\b/gi, (m,a,b,c,d) => { rgs.push([a.toUpperCase()+b, c.toUpperCase()+d]); return `__G${rgs.length-1}__`; });
    expr = expr.replace(/(^|[^A-Z_\u00C0-\u00FF.])([A-Z\u00C0-\u00FF][A-Z\u00C0-\u00FF.]*)\s*\(/gi, (m,p,n) => { const k = n.toUpperCase(); if (!F[k]) throw "#NOME? (" + n + ")"; return `${p}__F[${JSON.stringify(k)}](`; });
    expr = expr.replace(/(^|[^A-Z_"])([A-F])(\d{1,2})\b/gi, (m,p,a,b) => `${p}__V(${JSON.stringify(a.toUpperCase()+b)})`);
    expr = expr.replace(/__G(\d+)__/g, (m,k) => `__R(${JSON.stringify(rgs[+k][0])},${JSON.stringify(rgs[+k][1])})`);
    expr = expr.replace(/;/g, ",").replace(/<>/g, "!=").replace(/([^<>!=])=([^=])/g, "$1==$2").replace(/__S(\d+)__/g, (m,k)=>JSON.stringify(strs[+k])).replace(/&/g, "+\"\"+");
    if (/[^\w\s"().,+\-*\/<>=!\[\]_ÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç:]/.test(expr.replace(/"[^"]*"/g,""))) throw "#ERRO";
    const fn = new Function("__F","__V","__R", "return (" + expr + ");");
    const out = fn(F, ref => { const v = getv(ref); return v === "" ? 0 : v; }, (a,b) => rangeVals(a, b, getv));
    if (typeof out === "number" && !isFinite(out)) throw "#DIV/0!";
    return out;
  }
  const show = v => typeof v === "number" ? (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", ",")) : typeof v === "boolean" ? (v ? "VERDADEIRO" : "FALSO") : String(v);
  function draw(){
    const cond = q(root,"#shcond").checked;
    let h = `<tr><th></th>${COLS.map(c=>`<th>${c}</th>`).join("")}</tr>`;
    for (let r=1; r<=ROWS; r++){
      h += `<tr><th>${r}</th>`;
      for (const c of COLS){ const id = c+r; let txt, cls = id===cur?"sel":"";
        try { const v = evalCell(id, []); txt = show(v); if (cond && c==="D" && r>=2 && r<=6 && typeof v==="number") cls += v<6?" red":" green"; }
        catch(e){ txt = typeof e === "string" ? e : "#ERRO"; cls += " err"; }
        h += `<td class="${cls}" data-c="${id}" title="${esc(s[id]||"")}">${esc(txt)}</td>`; }
      h += "</tr>";
    }
    q(root,"#shtab").innerHTML = h;
    q(root,"#shname").textContent = cur; if (document.activeElement !== q(root,"#shf")) q(root,"#shf").value = s[cur] || "";
    q(root,"#shtasks").innerHTML = SHEET_TASKS.map(([t,f])=>`<div class="chk">${f(s)?"✅":"⬜"} <span>${esc(t)}</span></div>`).join("");
  }
  root.addEventListener("click", e => { const td = e.target.closest("td[data-c]"); if (td){ cur = td.dataset.c; q(root,"#shf").value = s[cur]||""; draw(); q(root,"#shf").focus(); } });
  q(root,"#shf").addEventListener("input", e => { const v = e.target.value; if (v === "") delete s[cur]; else s[cur] = v; save(); draw(); });
  q(root,"#shf").addEventListener("keydown", e => { if (e.key === "Enter"){ const r = +cur.slice(1); if (r < ROWS) cur = cur[0] + (r+1); q(root,"#shf").value = s[cur]||""; draw(); } });
  q(root,"#shcond").addEventListener("change", draw);
  q(root,"#shreset").addEventListener("click", () => { s = Object.assign({}, SHEET_INIT); save(); draw(); });
  draw();
 }});

lab({id:"gform", tr:"office", area:"sw", title:"Formulário com nota automática e ramificação",
 blurb:"Monte um teste como no Google Formulários: marque a resposta certa, defina a pontuação e uma regra de ramificação. Depois responda como aluno e veja a nota e o caminho.",
 learn:["No modo teste, o Formulários corrige sozinho as questões objetivas e pode mostrar a nota na hora.","Ramificação (“ir para a seção com base na resposta”) cria caminhos diferentes, como um reforço para quem errou.","Respostas vão para uma planilha, onde você analisa a turma inteira de uma vez."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="k">Editor (você, professor)</div><div id="gfed" class="grid" style="gap:8px"></div></div>
 <div><div class="k">Visão do aluno</div><div class="gf" id="gfprev"></div><div class="k" style="margin-top:10px">Planilha de respostas</div><div class="tablewrap"><table class="ss" id="gfsheet"></table></div></div></div>`,
 mount(root){
  const Q = [
   {t:"Qual bloco faz o micro:bit repetir algo sem parar?", o:["para sempre","no iniciar","se então"], a:0, p:2},
   {t:"Para mostrar um texto no micro:bit usamos:", o:["mostrar ícone","mostrar texto","tocar nota"], a:1, p:2},
   {t:"Você se sentiu seguro com o conteúdo?", o:["Sim","Mais ou menos","Não"], a:-1, p:0, branch:{2:"Seção de reforço: vídeo de 5 min + 2 exercícios"}}
  ];
  const rows = [];
  function drawEd(){
    q(root,"#gfed").innerHTML = Q.map((qq,i)=>`<div class="infobox"><b>${i+1}. ${esc(qq.t)}</b>${qq.o.map((o,k)=>`<label class="chk inline" style="display:flex"><input type="radio" name="gfa${i}" data-qa="${i}" value="${k}" ${qq.a===k?"checked":""}> ${esc(o)}${qq.branch&&qq.branch[k]?` <span class="pill warn">vai para reforço</span>`:""}</label>`).join("")}
     <div class="row wrap small"><label class="f inline">Pontos <input type="number" min="0" max="10" value="${qq.p}" data-qp="${i}" style="width:60px"></label>${qq.a===-1?'<span class="muted">Pergunta de opinião: sem resposta certa</span>':""}</div></div>`).join("");
  }
  function drawPrev(){
    q(root,"#gfprev").innerHTML = `<div class="card"><b style="font-size:20px">Quiz: micro:bit</b><div class="small">* Obrigatória</div></div>` + Q.map((qq,i)=>`<div class="qq"><div>${esc(qq.t)} <span class="small">(${qq.p} pt)</span></div>${qq.o.map((o,k)=>`<label><input type="radio" name="gfr${i}" value="${k}"> ${esc(o)}</label>`).join("")}</div>`).join("") + `<label class="small">Seu nome <input id="gfname" value="Aluno ${rows.length+1}"></label><button class="btnp" id="gfsend">Enviar</button><div id="gfout"></div>`;
  }
  function drawSheet(){
    q(root,"#gfsheet").innerHTML = `<tr><th>Nome</th>${Q.map((_,i)=>`<th>Q${i+1}</th>`).join("")}<th>Nota</th></tr>` + (rows.length ? rows.map(r=>`<tr><td>${esc(r.n)}</td>${r.a.map((a,i)=>`<td>${a<0?"":esc(Q[i].o[a])}</td>`).join("")}<td>${r.s}</td></tr>`).join("") : `<tr><td colspan="${Q.length+2}" class="muted">Nenhuma resposta ainda</td></tr>`);
  }
  root.addEventListener("change", e => {
    if (e.target.dataset.qa !== undefined){ const i = +e.target.dataset.qa; if (Q[i].a !== -1) Q[i].a = +e.target.value; drawEd(); drawPrev(); }
    if (e.target.dataset.qp !== undefined){ Q[+e.target.dataset.qp].p = Math.max(0, +e.target.value||0); drawPrev(); }
  });
  root.addEventListener("click", e => {
    if (e.target.id !== "gfsend") return;
    const a = Q.map((_,i) => { const r = q(root, `input[name="gfr${i}"]:checked`); return r ? +r.value : -1; });
    if (a.some(x=>x<0)){ q(root,"#gfout").innerHTML = '<div style="color:#d93025">Responda todas as perguntas.</div>'; return; }
    const max = Q.reduce((t,qq)=>t+qq.p,0), sc = Q.reduce((t,qq,i)=>t+(qq.a>=0&&a[i]===qq.a?qq.p:0),0);
    const br = Q.map((qq,i)=>qq.branch&&qq.branch[a[i]]).find(Boolean);
    rows.push({n:q(root,"#gfname").value||"Aluno", a, s:`${sc}/${max}`});
    drawPrev(); drawSheet();
    q(root,"#gfout").innerHTML = `<div class="qq"><b>Sua nota: ${sc} de ${max}</b>${Q.map((qq,i)=>qq.a<0?"":`<div class="small">${a[i]===qq.a?"✅":"❌"} Q${i+1}${a[i]!==qq.a?`: certo era “${esc(qq.o[qq.a])}”`:""}</div>`).join("")}${br?`<div style="color:#673ab7;font-weight:600">➡ Ramificação: ${esc(br)}</div>`:'<div class="small">➡ Fim do formulário</div>'}</div>`;
  });
  drawEd(); drawPrev(); drawSheet();
 }});

lab({id:"poster", tr:"office", area:"sw", title:"Cartaz: hierarquia, alinhamento e contraste",
 blurb:"Arraste os elementos do cartaz da feira de robótica. O avaliador confere, ao vivo, se o título domina, se tudo está alinhado e se o texto tem contraste com o fundo. É o que o Canva faz com as guias.",
 learn:["Hierarquia: o olho deve ler primeiro o título, depois a data e por último os detalhes.","Alinhamento: elementos alinhados a uma mesma linha invisível parecem planejados.","Contraste: texto claro em fundo escuro (ou o contrário) é lido de longe."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="posterwrap" id="pw"><div class="grid12" id="pgrid"></div></div></div>
 <div class="grid" style="gap:10px"><div class="row wrap ctrls"><label class="f inline">Fundo <select id="pbg"><option value="#1d2b53">Azul-marinho</option><option value="#ffe14d">Amarelo</option><option value="#f4f4f4">Cinza-claro</option><option value="#ff7a00">Laranja</option></select></label><label class="f inline">Cor do texto <select id="pfg"><option value="#ffffff">Branco</option><option value="#111111">Preto</option><option value="#ffe14d">Amarelo</option><option value="#9aa0a6">Cinza</option></select></label></div>
 <div class="row wrap ctrls"><label class="f inline">Tamanho do selecionado <input type="range" id="psize" min="10" max="64" value="20"></label><label class="chk inline"><input type="checkbox" id="psnap" checked> Ímã nas guias</label><label class="chk inline"><input type="checkbox" id="pshowg" checked> Mostrar grade</label></div>
 <div class="row wrap"><button class="btn ghost sm" id="pmess">Bagunçar</button><button class="btn ghost sm" id="pfix">Ver uma versão organizada</button></div>
 <div class="infobox" id="pscore"></div></div></div>`,
 mount(root){
  const pw = q(root,"#pw");
  const EL = [
   {id:"t", txt:"FEIRA DE ROBÓTICA", x:10, y:12, s:30, w:800},
   {id:"d", txt:"Sexta, 14h · Laboratório", x:40, y:40, s:18, w:600},
   {id:"i", txt:"🤖", x:30, y:55, s:58, w:400},
   {id:"b", txt:"Traga seu projeto de micro:bit ou Arduino", x:15, y:80, s:16, w:400},
   {id:"l", txt:"Clube Maker", x:60, y:92, s:12, w:700}
  ];
  let sel = "t", drag = null;
  function draw(){
    const bg = q(root,"#pbg").value, fg = q(root,"#pfg").value;
    pw.style.background = bg; q(root,"#pgrid").style.display = q(root,"#pshowg").checked ? "" : "none";
    qa(pw,".pel").forEach(n=>n.remove());
    EL.forEach(e => { const n = document.createElement("div"); n.className = "pel"+(e.id===sel?" sel":""); n.dataset.pe = e.id; n.textContent = e.txt;
      n.style.cssText = `left:${e.x}%;top:${e.y}%;font:${e.w} ${e.s*pw.clientWidth/360}px system-ui;color:${fg};max-width:${100-e.x}%;line-height:1.1`; pw.appendChild(n); });
    score(bg, fg);
  }
  function lum(hex){ const c = [1,3,5].map(i=>parseInt(hex.substr(i,2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)); return .2126*c[0]+.7152*c[1]+.0722*c[2]; }
  function score(bg, fg){
    const L1 = lum(bg), L2 = lum(fg), ratio = (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    const t = EL.find(e=>e.id==="t"), others = EL.filter(e=>e.id!=="t"&&e.id!=="i");
    const hier = others.every(e=>e.s < t.s*0.8) && EL.find(e=>e.id==="d").s > EL.find(e=>e.id==="b").s;
    const xs = EL.filter(e=>e.id!=="i").map(e=>Math.round(e.x));
    const groups = {}; xs.forEach(x=>{ const k = Object.keys(groups).find(g=>Math.abs(g-x)<=2); groups[k??x] = (groups[k??x]||0)+1; });
    const aligned = Math.max(...Object.values(groups)) >= 3;
    const margins = EL.every(e=>e.x>=4 && e.y>=3 && e.y<=94);
    const ys = EL.map(e=>e.y).sort((a,b)=>a-b); const overlap = ys.some((y,i)=>i&&y-ys[i-1]<5);
    const items = [[ratio>=4.5, `Contraste ${ratio.toFixed(1)}:1 ${ratio>=4.5?"(bom, acima de 4,5)":"(baixo: troque a cor do texto ou do fundo)"}`],
      [hier, hier ? "Hierarquia clara: o título é o maior, depois a data" : "Hierarquia fraca: o título deve ser bem maior que o resto, e a data maior que os detalhes"],
      [aligned, aligned ? "Alinhamento: pelo menos 3 textos na mesma linha vertical" : "Alinhamento: alinhe pelo menos 3 textos pela mesma borda esquerda (use o ímã)"],
      [margins, margins ? "Margens respeitadas" : "Algum elemento está colado na borda"], [!overlap, overlap ? "Há elementos muito próximos ou sobrepostos" : "Espaço entre os blocos"]];
    const n = items.filter(i=>i[0]).length;
    q(root,"#pscore").innerHTML = `<b>Avaliação: ${n} de ${items.length}</b>` + items.map(([ok,t])=>`<div class="small">${ok?"✅":"⚠"} ${t}</div>`).join("");
  }
  pw.addEventListener("pointerdown", e => { const n = e.target.closest("[data-pe]"); if (!n) return; sel = n.dataset.pe; const el = EL.find(x=>x.id===sel); const r = pw.getBoundingClientRect();
    drag = {el, dx: (e.clientX-r.left)/r.width*100 - el.x, dy: (e.clientY-r.top)/r.height*100 - el.y}; q(root,"#psize").value = el.s; pw.setPointerCapture(e.pointerId); draw(); });
  pw.addEventListener("pointermove", e => { if (!drag) return; const r = pw.getBoundingClientRect(); let x = (e.clientX-r.left)/r.width*100 - drag.dx, y = (e.clientY-r.top)/r.height*100 - drag.dy;
    if (q(root,"#psnap").checked){ const g = 100/12; const sx = Math.round(x/g)*g; if (Math.abs(sx-x)<2) x = sx; EL.forEach(o=>{ if (o!==drag.el && Math.abs(o.x-x)<2) x = o.x; }); }
    drag.el.x = Math.max(0, Math.min(90, x)); drag.el.y = Math.max(0, Math.min(95, y)); draw(); });
  pw.addEventListener("pointerup", () => drag = null);
  root.addEventListener("input", e => { if (e.target.id === "psize"){ EL.find(x=>x.id===sel).s = +e.target.value; draw(); } });
  root.addEventListener("change", e => { if (["pbg","pfg","psnap","pshowg"].includes(e.target.id)) draw(); });
  q(root,"#pmess").addEventListener("click", () => { EL.forEach(e=>{ e.x = rnd(2,50); e.y = rnd(2,90); e.s = rnd(14,30); }); q(root,"#pfg").value = "#9aa0a6"; q(root,"#pbg").value = "#f4f4f4"; draw(); });
  q(root,"#pfix").addEventListener("click", () => { const L = 100/12; Object.assign(EL[0],{x:L,y:10,s:40}); Object.assign(EL[1],{x:L,y:33,s:20}); Object.assign(EL[2],{x:L*7,y:45,s:64}); Object.assign(EL[3],{x:L,y:50,s:16}); Object.assign(EL[4],{x:L,y:88,s:12}); q(root,"#pbg").value="#1d2b53"; q(root,"#pfg").value="#ffffff"; draw(); });
  labLater(draw, 30); window.addEventListener("resize", draw); labOnStop(()=>window.removeEventListener("resize", draw));
 }});

lab({id:"wordstyles", tr:"office", area:"sw", title:"Word e Docs: estilos que geram o sumário",
 blurb:"Clique num parágrafo e aplique um estilo. Só o que estiver com estilo Título 1 ou Título 2 entra no sumário automático. Compare com o “título falso”, feito só com negrito e fonte grande.",
 learn:["Estilos dizem o que o texto é (título, subtítulo, corpo), não só como ele parece.","O sumário automático, a navegação lateral e a acessibilidade dependem dos estilos.","Mudou o estilo Título 1? Todos os títulos do documento mudam juntos."],
 html:()=>`<div class="row wrap ctrls"><span class="small muted">Estilo do parágrafo selecionado:</span>${[["n","Normal"],["h1","Título 1"],["h2","Título 2"],["fake","Negrito grande (falso título)"]].map(([k,l])=>`<button class="btn ghost sm" data-sty="${k}">${l}</button>`).join("")}</div>
 <div class="row wrap ctrls"><label class="f inline">Cor do Título 1 <input type="color" id="wh1c" value="#1f3864"></label><label class="f inline">Fonte dos títulos <select id="wfont"><option>Calibri</option><option>Georgia</option><option>Arial</option></select></label></div>
 <div class="two-even" style="margin-top:0"><div><div class="k">Documento</div><div class="wdoc" id="wdoc"></div></div><div><div class="k">Sumário automático</div><div class="toc" id="wtoc"></div><div class="note small" id="wnote"></div></div></div>`,
 mount(root){
  const P = [["Projeto Clube Maker","fake"],["Este documento descreve o clube maker da escola.","n"],["Objetivos","n"],["Ensinar eletrônica básica com micro:bit e Arduino.","n"],["Público","n"],["Turmas do 6º ao 9º ano, no contraturno.","n"],["Materiais","n"],["Kits de micro:bit","n"],["Impressoras 3D","n"],["Avaliação","n"],["Por projeto, com rubrica e portfólio.","n"]];
  let sel = 2;
  const PAGE_EVERY = 4;
  function draw(){
    const font = q(root,"#wfont").value, c1 = q(root,"#wh1c").value;
    q(root,"#wdoc").innerHTML = P.map(([t,s],i)=>`${i && i%PAGE_EVERY===0?`<div class="pg">página ${i/PAGE_EVERY+1}</div>`:""}<p class="${s==="n"?"":s} ${i===sel?"sel":""}" data-pi="${i}" style="${s==="h1"?`color:${c1};font-family:${font}`:s==="h2"?`font-family:${font}`:""}">${esc(t)}</p>`).join("");
    const toc = P.map(([t,s],i)=>({t,s,pg:Math.floor(i/PAGE_EVERY)+1})).filter(x=>x.s==="h1"||x.s==="h2");
    q(root,"#wtoc").innerHTML = `<b>Sumário</b>` + (toc.length ? toc.map(x=>`<div class="${x.s==="h2"?"t2":""}"><span>${esc(x.t)}</span><span class="dots"></span><span>${x.pg}</span></div>`).join("") : '<div class="small" style="color:#999">Nenhum título com estilo ainda.</div>');
    const fakes = P.filter(p=>p[1]==="fake").length, h = toc.length;
    q(root,"#wnote").innerHTML = fakes ? `⚠ ${fakes} parágrafo(s) parecem título mas não têm estilo: o sumário e o leitor de tela não os veem.` : h >= 5 ? "✅ Ótimo. Sugestão: “Kits de micro:bit” e “Impressoras 3D” ficam bem como Título 2 dentro de Materiais." : "Transforme os títulos em Título 1 e veja o sumário crescer.";
  }
  root.addEventListener("click", e => { const p = e.target.closest("[data-pi]"); if (p){ sel = +p.dataset.pi; draw(); } const b = e.target.closest("[data-sty]"); if (b){ P[sel][1] = b.dataset.sty; draw(); } });
  root.addEventListener("input", e => { if (e.target.id==="wh1c") draw(); });
  root.addEventListener("change", e => { if (e.target.id==="wfont") draw(); });
  draw();
 }});

lab({id:"crap", tr:"office", area:"sw", title:"Os 4 princípios do design, ligando um por um",
 blurb:"Comece com um aviso bagunçado e ligue Contraste, Repetição, Alinhamento e Proximidade, um de cada vez. Veja o que cada princípio muda sozinho.",
 learn:["Contraste: o que é diferente deve ser muito diferente (tamanho, peso, cor).","Repetição: repita cores, fontes e formas para dar unidade.","Alinhamento: nada fica solto, tudo se liga a uma linha. Proximidade: o que é do mesmo assunto fica junto."],
 html:()=>`<div class="row wrap ctrls">${[["c","Contraste"],["r","Repetição"],["a","Alinhamento"],["p","Proximidade"]].map(([k,l])=>`<label class="chk inline"><input type="checkbox" data-pr="${k}"> ${l}</label>`).join("")}<button class="btn ghost sm" id="crall">Ligar todos</button></div>
 <div class="two-even" style="margin-top:0"><div class="flyer" id="crf"></div><div class="infobox small" id="crtxt"></div></div>`,
 mount(root){
  const on = {c:false,r:false,a:false,p:false};
  const TIPS = {c:"Contraste: o título ficou grande e pesado, e o fundo escuro destaca o texto claro.",r:"Repetição: a mesma cor de destaque aparece no título, nos marcadores e no botão.",a:"Alinhamento: tudo segue a mesma borda esquerda, em vez de centralizado e torto.",p:"Proximidade: data e local ficaram juntos; as regras ficaram juntas, separadas do resto."};
  function draw(){
    const acc = on.r ? "#ff9f1c" : null, bg = on.c ? "#13223f" : "#fafafa", fg = on.c ? "#f5f5f5" : "#555";
    const al = on.a ? "left" : null, gap = on.p ? 4 : 14, sec = on.p ? 22 : 14;
    const rot = k => al ? "" : `text-align:${["center","right","left","center"][k%4]};margin-left:${[0,18,6,30][k%4]}px`;
    const bull = i => acc ? `<span style="color:${acc}">■</span> ` : ["• ","- ","» "][i%3];
    q(root,"#crf").style.cssText = `background:${bg};color:${fg};text-align:${al||"center"}`;
    q(root,"#crf").innerHTML = `
     <div style="font:${on.c?"800 30px":"400 19px"} system-ui;color:${acc||(on.c?"#fff":"#444")};${rot(0)};margin-bottom:${sec}px">Oficina de Arduino</div>
     <div style="${rot(1)};margin-bottom:${gap}px;font-size:15px">📅 Quarta, 15h</div>
     <div style="${rot(2)};margin-bottom:${sec}px;font-size:${on.c?15:15}px">📍 Laboratório de informática</div>
     <div style="${rot(3)};margin-bottom:${gap}px;font:${on.r?"600 ":""}15px ${on.r?"system-ui":"Georgia,serif"}">${bull(0)}Vagas: 20 alunos</div>
     <div style="${rot(1)};margin-bottom:${gap}px;font:${on.r?"600 ":""}15px ${on.r?"system-ui":"Courier New,monospace"}">${bull(1)}Não precisa saber programar</div>
     <div style="${rot(2)};margin-bottom:${sec}px;font:15px ${on.r?"system-ui":"Times New Roman,serif"}">${bull(2)}Traga o caderno</div>
     <div style="${rot(0)}"><span style="display:inline-block;padding:7px 14px;border-radius:${on.r?"99px":"0"};background:${acc||"#ccc"};color:${acc?"#13223f":"#333"};font-weight:700">Inscreva-se com o professor Márcio</span></div>`;
    const n = Object.values(on).filter(Boolean).length;
    q(root,"#crtxt").innerHTML = `<b>${n} de 4 princípios ligados</b>` + (n ? Object.entries(on).filter(x=>x[1]).map(([k])=>`<p>${TIPS[k]}</p>`).join("") : "<p>Sem os princípios: fontes misturadas, nada alinhado e os assuntos espalhados. O olho não sabe onde começar.</p>");
  }
  root.addEventListener("change", e => { const k = e.target.dataset.pr; if (k){ on[k] = e.target.checked; draw(); } });
  q(root,"#crall").addEventListener("click", () => { qa(root,"[data-pr]").forEach(c=>{ c.checked = true; on[c.dataset.pr] = true; }); draw(); });
  draw();
 }});

lab({id:"video", tr:"office", area:"sw", title:"Edição de vídeo: linha do tempo",
 blurb:"Uma linha do tempo como a do CapCut ou do Clipchamp: dê play, corte no ponto da agulha vermelha, apague trechos, ponha legenda e trilha. A prévia mostra o vídeo final.",
 learn:["Cada faixa é uma camada: vídeo embaixo, legenda por cima, áudio separado.","Cortar (dividir) num ponto e apagar o pedaço é a operação mais usada na edição.","Vídeos de aula funcionam melhor curtos: um conceito por vídeo, de 2 a 6 minutos."],
 html:()=>`<canvas id="vcv" class="cv2"></canvas>
 <div class="row wrap ctrls" style="margin-top:8px"><button class="btn sm" id="vplay">▶ Play</button><button class="btn ghost sm" id="vsplit">✂ Cortar na agulha</button><button class="btn ghost sm" id="vdel">🗑 Apagar clipe selecionado</button><button class="btn ghost sm" id="vcap">💬 Legenda aqui</button><button class="btn ghost sm" id="vreset">Recomeçar</button><span class="small" id="vinfo"></span></div>
 <div class="vtl" id="vtl"><div class="ruler" id="vruler"></div><div class="trk" data-trk="cap"></div><div class="trk" data-trk="vid"></div><div class="trk" data-trk="aud"></div><div class="ph" id="vph"></div></div>
 <div class="small muted">Clique na régua para mover a agulha. Clique num clipe para selecioná-lo. Faixas: legenda, vídeo e áudio.</div>`,
 mount(root){
  const W = 640, H = 240, c = setupCanvas(q(root,"#vcv"), W, H), PX = 14;
  const COLORS = {Abertura:"#7c4dff", Explicação:"#2979ff", "Erro de gravação":"#9e9e9e", Demonstração:"#00a676", Encerramento:"#ff6d00"};
  let clips, caps, aud, t = 0, playing = false, selC = null;
  function reset(){ clips = [["Abertura",4],["Explicação",12],["Erro de gravação",6],["Demonstração",14],["Encerramento",5]].map(([n,d])=>({n,d,c:COLORS[n]})); caps = []; aud = 30; t = 0; selC = null; }
  const total = () => clips.reduce((a,b)=>a+b.d,0);
  function at(time){ let acc = 0; for (const k of clips){ if (time < acc+k.d) return {k, off: time-acc}; acc += k.d; } return null; }
  function drawTL(){
    const tl = q(root,"#vtl"), w = Math.max(total(), aud, 40)*PX;
    qa(tl,".trk").forEach(tr=>tr.style.width = w+"px");
    let acc = 0;
    q(root,'[data-trk="vid"]').innerHTML = clips.map((k,i)=>{ const h = `<div class="clip${selC===i?" sel":""}" data-ci="${i}" style="left:${acc*PX}px;width:${k.d*PX-2}px;background:${k.c}">${esc(k.n)} · ${k.d.toFixed(1)}s</div>`; acc += k.d; return h; }).join("");
    q(root,'[data-trk="cap"]').innerHTML = caps.map(cp=>`<div class="clip" style="left:${cp.t*PX}px;width:${3*PX}px;background:#333">💬 ${esc(cp.txt)}</div>`).join("");
    q(root,'[data-trk="aud"]').innerHTML = `<div class="clip" style="left:0;width:${aud*PX}px;background:repeating-linear-gradient(90deg,#26a69a 0 3px,#4db6ac 3px 6px)">🎵 trilha suave · ${aud}s</div>`;
    q(root,"#vruler").style.width = w+"px";
    q(root,"#vruler").innerHTML = Array.from({length:Math.ceil(w/PX/5)+1},(_,i)=>`<span style="position:absolute;left:${i*5*PX}px">${i*5}s</span>`).join("");
    q(root,"#vph").style.left = (8+t*PX)+"px";
    const cut = clips.some(k=>k.n==="Erro de gravação");
    q(root,"#vinfo").innerHTML = `Duração: <b>${total().toFixed(1)} s</b>${cut?' · <span class="warntext">ainda tem o “Erro de gravação”</span>':' · <span class="oktext">erro removido</span>'}${aud>total()+0.5?' · <span class="warntext">o áudio passa do fim do vídeo</span>':""}`;
  }
  function drawPrev(){
    const a = at(t);
    c.fillStyle = a ? a.k.c : "#000"; c.fillRect(0,0,W,H);
    if (a){ c.fillStyle = "rgba(255,255,255,.15)"; for (let i=0;i<6;i++){ c.beginPath(); c.arc((a.off*40+i*130)%(W+60)-30, 60+ (i%3)*55, 26, 0, 7); c.fill(); }
      c.fillStyle = "#fff"; c.font = "700 30px system-ui"; c.textAlign = "center"; c.fillText(a.k.n, W/2, H/2); }
    else { c.fillStyle = "#fff"; c.font = "16px system-ui"; c.textAlign = "center"; c.fillText("Fim", W/2, H/2); }
    const cp = caps.find(x=>t>=x.t && t<x.t+3);
    if (cp){ c.font = "600 18px system-ui"; const w = c.measureText(cp.txt).width+24; c.fillStyle = "rgba(0,0,0,.7)"; c.fillRect(W/2-w/2, H-50, w, 32); c.fillStyle = "#fff"; c.fillText(cp.txt, W/2, H-28); }
    c.fillStyle = "rgba(0,0,0,.5)"; c.fillRect(0,H-6,W,6); c.fillStyle = "#e33"; c.fillRect(0,H-6,W*Math.min(1,t/Math.max(total(),.1)),6);
    c.textAlign = "left"; c.font = "12px monospace"; c.fillStyle = "#fff"; c.fillText(`${t.toFixed(1)}s / ${total().toFixed(1)}s ${t<aud?"♪":""}`, 8, 18);
  }
  const draw = () => { drawTL(); drawPrev(); };
  let last = 0;
  labEvery(() => { if (!playing) return; const now = performance.now(); t += (now-last)/1000; last = now; if (t >= total()){ t = total(); playing = false; q(root,"#vplay").textContent = "▶ Play"; } draw(); }, 50);
  q(root,"#vplay").addEventListener("click", () => { playing = !playing; if (t >= total()) t = 0; last = performance.now(); q(root,"#vplay").textContent = playing ? "⏸ Pausar" : "▶ Play"; });
  q(root,"#vsplit").addEventListener("click", () => { const a = at(t); if (!a || a.off < 0.3 || a.k.d - a.off < 0.3){ toast("Ponha a agulha no meio de um clipe"); return; } const i = clips.indexOf(a.k); clips.splice(i, 1, {n:a.k.n, d:a.off, c:a.k.c}, {n:a.k.n, d:a.k.d-a.off, c:a.k.c}); selC = i+1; draw(); });
  q(root,"#vdel").addEventListener("click", () => { if (selC === null){ toast("Clique num clipe primeiro"); return; } clips.splice(selC, 1); selC = null; t = Math.min(t, total()); draw(); });
  q(root,"#vcap").addEventListener("click", () => { const txt = prompt("Texto da legenda:", "Repare no LED piscando"); if (txt){ caps.push({t, txt: txt.slice(0,40)}); draw(); } });
  q(root,"#vreset").addEventListener("click", () => { reset(); draw(); });
  q(root,"#vtl").addEventListener("click", e => {
    const cl = e.target.closest("[data-ci]"); if (cl){ selC = +cl.dataset.ci; draw(); return; }
    const r = q(root,"#vruler").getBoundingClientRect(); if (e.target.closest("#vruler") || e.target.closest(".trk")){ t = Math.max(0, Math.min(total(), (e.clientX - r.left)/PX)); draw(); }
  });
  reset(); draw();
 }});

lab({id:"educator", tr:"office", area:"sw", title:"Treino para o Google Educator",
 blurb:"Situações de sala de aula para resolver com as ferramentas do Google Workspace for Education. São questões de treino escritas aqui, não as da prova oficial, mas cobrem os mesmos tipos de tarefa.",
 learn:["A prova de nível 1 é prática: você resolve tarefas em ferramentas como Classroom, Formulários, Drive e Agenda.","Pense sempre em economia de tempo e em privacidade dos alunos.","Confira o guia oficial no Centro de Professores do Google antes de marcar a prova."],
 html:()=>`<div class="qz" id="qz"></div>`,
 mount(root){
  quizEngine(root, [
   {tag:"Classroom", q:"Você quer que cada aluno receba sua própria cópia de uma ficha do Documentos para preencher. Na tarefa do Classroom, qual opção escolhe para o anexo?", o:["Fazer uma cópia para cada aluno","Os alunos podem ver o arquivo","Os alunos podem editar o arquivo"], a:0, w:"“Fazer uma cópia para cada aluno” cria um arquivo individual, já compartilhado com você. “Editar” faria todos mexerem no mesmo arquivo."},
   {tag:"Formulários", q:"Você quer que um questionário de múltipla escolha corrija sozinho e mostre a nota. O que ativa?", o:["Transformar em teste e definir as respostas certas","Coletar endereços de e-mail","Mostrar barra de progresso"], a:0, w:"No modo teste você define a chave de respostas e a pontuação de cada pergunta."},
   {tag:"Drive", q:"Um colega precisa comentar no seu plano de aula, mas não deve alterar o texto. Que permissão você dá?", o:["Comentador","Editor","Proprietário"], a:0, w:"Comentador pode sugerir e comentar sem mudar o conteúdo."},
   {tag:"Agenda", q:"Você quer que os pais marquem horário de reunião com você sem trocar mensagens. O que usa no Google Agenda?", o:["Agendamento de horários (páginas de reserva)","Um evento recorrente público","Lembretes do Agenda"], a:0, w:"Com os horários de agendamento você publica sua disponibilidade e cada pessoa reserva um espaço. O recurso pode variar conforme a licença da escola."},
   {tag:"Privacidade", q:"Uma planilha tem nomes e notas dos alunos. Como compartilhar com a coordenação?", o:["Compartilhar só com o e-mail da coordenação, como leitor","Gerar link público para qualquer pessoa","Postar a planilha no mural da turma"], a:0, w:"Dados de alunos ficam restritos a quem precisa vê-los. Link público é o erro mais comum."},
   {tag:"Classroom", q:"Você quer publicar uma tarefa amanhã às 7h, sem lembrar de fazer isso na hora. Qual opção usa?", o:["Programar a postagem","Salvar como rascunho","Atribuir sem prazo"], a:0, w:"“Programar” publica a tarefa sozinha no horário marcado."},
   {tag:"Planilhas", q:"Num registro de notas, você quer que notas abaixo de 6 fiquem vermelhas automaticamente. Qual recurso usa?", o:["Formatação condicional","Validação de dados","Proteger intervalo"], a:0, w:"A formatação condicional pinta a célula quando a regra é atendida. Você treinou isso no laboratório de planilha."},
   {tag:"Meet", q:"Numa aula on-line, você quer dividir a turma em grupos de discussão por 10 minutos. O que usa?", o:["Salas temáticas","Compartilhar tela","Enquete"], a:0, w:"Salas temáticas separam os participantes em grupos menores. Depende da licença da escola."}
  ], {result:(s)=>`<p>Você acertou <b>${s}</b> de 8.</p><p class="small muted">${s>=7?"Ótimo sinal. Faça agora os cursos oficiais e um simulado no Centro de Professores.":"Revise as ferramentas em que errou e refaça. A prova pede agilidade nessas tarefas."}</p>`});
 }});

// ================= APPS SCRIPT =================
const GS_CODE = `function corrigir(respostas, gabarito) {
  // respostas: lista de linhas [nome, q1, q2, q3, q4]
  // gabarito: [q1, q2, q3, q4]
  const notas = [];
  for (const linha of respostas) {
    let acertos = 0;
    for (let i = 0; i < gabarito.length; i++) {
      if (linha[i + 1] === gabarito[i]) acertos++;
    }
    notas.push(acertos * 2.5);
  }
  return notas;
}`;
lab({id:"gscript", tr:"apps", area:"sw", title:"Apps Script: código que corrige o formulário",
 blurb:"As respostas de um formulário caem numa planilha. Escreva (ou ajuste) a função em JavaScript, como no Apps Script, e clique em Executar: o código roda de verdade aqui e preenche a coluna de notas.",
 learn:["Apps Script é JavaScript que roda nos servidores do Google e mexe em Planilhas, Formulários, Gmail e Drive.","No Apps Script de verdade, você lê os dados com SpreadsheetApp.getActiveSheet().getDataRange().getValues().","Um acionador (trigger) “ao enviar o formulário” roda a correção sozinha a cada resposta."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="k">Código.gs</div><textarea id="gscode" class="code" spellcheck="false" style="font-family:var(--mono);font-size:13px;min-height:300px;width:100%">${esc(GS_CODE)}</textarea>
 <div class="row wrap ctrls"><button class="btn sm" id="gsrun">▶ Executar</button><button class="btn ghost sm" id="gsreset">Restaurar código</button><label class="chk inline"><input type="checkbox" id="gstrig"> Acionador “ao enviar formulário”</label><button class="btn ghost sm" id="gsnew">Simular nova resposta</button></div>
 <div class="console small" id="gslog">Registro de execução aparece aqui.</div></div>
 <div><div class="k">Planilha “Respostas”</div><div class="tablewrap"><table class="ss" id="gstab"></table></div>
 <div class="k">Desafios</div><div class="small" id="gstasks"></div></div></div>`,
 mount(root){
  const GAB = ["B","A","D","C"], NAMES = ["Ana","Bruno","Carla","Davi","Elisa","Fábio","Gabi","Hugo"];
  let rows = [["Ana","B","A","D","C"],["Bruno","B","C","D","A"],["Carla","A","A","D","C"],["Davi","b","A","D","C"]], notes = [];
  function draw(){
    q(root,"#gstab").innerHTML = `<tr><th>Nome</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th><th>Nota</th></tr><tr><td><b>Gabarito</b></td>${GAB.map(g=>`<td><b>${g}</b></td>`).join("")}<td></td></tr>` +
      rows.map((r,i)=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join("")}<td class="${notes[i]===undefined?"":notes[i]>=6?"green":"red"}">${notes[i]===undefined?"":esc(String(notes[i]))}</td></tr>`).join("");
    const davi = rows.findIndex(r=>r[0]==="Davi");
    const tasks = [["Execute o código e veja as notas aparecerem.", notes.length>0],
      ["O Davi digitou “b” minúsculo e perdeu ponto. Faça a comparação ignorar maiúsculas (dica: .toUpperCase()).", davi>=0 && notes[davi]===10],
      ["Ligue o acionador e simule uma nova resposta: a nota deve sair sozinha.", rows.length>4 && notes.length===rows.length]];
    q(root,"#gstasks").innerHTML = tasks.map(([t,ok])=>`<div class="chk">${ok?"✅":"⬜"} <span>${esc(t)}</span></div>`).join("");
  }
  function run(){
    const log = q(root,"#gslog"); const lines = []; const t0 = performance.now();
    lines.push(`${new Date().toLocaleTimeString()}  Aviso  Execução iniciada`);
    try {
      const fakeLogger = { log: (...a) => lines.push("Info   " + a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" ")) };
      const fn = new Function("Logger", "console", q(root,"#gscode").value + "\n;return typeof corrigir === 'function' ? corrigir : null;")(fakeLogger, fakeLogger);
      if (!fn) throw new Error("Não encontrei a função corrigir(respostas, gabarito).");
      const out = fn(rows.map(r=>r.slice()), GAB.slice());
      if (!Array.isArray(out)) throw new Error("A função precisa devolver uma lista de notas (use return).");
      notes = out.map(n => typeof n === "number" ? Math.round(n*100)/100 : n);
      lines.push(`Info   ${notes.length} nota(s) escrita(s) na coluna F`);
      lines.push(`${new Date().toLocaleTimeString()}  Aviso  Execução concluída em ${Math.round(performance.now()-t0)} ms`);
    } catch(e){ lines.push(`Erro   ${e.name}: ${e.message}`); }
    log.innerHTML = lines.map(l=>`<div class="${/Erro/.test(l)?"warntext":""}">${esc(l)}</div>`).join("");
    draw();
  }
  q(root,"#gsrun").addEventListener("click", run);
  q(root,"#gsreset").addEventListener("click", () => { q(root,"#gscode").value = GS_CODE; });
  q(root,"#gsnew").addEventListener("click", () => {
    const n = NAMES[rows.length % NAMES.length] + (rows.length >= NAMES.length ? " " + rows.length : "");
    rows.push([n, ...GAB.map(g => Math.random() < .7 ? g : "ABCD"[rnd(0,3)])]);
    if (q(root,"#gstrig").checked) run(); else { q(root,"#gslog").innerHTML = `<div>Nova resposta de ${esc(n)} chegou. Sem acionador, ninguém corrigiu.</div>`; draw(); }
  });
  draw();
 }});

// ================= PROFESSOR =================
const BNCC_EIXOS = {
 pc:["Pensamento computacional","Abstração, decomposição, padrões e algoritmos. Ex.: montar um algoritmo, depurar um programa, usar repetições e condições."],
 md:["Mundo digital","Como os computadores e a internet funcionam: codificação da informação, hardware, redes, dados."],
 cd:["Cultura digital","Uso crítico, ético e responsável: cidadania digital, segurança, autoria, impactos sociais da tecnologia."]
};
lab({id:"bncc", tr:"prof", area:"sw", title:"Mapeador de aulas na BNCC Computação",
 blurb:"Descreva uma aula e marque o que ela trabalha. O mapeador mostra o equilíbrio entre os três eixos da BNCC Computação e monta a ficha do plano. Os códigos oficiais das habilidades você copia do documento do MEC.",
 learn:["O complemento de Computação da BNCC organiza o conteúdo em três eixos: Pensamento Computacional, Mundo Digital e Cultura Digital.","Boas sequências passam pelos três eixos, e não só por programação.","Cada habilidade tem um código (etapa, ano, componente e número). Confira sempre no texto oficial."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px">
 <label class="f">Título da aula <input id="bnt" value="Semáforo com micro:bit"></label>
 <label class="f">Etapa <select id="bne"><option>Educação Infantil</option><option>Ensino Fundamental, anos iniciais</option><option selected>Ensino Fundamental, anos finais</option><option>Ensino Médio</option></select></label>
 <div class="k">O que a aula trabalha (marque)</div>
 ${[["pc","Escrever ou seguir um algoritmo"],["pc","Repetição e condição"],["pc","Depurar (achar e corrigir erro)"],["md","Como o hardware recebe e envia sinais"],["md","Representação de dados (números, cores, texto)"],["md","Como a internet transmite informação"],["cd","Uso ético e seguro"],["cd","Autoria e direitos (imagens, código)"],["cd","Impacto social da tecnologia"]].map(([e,t],i)=>`<label class="chk"><input type="checkbox" data-bx="${e}" ${[0,1,3].includes(i)?"checked":""}> <span>${t} <span class="pill l">${BNCC_EIXOS[e][0]}</span></span></label>`).join("")}
 <label class="f">Códigos das habilidades (copie do documento oficial) <input id="bnc" placeholder="cole aqui os códigos"></label>
 <label class="f">Como você vai avaliar <input id="bna" value="Rubrica: funciona, explica o código, melhora o projeto"></label></div>
 <div><div class="k">Equilíbrio entre os eixos</div><canvas id="bncv" class="cv2"></canvas><div class="k">Ficha do plano</div><div class="infobox small" id="bnout"></div><div class="row wrap"><button class="btn ghost sm" id="bncopy">Copiar ficha</button></div></div></div>`,
 mount(root){
  const c = setupCanvas(q(root,"#bncv"), 320, 150);
  function draw(){
    const cnt = {pc:0, md:0, cd:0}; qa(root,"[data-bx]").forEach(b=>{ if (b.checked) cnt[b.dataset.bx]++; });
    c.clearRect(0,0,320,150); const cols = {pc:"#3d6bb3", md:"#00a676", cd:"#c88330"};
    Object.keys(cnt).forEach((k,i)=>{ const h = cnt[k]/3*100; c.fillStyle = cols[k]; c.fillRect(30+i*95, 120-h, 60, h); c.fillStyle = cssv("--ink"); c.font = "12px system-ui"; c.textAlign = "center"; c.fillText(BNCC_EIXOS[k][0].split(" ")[0]+(k==="pc"?" comp.":k==="md"?" digital":" digital"), 60+i*95, 138); c.fillText(cnt[k]+"/3", 60+i*95, 114-h); });
    const miss = Object.keys(cnt).filter(k=>!cnt[k]).map(k=>BNCC_EIXOS[k][0]);
    const txt = `Aula: ${q(root,"#bnt").value}\nEtapa: ${q(root,"#bne").value}\nEixos: ${Object.keys(cnt).filter(k=>cnt[k]).map(k=>BNCC_EIXOS[k][0]).join(", ")||"nenhum"}\nHabilidades (códigos): ${q(root,"#bnc").value||"a preencher"}\nObjetivos: ${qa(root,"[data-bx]").filter(b=>b.checked).map(b=>b.nextElementSibling.firstChild.textContent.trim()).join("; ")}\nAvaliação: ${q(root,"#bna").value}`;
    q(root,"#bnout").innerHTML = esc(txt).replace(/\n/g,"<br>") + (miss.length ? `<p class="warntext">Sem ${miss.join(" e ")}. Dá para incluir uma conversa curta sobre isso no fim da aula?</p>` : `<p class="oktext">A aula passa pelos três eixos.</p>`);
    q(root,"#bncopy").onclick = () => copyText(txt);
  }
  root.addEventListener("input", draw); root.addEventListener("change", draw); draw();
 }});

lab({id:"spiral", tr:"prof", area:"sw", title:"Espiral da aprendizagem criativa",
 blurb:"A espiral de Mitchel Resnick (MIT): imaginar, criar, brincar, compartilhar, refletir e imaginar de novo. Avance pela espiral com um projeto da sua turma e anote o que acontece em cada volta.",
 learn:["Cada volta da espiral leva a uma ideia nova e mais ambiciosa.","Os 4 Ps: Projetos, Paixão, Pares e Pensar brincando.","É a filosofia por trás do Scratch, que nasceu no mesmo grupo do MIT."],
 html:()=>`<div class="two-even" style="margin-top:0"><canvas id="spcv" class="cv2"></canvas><div class="grid" style="gap:8px">
 <label class="f">Projeto da turma <input id="spp" value="Jogo no Scratch sobre reciclagem"></label>
 <div class="infobox"><b id="spst"></b><div class="small" id="spq"></div><textarea id="spn" rows="3" style="width:100%;margin-top:6px" placeholder="O que aconteceu nesta etapa?"></textarea></div>
 <div class="row wrap"><button class="btn sm" id="spnext">Próxima etapa ➜</button><button class="btn ghost sm" id="spreset">Recomeçar</button></div>
 <div class="console small" id="splog"></div></div></div>`,
 mount(root){
  const S = [["Imaginar","Que ideia a turma quer realizar? Uma pergunta boa: “e se…?”"],["Criar","Os alunos constroem um primeiro protótipo, mesmo simples."],["Brincar","Testam, mexem, quebram, experimentam variações."],["Compartilhar","Mostram para colegas e outras turmas. Recebem ideias."],["Refletir","O que funcionou? O que mudariam? O que aprenderam?"]];
  const W = 340, H = 300, c = setupCanvas(q(root,"#spcv"), W, H);
  let step = 0, anim = 0, notes = ls.get("pp-spiral", []);
  const pt = s => { const a = s*1.25 - Math.PI/2, r = 14 + s*9; return [W/2 + Math.cos(a)*r, H/2 + Math.sin(a)*r]; };
  function draw(){
    c.clearRect(0,0,W,H); c.lineWidth = 3; c.strokeStyle = cssv("--line"); c.beginPath();
    for (let s=0; s<=14; s+=.05){ const [x,y] = pt(s); s?c.lineTo(x,y):c.moveTo(x,y); } c.stroke();
    c.strokeStyle = cssv("--accent"); c.beginPath(); for (let s=0; s<=Math.min(anim,14); s+=.05){ const [x,y] = pt(s); s?c.lineTo(x,y):c.moveTo(x,y); } c.stroke();
    for (let i=0;i<=14;i++){ const [x,y] = pt(i); c.fillStyle = i<=step ? cssv("--accent") : cssv("--surface"); c.strokeStyle = cssv("--accent"); c.lineWidth = 2; c.beginPath(); c.arc(x,y,i===step?9:6,0,7); c.fill(); c.stroke();
      if (i===step){ c.fillStyle = cssv("--ink"); c.font = "700 13px system-ui"; c.textAlign = "center"; c.fillText(S[i%5][0], x, y-14); } }
    c.fillStyle = cssv("--muted"); c.font = "12px system-ui"; c.textAlign = "left"; c.fillText(`Volta ${Math.floor(step/5)+1}`, 8, 18);
    q(root,"#spst").textContent = `${S[step%5][0]} (volta ${Math.floor(step/5)+1})`; q(root,"#spq").textContent = S[step%5][1];
    q(root,"#splog").innerHTML = notes.length ? notes.map(n=>`<div><b>${esc(n.s)}:</b> ${esc(n.t)}</div>`).join("") : '<span class="muted">Suas anotações aparecem aqui e ficam salvas neste aparelho.</span>';
  }
  labEvery(() => { if (anim < step){ anim = Math.min(step, anim + .08); draw(); } }, 30);
  q(root,"#spnext").addEventListener("click", () => { const t = q(root,"#spn").value.trim(); if (t){ notes.push({s:`${S[step%5][0]} ${Math.floor(step/5)+1}`, t}); ls.set("pp-spiral", notes); } q(root,"#spn").value = ""; if (step < 14) step++; draw(); });
  q(root,"#spreset").addEventListener("click", () => { step = 0; anim = 0; notes = []; ls.set("pp-spiral", notes); draw(); });
  draw();
 }});

const LOGO_DEF = "repita 5 [pf 80 gd 144]";
lab({id:"logo", tr:"prof", area:"sw", title:"Tartaruga do LOGO",
 blurb:"A linguagem que Seymour Papert criou para crianças aprenderem matemática programando. Escreva comandos em português e veja a tartaruga desenhar. Tente os desafios.",
 learn:["pf 50 anda 50 passos; gd 90 gira 90° à direita; ge gira à esquerda; pt anda para trás.","repita 4 [pf 50 gd 90] faz um quadrado: a repetição é o coração da programação.","Para um polígono de N lados, a tartaruga gira 360 ÷ N em cada canto."],
 html:()=>`<div class="two-even" style="margin-top:0"><canvas id="lgcv" class="cv2"></canvas><div class="grid" style="gap:8px">
 <textarea id="lgin" class="code" rows="5" spellcheck="false" style="font-family:var(--mono)">${LOGO_DEF}</textarea>
 <div class="row wrap"><button class="btn sm" id="lgrun">▶ Desenhar</button><label class="f inline">Velocidade <input type="range" id="lgsp" min="1" max="10" value="6"></label><button class="btn ghost sm" id="lgclr">Limpar</button></div>
 <div class="small muted">Comandos: pf, pt, gd, ge, repita N [ ... ], un (usar nada: levanta o lápis), ul (usar lápis), mudecor vermelho/azul/verde/preto, aprenda nome ... fim</div>
 <div class="k">Desafios</div><div class="row wrap">${[["Quadrado","repita 4 [pf 80 gd 90]"],["Triângulo",""],["Hexágono",""],["Flor","repita 12 [repita 4 [pf 50 gd 90] gd 30]"],["Escada",""]].map(([n,c])=>`<button class="btn ghost sm" data-lgx="${esc(c)}" data-lgn="${n}">${n}</button>`).join("")}</div>
 <div class="console small" id="lgmsg"></div></div></div>`,
 mount(root){
  const W = 360, H = 360, c = setupCanvas(q(root,"#lgcv"), W, H);
  let job = 0;
  const COLORS = {vermelho:"#e53935", azul:"#1e88e5", verde:"#43a047", preto:"#222", laranja:"#fb8c00", roxo:"#8e24aa"};
  function tokenize(src){ return src.toLowerCase().replace(/\[/g," [ ").replace(/\]/g," ] ").split(/\s+/).filter(Boolean); }
  function parse(tokens, procs){
    const out = [];
    while (tokens.length){
      const t = tokens.shift();
      if (t === "]") return out;
      const num = () => { const v = tokens.shift(); if (v === undefined || isNaN(+v)) throw `“${t}” precisa de um número`; return +v; };
      if (["pf","parafrente","pt","paratras","gd","paradireita","ge","paraesquerda"].includes(t)) out.push([t.slice(0,2) === "pa" ? {parafrente:"pf",paratras:"pt",paradireita:"gd",paraesquerda:"ge"}[t] : t, num()]);
      else if (t === "repita"){ const n = num(); if (tokens.shift() !== "[") throw "depois de “repita N” vem [ ... ]"; out.push(["rep", n, parse(tokens, procs)]); }
      else if (t === "un" || t === "ul") out.push([t]);
      else if (t === "mudecor"){ const cor = tokens.shift(); if (!COLORS[cor]) throw `cor desconhecida: ${cor}`; out.push(["cor", COLORS[cor]]); }
      else if (t === "aprenda"){ const nome = tokens.shift(); const body = []; while (tokens.length && tokens[0] !== "fim") body.push(tokens.shift()); tokens.shift(); procs[nome] = parse(body, procs); }
      else if (procs[t]) out.push(["call", t]);
      else throw `não conheço o comando “${t}”`;
    }
    return out;
  }
  function flatten(prog, procs, acc, depth){ if (depth > 30) throw "repetição demais"; for (const p of prog){ if (p[0]==="rep") for (let i=0;i<p[1];i++) flatten(p[2], procs, acc, depth+1); else if (p[0]==="call") flatten(procs[p[1]], procs, acc, depth+1); else acc.push(p); if (acc.length > 20000) throw "comandos demais"; } return acc; }
  function turtle(x,y,a){ c.save(); c.translate(x,y); c.rotate(a*Math.PI/180); c.fillStyle = "#2e7d32"; c.beginPath(); c.moveTo(0,-10); c.lineTo(7,7); c.lineTo(-7,7); c.closePath(); c.fill(); c.restore(); }
  function clear(){ c.fillStyle = "#fffdf5"; c.fillRect(0,0,W,H); c.strokeStyle = "rgba(0,0,0,.05)"; for (let i=0;i<W;i+=20){ c.beginPath(); c.moveTo(i,0); c.lineTo(i,H); c.moveTo(0,i); c.lineTo(W,i); c.stroke(); } }
  async function run(){
    const my = ++job; let procs = {}, cmds;
    try { cmds = flatten(parse(tokenize(q(root,"#lgin").value), procs), procs, [], 0); q(root,"#lgmsg").innerHTML = `<span class="oktext">${cmds.length} movimentos</span>`; }
    catch(e){ q(root,"#lgmsg").innerHTML = `<span class="warntext">${esc(String(e))}</span>`; return; }
    clear(); let x = W/2, y = H/2 + 40, a = 0, pen = true, col = "#222", lines = [];
    const sp = () => +q(root,"#lgsp").value;
    for (let i=0;i<cmds.length;i++){
      if (my !== job) return;
      const [k,v] = cmds[i];
      if (k==="gd") a += v; else if (k==="ge") a -= v; else if (k==="un") pen = false; else if (k==="ul") pen = true; else if (k==="cor") col = v;
      else { const d = k==="pf"?v:-v, nx = x + Math.sin(a*Math.PI/180)*d, ny = y - Math.cos(a*Math.PI/180)*d; if (pen) lines.push([x,y,nx,ny,col]); x = nx; y = ny; }
      if (sp() < 10 && (i % Math.max(1, Math.round(Math.pow(sp(),2)/4)) === 0)){ clear(); lines.forEach(l=>{ c.strokeStyle = l[4]; c.lineWidth = 2; c.beginPath(); c.moveTo(l[0],l[1]); c.lineTo(l[2],l[3]); c.stroke(); }); turtle(x,y,a); await wait(Math.max(4, 140 - sp()*14)); }
    }
    clear(); lines.forEach(l=>{ c.strokeStyle = l[4]; c.lineWidth = 2; c.beginPath(); c.moveTo(l[0],l[1]); c.lineTo(l[2],l[3]); c.stroke(); }); turtle(x,y,a);
  }
  q(root,"#lgrun").addEventListener("click", run);
  q(root,"#lgclr").addEventListener("click", () => { job++; clear(); turtle(W/2, H/2+40, 0); });
  root.addEventListener("click", e => { const b = e.target.closest("[data-lgn]"); if (!b) return;
    if (b.dataset.lgx){ q(root,"#lgin").value = b.dataset.lgx; run(); }
    else q(root,"#lgmsg").innerHTML = {"Triângulo":"Desafio: quanto a tartaruga gira em cada canto de um triângulo? (360 ÷ 3)","Hexágono":"Desafio: 6 lados. repita 6 [pf ? gd ?]","Escada":"Desafio: alterne pf e gd 90 / ge 90 dentro de um repita."}[b.dataset.lgn]; });
  clear(); turtle(W/2, H/2+40, 0);
 }});

lab({id:"rubric", tr:"prof", area:"sw", title:"Construtor de rubricas",
 blurb:"Edite os critérios e os níveis da rubrica clicando nas células. Depois avalie um aluno clicando no nível de cada critério: a nota sai na hora, com o peso de cada critério.",
 learn:["Rubrica deixa claro, antes do trabalho, o que é um bom resultado.","Descreva o que se vê em cada nível (“o robô segue a linha sem sair”), não só “bom” ou “ruim”.","Entregue a rubrica junto com o projeto: os alunos usam para se autoavaliar."],
 html:()=>`<div class="tablewrap"><table class="rgrid" id="rbt"></table></div>
 <div class="row wrap ctrls" style="margin-top:8px"><button class="btn ghost sm" id="rbadd">+ Critério</button><button class="btn ghost sm" id="rbcopy">Copiar como texto</button><button class="btn ghost sm" id="rbclear">Limpar avaliação</button><label class="f inline">Aluno <input id="rbname" value="Aluno 1" style="width:120px"></label></div>
 <div class="readout"><div><span class="k">Nota</span><b id="rbnota">–</b></div><div><span class="k">Critérios avaliados</span><b id="rbn">0</b></div></div><div class="small" id="rbfb"></div>`,
 mount(root){
  const LV = ["Iniciante (1)","Em desenvolvimento (2)","Proficiente (3)","Avançado (4)"];
  let R = ls.get("pp-rubric", [
   {c:"Funcionamento", w:3, d:["Não funciona","Funciona com ajuda","Funciona sozinho","Funciona e trata erros"]},
   {c:"Código", w:2, d:["Copiado sem entender","Explica partes","Explica tudo","Organizado e comentado"]},
   {c:"Criatividade", w:2, d:["Igual ao exemplo","Muda uma coisa","Ideia própria","Ideia própria surpreendente"]},
   {c:"Apresentação", w:1, d:["Não apresenta","Lê o que fez","Explica com clareza","Explica e responde perguntas"]}]), pick = {};
  const save = () => ls.set("pp-rubric", R);
  function draw(){
    q(root,"#rbt").innerHTML = `<tr><th>Critério</th><th>Peso</th>${LV.map(l=>`<th>${l}</th>`).join("")}<th></th></tr>` + R.map((r,i)=>`<tr><th contenteditable data-rc="${i}">${esc(r.c)}</th><td><input type="number" min="1" max="5" value="${r.w}" data-rw="${i}" style="width:48px"></td>${r.d.map((d,k)=>`<td contenteditable data-rd="${i}-${k}" class="${pick[i]===k?"pick":""}">${esc(d)}</td>`).join("")}<td><button class="btn ghost sm" data-rp="${i}">Avaliar</button><button class="btn ghost sm" data-rx="${i}" title="Remover">✕</button></td></tr>`).join("");
    score();
  }
  function score(){
    const keys = Object.keys(pick).filter(i=>R[i]); const tw = keys.reduce((t,i)=>t+R[i].w,0);
    const n = tw ? keys.reduce((t,i)=>t+R[i].w*(pick[i]+1),0)/(tw*4)*10 : null;
    q(root,"#rbnota").textContent = n===null ? "–" : n.toFixed(1).replace(".",","); q(root,"#rbn").textContent = `${keys.length}/${R.length}`;
    q(root,"#rbfb").innerHTML = keys.length === R.length ? `<b>${esc(q(root,"#rbname").value)}</b>: ` + keys.map(i=>`${esc(R[i].c)} → ${esc(R[i].d[pick[i]])}`).join("; ") : "Clique em “Avaliar” e depois numa célula de nível, ou clique direto na célula com Alt.";
  }
  let evalRow = null;
  root.addEventListener("click", e => {
    const p = e.target.closest("[data-rp]"); if (p){ evalRow = +p.dataset.rp; toast("Agora clique no nível desse critério"); return; }
    const x = e.target.closest("[data-rx]"); if (x){ R.splice(+x.dataset.rx,1); delete pick[x.dataset.rx]; save(); draw(); return; }
    const d = e.target.closest("[data-rd]"); if (d){ const [i,k] = d.dataset.rd.split("-").map(Number); if (evalRow === i || e.altKey){ pick[i] = k; evalRow = null; draw(); } }
  });
  root.addEventListener("input", e => {
    if (e.target.dataset.rc !== undefined) { R[+e.target.dataset.rc].c = e.target.textContent; save(); }
    if (e.target.dataset.rd !== undefined) { const [i,k] = e.target.dataset.rd.split("-").map(Number); R[i].d[k] = e.target.textContent; save(); }
    if (e.target.dataset.rw !== undefined) { R[+e.target.dataset.rw].w = Math.max(1, +e.target.value||1); save(); score(); }
    if (e.target.id === "rbname") score();
  });
  q(root,"#rbadd").addEventListener("click", () => { R.push({c:"Novo critério", w:1, d:["…","…","…","…"]}); save(); draw(); });
  q(root,"#rbclear").addEventListener("click", () => { pick = {}; draw(); });
  q(root,"#rbcopy").addEventListener("click", () => copyText(R.map(r=>`${r.c} (peso ${r.w})\n`+r.d.map((d,k)=>`  ${LV[k]}: ${d}`).join("\n")).join("\n\n")));
  draw();
 }});

lab({id:"cidadania", tr:"prof", area:"sw", title:"Cidadania digital: o que fazer?",
 blurb:"Situações reais de escola. Escolha como agir e leia a explicação. Use as mesmas situações em sala, com a turma votando antes de revelar.",
 learn:["Pensar antes de postar: o que vai para a internet pode ficar lá para sempre.","Imagem de outra pessoa só com autorização. Com alunos menores, a escola precisa da autorização dos responsáveis.","Diante de violência on-line, a ordem é: acolher, registrar (print), não espalhar, comunicar a escola."],
 html:()=>`<div class="qz" id="qz"></div>`,
 mount(root){
  quizEngine(root, [
   {q:"Um aluno conta que um colega criou um perfil falso com fotos dele para zombar.", o:["Acolher o aluno, registrar prints com data, comunicar a coordenação e os responsáveis, e denunciar o perfil na plataforma","Dizer para ele ignorar que passa","Pedir para a turma inteira ir lá comentar contra o perfil"], a:0, w:"Acolher e registrar protegem a vítima. Espalhar ou responder em grupo aumenta a exposição. A escola tem protocolos para isso."},
   {q:"Na feira de ciências, você quer postar fotos dos alunos no Instagram da escola.", o:["Postar só de quem tem autorização de imagem assinada pelos responsáveis","Postar todas, porque é para uma causa boa","Postar e marcar o perfil pessoal de cada aluno"], a:0, w:"O ECA e a LGPD exigem cuidado com a imagem de crianças e adolescentes. Autorização dos responsáveis vem primeiro."},
   {q:"Um aluno entrega um trabalho todo escrito por IA, sem dizer.", o:["Conversar com ele, pedir que explique o que escreveu e combinar regras claras de uso de IA para a turma","Dar zero e expor o caso para a turma","Proibir qualquer uso de tecnologia na disciplina"], a:0, w:"O objetivo é aprender. Regras claras (quando pode usar, como citar) e avaliação que peça explicação funcionam melhor do que punição pública."},
   {q:"Uma mensagem no grupo de pais diz que a escola vai fechar amanhã por causa de um vírus no computador.", o:["Conferir em um canal oficial da escola antes de repassar","Repassar logo, pois pode ser urgente","Responder no grupo que é mentira, sem conferir"], a:0, w:"Verificar a fonte antes de compartilhar é a base do combate à desinformação. Isso vale ensinar aos alunos também."},
   {q:"Um aluno usou uma música famosa no vídeo do projeto e quer publicar no YouTube.", o:["Explicar direitos autorais e mostrar bibliotecas de áudio livre","Publicar, porque é trabalho escolar","Baixar a música de outro site para não dar problema"], a:0, w:"Uso escolar em sala é diferente de publicar. Bibliotecas de áudio com licença livre resolvem o problema e ensinam autoria."},
   {q:"Uma aluna pede para você seguir o perfil pessoal dela e conversar pelo direct.", o:["Manter a comunicação pelos canais oficiais da escola e explicar o motivo com gentileza","Aceitar, para criar vínculo","Bloquear sem explicar"], a:0, w:"Canais oficiais protegem a aluna e você. O vínculo se cria na aula, com transparência."}
  ]);
 }});

lab({id:"coursesite", tr:"prof", area:"sw", title:"Gerador do site da sua disciplina",
 blurb:"Preencha os campos e veja o site da disciplina sendo montado ao lado. Baixe o arquivo HTML e publique no GitHub Pages, do mesmo jeito que este site foi publicado.",
 learn:["Um site simples é um único arquivo index.html.","No GitHub Pages, o arquivo index.html do repositório vira a página inicial.","Links de materiais no Drive precisam estar compartilhados como “qualquer pessoa com o link pode ver”."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px">
 <label class="f">Disciplina <input id="csn" value="Educação Digital"></label><label class="f">Professor <input id="csp" value="Prof. Márcio"></label><label class="f">Turmas <input id="cst" value="6º ao 9º ano"></label>
 <label class="f">Cor <input type="color" id="csc" value="#3d6bb3"></label>
 <label class="f">Aulas (uma por linha: título | link)<textarea id="csa" rows="6">Aula 1: o que é um algoritmo | https://
Aula 2: blocos no micro:bit | https://
Aula 3: segurança na internet | https://
Projeto final: semáforo inteligente | https://</textarea></label>
 <label class="f">Recado <input id="csr" value="Dúvidas? Fale comigo no Classroom."></label>
 <div class="row wrap"><button class="btn sm" id="csdl">Baixar index.html</button><button class="btn ghost sm" id="cscopy">Copiar código</button></div></div>
 <div><div class="k">Prévia</div><iframe id="csfr" title="Prévia do site" style="width:100%;height:460px;border:1px solid var(--line);border-radius:10px;background:#fff" sandbox=""></iframe></div></div>`,
 mount(root){
  const v = id => q(root,id).value;
  function build(){
    const aulas = v("#csa").split("\n").map(l=>l.split("|").map(s=>s.trim())).filter(a=>a[0]);
    const e = s => String(s).replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
    return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(v("#csn"))}</title>
<style>body{margin:0;font-family:system-ui,sans-serif;color:#1d1d1f;background:#f7f7f9}header{background:${e(v("#csc"))};color:#fff;padding:32px 20px}h1{margin:0 0 4px;font-size:28px}main{max-width:720px;margin:auto;padding:20px}ol{padding:0;list-style:none;counter-reset:a}li{counter-increment:a;background:#fff;border-radius:12px;padding:14px 16px;margin:10px 0;box-shadow:0 1px 3px rgba(0,0,0,.08);display:flex;gap:12px;align-items:center}li::before{content:counter(a);background:${e(v("#csc"))};color:#fff;border-radius:50%;width:28px;height:28px;display:grid;place-content:center;font-weight:700;flex:none}a{color:${e(v("#csc"))};font-weight:600}.r{background:#fff;border-left:4px solid ${e(v("#csc"))};padding:12px;border-radius:6px}</style></head>
<body><header><h1>${e(v("#csn"))}</h1><div>${e(v("#csp"))} · ${e(v("#cst"))}</div></header>
<main><h2>Aulas</h2><ol>${aulas.map(a=>`<li><span>${e(a[0])}${a[1]?` <a href="${e(a[1])}">abrir</a>`:""}</span></li>`).join("")}</ol>
<p class="r">${e(v("#csr"))}</p></main></body></html>`;
  }
  const draw = () => { q(root,"#csfr").srcdoc = build(); };
  root.addEventListener("input", draw);
  q(root,"#csdl").addEventListener("click", () => download("index.html", build(), "text/html"));
  q(root,"#cscopy").addEventListener("click", () => copyText(build()));
  draw();
 }});

const RELATO = [
 ["Título","Um título que diga o que foi feito e com quem.",10,"Robótica com micro:bit no 7º ano: um semáforo para a escola"],
 ["Contexto","Escola, turma, número de alunos, recursos disponíveis, qual problema ou oportunidade motivou a experiência.",60,""],
 ["Objetivos","O que os alunos deveriam aprender. Ligue com a BNCC.",30,""],
 ["Metodologia","Passo a passo do que foi feito, em quantas aulas, com quais materiais.",100,""],
 ["Resultados","O que aconteceu de verdade: produções, falas dos alunos, dados, fotos (com autorização).",80,""],
 ["Reflexão","O que funcionou, o que mudaria, o que aprendeu como professor.",60,""],
 ["Referências","Autores e materiais que inspiraram a prática.",10,""]
];
lab({id:"relato", tr:"prof", area:"sw", title:"Estrutura de um relato de experiência",
 blurb:"Escreva seu relato seção por seção. O medidor mostra se cada parte já tem o tamanho mínimo, e a prévia monta o texto no formato pedido em eventos de educação.",
 learn:["Relato de experiência é um gênero acadêmico aceito em congressos de educação e de informática na educação.","A seção mais fraca costuma ser a Reflexão: não descreva só o que deu certo.","Dados simples (quantos alunos concluíram, o que disseram) dão força ao relato."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:10px" id="rlf"></div><div><div class="k">Prévia</div><div class="wdoc small" id="rlp" style="max-height:520px;overflow:auto"></div><div class="row wrap" style="margin-top:8px"><button class="btn ghost sm" id="rlcopy">Copiar texto</button></div></div></div>`,
 mount(root){
  let val = ls.get("pp-relato", RELATO.map(r=>r[3]));
  q(root,"#rlf").innerHTML = RELATO.map((r,i)=>`<label class="f">${r[0]} <span class="small muted" style="font-weight:400">${r[1]}</span><textarea rows="${i?3:1}" data-rl="${i}">${esc(val[i]||"")}</textarea><div class="qbar"><i data-rlb="${i}"></i></div><span class="small muted" data-rlc="${i}"></span></label>`).join("");
  function draw(){
    RELATO.forEach((r,i)=>{ const n = (val[i]||"").trim().split(/\s+/).filter(Boolean).length; q(root,`[data-rlb="${i}"]`).style.width = Math.min(100, n/r[2]*100)+"%"; q(root,`[data-rlc="${i}"]`).textContent = `${n} palavras (mínimo sugerido: ${r[2]})`; });
    q(root,"#rlp").innerHTML = `<div class="h1" style="font-size:18px">${esc(val[0]||"Título")}</div>` + RELATO.slice(1).map((r,i)=>`<div class="h2" style="font-size:14px">${i+1}. ${r[0]}</div><p style="cursor:auto">${esc(val[i+1]||"…")}</p>`).join("");
  }
  root.addEventListener("input", e => { const i = e.target.dataset.rl; if (i !== undefined){ val[+i] = e.target.value; ls.set("pp-relato", val); draw(); } });
  q(root,"#rlcopy").addEventListener("click", () => copyText(RELATO.map((r,i)=>i?`${i}. ${r[0]}\n${val[i]||""}`:val[0]).join("\n\n")));
  draw();
 }});

// ================= MAKER LAB =================
const ML_ITEMS = [["🖨","Impressora 3D","Precisa de ventilação e longe da porta (cheiro e calor)."],["✂","Máquina de corte","Perto de tomada e com espaço para a manta."],["🔌","Bancada de eletrônica","Precisa de tomada; ferro de solda pede janela."],["💻","Computadores","Precisam de tomada."],["📦","Armário de kits","Perto da porta, para entregar e recolher."],["🧯","Extintor","Junto à porta, visível."]];
lab({id:"makerlab", tr:"maker", area:"hw", title:"Planejador do laboratório maker",
 blurb:"Escolha um equipamento e toque na planta da sala para posicionar. O verificador confere tomadas, ventilação e rota de saída. Ao lado, monte a lista de compras.",
 learn:["Segurança primeiro: extintor perto da saída e caminho livre até a porta.","Impressora 3D e solda soltam fumaça e cheiro: janela ou exaustão.","Comece pequeno: poucos kits bem cuidados rendem mais que muitos kits perdidos."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="row wrap ctrls">${ML_ITEMS.map((it,i)=>`<button class="btn ghost sm" data-mli="${i}">${it[0]} ${it[1]}</button>`).join("")}<button class="btn ghost sm" data-mli="-1">🧽 Apagar</button></div>
 <div class="roomg" id="mlroom"></div><div class="small muted">Azul: janela. Marrom: porta. ⚡: tomada.</div><div class="infobox small" id="mlchk" style="margin-top:8px"></div></div>
 <div><div class="k">Lista de compras e orçamento</div><div class="tablewrap"><table class="ss" id="mlbom"></table></div><div class="row wrap ctrls"><input id="mlnew" placeholder="Item" style="flex:1"><input id="mlqt" type="number" value="1" style="width:60px"><input id="mlpr" type="number" placeholder="Preço un." style="width:100px"><button class="btn sm" id="mladd">Adicionar</button></div>
 <div class="readout"><div><span class="k">Total estimado</span><b id="mltot"></b></div></div><div class="small muted">Os preços você pesquisa e digita: eles mudam muito.</div></div></div>`,
 mount(root){
  const C = 10, R = 7, win = new Set([1,2,3,4,5,6].map(x=>x)), door = 6*C+9, outs = new Set([0*C+0,0*C+9,3*C+0,6*C+0,3*C+9,6*C+4]);
  let grid = ls.get("pp-makerlab", {}), cur = 0, bom = ls.get("pp-makerbom", [["Kit micro:bit",10,0],["Filamento PLA 1 kg",4,0]]);
  const near = (i, set) => { const r = Math.floor(i/C), c = i%C; for (const j of set){ const rr = Math.floor(j/C), cc = j%C; if (Math.abs(rr-r)<=1 && Math.abs(cc-c)<=1) return true; } return false; };
  function draw(){
    q(root,"#mlroom").innerHTML = Array.from({length:C*R},(_,i)=>`<div data-mlc="${i}" class="${win.has(i)?"win":""} ${i===door?"door":""} ${outs.has(i)?"out":""}">${grid[i]!==undefined?ML_ITEMS[grid[i]][0]:""}</div>`).join("");
    const checks = [], pos = k => Object.keys(grid).filter(i=>grid[i]===k).map(Number);
    pos(0).forEach(i=>checks.push([near(i,win), `Impressora 3D ${near(i,win)?"perto da janela":"longe da janela: precisa de ventilação"}`]));
    [1,2,3].forEach(k=>pos(k).forEach(i=>checks.push([near(i,outs), `${ML_ITEMS[k][1]} ${near(i,outs)?"tem tomada perto":"sem tomada perto"}`])));
    const ext = pos(5); checks.push([ext.some(i=>near(i,new Set([door]))), ext.length ? (ext.some(i=>near(i,new Set([door])))?"Extintor junto à porta":"Extintor longe da porta") : "Falta o extintor"]);
    checks.push([grid[door-1]===undefined && grid[door-C]===undefined, "Passagem livre até a porta"]);
    pos(4).forEach(i=>checks.push([near(i,new Set([door,door-1,door-C])), `Armário ${near(i,new Set([door,door-1,door-C]))?"perto da porta":"poderia ficar mais perto da porta"}`]));
    q(root,"#mlchk").innerHTML = checks.map(([ok,t])=>`<div>${ok?"✅":"⚠"} ${t}</div>`).join("") || "Posicione os equipamentos.";
    q(root,"#mlbom").innerHTML = `<tr><th>Item</th><th>Qtd</th><th>Preço un.</th><th>Subtotal</th><th></th></tr>` + bom.map((b,i)=>`<tr><td>${esc(b[0])}</td><td><input type="number" value="${b[1]}" data-mbq="${i}" style="width:56px"></td><td><input type="number" value="${b[2]}" data-mbp="${i}" style="width:90px"></td><td>${(b[1]*b[2]).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td><td><button class="btn ghost sm" data-mbx="${i}">✕</button></td></tr>`).join("");
    q(root,"#mltot").textContent = bom.reduce((t,b)=>t+b[1]*b[2],0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
    qa(root,"[data-mli]").forEach(b=>b.classList.toggle("ghost", +b.dataset.mli !== cur));
  }
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-mli]"); if (b){ cur = +b.dataset.mli; draw(); return; }
    const cell = e.target.closest("[data-mlc]"); if (cell){ const i = +cell.dataset.mlc; if (cur < 0 || i === door) delete grid[i]; else grid[i] = cur; ls.set("pp-makerlab", grid); draw(); return; }
    const x = e.target.closest("[data-mbx]"); if (x){ bom.splice(+x.dataset.mbx,1); ls.set("pp-makerbom", bom); draw(); }
    if (e.target.id === "mladd"){ const n = q(root,"#mlnew").value.trim(); if (!n) return; bom.push([n, +q(root,"#mlqt").value||1, +q(root,"#mlpr").value||0]); q(root,"#mlnew").value = ""; ls.set("pp-makerbom", bom); draw(); }
  });
  root.addEventListener("change", e => { const qi = e.target.dataset.mbq, pi = e.target.dataset.mbp; if (qi!==undefined) bom[+qi][1] = +e.target.value||0; if (pi!==undefined) bom[+pi][2] = +e.target.value||0; if (qi!==undefined||pi!==undefined){ ls.set("pp-makerbom", bom); draw(); } });
  draw();
 }});

// ================= DEVKIT: GitHub Student Pack =================
lab({id:"studpack", tr:"devkit", area:"sw", title:"Tour do GitHub Student Pack",
 blurb:"Siga o pedido do pacote de estudante passo a passo, numa simulação. Depois ligue cada tipo de benefício a um projeto seu, para não ativar coisas que você não vai usar.",
 learn:["O pedido é feito em education.github.com, com e-mail ou comprovante da faculdade.","Ofertas e prazos dos parceiros mudam com frequência: confira a lista atual na página oficial.","Muitos benefícios valem por tempo limitado depois de ativados. Ative quando for usar."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="k">Simulação do pedido</div><div class="infobox" id="spk"></div></div>
 <div><div class="k">Que tipo de benefício serve para quê?</div><div class="small muted">Toque num tipo de benefício e depois no projeto que ele ajuda.</div><div class="mapn" id="spben" style="margin-top:6px"></div><div class="mapn" id="spproj" style="margin-top:10px"></div><div class="small" id="spres"></div></div></div>`,
 mount(root){
  const STEPS = [
   ["Conta no GitHub","Use sua conta (marcioalbinods). Coloque nome real e foto no perfil: ajuda na verificação."],
   ["E-mail da faculdade","Adicione o e-mail institucional em Settings → Emails, se tiver um. Isso acelera a aprovação."],
   ["Formulário","Em education.github.com → Benefits for students → Get benefits. Diga o nome da faculdade."],
   ["Comprovante","Se pedir, envie foto da carteirinha ou da matrícula com data atual. A localização do navegador precisa ser perto da faculdade."],
   ["Análise","A resposta costuma chegar por e-mail. Se negar, a mensagem diz o motivo: corrija e reenvie."],
   ["Aprovado","Os benefícios aparecem na página do pacote. Ative um de cada vez, quando for usar."]];
  let s = 0;
  function drawSteps(){
    q(root,"#spk").innerHTML = STEPS.map((st,i)=>`<div class="chk" style="opacity:${i>s?.45:1}">${i<s?"✅":i===s?"👉":"⬜"} <span><b>${st[0]}</b>${i===s?`<br><span class="small">${st[1]}</span>`:""}</span></div>`).join("") + `<div class="row wrap" style="margin-top:8px">${s<STEPS.length-1?'<button class="btn sm" id="spgo">Fiz este passo</button>':'<span class="oktext">Pronto! Agora use o pacote com calma.</span>'}<button class="btn ghost sm" id="spre">Recomeçar</button></div>`;
  }
  const BEN = [["copilot","Assistente de código com IA","pedagogico"],["dom","Domínio próprio (.me e outros)","port"],["cloud","Créditos de nuvem","api"],["ide","IDEs profissionais (JetBrains)","py"],["design","Ferramentas de design e ícones","port"],["learn","Cursos e plataformas de estudo","py"]];
  const PROJ = [["port","Site portfólio"],["api","API do projeto real (back-end)"],["py","Aprender Python mais fundo"],["pedagogico","Gerar materiais de aula mais rápido"]];
  let pb = null, links = {};
  function drawBen(){
    q(root,"#spben").innerHTML = BEN.map(b=>`<button data-sb="${b[0]}" class="${pb===b[0]?"on":""}"><b>${b[1]}</b><span class="small">${links[b[0]]?"→ "+PROJ.find(p=>p[0]===links[b[0]])[1]:"toque para ligar"}</span></button>`).join("");
    q(root,"#spproj").innerHTML = PROJ.map(p=>`<button data-sp="${p[0]}"><b>${p[1]}</b></button>`).join("");
    const done = Object.keys(links).length, ok = BEN.filter(b=>links[b[0]]===b[2]).length;
    q(root,"#spres").innerHTML = done === BEN.length ? `${ok} de ${BEN.length} ligações iguais às minhas sugestões. Mas outras ligações também podem fazer sentido: o que importa é ter um motivo para ativar.` : "";
  }
  root.addEventListener("click", e => {
    if (e.target.id === "spgo"){ s++; drawSteps(); } if (e.target.id === "spre"){ s = 0; drawSteps(); }
    const b = e.target.closest("[data-sb]"); if (b){ pb = b.dataset.sb; drawBen(); }
    const p = e.target.closest("[data-sp]"); if (p && pb){ links[pb] = p.dataset.sp; pb = null; drawBen(); }
  });
  drawSteps(); drawBen();
 }});

// ================= IA =================
lab({id:"aicompare", tr:"ia", area:"sw", title:"Comparador: a mesma tarefa em três IAs",
 blurb:"Você tem Claude, Gemini e Copilot. Dê a mesma tarefa às três, cole um resumo da resposta e dê notas. O comparador guarda seus testes e mostra, com o tempo, qual funciona melhor para cada tipo de tarefa no seu trabalho.",
 learn:["Nenhuma IA é a melhor em tudo: depende da tarefa e da forma de pedir.","Teste com a mesma instrução, palavra por palavra, para a comparação ser justa.","Sempre confira fatos e código: as três podem errar com muita confiança."],
 html:()=>`<div class="grid" style="gap:8px"><div class="row wrap ctrls"><label class="f inline">Tipo de tarefa <select id="actype"><option>Plano de aula</option><option>Explicar um conceito</option><option>Escrever código</option><option>Corrigir código</option><option>Resumo de texto</option><option>Pesquisa</option><option>Imagem ou slide</option></select></label></div>
 <label class="f">Instrução usada (igual nas três) <textarea id="acprompt" rows="2" placeholder="Ex.: Crie um plano de aula de 50 minutos sobre algoritmos para o 6º ano, com uma atividade desplugada."></textarea></label>
 <div class="readout">${["Claude","Gemini","Copilot"].map(n=>`<div class="infobox"><b>${n}</b><textarea rows="2" data-acn="${n}" placeholder="Resumo da resposta" style="width:100%"></textarea>${["Correção","Clareza","Utilidade"].map(c=>`<label class="f inline small">${c} <input type="range" min="1" max="5" value="3" data-acr="${n}|${c}"><span>3</span></label>`).join("")}</div>`).join("")}</div>
 <div class="row wrap"><button class="btn sm" id="acsave">Salvar teste</button><button class="btn ghost sm" id="acclr">Apagar histórico</button></div>
 <div class="k">Seus resultados por tipo de tarefa (média das notas)</div><div class="tablewrap"><table class="ss" id="actab"></table></div></div>`,
 mount(root){
  let H = ls.get("pp-aicompare", []);
  root.addEventListener("input", e => { if (e.target.dataset.acr) e.target.nextElementSibling.textContent = e.target.value; });
  function draw(){
    const types = [...new Set(H.map(h=>h.type))];
    q(root,"#actab").innerHTML = `<tr><th>Tarefa</th><th>Testes</th><th>Claude</th><th>Gemini</th><th>Copilot</th></tr>` + (types.length ? types.map(t=>{ const hs = H.filter(h=>h.type===t); const avg = n => (hs.reduce((a,h)=>a+h.sc[n],0)/hs.length); const vals = ["Claude","Gemini","Copilot"].map(avg); const mx = Math.max(...vals);
      return `<tr><td>${esc(t)}</td><td>${hs.length}</td>${vals.map(v=>`<td class="${v===mx&&hs.length>1?"green":""}">${v.toFixed(1).replace(".",",")}</td>`).join("")}</tr>`; }).join("") : `<tr><td colspan="5" class="muted">Nenhum teste salvo. Faça o primeiro hoje.</td></tr>`);
  }
  q(root,"#acsave").addEventListener("click", () => {
    const sc = {}; ["Claude","Gemini","Copilot"].forEach(n => { sc[n] = ["Correção","Clareza","Utilidade"].reduce((t,c)=>t + +q(root,`[data-acr="${n}|${c}"]`).value, 0)/3; });
    H.push({type: q(root,"#actype").value, p: q(root,"#acprompt").value, at: Date.now(), sc, notes: Object.fromEntries(qa(root,"[data-acn]").map(t=>[t.dataset.acn, t.value]))});
    ls.set("pp-aicompare", H); draw(); toast("Teste salvo neste aparelho"); qa(root,"[data-acn]").forEach(t=>t.value="");
  });
  q(root,"#acclr").addEventListener("click", () => { if (H.length && confirm("Apagar todos os testes salvos?")){ H = []; ls.set("pp-aicompare", H); draw(); } });
  draw();
 }});

lab({id:"aiethics", tr:"ia", area:"sw", title:"Dilemas de ética com IA na escola",
 blurb:"Situações sem resposta perfeita. Escolha o que faria e veja os pontos a pesar. Funciona também como debate com a turma.",
 learn:["Privacidade: não cole dados pessoais de alunos em ferramentas de IA sem saber para onde eles vão.","Transparência: diga quando um material foi feito com ajuda de IA.","Viés: IAs repetem preconceitos dos dados. Revise antes de usar em sala."],
 html:()=>`<div class="qz" id="qz"></div>`,
 mount(root){
  quizEngine(root, [
   {q:"Você quer que a IA escreva comentários personalizados no boletim de 120 alunos.", o:["Usar a IA com dados anônimos (sem nomes) e revisar cada comentário antes","Colar a planilha completa com nomes e notas","Não usar IA em nada de avaliação"], w:["Equilibra ganho de tempo e privacidade. A revisão garante que o comentário é verdadeiro e justo.","Expõe dados pessoais de menores. Verifique as regras da escola e os termos da ferramenta antes de qualquer coisa assim.","É uma escolha prudente, mas abre mão de uma ajuda útil que pode ser usada com cuidado."]},
   {q:"Um detector diz que a redação de um aluno foi “98% escrita por IA”.", o:["Não tratar como prova: conversar com o aluno e pedir que explique o texto","Dar zero com base no detector","Ignorar totalmente o assunto"], w:["Detectores erram bastante, inclusive acusando textos humanos. A conversa é a melhor evidência.","Punir com base só no detector pode ser injusto.","Ignorar perde a chance de ensinar o uso honesto de IA."]},
   {q:"A IA gerou uma imagem de “cientista” para o slide, e todas as versões mostram o mesmo tipo de pessoa.", o:["Pedir diversidade explicitamente e conversar com a turma sobre viés","Usar a primeira imagem","Trocar por imagens de banco de imagens sem falar nada"], w:["Mostra o viés na prática e vira aula de cultura digital.","Reforça um estereótipo sem perceber.","Resolve o slide, mas perde a oportunidade de discussão."]},
   {q:"Alunos do 6º ano pedem para usar um chatbot no trabalho de pesquisa.", o:["Ver a idade mínima nos termos da ferramenta e, se puder, usar junto com a turma","Liberar para cada um usar em casa","Proibir e não explicar"], w:["Muitas ferramentas têm idade mínima. Usar em conjunto permite ensinar a checar fontes.","Pode violar os termos e deixa os alunos sem orientação.","Proibir sem explicar não prepara para o mundo real."]},
   {q:"Você usou IA para montar uma prova. Uma questão tem um fato errado que você não percebeu.", o:["Anular a questão, explicar para a turma e reforçar sua revisão","Manter a questão, já que ninguém reclamou","Culpar a ferramenta"], w:["Assumir o erro dá o exemplo de uso responsável.","Deixa um erro avaliar os alunos.","A responsabilidade pelo material é de quem o usa em sala."]}
  ], {result:()=>`<p>Não há pontuação aqui: o objetivo é pensar nos critérios. Que regra de uso de IA você escreveria para a sua disciplina?</p>`});
 }});

const AI_SPEC = [
 ["ml","Engenharia de machine learning","Treina e coloca modelos em produção.","Python, estatística, PyTorch, MLOps","python,algo,back"],
 ["ds","Ciência de dados","Analisa dados para responder perguntas e tomar decisões.","Python, pandas, SQL, estatística, visualização","python,base"],
 ["app","Engenharia de aplicações com IA","Constrói produtos usando modelos prontos (APIs, agentes, RAG).","APIs, back-end, front-end, avaliação de modelos","front,back,ia"],
 ["ops","MLOps e infraestrutura","Mantém modelos rodando: nuvem, custo, monitoramento.","Linux, Docker, nuvem, CI","base,devkit,back"],
 ["nlp","Linguagem natural (NLP)","Modelos que entendem e geram texto.","Python, linguística, transformers","python,ia,ingles"],
 ["cv","Visão computacional","Modelos que entendem imagens e vídeo.","Python, álgebra linear, câmeras e sensores","python,maker"],
 ["edu","IA na educação","Cria e avalia o uso de IA para ensinar.","Pedagogia, avaliação, produto, ética","prof,ia"],
 ["emb","IA embarcada (edge)","Roda modelos pequenos em microcontroladores e celulares.","C/C++, eletrônica, otimização","maker,base"],
 ["res","Pesquisa em IA","Inventa métodos novos, publica artigos.","Matemática forte, inglês, mestrado e doutorado","algo,ingles,python"]
];
lab({id:"aimap", tr:"ia", area:"sw", title:"Mapa de especializações em IA",
 blurb:"Marque o que você mais gosta de fazer. O mapa acende as especializações que combinam e mostra quais trilhas deste site levam até cada uma.",
 learn:["“Trabalhar com IA” são muitas profissões diferentes.","Seu diferencial possível: IA aplicada à educação, juntando o que você já sabe de sala de aula.","Escolher agora não é para sempre. Fundamentos sólidos servem para todas."],
 html:()=>`<div class="row wrap ctrls">${[["python","Programar em Python"],["front","Fazer telas e produtos"],["back","Servidores e dados"],["maker","Hardware e eletrônica"],["prof","Ensinar"],["algo","Matemática e lógica"],["ingles","Ler e escrever em inglês"]].map(([k,l])=>`<label class="chk inline"><input type="checkbox" data-ai="${k}"> ${l}</label>`).join("")}</div>
 <div class="mapn" id="aim"></div><div class="infobox small" id="aid" style="margin-top:10px">Toque numa especialização para ver detalhes.</div>`,
 mount(root){
  let sel = null;
  const TRN = Object.fromEntries(TRACKS.map(t=>[t.id,t.name]));
  function draw(){
    const likes = qa(root,"[data-ai]").filter(c=>c.checked).map(c=>c.dataset.ai);
    const sc = s => s[4].split(",").filter(t=>likes.includes(t)).length;
    const best = Math.max(0, ...AI_SPEC.map(sc));
    q(root,"#aim").innerHTML = AI_SPEC.map(s=>`<button data-as="${s[0]}" class="${sel===s[0]?"on":""} ${likes.length&&sc(s)<best?"dim":""}"><b>${s[1]}</b><span class="small">${s[2]}</span>${likes.length?`<div class="small muted">${sc(s)} afinidade(s)</div>`:""}</button>`).join("");
    const s = AI_SPEC.find(x=>x[0]===sel);
    if (s) q(root,"#aid").innerHTML = `<b>${s[1]}</b><p>${s[2]}</p><p><b>Habilidades:</b> ${s[3]}</p><p><b>Trilhas do site que levam até aqui:</b> ${s[4].split(",").map(t=>`<a href="#trilhas">${esc(TRN[t]||t)}</a>`).join(", ")}</p>`;
  }
  root.addEventListener("change", draw);
  root.addEventListener("click", e => { const b = e.target.closest("[data-as]"); if (b){ sel = b.dataset.as; draw(); } });
  draw();
 }});

// ================= INGLÊS =================
lab({id:"leveltest", tr:"ingles", area:"sw", title:"Teste rápido de nível por habilidade",
 blurb:"Doze questões curtas de vocabulário, gramática, leitura e escuta (com áudio). O resultado mostra uma estimativa por habilidade, para você saber onde focar. Não substitui um teste oficial.",
 learn:["O Quadro Europeu (CEFR) vai de A1 a C2. Para ler documentação com conforto, mire em B2.","Habilidades evoluem em ritmos diferentes: muita gente lê bem e entende pouco ao ouvir.","Refaça este teste a cada três meses e compare."],
 html:()=>`<div class="qz" id="qz"></div>`,
 mount(root){
  const items = [
   {tag:"Vocabulário", q:"“I need to <b>fix</b> this bug.” Fix significa:", o:["consertar","fixar na parede","encontrar"], a:0},
   {tag:"Vocabulário", q:"Qual palavra completa: “The app <b>___</b> when I click the button.” (para de funcionar de repente)", o:["crashes","crushes","cracks"], a:0},
   {tag:"Vocabulário", q:"“<b>Deadline</b>” é:", o:["prazo final","linha morta do código","data de início"], a:0},
   {tag:"Gramática", q:"Escolha a correta:", o:["She has worked here since 2020.","She works here since 2020.","She is working here since 2020."], a:0, w:"Com since/for, para algo que começou no passado e continua, usamos o present perfect."},
   {tag:"Gramática", q:"“If I <b>___</b> more time, I would learn Rust.”", o:["had","have","will have"], a:0},
   {tag:"Gramática", q:"Escolha a correta:", o:["There are many informations here.","There is a lot of information here.","There are a lot of information here."], a:1, w:"Information é incontável em inglês: nunca vai para o plural."},
   {tag:"Leitura", q:"“Run <code>npm install</code> before starting the server; otherwise the dependencies will be missing.” O que acontece se você não rodar o comando?", o:["Vão faltar dependências","O servidor fica mais rápido","Nada"], a:0},
   {tag:"Leitura", q:"“This feature is deprecated and will be removed in the next major release.” A funcionalidade:", o:["será removida numa versão futura","acabou de ser lançada","é recomendada"], a:0},
   {tag:"Leitura", q:"“Contributions are welcome, provided that you follow the style guide.” Provided that significa:", o:["desde que","fornecido","apesar de"], a:0},
   {tag:"Escuta", q:"Ouça e escolha o que foi dito.", say:"Could you share your screen, please?", o:["Could you share your screen, please?","Could you change your scream, please?","Can you show your cream, please?"], a:0},
   {tag:"Escuta", q:"Ouça e escolha o que foi dito.", say:"The meeting was moved to Thursday afternoon.", o:["The meeting was moved to Thursday afternoon.","The meeting was made on Tuesday afternoon.","The meetings were moved to thirty afternoons."], a:0},
   {tag:"Escuta", q:"Ouça e escolha o que foi dito.", say:"I think we should refactor this function first.", o:["I think we should refactor this function first.","I think we shoot a fact on this function first.","I thought she would react to this fiction first."], a:0}
  ];
  quizEngine(root, items, {result:(s, ans)=>{
   const by = {}; items.forEach((it,i)=>{ by[it.tag] = by[it.tag]||[0,0]; by[it.tag][1]++; if (ans[i]===it.a) by[it.tag][0]++; });
   const lvl = r => r>=1?"forte (B2 ou mais)":r>=.67?"bom (B1 a B2)":r>=.34?"em construção (A2 a B1)":"início (A1 a A2)";
   const prev = ls.get("pp-leveltest", null); ls.set("pp-leveltest", {at:Date.now(), by});
   return `<p>Total: <b>${s}</b> de ${items.length}.</p>` + Object.entries(by).map(([k,[a,n]])=>`<div class="row" style="gap:8px"><b style="width:110px">${k}</b><div class="qbar" style="flex:1"><i style="width:${a/n*100}%"></i></div><span class="small">${a}/${n} · ${lvl(a/n)}</span></div>`).join("") + (prev?`<p class="small muted">Teste anterior em ${new Date(prev.at).toLocaleDateString("pt-BR")}.</p>`:"") + `<p class="small muted">Estimativa grosseira, com poucas questões. Foque na habilidade mais baixa.</p>`; }});
 }});

const VOCAB = [["deploy","publicar o sistema no ar","We deploy every Friday."],["bug","erro no programa","I found a bug in the login page."],["branch","ramo (cópia paralela do código)","Create a new branch for this feature."],["merge","juntar (duas versões do código)","Can you merge my pull request?"],["issue","problema registrado, tarefa","I opened an issue on GitHub."],["release","versão lançada","The new release fixes three bugs."],["feature","funcionalidade","This feature is still in beta."],["backend","parte do servidor","The backend stores the data."],["request","pedido (requisição)","The request took two seconds."],["database","banco de dados","Back up the database every night."],["framework","estrutura de ferramentas pronta","React is a popular framework."],["debug","depurar, achar o erro","Let me debug this function."],["library","biblioteca de código","Install the library with pip."],["update","atualizar","Please update your browser."],["setting","configuração","Change this setting to dark mode."],["shortcut","atalho","Use the keyboard shortcut."],["assignment","tarefa, trabalho escolar","The assignment is due tomorrow."],["grade","nota; ano escolar","She is in seventh grade."],["feedback","retorno, comentário","Thanks for the feedback!"],["skill","habilidade","Teamwork is an important skill."]];
lab({id:"vocab", tr:"ingles", area:"sw", title:"Flashcards de tecnologia com áudio",
 blurb:"Ouça a palavra e a frase de exemplo numa voz em inglês americano, tente lembrar o significado e vire a carta. O que você erra volta mais vezes.",
 learn:["Aprenda palavras em frases, não soltas: é assim que você vai encontrá-las.","Repita em voz alta junto com o áudio (shadowing).","Estas palavras aparecem o tempo todo em documentação, GitHub e reuniões."],
 html:()=>`<div class="row wrap ctrls"><span class="pill" id="vbleft"></span><label class="f inline">Velocidade <select id="vbrate"><option value="0.7">Lenta</option><option value="0.95" selected>Normal</option></select></label><button class="btn ghost sm" id="vbreset">Recomeçar</button></div>
 <div class="infobox" style="text-align:center;padding:24px"><div id="vbw" style="font:800 34px var(--display)"></div><div id="vbex" class="small muted" style="margin:6px 0"></div><div class="row wrap" style="justify-content:center"><button class="btn ghost sm" id="vbsay">🔊 Palavra</button><button class="btn ghost sm" id="vbsayex">🔊 Frase</button><button class="btn sm" id="vbflip">Virar</button></div><div id="vbback" style="margin-top:12px;font-size:20px"></div>
 <div class="row wrap" id="vbgrade" style="justify-content:center;margin-top:10px;display:none"><button class="btn danger sm" data-vg="0">Não lembrei</button><button class="btn sm" data-vg="1">Lembrei</button></div></div>`,
 mount(root){
  let box = ls.get("pp-vocab", VOCAB.map((_,i)=>({i,s:0}))), cur;
  if (box.length !== VOCAB.length) box = VOCAB.map((_,i)=>({i,s:0}));
  function next(){
    const learned = box.filter(b=>b.s>=3).length; q(root,"#vbleft").textContent = `${learned} de ${VOCAB.length} dominadas`;
    const pool = box.filter(b=>b.s<3); if (!pool.length){ q(root,"#vbw").textContent = "🎉 Todas dominadas!"; q(root,"#vbex").textContent = ""; q(root,"#vbback").textContent = ""; q(root,"#vbgrade").style.display = "none"; return; }
    pool.sort((a,b)=>a.s-b.s+Math.random()-.5); cur = pool[0];
    const [w,,ex] = VOCAB[cur.i]; q(root,"#vbw").textContent = w; q(root,"#vbex").textContent = ex; q(root,"#vbback").textContent = ""; q(root,"#vbgrade").style.display = "none";
    say(w, +q(root,"#vbrate").value);
  }
  q(root,"#vbsay").addEventListener("click", () => cur && say(VOCAB[cur.i][0], +q(root,"#vbrate").value));
  q(root,"#vbsayex").addEventListener("click", () => cur && say(VOCAB[cur.i][2], +q(root,"#vbrate").value));
  q(root,"#vbflip").addEventListener("click", () => { if (!cur) return; q(root,"#vbback").innerHTML = `<b>${esc(VOCAB[cur.i][1])}</b>`; q(root,"#vbgrade").style.display = "flex"; });
  root.addEventListener("click", e => { const g = e.target.closest("[data-vg]"); if (!g) return; cur.s = g.dataset.vg === "1" ? cur.s+1 : 0; ls.set("pp-vocab", box); next(); });
  q(root,"#vbreset").addEventListener("click", () => { box = VOCAB.map((_,i)=>({i,s:0})); ls.set("pp-vocab", box); next(); });
  labOnStop(()=>{ try{ speechSynthesis.cancel(); }catch(e){} });
  next();
 }});

const PAIRS = [["ship","sheep","i curto × i longo"],["live","leave","i curto × i longo"],["think","sink","th (língua entre os dentes) × s"],["three","tree","th × t"],["light","right","l × r inglês"],["work","walk","or × al"],["bad","bed","a aberto × e"],["full","fool","u curto × u longo"],["cat","cut","a × u"],["code","cold","o × ol"],["data","date","a × ei"],["fourteen","forty","ênfase no fim × no começo"]];
lab({id:"pairs", tr:"ingles", area:"sw", title:"Pronúncia: pares que confundem",
 blurb:"Ouça uma das duas palavras do par e diga qual foi. Depois ouça as duas em velocidade lenta e repita em voz alta. São os sons que mais confundem quem fala português.",
 learn:["Pares mínimos são palavras que mudam por um único som.","O “th” não existe em português: a ponta da língua fica entre os dentes.","Treinar o ouvido vem antes de treinar a boca."],
 html:()=>`<div class="infobox" style="text-align:center"><div class="small muted" id="prtip"></div><div class="row wrap" style="justify-content:center;margin:10px 0"><button class="btn sm" id="prplay">🔊 Tocar</button><button class="btn ghost sm" id="prslow">🐢 Lento</button></div>
 <div class="row wrap" id="propts" style="justify-content:center"></div><div id="prfb" style="margin-top:8px"></div></div>
 <div class="readout" style="margin-top:10px"><div><span class="k">Acertos</span><b id="prok">0</b></div><div><span class="k">Tentativas</span><b id="prn">0</b></div></div>
 <div class="k">Ouça os pares</div><div class="row wrap">${PAIRS.map((p,i)=>`<button class="btn ghost sm" data-prp="${i}">${p[0]} / ${p[1]}</button>`).join("")}</div>`,
 mount(root){
  let cur, ans, ok = 0, n = 0, answered = false;
  function next(){ cur = rnd(0,PAIRS.length-1); ans = rnd(0,1); answered = false; q(root,"#prtip").textContent = PAIRS[cur][2];
    q(root,"#propts").innerHTML = [0,1].map(k=>`<button class="btn ghost" data-pra="${k}" style="font-size:20px;min-width:110px">${PAIRS[cur][k]}</button>`).join(""); q(root,"#prfb").textContent = ""; say(PAIRS[cur][ans], .85); }
  q(root,"#prplay").addEventListener("click", () => say(PAIRS[cur][ans], .85));
  q(root,"#prslow").addEventListener("click", () => say(PAIRS[cur][ans], .5));
  root.addEventListener("click", e => {
    const a = e.target.closest("[data-pra]"); if (a && !answered){ answered = true; n++; const right = +a.dataset.pra === ans; if (right) ok++;
      q(root,"#prfb").innerHTML = (right?'<b class="oktext">Isso!</b>':`<b class="warntext">Foi “${PAIRS[cur][ans]}”.</b>`) + ` <button class="btn ghost sm" id="prcmp">Comparar as duas</button> <button class="btn sm" id="prnext">Próximo</button>`;
      q(root,"#prok").textContent = ok; q(root,"#prn").textContent = n; }
    if (e.target.id === "prnext") next();
    if (e.target.id === "prcmp"){ say(PAIRS[cur][0] + ". " + PAIRS[cur][1] + ". " + PAIRS[cur][0] + ". " + PAIRS[cur][1], .55); }
    const p = e.target.closest("[data-prp]"); if (p){ const pp = PAIRS[+p.dataset.prp]; say(pp[0] + ". " + pp[1], .55); }
  });
  labOnStop(()=>{ try{ speechSynthesis.cancel(); }catch(e){} });
  next();
 }});

const DOC_TEXT = [
 ["## Getting started",null],["To ",null],["install","instalar"],[" the package, run the following command in your ",null],["terminal","terminal (linha de comando)"],[". Make sure you have Python 3.10 or ",null],["later","mais recente"],[".",null],
 ["\n\n## Usage",null],["\nImport the module and call the ",null],["main","principal"],[" function. You can pass optional ",null],["arguments","argumentos (valores que a função recebe)"],[" to change the default ",null],["behavior","comportamento"],[".",null],
 ["\n\n## Troubleshooting",null],["\nIf you get a permission ",null],["error","erro"],[", try running the command with administrator ",null],["privileges","permissões"],[". ",null],["Note that","Observe que"],[" this tool is not ",null],["supported","suportado (não tem garantia de funcionar)"],[" on older versions of Windows.",null]
];
lab({id:"docsvocab", tr:"ingles", area:"sw", title:"Vocabulário de documentação técnica",
 blurb:"Um trecho típico de README. Toque nas palavras sublinhadas para ver o significado. Depois faça o jogo de ligar cada termo à sua tradução.",
 learn:["Documentação usa um vocabulário pequeno e repetido. Aprendendo umas 200 palavras, você lê quase tudo.","Getting started, Usage, Troubleshooting e Contributing são seções que aparecem em quase todo projeto.","Leia primeiro o código de exemplo: muitas vezes ele explica mais que o texto."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="mdprev" id="dvtext" style="white-space:pre-wrap;line-height:1.7"></div><div><div class="gloss-pop" id="dvpop">Toque numa palavra sublinhada.</div><div class="k" style="margin-top:12px">Ligue o termo à tradução</div><div class="dz" id="dvmatch"></div><div class="small" id="dvmres"></div></div></div>`,
 mount(root){
  q(root,"#dvtext").innerHTML = DOC_TEXT.map(([t,g])=> g ? `<span class="wordt" data-dg="${esc(g)}" data-dw="${esc(t)}">${esc(t)}</span>` : t.startsWith("\n\n## ")||t.startsWith("## ") ? `${t.startsWith("\n")?"\n\n":""}<b>${esc(t.replace(/\n|## /g,""))}</b>` : esc(t)).join("");
  root.addEventListener("click", e => { const w = e.target.closest("[data-dg]"); if (w){ q(root,"#dvpop").innerHTML = `<b>${esc(w.dataset.dw)}</b>: ${esc(w.dataset.dg)}`; say(w.dataset.dw, .85); } });
  const terms = shuffle(DOC_TEXT.filter(x=>x[1])).slice(0,6); let selT = null, done = {};
  const trans = shuffle(terms.map(t=>t[1]));
  function draw(){
    q(root,"#dvmatch").innerHTML = `<div>${terms.map((t,i)=>`<span class="chipf ${selT===i?"sel":""} ${done[i]?"okf":""}" data-mt="${i}">${esc(t[0])}</span>`).join("")}</div><div>${trans.map((t,i)=>`<span class="chipf ${Object.values(done).includes(t)?"okf":""}" data-mtr="${i}" style="font-family:var(--body)">${esc(t)}</span>`).join("")}</div>`;
    q(root,"#dvmres").textContent = Object.keys(done).length === terms.length ? "Completo! 🎉" : `${Object.keys(done).length} de ${terms.length}`;
  }
  root.addEventListener("click", e => {
    const t = e.target.closest("[data-mt]"); if (t){ selT = +t.dataset.mt; draw(); return; }
    const r = e.target.closest("[data-mtr]"); if (r && selT !== null){ const tr = trans[+r.dataset.mtr]; if (terms[selT][1] === tr){ done[selT] = tr; selT = null; } else toast("Não é essa. Tente outra."); draw(); }
  });
  draw();
 }});

const DIALOGS = {
 standup:{name:"Reunião diária (daily)", start:"a", nodes:{
  a:{t:"Good morning! Let's start the daily. What did you work on yesterday?", o:[["Yesterday I fixed the login bug and wrote some tests.","b",2],["Yesterday I make the login.","b",1,"Use o passado: “I made” ou “I worked on”."],["Yes.","a2",0,"A pergunta pede o que você fez. Responda com uma frase completa."]]},
  a2:{t:"Sorry, could you tell us what you worked on?", o:[["Sure! I worked on the login page.","b",2]]},
  b:{t:"Great. What are you going to do today?", o:[["Today I'm going to start the profile page.","c",2],["Today I will to start the profile page.","c",1,"Depois de will vem o verbo sem “to”: “I will start”."]]},
  c:{t:"Any blockers?", o:[["Yes, I'm waiting for the API documentation.","d",2],["No, everything is fine, thanks.","d",2],["I have a block.","d",1,"O natural é “I'm blocked by…” ou “I'm waiting for…”."]]},
  d:{t:"Thanks! That's all for today.", end:true}}},
 interview:{name:"Entrevista: apresentação", start:"a", nodes:{
  a:{t:"Hi, thanks for joining. Could you tell me a little about yourself?", o:[["Sure. I'm a computer science student and I teach digital education at a school.","b",2],["I have 30 years and I am student.","b",1,"Idade em inglês usa “to be”: “I'm 30”. E “I'm a student”, com artigo."]]},
  b:{t:"Interesting! Why are you interested in this internship?", o:[["I want to apply what I'm learning in real projects and work with a team.","c",2],["Because I need money.","c",1,"Honesto, mas fale do que você quer aprender e oferecer."]]},
  c:{t:"Can you describe a project you're proud of?", o:[["I built a study tracker website that syncs progress with Google Drive.","d",2],["I made a site. It's good.","d",1,"Dê detalhes: o que faz, que tecnologia usou, qual resultado."]]},
  d:{t:"That sounds great. Do you have any questions for us?", o:[["Yes, what does a typical day look like for an intern here?","e",2],["No.","e",1,"Ter uma pergunta mostra interesse. Prepare sempre uma ou duas."]]},
  e:{t:"Thank you for your time! We'll be in touch.", end:true}}}
};
lab({id:"dialogue", tr:"ingles", area:"sw", title:"Conversa guiada em inglês",
 blurb:"Escolha uma situação. A outra pessoa fala em voz alta; você escolhe a resposta. Respostas com erro comum mostram a correção, e no fim você vê sua pontuação de naturalidade.",
 learn:["Reuniões diárias seguem quase sempre três perguntas: ontem, hoje e bloqueios.","Frases prontas (chunks) dão segurança: “Could you repeat that, please?”","Leia sua resposta em voz alta depois de escolher."],
 html:()=>`<div class="row wrap ctrls">${Object.entries(DIALOGS).map(([k,d])=>`<button class="btn ghost sm" data-dlg="${k}">${d.name}</button>`).join("")}<label class="chk inline"><input type="checkbox" id="dlvoice" checked> Voz</label></div>
 <div class="chatbox infobox" id="dlbox"></div><div class="grid" id="dlopts" style="gap:6px;margin-top:8px"></div>`,
 mount(root){
  let D, node, pts, max;
  function start(k){ D = DIALOGS[k]; node = D.start; pts = 0; max = 0; q(root,"#dlbox").innerHTML = ""; show(); }
  function bubble(t, me){ const b = document.createElement("div"); b.className = "bubble "+(me?"me":"them"); b.innerHTML = t; q(root,"#dlbox").appendChild(b); q(root,"#dlbox").scrollTop = 1e6; }
  function show(){
    const n = D.nodes[node]; bubble(esc(n.t)); if (q(root,"#dlvoice").checked) say(n.t);
    if (n.end){ q(root,"#dlopts").innerHTML = `<div class="note">Naturalidade: <b>${pts} de ${max}</b>. ${pts===max?"Excelente!":"Releia as correções e tente de novo."}</div>`; return; }
    q(root,"#dlopts").innerHTML = shuffle(n.o.map((o,i)=>i)).map(i=>`<button class="opt btn ghost" style="text-align:left" data-dlo="${i}">${esc(n.o[i][0])}</button>`).join("") + `<button class="btn ghost sm" id="dlrep">🔊 Repetir</button>`;
  }
  root.addEventListener("click", e => {
    const d = e.target.closest("[data-dlg]"); if (d){ start(d.dataset.dlg); return; }
    if (e.target.id === "dlrep"){ say(D.nodes[node].t); return; }
    const o = e.target.closest("[data-dlo]"); if (!o) return;
    const opt = D.nodes[node].o[+o.dataset.dlo]; max += 2; pts += opt[2];
    bubble(esc(opt[0]) + (opt[3] ? `<div class="small" style="opacity:.9;margin-top:4px">💡 ${esc(opt[3])}</div>` : ""), true);
    node = opt[1]; labLater(show, 500);
  });
  labOnStop(()=>{ try{ speechSynthesis.cancel(); }catch(e){} });
  start("standup");
 }});

const READ_TXT = "Ada Lovelace is often called the first computer programmer. In 1843, she published notes about a machine designed by Charles Babbage, called the Analytical Engine. The machine was never built, but her notes included a step-by-step method to calculate a sequence of numbers. Many historians consider this method the first algorithm intended for a machine. She also imagined that such machines could one day work with music and images, not only numbers. Today, the second Tuesday of October is celebrated as Ada Lovelace Day, to highlight women in science and technology.";
const READ_GL = {often:"frequentemente",called:"chamada",published:"publicou",notes:"anotações",designed:"projetada",never:"nunca",built:"construída",included:"incluíam","step-by-step":"passo a passo",method:"método",calculate:"calcular",sequence:"sequência",historians:"historiadores",consider:"consideram",intended:"destinado",imagined:"imaginou",such:"tais",could:"poderiam",images:"imagens",celebrated:"celebrado",highlight:"destacar",women:"mulheres",science:"ciência",machine:"máquina",machines:"máquinas",engine:"motor, máquina",first:"primeira",today:"hoje",numbers:"números",also:"também",only:"apenas",one:"um",day:"dia"};
lab({id:"reading", tr:"ingles", area:"sw", title:"Leitura com glossário ao toque",
 blurb:"Um texto curto sobre Ada Lovelace. Toque em qualquer palavra para ver a tradução e ouvir a pronúncia. As palavras que você consultou viram uma lista de revisão. No fim, responda às perguntas.",
 learn:["Tente entender pelo contexto antes de tocar na palavra.","Leia duas vezes: a primeira pela ideia geral, a segunda pelos detalhes.","Leitura em inglês todos os dias, mesmo 10 minutos, faz mais diferença que uma hora por semana."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="row wrap ctrls"><button class="btn ghost sm" id="rdall">🔊 Ouvir o texto</button><button class="btn ghost sm" id="rdstop">⏹</button></div><div class="mdprev" id="rdtxt" style="line-height:1.9;font-size:17px"></div></div>
 <div><div class="gloss-pop" id="rdpop">Toque numa palavra.</div><div class="k">Palavras consultadas</div><div id="rdlist" class="small"></div><div class="k">Compreensão</div><div class="qz" id="qz"></div></div></div>`,
 mount(root){
  const seen = new Set();
  q(root,"#rdtxt").innerHTML = READ_TXT.split(/(\s+)/).map(w => /\s/.test(w) ? w : `<span class="wordt" data-rw="${esc(w)}">${esc(w)}</span>`).join("");
  root.addEventListener("click", e => {
    const w = e.target.closest("[data-rw]"); if (!w) return;
    const clean = w.dataset.rw.toLowerCase().replace(/[.,]/g,""); const g = READ_GL[clean];
    q(root,"#rdpop").innerHTML = `<b>${esc(clean)}</b>: ${g ? esc(g) : '<span style="opacity:.7">palavra comum ou nome próprio: tente pelo contexto</span>'}`; say(clean, .8);
    if (g){ seen.add(clean); q(root,"#rdlist").innerHTML = [...seen].map(s=>`<span class="chipf">${esc(s)} = ${esc(READ_GL[s])}</span>`).join(""); }
  });
  q(root,"#rdall").addEventListener("click", () => say(READ_TXT, .9));
  q(root,"#rdstop").addEventListener("click", () => { try{ speechSynthesis.cancel(); }catch(e){} });
  quizEngine(root, [
   {q:"O que Ada Lovelace publicou em 1843?", o:["Anotações sobre a máquina de Babbage","Um computador que ela construiu","Um livro de música"], a:0},
   {q:"A Máquina Analítica chegou a ser construída?", o:["Não","Sim, em 1843","Sim, por Ada"], a:0, w:"“The machine was never built.”"},
   {q:"O que ela imaginou para o futuro dessas máquinas?", o:["Trabalhar também com música e imagens","Substituir os professores","Ficar menores"], a:0}
  ]);
  labOnStop(()=>{ try{ speechSynthesis.cancel(); }catch(e){} });
 }});

const README_BAD = `# Study Tracker

This project have a website for track my studies.
It save the progress in the Google Drive automatically.

## How to use

1. Open the site and make login.
2. Mark the tasks that you already did it.
3. If you have any doubt, open a issue.

## Informations

I am student of computer science since 2025.
Contributions are welcomed!`;
const README_RULES = [
 [/project have/i, "“This project has”: terceira pessoa do singular leva -s."],
 [/for track/i, "Depois de “for”, use o verbo com -ing: “for tracking”, ou “to track”."],
 [/It save/i, "“It saves”: terceira pessoa leva -s."],
 [/in the Google Drive/i, "Nomes de produtos não levam “the”: “in Google Drive”."],
 [/make login/i, "O natural é “log in” ou “sign in”."],
 [/already did it/i, "Sobrou o “it”: “the tasks you have already done”."],
 [/any doubt/i, "“Doubt” é dúvida no sentido de desconfiança. Para perguntas: “any questions”."],
 [/a issue/i, "Antes de som de vogal, use “an”: “an issue”."],
 [/Informations/i, "“Information” não tem plural. Use “About” ou “About me”."],
 [/I am student/i, "Profissões e ocupações levam artigo: “I am a student”."],
 [/student of computer science since 2025/i, "Com since, use present perfect: “I have been studying computer science since 2025”."],
 [/are welcomed/i, "A expressão fixa é “Contributions are welcome!”."]
];
lab({id:"readme", tr:"ingles", area:"sw", title:"Corretor de README em inglês",
 blurb:"Este README tem 12 erros comuns de quem fala português. Corrija direto no texto: o verificador risca cada erro que você consertar e explica o porquê.",
 learn:["Seu README em inglês é a primeira impressão para recrutadores de fora.","Frases curtas e diretas são melhores que frases longas e elaboradas.","Use as IAs para revisar, mas entenda cada correção: é assim que você aprende."],
 html:()=>`<div class="two-even" style="margin-top:0"><textarea id="rmtxt" class="code" spellcheck="false" style="font-family:var(--mono);font-size:13px;min-height:360px"></textarea><div><div class="readout"><div><span class="k">Erros corrigidos</span><b id="rmn"></b></div></div><div class="grid" id="rmlist" style="gap:4px;margin-top:8px"></div><div class="row wrap" style="margin-top:8px"><button class="btn ghost sm" id="rmhint">Mostrar dicas</button><button class="btn ghost sm" id="rmreset">Recomeçar</button></div></div></div>`,
 mount(root){
  let hints = false; const ta = q(root,"#rmtxt"); ta.value = ls.get("pp-readme", README_BAD);
  function draw(){
    const v = ta.value; const res = README_RULES.map(([re,why])=>[!re.test(v), why]); const n = res.filter(r=>r[0]).length;
    q(root,"#rmn").textContent = `${n} de ${README_RULES.length}`;
    q(root,"#rmlist").innerHTML = res.map(([ok,why],i)=>`<div class="small">${ok?"✅":"⬜"} ${ok||hints?esc(why):`Erro ${i+1}`}</div>`).join("") + (n===README_RULES.length?'<div class="oktext">README revisado! 🎉</div>':"");
    ls.set("pp-readme", v);
  }
  ta.addEventListener("input", draw);
  q(root,"#rmhint").addEventListener("click", () => { hints = !hints; draw(); });
  q(root,"#rmreset").addEventListener("click", () => { ta.value = README_BAD; draw(); });
  draw();
 }});

const CERTS = [
 {n:"IELTS Academic", fit:{abroad:3,work:1,cv:2,cheap:0,remote:1}, d:"Muito pedido por universidades fora (Reino Unido, Austrália, Canadá). Tem entrevista oral com uma pessoa. Resultado vale 2 anos."},
 {n:"TOEFL iBT", fit:{abroad:3,work:1,cv:2,cheap:0,remote:2}, d:"Muito aceito por universidades dos EUA e de outros países. Há opção de fazer em casa. Resultado vale 2 anos."},
 {n:"Cambridge (B2 First, C1 Advanced)", fit:{abroad:2,work:2,cv:3,cheap:0,remote:0}, d:"Certificado de um nível específico, sem prazo de validade. Bom para o currículo a longo prazo."},
 {n:"Duolingo English Test", fit:{abroad:2,work:1,cv:1,cheap:3,remote:3}, d:"Feito on-line em casa, curto, mais barato que os outros. Aceito por muitas universidades, mas não por todas. Vale 2 anos."},
 {n:"TOEIC", fit:{abroad:0,work:3,cv:2,cheap:2,remote:1}, d:"Focado em inglês do trabalho. Usado por empresas em processos seletivos."}
];
lab({id:"certs", tr:"ingles", area:"sw", title:"Qual certificação de inglês fazer?",
 blurb:"Diga para que você quer o certificado. O comparador ordena as opções e explica cada uma. Preços e regras mudam: confira sempre no site oficial antes de pagar.",
 learn:["Faça certificação só quando tiver um objetivo: ela custa caro e muitas expiram em 2 anos.","Para vagas de tecnologia, muitas vezes a entrevista em inglês conta mais que o certificado.","Confira a lista de exames aceitos da universidade ou empresa que você quer."],
 html:()=>`<div class="row wrap ctrls">${[["abroad","Estudar fora (mestrado, intercâmbio)"],["work","Processo seletivo de empresa"],["cv","Valorizar o currículo por muito tempo"],["cheap","Gastar pouco"],["remote","Fazer em casa"]].map(([k,l])=>`<label class="f inline small">${l} <input type="range" min="0" max="3" value="${k==="cv"?2:1}" data-cg="${k}"></label>`).join("")}</div><div class="grid" id="cglist" style="gap:8px"></div>`,
 mount(root){
  function draw(){
    const w = Object.fromEntries(qa(root,"[data-cg]").map(i=>[i.dataset.cg, +i.value]));
    const sc = CERTS.map(c=>({c, s:Object.keys(w).reduce((t,k)=>t+w[k]*c.fit[k],0)})).sort((a,b)=>b.s-a.s); const mx = sc[0].s || 1;
    q(root,"#cglist").innerHTML = sc.map(({c,s},i)=>`<div class="infobox"><div class="row" style="justify-content:space-between"><b>${i===0?"🥇 ":""}${c.n}</b><span class="small">${Math.round(s/mx*100)}% de combinação</span></div><div class="qbar"><i style="width:${s/mx*100}%"></i></div><div class="small" style="margin-top:4px">${c.d}</div></div>`).join("");
  }
  root.addEventListener("input", draw); draw();
 }});

// ================= CARREIRA =================
const CAREERS = {fe:"Front-end",be:"Back-end",data:"Dados",ia:"IA e machine learning",ops:"DevOps e nuvem",sec:"Segurança",ux:"UX e design de produto",edu:"Tecnologia educacional",iot:"Hardware e IoT"};
lab({id:"careerquiz", tr:"carreira", area:"sw", title:"Que carreira de tecnologia combina com você?",
 blurb:"Dez perguntas sobre o que você gosta de fazer. O resultado mostra as três áreas que mais combinam e o que estudar em cada uma. Refaça daqui a um ano: o resultado muda conforme você experimenta.",
 learn:["Gosto vem de experiência: experimente um pouco de cada área antes de decidir.","Seu histórico de professor é um diferencial raro em tecnologia educacional e em UX.","Áreas se misturam: muita gente começa em front-end e vai para produto ou dados."],
 html:()=>`<div class="qz" id="qz"></div>`,
 mount(root){
  const items = [
   {q:"O que dá mais satisfação?", o:["Ver uma tela bonita funcionando","Um sistema que aguenta milhares de acessos","Descobrir um padrão escondido nos dados","Um robô se mexendo"], k:[["fe","ux"],["be","ops"],["data","ia"],["iot"]]},
   {q:"Num projeto em grupo, você prefere:", o:["Desenhar como o usuário vai usar","Organizar o servidor e o banco","Testar se dá para invadir","Explicar para todo mundo"], k:[["ux","fe"],["be"],["sec"],["edu"]]},
   {q:"Qual destas matérias você mais curte?", o:["Estatística","Lógica e algoritmos","Física e eletrônica","Psicologia e educação"], k:[["data","ia"],["be","ia"],["iot"],["edu","ux"]]},
   {q:"Um problema chato no trabalho seria:", o:["Ficar sem ver o resultado na tela","Ficar sem lidar com pessoas","Ficar sem mexer em hardware","Ficar sem aprender coisas novas toda semana"], k:[["fe"],["edu","ux"],["iot"],["ia","sec"]]},
   {q:"Qual destes vídeos você assistiria agora?", o:["Como a Netflix aguenta tanto acesso","Como uma IA aprende a jogar","Como hackers invadiram uma empresa","Como fazer uma interface acessível"], k:[["ops","be"],["ia"],["sec"],["ux","fe"]]},
   {q:"Você prefere trabalho:", o:["Criativo e visual","Analítico e com números","Investigativo","Prático, com as mãos"], k:[["fe","ux"],["data"],["sec"],["iot"]]},
   {q:"O que você faria num sábado livre?", o:["Montar um app para a escola","Analisar a planilha de notas da turma","Imprimir uma peça em 3D","Montar um curso on-line"], k:[["fe","be"],["data"],["iot"],["edu"]]},
   {q:"Como você lida com rotina?", o:["Gosto de rotina e estabilidade","Gosto de urgência e resolver incêndios","Gosto de projetos longos de pesquisa","Gosto de variar bastante"], k:[["be","data"],["ops","sec"],["ia"],["fe","edu"]]},
   {q:"Qual ferramenta você teria vontade de dominar?", o:["Figma","Docker e nuvem","PyTorch","Arduino e ESP32"], k:[["ux","fe"],["ops"],["ia"],["iot"]]},
   {q:"Qual frase combina mais com você?", o:["Quero que as pessoas aprendam mais","Quero que o sistema nunca caia","Quero que a decisão seja baseada em dados","Quero proteger as pessoas na internet"], k:[["edu"],["ops","be"],["data","ia"],["sec"]]}
  ];
  quizEngine(root, items, {noShuffle:true, result:(s, ans)=>{
   const sc = {}; Object.keys(CAREERS).forEach(k=>sc[k]=0); ans.forEach((a,i)=>items[i].k[a].forEach(k=>sc[k]++));
   const top = Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,3);
   const STUDY = {fe:"HTML, CSS, JavaScript, React, acessibilidade",be:"Python ou Node, bancos de dados, APIs, autenticação",data:"Python, pandas, SQL, estatística, visualização",ia:"Python, álgebra linear, machine learning, inglês",ops:"Linux, redes, Docker, CI, nuvem",sec:"Redes, Linux, criptografia básica, CTFs",ux:"Pesquisa com usuários, Figma, acessibilidade",edu:"Pedagogia + front-end + IA aplicada",iot:"C/C++, Arduino, ESP32, eletrônica, impressão 3D"};
   ls.set("pp-careerquiz", {at:Date.now(), top});
   return `<p><b>Suas três áreas:</b></p>` + top.map(([k,v],i)=>`<div class="infobox"><b>${i+1}. ${CAREERS[k]}</b> <span class="small muted">(${v} pontos)</span><div class="small">Estude: ${STUDY[k]}</div></div>`).join("") + `<p class="small muted">É um retrato do seu gosto hoje, não um destino.</p>`; }});
 }});

const BOOKS = [["A República (livro VII)","Platão","#7b4b94"],["O Mundo de Sofia","Jostein Gaarder","#2e7d32"],["O Mundo Assombrado pelos Demônios","Carl Sagan","#283593"],["Rápido e Devagar","Daniel Kahneman","#c62828"],["Algoritmos para Viver","Brian Christian e Tom Griffiths","#00838f"],["Código Limpo","Robert C. Martin","#455a64"],["Pedagogia da Autonomia","Paulo Freire","#ef6c00"],["Jardim de Infância para a Vida Toda","Mitchel Resnick","#ad1457"],["Mindset","Carol Dweck","#6d4c41"],["Sapiens","Yuval Noah Harari","#5d4037"]];
lab({id:"cave", tr:"carreira", area:"sw", title:"Mito da Caverna e estante de leitura",
 blurb:"Avance pela alegoria de Platão: das sombras na parede até a luz do sol. Em cada cena, uma pergunta liga a história ao seu aprendizado. Abaixo, uma estante para acompanhar suas leituras.",
 learn:["Na alegoria, quem sai da caverna percebe que as sombras eram só imagens da realidade.","Aprender dói no início, como os olhos se acostumando com a luz.","Quem volta para ensinar os outros é o professor: o papel que você já tem."],
 html:()=>`<canvas id="cvcv" class="cv2"></canvas><div class="infobox" style="margin-top:8px"><b id="cvt"></b><p class="small" id="cvd"></p><p class="small" id="cvq" style="font-style:italic"></p><div class="row wrap"><button class="btn ghost sm" id="cvprev">◀</button><button class="btn sm" id="cvnext">Próxima cena ▶</button></div></div>
 <div class="k" style="margin-top:14px">Sua estante (toque num livro para mudar: quero ler → lendo → lido)</div><div class="shelf" id="cvshelf"></div><div class="small muted" id="cvsum"></div>`,
 mount(root){
  const W = 640, H = 230, c = setupCanvas(q(root,"#cvcv"), W, H);
  const SC = [
   ["As sombras","Prisioneiros acorrentados desde sempre só veem sombras na parede e acham que aquilo é o mundo.","Que “sombras” você tomava como verdade sobre tecnologia antes de estudar?"],
   ["A fogueira","Um prisioneiro é solto e vê a fogueira e os objetos que faziam as sombras. A luz incomoda.","Qual conteúdo te incomodou no começo, mas depois fez sentido?"],
   ["A subida","Ele é levado para fora pela subida íngreme. É difícil e ele quer voltar.","O que te ajuda a continuar quando o estudo fica difícil?"],
   ["O sol","Fora da caverna, aos poucos, vê os reflexos, as coisas e por fim o sol.","Que ideia, quando você entendeu, mudou o jeito de ver outras coisas?"],
   ["A volta","Ele volta para libertar os outros, que riem dele e não acreditam.","Como você leva o que aprende para os seus alunos, mesmo quando eles resistem?"]];
  let s = 0, tt = 0;
  function draw(){
    tt += .05; c.clearRect(0,0,W,H);
    const light = s >= 3;
    c.fillStyle = light ? "#87ceeb" : "#2b2118"; c.fillRect(0,0,W,H);
    if (!light){
      c.fillStyle = "#3d2f22"; c.fillRect(0,0,W,40); c.fillRect(0,H-40,W,40);
      c.fillStyle = "#4a3a2b"; c.fillRect(20,50,170,130);
      const fx = 470, fy = 150; if (s>=1){ const g = c.createRadialGradient(fx,fy,5,fx,fy,180); g.addColorStop(0,"rgba(255,170,60,.55)"); g.addColorStop(1,"rgba(255,170,60,0)"); c.fillStyle = g; c.fillRect(0,0,W,H); }
      c.fillStyle = "#ff9800"; c.beginPath(); c.moveTo(fx-14,fy+20); c.quadraticCurveTo(fx+Math.sin(tt*6)*5,fy-30,fx+14,fy+20); c.fill();
      c.fillStyle = "rgba(0,0,0,.65)"; for (let i=0;i<3;i++){ const x = 40 + ((tt*30 + i*60) % 140); c.beginPath(); c.ellipse(x, 110, 14, 22, 0, 0, 7); c.fill(); }
      for (let i=0;i<4;i++){ const x = 240 + i*42; const free = s>=1 && i===1; const px = free ? x + Math.min(s,2)*60 : x;
        c.fillStyle = free ? "#ffd180" : "#8d6e63"; c.beginPath(); c.arc(px, 140, 9, 0, 7); c.fill(); c.fillRect(px-7,150,14,22);
        if (!free){ c.strokeStyle = "#9e9e9e"; c.lineWidth = 2; c.beginPath(); c.moveTo(px-6,172); c.lineTo(px-6,185); c.stroke(); } }
      if (s===2){ c.strokeStyle = "#ffd180"; c.setLineDash([5,5]); c.beginPath(); c.moveTo(420,170); c.lineTo(620,40); c.stroke(); c.setLineDash([]); }
    } else {
      c.fillStyle = "#ffeb3b"; c.beginPath(); c.arc(560, 50, 28 + Math.sin(tt)*2, 0, 7); c.fill();
      c.fillStyle = "#66bb6a"; c.fillRect(0,170,W,60); c.fillStyle = "#2e7d32"; for (let i=0;i<6;i++){ c.beginPath(); c.arc(60+i*90, 160, 25, 0, 7); c.fill(); }
      c.fillStyle = "#3d2f22"; c.beginPath(); c.arc(80, 230, 70, Math.PI, 0); c.fill();
      const px = s===4 ? 130 - Math.min(40, (tt*20)%60) : 300; c.fillStyle = "#ffd180"; c.beginPath(); c.arc(px, 150, 10, 0, 7); c.fill(); c.fillRect(px-7,160,14,24);
    }
    q(root,"#cvt").textContent = `${s+1}. ${SC[s][0]}`; q(root,"#cvd").textContent = SC[s][1]; q(root,"#cvq").textContent = SC[s][2];
  }
  labEvery(draw, 50);
  q(root,"#cvnext").addEventListener("click", () => { s = (s+1)%SC.length; });
  q(root,"#cvprev").addEventListener("click", () => { s = (s+SC.length-1)%SC.length; });
  let st = ls.get("pp-books", {});
  function shelf(){
    q(root,"#cvshelf").innerHTML = BOOKS.map((b,i)=>`<div class="book ${st[i]||""}" data-bk="${i}" style="background:${b[2]};height:${100+(i*13)%30}px" title="${esc(b[0])} · ${esc(b[1])}">${esc(b[0])}</div>`).join("");
    const r = Object.values(st).filter(v=>v==="read").length, g = Object.values(st).filter(v=>v==="reading").length;
    q(root,"#cvsum").textContent = `${r} lido(s), ${g} lendo. Faixa verde: lido. Amarela: lendo.`;
  }
  root.addEventListener("click", e => { const b = e.target.closest("[data-bk]"); if (!b) return; const i = b.dataset.bk; st[i] = !st[i] ? "reading" : st[i]==="reading" ? "read" : ""; if (!st[i]) delete st[i]; ls.set("pp-books", st); shelf(); toast(BOOKS[i][0] + ": " + (st[i]==="reading"?"lendo":st[i]==="read"?"lido":"quero ler")); });
  shelf();
 }});

const MARKET = [
 ["Startups","Ritmo rápido, você faz de tudo um pouco, aprende muito. Menos estabilidade.",8,3,"Portfólio com projetos reais pesa muito."],
 ["Bancos e fintechs","Grandes times de tecnologia, processos bem definidos, bons programas de estágio.",5,7,"Programas de estágio e trainee com seleção em etapas."],
 ["Consultorias e fábricas de software","Projetos para vários clientes, porta de entrada comum.",6,5,"Vagas de júnior e estágio frequentes."],
 ["Big techs (escritórios no Brasil)","Seleção difícil, entrevistas técnicas de algoritmos em inglês.",6,7,"Algoritmos, inglês e projetos fortes."],
 ["Governo e setor público","Estabilidade alta, entrada por concurso.",2,9,"Concurso público com prova."],
 ["Edtechs","Produtos para educação: seu histórico de professor conta muito.",7,4,"Mostre projetos ligando tecnologia e ensino."],
 ["Indústria e IoT","Automação, sensores, sistemas embarcados.",4,7,"Eletrônica, C/C++, projetos maker."],
 ["Freelance e trabalho remoto para fora","Liberdade e renda em moeda estrangeira, mas exige inglês e disciplina.",9,2,"Inglês fluente e portfólio público."]
];
lab({id:"market", tr:"carreira", area:"sw", title:"Mapa do mercado de tecnologia",
 blurb:"Os tipos de empregador num mapa com dois eixos: ritmo de mudança e estabilidade. Toque em cada um para ver como é e como se entra. É um retrato geral, não regra: cada empresa é diferente.",
 learn:["Não existe o “melhor lugar”: existe o que combina com sua fase de vida.","Pesquise vagas reais no LinkedIn e no Glassdoor para ver o que pedem hoje.","Converse com quem trabalha lá: é a melhor fonte de informação."],
 html:()=>`<canvas id="mkcv" class="cv2"></canvas><div class="infobox small" id="mkinfo" style="margin-top:8px">Toque num ponto do mapa.</div>`,
 mount(root){
  const W = 600, H = 380, c = setupCanvas(q(root,"#mkcv"), W, H), cv = q(root,"#mkcv");
  let sel = -1;
  const pos = m => [60 + m[2]/10*(W-100), H-50 - m[3]/10*(H-90)];
  function draw(){
    c.clearRect(0,0,W,H); c.strokeStyle = cssv("--line"); c.lineWidth = 1; c.beginPath(); c.moveTo(50,20); c.lineTo(50,H-40); c.lineTo(W-20,H-40); c.stroke();
    c.fillStyle = cssv("--muted"); c.font = "12px system-ui"; c.textAlign = "center"; c.fillText("Ritmo de mudança →", W/2, H-12);
    c.save(); c.translate(16, H/2); c.rotate(-Math.PI/2); c.fillText("Estabilidade →", 0, 0); c.restore();
    MARKET.forEach((m,i)=>{ const [x,y] = pos(m); c.fillStyle = i===sel ? cssv("--accent") : cssv("--ink"); c.globalAlpha = i===sel?1:.75; c.beginPath(); c.arc(x,y,i===sel?10:7,0,7); c.fill(); c.globalAlpha = 1; c.font = (i===sel?"700 ":"")+"12px system-ui"; c.textAlign = x > W-140 ? "right" : "left"; c.fillText(m[0], x + (x > W-140 ? -12 : 12), y+4); });
  }
  cv.addEventListener("click", e => { const r = cv.getBoundingClientRect(), x = (e.clientX-r.left)/r.width*W, y = (e.clientY-r.top)/r.height*H;
    let best = -1, bd = 40; MARKET.forEach((m,i)=>{ const [px,py] = pos(m), d = Math.hypot(px-x, py-y); if (d < bd){ bd = d; best = i; } });
    if (best >= 0){ sel = best; const m = MARKET[best]; q(root,"#mkinfo").innerHTML = `<b>${m[0]}</b><p>${m[1]}</p><p><b>Como se entra:</b> ${m[4]}</p>`; draw(); } });
  draw();
 }});

lab({id:"linkedin", tr:"carreira", area:"sw", title:"Montador de perfil do LinkedIn",
 blurb:"Preencha as partes do perfil e veja a prévia montada. O avaliador confere o que recrutadores olham primeiro: título claro, foto, resumo com resultados e projetos com link.",
 learn:["O título (headline) aparece em toda busca: diga o que você é e para onde vai.","No resumo, conte uma história curta: de onde vem, o que faz, o que busca.","Projetos com link (GitHub, site no ar) valem mais que listas de cursos."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px">
 <label class="f">Nome <input id="lnn" value="Márcio Albino"></label>
 <label class="f">Título <input id="lnh" value="Estudante de Ciência da Computação | Professor de Educação Digital | Python e IA na educação"></label>
 <label class="chk inline"><input type="checkbox" id="lnph"> Tenho foto profissional</label>
 <label class="f">Sobre <textarea id="lna" rows="5">Sou professor de Educação Digital e estudo Ciência da Computação. Ensino robótica com micro:bit e Arduino para mais de 200 alunos. Construí um site de estudos que sincroniza com o Google Drive. Busco estágio em desenvolvimento ou tecnologia educacional.</textarea></label>
 <label class="f">Projetos (um por linha: nome | link) <textarea id="lnp" rows="3">Projeto Perfeição | https://marcioalbinods.github.io/projeto-marcio/</textarea></label>
 <label class="f">Habilidades (separe por vírgula) <input id="lns" value="Python, JavaScript, Arduino, micro:bit, Google Workspace, Ensino"></label></div>
 <div><div class="lin"><div class="cover"></div><div class="av" id="lnav"></div><div class="bd"><b id="lpn" style="font-size:20px"></b><div id="lph" class="small"></div><div class="k">Sobre</div><div id="lpa" class="small"></div><div class="k">Projetos</div><div id="lpp" class="small"></div><div class="k">Habilidades</div><div id="lps"></div></div></div>
 <div class="infobox small" id="lnchk" style="margin-top:8px"></div></div></div>`,
 mount(root){
  const v = id => q(root,id).value;
  function draw(){
    const n = v("#lnn"), h = v("#lnh"), a = v("#lna"), p = v("#lnp").split("\n").map(l=>l.split("|").map(x=>x.trim())).filter(x=>x[0]), sk = v("#lns").split(",").map(x=>x.trim()).filter(Boolean);
    q(root,"#lnav").textContent = q(root,"#lnph").checked ? "📷" : n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
    q(root,"#lpn").textContent = n; q(root,"#lph").textContent = h; q(root,"#lpa").textContent = a;
    q(root,"#lpp").innerHTML = p.map(x=>`<div>📁 <b>${esc(x[0])}</b>${x[1]?` · <span class="muted">${esc(x[1])}</span>`:""}</div>`).join("");
    q(root,"#lps").innerHTML = sk.map(s=>`<span class="pill l" style="margin:2px">${esc(s)}</span>`).join("");
    const words = a.split(/\s+/).filter(Boolean).length;
    const chk = [[q(root,"#lnph").checked,"Foto profissional (perfis com foto recebem muito mais visitas)"],[h.length>=30 && /\|/.test(h),"Título com o que você é e o que busca, separado por |"],[h.length<=220,"Título dentro do limite de caracteres"],
      [words>=40,`Resumo com conteúdo (${words} palavras; mire em 40 ou mais)`],[/\d/.test(a),"Resumo com um número concreto (alunos, projetos, resultados)"],[p.some(x=>/^https?:\/\//.test(x[1]||"")),"Pelo menos um projeto com link"],[sk.length>=5,"Cinco ou mais habilidades"]];
    q(root,"#lnchk").innerHTML = `<b>${chk.filter(c=>c[0]).length} de ${chk.length}</b>` + chk.map(([ok,t])=>`<div>${ok?"✅":"⬜"} ${t}</div>`).join("");
  }
  root.addEventListener("input", draw); root.addEventListener("change", draw); draw();
 }});

lab({id:"communities", tr:"carreira", area:"sw", title:"Mapa de comunidades e eventos",
 blurb:"Monte seu calendário de participação em comunidades. Escolha um tipo de comunidade, dê o nome de uma de verdade que você encontrou, e marque quando vai participar. O mapa mostra o equilíbrio entre aprender, mostrar e ajudar.",
 learn:["Comunidades abrem portas que currículo nenhum abre: muitas vagas são indicação.","Comece assistindo, depois ajude (organizar, responder dúvidas) e por fim palestre.","Procure os grupos da sua cidade no Meetup, Sympla, Discord e na sua faculdade."],
 html:()=>`<div class="row wrap ctrls"><select id="cmt">${[["Meetup de Python ou JavaScript","aprender"],["Grupo de desenvolvedores Google (GDG)","aprender"],["Hackathon","mostrar"],["Olimpíada de programação ou maratona","mostrar"],["Comunidade de professores de tecnologia","ajudar"],["Discord ou fórum de estudo","ajudar"],["Evento acadêmico de informática na educação","mostrar"],["Projeto open source","ajudar"]].map(([n,k])=>`<option value="${k}">${n}</option>`).join("")}</select><input id="cmn" placeholder="Nome da comunidade" style="flex:1"><input id="cmd" type="month" value="${new Date().toISOString().slice(0,7)}"><button class="btn sm" id="cmadd">Adicionar</button></div>
 <div class="two-even" style="margin-top:0"><div><div class="k">Próximos 12 meses</div><div class="gantt" id="cmcal"></div></div><div><div class="k">Equilíbrio</div><canvas id="cmcv" class="cv2"></canvas></div></div>`,
 mount(root){
  let L = ls.get("pp-communities", []);
  const c = setupCanvas(q(root,"#cmcv"), 260, 200);
  function draw(){
    const now = new Date(); const months = Array.from({length:12},(_,i)=>{ const d = new Date(now.getFullYear(), now.getMonth()+i, 1); return d.toISOString().slice(0,7); });
    q(root,"#cmcal").innerHTML = months.map(m=>{ const items = L.filter(x=>x.m===m); return `<div class="gr"><span class="small">${new Date(m+"-15").toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}</span><div class="small">${items.map((x,i)=>`<span class="chipf" data-cmx="${L.indexOf(x)}" title="Remover">${x.k==="aprender"?"📘":x.k==="mostrar"?"🎤":"🤝"} ${esc(x.n)} ✕</span>`).join("") || '<span class="muted">–</span>'}</div></div>`; }).join("");
    const cnt = {aprender:0, mostrar:0, ajudar:0}; L.forEach(x=>cnt[x.k]++); const mx = Math.max(1, ...Object.values(cnt));
    c.clearRect(0,0,260,200); const cx = 130, cy = 105, R = 75, keys = Object.keys(cnt);
    c.strokeStyle = cssv("--line"); keys.forEach((k,i)=>{ const a = -Math.PI/2 + i*2*Math.PI/3; c.beginPath(); c.moveTo(cx,cy); c.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R); c.stroke(); c.fillStyle = cssv("--ink"); c.font = "12px system-ui"; c.textAlign = "center"; c.fillText(`${k} (${cnt[k]})`, cx+Math.cos(a)*(R+16), cy+Math.sin(a)*(R+12)+4); });
    c.fillStyle = "rgba(61,107,179,.35)"; c.strokeStyle = "#3d6bb3"; c.beginPath(); keys.forEach((k,i)=>{ const a = -Math.PI/2 + i*2*Math.PI/3, r = 8 + cnt[k]/mx*(R-8); i?c.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r):c.moveTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); }); c.closePath(); c.fill(); c.stroke();
  }
  q(root,"#cmadd").addEventListener("click", () => { const sel = q(root,"#cmt"); const n = q(root,"#cmn").value.trim() || sel.options[sel.selectedIndex].text; L.push({k:sel.value, n, m:q(root,"#cmd").value}); ls.set("pp-communities", L); q(root,"#cmn").value = ""; draw(); });
  root.addEventListener("click", e => { const x = e.target.closest("[data-cmx]"); if (x){ L.splice(+x.dataset.cmx, 1); ls.set("pp-communities", L); draw(); } });
  draw();
 }});

const STAR_Q = ["Conte sobre uma vez em que você resolveu um problema difícil.","Fale de um conflito numa equipe e como você lidou com ele.","Conte sobre um erro que você cometeu e o que aprendeu.","Descreva uma vez em que você teve que aprender algo novo muito rápido.","Conte sobre um projeto do qual você se orgulha."];
lab({id:"star", tr:"carreira", area:"sw", title:"Simulador de entrevista de estágio (método STAR)",
 blurb:"Sorteie uma pergunta comportamental e responda nas quatro partes do método STAR. O cronômetro marca o tempo e o avaliador confere se a resposta tem ação sua, resultado concreto e tamanho bom para falar em até dois minutos.",
 learn:["STAR: Situação, Tarefa, Ação e Resultado.","A maior parte do tempo vai na Ação: o que VOCÊ fez (use “eu”, não só “nós”).","Termine com um resultado concreto, de preferência com número."],
 html:()=>`<div class="infobox"><div class="row wrap" style="justify-content:space-between"><b id="stq" style="font-size:17px"></b><span class="pill" id="sttime">0:00</span></div><div class="row wrap" style="margin-top:6px"><button class="btn ghost sm" id="stnew">Outra pergunta</button><button class="btn ghost sm" id="stgo">Iniciar cronômetro</button></div></div>
 <div class="readout" style="margin-top:8px">${[["S","Situação","Onde e quando? Uma ou duas frases."],["T","Tarefa","Qual era o seu papel ou objetivo?"],["A","Ação","O que você fez, passo a passo?"],["R","Resultado","O que mudou? Tem número?"]].map(([k,n,h])=>`<label class="f">${k}: ${n} <span class="small muted" style="font-weight:400">${h}</span><textarea rows="${k==="A"?5:3}" data-st="${k}"></textarea></label>`).join("")}</div>
 <div class="infobox small" id="stfb" style="margin-top:8px"></div>`,
 mount(root){
  let t0 = 0;
  function pick(){ q(root,"#stq").textContent = STAR_Q[rnd(0,STAR_Q.length-1)]; }
  function fb(){
    const v = k => q(root,`[data-st="${k}"]`).value; const all = ["S","T","A","R"].map(v).join(" "), words = all.split(/\s+/).filter(Boolean).length, w = k => v(k).split(/\s+/).filter(Boolean).length;
    const eu = (v("A").match(/\b(eu|fiz|criei|decidi|conversei|organizei|propus|montei|testei|aprendi)\b/gi)||[]).length, nos = (v("A").match(/\b(nós|fizemos|criamos|decidimos)\b/gi)||[]).length;
    const chk = [[w("S")>0 && w("S")<=60,"Situação curta"],[w("T")>0,"Tarefa clara"],[w("A") >= w("S") + w("T"),"A ação é a parte maior"],[eu >= nos && eu>0,`Ação na primeira pessoa (“eu”: ${eu}, “nós”: ${nos})`],[/\d/.test(v("R")),"Resultado com número"],[words>=80 && words<=280,`Tamanho: ${words} palavras (80 a 280 cabem em cerca de 2 minutos falando)`]];
    q(root,"#stfb").innerHTML = `<b>${chk.filter(c=>c[0]).length} de ${chk.length}</b>` + chk.map(([ok,t])=>`<div>${ok?"✅":"⬜"} ${t}</div>`).join("");
  }
  labEvery(() => { if (!t0) return; const s = Math.floor((Date.now()-t0)/1000); const el = q(root,"#sttime"); el.textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; el.className = "pill" + (s>120?" warn":""); }, 500);
  q(root,"#stgo").addEventListener("click", () => { t0 = Date.now(); });
  q(root,"#stnew").addEventListener("click", () => { pick(); t0 = 0; q(root,"#sttime").textContent = "0:00"; });
  root.addEventListener("input", fb);
  pick(); fb();
 }});

const PORT_CRIT = [["readme","README claro (o que é, como rodar, print)"],["deploy","Está no ar, com link"],["tests","Tem testes"],["commits","Commits frequentes e com mensagens claras"],["real","Resolve um problema real"],["mine","Código que você explica linha por linha"]];
lab({id:"portfolio", tr:"carreira", area:"sw", title:"Checklist do portfólio forte",
 blurb:"Cadastre seus projetos e marque o que cada um já tem. O painel mostra a força de cada projeto e o que falta para o portfólio impressionar: três projetos bons valem mais que vinte tutoriais.",
 learn:["Recrutadores olham poucos minutos: o primeiro projeto fixado no GitHub precisa ser o melhor.","Projeto no ar, com link, vale muito mais que só o código.","Projetos ligados à sua história (escola, educação, maker) contam quem você é."],
 html:()=>`<div class="row wrap ctrls"><input id="pfn" placeholder="Nome do projeto" style="flex:1"><button class="btn sm" id="pfadd">Adicionar projeto</button></div><div class="grid" id="pflist" style="gap:8px"></div><div class="infobox small" id="pfsum" style="margin-top:8px"></div>`,
 mount(root){
  let P = ls.get("pp-portfolio", [{n:"Projeto Perfeição (este site)", c:{readme:true,deploy:true,real:true}}]);
  const save = () => ls.set("pp-portfolio", P);
  function draw(){
    q(root,"#pflist").innerHTML = P.map((p,i)=>{ const n = PORT_CRIT.filter(c=>p.c[c[0]]).length; return `<div class="infobox"><div class="row" style="justify-content:space-between"><b>${esc(p.n)}</b><span><span class="pill ${n>=5?"ok":n>=3?"":"warn"}">${n}/${PORT_CRIT.length}</span> <button class="btn ghost sm" data-pfx="${i}">✕</button></span></div><div class="qbar" style="margin:6px 0"><i style="width:${n/PORT_CRIT.length*100}%"></i></div>${PORT_CRIT.map(([k,l])=>`<label class="chk inline small"><input type="checkbox" data-pfc="${i}|${k}" ${p.c[k]?"checked":""}> ${l}</label>`).join("")}</div>`; }).join("");
    const strong = P.filter(p=>PORT_CRIT.filter(c=>p.c[c[0]]).length>=5).length;
    const missing = PORT_CRIT.map(([k,l])=>[l, P.filter(p=>!p.c[k]).length]).sort((a,b)=>b[1]-a[1])[0];
    q(root,"#pfsum").innerHTML = `<b>${strong} de 3 projetos fortes</b> (5 ou mais itens). ${strong>=3?"Portfólio pronto para mandar em vagas.":""}${missing&&missing[1]?`<br>O que mais falta: <b>${missing[0]}</b> (em ${missing[1]} projeto(s)).`:""}`;
  }
  q(root,"#pfadd").addEventListener("click", () => { const n = q(root,"#pfn").value.trim(); if (!n) return; P.push({n, c:{}}); q(root,"#pfn").value = ""; save(); draw(); });
  root.addEventListener("change", e => { const d = e.target.dataset.pfc; if (d){ const [i,k] = d.split("|"); P[+i].c[k] = e.target.checked; save(); draw(); } });
  root.addEventListener("click", e => { const x = e.target.closest("[data-pfx]"); if (x){ P.splice(+x.dataset.pfx,1); save(); draw(); } });
  draw();
 }});

const TCC_STEPS = [["Escolher o tema e o orientador",2],["Pergunta de pesquisa e objetivos",1],["Revisão de literatura",3],["Proposta / pré-projeto aprovado",1],["Desenvolvimento (protótipo ou experimento)",5],["Coleta e análise dos resultados",2],["Escrita final",3],["Revisão do orientador e ajustes",1],["Preparar a apresentação",1]];
lab({id:"tcc", tr:"carreira", area:"sw", title:"Planejador de TCC",
 blurb:"Diga a data da sua defesa e o planejador calcula, de trás para frente, quando começar cada etapa. Ajuste a duração de cada uma e marque o que já fez.",
 learn:["Comece o TCC pelo menos um ano antes da defesa.","Um bom tema junta o que você gosta com algo que dá para fazer no tempo: IA na educação ou robótica na escola, por exemplo.","Escreva um pouco toda semana: deixar a escrita para o fim é o erro mais comum."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline">Data da defesa <input type="date" id="tcd" value="2030-06-15"></label><label class="f inline">Tema <input id="tct" value="IA generativa no ensino de computação na educação básica" style="min-width:280px"></label></div>
 <div class="gantt" id="tcg"></div><div class="infobox small" id="tcinfo" style="margin-top:8px"></div>`,
 mount(root){
  let S = ls.get("pp-tcc", TCC_STEPS.map(([n,m])=>({n,m,d:false})));
  const save = () => ls.set("pp-tcc", S);
  function draw(){
    const end = new Date(q(root,"#tcd").value + "T12:00"); if (isNaN(end)) return;
    const total = S.reduce((t,s)=>t+s.m,0); const start = new Date(end); start.setMonth(start.getMonth()-total);
    const today = new Date(), span = end - start;
    let acc = 0;
    q(root,"#tcg").innerHTML = S.map((s,i)=>{ const a = new Date(start); a.setMonth(a.getMonth()+acc); const b = new Date(start); b.setMonth(b.getMonth()+acc+s.m); acc += s.m;
      const l = (a-start)/span*100, w = (b-a)/span*100;
      return `<div class="gr"><label class="chk inline small"><input type="checkbox" data-tcd="${i}" ${s.d?"checked":""}> ${esc(s.n)}</label><div class="gb"><i class="${s.d?"done":""}" style="left:${l}%;width:${w}%"></i>${today>=start&&today<=end?`<span style="position:absolute;left:${(today-start)/span*100}%;top:-2px;bottom:-2px;width:2px;background:#e33"></span>`:""}</div></div>
      <div class="gr"><span class="small muted">${a.toLocaleDateString("pt-BR",{month:"short",year:"numeric"})} → ${b.toLocaleDateString("pt-BR",{month:"short",year:"numeric"})}</span><label class="small">Meses <input type="number" min="1" max="12" value="${s.m}" data-tcm="${i}" style="width:52px"></label></div>`; }).join("");
    const late = today > start && !S[0].d;
    q(root,"#tcinfo").innerHTML = `Começar até <b>${start.toLocaleDateString("pt-BR",{month:"long",year:"numeric"})}</b> (${total} meses no total). Tema: ${esc(q(root,"#tct").value)}.${late?' <span class="warntext">A data de início já passou: aperte alguma etapa ou comece agora.</span>':""}`;
  }
  root.addEventListener("change", e => { const d = e.target.dataset.tcd, m = e.target.dataset.tcm; if (d!==undefined){ S[+d].d = e.target.checked; save(); } if (m!==undefined){ S[+m].m = Math.max(1, +e.target.value||1); save(); } draw(); });
  root.addEventListener("input", e => { if (e.target.id === "tct") draw(); });
  draw();
 }});

const TI_PROBS = [
 {t:"Dois números que somam o alvo", d:"Escreva <code>dois_somam(nums, alvo)</code> que devolve os índices (i, j), com i &lt; j, de dois números da lista que somam o alvo. Tente fazer em uma única passada pela lista.",
  start:"def dois_somam(nums, alvo):\n    # sua solução aqui\n    pass\n",
  tests:[["dois_somam([2, 7, 11, 15], 9)","(0, 1)"],["dois_somam([3, 2, 4], 6)","(1, 2)"],["dois_somam([1, 5, 3, 8], 11)","(2, 3)"]], hint:"Use um dicionário guardando o índice de cada número já visto. Para cada x, procure alvo - x."},
 {t:"Palíndromo", d:"Escreva <code>eh_palindromo(texto)</code> que devolve True se o texto é igual lido de trás para frente, ignorando espaços e maiúsculas.",
  start:"def eh_palindromo(texto):\n    pass\n",
  tests:[["eh_palindromo('Ame a ema')","True"],["eh_palindromo('python')","False"],["eh_palindromo('A sacada da casa')","True"]], hint:"Tire os espaços com replace e use lower(). Depois compare com o texto invertido: s[::-1]."},
 {t:"Contar palavras", d:"Escreva <code>mais_frequente(frase)</code> que devolve a palavra que mais aparece (em minúsculas). Em caso de empate, a que aparece primeiro.",
  start:"def mais_frequente(frase):\n    pass\n",
  tests:[["mais_frequente('o gato e o rato')","'o'"],["mais_frequente('Bit byte bit BYTE bit')","'bit'"],["mais_frequente('um dois tres')","'um'"]], hint:"Conte com um dicionário. Percorra as palavras na ordem e guarde a de maior contagem."}
];
lab({id:"techint", tr:"carreira", area:"sw", title:"Simulador de entrevista técnica",
 blurb:"Um problema típico de entrevista, com cronômetro de 20 minutos e Python de verdade rodando no navegador. Antes de codar, explique sua ideia em voz alta (ou por escrito): entrevistadores avaliam o raciocínio tanto quanto o código.",
 learn:["Repita o problema com suas palavras e pergunte sobre casos especiais antes de codar.","Comece com uma solução simples que funciona; depois melhore.","Diga a complexidade: “essa solução passa uma vez pela lista, então é O(n)”."],
 html:()=>`<div class="row wrap ctrls">${TI_PROBS.map((p,i)=>`<button class="btn ghost sm" data-tip="${i}">${p.t}</button>`).join("")}<span class="pill" id="titime">20:00</span></div>
 <div class="infobox"><b id="tit"></b><p class="small" id="tid"></p><label class="f small">Sua ideia, antes de codar <textarea id="tiplan" rows="2" placeholder="Ex.: vou percorrer a lista guardando..."></textarea></label></div>
 <textarea id="ticode" class="code" spellcheck="false" style="font-family:var(--mono);font-size:13px;min-height:200px;width:100%;margin-top:8px"></textarea>
 <div class="row wrap ctrls"><button class="btn sm" id="tirun">▶ Rodar testes</button><button class="btn ghost sm" id="tihint">Pedir dica</button><span class="small muted" id="tistat"></span></div>
 <div class="console small" id="tiout"></div>`,
 mount(root){
  let cur = 0, t0 = 0;
  function load(i){ cur = i; const p = TI_PROBS[i]; q(root,"#tit").textContent = p.t; q(root,"#tid").innerHTML = p.d; q(root,"#ticode").value = ls.get("pp-ti-"+i, p.start); q(root,"#tiout").textContent = ""; t0 = Date.now(); qa(root,"[data-tip]").forEach(b=>b.classList.toggle("ghost", +b.dataset.tip !== i)); }
  labEvery(() => { if (!t0) return; const left = Math.max(0, 1200 - Math.floor((Date.now()-t0)/1000)); const el = q(root,"#titime"); el.textContent = `${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`; el.className = "pill" + (left<300?" warn":""); }, 500);
  root.addEventListener("click", e => { const b = e.target.closest("[data-tip]"); if (b) load(+b.dataset.tip); });
  q(root,"#ticode").addEventListener("input", e => ls.set("pp-ti-"+cur, e.target.value));
  q(root,"#tihint").addEventListener("click", () => { q(root,"#tiout").innerHTML = `💡 ${esc(TI_PROBS[cur].hint)}`; });
  q(root,"#tirun").addEventListener("click", async () => {
    const out = q(root,"#tiout");
    if (!q(root,"#tiplan").value.trim()) { out.innerHTML = '<span class="warntext">Primeiro escreva sua ideia em uma ou duas frases. Numa entrevista real, você explicaria antes de codar.</span>'; return; }
    if (!window.ppRunPy){ out.innerHTML = '<span class="warntext">O Python do navegador não carregou. Recarregue a página com internet.</span>'; return; }
    q(root,"#tistat").textContent = "Carregando o Python (a primeira vez demora uns segundos)...";
    const p = TI_PROBS[cur];
    const harness = q(root,"#ticode").value + "\n\n" + p.tests.map(([call,exp],i)=>`try:\n    __r = ${call}\n    print("T${i}|" + ("ok" if __r == ${exp} else "falhou") + "|" + repr(__r))\nexcept Exception as __e:\n    print("T${i}|erro|" + type(__e).__name__ + ": " + str(__e))`).join("\n");
    const r = await window.ppRunPy(harness, "");
    q(root,"#tistat").textContent = "";
    if (!r.ok && !/T0\|/.test(r.out)){ out.innerHTML = `<span class="warntext">${esc(r.err||"Erro")}</span>`; return; }
    const lines = r.out.split("\n").filter(l=>/^T\d\|/.test(l)); let pass = 0;
    out.innerHTML = p.tests.map(([call,exp],i)=>{ const l = lines.find(x=>x.startsWith(`T${i}|`)); const [,st,val] = l ? l.split("|") : [,"erro","não rodou"]; if (st==="ok") pass++;
      return `<div>${st==="ok"?"✅":"❌"} <code>${esc(call)}</code> → ${esc(val)}${st!=="ok"?` (esperado ${esc(exp)})`:""}</div>`; }).join("") + `<div style="margin-top:6px"><b>${pass}/${p.tests.length}</b> testes passaram${pass===p.tests.length?` em ${Math.round((Date.now()-t0)/60000)} min. Agora diga em voz alta a complexidade da sua solução.`:"."}</div>`;
  });
  load(0);
 }});

})();
