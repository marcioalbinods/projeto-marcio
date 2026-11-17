(function(){
const q = (r,s) => r.querySelector(s), qa = (r,s) => [...r.querySelectorAll(s)];
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
function logTo(el, msg, cls){ const p = document.createElement("div"); if (cls) p.className = cls; p.textContent = msg; el.prepend(p); while (el.children.length > 40) el.lastChild.remove(); }
function setupCanvas(cv, w, h){ const d = window.devicePixelRatio || 1; cv.width = w*d; cv.height = h*d; cv.style.width = "100%"; cv.style.maxWidth = w+"px"; cv.style.aspectRatio = w+"/"+h; const c = cv.getContext("2d"); c.setTransform(d,0,0,d,0,0); return c; }
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";

lab({id:"pc", tr:"base", area:"hw", title:"Dentro do computador",
 blurb:"Clique nas peças e abra programas: veja SSD, RAM, CPU, GPU e tela trabalhando juntos.",
 learn:["O SSD guarda tudo, mesmo desligado, mas é mais lento que a RAM.","A RAM é rápida e temporária: apaga quando o computador desliga.","A CPU executa as instruções e a GPU desenha a imagem na tela."],
 html:()=>`<div class="pcwrap">
  <div class="board" id="board">
   <button class="part p-cpu" data-p="cpu"><b>CPU</b><span>processador</span><i class="fan"></i></button>
   <button class="part p-ram" data-p="ram"><b>RAM</b><span>memória · 16 GB</span><div class="ramcells" id="ramcells"></div></button>
   <button class="part p-ssd" data-p="ssd"><b>SSD</b><span>armazenamento</span></button>
   <button class="part p-gpu" data-p="gpu"><b>GPU</b><span>placa de vídeo</span></button>
   <button class="part p-psu" data-p="psu"><b>Fonte</b><span>energia</span></button>
   <button class="part p-mb" data-p="mb"><b>Placa-mãe</b><span>conecta tudo</span></button>
   <span class="packet" id="pkt"></span>
  </div>
  <div class="monitor"><div class="screen" id="screen"></div><div class="stand"></div></div>
 </div>
 <div class="row wrap ctrls"><span class="small muted">Abrir:</span>
  <button class="btn sm" data-app="nav">Navegador</button><button class="btn sm" data-app="py">Python</button><button class="btn sm" data-app="canva">Canva</button><button class="btn sm" data-app="jogo">Jogo 3D</button>
  <button class="btn ghost sm" id="pcsave">Salvar arquivo</button><button class="btn danger sm" id="pcpower">Desligar</button></div>
 <div class="two-even"><div class="infobox" id="pinfo"><b>Clique numa peça</b> para saber o que ela faz.</div><div class="log" id="plog" aria-live="polite"></div></div>`,
 mount(root){
  const INFO = {
   cpu:["CPU (processador)","Executa as instruções dos programas, bilhões por segundo. É o “cérebro” que calcula e decide.","No seu MacBook M1, a CPU, a GPU e a memória ficam no mesmo chip (SoC). Por isso ele é rápido e gasta pouca bateria."],
   ram:["RAM (memória de trabalho)","Guarda o que está em uso agora: programas abertos e arquivos que você está editando. É muito rápida, mas apaga ao desligar.","Pouca RAM com muitos programas abertos faz o sistema usar o SSD como memória extra (swap), e tudo fica lento."],
   ssd:["SSD (armazenamento)","Guarda arquivos, programas e o sistema operacional de forma permanente, mesmo sem energia.","É mais lento que a RAM. Por isso o programa é copiado do SSD para a RAM quando você o abre."],
   gpu:["GPU (placa de vídeo)","Calcula a imagem que vai para a tela, com milhares de núcleos trabalhando em paralelo.","Esse paralelismo é o mesmo motivo de as GPUs serem usadas para treinar inteligência artificial."],
   psu:["Fonte de alimentação","Converte a energia da tomada (127 V ou 220 V, corrente alternada) nas tensões baixas que as peças usam: 12 V, 5 V e 3,3 V.","Num notebook, esse papel é dividido entre o carregador e a bateria."],
   mb:["Placa-mãe","Liga todas as peças e leva dados e energia entre elas por trilhas de cobre chamadas barramentos.","É nela que você encaixa a RAM, o SSD e a placa de vídeo num computador de mesa."]
  };
  const APPS = {nav:["Navegador",4,"#2747C7"], py:["Python",2,"#0F766E"], canva:["Canva",5,"#A21CAF"], jogo:["Jogo 3D",7,"#C2410C"]};
  const board=q(root,"#board"), pkt=q(root,"#pkt"), screen=q(root,"#screen"), cells=q(root,"#ramcells"), plog=q(root,"#plog"), info=q(root,"#pinfo");
  let on=true, busy=false, ram=[], open=[], swap=[];
  const N=16;
  function drawRam(){ cells.innerHTML = Array.from({length:N},(_,i)=>{ const a=ram[i]; return `<i style="background:${a? (a==="os"?"var(--muted)":APPS[a][2]) : "transparent"}" title="${a? (a==="os"?"Sistema operacional":APPS[a][0]) : "livre"}"></i>`; }).join(""); }
  function drawScreen(){
    if (!on){ screen.className="screen off"; screen.innerHTML=""; return; }
    screen.className="screen";
    screen.innerHTML = `<div class="dock">${open.map(a=>`<span class="win" style="--c:${APPS[a][2]}">${APPS[a][0]}<button data-close="${a}" aria-label="Fechar ${APPS[a][0]}">×</button></span>`).join("") || '<span class="muted small">Área de trabalho</span>'}</div>${swap.length?`<div class="swapnote">Em swap no SSD: ${swap.map(a=>APPS[a][0]).join(", ")}</div>`:""}`;
  }
  function center(el){ const b=board.getBoundingClientRect(), r=el.getBoundingClientRect(); return [r.left-b.left+r.width/2, r.top-b.top+r.height/2]; }
  async function fly(a,b,ms=500,color){
    const A=center(q(board,".p-"+a)), B= b==="screen" ? (()=>{ const bb=board.getBoundingClientRect(), r=screen.getBoundingClientRect(); return [r.left-bb.left+20, r.top-bb.top+r.height/2]; })() : center(q(board,".p-"+b));
    pkt.style.transition="none"; pkt.style.background=color||"var(--mark)"; pkt.style.transform=`translate(${A[0]-8}px,${A[1]-8}px)`; pkt.style.opacity=1;
    void pkt.offsetWidth; pkt.style.transition=`transform ${ms}ms ease-in-out`; pkt.style.transform=`translate(${B[0]-8}px,${B[1]-8}px)`;
    await wait(ms+40); pkt.style.opacity=0;
  }
  function glow(p, cls="active"){ const el=q(board,".p-"+p); el.classList.add(cls); labLater(()=>el.classList.remove(cls), 700); }
  const free = () => ram.reduce((n,x,i)=>n+(x?0:1),0);
  function alloc(a,n){ for(let i=0;i<N&&n>0;i++) if(!ram[i]){ ram[i]=a; n--; } }
  function freeApp(a){ ram=ram.map(x=>x===a?null:x); }
  async function openApp(a){
    if (!on){ logTo(plog,"O computador está desligado. Clique em Ligar."); return; }
    if (busy) return; if (open.includes(a)){ logTo(plog,`${APPS[a][0]} já está aberto. A CPU só traz a janela para frente.`); return; }
    busy=true; const [name,need,col]=APPS[a];
    logTo(plog,`1. Você clicou em ${name}. A CPU pede o programa ao SSD.`); glow("cpu"); await fly("cpu","ssd",400);
    while (free() < need){
      const old = open.shift(); if (!old) break;
      logTo(plog,`RAM cheia! ${APPS[old][0]} vai para o swap no SSD. Isso deixa tudo mais lento.`,"warn");
      glow("ram","alert"); await fly("ram","ssd",900,"var(--warn)"); freeApp(old); swap.push(old); drawRam(); drawScreen();
    }
    logTo(plog,`2. O SSD envia ${name} para a RAM (${need} GB).`); glow("ssd"); await fly("ssd","ram",swap.length?1100:600,col);
    alloc(a,need); open.push(a); swap=swap.filter(x=>x!==a); drawRam();
    logTo(plog,"3. A CPU lê as instruções da RAM e executa."); await fly("ram","cpu",350,col); glow("cpu");
    q(board,".p-cpu").classList.add("spin"); await wait(500); q(board,".p-cpu").classList.remove("spin");
    logTo(plog,"4. A GPU desenha a janela e envia a imagem para a tela."); await fly("cpu","gpu",300,col); glow("gpu"); await fly("gpu","screen",400,col);
    drawScreen(); logTo(plog,`Pronto: ${name} aberto. RAM livre: ${free()} de ${N} GB.`,"ok"); busy=false;
  }
  root.addEventListener("click", async e=>{
    const p=e.target.closest("[data-p]"), ap=e.target.closest("[data-app]"), cl=e.target.closest("[data-close]");
    if (cl){ const a=cl.dataset.close; open=open.filter(x=>x!==a); freeApp(a); drawRam(); drawScreen(); logTo(plog,`${APPS[a][0]} fechado. A RAM dele foi liberada.`); return; }
    if (p){ const [t,d,x]=INFO[p.dataset.p]; info.innerHTML=`<b>${t}</b><p>${d}</p><p class="muted small">${x}</p>`; glow(p.dataset.p); return; }
    if (ap){ openApp(ap.dataset.app); return; }
    if (e.target.id==="pcsave"){
      if (!on||busy) return; if (!open.length){ logTo(plog,"Abra um programa antes de salvar."); return; }
      busy=true; logTo(plog,"Salvar: a CPU pega o arquivo que está na RAM…"); await fly("cpu","ram",350); await fly("ram","ssd",700);
      glow("ssd"); logTo(plog,"…e grava no SSD. Agora ele sobrevive mesmo sem energia.","ok"); busy=false;
    }
    if (e.target.id==="pcpower"){
      if (busy) return;
      if (on){ on=false; ram=[]; open=[]; swap=[]; drawRam(); drawScreen(); e.target.textContent="Ligar"; e.target.className="btn sm"; logTo(plog,"Desligado. A RAM perdeu tudo. O SSD manteve seus arquivos.","warn"); }
      else { busy=true; on=true; e.target.textContent="Desligar"; e.target.className="btn danger sm"; logTo(plog,"Ligando: a fonte energiza a placa-mãe."); glow("psu"); await fly("psu","mb",400,"var(--ok)");
        logTo(plog,"O sistema operacional é copiado do SSD para a RAM."); await fly("ssd","ram",700,"var(--muted)"); alloc("os",3); drawRam(); drawScreen(); logTo(plog,"Sistema pronto.","ok"); busy=false; }
    }
  });
  alloc("os",3); drawRam(); drawScreen();
 }});

lab({id:"bits", tr:"base", area:"sw", title:"Bits, bytes e letras",
 blurb:"Ligue e desligue 8 bits e veja o número, o hexadecimal e a letra que o computador enxerga.",
 learn:["Cada bit vale o dobro do bit à direita: 1, 2, 4, 8, 16, 32, 64, 128.","8 bits formam 1 byte, que vai de 0 a 255.","Letras também são números: na tabela ASCII, A = 65."],
 html:()=>`<div class="bitsrow" id="bitsrow"></div>
 <div class="readout"><div><span class="k">Decimal</span><b id="dec">0</b></div><div><span class="k">Hexadecimal</span><b id="hex">00</b></div><div><span class="k">Binário</span><b id="bin" class="mono">00000000</b></div><div><span class="k">Letra (ASCII)</span><b id="chr">—</b></div></div>
 <div class="row wrap ctrls"><label class="f inline" for="bnum">Digite de 0 a 255 <input id="bnum" type="number" min="0" max="255" value="0"></label><label class="f inline" for="btxt">Ou uma letra <input id="btxt" maxlength="1" style="width:4em"></label><button class="btn ghost sm" id="bplus">+1</button><button class="btn ghost sm" id="bclr">Zerar</button></div>
 <div class="challenges" id="bch"></div>
 <div class="infobox"><b>Seu nome em binário</b><input id="bname" class="search" value="Marcio" maxlength="20" aria-label="Texto para converter"><div class="mono small" id="bnameout"></div></div>`,
 mount(root){
  let v=0; const W=[128,64,32,16,8,4,2,1];
  const CH=[["Monte o número 65. Que letra aparece?",65],["Qual é o maior número com 8 bits?",255],["Monte 10 (o “dez” do binário).",10],["Monte a letra a minúscula.",97]];
  let ci=0;
  function draw(){
    q(root,"#bitsrow").innerHTML = W.map((w,i)=>{ const on=(v>>(7-i))&1; return `<button class="bit ${on?"on":""}" data-i="${i}" aria-pressed="${!!on}"><span class="lamp"></span><b>${on}</b><small>${w}</small></button>`; }).join("");
    q(root,"#dec").textContent=v; q(root,"#hex").textContent=v.toString(16).toUpperCase().padStart(2,"0"); q(root,"#bin").textContent=v.toString(2).padStart(8,"0");
    q(root,"#chr").textContent = v>=32&&v<127 ? `“${String.fromCharCode(v)}”` : (v===10?"quebra de linha":"—");
    q(root,"#bnum").value=v;
    const c=CH[ci]; q(root,"#bch").innerHTML = c ? `<span class="pill">Desafio ${ci+1}/${CH.length}</span> ${c[0]} ${v===c[1]?'<b class="oktext">Acertou!</b> <button class="btn sm" id="bnext">Próximo</button>':""}` : `<b class="oktext">Desafios concluídos!</b>`;
  }
  function nameOut(){ const t=q(root,"#bname").value; q(root,"#bnameout").innerHTML = [...t].map(c=>{ const n=c.charCodeAt(0); return `<span title="${esc(c)} = ${n}">${n<256?n.toString(2).padStart(8,"0"):"?"}</span>`; }).join(" ") + `<p class="muted">${t.length} letras = ${t.length} bytes = ${t.length*8} bits</p>`; }
  root.addEventListener("click", e=>{ const b=e.target.closest(".bit"); if (b){ v ^= 1<<(7-Number(b.dataset.i)); draw(); }
    if (e.target.id==="bplus"){ v=(v+1)%256; draw(); } if (e.target.id==="bclr"){ v=0; draw(); } if (e.target.id==="bnext"){ ci++; v=0; draw(); } });
  root.addEventListener("input", e=>{ if (e.target.id==="bnum"){ v=Math.max(0,Math.min(255,parseInt(e.target.value)||0)); draw(); }
    if (e.target.id==="btxt"&&e.target.value){ v=e.target.value.charCodeAt(0)%256; draw(); } if (e.target.id==="bname") nameOut(); });
  draw(); nameOut();
 }});

const PROGS = {
 soma:{name:"Somar de 1 a 4 (for)", code:["total = 0","for i in range(1, 5):","    total = total + i","print(total)"], run(){ const S=[]; let total=0, out=[]; S.push({l:0,v:{total},o:[...out],n:"Cria a variável total e guarda 0 nela."});
  for (let i=1;i<5;i++){ S.push({l:1,v:{total,i},o:[...out],n:`O laço pega o próximo número de range(1, 5): i = ${i}.`}); const old=total; total+=i; S.push({l:2,v:{total,i},o:[...out],n:`total recebe ${old} + ${i} = ${total}.`}); }
  S.push({l:1,v:{total,i:4},o:[...out],n:"Acabaram os números. range(1, 5) para antes do 5, então o laço termina."}); out.push(String(total)); S.push({l:3,v:{total,i:4},o:[...out],n:"print mostra o valor de total na tela."}); return S; }},
 maior:{name:"Maior nota (if dentro do for)", code:["notas = [7, 4, 9]","maior = notas[0]","for n in notas:","    if n > maior:","        maior = n",'print("Maior:", maior)'], run(){ const S=[], notas=[7,4,9]; let maior, out=[];
  S.push({l:0,v:{notas:"[7, 4, 9]"},o:[],n:"Uma lista guarda vários valores numa variável só."}); maior=notas[0]; S.push({l:1,v:{notas:"[7, 4, 9]",maior},o:[],n:"notas[0] é o primeiro item. Em Python, a contagem começa do zero."});
  for (const n of notas){ S.push({l:2,v:{notas:"[7, 4, 9]",maior,n},o:[],n:`O laço pega o próximo item: n = ${n}.`}); const c=n>maior; S.push({l:3,v:{notas:"[7, 4, 9]",maior,n},o:[],n:`A condição ${n} > ${maior} é ${c?"verdadeira (True)":"falsa (False)"}.`}); if (c){ maior=n; S.push({l:4,v:{notas:"[7, 4, 9]",maior,n},o:[],n:`maior passa a ser ${n}.`}); } }
  out.push("Maior: "+maior); S.push({l:5,v:{notas:"[7, 4, 9]",maior,n:9},o:out,n:"O laço acabou. print mostra o resultado."}); return S; }},
 cont:{name:"Contagem regressiva (while)", code:["n = 3","while n > 0:","    print(n)","    n = n - 1",'print("Fim!")'], run(){ const S=[], out=[]; let n=3; S.push({l:0,v:{n},o:[],n:"n começa valendo 3."});
  while (true){ const c=n>0; S.push({l:1,v:{n},o:[...out],n:`Testa a condição: ${n} > 0 é ${c?"True, então entra no laço":"False, então sai do laço"}.`}); if(!c) break; out.push(String(n)); S.push({l:2,v:{n},o:[...out],n:`Mostra ${n}.`}); n--; S.push({l:3,v:{n},o:[...out],n:`n diminui 1 e vale ${n}. Sem essa linha, o laço seria infinito!`}); }
  out.push("Fim!"); S.push({l:4,v:{n},o:[...out],n:"Fora do laço, mostra Fim!"}); return S; }},
 func:{name:"Função com retorno", code:["def media(a, b):","    return (a + b) / 2","","m = media(6, 9)",'print("Média:", m)'], run(){ const S=[];
  S.push({l:0,v:{},o:[],n:"def cria a função, mas não executa nada ainda. Só ensina ao Python o que é “media”."}); S.push({l:3,v:{},o:[],n:"Aqui a função é chamada com a = 6 e b = 9."}); S.push({l:1,v:{a:6,b:9},o:[],n:"Dentro da função, (6 + 9) / 2 = 7.5. return devolve esse valor."});
  S.push({l:3,v:{m:7.5},o:[],n:"O valor devolvido é guardado em m. As variáveis a e b deixam de existir: eram só da função."}); S.push({l:4,v:{m:7.5},o:["Média: 7.5"],n:"print mostra a média."}); return S; }}
};
lab({id:"trace", tr:"python", area:"sw", title:"Python passo a passo",
 blurb:"Execute programas linha por linha e veja as variáveis mudando, como um depurador.",
 learn:["O computador executa uma linha de cada vez, em ordem.","Variáveis são nomes que guardam valores e podem mudar.","Laços repetem linhas; condições decidem quais linhas rodam."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline" for="tprog">Programa <select id="tprog">${Object.entries(PROGS).map(([k,p])=>`<option value="${k}">${p.name}</option>`).join("")}</select></label>
  <button class="btn ghost sm" id="tprev">◀ Voltar</button><button class="btn sm" id="tnext">Próxima linha ▶</button><button class="btn ghost sm" id="treset">Recomeçar</button><span class="pill l" id="tcount"></span></div>
  <div class="trace"><pre class="codebox" id="tcode"></pre><div><div class="k">Variáveis</div><table class="vars" id="tvars"></table><div class="k">Tela (saída)</div><pre class="console" id="tout"></pre></div></div>
  <div class="note" id="tnote"></div><p class="small muted">Desafio: antes de clicar, tente prever o valor das variáveis na próxima linha.</p>`,
 mount(root){
  let key="soma", S=PROGS[key].run(), i=-1;
  function draw(){
    const st=S[i]||{l:-1,v:{},o:[],n:"Clique em “Próxima linha” para começar."}, P=PROGS[key];
    q(root,"#tcode").innerHTML = P.code.map((c,k)=>`<span class="ln ${k===st.l?"cur":""}"><i>${k+1}</i>${esc(c)||" "}</span>`).join("");
    q(root,"#tvars").innerHTML = Object.keys(st.v).length ? Object.entries(st.v).map(([k,v])=>`<tr><td class="mono">${esc(k)}</td><td class="mono"><b>${esc(v)}</b></td></tr>`).join("") : `<tr><td class="muted">nenhuma ainda</td></tr>`;
    q(root,"#tout").textContent = st.o.join("\n"); q(root,"#tnote").textContent = st.n; q(root,"#tcount").textContent = `Passo ${Math.max(0,i+1)} de ${S.length}`;
  }
  root.addEventListener("click", e=>{ if (e.target.id==="tnext"&&i<S.length-1){ i++; draw(); } if (e.target.id==="tprev"&&i>-1){ i--; draw(); } if (e.target.id==="treset"){ i=-1; draw(); } });
  root.addEventListener("change", e=>{ if (e.target.id==="tprog"){ key=e.target.value; S=PROGS[key].run(); i=-1; draw(); } });
  draw();
 }});

lab({id:"sort", tr:"algo", area:"sw", title:"Algoritmos de ordenação",
 blurb:"Assista ao Bubble, Selection e Insertion Sort organizando barras e conte as comparações.",
 learn:["Algoritmos diferentes chegam ao mesmo resultado com custos diferentes.","Contar comparações é um jeito simples de medir eficiência.","O Big O descreve como o custo cresce quando os dados aumentam."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline" for="salg">Algoritmo <select id="salg"><option value="bubble">Bubble Sort</option><option value="selection">Selection Sort</option><option value="insertion">Insertion Sort</option></select></label>
  <label class="f inline" for="sn">Itens <input id="sn" type="range" min="6" max="30" value="14"></label><label class="f inline" for="sspd">Velocidade <input id="sspd" type="range" min="1" max="10" value="5"></label>
  <button class="btn sm" id="splay">▶ Rodar</button><button class="btn ghost sm" id="sstep">Passo</button><button class="btn ghost sm" id="sshuf">Embaralhar</button></div>
  <div class="bars" id="sbars"></div><div class="readout"><div><span class="k">Comparações</span><b id="scmp">0</b></div><div><span class="k">Trocas</span><b id="sswp">0</b></div><div><span class="k">Situação</span><b id="sst">Pronto</b></div></div>
  <div class="note" id="snote"></div>
  <details class="sec"><summary><b>Big O: quanto cresce o trabalho?</b></summary><div class="tablewrap"><table><thead><tr><th>n itens</th><th>O(log n) · busca binária</th><th>O(n) · busca linear</th><th>O(n log n) · bons algoritmos</th><th>O(n²) · bubble sort</th></tr></thead><tbody>${[10,100,1000,100000].map(n=>`<tr><td>${n.toLocaleString("pt-BR")}</td><td>${Math.ceil(Math.log2(n))}</td><td>${n.toLocaleString("pt-BR")}</td><td>${Math.round(n*Math.log2(n)).toLocaleString("pt-BR")}</td><td>${(n*n).toLocaleString("pt-BR")}</td></tr>`).join("")}</tbody></table></div></details>`,
 mount(root){
  let a=[], gen=null, cmp=0, swp=0, playing=false, timer=null, hi=[], sorted=new Set();
  const NOTES={bubble:"Bubble Sort compara vizinhos e troca se estiverem fora de ordem. Os maiores “borbulham” para o fim.",selection:"Selection Sort procura o menor de todos e o coloca na frente, um por vez.",insertion:"Insertion Sort pega cada item e o encaixa na posição certa entre os já ordenados, como cartas na mão."};
  function* bubble(){ const n=a.length; for(let i=0;i<n-1;i++){ for(let j=0;j<n-1-i;j++){ hi=[j,j+1]; cmp++; yield; if(a[j]>a[j+1]){ [a[j],a[j+1]]=[a[j+1],a[j]]; swp++; yield; } } sorted.add(n-1-i); } sorted.add(0); }
  function* selection(){ const n=a.length; for(let i=0;i<n;i++){ let m=i; for(let j=i+1;j<n;j++){ hi=[m,j]; cmp++; yield; if(a[j]<a[m]) m=j; } if(m!==i){ [a[i],a[m]]=[a[m],a[i]]; swp++; } sorted.add(i); yield; } }
  function* insertion(){ const n=a.length; sorted.add(0); for(let i=1;i<n;i++){ let j=i; while(j>0){ hi=[j-1,j]; cmp++; yield; if(a[j-1]>a[j]){ [a[j-1],a[j]]=[a[j],a[j-1]]; swp++; j--; yield; } else break; } for(let k=0;k<=i;k++) sorted.add(k); } }
  const G={bubble,selection,insertion};
  function reset(shuffle=true){ stop(); const n=+q(root,"#sn").value; if(shuffle) a=Array.from({length:n},()=>rnd(5,100)); cmp=0; swp=0; hi=[]; sorted=new Set(); gen=G[q(root,"#salg").value](); q(root,"#sst").textContent="Pronto"; q(root,"#snote").textContent=NOTES[q(root,"#salg").value]; draw(); }
  function draw(){ q(root,"#sbars").innerHTML=a.map((v,i)=>`<span class="${hi.includes(i)?"hi":""} ${sorted.has(i)?"ok":""}" style="height:${v}%"></span>`).join(""); q(root,"#scmp").textContent=cmp; q(root,"#sswp").textContent=swp; }
  function step(){ const r=gen.next(); if(r.done){ hi=[]; a.forEach((_,i)=>sorted.add(i)); stop(); q(root,"#sst").textContent="Ordenado!"; } draw(); }
  function stop(){ playing=false; clearInterval(timer); const b=q(root,"#splay"); if(b) b.textContent="▶ Rodar"; }
  function play(){ if(playing){ stop(); return; } playing=true; q(root,"#splay").textContent="❚❚ Pausar"; q(root,"#sst").textContent="Ordenando…"; timer=labEvery(step, 520-50*q(root,"#sspd").value); }
  root.addEventListener("click", e=>{ if(e.target.id==="splay") play(); if(e.target.id==="sstep"){ stop(); step(); } if(e.target.id==="sshuf") reset(); });
  root.addEventListener("change", e=>{ if(e.target.id==="salg"){ const keep=[...a]; reset(false); a=keep; gen=G[e.target.value](); draw(); } if(e.target.id==="sn") reset(); if(e.target.id==="sspd"&&playing){ stop(); play(); } });
  reset();
 }});

const TPL = {
 basica:["Página básica",`<h1>Olá, turma!</h1>\n<p>Esta é a minha primeira página.</p>\n<ul>\n  <li>HTML dá a estrutura</li>\n  <li>CSS dá o visual</li>\n  <li>JavaScript dá o comportamento</li>\n</ul>`,`body { font-family: system-ui; padding: 20px; }\nh1 { color: #2747C7; }\nli { margin: 6px 0; }`,`console.log("A página carregou!");`],
 flex:["Flexbox",`<p>Troque <code>justify-content</code> no CSS por center, flex-start ou space-around.</p>\n<div class="caixa">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,`.caixa {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  height: 160px;\n  background: #eef;\n  padding: 10px;\n}\n.item { background: #2747C7; color: white; padding: 20px; border-radius: 8px; font: bold 20px system-ui; }`,``],
 contador:["Botão que conta",`<button id="btn">Clique em mim</button>\n<p>Cliques: <span id="n">0</span></p>`,`body { font-family: system-ui; padding: 20px; }\nbutton { font-size: 18px; padding: 10px 16px; border-radius: 8px; border: 0; background: #0F766E; color: white; cursor: pointer; }`,`let cliques = 0;\nconst botao = document.getElementById("btn");\nbotao.addEventListener("click", () => {\n  cliques = cliques + 1;\n  document.getElementById("n").textContent = cliques;\n  console.log("cliques =", cliques);\n});`],
 quiz:["Quiz rápido",`<h2>Quanto é 2 + 2 em binário?</h2>\n<button data-r="10">10</button>\n<button data-r="100">100</button>\n<button data-r="4">4</button>\n<p id="res"></p>`,`body { font-family: system-ui; padding: 20px; }\nbutton { margin: 4px; padding: 10px 18px; font-size: 16px; }`,`document.querySelectorAll("button").forEach(b => {\n  b.onclick = () => {\n    const certo = b.dataset.r === "100";\n    document.getElementById("res").textContent = certo ? "Isso! 4 = 100 em binário." : "Ainda não. Tente de novo.";\n    console.log("resposta:", b.dataset.r, "certo?", certo);\n  };\n});`]
};
lab({id:"play", tr:"front", area:"sw", title:"HTML, CSS e JavaScript ao vivo",
 blurb:"Edite o código e veja a página mudar na hora. Inclui modelos de Flexbox, botão e quiz.",
 learn:["HTML é a estrutura, CSS é o visual e JavaScript é o comportamento.","Mude um valor, veja o efeito: é assim que se aprende front-end.","O console mostra mensagens e erros do JavaScript."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline" for="ptpl">Modelo <select id="ptpl">${Object.entries(TPL).map(([k,t])=>`<option value="${k}">${t[0]}</option>`).join("")}</select></label><span class="small muted">A página atualiza enquanto você digita.</span></div>
 <div class="play"><div class="editors"><label class="k" for="phtml">HTML</label><textarea id="phtml" class="code" spellcheck="false"></textarea><label class="k" for="pcss">CSS</label><textarea id="pcss" class="code" spellcheck="false"></textarea><label class="k" for="pjs">JavaScript</label><textarea id="pjs" class="code" spellcheck="false"></textarea></div>
 <div class="preview"><div class="k">Resultado</div><iframe id="pframe" sandbox="allow-scripts" title="Resultado"></iframe><div class="k">Console</div><pre class="console" id="pcons"></pre></div></div>`,
 mount(root){
  const fr=q(root,"#pframe"), cons=q(root,"#pcons"); let t=null; const token="pp"+Math.random().toString(36).slice(2);
  function load(k){ const [,h,c,j]=TPL[k]; q(root,"#phtml").value=h; q(root,"#pcss").value=c; q(root,"#pjs").value=j; run(); }
  function run(){ cons.textContent=""; const hook=`<script>(function(){var T="${token}";function s(k,a){parent.postMessage({t:T,k:k,m:[].map.call(a,function(x){try{return typeof x==="object"?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(" ")},"*")}var l=console.log;console.log=function(){s("log",arguments);l.apply(console,arguments)};window.onerror=function(m,u,ln){s("err",["Erro: "+m+" (linha "+ln+")"])}})();<\/script>`;
    fr.srcdoc=`<!DOCTYPE html><html><head><meta charset="utf-8">${hook}<style>${q(root,"#pcss").value}</style></head><body>${q(root,"#phtml").value}<script>${q(root,"#pjs").value}<\/script></body></html>`; }
  const onMsg=e=>{ if(e.data&&e.data.t===token){ const d=document.createElement("div"); d.className=e.data.k==="err"?"warntext":""; d.textContent="› "+e.data.m; cons.appendChild(d); } };
  window.addEventListener("message", onMsg); labOnStop(()=>window.removeEventListener("message", onMsg));
  root.addEventListener("input", e=>{ if(e.target.matches("textarea.code")){ clearTimeout(t); t=labLater(run,450); } });
  root.addEventListener("keydown", e=>{ if(e.key==="Tab"&&e.target.matches("textarea.code")){ e.preventDefault(); const el=e.target, s=el.selectionStart; el.setRangeText("  ", s, el.selectionEnd, "end"); } });
  root.addEventListener("change", e=>{ if(e.target.id==="ptpl") load(e.target.value); });
  load("basica");
 }});

lab({id:"http", tr:"back", area:"sw", title:"Como a web conversa (HTTP e API)",
 blurb:"Envie pedidos de um navegador para uma API de escola e veja a resposta, o banco de dados e os códigos de status.",
 learn:["O navegador (cliente) faz um pedido; o servidor responde.","GET busca, POST cria, DELETE apaga.","O código de status diz o resultado: 200 deu certo, 404 não existe, 401 precisa de login."],
 html:()=>`<div class="row wrap ctrls"><label class="f inline" for="hreq">Pedido <select id="hreq"><option value="0">GET /alunos</option><option value="1">GET /alunos/2</option><option value="2">POST /alunos (criar Carla)</option><option value="3">DELETE /alunos/1</option><option value="4">GET /professores</option></select></label>
 <label class="chk inline" for="hlogin"><input type="checkbox" id="hlogin"><span>Estou logado (envia token)</span></label><button class="btn sm" id="hsend">Enviar pedido</button></div>
 <div class="netline" id="hnet"><div class="node" data-n="0"><b>Navegador</b><span>cliente</span></div><div class="node" data-n="1"><b>Servidor</b><span>API da escola</span></div><div class="node" data-n="2"><b>Banco de dados</b><span id="hdbn">2 alunos</span></div><span class="packet" id="hpkt"></span></div>
 <div class="two-even"><div><div class="k">Pedido (request)</div><pre class="console" id="hrq"></pre></div><div><div class="k">Resposta (response)</div><pre class="console" id="hrs"></pre></div></div>
 <div class="note" id="hnote">Escolha um pedido e clique em Enviar.</div>`,
 mount(root){
  let alunos=[{id:1,nome:"Ana",turma:"8A"},{id:2,nome:"Bruno",turma:"8B"}], next=3, busy=false;
  const ST={200:"OK: deu certo.",201:"Created: algo novo foi criado.",204:"No Content: deu certo e não há nada para mostrar.",401:"Unauthorized: precisa estar logado.",404:"Not Found: esse endereço não existe."};
  const net=q(root,"#hnet"), pkt=q(root,"#hpkt");
  async function fly(a,b,col){ const N=qa(net,".node"), bb=net.getBoundingClientRect(); const c=i=>{const r=N[i].getBoundingClientRect(); return [r.left-bb.left+r.width/2-8, r.top-bb.top+r.height/2-8];};
    const A=c(a),B=c(b); pkt.style.transition="none"; pkt.style.background=col; pkt.style.transform=`translate(${A[0]}px,${A[1]}px)`; pkt.style.opacity=1; void pkt.offsetWidth; pkt.style.transition="transform 600ms ease-in-out"; pkt.style.transform=`translate(${B[0]}px,${B[1]}px)`; await wait(640); pkt.style.opacity=0; }
  root.addEventListener("click", async e=>{
    if (e.target.id!=="hsend"||busy) return; busy=true;
    const r=+q(root,"#hreq").value, logged=q(root,"#hlogin").checked;
    const M=["GET","GET","POST","DELETE","GET"][r], P=["/alunos","/alunos/2","/alunos","/alunos/1","/professores"][r];
    let body = r===2 ? JSON.stringify({nome:"Carla",turma:"8A"},null,2) : "";
    q(root,"#hrq").textContent=`${M} ${P} HTTP/1.1\nHost: api.escola.com\n${logged?"Authorization: Bearer eyJhbGciOi…\n":""}${body?"Content-Type: application/json\n\n"+body:""}`;
    q(root,"#hrs").textContent="aguardando…"; q(root,"#hnote").textContent="O pedido viaja pela internet até o servidor…";
    await fly(0,1,"var(--accent)");
    let code, data=null, db=false;
    if (r===4) code=404;
    else if ((r===2||r===3)&&!logged) code=401;
    else { db=true; q(root,"#hnote").textContent="O servidor consulta o banco de dados…"; await fly(1,2,"var(--warn)");
      if (r===0){ code=200; data=alunos; } else if (r===1){ const a=alunos.find(x=>x.id===2); code=a?200:404; data=a||{erro:"aluno não encontrado"}; }
      else if (r===2){ const a={id:next++,nome:"Carla",turma:"8A"}; alunos.push(a); code=201; data=a; } else { const had=alunos.some(x=>x.id===1); alunos=alunos.filter(x=>x.id!==1); code=had?204:404; }
      q(root,"#hdbn").textContent=`${alunos.length} alunos`; await fly(2,1,"var(--warn)"); }
    if (code===404&&!data) data={erro:"não encontrado"}; if (code===401) data={erro:"faça login primeiro"};
    await fly(1,0, code<300?"var(--ok)":"#c0392b");
    q(root,"#hrs").textContent=`HTTP/1.1 ${code} ${ {200:"OK",201:"Created",204:"No Content",401:"Unauthorized",404:"Not Found"}[code]}\nContent-Type: application/json\n\n${code===204?"":JSON.stringify(data,null,2)}`;
    q(root,"#hnote").innerHTML=`<b>${code}</b> · ${ST[code]} ${db?"":"O banco de dados nem foi consultado."} ${r===2&&code===201?"Agora faça GET /alunos de novo e veja a Carla na lista.":""}`;
    busy=false;
  });
 }});

const ALUNOS=[[1,"Ana","8A",8.5,2],[2,"Bruno","8B",6.0,5],[3,"Carla","8A",9.2,0],[4,"Diego","8B",4.5,9],[5,"Eva","8A",7.0,1],[6,"Fábio","8C",5.5,4],[7,"Gabi","8C",9.8,0],[8,"Hugo","8B",7.5,3]];
const COLS=["id","nome","turma","nota","faltas"];
lab({id:"sql", tr:"back", area:"sw", title:"Consultas SQL",
 blurb:"Monte consultas na tabela de alunos e veja o SQL e o resultado na hora.",
 learn:["SELECT escolhe as colunas, WHERE filtra as linhas, ORDER BY ordena.","SQL descreve o que você quer; o banco descobre como buscar.","A mesma lógica vale para MySQL, PostgreSQL e SQLite."],
 html:()=>`<div class="sqlb"><fieldset><legend>SELECT</legend>${COLS.map(c=>`<label class="chk inline" for="sc-${c}"><input type="checkbox" id="sc-${c}" data-col="${c}" checked><span>${c}</span></label>`).join("")}</fieldset>
 <fieldset><legend>WHERE</legend><select id="sw" aria-label="Coluna do filtro"><option value="">sem filtro</option>${COLS.map(c=>`<option>${c}</option>`).join("")}</select><select id="sop" aria-label="Operador">${["=",">",">=","<","<=","<>"].map(o=>`<option>${o}</option>`).join("")}</select><input id="sv" aria-label="Valor" placeholder="valor" style="width:7em"></fieldset>
 <fieldset><legend>ORDER BY</legend><select id="so" aria-label="Ordenar por"><option value="">sem ordem</option>${COLS.map(c=>`<option>${c}</option>`).join("")}</select><select id="sd" aria-label="Direção"><option>ASC</option><option>DESC</option></select></fieldset>
 <fieldset><legend>LIMIT</legend><input id="sl" type="number" min="1" max="8" placeholder="todos" aria-label="Limite" style="width:6em"></fieldset></div>
 <div class="row wrap ctrls"><span class="small muted">Desafios:</span><button class="btn ghost sm" data-ch="0">Alunos da 8A</button><button class="btn ghost sm" data-ch="1">Notas ≥ 7, da maior para a menor</button><button class="btn ghost sm" data-ch="2">Os 3 com mais faltas</button></div>
 <pre class="console sqltxt" id="sqltxt"></pre><div class="tablewrap"><table id="sres"></table></div><p class="small muted" id="scount"></p>`,
 mount(root){
  const CH=[{cols:["nome","turma"],w:["turma","=","8A"]},{cols:["nome","nota"],w:["nota",">=","7"],o:["nota","DESC"]},{cols:["nome","faltas"],o:["faltas","DESC"],l:3}];
  function run(){
    const cols=COLS.filter(c=>q(root,"#sc-"+c).checked); const use=cols.length?cols:COLS;
    const w=q(root,"#sw").value, op=q(root,"#sop").value, raw=q(root,"#sv").value.trim(), o=q(root,"#so").value, d=q(root,"#sd").value, l=parseInt(q(root,"#sl").value);
    const isNum = w&&["id","nota","faltas"].includes(w);
    let sql=`SELECT ${cols.length===5||!cols.length?"*":cols.join(", ")}\nFROM alunos`;
    if (w&&raw!=="") sql+=`\nWHERE ${w} ${op} ${isNum?raw:`'${raw}'`}`;
    if (o) sql+=`\nORDER BY ${o} ${d}`; if (l) sql+=`\nLIMIT ${l}`; q(root,"#sqltxt").textContent=sql+";";
    let rows=ALUNOS.map(r=>Object.fromEntries(COLS.map((c,i)=>[c,r[i]])));
    if (w&&raw!==""){ const val=isNum?parseFloat(raw.replace(",",".")):raw; rows=rows.filter(r=>{ const x=r[w]; return {"=":x==val,">":x>val,">=":x>=val,"<":x<val,"<=":x<=val,"<>":x!=val}[op]; }); }
    if (o) rows.sort((a,b)=>(a[o]>b[o]?1:a[o]<b[o]?-1:0)*(d==="DESC"?-1:1)); if (l) rows=rows.slice(0,l);
    q(root,"#sres").innerHTML=`<thead><tr>${use.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${use.map(c=>`<td>${esc(r[c])}</td>`).join("")}</tr>`).join("")||`<tr><td colspan="${use.length}" class="muted">Nenhuma linha atende ao filtro.</td></tr>`}</tbody>`;
    q(root,"#scount").textContent=`${rows.length} linha(s) de ${ALUNOS.length} na tabela.`;
  }
  root.addEventListener("input", run); root.addEventListener("change", run);
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-ch]"); if(!b) return; const c=CH[+b.dataset.ch];
    COLS.forEach(k=>q(root,"#sc-"+k).checked=c.cols.includes(k)); q(root,"#sw").value=c.w?c.w[0]:""; q(root,"#sop").value=c.w?c.w[1]:"="; q(root,"#sv").value=c.w?c.w[2]:""; q(root,"#so").value=c.o?c.o[0]:""; q(root,"#sd").value=c.o?c.o[1]:"ASC"; q(root,"#sl").value=c.l||""; run(); });
  run();
 }});

lab({id:"git", tr:"devkit", area:"sw", title:"Git e GitHub na prática",
 blurb:"Edite arquivos, faça add, commit, push e pull e veja o caminho de cada mudança.",
 learn:["Pasta → área de preparo (add) → histórico local (commit) → GitHub (push).","Cada commit é uma foto do projeto com uma mensagem.","pull traz para você o que outras pessoas enviaram."],
 html:()=>`<div class="gitcols"><div class="gcol"><b>Sua pasta</b><span class="small muted">arquivos editados</span><div id="gw"></div></div><div class="gcol"><b>Preparo</b><span class="small muted">git add</span><div id="gs"></div></div><div class="gcol"><b>Histórico local</b><span class="small muted">git commit</span><div id="gl"></div></div><div class="gcol"><b>GitHub</b><span class="small muted">git push</span><div id="gr"></div></div></div>
 <div class="row wrap ctrls"><button class="btn ghost sm" data-g="edit:index.html">Editar index.html</button><button class="btn ghost sm" data-g="edit:style.css">Editar style.css</button><button class="btn sm" data-g="add">git add .</button><input id="gmsg" value="Adiciona página inicial" aria-label="Mensagem do commit" style="min-width:14em"><button class="btn sm" data-g="commit">git commit</button><button class="btn sm" data-g="push">git push</button><button class="btn ghost sm" data-g="colega">Colega envia mudança</button><button class="btn ghost sm" data-g="pull">git pull</button></div>
 <pre class="console term" id="gterm"></pre>`,
 mount(root){
  let work=new Set(), stage=new Set(), local=[{h:"a1b2c3d",m:"Primeiro commit",who:"você"}], remote=[{h:"a1b2c3d",m:"Primeiro commit",who:"você"}];
  const term=q(root,"#gterm"); const hash=()=>Math.random().toString(16).slice(2,9);
  const say=(cmd,out)=>{ term.textContent=`$ ${cmd}\n${out}\n\n`+term.textContent; };
  const chip=(t,c)=>`<span class="gchip ${c||""}">${esc(t)}</span>`;
  function draw(){
    q(root,"#gw").innerHTML=[...work].map(f=>chip(f+" (modificado)","w")).join("")||'<span class="small muted">nada mudou</span>';
    q(root,"#gs").innerHTML=[...stage].map(f=>chip(f,"s")).join("")||'<span class="small muted">vazio</span>';
    q(root,"#gl").innerHTML=local.slice().reverse().map(c=>chip(`${c.h} ${c.m}`, remote.some(r=>r.h===c.h)?"c":"c new")).join("");
    q(root,"#gr").innerHTML=remote.slice().reverse().map(c=>chip(`${c.h} ${c.m}`, local.some(r=>r.h===c.h)?"c":"c theirs")).join("");
  }
  root.addEventListener("click", e=>{
    const b=e.target.closest("[data-g]"); if(!b) return; const g=b.dataset.g;
    if (g.startsWith("edit:")){ const f=g.slice(5); work.add(f); say(`(você editou ${f})`,`O Git percebeu que ${f} mudou. Ainda não está salvo no histórico.`); }
    if (g==="add"){ if(!work.size) say("git add .","Nada para adicionar."); else { work.forEach(f=>stage.add(f)); say("git add .",`Preparado para o commit: ${[...work].join(", ")}`); work.clear(); } }
    if (g==="commit"){ const m=q(root,"#gmsg").value.trim()||"Atualiza arquivos"; if(!stage.size) say(`git commit -m "${m}"`,"Nada no preparo. Use git add primeiro.");
      else { const h=hash(); local.push({h,m,who:"você"}); say(`git commit -m "${m}"`,`[main ${h}] ${m}\n ${stage.size} arquivo(s) alterado(s)`); stage.clear(); } }
    if (g==="push"){ const theirs=remote.filter(r=>!local.some(l=>l.h===r.h)); if(theirs.length){ say("git push origin main","! [rejeitado] O GitHub tem mudanças que você ainda não tem.\nDica: faça git pull antes.");}
      else { const n=local.filter(l=>!remote.some(r=>r.h===l.h)); remote=local.map(c=>({...c})); say("git push origin main", n.length?`Enviando ${n.length} commit(s)… pronto. Seu código está no GitHub.`:"Tudo atualizado. Nada para enviar."); } }
    if (g==="colega"){ const h=hash(); remote.push({h,m:"Colega corrige o menu",who:"colega"}); say("(no computador do colega) git push","O colega enviou um commit para o GitHub. O seu computador ainda não tem esse commit."); }
    if (g==="pull"){ const theirs=remote.filter(r=>!local.some(l=>l.h===r.h)); if(!theirs.length) say("git pull","Já está atualizado.");
      else { local=[...local.filter(l=>!remote.some(r=>r.h===l.h)).length? remote.concat(local.filter(l=>!remote.some(r=>r.h===l.h))) : remote].map(c=>({...c})); say("git pull",`Baixou ${theirs.length} commit(s) do GitHub: ${theirs.map(t=>t.m).join(", ")}`); } }
    draw();
  });
  draw(); say("git status","No ramo main. Tudo limpo. Edite um arquivo para começar.");
 }});

lab({id:"neuron", tr:"ia", area:"sw", title:"Um neurônio artificial aprendendo",
 blurb:"Ajuste pesos ou deixe o neurônio treinar sozinho para separar alunos aprovados e reprovados.",
 learn:["Um neurônio soma entradas multiplicadas por pesos e decide pelo resultado.","Treinar é ajustar os pesos para errar menos.","Redes neurais são milhares desses neurônios em camadas."],
 html:()=>`<div class="nn"><canvas id="ncv" aria-label="Gráfico de horas de estudo por faltas"></canvas><div>
 <label class="f" for="nw1">Peso das horas de estudo: <b id="nw1v"></b><input type="range" id="nw1" min="-3" max="3" step="0.05"></label>
 <label class="f" for="nw2">Peso das faltas: <b id="nw2v"></b><input type="range" id="nw2" min="-3" max="3" step="0.05"></label>
 <label class="f" for="nb">Viés (bias): <b id="nbv"></b><input type="range" id="nb" min="-15" max="15" step="0.1"></label>
 <div class="readout"><div><span class="k">Acertos</span><b id="nacc"></b></div><div><span class="k">Épocas</span><b id="nep">0</b></div></div>
 <div class="row wrap"><button class="btn sm" id="ntrain">Treinar 1 época</button><button class="btn ghost sm" id="nauto">Treinar até acertar</button><button class="btn ghost sm" id="nrand">Pesos aleatórios</button></div>
 <div class="row wrap"><span class="small muted">Clique no gráfico para adicionar:</span><label class="chk inline" for="nc1"><input type="radio" name="ncls" id="nc1" value="1" checked><span>aprovado</span></label><label class="chk inline" for="nc0"><input type="radio" name="ncls" id="nc0" value="0"><span>reprovado</span></label></div>
 <pre class="console small" id="nform"></pre></div></div>`,
 mount(root){
  const cv=q(root,"#ncv"), W=340, H=340, c=setupCanvas(cv,W,H);
  let pts=[[8,1,1],[7,2,1],[9,4,1],[6,1,1],[5,0,1],[8,6,1],[2,5,0],[3,8,0],[1,2,0],[4,7,0],[2,9,0],[5,8,0]], w1=0.2,w2=-0.5,b=1, ep=0;
  const pred=(x,y)=>w1*x+w2*y+b>0?1:0;
  const X=x=>30+x*(W-40)/10, Y=y=>H-30-y*(H-40)/10;
  function draw(){
    const ok=css("--ok"), bad="#c0392b"; c.clearRect(0,0,W,H);
    for(let i=0;i<=40;i++) for(let j=0;j<=40;j++){ c.fillStyle=pred(i/4,j/4)?ok+"22":bad+"22"; c.fillRect(X(i/4)-4,Y(j/4)-4,9,9); }
    c.strokeStyle=css("--line"); c.strokeRect(30,10,W-40,H-40); c.fillStyle=css("--muted"); c.font="12px system-ui"; c.fillText("horas de estudo por semana →",120,H-8); c.save(); c.translate(12,H/2+40); c.rotate(-Math.PI/2); c.fillText("faltas →",0,0); c.restore();
    for(let i=0;i<=10;i+=2){ c.fillText(i,X(i)-3,H-18); c.fillText(i,16,Y(i)+4); }
    if (Math.abs(w2)>1e-6){ c.strokeStyle=css("--ink"); c.lineWidth=2; c.beginPath(); c.moveTo(X(0),Y(-b/w2)); c.lineTo(X(10),Y(-(b+w1*10)/w2)); c.save(); c.beginPath(); c.rect(30,10,W-40,H-40); c.clip(); c.moveTo(X(0),Y(-b/w2)); c.lineTo(X(10),Y(-(b+w1*10)/w2)); c.stroke(); c.restore(); }
    let hits=0; pts.forEach(([x,y,l])=>{ const p=pred(x,y); if(p===l) hits++; c.beginPath(); c.arc(X(x),Y(y),7,0,7); c.fillStyle=l?ok:bad; c.fill(); if(p!==l){ c.lineWidth=3; c.strokeStyle=css("--warn"); c.beginPath(); c.arc(X(x),Y(y),11,0,7); c.stroke(); } });
    q(root,"#nacc").textContent=`${hits}/${pts.length}`; q(root,"#nep").textContent=ep;
    q(root,"#nw1").value=w1; q(root,"#nw2").value=w2; q(root,"#nb").value=b; q(root,"#nw1v").textContent=w1.toFixed(2); q(root,"#nw2v").textContent=w2.toFixed(2); q(root,"#nbv").textContent=b.toFixed(2);
    q(root,"#nform").textContent=`saída = ${w1.toFixed(2)} × horas + (${w2.toFixed(2)}) × faltas + (${b.toFixed(2)})\nse saída > 0 → aprovado, senão → reprovado\nCírculo laranja = o neurônio errou esse aluno.`;
    return hits;
  }
  function epoch(){ const lr=0.1; pts.forEach(([x,y,l])=>{ const e=l-pred(x,y); w1+=lr*e*x; w2+=lr*e*y; b+=lr*e; }); ep++; return draw(); }
  root.addEventListener("input", e=>{ if(e.target.id==="nw1") w1=+e.target.value; if(e.target.id==="nw2") w2=+e.target.value; if(e.target.id==="nb") b=+e.target.value; draw(); });
  root.addEventListener("click", e=>{ if(e.target.id==="ntrain") epoch(); if(e.target.id==="nrand"){ w1=Math.random()*4-2; w2=Math.random()*4-2; b=Math.random()*10-5; ep=0; draw(); }
    if(e.target.id==="nauto"){ let n=0; const t=labEvery(()=>{ const h=epoch(); if(h===pts.length||++n>60) clearInterval(t); },120); } });
  cv.addEventListener("click", e=>{ const r=cv.getBoundingClientRect(), sx=(e.clientX-r.left)*W/r.width, sy=(e.clientY-r.top)*H/r.height; const x=(sx-30)*10/(W-40), y=(H-30-sy)*10/(H-40); if(x<0||x>10||y<0||y>10) return; pts.push([x,y,+q(root,'input[name="ncls"]:checked').value]); draw(); });
  draw();
 }});

lab({id:"llm", tr:"ia", area:"sw", title:"Como uma IA escolhe a próxima palavra",
 blurb:"Veja as probabilidades de cada palavra e como a temperatura deixa a IA mais previsível ou mais criativa.",
 learn:["Um modelo de linguagem calcula a chance de cada próxima palavra.","Temperatura baixa escolhe quase sempre a mais provável; alta arrisca mais.","A IA não “sabe” fatos: ela prevê texto. Por isso pode errar com confiança."],
 html:()=>`<div class="llmtxt" id="ltxt"></div>
 <div class="row wrap ctrls"><label class="f inline" for="ltemp">Temperatura: <b id="ltv"></b><input type="range" id="ltemp" min="0.1" max="2" step="0.1" value="1"></label><button class="btn sm" id="lgen">Escolher próxima palavra</button><button class="btn ghost sm" id="l20">Sortear 50 vezes</button><button class="btn ghost sm" id="lreset">Recomeçar</button></div>
 <div class="probs" id="lprobs"></div><div class="note" id="lnote"></div>`,
 mount(root){
  const T={"":{"notebook":3.0,"código":2.6,"quadro":2.1,"livro":1.7,"Scratch":1.3,"guarda-chuva":-0.8},
   "notebook":{"e":2.6,"para":2.2,"na":1.5,"com":1.1,"devagar":-0.2},"código":{"no":2.5,"e":2.0,"para":1.8,"com":1.2,"cantando":-1.0},"quadro":{"e":2.4,"para":2.1,"com":1.5,"branco":1.3,"voador":-1.2},
   "livro":{"na":2.5,"e":2.2,"para":1.6,"de":1.4,"mágico":0.1},"Scratch":{"e":2.5,"para":2.3,"no":1.7,"com":1.1,"dançando":-0.5},"guarda-chuva":{"e":2.0,"dentro":1.4,"porque":1.2,"para":1.0,"azul":0.6}};
  const BASE="O professor de computação abriu o"; let chosen=[], counts={};
  const probs=(L,t)=>{ const e=Object.entries(L).map(([k,v])=>[k,Math.exp(v/t)]), s=e.reduce((a,x)=>a+x[1],0); return e.map(([k,v])=>[k,v/s]); };
  const cur=()=> chosen.length===0 ? T[""] : (chosen.length===1 ? T[chosen[0]] : null);
  function draw(){
    const t=+q(root,"#ltemp").value; q(root,"#ltv").textContent=t.toFixed(1);
    q(root,"#ltxt").innerHTML=`${BASE} ${chosen.map(w=>`<mark>${esc(w)}</mark>`).join(" ")} <span class="caret">▍</span>`;
    const L=cur(); if(!L){ q(root,"#lprobs").innerHTML=""; q(root,"#lnote").textContent="Fim do exemplo. Modelos reais repetem isso milhares de vezes, palavra por palavra, considerando todo o texto anterior."; return; }
    const P=probs(L,t).sort((a,b)=>b[1]-a[1]); const total=Object.values(counts).reduce((a,b)=>a+b,0);
    q(root,"#lprobs").innerHTML=P.map(([k,p])=>`<div class="prob"><span class="mono">${esc(k)}</span><div class="bar"><span style="width:${(p*100).toFixed(1)}%"></span></div><b>${(p*100).toFixed(1)}%</b>${total?`<span class="small muted">${counts[k]||0}×</span>`:""}</div>`).join("");
    q(root,"#lnote").textContent = t<0.5 ? "Temperatura baixa: a IA fica previsível e repete a opção mais provável." : t>1.4 ? "Temperatura alta: aparecem palavras improváveis e até absurdas. Mais criatividade, mais erros." : "Temperatura média: equilíbrio entre previsível e variado.";
  }
  function sample(){ const L=cur(); if(!L) return null; const P=probs(L,+q(root,"#ltemp").value); let r=Math.random(); for(const [k,p] of P){ r-=p; if(r<=0) return k; } return P[P.length-1][0]; }
  root.addEventListener("input", e=>{ if(e.target.id==="ltemp"){ counts={}; draw(); } });
  root.addEventListener("click", e=>{ if(e.target.id==="lgen"){ const w=sample(); if(w){ chosen.push(w); counts={}; } draw(); }
    if(e.target.id==="l20"){ counts={}; for(let i=0;i<50;i++){ const w=sample(); if(w) counts[w]=(counts[w]||0)+1; } draw(); }
    if(e.target.id==="lreset"){ chosen=[]; counts={}; draw(); } });
  draw();
 }});

const RES=[47,100,150,220,330,470,680,1000,2200,4700,10000];
const BANDC=["#000","#8B4513","#e53935","#fb8c00","#fdd835","#43a047","#1e88e5","#8e24aa","#757575","#fff"];
const BANDN=["preto","marrom","vermelho","laranja","amarelo","verde","azul","violeta","cinza","branco"];
lab({id:"ohm", tr:"maker", area:"hw", title:"Lei de Ohm: acenda o LED sem queimar",
 blurb:"Escolha a bateria, o resistor e o LED. Veja a corrente, o brilho e o código de cores do resistor.",
 learn:["V = R × I: tensão é resistência vezes corrente.","O resistor limita a corrente. Sem ele, o LED queima.","LEDs comuns aguentam cerca de 20 mA (0,020 A)."],
 html:()=>`<div class="ohm"><svg viewBox="0 0 470 240" id="osvg" role="img" aria-label="Circuito com bateria, resistor e LED">
  <path id="owire" d="M60 190 V50 H170 M250 50 H360 V110 M360 150 V190 H60" fill="none" stroke="var(--ink)" stroke-width="4"/>
  <path id="oflow" d="M60 190 V50 H170 M250 50 H360 V110 M360 150 V190 H60" fill="none" stroke="var(--mark)" stroke-width="4" stroke-dasharray="6 14"/>
  <g><rect x="40" y="95" width="40" height="60" rx="5" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/><text x="60" y="120" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700" id="ovt">5V</text><text x="60" y="140" text-anchor="middle" font-size="16" fill="var(--ink)">+</text></g>
  <g><rect x="170" y="38" width="80" height="24" rx="10" fill="#e8d3a9" stroke="var(--ink)" stroke-width="2"/><g id="obands"></g></g>
  <g><circle cx="360" cy="130" r="34" id="oglow" opacity="0"/><path d="M345 110 h30 l-15 26 z" id="oled" stroke="var(--ink)" stroke-width="2"/><line x1="345" y1="138" x2="375" y2="138" stroke="var(--ink)" stroke-width="3"/><text x="392" y="134" font-size="12" fill="var(--muted)" id="oledt">LED</text></g>
  <text x="210" y="90" text-anchor="middle" font-size="13" fill="var(--muted)" id="ort">220 Ω</text>
  <text x="210" y="215" text-anchor="middle" font-size="15" fill="var(--ink)" font-weight="700" id="oit"></text></svg>
 <div><label class="f" for="ov">Bateria (tensão)<select id="ov"><option value="3.3">3,3 V (placas modernas)</option><option value="5" selected>5 V (Arduino, USB)</option><option value="9">9 V (bateria quadrada)</option></select></label>
 <label class="f" for="or">Resistor: <b id="orv"></b><input type="range" id="or" min="0" max="${RES.length-1}" value="3"></label>
 <label class="f" for="ol">LED<select id="ol"><option value="2.0|#ff3b30|vermelho">Vermelho (2,0 V)</option><option value="2.1|#ffcc00|amarelo">Amarelo (2,1 V)</option><option value="2.2|#34c759|verde">Verde (2,2 V)</option><option value="3.1|#0a84ff|azul">Azul (3,1 V)</option><option value="3.1|#f5f5f5|branco">Branco (3,1 V)</option></select></label>
 <div class="readout"><div><span class="k">Corrente</span><b id="oi"></b></div><div><span class="k">Potência no resistor</span><b id="op"></b></div></div>
 <div class="note" id="onote"></div><p class="small muted" id="obandtxt"></p></div></div>
 <pre class="console small" id="ocalc"></pre>`,
 mount(root){
  const flow=q(root,"#oflow"); let off=0, speed=0;
  labEvery(()=>{ off-=speed; flow.setAttribute("stroke-dashoffset",off); },40);
  function draw(){
    const V=+q(root,"#ov").value, R=RES[+q(root,"#or").value], [vf,col,name]=q(root,"#ol").value.split("|"), Vf=+vf;
    const I=Math.max(0,(V-Vf)/R), mA=I*1000, P=I*I*R;
    q(root,"#ovt").textContent=String(V).replace(".",",")+"V"; q(root,"#orv").textContent=R>=1000?(R/1000)+" kΩ":R+" Ω"; q(root,"#ort").textContent=q(root,"#orv").textContent;
    const s=String(R), d1=+s[0], d2=+s[1], m=s.length-2;
    q(root,"#obands").innerHTML=[d1,d2,m].map((d,i)=>`<rect x="${182+i*14}" y="38" width="8" height="24" fill="${BANDC[d]}"/>`).join("")+`<rect x="232" y="38" width="8" height="24" fill="#c9a227"/>`;
    q(root,"#obandtxt").textContent=`Cores: ${BANDN[d1]}, ${BANDN[d2]}, ${BANDN[m]} (×10^${m}) e dourado (±5%).`;
    const burn = mA>30, bright = Math.min(1, mA/20);
    q(root,"#oled").setAttribute("fill", burn ? "#333" : col); q(root,"#oledt").textContent="LED "+name;
    const g=q(root,"#oglow"); g.setAttribute("fill",col); g.setAttribute("opacity", burn?0:(bright*0.75).toFixed(2));
    speed = burn?0:Math.min(6, mA/4); flow.setAttribute("opacity", I>0&&!burn?1:0);
    q(root,"#oi").textContent=`${mA.toFixed(1)} mA`; q(root,"#op").textContent=`${(P*1000).toFixed(0)} mW`;
    q(root,"#oit").textContent= I>0 ? `I = ${mA.toFixed(1)} mA` : "Sem corrente";
    let n;
    if (V<=Vf) n="A tensão da bateria é menor que a do LED: não há corrente e o LED fica apagado.";
    else if (burn) n=`Corrente alta demais (${mA.toFixed(0)} mA)! O LED queimaria. Use um resistor maior.`;
    else if (mA>20) n="Acima de 20 mA: acende forte, mas reduz a vida útil do LED. Prefira um resistor um pouco maior.";
    else if (mA<2) n="Corrente muito baixa: o LED quase não acende.";
    else n="Ótimo: corrente segura, o LED acende bem.";
    q(root,"#onote").innerHTML=`<b>${burn?"Perigo":"Situação"}:</b> ${n}`;
    q(root,"#ocalc").textContent=`Tensão no resistor = ${V} − ${Vf} = ${(V-Vf).toFixed(1)} V\nI = V ÷ R = ${(Math.max(0,V-Vf)).toFixed(1)} ÷ ${R} = ${I.toFixed(4)} A = ${mA.toFixed(1)} mA\nResistor ideal para 15 mA: ${(Math.max(0,V-Vf)/0.015).toFixed(0)} Ω`;
  }
  root.addEventListener("input", draw); root.addEventListener("change", draw); draw();
 }});

const ICON={coracao:"0101011111111110111000100",sorriso:"0000001010000001000101110",sim:"0000000001000101010000100",x:"1000101010001000101010001"};
const DICE=["0000000000001000000000000","1000000000000000000000001","1000000000001000000000001","1000100000000000000010001","1000100000001000000010001","1010100000101010000010101"];
lab({id:"microbit", tr:"maker", area:"hw", title:"micro:bit virtual",
 blurb:"Aperte A e B, sacuda, mude a temperatura e desenhe nos LEDs. O código MakeCode aparece ao lado.",
 learn:["Programas para placas reagem a eventos: botão apertado, placa sacudida.","A matriz de 25 LEDs é uma tela de 5 × 5 pixels.","O mesmo programa pode ser escrito em blocos ou em Python."],
 html:()=>`<div class="mbwrap"><div class="mb"><div class="mbleds" id="mleds"></div><button class="mbbtn a" id="mA" aria-label="Botão A">A</button><button class="mbbtn b" id="mB" aria-label="Botão B">B</button><div class="mbpins"><span>0</span><span>1</span><span>2</span><span>3V</span><span>GND</span></div></div>
 <div><label class="f" for="mprog">Programa<select id="mprog"><option value="icons">Coração no A, sorriso no B</option><option value="dado">Dado eletrônico (sacudir)</option><option value="cont">Contador (A soma, B zera)</option><option value="temp">Termômetro</option><option value="draw">Desenho livre</option></select></label>
 <div class="row wrap"><button class="btn sm" id="mshake">Sacudir</button><label class="f inline" for="mtemp">Temperatura <b id="mtv">24</b>°C<input type="range" id="mtemp" min="0" max="45" value="24"></label></div>
 <div class="k">Código (MakeCode Python)</div><pre class="console small" id="mcode"></pre><a class="small" href="https://makecode.microbit.org/" target="_blank" rel="noopener">Abrir o MakeCode e testar na placa de verdade</a></div></div><div class="note" id="mnote"></div>`,
 mount(root){
  let leds=Array(25).fill(0), prog="icons", count=0;
  const CODE={
   icons:`def on_button_pressed_a():\n    basic.show_icon(IconNames.HEART)\ninput.on_button_pressed(Button.A, on_button_pressed_a)\n\ndef on_button_pressed_b():\n    basic.show_icon(IconNames.HAPPY)\ninput.on_button_pressed(Button.B, on_button_pressed_b)`,
   dado:`def on_gesture_shake():\n    numero = randint(1, 6)\n    basic.show_number(numero)\ninput.on_gesture(Gesture.SHAKE, on_gesture_shake)`,
   cont:`contador = 0\n\ndef on_button_pressed_a():\n    global contador\n    contador += 1\n    basic.show_number(contador)\ninput.on_button_pressed(Button.A, on_button_pressed_a)\n\ndef on_button_pressed_b():\n    global contador\n    contador = 0\n    basic.clear_screen()\ninput.on_button_pressed(Button.B, on_button_pressed_b)`,
   temp:`def on_forever():\n    led.plot_bar_graph(input.temperature(), 40)\nbasic.forever(on_forever)`,
   draw:""};
  const NOTE={icons:"Aperte A e B. Cada botão dispara um evento diferente.",dado:"Clique em Sacudir: o acelerômetro detecta o movimento e sorteia de 1 a 6.",cont:"A soma 1 e acende um LED por número (na placa real, o número aparece rolando). B zera.",temp:"Mexa a temperatura: o gráfico de barras sobe e desce. A placa tem um sensor de temperatura no processador.",draw:"Clique nos LEDs para desenhar. O código para mostrar o seu desenho aparece ao lado."};
  function show(p){ leds=[...p].map(Number); draw(); }
  function draw(){ q(root,"#mleds").innerHTML=leds.map((v,i)=>`<button class="led ${v?"on":""}" data-l="${i}" aria-label="LED ${i+1}" ${prog==="draw"?"":"tabindex=-1"}></button>`).join("");
    let code=CODE[prog]; if(prog==="draw"){ const rows=[0,1,2,3,4].map(r=>"        "+leds.slice(r*5,r*5+5).map(v=>v?"#":".").join(" ")); code=`basic.show_leds("""\n${rows.join("\n")}\n        """)`; }
    q(root,"#mcode").textContent=code; q(root,"#mnote").textContent=NOTE[prog]; }
  function temp(){ const t=+q(root,"#mtemp").value; q(root,"#mtv").textContent=t; if(prog!=="temp") return; const n=Math.round(t/40*25); leds=Array(25).fill(0); for(let i=0;i<Math.min(25,n);i++){ const row=4-Math.floor(i/5), col=i%5; leds[row*5+col]=1; } draw(); }
  root.addEventListener("click", e=>{
    const l=e.target.closest("[data-l]");
    if (l&&prog==="draw"){ leds[+l.dataset.l]^=1; draw(); return; }
    if (e.target.id==="mA"){ if(prog==="icons") show(ICON.coracao); if(prog==="cont"){ count=Math.min(25,count+1); leds=Array(25).fill(0).map((_,i)=>i<count?1:0); draw(); q(root,"#mnote").textContent=`contador = ${count}`; } }
    if (e.target.id==="mB"){ if(prog==="icons") show(ICON.sorriso); if(prog==="cont"){ count=0; show("0".repeat(25)); q(root,"#mnote").textContent="contador = 0"; } }
    if (e.target.id==="mshake"){ const mb=q(root,".mb"); mb.classList.remove("shake"); void mb.offsetWidth; mb.classList.add("shake"); if(prog==="dado"){ const n=rnd(1,6); show(DICE[n-1]); q(root,"#mnote").textContent=`Sorteou ${n}.`; } }
  });
  root.addEventListener("input", e=>{ if(e.target.id==="mtemp") temp(); });
  root.addEventListener("change", e=>{ if(e.target.id==="mprog"){ prog=e.target.value; count=0; leds=Array(25).fill(0); draw(); if(prog==="temp") temp(); } });
  draw();
 }});

lab({id:"arduino", tr:"maker", area:"hw", title:"Arduino: piscar, PWM e potenciômetro",
 blurb:"Rode três programas clássicos numa placa simulada e veja o código, os LEDs e o monitor serial.",
 learn:["setup() roda uma vez; loop() repete para sempre.","digitalWrite liga ou desliga; analogWrite (PWM) controla o brilho de 0 a 255.","analogRead lê de 0 a 1023, e map() converte para outra escala."],
 html:()=>`<div class="ard"><svg viewBox="0 0 380 230" role="img" aria-label="Placa Arduino com LEDs e potenciômetro">
  <rect x="10" y="20" width="250" height="180" rx="12" fill="#0b6e8a"/><text x="110" y="120" fill="#fff" font-size="26" font-weight="800" opacity=".9">UNO</text>
  <rect x="30" y="30" width="200" height="14" rx="3" fill="#222"/><text x="34" y="58" fill="#cfe" font-size="10">pinos digitais 13 … 0</text>
  <rect x="120" y="180" width="120" height="14" rx="3" fill="#222"/><text x="122" y="174" fill="#cfe" font-size="10">A0 … A5</text>
  <circle cx="60" cy="80" r="7" id="a13" fill="#552"/><text x="72" y="84" fill="#fff" font-size="10">L (13)</text>
  <rect x="20" y="120" width="34" height="50" rx="4" fill="#ccc"/><text x="22" y="186" fill="#cfe" font-size="9">USB</text>
  <line x1="60" y1="37" x2="300" y2="37" stroke="#333" stroke-width="2"/><circle cx="320" cy="60" r="26" id="a9g" fill="#ff3b30" opacity="0"/><circle cx="320" cy="60" r="11" id="a9" fill="#5a1d1d" stroke="#111"/><text x="300" y="100" fill="var(--muted)" font-size="11">LED no pino 9</text>
  <line x1="180" y1="187" x2="300" y2="187" stroke="#333" stroke-width="2"/><circle cx="320" cy="180" r="20" fill="#2b5ea7" stroke="#111"/><line x1="320" y1="180" x2="320" y2="164" stroke="#fff" stroke-width="4" id="apot" stroke-linecap="round"/><text x="290" y="220" fill="var(--muted)" font-size="11">potenciômetro A0</text></svg>
 <div><div class="filters" role="group" aria-label="Programa">${[["blink","Piscar (Blink)"],["fade","Brilho (PWM)"],["pot","Potenciômetro"]].map(([k,l],i)=>`<button data-am="${k}" aria-pressed="${i===0}">${l}</button>`).join("")}</div>
 <div id="actrl"></div><div class="k">Código</div><pre class="console small" id="acode"></pre><div class="k">Monitor serial</div><pre class="console small serial" id="aser"></pre></div></div>`,
 mount(root){
  let mode="blink", d=500, pwm=128, pot=512, on=false, tmr=null, last=0;
  const ser=q(root,"#aser"); const print=s=>{ ser.textContent=(s+"\n"+ser.textContent).split("\n").slice(0,12).join("\n"); };
  function led13(v){ q(root,"#a13").setAttribute("fill", v?"#ffd60a":"#552"); }
  function led9(v){ q(root,"#a9").setAttribute("fill", v>0?"#ff3b30":"#5a1d1d"); q(root,"#a9g").setAttribute("opacity",(v/255*0.8).toFixed(2)); }
  function ctrl(){
    const c=q(root,"#actrl");
    if(mode==="blink") c.innerHTML=`<label class="f" for="ad">delay(${d}) · ${d} ms aceso e ${d} ms apagado<input type="range" id="ad" min="50" max="1500" step="50" value="${d}"></label>`;
    if(mode==="fade") c.innerHTML=`<label class="f" for="ap">analogWrite(9, <b>${pwm}</b>) · ${Math.round(pwm/255*100)}% do tempo ligado<input type="range" id="ap" min="0" max="255" value="${pwm}"></label>`;
    if(mode==="pot") c.innerHTML=`<label class="f" for="apo">Gire o potenciômetro: analogRead(A0) = <b>${pot}</b><input type="range" id="apo" min="0" max="1023" value="${pot}"></label>`;
  }
  function code(){
    const C={blink:`void setup() {\n  pinMode(13, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);  // liga\n  Serial.println("aceso");\n  delay(${d});\n  digitalWrite(13, LOW);   // desliga\n  Serial.println("apagado");\n  delay(${d});\n}`,
      fade:`void setup() {\n  pinMode(9, OUTPUT);\n}\n\nvoid loop() {\n  analogWrite(9, ${pwm});  // 0 a 255\n}`,
      pot:`void setup() {\n  pinMode(9, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int leitura = analogRead(A0);            // 0 a 1023\n  int brilho = map(leitura, 0, 1023, 0, 255);\n  analogWrite(9, brilho);\n  Serial.println(leitura);\n  delay(100);\n}`};
    q(root,"#acode").textContent=C[mode];
  }
  function apply(){
    clearInterval(tmr); led13(0); led9(0);
    if(mode==="blink"){ tmr=labEvery(()=>{ on=!on; led13(on); print(on?"aceso":"apagado"); }, d); }
    if(mode==="fade"){ led9(pwm); }
    if(mode==="pot"){ q(root,"#apot").setAttribute("transform",`rotate(${pot/1023*270-135} 320 180)`); led9(Math.round(pot/1023*255)); tmr=labEvery(()=>{ if(pot!==last){ last=pot; } print(String(pot)); },400); }
    ctrl(); code();
  }
  root.addEventListener("click", e=>{ const b=e.target.closest("[data-am]"); if(!b) return; mode=b.dataset.am; qa(root,"[data-am]").forEach(x=>x.setAttribute("aria-pressed", x===b)); ser.textContent=""; apply(); });
  root.addEventListener("input", e=>{
    if(e.target.id==="ad"){ d=+e.target.value; e.target.previousSibling.textContent=`delay(${d}) · ${d} ms aceso e ${d} ms apagado`; code(); clearInterval(tmr); tmr=labEvery(()=>{ on=!on; led13(on); print(on?"aceso":"apagado"); }, d); }
    if(e.target.id==="ap"){ pwm=+e.target.value; led9(pwm); e.target.parentElement.querySelector("b").textContent=pwm; code(); }
    if(e.target.id==="apo"){ pot=+e.target.value; e.target.parentElement.querySelector("b").textContent=pot; q(root,"#apot").setAttribute("transform",`rotate(${pot/1023*270-135} 320 180)`); led9(Math.round(pot/1023*255)); }
  });
  apply();
 }});

lab({id:"slicer", tr:"3d", area:"hw", title:"Fatiador 3D: camadas e preenchimento",
 blurb:"Mude altura de camada, paredes e preenchimento e veja tempo, filamento e cada camada da peça.",
 learn:["A impressora constrói a peça camada por camada, de baixo para cima.","Camadas finas dão mais detalhe e demoram mais.","Preenchimento (infill) troca resistência por tempo e filamento."],
 html:()=>`<div class="slicer"><div><div class="row wrap"><canvas id="ctop" aria-label="Vista de cima da camada"></canvas><canvas id="cside" aria-label="Vista lateral das camadas"></canvas></div>
 <label class="f" for="slay">Ver camada <b id="slayv"></b><input type="range" id="slay" min="1" value="1"></label></div>
 <div><label class="f" for="sshape">Peça (20 mm)<select id="sshape"><option value="cubo">Cubo</option><option value="cil">Cilindro</option><option value="pir">Pirâmide</option></select></label>
 <label class="f" for="slh">Altura da camada<select id="slh">${[0.08,0.12,0.16,0.2,0.24,0.28].map(v=>`<option ${v===0.2?"selected":""} value="${v}">${String(v).replace(".",",")} mm${v===0.2?" (padrão)":""}</option>`).join("")}</select></label>
 <label class="f" for="swall">Paredes: <b id="swallv"></b><input type="range" id="swall" min="1" max="5" value="2"></label>
 <label class="f" for="sinf">Preenchimento: <b id="sinfv"></b><input type="range" id="sinf" min="0" max="100" step="5" value="15"></label>
 <div class="readout"><div><span class="k">Camadas</span><b id="sly"></b></div><div><span class="k">Tempo estimado</span><b id="stime"></b></div><div><span class="k">Filamento PLA</span><b id="sgr"></b></div></div>
 <div class="note" id="snote2"></div></div></div>`,
 mount(root){
  const ct=setupCanvas(q(root,"#ctop"),220,220), cs=setupCanvas(q(root,"#cside"),140,220);
  function sizeAt(shape,h){ return shape==="pir" ? 20*(1-h/20) : 20; }
  function calc(){
    const shape=q(root,"#sshape").value, lh=+q(root,"#slh").value, walls=+q(root,"#swall").value, inf=+q(root,"#sinf").value;
    const layers=Math.round(20/lh); const sl=q(root,"#slay"); sl.max=layers; if(+sl.value>layers) sl.value=layers;
    const vol={cubo:8000,cil:Math.PI*100*20,pir:8000/3}[shape], area={cubo:2400,cil:2*Math.PI*100+2*Math.PI*10*20,pir:400+4*(0.5*20*Math.hypot(10,20))}[shape];
    const shell=Math.min(vol, area*0.42*walls*0.9), used=shell+(vol-shell)*inf/100, grams=used/1000*1.24;
    const secs=used/9+layers*3; const m=Math.round(secs/60);
    q(root,"#sly").textContent=layers; q(root,"#stime").textContent=m>=60?`${Math.floor(m/60)} h ${m%60} min`:`${m} min`; q(root,"#sgr").textContent=`${grams.toFixed(1)} g`;
    q(root,"#swallv").textContent=walls; q(root,"#sinfv").textContent=inf+"%"; q(root,"#slayv").textContent=`${sl.value} de ${layers} (altura ${(sl.value*lh).toFixed(2).replace(".",",")} mm)`;
    q(root,"#snote2").textContent = inf===0 ? "0% de preenchimento: a peça fica oca, só com paredes. Leve, mas frágil." : inf>=60 ? "Preenchimento alto: muito resistente, mas gasta muito mais tempo e filamento. Raramente é necessário." : lh<=0.12 ? "Camadas finas: acabamento lindo, mas o tempo aumenta bastante." : "Configuração equilibrada para a maioria das peças.";
    drawTop(shape, +sl.value*lh, walls, inf); drawSide(shape, lh, +sl.value);
  }
  function drawTop(shape,h,walls,inf){
    const c=ct, W=220, cx=110, cy=110, s=sizeAt(shape,h), sc=8.5, half=s/2*sc; c.clearRect(0,0,W,W);
    c.fillStyle=css("--muted"); c.font="11px system-ui"; c.fillText("vista de cima",8,14);
    c.save(); c.beginPath(); if(shape==="cil") c.arc(cx,cy,half,0,7); else c.rect(cx-half,cy-half,half*2,half*2); c.clip();
    c.strokeStyle=css("--accent"); c.globalAlpha=.7; c.lineWidth=1; const gap = inf>0 ? Math.max(3, 30/(inf/10+0.5)) : 9999;
    for(let x=-W;x<W*2;x+=gap){ c.beginPath(); c.moveTo(x,0); c.lineTo(x+W,W); c.stroke(); c.beginPath(); c.moveTo(x+W,0); c.lineTo(x,W); c.stroke(); }
    c.restore(); c.globalAlpha=1; c.strokeStyle=css("--warn"); c.lineWidth=2.2;
    for(let w=0;w<walls;w++){ const r=half-w*3.6; if(r<=2) break; c.beginPath(); if(shape==="cil") c.arc(cx,cy,r,0,7); else c.rect(cx-r,cy-r,r*2,r*2); c.stroke(); }
  }
  function drawSide(shape,lh,cur){
    const c=cs, W=140, H=220, base=200, sc=8.5, n=Math.round(20/lh); c.clearRect(0,0,W,H); c.fillStyle=css("--muted"); c.font="11px system-ui"; c.fillText("vista lateral",8,14);
    for(let i=0;i<n;i++){ const y0=base-(i+1)*lh*sc, s=sizeAt(shape,(i+.5)*lh)*sc/2; c.fillStyle= i<cur ? (i===cur-1?css("--mark"):css("--accent")) : css("--line"); c.globalAlpha= i<cur?0.85:0.5; c.fillRect(70-s,y0,s*2,Math.max(1,lh*sc-0.6)); }
    c.globalAlpha=1; c.fillStyle=css("--ink"); c.fillRect(10,base,120,4);
  }
  root.addEventListener("input", calc); root.addEventListener("change", calc); calc();
 }});
})();
