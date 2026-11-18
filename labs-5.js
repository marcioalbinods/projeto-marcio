(function(){
const q = (r,s) => r.querySelector(s), qa = (r,s) => [...r.querySelectorAll(s)];
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const ls = { get(k,d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }, set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} } };
function setupCanvas(cv, w, h){ const d = window.devicePixelRatio || 1; cv.width = w*d; cv.height = h*d; cv.style.width = "100%"; cv.style.maxWidth = w+"px"; cv.style.aspectRatio = w+"/"+h; const c = cv.getContext("2d"); c.setTransform(d,0,0,d,0,0); return c; }
function logTo(el, msg){ const p = document.createElement("div"); p.textContent = msg; el.appendChild(p); el.scrollTop = el.scrollHeight; }

const MAP = {h1:"appinv", h4:"rnphone", h5:"flutter", h6:"planner", j6:"linebot", j8:"esp32", j9:"rpi", j10:"robot", k3:"bezier", k4:"param", k6:"mesh", k7:"scad"};
Object.entries(MAP).forEach(([k,v]) => { STEP_LABS[k] = (STEP_LABS[k]||[]).concat(v); delete PLANNED[k]; });
STEP_LABS.j5 = (STEP_LABS.j5||[]).concat("linebot");

const st = document.createElement("style");
st.textContent = `
.blocks{display:grid;gap:8px}.blk{border-radius:10px;padding:8px 10px;color:#fff;font:600 14px var(--body);display:flex;gap:6px;align-items:center;flex-wrap:wrap}.blk select{border-radius:6px;border:0;padding:3px 6px;font:inherit;color:#111}.blk.ev{background:#c88330}.blk.ac{background:#3d6bb3;margin-left:22px}.blk.va{background:#5ba55b}
.phone2{width:230px;min-height:400px;border:10px solid #111;border-radius:30px;background:#fff;color:#111;margin:auto;display:grid;grid-template-rows:auto auto 1fr;overflow:hidden;font-family:system-ui}.phone2 .sb2{background:#f2f2f2;font:11px var(--mono);padding:4px 10px;display:flex;justify-content:space-between}.phone2 .ab2{padding:10px 12px;color:#fff;font-weight:700}.phone2 .bd{padding:12px;display:grid;gap:10px;align-content:start}
.ftree{display:grid;gap:4px;font:13px var(--mono)}.fnode{border:1px solid var(--line);border-radius:8px;padding:4px 8px;background:var(--surface);display:flex;justify-content:space-between;gap:6px;align-items:center}
.wire{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.wf{border:2px dashed var(--line);border-radius:10px;padding:8px;min-height:120px;font-size:12px;background:var(--surface)}.wf b{display:block;font-size:13px;margin-bottom:4px}.wf i{display:block;height:8px;background:var(--line);border-radius:4px;margin:5px 0}
.cv2{background:var(--paper);border:1px solid var(--line);border-radius:10px;touch-action:none}
.gpio{display:grid;grid-template-columns:repeat(2,auto);gap:2px 10px;font:11px var(--mono)}.gpio span.on{color:var(--ok);font-weight:800}
.bom td,.bom th{font-size:14px}
.kv{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:14px}
`;
document.head.appendChild(st);

lab({id:"appinv", tr:"apps", area:"sw", title:"App Inventor: monte um app com blocos",
 blurb:"Escolha o evento, a ação e o valor em blocos coloridos, como no MIT App Inventor, e teste o app de sorteio no celular simulado.",
 learn:["Apps reagem a eventos: um toque, uma sacudida, a tela abrindo.","Blocos de evento (laranja) disparam ações (azul), que usam valores (verde).","O mesmo raciocínio vale para Scratch, MakeCode e programação em texto."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:10px"><div class="k">Seus blocos</div><div class="blocks">
 <div class="blk ev">quando <select id="aiev"><option value="click">Botão1.Clique</option><option value="shake">Acelerômetro.Agitado</option><option value="init">Tela1.Inicializar</option></select></div>
 <div class="blk ac">fazer <select id="aiac"><option value="label">ajustar Rótulo1.Texto para</option><option value="speak">falar o texto</option><option value="color">mudar cor do fundo para</option></select></div>
 <div class="blk ac" style="margin-left:44px;background:#5ba55b">valor <select id="aiva"><option value="name">nome aleatório da lista de alunos</option><option value="num">número aleatório de 1 a 30</option><option value="group">grupo aleatório: A, B, C ou D</option><option value="color">cor aleatória</option></select></div></div>
 <label class="f" for="ailist">Lista de alunos (separados por vírgula)<input id="ailist" value="Ana, Bruno, Carla, Diego, Eva, Fábio, Gabi"></label>
 <div class="k">O mesmo programa em texto</div><pre class="console small" id="aicode"></pre></div>
 <div><div class="phone2" id="aiph"><div class="sb2"><span>09:41</span><span>📶 🔋</span></div><div class="ab2" style="background:#3d6bb3">Sorteio da Turma</div><div class="bd" id="aibd"><div id="ailbl" style="font-size:26px;font-weight:800;text-align:center;min-height:40px">?</div><button class="btn" id="aibtn" style="justify-self:center">Sortear</button></div></div>
 <div class="row wrap" style="justify-content:center;margin-top:8px"><button class="btn ghost sm" id="aishake">Sacudir o celular</button><button class="btn ghost sm" id="aiinit">Reabrir o app</button></div><p class="small muted" id="ainote" style="text-align:center"></p></div></div>`,
 mount(root){
  const ev=()=>q(root,"#aiev").value, ac=()=>q(root,"#aiac").value, va=()=>q(root,"#aiva").value;
  function value(){ const v=va(); if(v==="name"){ const l=q(root,"#ailist").value.split(",").map(s=>s.trim()).filter(Boolean); return l[rnd(0,l.length-1)]||"(lista vazia)"; } if(v==="num") return String(rnd(1,30)); if(v==="group") return "Grupo "+"ABCD"[rnd(0,3)]; return ["#ffd6d6","#d6f5e3","#d6e4ff","#fff3c4"][rnd(0,3)]; }
  function run(src){ if(src!==ev()){ q(root,"#ainote").textContent= src==="click"?"Nenhum bloco responde ao clique. Troque o evento para Botão1.Clique.":src==="shake"?"Nenhum bloco responde à sacudida.":"Nenhum bloco roda quando a tela abre."; return; }
    const v=value(), a=ac(), ph=q(root,"#aiph");
    if(a==="label") q(root,"#ailbl").textContent=v.startsWith("#")?"(isso é uma cor!)":v;
    if(a==="color") q(root,"#aibd").style.background=v.startsWith("#")?v:"#fff";
    if(a==="speak"){ q(root,"#ailbl").textContent="🔊 "+v; try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(v); u.lang="pt-BR"; speechSynthesis.speak(u); }catch(e){} }
    if(src==="shake"){ ph.style.transform="rotate(-3deg)"; labLater(()=>ph.style.transform="",200); }
    q(root,"#ainote").textContent="O evento disparou e o app executou os blocos."; }
  function code(){ const E={click:"when Botao1.Click",shake:"when Acelerometro.Agitado",init:"when Tela1.Inicializar"}[ev()], A={label:"Rotulo1.Texto = ",speak:"Falar(",color:"Tela1.CorDeFundo = "}[ac()], V={name:"escolher_aleatorio(lista_alunos)",num:"inteiro_aleatorio(1, 30)",group:"\"Grupo \" + escolher_aleatorio([\"A\",\"B\",\"C\",\"D\"])",color:"cor_aleatoria()"}[va()];
    q(root,"#aicode").textContent=`${E}:\n    ${A}${V}${ac()==="speak"?")":""}`; }
  root.addEventListener("change", code);
  root.addEventListener("click", e=>{ if(e.target.id==="aibtn") run("click"); if(e.target.id==="aishake") run("shake"); if(e.target.id==="aiinit"){ q(root,"#aibd").style.background="#fff"; q(root,"#ailbl").textContent="?"; run("init"); } });
  labOnStop(()=>{ try{ speechSynthesis.cancel(); }catch(e){} });
  code();
 }});

lab({id:"rnphone", tr:"apps", area:"sw", title:"React Native: um app para Android e iPhone",
 blurb:"Edite o app de agenda escolar e veja o celular atualizar na hora, como no Expo Go. Troque entre Android e iPhone: o mesmo código vira os dois.",
 learn:["React Native usa React para criar apps nativos de verdade.","Um único código gera o app de Android e o de iPhone.","Com o Expo Go, você testa no próprio celular escaneando um QR code."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px"><div class="filters" role="group" aria-label="Sistema"><button data-os="android" aria-pressed="true">Android</button><button data-os="ios" aria-pressed="false">iPhone</button></div>
 <label class="f" for="rnt">Título<input id="rnt" value="Agenda da 8A"></label><label class="f" for="rnc">Cor principal<input type="color" id="rnc" value="#2747C7"></label>
 <label class="f" for="rni">Atividades (uma por linha)<textarea id="rni" style="min-height:90px">Prova de Python · sexta
Entregar o robô · 28/11
Feira de ciências · 05/12</textarea></label><div class="k">App.js</div><pre class="console small" id="rncode"></pre></div>
 <div><div class="phone2" id="rnph"></div><p class="small muted" style="text-align:center" id="rnlog">Expo Go conectado · atualização automática ligada</p></div></div>`,
 mount(root){
  let os="android", n=0, done=new Set();
  function draw(){ const t=q(root,"#rnt").value, c=q(root,"#rnc").value, items=q(root,"#rni").value.split("\n").map(s=>s.trim()).filter(Boolean);
    const ios=os==="ios";
    q(root,"#rnph").style.borderRadius=ios?"38px":"22px";
    q(root,"#rnph").innerHTML=`<div class="sb2"><span>${ios?"9:41":"09:41"}</span><span>${ios?"􀙇 100%":"▼◢ 100%"}</span></div><div class="ab2" style="background:${ios?"#fff":c};color:${ios?"#111":"#fff"};text-align:${ios?"center":"left"};border-bottom:${ios?"1px solid #ddd":"0"};font-size:${ios?"17px":"19px"}">${esc(t)}</div><div class="bd">${items.map((it,i)=>`<label style="display:flex;gap:8px;align-items:center;padding:8px;border-radius:${ios?"12px":"4px"};background:${ios?"#f2f2f7":"#fff"};box-shadow:${ios?"none":"0 1px 3px rgba(0,0,0,.2)"}"><input type="checkbox" data-it="${i}" ${done.has(i)?"checked":""} style="accent-color:${c}"><span style="${done.has(i)?"text-decoration:line-through;color:#888":""}">${esc(it)}</span></label>`).join("")}<button style="margin-top:6px;border:0;border-radius:${ios?"12px":"24px"};padding:10px;background:${c};color:#fff;font-weight:700">${ios?"Adicionar":"ADICIONAR"}</button></div>`;
    q(root,"#rncode").textContent=`export default function App() {\n  const [feitas, setFeitas] = useState([]);\n  return (\n    <View style={{ flex: 1 }}>\n      <Text style={styles.titulo}>${t}</Text>\n      <FlatList\n        data={${JSON.stringify(items.slice(0,3))}}\n        renderItem={({ item }) => <Checkbox label={item} />}\n      />\n      <Button title="Adicionar" color="${c}" />\n    </View>\n  );\n}`;
    q(root,"#rnlog").textContent=`Expo Go · recarregou ${++n}× · ${ios?"iOS":"Android"}`; }
  root.addEventListener("input", draw);
  root.addEventListener("change", e=>{ if(e.target.dataset.it!==undefined){ const i=+e.target.dataset.it; done.has(i)?done.delete(i):done.add(i); draw(); } });
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-os]"); if(b){ os=b.dataset.os; qa(root,"[data-os]").forEach(x=>x.setAttribute("aria-pressed",x===b)); draw(); } });
  draw();
 }});

