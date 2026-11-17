(function(){
const q = (r,s) => r.querySelector(s), qa = (r,s) => [...r.querySelectorAll(s)];
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
const sleep = ms => wait(ms);
function setupCanvas(cv, w, h){ const d = window.devicePixelRatio || 1; cv.width = w*d; cv.height = h*d; cv.style.width = "100%"; cv.style.maxWidth = w+"px"; cv.style.aspectRatio = w+"/"+h; const c = cv.getContext("2d"); c.setTransform(d,0,0,d,0,0); return c; }
function logTo(el, msg, cls){ const p = document.createElement("div"); if (cls) p.className = cls; p.textContent = msg; el.appendChild(p); el.scrollTop = el.scrollHeight; }

const MAP = {d1:"vscode", d4:"markdown", d5:"docker", d6:"ci", e5:"a11y", e6:"ts", e7:"react", e8:"deploy", f6:"auth", f7:"baas", f8:"cloud", f9:"arch", h3:"pwa", i8:"agent"};
Object.entries(MAP).forEach(([k,v]) => { STEP_LABS[k] = (STEP_LABS[k]||[]).concat(v); delete PLANNED[k]; });
["e1","e2"].forEach(k => { STEP_LABS[k] = (STEP_LABS[k]||[]).concat("a11y"); });

const st = document.createElement("style");
st.textContent = `
.vsc{display:grid;grid-template-columns:48px 190px 1fr;grid-template-rows:1fr 120px 24px;height:380px;border-radius:12px;overflow:hidden;background:#1e1e1e;color:#ccc;font:13px var(--mono);border:1px solid #333}
.vsc>*{cursor:pointer;position:relative}.vsc .ab{grid-row:1/3;background:#2c2c2c;display:grid;align-content:start;gap:14px;padding:12px 0;justify-items:center;font-size:18px}
.vsc .ex{background:#252526;padding:8px}.vsc .ed{background:#1e1e1e;padding:10px;white-space:pre;overflow:auto;color:#d4d4d4}.vsc .tm{grid-column:2/4;background:#181818;border-top:1px solid #333;padding:8px;color:#9cdcfe}.vsc .sb{grid-column:1/4;background:#007acc;color:#fff;padding:3px 10px;font-size:12px}
.vsc .hl{outline:3px solid #f5d547;outline-offset:-3px}
.keys{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.key{min-width:44px;padding:8px 10px;border-radius:8px;border:1px solid var(--line);border-bottom-width:4px;background:var(--surface);font:700 16px var(--mono);text-align:center}
.mdprev{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px;min-height:300px;overflow:auto}.mdprev h1,.mdprev h2,.mdprev h3{margin:.4em 0}.mdprev pre{background:#0f1520;color:#d8e1f0;padding:10px;border-radius:8px;overflow:auto}.mdprev code{font-family:var(--mono);background:var(--accent-soft);padding:0 4px;border-radius:4px}.mdprev pre code{background:none}.mdprev blockquote{border-left:4px solid var(--line);margin:0;padding-left:12px;color:var(--muted)}.mdprev table{width:auto}
.machines{display:grid;grid-template-columns:1fr 1fr;gap:12px}.machine{border:2px solid var(--line);border-radius:12px;padding:12px;background:var(--paper);display:grid;gap:8px;align-content:start;min-height:170px}.machine .os{font:12px var(--mono);color:var(--muted)}
.cont{border:2px dashed var(--accent);border-radius:10px;padding:8px;background:var(--surface);font:13px var(--mono)}.cont.ok{border-style:solid;border-color:var(--ok)}
.layers{display:grid;gap:4px}.layer{font:12px var(--mono);padding:6px 10px;border-radius:6px;background:var(--accent-soft);color:var(--accent);opacity:.25;transition:opacity .3s}.layer.on{opacity:1}
.pipe{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.stage{border:2px solid var(--line);border-radius:10px;padding:8px 12px;font-size:14px;background:var(--surface);min-width:110px;text-align:center}.stage.run{border-color:var(--warn);animation:pulse 1s infinite}.stage.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--surface))}.stage.fail{border-color:#c0392b;background:color-mix(in srgb,#c0392b 12%,var(--surface))}.pipe .arrow{color:var(--muted)}
@keyframes pulse{50%{box-shadow:0 0 0 4px color-mix(in srgb,var(--warn) 30%,transparent)}}
.swatch{border-radius:10px;padding:16px;border:1px solid var(--line)}.badge{display:inline-block;padding:2px 8px;border-radius:6px;font:700 12px var(--mono);margin-right:4px}.badge.y{background:var(--ok);color:#fff}.badge.n{background:#c0392b;color:#fff}
.mock{border:1px solid var(--line);border-radius:10px;padding:12px;background:#fff;color:#111}
.tsbox{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:760px){.tsbox{grid-template-columns:1fr}}.tserr{color:#ff7b72}.tsok{color:#7ee787}
.rtree{display:grid;gap:6px;font:13px var(--mono)}.rnode{border:2px solid var(--line);border-radius:8px;padding:6px 10px;background:var(--surface);transition:background .2s}.rnode.flash{background:var(--mark)}.rapp{border:1px solid var(--line);border-radius:12px;padding:14px;background:var(--surface);display:grid;gap:10px}
.site{border:1px solid var(--line);border-radius:10px;overflow:hidden}.site .bar2{background:var(--paper);padding:6px 10px;font:12px var(--mono);border-bottom:1px solid var(--line)}.site .body{padding:16px;min-height:90px}
.tok{font:12px var(--mono);word-break:break-all;background:#0f1520;color:#d8e1f0;padding:10px;border-radius:8px}.tok .h{color:#ff7b72}.tok .p{color:#d2a8ff}.tok .s{color:#7ee787}
.srvs{display:flex;gap:6px;flex-wrap:wrap}.srv{width:46px;height:56px;border-radius:6px;background:#1f2937;display:grid;place-items:center;color:#fff;font:700 11px var(--mono);position:relative;overflow:hidden}.srv i{position:absolute;bottom:0;left:0;right:0;background:var(--ok);opacity:.7}
.q2{display:flex;gap:3px;flex-wrap:wrap;min-height:30px;padding:6px;border:1px solid var(--line);border-radius:8px;background:var(--paper)}.q2 span{width:14px;height:20px;border-radius:3px;background:var(--accent)}
.phone{width:240px;height:420px;border:10px solid #111;border-radius:30px;background:#fff;color:#111;margin:auto;display:grid;grid-template-rows:auto 1fr;overflow:hidden}.phone .stat{background:#f2f2f2;font:11px var(--mono);padding:4px 10px;display:flex;justify-content:space-between}.phone .scr{padding:12px;display:grid;gap:8px;align-content:start;overflow:auto;font-size:14px}
.agentlog{display:grid;gap:8px}.amsg{border-radius:10px;padding:10px 12px;font-size:14px;border:1px solid var(--line);background:var(--surface)}.amsg.think{background:var(--accent-soft)}.amsg.tool{font-family:var(--mono);font-size:13px;background:#0f1520;color:#d8e1f0}.amsg.obs{background:color-mix(in srgb,var(--ok) 10%,var(--surface))}.amsg.final{border:2px solid var(--ok)}.amsg.ask{border:2px solid var(--warn)}
`;
document.head.appendChild(st);

lab({id:"vscode", tr:"devkit", area:"sw", title:"VS Code: partes e atalhos",
 blurb:"Conheça cada área do editor mais usado do mundo e treine os atalhos que mais economizam tempo, com as teclas do seu Mac.",
 learn:["Atalhos economizam horas por semana: mãos no teclado, cabeça no código.","A Paleta de Comandos (Cmd+Shift+P) acessa qualquer função do VS Code.","O terminal integrado evita ficar trocando de janela."],
 html:()=>`<div class="vsc" id="vsc"><div class="ab" data-a="ab"><span>📄</span><span>🔍</span><span>⑂</span><span>▶</span><span>⧉</span></div>
 <div class="ex" data-a="ex"><div style="color:#bbb;font-size:11px">EXPLORADOR</div><div>▾ projeto-marcio</div><div>&nbsp;&nbsp;index.html</div><div>&nbsp;&nbsp;app.js</div><div>&nbsp;&nbsp;ola.py</div></div>
 <div class="ed" data-a="ed"><span style="color:#569cd6">def</span> <span style="color:#dcdcaa">saudacao</span>(nome):
    <span style="color:#c586c0">return</span> <span style="color:#ce9178">f"Olá, {nome}!"</span>

<span style="color:#dcdcaa">print</span>(saudacao(<span style="color:#ce9178">"turma"</span>))</div>
 <div class="tm" data-a="tm">$ python3 ola.py<br>Olá, turma!<br>$ <span style="animation:blink 1s steps(1) infinite">▍</span></div>
 <div class="sb" data-a="sb">⑂ main · Python 3.12 · Ln 4, Col 22 · UTF-8</div></div>
 <div class="infobox" id="vinfo"><b>Clique em qualquer área do editor</b> para saber para que ela serve.</div>
 <div class="card" style="box-shadow:none"><div class="row wrap"><b>Treino de atalhos</b><span class="pill" id="vsc2"></span><span class="small muted">Clique aqui dentro e pressione as teclas no teclado do Mac.</span></div>
 <p id="vtask" style="font-size:20px;margin:10px 0"></p><div class="keys" id="vkeys"></div><div class="row wrap" style="margin-top:10px"><button class="btn ghost sm" id="vshow">Mostrar teclas</button><button class="btn ghost sm" id="vskip">Pular</button><input id="vcatch" aria-label="Área para pressionar o atalho" placeholder="Clique aqui e pressione o atalho" style="flex:1;min-width:220px"></div><div class="note" id="vres" style="margin-top:10px">Atalhos do Mac: ⌘ é Command, ⌥ é Option, ⇧ é Shift.</div></div>`,
 mount(root){
  const INFO={ab:["Barra de atividades","Alterna entre Explorador de arquivos, Busca, Controle de versão (Git), Depuração e Extensões."],ex:["Explorador","Mostra as pastas e arquivos do projeto aberto. Abra a pasta inteira do projeto, não arquivos soltos."],ed:["Editor","Onde você escreve o código, com cores (destaque de sintaxe), sugestões e avisos de erro sublinhados."],tm:["Terminal integrado","O mesmo terminal do Mac, dentro do editor. Abra com Ctrl + ` (crase)."],sb:["Barra de status","Mostra o ramo do Git, a versão do Python escolhida, a linha e a coluna do cursor."]};
  const SC=[["Abrir a Paleta de Comandos",{meta:1,shift:1,key:"p"},["⌘","⇧","P"]],["Abrir arquivo rapidamente pelo nome",{meta:1,key:"p"},["⌘","P"]],["Salvar o arquivo",{meta:1,key:"s"},["⌘","S"]],["Comentar ou descomentar a linha",{meta:1,key:"/"},["⌘","/"]],["Procurar no arquivo",{meta:1,key:"f"},["⌘","F"]],["Duplicar a linha para baixo",{alt:1,shift:1,key:"arrowdown"},["⌥","⇧","↓"]],["Mover a linha para cima",{alt:1,key:"arrowup"},["⌥","↑"]],["Selecionar a próxima ocorrência da palavra",{meta:1,key:"d"},["⌘","D"]],["Abrir ou fechar o terminal",{ctrl:1,key:"`"},["⌃","`"]],["Desfazer",{meta:1,key:"z"},["⌘","Z"]]];
  let i=0, hits=0, shown=false;
  function task(){ const s=SC[i]; q(root,"#vtask").textContent=s[0]; q(root,"#vkeys").innerHTML=shown?s[2].map(k=>`<span class="key">${k}</span>`).join(""):s[2].map(()=>`<span class="key">?</span>`).join(""); q(root,"#vsc2").textContent=`${hits} acertos · ${i+1}/${SC.length}`; }
  root.addEventListener("click", e=>{ const a=e.target.closest("[data-a]"); if(a){ qa(root,"[data-a]").forEach(x=>x.classList.toggle("hl",x===a)); const [t,d]=INFO[a.dataset.a]; q(root,"#vinfo").innerHTML=`<b>${t}</b><p>${d}</p>`; }
    if(e.target.id==="vshow"){ shown=true; task(); } if(e.target.id==="vskip"){ i=(i+1)%SC.length; shown=false; task(); } });
  q(root,"#vcatch").addEventListener("keydown", e=>{
    if(["Meta","Shift","Alt","Control"].includes(e.key)) return; e.preventDefault();
    const s=SC[i][1], k=(e.code==="Backquote"?"`":e.key.toLowerCase());
    const ok=k===s.key && !!e.metaKey===!!s.meta && !!e.shiftKey===!!s.shift && !!e.altKey===!!s.alt && !!e.ctrlKey===!!s.ctrl;
    if(ok){ hits++; q(root,"#vres").innerHTML=`<b class="oktext">Isso!</b> ${SC[i][2].join(" + ")} = ${esc(SC[i][0])}.`; i=(i+1)%SC.length; shown=false; task(); }
    else q(root,"#vres").innerHTML=`Ainda não. Você apertou ${[e.metaKey?"⌘":"",e.ctrlKey?"⌃":"",e.altKey?"⌥":"",e.shiftKey?"⇧":"",esc(e.key)].filter(Boolean).join(" + ")}. Tente de novo ou clique em Mostrar teclas.`;
  });
  task();
 }});

function md(src){
  const e = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const inline = s => e(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(new RegExp("\\*\\*([^*]+)\\*\\*","g"),"<b>$1</b>").replace(new RegExp("\\*([^*]+)\\*","g"),"<i>$1</i>").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  const L = src.replace(/\r/g,"").split("\n"); let out = "", i = 0;
  while (i < L.length){
    const l = L[i];
    if (l.startsWith("```")){ let b=[]; i++; while(i<L.length && !L[i].startsWith("```")){ b.push(L[i]); i++; } i++; out += `<pre><code>${e(b.join("\n"))}</code></pre>`; continue; }
    const h = l.match(/^(#{1,3})\s+(.*)/); if (h){ out += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`; i++; continue; }
    if (l.startsWith(">")){ out += `<blockquote>${inline(l.replace(/^>\s?/,""))}</blockquote>`; i++; continue; }
    if (/^\|/.test(l)){ const rows=[]; while(i<L.length && /^\|/.test(L[i])){ rows.push(L[i]); i++; } const cells=r=>r.replace(/^\||\|$/g,"").split("|").map(c=>c.trim()); const body=rows.filter((r,k)=>k!==1); out += `<table><thead><tr>${cells(body[0]).map(c=>`<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.slice(1).map(r=>`<tr>${cells(r).map(c=>`<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`; continue; }
    if (/^\s*[-*]\s+/.test(l)){ let items=[]; while(i<L.length && /^\s*[-*]\s+/.test(L[i])){ const t=L[i].replace(/^\s*[-*]\s+/,""); const c=t.match(/^\[( |x)\]\s+(.*)/i); items.push(c?`<li style="list-style:none"><input type="checkbox" disabled ${c[1].toLowerCase()==="x"?"checked":""}> ${inline(c[2])}</li>`:`<li>${inline(t)}</li>`); i++; } out += `<ul>${items.join("")}</ul>`; continue; }
    if (/^\d+\.\s+/.test(l)){ let items=[]; while(i<L.length && /^\d+\.\s+/.test(L[i])){ items.push(`<li>${inline(L[i].replace(/^\d+\.\s+/,""))}</li>`); i++; } out += `<ol>${items.join("")}</ol>`; continue; }
    if (/^---+$/.test(l)){ out += "<hr>"; i++; continue; }
    if (l.trim()===""){ i++; continue; }
    let p=[]; while(i<L.length && L[i].trim()!=="" && !/^(#|```|>|\||\s*[-*]\s|\d+\.\s)/.test(L[i])){ p.push(L[i]); i++; } out += `<p>${inline(p.join(" "))}</p>`;
  }
  return out;
}
const MD_README = "# Projeto Perfeição\n\nMinha trilha de estudos e carreira até **2030**.\n\n## O que tem aqui\n\n- Trilhas com cursos, livros e canais\n- Laboratório com simulações\n- Portfólio de *evidências*\n\n## Como rodar\n\n```bash\ngit clone https://github.com/marcioalbinods/projeto-marcio\ncd projeto-marcio\nopen index.html\n```\n\n## Progresso\n\n| Fase | Período | Status |\n|---|---|---|\n| Fase 0 | nov/2026 – fev/2027 | Em andamento |\n| Fase 1 | mar – jul/2027 | Planejada |\n\n## Próximos passos\n\n- [x] Publicar no GitHub Pages\n- [ ] Terminar o CS50\n\n> Um passo de cada vez.\n\nFeito por [Marcio](https://github.com/marcioalbinods).";
lab({id:"markdown", tr:"devkit", area:"sw", title:"Markdown ao vivo",
 blurb:"Escreva Markdown à esquerda e veja o resultado à direita, como no README do GitHub. Comece pelo modelo do seu próprio projeto.",
 learn:["Markdown formata texto com símbolos simples: # título, **negrito**, - lista.","Todo repositório no GitHub mostra o README.md na página inicial.","As mesmas regras valem no Obsidian, no Notion e em muitos outros apps."],
 html:()=>`<div class="row wrap ctrls"><span class="small muted">Inserir:</span>${[["# ","Título"],["**negrito**","Negrito"],["*itálico*","Itálico"],["- item","Lista"],["- [ ] tarefa","Tarefa"],["`código`","Código"],["[texto](https://)","Link"],["> citação","Citação"]].map(([s,l])=>`<button class="btn ghost sm" data-ins="${esc(s)}">${l}</button>`).join("")}<button class="btn ghost sm" id="mdcopy">Copiar Markdown</button></div>
 <div class="two-even" style="margin-top:0"><textarea id="mdin" class="code" spellcheck="false" style="font-family:var(--mono);font-size:13px;min-height:360px">${esc(MD_README)}</textarea><div class="mdprev" id="mdout"></div></div>`,
 mount(root){
  const inp=q(root,"#mdin"), draw=()=>{ q(root,"#mdout").innerHTML=md(inp.value); };
  root.addEventListener("input", draw);
  root.addEventListener("click", async e=>{ const b=e.target.closest("[data-ins]"); if(b){ inp.setRangeText((inp.selectionStart>0&&inp.value[inp.selectionStart-1]!=="\n"&&/^[#>-]/.test(b.dataset.ins)?"\n":"")+b.dataset.ins, inp.selectionStart, inp.selectionEnd, "end"); inp.focus(); draw(); }
    if(e.target.id==="mdcopy"){ try{ await navigator.clipboard.writeText(inp.value); toast("Copiado"); }catch(err){ inp.select(); toast("Selecionei o texto: copie com Cmd+C"); } } });
  draw();
 }});

lab({id:"docker", tr:"devkit", area:"sw", title:"Docker: “funciona na minha máquina”",
 blurb:"Rode o mesmo app em dois computadores diferentes. Sem Docker, um deles falha. Com uma imagem Docker, os dois funcionam igual.",
 learn:["Uma imagem leva junto o app, a versão certa do Python e as bibliotecas.","Um contêiner é a imagem rodando, isolada do resto do sistema.","Por isso o app roda igual no seu Mac, no servidor e no computador do colega."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="k">Dockerfile</div><pre class="console small">FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]</pre></div><div><div class="k">Camadas da imagem</div><div class="layers" id="dlay">${["python:3.12-slim (sistema + Python)","WORKDIR /app","requirements.txt","pip install flask pandas","seu código (app.py)","CMD python app.py"].map((l,i)=>`<div class="layer" data-l="${i}">${i+1}. ${l}</div>`).join("")}</div></div></div>
 <div class="row wrap"><button class="btn ghost" id="dnaive">Rodar sem Docker</button><button class="btn" id="dbuild">docker build</button><button class="btn" id="drun" disabled>docker run (nas duas máquinas)</button><button class="btn ghost sm" id="dreset">Recomeçar</button></div>
 <div class="machines"><div class="machine" id="m1"><b>Seu MacBook</b><span class="os">macOS · Python 3.12 · pandas 2.2</span><div class="mslot"></div></div><div class="machine" id="m2"><b>Servidor da escola</b><span class="os">Linux · Python 3.8 · sem pandas</span><div class="mslot"></div></div></div>
 <pre class="console small" id="dlog" style="min-height:100px"></pre>`,
 mount(root){
  let built=false, busy=false; const log=s=>{ q(root,"#dlog").textContent+=s+"\n"; q(root,"#dlog").scrollTop=1e9; };
  const slot=(m,h)=>{ q(root,`#${m} .mslot`).innerHTML=h; };
  root.addEventListener("click", async e=>{
    if(busy) return; const id=e.target.id;
    if(id==="dreset"){ built=false; qa(root,".layer").forEach(l=>l.classList.remove("on")); q(root,"#drun").disabled=true; slot("m1",""); slot("m2",""); q(root,"#dlog").textContent=""; }
    if(id==="dnaive"){ busy=true; log("$ python app.py   # no MacBook"); slot("m1",'<div class="cont ok">✓ app rodando em localhost:5000</div>'); await sleep(700);
      log("$ python app.py   # no servidor"); await sleep(500); log("Traceback: ModuleNotFoundError: No module named 'pandas'"); log("SyntaxError: match/case precisa do Python 3.10 ou mais novo");
      slot("m2",'<div class="cont" style="border-color:#c0392b;color:#c0392b">✗ erro: versão do Python diferente e pandas não instalado</div>'); log("→ “Mas na minha máquina funciona!”"); busy=false; }
    if(id==="dbuild"){ busy=true; log("$ docker build -t projeto-marcio ."); for(let i=0;i<6;i++){ q(root,`[data-l="${i}"]`).classList.add("on"); log(`Step ${i+1}/6 ✓`); await sleep(380); } log("Imagem pronta: projeto-marcio:latest (148 MB)"); built=true; q(root,"#drun").disabled=false; busy=false; }
    if(id==="drun"&&built){ busy=true; log("$ docker run -p 5000:5000 projeto-marcio   # nas duas máquinas");
      for(const m of ["m1","m2"]){ slot(m,'<div class="cont">⏳ iniciando contêiner…</div>'); await sleep(600); slot(m,'<div class="cont ok">✓ contêiner rodando<br>Python 3.12 · pandas 2.2 (dentro do contêiner)<br>localhost:5000</div>'); }
      log("Os dois funcionam igual: o contêiner leva o próprio Python e as bibliotecas."); busy=false; }
  });
 }});

const CI_CODE = "def media(notas):\n    return sum(notas) / len(notas)\n";
const CI_TESTS = [["media([7, 8])","7.5"],["media([10])","10"],["media([])","0"],["media([6, 7, 8])","7"]];
lab({id:"ci", tr:"devkit", area:"sw", title:"Testes automatizados e CI",
 blurb:"A cada git push, o GitHub Actions roda os testes. Se um teste falha, o deploy é bloqueado. Corrija o código e mande de novo.",
 learn:["Testes automatizados conferem o código sozinhos, a cada mudança.","CI (integração contínua) roda os testes no servidor a cada push.","Um teste vermelho impede que o erro chegue aos usuários."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><label class="k" for="cicode">notas.py</label><textarea id="cicode" class="py" spellcheck="false" style="min-height:150px">${esc(CI_CODE)}</textarea></div>
 <div><div class="k">test_notas.py</div><pre class="console small">${CI_TESTS.map(([a,b])=>`def test_${a.replace(/\W+/g,"_").replace(/_+$/,"")}():\n    assert ${a} == ${b}`).join("\n\n")}</pre></div></div>
 <div class="row wrap"><button class="btn" id="cipush">git push</button><span class="pystatus" id="cistat"></span></div>
 <div class="pipe" id="cipipe">${["Checkout","Instalar Python","Rodar testes","Deploy"].map((s,i)=>`<div class="stage" data-s="${i}">${s}</div>${i<3?'<span class="arrow">→</span>':""}`).join("")}</div>
 <div class="tests" id="citests"></div><div class="note" id="cinote">Clique em git push. Dica: o que acontece com uma lista vazia de notas?</div>`,
 mount(root){
  let busy=false; const S=i=>q(root,`[data-s="${i}"]`);
  root.addEventListener("keydown", e=>{ if(e.target.id==="cicode"&&e.key==="Tab"){ e.preventDefault(); e.target.setRangeText("    ", e.target.selectionStart, e.target.selectionEnd, "end"); } });
  root.addEventListener("click", async e=>{
    if(e.target.id!=="cipush"||busy) return; if(!window.ppRunPy){ q(root,"#cinote").textContent="O motor de Python não carregou. Recarregue a página."; return; }
    busy=true; qa(root,".stage").forEach(s=>s.className="stage"); q(root,"#citests").innerHTML=""; q(root,"#cinote").textContent="O GitHub Actions começou…";
    S(0).className="stage run"; await sleep(500); S(0).className="stage ok"; S(1).className="stage run"; q(root,"#cistat").textContent="Carregando o Python…";
    let r; try { r = await window.ppRunPy(q(root,"#cicode").value+"\nimport json\nres=[]\nfor a,b in "+JSON.stringify(CI_TESTS)+":\n    try:\n        g=eval(a); res.append([a,repr(g),g==eval(b),b])\n    except Exception as e:\n        res.append([a,type(e).__name__+': '+str(e),False,b])\nprint('@@'+json.dumps(res))",""); } catch(err){ q(root,"#cistat").textContent=err.message; busy=false; return; }
    q(root,"#cistat").textContent=""; S(1).className="stage ok"; S(2).className="stage run"; await sleep(600);
    if(!r.ok){ S(2).className="stage fail"; q(root,"#cinote").textContent="O código nem rodou: "+r.err.text; busy=false; return; }
    const res=JSON.parse(r.out.split("\n").find(l=>l.startsWith("@@")).slice(2)); const pass=res.every(x=>x[2]);
    q(root,"#citests").innerHTML=res.map(([a,g,p,b])=>`<div class="${p?"pass":"fail"}">${p?"✓ PASSED":"✗ FAILED"} ${esc(a)} == ${esc(b)}${p?"":` · obtido: ${esc(g)}`}</div>`).join("");
    if(!pass){ S(2).className="stage fail"; S(3).className="stage"; q(root,"#cinote").innerHTML="<b>Deploy bloqueado.</b> Um teste falhou, então o erro não chegou aos usuários. Corrija a função e faça git push de novo. Dica: se a lista estiver vazia, devolva 0."; }
    else { S(2).className="stage ok"; S(3).className="stage run"; await sleep(700); S(3).className="stage ok"; q(root,"#cinote").innerHTML="<b class=\"oktext\">Tudo verde!</b> Os testes passaram e o deploy foi feito automaticamente."; }
    busy=false;
  });
 }});

function lum(hex){ const c=hex.replace("#",""); const v=[0,2,4].map(i=>parseInt(c.substr(i,2),16)/255).map(x=>x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)); return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]; }
const ratio=(a,b)=>{ const [x,y]=[lum(a),lum(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
lab({id:"a11y", tr:"front", area:"sw", title:"Acessibilidade: contraste, daltonismo e leitor de tela",
 blurb:"Teste o contraste das cores, veja como pessoas com daltonismo enxergam e ouça o que um leitor de tela lê numa página bem e mal feita.",
 learn:["Texto precisa de contraste de pelo menos 4,5:1 com o fundo (regra WCAG AA).","Nunca use só a cor para passar informação.","Leitores de tela leem títulos, textos alternativos de imagens e nomes de botões."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px"><b>1. Contraste</b><div class="row wrap"><label class="f inline" for="afg">Texto <input type="color" id="afg" value="#8a8a8a"></label><label class="f inline" for="abg">Fundo <input type="color" id="abg" value="#ffffff"></label></div>
 <div class="swatch" id="asw"><b style="font-size:20px">Prova de Python na sexta</b><p>Texto comum de um cartaz da escola.</p></div><div class="readout"><div><span class="k">Contraste</span><b id="arat"></b></div><div><span class="k">Resultado</span><b id="abad" style="font-size:14px"></b></div></div></div>
 <div class="grid" style="gap:8px"><b>2. Como outras pessoas veem</b><select id="acb" aria-label="Simulação de visão"><option value="none">Visão comum</option><option value="protanopia">Protanopia (não vê vermelho)</option><option value="deuteranopia">Deuteranopia (não vê verde)</option><option value="tritanopia">Tritanopia (não vê azul)</option><option value="gray">Sem cores</option><option value="blur">Visão embaçada</option></select>
 <div class="mock" id="acbbox"><b>Resultado do simulado</b><div class="row wrap" style="margin-top:8px"><span style="background:#2ecc40;color:#fff;padding:4px 10px;border-radius:6px">Aprovado</span><span style="background:#ff4136;color:#fff;padding:4px 10px;border-radius:6px">Reprovado</span></div><p class="small" style="margin-top:6px">Se só a cor diferencia as situações, quem não distingue vermelho de verde fica sem informação. Por isso os rótulos têm texto.</p></div></div></div>
 <svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="f-protanopia"><feColorMatrix values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter><filter id="f-deuteranopia"><feColorMatrix values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter><filter id="f-tritanopia"><feColorMatrix values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter></svg>
 <b>3. Leitor de tela</b><div class="filters" role="group" aria-label="Versão da página"><button data-ver="ruim" aria-pressed="true">Página mal feita</button><button data-ver="boa" aria-pressed="false">Página acessível</button></div>
 <div class="two-even" style="margin-top:0"><div class="mock" id="asr"></div><div><div class="row wrap"><button class="btn sm" id="aread">Ler com leitor de tela</button><button class="btn ghost sm" id="aspeak">Ouvir em voz alta</button></div><pre class="console small" id="aout2" style="min-height:140px"></pre></div></div>`,
 mount(root){
  const PAGES={ruim:`<div style="font-size:22px;font-weight:bold">Matrículas abertas</div><img alt="" style="width:100%;height:60px;background:#ddd;display:block;margin:6px 0"><div style="display:flex;gap:6px"><div style="background:#2747C7;color:#fff;padding:6px 10px;border-radius:6px" role="none">➜</div><a href="#" onclick="return false">clique aqui</a></div>`,
   boa:`<h2 style="margin:0">Matrículas abertas</h2><img alt="Alunos montando um robô com Arduino no laboratório" style="width:100%;height:60px;background:#ddd;display:block;margin:6px 0"><div style="display:flex;gap:6px"><button style="background:#2747C7;color:#fff;border:0;padding:6px 10px;border-radius:6px">Fazer matrícula</button><a href="#" onclick="return false">Ver o edital de matrícula (PDF)</a></div>`};
  let ver="ruim", lines=[];
  function contrast(){ const fg=q(root,"#afg").value, bg=q(root,"#abg").value, r=ratio(fg,bg); q(root,"#asw").style.cssText=`color:${fg};background:${bg}`; q(root,"#arat").textContent=r.toFixed(2)+":1";
    q(root,"#abad").innerHTML=`<span class="badge ${r>=4.5?"y":"n"}">AA ${r>=4.5?"passa":"falha"}</span><span class="badge ${r>=7?"y":"n"}">AAA ${r>=7?"passa":"falha"}</span>`; }
  function read(){ const box=q(root,"#asr"); lines=[];
    box.querySelectorAll("h1,h2,h3,div,img,button,a").forEach(el=>{
      if(/^H\d/.test(el.tagName)) lines.push(`Título nível ${el.tagName[1]}: ${el.textContent}`);
      else if(el.tagName==="IMG") lines.push(el.alt?`Imagem: ${el.alt}`:"(imagem sem descrição: o leitor pula ou lê o nome do arquivo)");
      else if(el.tagName==="BUTTON") lines.push(`Botão: ${el.textContent}`);
      else if(el.tagName==="A") lines.push(`Link: ${el.textContent}${el.textContent==="clique aqui"?"  ← clique aqui para quê?":""}`);
      else if(el.tagName==="DIV" && el.children.length===0 && el.textContent.trim()) lines.push(el.textContent.trim()==="➜" ? "seta (não é botão, o teclado nem chega aqui)" : `Texto: ${el.textContent}${el.style.fontSize?" (parece título, mas não é: o leitor não sabe)":""}`);
    });
    q(root,"#aout2").textContent=lines.map((l,i)=>`${i+1}. ${l}`).join("\n"); }
  root.addEventListener("input", e=>{ if(e.target.id==="afg"||e.target.id==="abg") contrast(); });
  root.addEventListener("change", e=>{ if(e.target.id==="acb"){ const v=e.target.value; q(root,"#acbbox").style.filter = v==="none"?"":v==="gray"?"grayscale(1)":v==="blur"?"blur(2px)":`url(#f-${v})`; } });
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-ver]"); if(b){ ver=b.dataset.ver; qa(root,"[data-ver]").forEach(x=>x.setAttribute("aria-pressed",x===b)); q(root,"#asr").innerHTML=PAGES[ver]; q(root,"#aout2").textContent=""; }
    if(e.target.id==="aread") read();
    if(e.target.id==="aspeak"){ if(!lines.length) read(); try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(lines.join(". ")); u.lang="pt-BR"; speechSynthesis.speak(u); }catch(err){ toast("Este navegador não tem voz disponível."); } } });
  labOnStop(()=>{ try{ speechSynthesis.cancel(); }catch(e){} });
  q(root,"#asr").innerHTML=PAGES.ruim; contrast();
 }});

const TSS=[
 {t:"Somar números que vieram de um formulário",js:"function soma(a, b) {\n  return a + b;\n}\nsoma(VALOR, 3);",ts:"function soma(a: number, b: number): number {\n  return a + b;\n}\nsoma(VALOR, 3);",opts:[["5","número 5"],['"5"','texto "5" (vindo de um input)']],run:v=>v==='"5"'?['"53"',"O JavaScript juntou os textos: 5 + 3 virou “53”. Ninguém avisou."]:["8","Funcionou."],tsc:v=>v==='"5"'?"Erro TS2345: o argumento do tipo 'string' não pode ser usado no parâmetro do tipo 'number'.":null},
 {t:"Acessar um campo de um objeto",js:"const aluno = { nome: \"Ana\", nota: 9 };\nconsole.log(aluno.CAMPO);",ts:"type Aluno = { nome: string; nota: number };\nconst aluno: Aluno = { nome: \"Ana\", nota: 9 };\nconsole.log(aluno.CAMPO);",opts:[["nota","aluno.nota"],["nta","aluno.nta (erro de digitação)"]],run:v=>v==="nta"?["undefined","Silêncio: o JavaScript devolve undefined e o erro aparece só lá na frente."]:["9","Funcionou."],tsc:v=>v==="nta"?"Erro TS2339: a propriedade 'nta' não existe no tipo 'Aluno'. Você quis dizer 'nota'?":null},
 {t:"Procurar um aluno que talvez não exista",js:"const lista = [{ nome: \"Ana\" }];\nconst a = lista.find(x => x.nome === BUSCA);\nconsole.log(a.nome.toUpperCase());",ts:"const lista = [{ nome: \"Ana\" }];\nconst a = lista.find(x => x.nome === BUSCA);\nconsole.log(a.nome.toUpperCase());",opts:[['"Ana"','"Ana" (existe)'],['"Bia"','"Bia" (não existe)']],run:v=>v==='"Bia"'?["TypeError: Cannot read properties of undefined","O programa quebra na hora de rodar, na frente do usuário."]:['"ANA"',"Funcionou dessa vez."],tsc:()=> "Erro TS18048: 'a' pode ser 'undefined'. Trate o caso em que o aluno não é encontrado: if (a) { ... }"}];
lab({id:"ts", tr:"front", area:"sw", title:"TypeScript: o erro aparece antes de rodar",
 blurb:"Compare JavaScript e TypeScript em três situações reais. No JS o erro aparece só para o usuário; no TS, o editor avisa enquanto você digita.",
 learn:["TypeScript é JavaScript com tipos: você diz o que cada variável pode guardar.","O compilador encontra erros antes de o programa rodar.","No fim, o TypeScript vira JavaScript comum para o navegador."],
 html:()=>`<div class="filters" role="group" aria-label="Situação">${TSS.map((s,i)=>`<button data-ts="${i}" aria-pressed="${i===0}">${i+1}. ${esc(s.t)}</button>`).join("")}</div>
 <label class="f inline" for="tsval">Valor usado <select id="tsval"></select></label>
 <div class="tsbox"><div><div class="k">JavaScript</div><pre class="console small" id="tsjs"></pre><div class="k">Ao rodar</div><pre class="console small" id="tsjsr"></pre></div><div><div class="k">TypeScript</div><pre class="console small" id="tsts"></pre><div class="k">Antes de rodar (no editor)</div><pre class="console small" id="tstsr"></pre></div></div><div class="note" id="tsnote"></div>`,
 mount(root){
  let i=0;
  function opts(){ q(root,"#tsval").innerHTML=TSS[i].opts.map(([v,l])=>`<option value='${esc(v)}'>${esc(l)}</option>`).join(""); }
  function draw(){ const s=TSS[i], v=q(root,"#tsval").value, sub=x=>x.replace("VALOR",v).replace("CAMPO",v).replace("BUSCA",v);
    q(root,"#tsjs").textContent=sub(s.js); q(root,"#tsts").textContent=sub(s.ts);
    const [out,why]=s.run(v); q(root,"#tsjsr").innerHTML=`<span class="${out.includes("Error")||out==='"53"'||out==="undefined"?"tserr":"tsok"}">${esc(out)}</span>`;
    const err=s.tsc(v); q(root,"#tstsr").innerHTML= err?`<span class="tserr">✗ ${esc(err)}</span>`:`<span class="tsok">✓ Nenhum erro de tipo.</span>`;
    q(root,"#tsnote").textContent = err ? `${why} Com TypeScript, o problema aparece sublinhado em vermelho antes de rodar.` : why; }
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-ts]"); if(b){ i=+b.dataset.ts; qa(root,"[data-ts]").forEach(x=>x.setAttribute("aria-pressed",x===b)); opts(); draw(); } });
  root.addEventListener("change", e=>{ if(e.target.id==="tsval") draw(); });
  opts(); q(root,"#tsval").selectedIndex=1; draw();
 }});

lab({id:"react", tr:"front", area:"sw", title:"React: componentes e estado",
 blurb:"Um app de tarefas feito de componentes. Mude o estado e veja quais componentes o React redesenha (piscam em amarelo).",
 learn:["A interface é dividida em componentes reutilizáveis.","Estado (state) é a memória do componente; quando muda, a tela se atualiza sozinha.","Props são dados que o componente pai passa para o filho."],
 html:()=>`<div class="two-even" style="margin-top:0"><div><div class="k">O app funcionando</div><div class="rapp" id="rapp"></div></div><div><div class="k">Árvore de componentes</div><div class="rtree" id="rtree"></div><div class="k">Estado atual</div><pre class="console small" id="rstate"></pre></div></div>
 <div class="k">Código</div><pre class="console small">function App() {
  const [tarefas, setTarefas] = useState(["Estudar Git", "Fazer o CS50"]);
  const [texto, setTexto] = useState("");
  return (&lt;&gt;
    &lt;Cabecalho total={tarefas.length} /&gt;
    &lt;Formulario texto={texto} onMudar={setTexto} onAdicionar={() =&gt; setTarefas([...tarefas, texto])} /&gt;
    &lt;Lista itens={tarefas} onRemover={i =&gt; setTarefas(tarefas.filter((_, k) =&gt; k !== i))} /&gt;
  &lt;/&gt;);
}</pre>`,
 mount(root){
  let tarefas=["Estudar Git","Fazer o CS50"], texto="", renders={App:0,Cabecalho:0,Formulario:0,Lista:0};
  function flash(names){ names.forEach(n=>{ renders[n]++; }); tree(names); }
  function tree(fl=[]){ q(root,"#rtree").innerHTML=[["App",0],["Cabecalho",1],["Formulario",1],["Lista",1]].map(([n,d])=>`<div class="rnode ${fl.includes(n)?"flash":""}" style="margin-left:${d*22}px">&lt;${n}${n==="Cabecalho"?` total={${tarefas.length}}`:n==="Lista"?` itens={[${tarefas.length}]}`:n==="Formulario"?` texto="${esc(texto)}"`:""} /&gt; <span class="muted">· ${renders[n]} renderizações</span></div>`).join(""); labLater(()=>qa(root,".rnode.flash").forEach(x=>x.classList.remove("flash")),500);
    q(root,"#rstate").textContent=`tarefas = ${JSON.stringify(tarefas)}\ntexto = ${JSON.stringify(texto)}`; }
  function app(){ q(root,"#rapp").innerHTML=`<b style="font-family:var(--display);font-size:20px">Minhas tarefas (${tarefas.length})</b><div class="row"><input id="rin" value="${esc(texto)}" placeholder="Nova tarefa" aria-label="Nova tarefa" style="flex:1"><button class="btn sm" id="radd">Adicionar</button></div><ul class="plain">${tarefas.map((t,i)=>`<li>${esc(t)} <button class="linkbtn" data-rm="${i}">remover</button></li>`).join("")}</ul>`; }
  root.addEventListener("input", e=>{ if(e.target.id==="rin"){ texto=e.target.value; flash(["App","Formulario"]); } });
  root.addEventListener("click", e=>{ if(e.target.id==="radd"&&texto.trim()){ tarefas=[...tarefas,texto.trim()]; texto=""; app(); flash(["App","Cabecalho","Formulario","Lista"]); q(root,"#rin").focus(); }
    const rm=e.target.closest("[data-rm]"); if(rm){ tarefas=tarefas.filter((_,k)=>k!==+rm.dataset.rm); app(); flash(["App","Cabecalho","Lista"]); } });
  app(); flash(["App","Cabecalho","Formulario","Lista"]);
 }});

lab({id:"deploy", tr:"front", area:"sw", title:"Do git push ao site no ar",
 blurb:"Acompanhe a viagem do seu código até o navegador de qualquer pessoa: build, testes, CDN e DNS. Quebre o build e faça um rollback.",
 learn:["Deploy é publicar uma nova versão do sistema.","A CDN guarda cópias do site em vários lugares do mundo para carregar rápido.","Se a versão nova der problema, o rollback volta para a anterior em segundos."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline" for="dpmsg">Mudança <select id="dpmsg"><option value="ok">Novo botão de matrícula</option><option value="bug">Erro de digitação no código (build quebra)</option><option value="runtime">Bug que passa no build mas quebra a página</option></select></label><button class="btn" id="dppush">git push</button><button class="btn ghost" id="dprb">Rollback</button></div>
 <div class="pipe" id="dppipe">${["Push","Build","Testes","CDN","DNS"].map((s,i)=>`<div class="stage" data-p="${i}">${s}</div>${i<4?'<span class="arrow">→</span>':""}`).join("")}</div>
 <div class="two-even"><pre class="console small" id="dplog" style="min-height:170px"></pre><div class="site"><div class="bar2" id="dpurl">https://projeto-marcio.vercel.app · v1</div><div class="body" id="dpbody"></div></div></div>`,
 mount(root){
  let ver=1, live={v:1, kind:"ok"}, prev=null, busy=false;
  const P=i=>q(root,`[data-p="${i}"]`), log=s=>logTo(q(root,"#dplog"),s);
  function site(){ q(root,"#dpurl").textContent=`https://projeto-marcio.vercel.app · v${live.v}`; q(root,"#dpbody").innerHTML = live.kind==="runtime" ? `<b style="color:#c0392b">Uncaught TypeError: dados.alunos is undefined</b><p class="small">A página ficou em branco para todo mundo.</p>` : `<b style="font-family:var(--display);font-size:18px">Escola Exemplo</b><p>Laboratório de Educação Digital</p>${live.v>1&&live.kind==="ok"?'<button class="btn sm">Fazer matrícula</button>':""}`; }
  root.addEventListener("click", async e=>{
    if(busy) return;
    if(e.target.id==="dprb"){ if(!prev){ toast("Ainda não há versão anterior."); return; } log(`$ vercel rollback → volta para v${prev.v}`); live=prev; prev=null; site(); log("Rollback feito em 3 segundos. O site voltou a funcionar."); return; }
    if(e.target.id!=="dppush") return; busy=true; qa(root,".stage").forEach(s=>s.className="stage"); q(root,"#dplog").textContent="";
    const kind=q(root,"#dpmsg").value; ver++;
    P(0).className="stage ok"; log(`$ git push origin main  (versão v${ver})`); await sleep(400);
    P(1).className="stage run"; log("> npm run build"); await sleep(900);
    if(kind==="bug"){ P(1).className="stage fail"; log("✗ SyntaxError em src/App.jsx linha 12: esperado '}'"); log("Deploy cancelado. O site continua na versão anterior, no ar e funcionando."); ver--; busy=false; return; }
    P(1).className="stage ok"; log("✓ Build pronto: 42 arquivos otimizados (180 KB)");
    P(2).className="stage run"; await sleep(700); P(2).className="stage ok"; log("✓ 12 testes passaram");
    P(3).className="stage run"; log("Enviando para a CDN: São Paulo, Miami, Frankfurt, Tóquio…"); await sleep(900); P(3).className="stage ok";
    P(4).className="stage run"; log("DNS: projeto-marcio.vercel.app → servidor mais próximo de quem acessa"); await sleep(500); P(4).className="stage ok";
    prev={...live}; live={v:ver,kind}; site(); log(kind==="runtime" ? "No ar… mas a página quebrou! Os testes não cobriam esse caso. Use o Rollback." : `✓ v${ver} no ar para todo mundo.`); busy=false;
  });
  site();
 }});

const enc = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const b64uStr = s => b64u(enc.encode(s));
const unb64u = s => { try { return decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/")))); } catch(e){ return null; } };
async function sha256hex(s){ const h=await crypto.subtle.digest("SHA-256", enc.encode(s)); return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,"0")).join(""); }
async function hmac(key, data){ const k=await crypto.subtle.importKey("raw", enc.encode(key), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]); return b64u(await crypto.subtle.sign("HMAC", k, enc.encode(data))); }
lab({id:"auth", tr:"back", area:"sw", title:"Login seguro: hash de senha e token",
 blurb:"Cadastre um usuário e veja o que o banco realmente guarda. Faça login, receba um token e tente falsificá-lo para virar administrador.",
 learn:["O banco nunca guarda a senha, só o hash dela (uma impressão digital que não dá para reverter).","O sal (salt) faz senhas iguais terem hashes diferentes.","O token é assinado pelo servidor: se alguém mudar uma letra, a assinatura não confere."],
 html:()=>`<p class="small warntext">Use uma senha inventada. Nada sai do seu navegador.</p>
 <div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px"><b>1. Cadastro</b><div class="row wrap"><input id="auu" value="marcio" aria-label="Usuário" style="width:9em"><input id="aup" type="password" value="cafe azul pula" aria-label="Senha" style="width:11em"><button class="btn sm" id="areg">Cadastrar</button></div>
 <b>2. Login</b><div class="row wrap"><input id="alp" type="password" placeholder="senha" aria-label="Senha do login" style="width:11em"><button class="btn sm" id="alog">Entrar</button></div>
 <b>3. Usar o token</b><div class="row wrap"><button class="btn ghost sm" id="aget">GET /perfil</button><button class="btn ghost sm" id="aadm">GET /admin</button><button class="btn danger sm" id="ahack">Falsificar: virar admin</button></div></div>
 <div><div class="k">Tabela usuarios (o que o banco guarda)</div><div class="tablewrap"><table id="adb"><thead><tr><th>usuário</th><th>sal</th><th>hash</th></tr></thead><tbody></tbody></table></div><div class="k">Token (JWT)</div><div class="tok" id="atok">nenhum ainda</div><pre class="console small" id="adec" style="margin-top:6px"></pre></div></div>
 <pre class="console small" id="alog2" style="min-height:110px"></pre>`,
 mount(root){
  const SECRET="segredo-do-servidor-"+Math.random().toString(36).slice(2); let users={}, token=null;
  const log=s=>logTo(q(root,"#alog2"),s);
  function db(){ q(root,"#adb tbody").innerHTML=Object.entries(users).map(([u,x])=>`<tr><td>${esc(u)}</td><td class="mono small">${x.salt}</td><td class="mono small">${x.hash.slice(0,24)}…</td></tr>`).join("")||'<tr><td colspan="3" class="muted">vazia</td></tr>'; }
  function showTok(){ if(!token){ q(root,"#atok").textContent="nenhum ainda"; q(root,"#adec").textContent=""; return; } const [h,p,s]=token.split("."); q(root,"#atok").innerHTML=`<span class="h">${h}</span>.<span class="p">${p}</span>.<span class="s">${s}</span>`; q(root,"#adec").textContent=`cabeçalho: ${unb64u(h)}\nconteúdo:  ${unb64u(p)}\nassinatura: feita com a chave secreta do servidor`; }
  async function verify(t){ const [h,p,s]=t.split("."); return s===await hmac(SECRET, h+"."+p) ? JSON.parse(unb64u(p)) : null; }
  root.addEventListener("click", async e=>{
    const id=e.target.id;
    if(id==="areg"){ const u=q(root,"#auu").value.trim(), p=q(root,"#aup").value; if(!u||!p) return; const salt=[...crypto.getRandomValues(new Uint8Array(4))].map(b=>b.toString(16).padStart(2,"0")).join(""); const hash=await sha256hex(salt+p); users[u]={salt,hash}; db(); log(`Cadastro de ${u}: sal ${salt} + senha → SHA-256 → ${hash.slice(0,16)}…`); log("A senha em si não foi salva em lugar nenhum. (Sistemas reais usam bcrypt ou Argon2, que são lentos de propósito.)"); }
    if(id==="alog"){ const u=q(root,"#auu").value.trim(), p=q(root,"#alp").value, x=users[u]; if(!x){ log("Usuário não cadastrado."); return; } const h=await sha256hex(x.salt+p);
      if(h!==x.hash){ log(`Senha errada: o hash calculado (${h.slice(0,12)}…) não bate com o guardado.`); return; }
      const head=b64uStr(JSON.stringify({alg:"HS256",typ:"JWT"})), body=b64uStr(JSON.stringify({usuario:u,papel:"professor",exp:Math.floor(Date.now()/1000)+3600})); token=head+"."+body+"."+await hmac(SECRET, head+"."+body); showTok(); log("Login ok! O servidor calculou o hash da senha digitada, comparou e entregou um token válido por 1 hora."); }
    if(id==="aget"||id==="aadm"){ if(!token){ log(`GET ${id==="aget"?"/perfil":"/admin"} → 401: faça login primeiro.`); return; } const d=await verify(token);
      if(!d){ log(`GET ${id==="aget"?"/perfil":"/admin"} → 401: assinatura inválida! Token adulterado rejeitado.`); return; }
      if(id==="aget") log(`GET /perfil → 200: olá, ${d.usuario} (${d.papel}).`); else log(d.papel==="admin"?"GET /admin → 200: painel de administração.":"GET /admin → 403: você é professor, não administrador."); }
    if(id==="ahack"){ if(!token){ log("Faça login primeiro."); return; } const [h,p,s]=token.split("."); const d=JSON.parse(unb64u(p)); d.papel="admin"; token=h+"."+b64uStr(JSON.stringify(d))+"."+s; showTok(); log("Você editou o conteúdo do token e trocou papel para admin. Agora tente GET /admin…"); }
  });
  db();
 }});

lab({id:"baas", tr:"back", area:"sw", title:"Back-end pronto (estilo Supabase)",
 blurb:"Uma tabela na nuvem com login e regras de segurança, sem escrever um servidor. Monte as operações e veja o código do cliente JavaScript.",
 learn:["Serviços como Supabase e Firebase dão banco, login e arquivos prontos.","O app conversa direto com o serviço por uma biblioteca JavaScript.","Regras de segurança por linha (RLS) decidem quem pode ver e mudar cada registro."],
 html:()=>`<div class="row wrap ctrls"><label class="chk inline" for="bslog"><input type="checkbox" id="bslog"><span>Logado como prof.marcio</span></label><label class="chk inline" for="bsrls"><input type="checkbox" id="bsrls" checked><span>Segurança por linha (RLS) ligada</span></label></div>
 <div class="row wrap ctrls"><select id="bsop" aria-label="Operação"><option value="select">Listar atividades</option><option value="insert">Criar atividade</option><option value="delete">Apagar a atividade de outro professor</option></select><input id="bstit" value="Lista de Python 2" aria-label="Título da atividade"><button class="btn sm" id="bsrun">Executar</button></div>
 <div class="two-even" style="margin-top:0"><div><div class="k">Código no seu app</div><pre class="console small" id="bscode"></pre><div class="k">Resposta</div><pre class="console small" id="bsres"></pre></div><div><div class="k">Tabela atividades</div><div class="tablewrap"><table id="bstab"></table></div><div class="k">Regra (policy)</div><pre class="console small">-- só o dono pode criar e apagar as suas atividades
create policy "dono" on atividades
  for all using (auth.uid() = dono);</pre></div></div>`,
 mount(root){
  let rows=[{id:1,titulo:"Quiz de binário",dono:"prof.ana"},{id:2,titulo:"Arduino: semáforo",dono:"prof.marcio"}], nid=3;
  function code(){ const op=q(root,"#bsop").value, t=q(root,"#bstit").value;
    q(root,"#bscode").textContent = op==="select" ? `const { data, error } = await supabase\n  .from("atividades")\n  .select("*")` : op==="insert" ? `const { data, error } = await supabase\n  .from("atividades")\n  .insert({ titulo: "${t}" })` : `const { error } = await supabase\n  .from("atividades")\n  .delete()\n  .eq("id", 1)   // atividade da prof.ana`; }
  function tab(){ q(root,"#bstab").innerHTML=`<thead><tr><th>id</th><th>titulo</th><th>dono</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.id}</td><td>${esc(r.titulo)}</td><td>${r.dono}</td></tr>`).join("")}</tbody>`; }
  root.addEventListener("change", code); root.addEventListener("input", code);
  root.addEventListener("click", e=>{ if(e.target.id!=="bsrun") return; const op=q(root,"#bsop").value, logged=q(root,"#bslog").checked, rls=q(root,"#bsrls").checked; let res;
    if(op==="select") res= rls&&!logged ? {data:[],note:"Sem login, a regra não deixa ver nada."} : {data:rows};
    else if(!logged) res={error:"401: é preciso estar logado (JWT ausente)."};
    else if(op==="insert"){ const r={id:nid++,titulo:q(root,"#bstit").value||"Sem título",dono:"prof.marcio"}; rows.push(r); res={data:[r]}; }
    else { if(rls) res={error:"permissão negada pela policy \"dono\": você não é o dono da atividade 1."}; else { rows=rows.filter(r=>r.id!==1); res={data:null,note:"Apagou a atividade da colega! Sem RLS, qualquer usuário logado mexe em tudo."}; } }
    q(root,"#bsres").textContent=JSON.stringify(res,null,2); tab(); });
  code(); tab();
 }});

lab({id:"cloud", tr:"back", area:"sw", title:"Nuvem: servidores que crescem com o acesso",
 blurb:"Simule o dia do resultado de uma prova: o acesso explode. Com escala automática, a nuvem liga mais servidores; sem ela, o site cai.",
 learn:["Na nuvem você aluga servidores por hora, em vez de comprar máquinas.","Escala automática liga e desliga servidores conforme o acesso.","Pagar por uso evita gastar com servidores parados de madrugada."],
 html:()=>`<div class="row wrap ctrls"><label class="chk inline" for="clauto"><input type="checkbox" id="clauto" checked><span>Escala automática</span></label><label class="f inline" for="clfix">Servidores fixos <b id="clfixv">2</b><input type="range" id="clfix" min="1" max="10" value="2"></label><button class="btn" id="clrun">▶ Simular o dia</button></div>
 <canvas id="clcv" class="cv"></canvas><div class="k">Servidores ligados agora (a barra verde mostra quanto cada um está ocupado)</div><div class="srvs" id="clsrv"></div>
 <div class="readout"><div><span class="k">Hora</span><b id="clh">00h</b></div><div><span class="k">Acessos por segundo</span><b id="clrq">0</b></div><div><span class="k">Pedidos com erro</span><b id="cler">0%</b></div><div><span class="k">Custo do dia</span><b id="clc">R$ 0</b></div></div><div class="note" id="clnote">Cada servidor aguenta 100 acessos por segundo e custa R$ 0,50 por hora.</div>`,
 mount(root){
  const W=640,H=200,c=setupCanvas(q(root,"#clcv"),W,H);
  const load=h=> h<6?20 : h<10?60+ (h-6)*40 : h<12? 220 : h===12? 900 : h===13? 650 : h<18? 260 : h<22? 180 : 60;
  let hist=[], cost=0, errs=0, total=0;
  function draw(h){ c.clearRect(0,0,W,H); const X=x=>30+x*(W-40)/24, Y=v=>H-20-v*(H-30)/1200; c.strokeStyle=css("--line"); c.fillStyle=css("--muted"); c.font="11px system-ui";
    [0,300,600,900,1200].forEach(v=>{ c.beginPath(); c.moveTo(30,Y(v)); c.lineTo(W-10,Y(v)); c.stroke(); c.fillText(v,2,Y(v)+4); }); [0,6,12,18,24].forEach(x=>c.fillText(x+"h",X(x)-6,H-4));
    const line=(k,col,w)=>{ c.beginPath(); hist.forEach((p,i)=>i?c.lineTo(X(p.h),Y(p[k])):c.moveTo(X(p.h),Y(p[k]))); c.strokeStyle=col; c.lineWidth=w; c.stroke(); };
    if(hist.length){ line("rq",css("--accent"),3); line("cap",css("--ok"),2); } c.fillStyle=css("--accent"); c.fillText("acessos",W-120,16); c.fillStyle=css("--ok"); c.fillText("capacidade",W-70,16); }
  root.addEventListener("input", e=>{ if(e.target.id==="clfix") q(root,"#clfixv").textContent=e.target.value; });
  root.addEventListener("click", async e=>{ if(e.target.id!=="clrun") return; e.target.disabled=true; hist=[]; cost=0; errs=0; total=0;
    for(let h=0;h<=24;h++){ const rq=load(h%24), auto=q(root,"#clauto").checked, n= auto ? Math.max(1,Math.ceil(rq*1.2/100)) : +q(root,"#clfix").value, cap=n*100;
      const bad=Math.max(0,rq-cap); errs+=bad; total+=rq; cost+=n*0.5; hist.push({h,rq,cap});
      q(root,"#clsrv").innerHTML=Array.from({length:n},()=>`<div class="srv"><i style="height:${Math.min(100,rq/cap*100)}%"></i><span style="position:relative">${Math.round(Math.min(100,rq/cap*100))}%</span></div>`).join("");
      q(root,"#clh").textContent=String(h).padStart(2,"0")+"h"; q(root,"#clrq").textContent=rq; q(root,"#cler").textContent=Math.round(100*errs/Math.max(1,total))+"%"; q(root,"#clc").textContent="R$ "+cost.toFixed(2).replace(".",",");
      if(h===12) q(root,"#clnote").textContent= bad>0 ? `Meio-dia: o resultado saiu e chegaram ${rq} acessos por segundo. Sem servidores suficientes, ${bad} por segundo receberam erro 503.` : `Meio-dia: o resultado saiu (${rq} acessos/s). A nuvem ligou ${n} servidores em segundos e ninguém ficou sem resposta.`;
      draw(h); await sleep(260); }
    q(root,"#clnote").textContent += ` Fim do dia: custo de R$ ${cost.toFixed(2).replace(".",",")}.`; e.target.disabled=false; });
  draw(0);
 }});

lab({id:"arch", tr:"back", area:"sw", title:"Arquitetura: cache e fila",
 blurb:"Duas peças que todo sistema grande usa. O cache responde rápido o que é pedido sempre; a fila guarda tarefas pesadas para fazer depois, sem travar o site.",
 learn:["Cache guarda respostas prontas na memória para não consultar o banco toda vez.","Fila separa o pedido do trabalho pesado: o usuário não precisa esperar.","Workers são processos que pegam tarefas da fila, uma a uma."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px"><b>Cache</b><label class="chk inline" for="arcache"><input type="checkbox" id="arcache"><span>Usar cache (Redis)</span></label><div class="row wrap"><button class="btn sm" id="ar1">Pedir “cardápio do dia” 20 vezes</button><button class="btn ghost sm" id="arclear">Limpar cache</button></div>
 <div class="readout"><div><span class="k">Tempo médio</span><b id="armean">–</b></div><div><span class="k">Acertos no cache</span><b id="arhit">–</b></div><div><span class="k">Consultas ao banco</span><b id="ardb">0</b></div></div><pre class="console small" id="arlog" style="min-height:90px"></pre></div>
 <div class="grid" style="gap:8px"><b>Fila</b><div class="row wrap"><button class="btn sm" id="arenq">Enviar boletim para 60 famílias</button><label class="f inline" for="arw">Workers <b id="arwv">2</b><input type="range" id="arw" min="1" max="8" value="2"></label></div>
 <div class="k">Fila (cada bloco = 1 e-mail)</div><div class="q2" id="arq"></div><div class="readout"><div><span class="k">Na fila</span><b id="arqn">0</b></div><div><span class="k">Enviados</span><b id="arsent">0</b></div><div><span class="k">Usuário esperou</span><b id="arwait">–</b></div></div><div class="note small" id="arnote">Sem fila, o professor ficaria olhando a tela enquanto 60 e-mails eram enviados um por um.</div></div></div>`,
 mount(root){
  let cache=new Map(), dbq=0, queue=0, sent=0;
  root.addEventListener("input", e=>{ if(e.target.id==="arw") q(root,"#arwv").textContent=e.target.value; });
  root.addEventListener("click", async e=>{
    if(e.target.id==="arclear"){ cache.clear(); q(root,"#arlog").textContent="Cache limpo."; }
    if(e.target.id==="ar1"){ e.target.disabled=true; const use=q(root,"#arcache").checked; let tot=0, hits=0; q(root,"#arlog").textContent="";
      for(let i=0;i<20;i++){ let ms; if(use&&cache.has("cardapio")){ ms=2+Math.random()*3; hits++; } else { ms=280+Math.random()*80; dbq++; if(use) cache.set("cardapio",1); }
        tot+=ms; q(root,"#arlog").textContent=`pedido ${i+1}: ${Math.round(ms)} ms ${ms<20?"(cache)":"(banco de dados)"}\n`+q(root,"#arlog").textContent; q(root,"#ardb").textContent=dbq; await sleep(Math.min(ms,120)); }
      q(root,"#armean").textContent=Math.round(tot/20)+" ms"; q(root,"#arhit").textContent=use?Math.round(hits/20*100)+"%":"sem cache"; e.target.disabled=false; }
    if(e.target.id==="arenq"){ queue+=60; q(root,"#arwait").textContent="0,1 s"; q(root,"#arnote").textContent="O pedido foi aceito na hora: “Boletins na fila!”. Os workers enviam em segundo plano."; }
  });
  labEvery(()=>{ const w=+q(root,"#arw").value; const n=Math.min(queue,w); queue-=n; sent+=n; q(root,"#arq").innerHTML="<span></span>".repeat(Math.min(queue,120)); q(root,"#arqn").textContent=queue; q(root,"#arsent").textContent=sent; if(n&&!queue) q(root,"#arnote").textContent=`Todos enviados. Com ${w} worker(s), cada um pegou um e-mail por vez. Mais workers, fila mais rápida.`; }, 300);
 }});

lab({id:"pwa", tr:"apps", area:"sw", title:"PWA: o site que funciona sem internet",
 blurb:"Instale o site como app no celular simulado, corte a internet e compare: sem service worker aparece o erro; com ele, o app abre e guarda o que você fizer até a conexão voltar.",
 learn:["PWA é um site que pode ser instalado na tela inicial e funcionar offline.","O service worker é um script que fica entre o app e a internet e guarda arquivos em cache.","Dados criados offline ficam numa fila e sincronizam quando a internet volta."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="phone"><div class="stat"><span>09:41</span><span id="pwnet">📶 online</span></div><div class="scr" id="pwscr"></div></div>
 <div class="grid" style="gap:8px"><label class="chk inline" for="pwsw"><input type="checkbox" id="pwsw" checked><span>Service worker ativo</span></label><label class="chk inline" for="pwon"><input type="checkbox" id="pwon" checked><span>Internet ligada</span></label>
 <div class="row wrap"><button class="btn sm" id="pwinst">Instalar na tela inicial</button><button class="btn ghost sm" id="pwopen">Abrir o app</button></div><pre class="console small" id="pwlog" style="min-height:90px"></pre>
 <details><summary class="small"><b>manifest.json e sw.js</b></summary><pre class="console small">// manifest.json
{ "name": "Chamada da Turma", "start_url": "/", "display": "standalone", "icons": [...] }

// sw.js
self.addEventListener("fetch", e =&gt; {
  e.respondWith(caches.match(e.request).then(r =&gt; r || fetch(e.request)));
});</pre></details></div></div>`,
 mount(root){
  let installed=false, opened=false, pending=[], synced=["Ana: presente","Bruno: presente"];
  const log=s=>logTo(q(root,"#pwlog"),s);
  function scr(){ const on=q(root,"#pwon").checked, sw=q(root,"#pwsw").checked; q(root,"#pwnet").textContent=on?"📶 online":"✈ offline";
    if(!opened){ q(root,"#pwscr").innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;font-size:11px"><div>📷<br>Câmera</div><div>💬<br>WhatsApp</div>${installed?'<div><div style="width:40px;height:40px;margin:auto;border-radius:10px;background:#2747C7;color:#fff;display:grid;place-items:center;font-weight:800">CT</div>Chamada</div>':""}</div>`; return; }
    if(!on&&!sw){ q(root,"#pwscr").innerHTML=`<div style="text-align:center;margin-top:60px">🦖<br><b>Sem conexão com a internet</b><p style="font-size:12px;color:#666">ERR_INTERNET_DISCONNECTED</p></div>`; return; }
    q(root,"#pwscr").innerHTML=`<b>Chamada da Turma 8A</b>${!on?'<span style="font-size:11px;background:#fde68a;padding:2px 6px;border-radius:6px">offline · usando cache</span>':""}<ul style="padding-left:18px;margin:0">${synced.concat(pending.map(p=>p+" ⏳")).map(x=>`<li>${esc(x)}</li>`).join("")}</ul><button class="btn sm" id="pwadd">Marcar presença</button>${pending.length?`<span style="font-size:11px">${pending.length} aguardando internet</span>`:""}`; }
  root.addEventListener("change", e=>{ if(e.target.id==="pwon"&&e.target.checked&&pending.length){ log(`Internet voltou: sincronizando ${pending.length} registro(s)…`); synced=synced.concat(pending); pending=[]; } if(e.target.id==="pwon"&&!e.target.checked) log("Modo avião ligado."); scr(); });
  root.addEventListener("click", e=>{
    if(e.target.id==="pwinst"){ installed=true; opened=false; log("Ícone “Chamada” adicionado à tela inicial. Abre sem barra de endereço, como um app."); scr(); }
    if(e.target.id==="pwopen"){ if(!installed){ toast("Instale primeiro."); return; } opened=true; const on=q(root,"#pwon").checked, sw=q(root,"#pwsw").checked; log(on?"Abriu buscando da internet (e o service worker guardou uma cópia).": sw?"Abriu do cache do service worker, mesmo sem internet!":"Sem service worker e sem internet: tela de erro."); scr(); }
    if(e.target.id==="pwadd"){ const names=["Carla","Diego","Eva","Fábio","Gabi","Hugo"]; const n=names[(synced.length+pending.length-2)%names.length]+": presente"; if(q(root,"#pwon").checked){ synced.push(n); log("Salvo no servidor."); } else { pending.push(n); log("Sem internet: guardado no aparelho para enviar depois."); } scr(); }
  });
  scr();
 }});

const AGENT_TASKS = {
 notas:{q:"Quantos alunos da 8A estão com média abaixo de 6? Mande a lista para a coordenação.",steps:[
  ["think","Preciso dos dados da turma 8A. Vou usar a ferramenta de planilha."],
  ["tool","ler_planilha(arquivo=\"notas_2026.xlsx\", aba=\"8A\")"],
  ["obs","32 linhas lidas: nome, n1, n2, n3"],
  ["think","Agora calculo a média de cada aluno e filtro quem ficou abaixo de 6."],
  ["tool","executar_python(\"df['media'] = df[['n1','n2','n3']].mean(axis=1); df[df.media < 6]\")"],
  ["obs","4 alunos: Diego (4,8), João (5,1), Lia (5,6), Rui (5,9)"],
  ["think","Para enviar o e-mail, preciso da aprovação do professor: é uma ação com efeito real."],
  ["ask","enviar_email(para=\"coordenacao@escola.edu.br\", assunto=\"8A: alunos abaixo de 6\", corpo=\"Diego, João, Lia e Rui...\")"],
  ["obs","E-mail enviado."],
  ["final","Na 8A, 4 alunos estão com média abaixo de 6: Diego, João, Lia e Rui. Enviei a lista para a coordenação."]]},
 agenda:{q:"Marque uma reunião com os pais da 8B na próxima quinta às 19h e avise no grupo.",steps:[
  ["think","Primeiro vejo se a quinta às 19h está livre na agenda."],
  ["tool","consultar_agenda(data=\"quinta\", hora=\"19:00\")"],
  ["obs","Conflito: “Aula de inglês” das 18h30 às 19h30"],
  ["think","Há conflito. Não devo decidir sozinho: vou propor alternativas."],
  ["final","Quinta às 19h você tem aula de inglês. Posso marcar às 20h de quinta ou às 19h de sexta. Qual prefere?"]]},
 erro:{q:"Qual a previsão do tempo para a excursão de sábado?",steps:[
  ["think","Vou consultar a ferramenta de clima."],
  ["tool","clima(cidade=\"São Paulo\", dia=\"sábado\")"],
  ["obs","ERRO 503: serviço indisponível"],
  ["think","A ferramenta falhou. Tento de novo uma vez antes de desistir."],
  ["tool","clima(cidade=\"São Paulo\", dia=\"sábado\")"],
  ["obs","Sábado: 24 °C, 70% de chance de chuva à tarde"],
  ["final","A previsão para sábado é de 24 °C com 70% de chance de chuva à tarde. Vale levar capas ou planejar atividades cobertas."]]}};
lab({id:"agent", tr:"ia", area:"sw", title:"Agente de IA usando ferramentas",
 blurb:"Veja por dentro como um agente trabalha: ele pensa, escolhe uma ferramenta, observa o resultado e repete até terminar, pedindo sua aprovação antes de ações importantes.",
 learn:["Um agente é um modelo de linguagem que pode usar ferramentas (planilha, agenda, e-mail…).","O ciclo é: pensar → agir → observar → repetir.","Ações com efeito real, como enviar e-mail, devem pedir aprovação humana."],
 html:()=>`<div class="filters" role="group" aria-label="Tarefa">${[["notas","Notas da 8A"],["agenda","Marcar reunião"],["erro","Ferramenta com erro"]].map(([k,l],i)=>`<button data-ag="${k}" aria-pressed="${i===0}">${l}</button>`).join("")}</div>
 <div class="amsg"><b>Você:</b> <span id="agq"></span></div><div class="agentlog" id="aglog"></div>
 <div class="row wrap"><button class="btn" id="agnext">Próximo passo</button><button class="btn ghost sm" id="agreset">Recomeçar</button><span class="small muted" id="agst"></span></div>
 <div class="note small">Ferramentas disponíveis: ler_planilha, executar_python, consultar_agenda, clima, enviar_email (exige aprovação). É assim que o Claude trabalha quando usa ferramentas, e é o que o protocolo MCP padroniza.</div>`,
 mount(root){
  let key="notas", i=0, waiting=false;
  const LBL={think:"Pensando",tool:"Usando ferramenta",obs:"Resultado",final:"Resposta final",ask:"Pede aprovação"};
  function reset(){ i=0; waiting=false; q(root,"#agq").textContent=AGENT_TASKS[key].q; q(root,"#aglog").innerHTML=""; q(root,"#agnext").disabled=false; q(root,"#agst").textContent=""; }
  function add(kind,text,extra=""){ const d=document.createElement("div"); d.className="amsg "+kind; d.innerHTML=`<span class="k" style="margin:0">${LBL[kind]}</span><div>${esc(text)}</div>${extra}`; q(root,"#aglog").appendChild(d); }
  root.addEventListener("click", e=>{
    const b=e.target.closest("[data-ag]"); if(b){ key=b.dataset.ag; qa(root,"[data-ag]").forEach(x=>x.setAttribute("aria-pressed",x===b)); reset(); return; }
    if(e.target.id==="agreset") reset();
    if(e.target.id==="agnext"&&!waiting){ const S=AGENT_TASKS[key].steps; if(i>=S.length) return; const [k,t]=S[i];
      if(k==="ask"){ waiting=true; add("ask",t,`<div class="row" style="margin-top:8px"><button class="btn sm" id="agyes">Aprovar envio</button><button class="btn danger sm" id="agno">Recusar</button></div>`); q(root,"#agst").textContent="O agente parou e espera a sua decisão."; return; }
      add(k==="tool"?"tool":k,t); i++; q(root,"#agst").textContent=`Passo ${i} de ${S.length}`; if(i>=S.length){ q(root,"#agnext").disabled=true; q(root,"#agst").textContent="Tarefa concluída."; } }
    if(e.target.id==="agyes"||e.target.id==="agno"){ const S=AGENT_TASKS[key].steps; e.target.parentElement.remove(); waiting=false;
      if(e.target.id==="agyes"){ add("tool",S[i][1].replace(/^/,"")+"  ✓ aprovado"); i++; }
      else { add("obs","Envio recusado pelo professor."); add("final","Tudo bem, não enviei. A lista está aqui para você revisar: Diego, João, Lia e Rui."); i=S.length; q(root,"#agnext").disabled=true; q(root,"#agst").textContent="Tarefa encerrada sem enviar."; } }
  });
  reset();
 }});
})();