const FW = {Text:{p:"texto",d:"Olá, turma!"},ElevatedButton:{p:"texto",d:"Começar"},Icon:{p:"ícone",d:"⭐"},Image:{p:"legenda",d:"Foto do laboratório"},TextField:{p:"dica",d:"Digite seu nome"}};
lab({id:"flutter", tr:"apps", area:"sw", title:"Flutter: tudo é widget",
 blurb:"Monte a tela juntando widgets dentro de uma Column ou Row, mude o alinhamento e veja a árvore de widgets e o código Dart.",
 learn:["No Flutter, cada pedaço da tela é um widget, até o espaçamento.","Widgets ficam uns dentro dos outros, formando uma árvore.","Column empilha na vertical; Row coloca lado a lado."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px"><div class="row wrap"><label class="f inline" for="flay">Layout <select id="flay"><option>Column</option><option>Row</option></select></label><label class="f inline" for="falign">Alinhamento <select id="falign"><option value="start">start</option><option value="center" selected>center</option><option value="spaceBetween">spaceBetween</option><option value="end">end</option></select></label></div>
 <div class="row wrap"><select id="fadd" aria-label="Widget">${Object.keys(FW).map(k=>`<option>${k}</option>`).join("")}</select><input id="fval" placeholder="conteúdo" aria-label="Conteúdo do widget" style="width:12em"><button class="btn sm" id="faddb">Adicionar widget</button></div>
 <div class="k">Árvore de widgets</div><div class="ftree" id="ftree"></div><div class="k">main.dart</div><pre class="console small" id="fcode"></pre></div>
 <div><div class="phone2"><div class="sb2"><span>09:41</span><span>📶 🔋</span></div><div class="ab2" style="background:#0175C2">Minha escola</div><div class="bd" id="fbody" style="min-height:300px"></div></div></div></div>`,
 mount(root){
  let kids=[["Text","Bem-vindo ao Lab!"],["Icon","🤖"],["ElevatedButton","Começar"]];
  function draw(){ const lay=q(root,"#flay").value, al=q(root,"#falign").value, jc={start:"flex-start",center:"center",spaceBetween:"space-between",end:"flex-end"}[al];
    q(root,"#fbody").innerHTML=`<div style="display:flex;flex-direction:${lay==="Column"?"column":"row"};justify-content:${jc};align-items:center;gap:10px;min-height:280px;flex-wrap:wrap">${kids.map(([t,v])=>({Text:`<span style="font-size:18px">${esc(v)}</span>`,ElevatedButton:`<button style="border:0;border-radius:20px;padding:8px 16px;background:#0175C2;color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.3)">${esc(v)}</button>`,Icon:`<span style="font-size:30px">${esc(v)}</span>`,Image:`<div style="width:120px;height:70px;background:#cfd8dc;border-radius:8px;display:grid;place-items:center;font-size:11px">🖼 ${esc(v)}</div>`,TextField:`<input placeholder="${esc(v)}" style="border:0;border-bottom:2px solid #0175C2;padding:6px;width:140px">`})[t]).join("")}</div>`;
    q(root,"#ftree").innerHTML=`<div class="fnode">MaterialApp › Scaffold</div><div class="fnode" style="margin-left:16px">body: ${lay}(mainAxisAlignment: ${al})</div>`+kids.map(([t,v],i)=>`<div class="fnode" style="margin-left:32px"><span>${t}("${esc(v)}")</span><span><button class="linkbtn" data-up="${i}">↑</button> <button class="linkbtn" data-del="${i}">remover</button></span></div>`).join("");
    const dart=kids.map(([t,v])=>({Text:`Text("${v}")`,ElevatedButton:`ElevatedButton(onPressed: () {}, child: Text("${v}"))`,Icon:`Icon(Icons.star)  // ${v}`,Image:`Image.asset("lab.png")  // ${v}`,TextField:`TextField(decoration: InputDecoration(hintText: "${v}"))`})[t]);
    q(root,"#fcode").textContent=`Scaffold(\n  appBar: AppBar(title: Text("Minha escola")),\n  body: ${lay}(\n    mainAxisAlignment: MainAxisAlignment.${al},\n    children: [\n${dart.map(d=>"      "+d+",").join("\n")}\n    ],\n  ),\n)`; }
  root.addEventListener("change", draw);
  root.addEventListener("click", e=>{ if(e.target.id==="faddb"){ const t=q(root,"#fadd").value; kids.push([t,q(root,"#fval").value.trim()||FW[t].d]); q(root,"#fval").value=""; draw(); }
    const d=e.target.closest("[data-del]"); if(d){ kids.splice(+d.dataset.del,1); draw(); } const u=e.target.closest("[data-up]"); if(u){ const i=+u.dataset.up; if(i>0){ [kids[i-1],kids[i]]=[kids[i],kids[i-1]]; draw(); } } });
  draw();
 }});

lab({id:"planner", tr:"apps", area:"sw", title:"Planejador do seu projeto real",
 blurb:"Transforme uma ideia em plano: problema, usuários, funcionalidades priorizadas, telas e dados. O site gera o documento do projeto e os rascunhos das telas.",
 learn:["Projeto bom começa pelo problema e por quem vai usar, não pela tecnologia.","Priorize: primeiro o essencial (MVP), depois o desejável.","Rascunhar as telas antes de programar economiza semanas."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px">
 <label class="f" for="pjn">Nome do projeto<input id="pjn"></label><label class="f" for="pjp">Qual problema ele resolve?<textarea id="pjp" style="min-height:60px"></textarea></label><label class="f" for="pju">Quem vai usar?<input id="pju"></label>
 <label class="f" for="pjm">Essencial (uma funcionalidade por linha)<textarea id="pjm" style="min-height:70px"></textarea></label><label class="f" for="pjs">Desejável (depois do essencial)<textarea id="pjs" style="min-height:50px"></textarea></label>
 <label class="f" for="pjt">Telas (uma por linha)<textarea id="pjt" style="min-height:60px"></textarea></label><label class="f" for="pjd">Dados que o sistema guarda (uma por linha)<textarea id="pjd" style="min-height:50px"></textarea></label>
 <label class="f" for="pjk">Tecnologia<select id="pjk"><option>Google Apps Script + Planilhas</option><option>HTML, CSS e JavaScript + Supabase</option><option>React + FastAPI + PostgreSQL</option><option>App Inventor</option><option>React Native (Expo) + Supabase</option></select></label>
 <div class="row wrap"><button class="btn ghost sm" id="pjex">Preencher com um exemplo</button><button class="btn ghost sm" id="pjclr">Limpar</button></div></div>
 <div class="grid" style="gap:8px"><div class="k">Rascunho das telas</div><div class="wire" id="pjw"></div><div class="readout"><div><span class="k">Funcionalidades essenciais</span><b id="pjc">0</b></div><div><span class="k">Estimativa do MVP</span><b id="pje">–</b></div></div>
 <div class="k">Documento do projeto (Markdown)</div><textarea id="pjmd" readonly class="mono" style="min-height:220px;font-size:12px"></textarea><button class="btn ghost sm" id="pjcopy">Copiar documento</button><p class="small muted">Fica salvo neste navegador. Cole no README do repositório do projeto.</p></div></div>`,
 mount(root){
  const F=["pjn","pjp","pju","pjm","pjs","pjt","pjd","pjk"];
  const EX={pjn:"Empréstimo de Kits",pjp:"Os kits de robótica somem ou voltam incompletos e ninguém sabe quem pegou.",pju:"Professores e técnico do laboratório",pjm:"Registrar empréstimo (kit, professor, data)\nRegistrar devolução e itens faltando\nVer kits disponíveis agora",pjs:"Avisar por e-mail quando atrasar\nRelatório mensal de uso",pjt:"Início: kits disponíveis\nNovo empréstimo\nDevolução\nHistórico",pjd:"kits (id, nome, itens)\nemprestimos (kit, professor, saída, volta)\nprofessores (nome, e-mail)",pjk:"Google Apps Script + Planilhas"};
  const saved=ls.get("pp-planner",{}); F.forEach(k=>{ if(saved[k]!==undefined) q(root,"#"+k).value=saved[k]; });
  const lines=k=>q(root,"#"+k).value.split("\n").map(s=>s.trim()).filter(Boolean);
  function draw(){ const v=Object.fromEntries(F.map(k=>[k,q(root,"#"+k).value])); ls.set("pp-planner",v);
    const must=lines("pjm"), should=lines("pjs"), tel=lines("pjt"), dat=lines("pjd"); const weeks=Math.max(1,Math.round(must.length*1.5+tel.length*0.5));
    q(root,"#pjc").textContent=must.length; q(root,"#pje").textContent=must.length?`~${weeks} semana${weeks>1?"s":""}`:"–";
    q(root,"#pjw").innerHTML=tel.map((t,i)=>`<div class="wf"><b>${esc(t)}</b><i style="width:70%"></i><i></i><i style="width:50%"></i>${i===0?'<i style="height:24px;background:var(--accent-soft)"></i>':'<i style="height:18px;width:60%;background:var(--accent)"></i>'}</div>`).join("")||'<p class="small muted">Liste as telas para ver os rascunhos.</p>';
    q(root,"#pjmd").value=`# ${v.pjn||"Meu projeto"}\n\n## Problema\n${v.pjp||"-"}\n\n## Quem usa\n${v.pju||"-"}\n\n## MVP (essencial)\n${must.map(x=>"- [ ] "+x).join("\n")||"-"}\n\n## Depois do MVP\n${should.map(x=>"- "+x).join("\n")||"-"}\n\n## Telas\n${tel.map((x,i)=>`${i+1}. ${x}`).join("\n")||"-"}\n\n## Dados\n${dat.map(x=>"- "+x).join("\n")||"-"}\n\n## Tecnologia\n${v.pjk}\n\n## Estimativa do MVP\n~${weeks} semanas, no ritmo da rotina de estudos.\n`; }
  root.addEventListener("input", draw); root.addEventListener("change", draw);
  root.addEventListener("click", async e=>{ if(e.target.id==="pjex"){ F.forEach(k=>q(root,"#"+k).value=EX[k]); draw(); } if(e.target.id==="pjclr"){ F.forEach(k=>{ if(k!=="pjk") q(root,"#"+k).value=""; }); draw(); }
    if(e.target.id==="pjcopy"){ try{ await navigator.clipboard.writeText(q(root,"#pjmd").value); toast("Copiado"); }catch(err){ q(root,"#pjmd").select(); toast("Selecionei o texto: copie com Cmd+C"); } } });
  draw();
 }});

lab({id:"linebot", tr:"maker", area:"hw", title:"Robô seguidor de linha",
 blurb:"Um robô com dois sensores infravermelhos percorre a pista. Ajuste a velocidade e a força da curva até ele completar voltas sem sair da linha.",
 learn:["Cada sensor diz se está vendo a linha preta (1) ou o chão branco (0).","Se só o sensor da esquerda vê a linha, o robô vira para a esquerda, e vice-versa.","Velocidade demais nas curvas faz o robô sair: ajustar é engenharia."],
 html:()=>`<div class="two-even" style="margin-top:0;grid-template-columns:1.3fr 1fr"><canvas id="lbcv" class="cv2"></canvas>
 <div class="grid" style="gap:8px"><label class="f" for="lbv">Velocidade: <b id="lbvv"></b><input type="range" id="lbv" min="1" max="10" value="4"></label><label class="f" for="lbk">Força da curva: <b id="lbkv"></b><input type="range" id="lbk" min="1" max="10" value="5"></label><label class="f" for="lbs">Distância entre os sensores: <b id="lbsv"></b><input type="range" id="lbs" min="4" max="20" value="10"></label>
 <div class="row wrap"><button class="btn" id="lbgo">▶ Ligar robô</button><button class="btn ghost sm" id="lbrst">Voltar ao início</button></div>
 <div class="readout"><div><span class="k">Sensores E · D</span><b id="lbsen">0 · 0</b></div><div><span class="k">Voltas</span><b id="lblap">0</b></div><div><span class="k">Saídas da pista</span><b id="lbout">0</b></div></div><div class="note small" id="lbnote">Ligue o robô e observe as curvas.</div></div></div>
 <div class="k">Código Arduino equivalente</div><pre class="console small" id="lbcode"></pre>`,
 mount(root){
  const W=520,H=340,c=setupCanvas(q(root,"#lbcv"),W,H);
  const P=[]; for(let t=0;t<Math.PI*2;t+=0.02){ const r=1+0.28*Math.sin(3*t); P.push([W/2+Math.cos(t)*190*r*0.95, H/2+Math.sin(t)*115*r]); }
  const LP=P.reduce((a,p,i)=>a+Math.hypot(P[(i+1)%P.length][0]-p[0],P[(i+1)%P.length][1]-p[1]),0);
  function dist(x,y){ let m=1e9; for(let i=0;i<P.length;i++){ const a=P[i], b=P[(i+1)%P.length]; const dx=b[0]-a[0], dy=b[1]-a[1], t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy))); const d=Math.hypot(x-a[0]-t*dx, y-a[1]-t*dy); if(d<m) m=d; } return m; }
  let R, running=false, laps=0, outs=0, lastTurn=0, prog=0, tm=null;
  function reset(){ const a=P[0], b=P[3]; R={x:a[0],y:a[1],th:Math.atan2(b[1]-a[1],b[0]-a[0])}; laps=0; prog=0; draw([0,0]); upd(); }
  function sensors(){ const s=+q(root,"#lbs").value, f=14; const pts=[-1,1].map(k=>[R.x+Math.cos(R.th)*f+Math.cos(R.th+Math.PI/2)*k*s/2, R.y+Math.sin(R.th)*f+Math.sin(R.th+Math.PI/2)*k*s/2]); return pts.map(([x,y])=>({x,y,on:dist(x,y)<6?1:0})); }
  function draw(sn){ c.clearRect(0,0,W,H); c.fillStyle="#f7f7f2"; c.fillRect(0,0,W,H); c.beginPath(); P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); c.strokeStyle="#111"; c.lineWidth=10; c.stroke();
    c.save(); c.translate(R.x,R.y); c.rotate(R.th); c.fillStyle="#2747C7"; c.fillRect(-14,-11,24,22); c.fillStyle="#222"; c.fillRect(-10,-14,12,4); c.fillRect(-10,10,12,4); c.restore();
    const s=sensors(); s.forEach(p=>{ c.beginPath(); c.arc(p.x,p.y,4,0,7); c.fillStyle=p.on?"#ff3b30":"#9aa3b2"; c.fill(); }); return s; }
  function upd(){ q(root,"#lbvv").textContent=q(root,"#lbv").value; q(root,"#lbkv").textContent=q(root,"#lbk").value; q(root,"#lbsv").textContent=q(root,"#lbs").value+" mm";
    q(root,"#lbcode").textContent=`int velocidade = ${q(root,"#lbv").value*25};\nint curva = ${q(root,"#lbk").value*20};\n\nvoid loop() {\n  int esq = digitalRead(SENSOR_E);  // 1 = vê a linha preta\n  int dir = digitalRead(SENSOR_D);\n  if (esq && dir)      andar(velocidade, velocidade);\n  else if (esq)        andar(velocidade - curva, velocidade);   // vira à esquerda\n  else if (dir)        andar(velocidade, velocidade - curva);   // vira à direita\n  else                 continuarUltimaCurva();\n}`; }
  function step(){ const v=+q(root,"#lbv").value*0.55, k=+q(root,"#lbk").value*0.012; const s=sensors(); const [l,r]=[s[0].on,s[1].on];
    if(l&&!r){ R.th-=k*v; lastTurn=-1; } else if(r&&!l){ R.th+=k*v; lastTurn=1; } else if(!l&&!r){ R.th+=lastTurn*k*v*0.8; }
    R.x+=Math.cos(R.th)*v; R.y+=Math.sin(R.th)*v; const sn=draw(); q(root,"#lbsen").textContent=`${sn[0].on} · ${sn[1].on}`;
    prog+=v; if(prog>LP){ prog=0; laps++; q(root,"#lblap").textContent=laps; q(root,"#lbnote").textContent=`Volta ${laps} completa! Tente aumentar a velocidade sem sair da pista.`; }
    if(dist(R.x,R.y)>40||R.x<0||R.y<0||R.x>W||R.y>H){ outs++; q(root,"#lbout").textContent=outs; stop(); q(root,"#lbnote").textContent= +q(root,"#lbv").value>6 ? "Saiu da pista! Rápido demais para a curva: diminua a velocidade ou aumente a força da curva." : "Saiu da pista! Aumente a força da curva ou aproxime os sensores."; } }
  function stop(){ running=false; clearInterval(tm); q(root,"#lbgo").textContent="▶ Ligar robô"; }
  root.addEventListener("input", upd);
  root.addEventListener("click", e=>{ if(e.target.id==="lbgo"){ if(running) stop(); else { if(dist(R.x,R.y)>40) reset(); running=true; e.target.textContent="❚❚ Desligar"; tm=labEvery(step,30); } } if(e.target.id==="lbrst"){ stop(); reset(); } });
  reset();
 }});

lab({id:"esp32", tr:"maker", area:"hw", title:"ESP32: sensor enviando dados para a internet",
 blurb:"Um ESP32 com sensor de temperatura e umidade publica leituras pelo Wi-Fi e um painel online mostra tudo em tempo real. Corte o Wi-Fi e veja o que acontece.",
 learn:["O ESP32 é um microcontrolador com Wi-Fi: ideal para Internet das Coisas.","Ele publica leituras num servidor (por HTTP ou MQTT) a cada intervalo.","Guardar leituras quando a rede cai evita perder dados."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px"><div class="row wrap"><label class="chk inline" for="eswifi"><input type="checkbox" id="eswifi" checked><span>Wi-Fi conectado</span></label><label class="chk inline" for="esbuf"><input type="checkbox" id="esbuf"><span>Guardar leituras sem rede</span></label></div>
 <label class="f" for="estemp">Temperatura real na sala: <b id="estv"></b><input type="range" id="estemp" min="10" max="40" value="24"></label><label class="f" for="esint">Enviar a cada <b id="esiv"></b><input type="range" id="esint" min="1" max="5" value="2"></label><label class="f" for="eslim">Alerta acima de <b id="eslv"></b><input type="range" id="eslim" min="20" max="38" value="30"></label>
 <div class="row wrap"><span class="pill" id="esled">LED do ESP32</span><span class="pill l" id="esbufn">0 leituras guardadas</span></div><pre class="console small" id="eslog" style="min-height:120px;max-height:160px"></pre></div>
 <div class="grid" style="gap:8px"><div class="site"><div class="bar2">painel.escola.com · Estação do Laboratório</div><div class="body"><canvas id="escv" class="cv2"></canvas><div class="readout" style="margin-top:8px"><div><span class="k">Temperatura</span><b id="est">–</b></div><div><span class="k">Umidade</span><b id="esh">–</b></div><div><span class="k">Última leitura</span><b id="esl" style="font-size:14px">–</b></div></div><div id="esalert"></div></div></div>
 <div class="k">Código do ESP32 (Arduino)</div><pre class="console small">#include &lt;WiFi.h&gt;
#include &lt;DHT.h&gt;
DHT dht(4, DHT22);

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (WiFi.status() == WL_CONNECTED) {
    enviar("/leituras", t, h);   // HTTP POST
  } else {
    guardarNaMemoria(t, h);      // envia quando a rede voltar
  }
  delay(INTERVALO);
}</pre></div></div>`,
 mount(root){
  const W=420,H=150,c=setupCanvas(q(root,"#escv"),W,H); let data=[], buf=[], tick=0, hum=55;
  const log=s=>logTo(q(root,"#eslog"),s);
  function chart(){ c.clearRect(0,0,W,H); c.strokeStyle=css("--line"); c.fillStyle=css("--muted"); c.font="10px system-ui"; [10,20,30,40].forEach(v=>{ const y=H-10-(v-10)/30*(H-20); c.beginPath(); c.moveTo(24,y); c.lineTo(W-4,y); c.stroke(); c.fillText(v+"°",2,y+3); });
    const lim=+q(root,"#eslim").value, yl=H-10-(lim-10)/30*(H-20); c.setLineDash([4,4]); c.strokeStyle=css("--warn"); c.beginPath(); c.moveTo(24,yl); c.lineTo(W-4,yl); c.stroke(); c.setLineDash([]);
    const pts=data.slice(-40); c.beginPath(); pts.forEach((d,i)=>{ const x=24+i*(W-30)/39, y=H-10-(d.t-10)/30*(H-20); if(d.gap){ c.stroke(); c.beginPath(); c.moveTo(x,y); } else i?c.lineTo(x,y):c.moveTo(x,y); }); c.strokeStyle=css("--accent"); c.lineWidth=2.5; c.stroke(); }
  labEvery(()=>{ tick++; q(root,"#estv").textContent=q(root,"#estemp").value+" °C"; q(root,"#esiv").textContent=q(root,"#esint").value+" s"; q(root,"#eslv").textContent=q(root,"#eslim").value+" °C";
    if(tick % (+q(root,"#esint").value*2)) return;
    const t=Math.round((+q(root,"#estemp").value + (Math.random()-.5)*0.8)*10)/10; hum=Math.max(30,Math.min(90,hum+(Math.random()-.5)*3)); const h=Math.round(hum);
    const hh=new Date().toLocaleTimeString("pt-BR"); const wifi=q(root,"#eswifi").checked;
    q(root,"#esled").style.background=wifi?"var(--ok)":"var(--warn)"; q(root,"#esled").style.color="#fff"; q(root,"#esled").textContent=wifi?"Wi-Fi ✓ enviando":"sem Wi-Fi";
    if(wifi){ if(buf.length){ log(`Rede voltou: enviando ${buf.length} leituras guardadas`); data=data.concat(buf); buf=[]; } data.push({t,h}); log(`[${hh}] POST /leituras {temp: ${t}, umid: ${h}} → 201`);
      q(root,"#est").textContent=t+" °C"; q(root,"#esh").textContent=h+"%"; q(root,"#esl").textContent=hh;
      q(root,"#esalert").innerHTML= t>+q(root,"#eslim").value ? `<div class="note" style="margin-top:8px"><b class="warntext">Alerta:</b> ${t} °C no laboratório. Notificação enviada ao professor.</div>` : ""; }
    else if(q(root,"#esbuf").checked){ buf.push({t,h}); log(`[${hh}] sem rede: leitura guardada na memória (${buf.length})`); }
    else { data.push({t,h,gap:1}); log(`[${hh}] sem rede: leitura PERDIDA`); }
    q(root,"#esbufn").textContent=`${buf.length} leituras guardadas`; chart(); }, 500);
  chart();
 }});

lab({id:"rpi", tr:"maker", area:"hw", title:"Raspberry Pi: Linux e os pinos GPIO",
 blurb:"Um Raspberry Pi com um LED no GPIO17 e um botão no GPIO27. Use o terminal Linux para rodar scripts Python que controlam o hardware.",
 learn:["O Raspberry Pi é um computador completo com Linux, do tamanho de um cartão.","Os pinos GPIO ligam e leem componentes eletrônicos, como no Arduino.","Você programa em Python, direto no terminal."],
 html:()=>`<div class="two-even" style="margin-top:0;grid-template-columns:1.3fr 1fr"><div class="term2" id="rpbox" style="min-height:300px"><div id="rpout"></div><div><span class="pr">pi@raspberrypi:~ $</span> <input id="rpin" aria-label="Comando" autocomplete="off" spellcheck="false"></div></div>
 <div class="grid" style="gap:10px"><svg viewBox="0 0 220 160" style="width:100%;background:#0b6e3c;border-radius:12px"><rect x="10" y="10" width="200" height="16" rx="3" fill="#222"/><text x="14" y="42" fill="#cfe" font-size="10">GPIO (40 pinos)</text><rect x="70" y="60" width="50" height="50" fill="#333"/><text x="74" y="90" fill="#fff" font-size="9">BCM2712</text>
 <line x1="160" y1="26" x2="160" y2="80" stroke="#ddd" stroke-width="2"/><circle cx="160" cy="95" r="14" id="rpled" fill="#550000" stroke="#111"/><text x="140" y="125" fill="#fff" font-size="10">LED · GPIO17</text>
 <line x1="190" y1="26" x2="190" y2="60" stroke="#ddd" stroke-width="2"/><rect x="178" y="130" width="24" height="18" rx="4" fill="#111" id="rpbtnv"/><text x="150" y="160" fill="#fff" font-size="9">botão · GPIO27</text></svg>
 <button class="btn ghost" id="rpbtn">Segurar o botão físico</button><div class="note small">Experimente: <code>ls</code>, <code>cat led.py</code>, <code>python3 led.py</code>, <code>python3 botao.py</code>, <code>pinout</code>, <code>raspi-gpio set 17 dh</code>, <code>sudo apt update</code>.</div></div></div>`,
 mount(root){
  const FILES={"led.py":"from gpiozero import LED\nfrom time import sleep\n\nled = LED(17)\nfor i in range(5):\n    led.on()\n    sleep(0.5)\n    led.off()\n    sleep(0.5)\nprint(\"Pronto!\")","botao.py":"from gpiozero import LED, Button\nfrom signal import pause\n\nled = LED(17)\nbotao = Button(27)\nbotao.when_pressed = led.on\nbotao.when_released = led.off\nprint(\"Aperte o botão (Ctrl+C para sair)\")\npause()"};
  let led=false, btnScript=false, pressed=false, busy=false;
  const out=(t,cls)=>{ const d=document.createElement("div"); if(cls) d.className=cls; d.innerHTML=t; q(root,"#rpout").appendChild(d); q(root,"#rpbox").scrollTop=1e9; };
  const setLed=v=>{ led=v; q(root,"#rpled").setAttribute("fill",v?"#ff3b30":"#550000"); q(root,"#rpled").style.filter=v?"drop-shadow(0 0 8px #ff3b30)":""; };
  async function run(cmd){ out(`<span class="pr">pi@raspberrypi:~ $</span> ${esc(cmd)}`); const [c0,...a]=cmd.trim().split(/\s+/);
    if(btnScript && cmd!=="^C"){ out("(o botao.py ainda está rodando: digite ^C para parar)","err"); return; }
    if(cmd==="^C"){ if(btnScript){ btnScript=false; setLed(false); out("KeyboardInterrupt"); } return; }
    if(c0==="ls") out(Object.keys(FILES).map(f=>`<span>${f}</span>`).join("   ")+'   <span class="dir">Desktop/</span>');
    else if(c0==="cat"){ if(FILES[a[0]]) out(esc(FILES[a[0]]).replace(/\n/g,"<br>")); else out("cat: arquivo não encontrado","err"); }
    else if(c0==="python3"&&a[0]==="led.py"){ busy=true; for(let i=0;i<5;i++){ setLed(true); await wait(500); setLed(false); await wait(500); } out("Pronto!"); busy=false; }
    else if(c0==="python3"&&a[0]==="botao.py"){ btnScript=true; out("Aperte o botão (Ctrl+C para sair)"); }
    else if(c0==="pinout") out("3V3 (1) (2) 5V<br>GPIO2 (3) (4) 5V<br>GPIO3 (5) (6) GND<br>GPIO4 (7) (8) GPIO14<br>GND (9) (10) GPIO15<br><b>GPIO17 (11)</b> (12) GPIO18<br><b>GPIO27 (13)</b> (14) GND<br>… 40 pinos no total");
    else if(c0==="raspi-gpio"&&a[0]==="set"&&a[1]==="17"){ setLed(a[2]==="dh"); out(`GPIO17 = ${a[2]==="dh"?"1 (ligado)":"0 (desligado)"}`); }
    else if(c0==="raspi-gpio"&&a[0]==="get") out(`GPIO17: level=${led?1:0} fsel=1 (saída)<br>GPIO27: level=${pressed?0:1} fsel=0 (entrada, pull-up)`);
    else if(c0==="sudo"&&a[0]==="apt"){ out("Lendo listas de pacotes… Pronto"); out("Todos os pacotes estão atualizados."); }
    else if(c0==="uname") out("Linux raspberrypi 6.6 aarch64 GNU/Linux");
    else if(c0==="help") out("ls · cat ARQUIVO · python3 led.py · python3 botao.py · pinout · raspi-gpio set 17 dh|dl · raspi-gpio get · sudo apt update · uname -a · ^C");
    else if(c0) out(`bash: ${esc(c0)}: comando não encontrado (digite help)`,"err"); }
  root.addEventListener("keydown", async e=>{ if(e.target.id==="rpin"&&e.key==="Enter"&&!busy){ const v=e.target.value; e.target.value=""; await run(v); } if(e.target.id==="rpin"&&e.key==="c"&&e.ctrlKey){ e.preventDefault(); run("^C"); } });
  const press=v=>{ pressed=v; q(root,"#rpbtnv").setAttribute("fill",v?"#f5d547":"#111"); if(btnScript) setLed(v); };
  const b=q(root,"#rpbtn"); b.addEventListener("pointerdown",()=>press(true)); b.addEventListener("pointerup",()=>press(false)); b.addEventListener("pointerleave",()=>press(false));
  root.addEventListener("click", e=>{ if(e.target.closest("#rpbox")) q(root,"#rpin").focus(); });
  out("Raspberry Pi OS · digite <b>help</b> para ver os comandos");
 }});

const PARTS = {
 placa:{n:"Placa",o:[["Arduino Uno",25,45,60],["ESP32",10,40,50]]},
 motor:{n:"Motores (2×)",o:[["Motor TT com redução",2*30,2*200,2*15],["Micro motor N20",2*10,2*120,2*35]]},
 driver:{n:"Driver de motor",o:[["L298N",30,15,20],["TB6612FNG",3,10,25]]},
 sensor:{n:"Sensores",o:[["2 sensores de linha IR",4,40,12],["Ultrassônico HC-SR04",9,15,10],["IR + ultrassônico",13,55,22]]},
 bat:{n:"Bateria",o:[["4 pilhas AA (6 V, 2000 mAh)",100,0,25],["2 baterias 18650 (7,4 V, 2500 mAh)",95,0,60],["Power bank USB (5 V, 5000 mAh)",120,0,50]]},
 chassi:{n:"Chassi impresso",o:[["PLA, 20% preenchimento",60,0,8],["PETG, 30% preenchimento",75,0,12]]}};
lab({id:"robot", tr:"maker", area:"hw", title:"Projeto de robô completo",
 blurb:"Escolha placa, motores, driver, sensores, bateria e o chassi que você vai imprimir na Bambu Lab. O simulador calcula peso, consumo, autonomia e custo, e gera a lista de compras.",
 learn:["Projeto de robô é escolher peças que funcionam juntas: tensão, corrente e peso.","Autonomia = capacidade da bateria ÷ consumo total.","Documentar a lista de materiais (BOM) é parte do projeto."],
 html:()=>`<div class="two-even" style="margin-top:0"><div class="grid" style="gap:8px">${Object.entries(PARTS).map(([k,p])=>`<label class="f" for="rb-${k}">${p.n}<select id="rb-${k}">${p.o.map((o,i)=>`<option value="${i}">${o[0]}</option>`).join("")}</select></label>`).join("")}</div>
 <div class="grid" style="gap:8px"><div class="readout"><div><span class="k">Peso total</span><b id="rbw"></b></div><div><span class="k">Consumo</span><b id="rbc"></b></div><div><span class="k">Autonomia</span><b id="rba"></b></div><div><span class="k">Custo estimado</span><b id="rbr"></b></div></div><div id="rbwarn"></div>
 <div class="k">Lista de materiais (BOM)</div><div class="tablewrap"><table class="bom" id="rbbom"></table></div><p class="small muted">Preços aproximados de lojas de eletrônica no Brasil, só para comparar opções.</p></div></div>
 <div class="k">Etapas de construção</div><ol class="rules" id="rbsteps"></ol>`,
 mount(root){
  function draw(){ const sel=Object.fromEntries(Object.keys(PARTS).map(k=>[k,PARTS[k].o[+q(root,"#rb-"+k).value]]));
    const w=Object.values(sel).reduce((a,o)=>a+o[1],0)+30, ma=Object.values(sel).reduce((a,o)=>a+o[2],0), cost=Object.values(sel).reduce((a,o)=>a+o[3],0);
    const mah={0:2000,1:2500,2:5000}[+q(root,"#rb-bat").value]; const hrs=mah/ma*0.7;
    q(root,"#rbw").textContent=w+" g"; q(root,"#rbc").textContent=ma+" mA"; q(root,"#rba").textContent=hrs>=1?hrs.toFixed(1).replace(".",",")+" h":Math.round(hrs*60)+" min"; q(root,"#rbr").textContent="R$ "+cost;
    const warns=[]; if(sel.driver[0]==="L298N") warns.push("O L298N perde cerca de 2 V internamente: com 4 pilhas, os motores recebem só uns 4 V e ficam fracos."); if(sel.bat[0].startsWith("Power bank")&&sel.motor[0].startsWith("Motor TT")) warns.push("Power banks desligam sozinhos com picos de corrente dos motores. Teste antes."); if(sel.placa[0]==="ESP32") warns.push("O ESP32 trabalha com 3,3 V: confira se os sensores aceitam esse nível."); if(w>400) warns.push("Robô pesado: motores N20 podem não dar conta.");
    q(root,"#rbwarn").innerHTML=warns.map(x=>`<div class="note small" style="margin-top:6px">⚠ ${esc(x)}</div>`).join("")||'<div class="note small">Combinação equilibrada.</div>';
    q(root,"#rbbom").innerHTML=`<thead><tr><th>Peça</th><th>Escolha</th><th>Peso</th><th>R$</th></tr></thead><tbody>${Object.entries(sel).map(([k,o])=>`<tr><td>${PARTS[k].n}</td><td>${esc(o[0])}</td><td>${o[1]} g</td><td>${o[3]}</td></tr>`).join("")}<tr><td>Fios, rodas, parafusos</td><td>-</td><td>30 g</td><td>-</td></tr></tbody>`;
    q(root,"#rbsteps").innerHTML=[`Modelar o chassi no Onshape ou Fusion com furos para os motores e para a placa (simulação: CAD paramétrico).`,`Imprimir o chassi em ${sel.chassi[0].split(",")[0]} na Bambu Lab (cerca de 2 h).`,`Montar motores, rodas e ${sel.driver[0]}.`,`Ligar ${sel.sensor[0]} e testar cada sensor no monitor serial.`,`Programar o ${sel.placa[0]}: primeiro os motores, depois a lógica dos sensores.`,`Ajustar velocidade e curva na pista (simulação: robô seguidor de linha).`,`Documentar no GitHub com fotos, código e esta lista de materiais: evidência para o portfólio.`].map(s=>`<li>${esc(s)}</li>`).join(""); }
  root.addEventListener("change", draw); draw();
 }});

lab({id:"bezier", tr:"3d", area:"hw", title:"Curvas vetoriais para a máquina de corte",
 blurb:"Arraste os pontos de controle e veja como as curvas de Bézier formam um desenho vetorial. O código SVG e o caminho da lâmina aparecem na hora.",
 learn:["Desenho vetorial é feito de pontos e curvas, não de pixels: amplia sem perder qualidade.","Cada curva de Bézier tem 2 pontas e 2 alças que puxam a curva.","A máquina de corte segue esse caminho com a lâmina."],
 html:()=>`<div class="two-even" style="margin-top:0;grid-template-columns:1.2fr 1fr"><canvas id="bzcv" class="cv2" style="cursor:grab"></canvas><div class="grid" style="gap:8px">
 <div class="row wrap"><button class="btn ghost sm" data-shape="coracao">Coração</button><button class="btn ghost sm" data-shape="gota">Gota</button><button class="btn ghost sm" data-shape="folha">Folha</button></div>
 <label class="chk inline" for="bzh"><input type="checkbox" id="bzh" checked><span>Mostrar alças</span></label><button class="btn" id="bzcut">▶ Simular corte</button>
 <div class="readout"><div><span class="k">Comprimento do corte</span><b id="bzlen"></b></div><div><span class="k">Tempo estimado</span><b id="bztime"></b></div></div>
 <div class="k">SVG (cole no Inkscape ou no software da máquina)</div><textarea id="bzsvg" readonly class="mono" style="min-height:120px;font-size:11px"></textarea></div></div>`,
 mount(root){
  const W=420,H=360,c=setupCanvas(q(root,"#bzcv"),W,H);
  const SH={coracao:[[210,300],[110,230],[60,140],[120,90],[170,50],[210,90],[210,120],[210,90],[250,50],[300,90],[360,140],[310,230]],gota:[[210,320],[120,320],[120,220],[160,170],[190,130],[210,60],[210,60],[210,60],[230,130],[260,170],[300,220],[300,320]],folha:[[210,330],[90,280],[90,120],[210,40],[210,40],[210,40],[330,120],[330,280],[210,330],[210,330],[210,330],[210,330]]};
  let pts=SH.coracao.map(p=>[...p]), drag=-1, cutT=-1;
  const segs=()=>{ const s=[]; for(let i=0;i<pts.length;i+=3){ s.push([pts[i],pts[i+1],pts[i+2],pts[(i+3)%pts.length]]); } return s; };
  const bz=(a,b,cc,d,t)=>{ const u=1-t; return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*cc[0]+t*t*t*d[0], u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*cc[1]+t*t*t*d[1]]; };
  function length(){ let L=0; segs().forEach(([a,b,cc,d])=>{ let p=a; for(let t=0.05;t<=1.0001;t+=0.05){ const n=bz(a,b,cc,d,t); L+=Math.hypot(n[0]-p[0],n[1]-p[1]); p=n; } }); return L; }
  function svg(){ const r=v=>Math.round(v); let d=`M ${r(pts[0][0])} ${r(pts[0][1])}`; segs().forEach(([,b,cc,dd])=>{ d+=` C ${r(b[0])} ${r(b[1])}, ${r(cc[0])} ${r(cc[1])}, ${r(dd[0])} ${r(dd[1])}`; }); return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 360" width="105mm" height="90mm">\n  <path d="${d} Z" fill="none" stroke="red" stroke-width="0.5"/>\n</svg>`; }
  function draw(){ c.clearRect(0,0,W,H); c.strokeStyle=css("--line"); c.lineWidth=1; for(let x=0;x<W;x+=20){ c.beginPath(); c.moveTo(x,0); c.lineTo(x,H); c.stroke(); } for(let y=0;y<H;y+=20){ c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }
    c.beginPath(); c.moveTo(pts[0][0],pts[0][1]); segs().forEach(([,b,cc,d])=>c.bezierCurveTo(b[0],b[1],cc[0],cc[1],d[0],d[1])); c.closePath(); c.fillStyle=css("--accent")+"22"; c.fill(); c.strokeStyle=css("--ink"); c.lineWidth=2.5; c.stroke();
    if(q(root,"#bzh").checked){ segs().forEach(([a,b,cc,d])=>{ c.strokeStyle=css("--muted"); c.lineWidth=1; c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.moveTo(d[0],d[1]); c.lineTo(cc[0],cc[1]); c.stroke(); });
      pts.forEach((p,i)=>{ c.beginPath(); if(i%3===0){ c.rect(p[0]-5,p[1]-5,10,10); c.fillStyle=css("--accent"); } else { c.arc(p[0],p[1],5,0,7); c.fillStyle=css("--warn"); } c.fill(); }); }
    if(cutT>=0){ const S=segs(), n=S.length, k=Math.min(n-1,Math.floor(cutT*n)), t=cutT*n-k, p=bz(...S[k],Math.min(1,t)); c.beginPath(); c.arc(p[0],p[1],7,0,7); c.fillStyle="#c0392b"; c.fill(); }
    const L=length(), mm=L*0.25; q(root,"#bzlen").textContent=(mm/10).toFixed(1).replace(".",",")+" cm"; q(root,"#bztime").textContent=Math.max(1,Math.round(mm/20))+" s"; q(root,"#bzsvg").value=svg(); }
  const cv=q(root,"#bzcv"); const pos=e=>{ const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]; };
  cv.addEventListener("pointerdown", e=>{ const [x,y]=pos(e); drag=pts.findIndex(p=>Math.hypot(p[0]-x,p[1]-y)<12); if(drag>=0) cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", e=>{ if(drag<0) return; const [x,y]=pos(e); const dx=x-pts[drag][0], dy=y-pts[drag][1]; pts[drag]=[x,y]; if(drag%3===0){ const n=pts.length; [pts[(drag+1)%n],pts[(drag-1+n)%n]].forEach(h=>{ h[0]+=dx; h[1]+=dy; }); } draw(); });
  cv.addEventListener("pointerup", ()=>{ drag=-1; });
  root.addEventListener("change", draw);
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-shape]"); if(b){ pts=SH[b.dataset.shape].map(p=>[...p]); draw(); }
    if(e.target.id==="bzcut"){ cutT=0; const t=labEvery(()=>{ cutT+=0.008; if(cutT>=1){ cutT=-1; clearInterval(t); toast("Corte concluído"); } draw(); },30); } });
  draw();
 }});

function V(x,y,z){ return [x,y,z]; }
function box(w,d,h,ox=0,oy=0,oz=0){ const v=[]; for(const z of [0,h]) for(const y of [0,d]) for(const x of [0,w]) v.push(V(ox+x,oy+y,oz+z)); return {v, f:[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]]}; }
function cyl(r1,r2,h,n=24,ox=0,oy=0,oz=0){ const v=[]; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; v.push(V(ox+Math.cos(a)*r1,oy+Math.sin(a)*r1,oz)); } for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; v.push(V(ox+Math.cos(a)*r2,oy+Math.sin(a)*r2,oz+h)); }
  const f=[]; for(let i=0;i<n;i++){ const j=(i+1)%n; f.push(r2>0.001?[i,j,n+j,n+i]:[i,j,n+i]); } f.push([...Array(n).keys()].reverse()); if(r2>0.001) f.push([...Array(n).keys()].map(i=>n+i)); return {v,f}; }
function sphere(r,lat=10,ox=0,oy=0,oz=0){ const v=[], f=[], lon=lat*2; for(let i=0;i<=lat;i++){ const t=i/lat*Math.PI; for(let j=0;j<lon;j++){ const p=j/lon*Math.PI*2; v.push(V(ox+r*Math.sin(t)*Math.cos(p),oy+r*Math.sin(t)*Math.sin(p),oz+r*Math.cos(t))); } }
  for(let i=0;i<lat;i++) for(let j=0;j<lon;j++){ const a=i*lon+j, b=i*lon+(j+1)%lon, c2=(i+1)*lon+(j+1)%lon, d=(i+1)*lon+j; f.push([a,d,c2,b]); } return {v,f}; }
function torus(R,r,n=24,m=12){ const v=[],f=[]; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; for(let j=0;j<m;j++){ const b=j/m*Math.PI*2; v.push(V((R+r*Math.cos(b))*Math.cos(a),(R+r*Math.cos(b))*Math.sin(a),r*Math.sin(b))); } }
  for(let i=0;i<n;i++) for(let j=0;j<m;j++){ const a=i*m+j, b=((i+1)%n)*m+j, c2=((i+1)%n)*m+(j+1)%m, d=i*m+(j+1)%m; f.push([a,b,c2,d]); } return {v,f}; }
function hexrgb(h){ const x=h.replace("#",""); return [0,2,4].map(i=>parseInt(x.substr(i,2),16)); }
function render3d(c,W,H,items,cam,opt={}){
  c.clearRect(0,0,W,H); const cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
  const tr=p=>{ const x=p[0]-cam.cx, y=p[1]-cam.cy, z=p[2]-cam.cz; const x1=x*cy-y*sy, y1=x*sy+y*cy; const y2=y1*cp-z*sp, z2=y1*sp+z*cp; return [x1,y2,z2]; };
  const pr=p=>[W/2+p[0]*cam.zoom, H/2-p[2]*cam.zoom];
  const L=[0.4,-0.7,0.6], ln=Math.hypot(...L), Ln=L.map(x=>x/ln); const polys=[];
  items.forEach(it=>{ const tv=it.m.v.map(tr); it.m.f.forEach(face=>{ const P=face.map(i=>tv[i]); if(P.length<3) return; const a=P[0],b=P[1],d=P[P.length-1];
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]], w=[d[0]-a[0],d[1]-a[1],d[2]-a[2]]; let nx=u[1]*w[2]-u[2]*w[1], ny=u[2]*w[0]-u[0]*w[2], nz=u[0]*w[1]-u[1]*w[0]; const nl=Math.hypot(nx,ny,nz)||1; nx/=nl; ny/=nl; nz/=nl;
    const depth=P.reduce((s,p)=>s+p[1],0)/P.length; polys.push({P,depth,n:[nx,ny,nz],it}); }); });
  polys.sort((a,b)=>b.depth-a.depth);
  polys.forEach(({P,n,it})=>{ const S=P.map(pr); c.beginPath(); S.forEach((s,i)=>i?c.lineTo(s[0],s[1]):c.moveTo(s[0],s[1])); c.closePath();
    if(opt.faces!==false){ const lit=opt.flat?0.85:0.35+0.65*Math.abs(n[0]*Ln[0]+n[1]*Ln[1]+n[2]*Ln[2]); const [r,g,b]=hexrgb(it.color||"#2747C7"); c.fillStyle=`rgba(${r*lit|0},${g*lit|0},${b*lit|0},${it.alpha??1})`; c.fill(); }
    if(opt.edges||it.wire){ c.strokeStyle=it.wire?it.color:"rgba(0,0,0,.35)"; c.lineWidth=it.wire?1.5:0.8; c.stroke(); } });
  if(opt.verts) items.forEach(it=>it.m.v.map(tr).map(pr).forEach(s=>{ c.fillStyle="#f5d547"; c.fillRect(s[0]-2,s[1]-2,4,4); }));
}
function orbit(cv, cam, redraw){ let d=null; cv.addEventListener("pointerdown",e=>{ d=[e.clientX,e.clientY,cam.yaw,cam.pitch]; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove",e=>{ if(!d) return; cam.yaw=d[2]+(e.clientX-d[0])*0.01; cam.pitch=Math.max(-1.4,Math.min(1.4,d[3]+(e.clientY-d[1])*0.01)); redraw(); });
  cv.addEventListener("pointerup",()=>{ d=null; }); cv.addEventListener("wheel",e=>{ e.preventDefault(); cam.zoom*=e.deltaY<0?1.1:0.9; redraw(); },{passive:false}); }

lab({id:"param", tr:"3d", area:"hw", title:"CAD paramétrico: a caixa que se ajusta",
 blurb:"Uma caixa para Arduino definida por medidas. Mude um parâmetro e o modelo inteiro se refaz, como no Onshape e no Fusion. Arraste para girar.",
 learn:["No CAD paramétrico, o modelo é uma receita de medidas e operações.","Mudar uma medida refaz todas as etapas automaticamente.","Pense nas tolerâncias: peças impressas precisam de folga para encaixar."],
 html:()=>`<div class="two-even" style="margin-top:0;grid-template-columns:1.2fr 1fr"><canvas id="pmcv" class="cv2" style="cursor:grab"></canvas><div class="grid" style="gap:6px">
 ${[["pw","Largura interna",68,30,120,"mm"],["pd","Profundidade interna",53,30,120,"mm"],["ph","Altura",25,10,60,"mm"],["pt","Espessura da parede",2,0.8,4,"mm"],["pf","Folga para a placa",0.4,0,1.5,"mm"],["pu","Furo para USB",12,0,20,"mm"]].map(([id,l,v,a,b,u])=>`<label class="f" for="${id}">${l}: <b id="${id}v"></b><input type="range" id="${id}" min="${a}" max="${b}" step="${b>10?1:0.1}" value="${v}" data-u="${u}"></label>`).join("")}
 <div class="filters" role="group" aria-label="Predefinição"><button data-pre="uno">Arduino Uno</button><button data-pre="mb">micro:bit</button><button data-pre="esp">ESP32</button></div>
 <div class="k">Histórico de operações</div><ol class="plain small" id="pmhist"></ol><div class="readout"><div><span class="k">Volume de plástico</span><b id="pmvol"></b></div><div><span class="k">Filamento</span><b id="pmg"></b></div></div><div id="pmwarn"></div></div></div>`,
 mount(root){
  const W=440,H=360,c=setupCanvas(q(root,"#pmcv"),W,H); const cam={yaw:-0.7,pitch:0.55,zoom:3,cx:0,cy:0,cz:0};
  const PRE={uno:[68,53,25],mb:[52,42,14],esp:[52,28,15]};
  const v=id=>+q(root,"#"+id).value;
  function draw(){ ["pw","pd","ph","pt","pf","pu"].forEach(id=>q(root,"#"+id+"v").textContent=v(id)+" "+q(root,"#"+id).dataset.u);
    const t=v("pt"), f=v("pf"), w=v("pw")+2*f, d=v("pd")+2*f, h=v("ph"), W2=w+2*t, D2=d+2*t; cam.cx=W2/2; cam.cy=D2/2; cam.cz=h/2; cam.zoom=Math.min(3.2,220/Math.max(W2,D2,h*2));
    const items=[{m:box(W2,D2,t),color:"#2747C7"},{m:box(W2,t,h,0,0,0),color:"#2747C7"},{m:box(W2,t,h,0,D2-t,0),color:"#2747C7"},{m:box(t,D2,h,0,0,0),color:"#2747C7"}];
    const u=v("pu"); if(u>0){ const zz=Math.min(h-u/2,t+3); items.push({m:box(t,(D2-u)/2,h,W2-t,0,0),color:"#2747C7"},{m:box(t,(D2-u)/2,h,W2-t,(D2+u)/2,0),color:"#2747C7"},{m:box(t,u,zz,W2-t,(D2-u)/2,0),color:"#2747C7"},{m:box(t,u,Math.max(0,h-zz-u*0.6),W2-t,(D2-u)/2,zz+u*0.6),color:"#2747C7"}); } else items.push({m:box(t,D2,h,W2-t,0,0),color:"#2747C7"});
    items.push({m:box(v("pw"),v("pd"),1.6,t+f,t+f,t+2),color:"#0b6e8a"});
    render3d(c,W,H,items,cam,{edges:true});
    const vol=W2*D2*h-w*d*(h-t)-(u>0?t*u*u*0.6:0); q(root,"#pmvol").textContent=(vol/1000).toFixed(1).replace(".",",")+" cm³"; q(root,"#pmg").textContent=(vol/1000*1.24).toFixed(0)+" g de PLA";
    q(root,"#pmhist").innerHTML=[`Esboço: retângulo ${w.toFixed(1)} × ${d.toFixed(1)} mm (placa + folga ${f} mm)`,`Extrusão: ${h} mm`,`Casca: parede de ${t} mm, topo aberto`,u>0?`Furo para USB: ${u} mm na parede direita`:"Sem furo para USB",`Referência: placa de ${v("pw")} × ${v("pd")} mm (em azul-petróleo)`].map(x=>`<li>${esc(x)}</li>`).join("");
    const warns=[]; if(t<1.2) warns.push("Parede fina demais para FDM: use pelo menos 1,2 mm (3 linhas de 0,4 mm)."); if(f<0.2) warns.push("Folga muito pequena: a placa pode não entrar. Use 0,3 a 0,5 mm."); if(u>0&&u<10) warns.push("O conector USB-B do Uno tem cerca de 12 mm: o furo pode ficar pequeno.");
    q(root,"#pmwarn").innerHTML=warns.map(x=>`<div class="note small">⚠ ${esc(x)}</div>`).join("")||'<div class="note small">Parâmetros bons para imprimir.</div>'; }
  root.addEventListener("input", draw);
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-pre]"); if(b){ const [a,bb,cc]=PRE[b.dataset.pre]; q(root,"#pw").value=a; q(root,"#pd").value=bb; q(root,"#ph").value=cc; draw(); } });
  orbit(q(root,"#pmcv"),cam,draw); draw();
 }});

lab({id:"mesh", tr:"3d", area:"hw", title:"Visualizador 3D: vértices, arestas e faces",
 blurb:"Gire objetos 3D com o mouse ou o dedo e veja do que eles são feitos: pontos (vértices), linhas (arestas) e polígonos (faces). Aumente a resolução e compare.",
 learn:["Todo modelo 3D é uma malha de vértices ligados por arestas, formando faces.","Mais faces deixam a superfície lisa, mas o arquivo STL fica maior.","O fatiador da impressora lê essas faces para calcular cada camada."],
 html:()=>`<div class="two-even" style="margin-top:0;grid-template-columns:1.2fr 1fr"><canvas id="mscv" class="cv2" style="cursor:grab"></canvas><div class="grid" style="gap:8px">
 <div class="filters" role="group" aria-label="Objeto">${[["cubo","Cubo"],["piramide","Pirâmide"],["cilindro","Cilindro"],["esfera","Esfera"],["toro","Toro (rosquinha)"]].map(([k,l],i)=>`<button data-ms="${k}" aria-pressed="${i===3}">${l}</button>`).join("")}</div>
 <label class="f" for="msres">Resolução: <b id="msrv"></b><input type="range" id="msres" min="3" max="32" value="8"></label>
 <div class="row wrap"><label class="chk inline" for="msf"><input type="checkbox" id="msf" checked><span>Faces</span></label><label class="chk inline" for="mse"><input type="checkbox" id="mse" checked><span>Arestas</span></label><label class="chk inline" for="msv"><input type="checkbox" id="msv"><span>Vértices</span></label><label class="chk inline" for="msrot"><input type="checkbox" id="msrot" checked><span>Girar sozinho</span></label></div>
 <div class="readout"><div><span class="k">Vértices</span><b id="msV"></b></div><div><span class="k">Faces</span><b id="msF"></b></div><div><span class="k">STL aproximado</span><b id="msS"></b></div></div><div class="note small" id="msnote"></div></div></div>`,
 mount(root){
  const W=440,H=360,c=setupCanvas(q(root,"#mscv"),W,H); const cam={yaw:0.6,pitch:0.4,zoom:5,cx:0,cy:0,cz:0}; let kind="esfera";
  function model(){ const n=+q(root,"#msres").value; q(root,"#msrv").textContent=n;
    if(kind==="cubo") return box(30,30,30,-15,-15,-15); if(kind==="piramide") return cyl(22,0,30,4,0,0,-15); if(kind==="cilindro") return cyl(16,16,32,Math.max(3,n),0,0,-16); if(kind==="toro") return torus(17,7,Math.max(3,n),Math.max(3,Math.round(n/2))); return sphere(20,Math.max(2,Math.round(n/2)),0,0,0); }
  function draw(){ const m=model(); render3d(c,W,H,[{m,color:"#4f7cff"}],cam,{faces:q(root,"#msf").checked,edges:q(root,"#mse").checked,verts:q(root,"#msv").checked});
    const tris=m.f.reduce((a,f)=>a+f.length-2,0); q(root,"#msV").textContent=m.v.length; q(root,"#msF").textContent=m.f.length+(tris!==m.f.length?` (${tris} triângulos)`:""); q(root,"#msS").textContent=Math.round((84+tris*50)/1024)+" KB";
    q(root,"#msnote").textContent = ["cubo","piramide"].includes(kind) ? "Formas retas precisam de poucas faces: a resolução não muda nada." : +q(root,"#msres").value<8 ? "Resolução baixa: dá para ver as facetas. Na impressão, a peça sai “quadradona”." : "Resolução alta: superfície lisa, mas o arquivo cresce. Exporte com a resolução que a impressora consegue mostrar."; }
  labEvery(()=>{ if(q(root,"#msrot").checked){ cam.yaw+=0.02; draw(); } },40);
  root.addEventListener("input", draw); root.addEventListener("change", draw);
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-ms]"); if(b){ kind=b.dataset.ms; qa(root,"[data-ms]").forEach(x=>x.setAttribute("aria-pressed",x===b)); draw(); } });
  orbit(q(root,"#mscv"),cam,draw); draw();
 }});

const SCAD_EX = {
 chaveiro:"// Chaveiro com furo\ndifference() {\n  cube([40, 20, 4]);\n  translate([5, 10, -1]) cylinder(h=6, r=3);\n}\ntranslate([14, 6, 4]) cube([22, 8, 2]);",
 caneta:"// Porta-canetas\ndifference() {\n  cylinder(h=80, r=30);\n  translate([0, 0, 3]) cylinder(h=80, r=27);\n}",
 boneco:"// Boneco de neve\nsphere(r=20);\ntranslate([0, 0, 28]) sphere(r=14);\ntranslate([0, 0, 47]) sphere(r=9);\ntranslate([0, 0, 54]) cylinder(h=12, r1=8, r2=8);"};
function parseScad(src){
  const toks=src.replace(new RegExp("//[^\\n]*","g"),"").match(/[A-Za-z_]\w*|-?\d+\.?\d*|[\[\](){};,=]/g)||[]; let i=0;
  const peek=()=>toks[i], next=()=>toks[i++], expect=t=>{ if(toks[i]!==t) throw new Error(`esperava “${t}” perto de “${toks[i]||"fim"}”`); i++; };
  function value(){ if(peek()==="["){ next(); const a=[]; while(peek()!=="]"){ a.push(+next()); if(peek()===",") next(); } next(); return a; } const t=next(); if(t===undefined||isNaN(+t)) throw new Error(`número esperado, veio “${t}”`); return +t; }
  function args(){ expect("("); const pos=[], named={}; while(peek()!==")"){ if(/^[A-Za-z_]/.test(peek()) && toks[i+1]==="="){ const k=next(); next(); named[k]=value(); } else pos.push(value()); if(peek()===",") next(); } expect(")"); return {pos,named}; }
  function stmt(){ const name=next(); if(!name) return null; const a=args();
    if(["cube","sphere","cylinder"].includes(name)){ if(peek()===";") next(); return {t:name,a}; }
    if(["translate","difference","union","color"].includes(name)){ let kids=[]; if(peek()==="{"){ next(); while(peek()!=="}"){ if(peek()===undefined) throw new Error("faltou fechar “}”"); kids.push(stmt()); } next(); } else kids=[stmt()]; return {t:name,a,kids}; }
    throw new Error(`comando desconhecido: ${name}`); }
  const out=[]; while(i<toks.length) out.push(stmt()); return out; }
function scadToItems(nodes, off=[0,0,0], sub=false, items=[]){
  nodes.forEach((n,idx)=>{ if(!n) return;
    if(n.t==="translate"){ const v=n.a.pos[0]||[0,0,0]; scadToItems(n.kids,[off[0]+v[0],off[1]+v[1],off[2]+v[2]],sub,items); }
    else if(n.t==="difference"){ scadToItems([n.kids[0]],off,sub,items); scadToItems(n.kids.slice(1),off,true,items); }
    else if(n.t==="union"||n.t==="color") scadToItems(n.kids,off,sub,items);
    else { let m; if(n.t==="cube"){ const s=n.a.pos[0]??n.a.named.size??10; const [x,y,z]=Array.isArray(s)?s:[s,s,s]; m=box(x,y,z,...off); }
      if(n.t==="sphere"){ const r=n.a.named.r??n.a.pos[0]??5; m=sphere(r,8,...off); }
      if(n.t==="cylinder"){ const h=n.a.named.h??n.a.pos[0]??10, r=n.a.named.r??5; m=cyl(n.a.named.r1??r, n.a.named.r2??r, h, 28, ...off); }
      items.push(sub?{m,color:"#ff3b30",alpha:0.25,wire:true}:{m,color:"#f2c94c"}); } });
  return items; }
lab({id:"scad", tr:"3d", area:"hw", title:"OpenSCAD: código que vira peça 3D",
 blurb:"Escreva código no estilo OpenSCAD e veja a peça aparecer. As partes subtraídas com difference() aparecem em vermelho transparente. Arraste para girar.",
 learn:["No OpenSCAD, a peça é descrita por código: cube, sphere, cylinder.","translate move, difference subtrai (faz furos) e union junta.","Como é código, dá para mudar um número e gerar mil variações."],
 html:()=>`<div class="two-even" style="margin-top:0;grid-template-columns:1fr 1.1fr"><div class="grid" style="gap:8px"><div class="row wrap">${Object.keys(SCAD_EX).map(k=>`<button class="btn ghost sm" data-ex="${k}">${{chaveiro:"Chaveiro",caneta:"Porta-canetas",boneco:"Boneco de neve"}[k]}</button>`).join("")}</div>
 <textarea id="scsrc" class="py" spellcheck="false" style="min-height:260px"></textarea><div id="scerr" class="small"></div><p class="small muted">Comandos aceitos aqui: cube, sphere, cylinder (h, r, r1, r2), translate, difference, union. O OpenSCAD de verdade tem muito mais.</p></div>
 <canvas id="sccv" class="cv2" style="cursor:grab"></canvas></div>`,
 mount(root){
  const W=460,H=380,c=setupCanvas(q(root,"#sccv"),W,H); const cam={yaw:-0.6,pitch:0.5,zoom:3,cx:0,cy:0,cz:0}; let items=[];
  function build(){ try { items=scadToItems(parseScad(q(root,"#scsrc").value)); q(root,"#scerr").innerHTML=`<span class="oktext">✓ ${items.filter(x=>!x.wire).length} sólido(s), ${items.filter(x=>x.wire).length} recorte(s)</span>`;
      const all=items.flatMap(x=>x.m.v); if(all.length){ const mn=[0,1,2].map(k=>Math.min(...all.map(p=>p[k]))), mx=[0,1,2].map(k=>Math.max(...all.map(p=>p[k]))); cam.cx=(mn[0]+mx[0])/2; cam.cy=(mn[1]+mx[1])/2; cam.cz=(mn[2]+mx[2])/2; cam.zoom=200/Math.max(10,...[0,1,2].map(k=>mx[k]-mn[k])); } }
    catch(err){ q(root,"#scerr").innerHTML=`<span class="warntext">Erro: ${esc(err.message)}</span>`; } draw(); }
  function draw(){ const solid=items.filter(x=>!x.wire), cut=items.filter(x=>x.wire); render3d(c,W,H,solid,cam,{edges:true}); if(cut.length){ c.save(); render3dOver(cut); c.restore(); } }
  function render3dOver(cut){ const cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    cut.forEach(it=>{ const P=it.m.v.map(p=>{ const x=p[0]-cam.cx,y=p[1]-cam.cy,z=p[2]-cam.cz; const x1=x*cy-y*sy, y1=x*sy+y*cy; return [W/2+x1*cam.zoom, H/2-(y1*sp+z*cp)*cam.zoom]; });
      it.m.f.forEach(f=>{ c.beginPath(); f.forEach((k,i)=>i?c.lineTo(P[k][0],P[k][1]):c.moveTo(P[k][0],P[k][1])); c.closePath(); c.fillStyle="rgba(255,59,48,.08)"; c.fill(); c.strokeStyle="rgba(255,59,48,.6)"; c.lineWidth=1; c.stroke(); }); }); }
  let t=null; root.addEventListener("input", e=>{ if(e.target.id==="scsrc"){ clearTimeout(t); t=labLater(build,350); } });
  root.addEventListener("keydown", e=>{ if(e.target.id==="scsrc"&&e.key==="Tab"){ e.preventDefault(); e.target.setRangeText("  ", e.target.selectionStart, e.target.selectionEnd, "end"); } });
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-ex]"); if(b){ q(root,"#scsrc").value=SCAD_EX[b.dataset.ex]; build(); } });
  orbit(q(root,"#sccv"),cam,draw); q(root,"#scsrc").value=SCAD_EX.chaveiro; build();
 }});
})();
