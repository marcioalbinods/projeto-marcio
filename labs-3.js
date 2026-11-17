(function(){
const q = (r,s) => r.querySelector(s), qa = (r,s) => [...r.querySelectorAll(s)];
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
const ls = { get(k,d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }, set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} } };

Object.assign(STEP_LABS, {c4:["auto"], c5:["pyrun"], c6:["objects"], c7:["pandas"], g4:["interview"], m8:["obi"]});
["c2","c3"].forEach(k => { STEP_LABS[k] = (STEP_LABS[k]||[]).concat("pyrun"); });
["c4","c5","c6","c7","g4","m8"].forEach(k => delete PLANNED[k]);

const st = document.createElement("style");
st.textContent = `
.pyw{display:grid;grid-template-columns:240px 1fr;gap:14px}@media (max-width:860px){.pyw{grid-template-columns:1fr}}
.exlist{display:grid;gap:4px;align-content:start}.exlist button{text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:8px;padding:8px 10px;cursor:pointer;font-size:14px;display:flex;justify-content:space-between;gap:6px}.exlist button[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent)}.exlist .ok{color:var(--ok);font-weight:800}
textarea.py{font-family:var(--mono);font-size:14px;min-height:220px;background:#0f1520;color:#d8e1f0;border:0;border-radius:10px;padding:12px;margin:0;tab-size:4}
.tests{display:grid;gap:4px}.tests div{font:13px var(--mono);padding:6px 10px;border-radius:8px;background:var(--paper);border-left:4px solid var(--line)}.tests .pass{border-left-color:var(--ok)}.tests .fail{border-left-color:#c0392b}
.pystatus{font-size:13px;color:var(--muted)}
.mem{display:grid;grid-template-columns:180px 1fr;gap:16px;align-items:start}@media (max-width:760px){.mem{grid-template-columns:1fr}}
.vars2{display:grid;gap:6px}.var{border:2px solid var(--line);border-radius:8px;padding:6px 10px;font:600 14px var(--mono);background:var(--surface);display:flex;justify-content:space-between}
.heap{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}.obj{border:2px solid var(--accent);border-radius:12px;padding:10px;background:var(--surface);font:13px var(--mono)}.obj.hl{box-shadow:0 0 0 4px var(--mark)}.obj .addr{color:var(--muted);font-size:11px}.obj b{font-family:var(--display);font-size:16px}
.chips{display:flex;gap:4px;flex-wrap:wrap}.chips span{font:12px var(--mono);background:var(--accent-soft);color:var(--accent);border-radius:6px;padding:2px 6px}
.hbars{display:grid;gap:6px}.hbar{display:grid;grid-template-columns:110px 1fr 50px;gap:8px;align-items:center;font-size:14px}.hbar .bar{height:16px}
`;
document.head.appendChild(st);

const PYV = "0.26.4";
let pyPromise = null;
function loadPy(){
  if (!pyPromise){
    pyPromise = new Promise((res, rej) => {
      const go = async () => { try { res(await window.loadPyodide({indexURL:`https://cdn.jsdelivr.net/pyodide/v${PYV}/full/`})); } catch(e){ rej(e); } };
      if (window.loadPyodide) return go();
      const s = document.createElement("script"); s.src = `https://cdn.jsdelivr.net/pyodide/v${PYV}/full/pyodide.js`; s.onload = go; s.onerror = () => rej(new Error("Não consegui baixar o Python. Verifique a internet."));
      document.head.appendChild(s);
    });
    pyPromise.catch(() => { pyPromise = null; });
  }
  return pyPromise;
}
const ERRS = {SyntaxError:"Erro de sintaxe: algo foi escrito fora das regras (faltou dois-pontos, parêntese ou aspas?).",IndentationError:"Erro de indentação: os espaços no início da linha estão errados. Blocos dentro de if, for e def precisam de 4 espaços.",NameError:"Nome não encontrado: você usou uma variável ou função que não existe. Confira a escrita.",TypeError:"Tipo errado: você misturou tipos, como somar texto com número. Use int() ou str().",ValueError:"Valor inválido: por exemplo, int('abc'). Confira o que foi digitado.",ZeroDivisionError:"Divisão por zero.",IndexError:"Índice fora da lista: lembre que a contagem começa em 0.",KeyError:"Chave não encontrada no dicionário.",AttributeError:"Esse tipo não tem o atributo ou método que você chamou.",EOFError:"O programa pediu mais input() do que foi fornecido na Entrada."};
function explain(msg){
  const lines = String(msg).trim().split("\n").filter(l => !l.includes("/lib/python") && !l.includes("_pyodide") && !l.includes("pyodide.ffi"));
  const last = lines[lines.length-1] || ""; const kind = (last.match(/^(\w+Error)/)||[])[1];
  const ln = (String(msg).match(/line (\d+)/g)||[]).pop();
  return {text: last, tip: kind && ERRS[kind] ? ERRS[kind] + (ln ? ` (${ln.replace("line","linha")})` : "") : ""};
}
async function runPy(code, stdin){
  const py = await loadPy();
  let out = ""; const lines = String(stdin||"").split("\n"); let li = 0;
  py.setStdout({batched: s => { out += s + "\n"; }}); py.setStderr({batched: s => { out += s + "\n"; }});
  py.setStdin({stdin: () => li < lines.length ? lines[li++] : null});
  const ns = py.globals.get("dict")();
  try { await py.runPythonAsync(code, {globals: ns}); return {ok:true, out}; }
  catch(e){ return {ok:false, out, err: explain(e.message)}; }
  finally { try { ns.destroy(); } catch(e){} }
}
const HARNESS = String.raw`
import json as __j
__r = []
for __expr, __exp in __T:
    try:
        __got = eval(__expr)
        __r.append([__expr, repr(__got), __got == eval(__exp), __exp])
    except Exception as __e:
        __r.append([__expr, type(__e).__name__ + ": " + str(__e), False, __exp])
print("@@" + __j.dumps(__r))
`;
const norm = s => String(s).replace(/\r/g,"").split("\n").map(l => l.replace(/\s+$/,"")).join("\n").trim();

function pyLab(def){
  lab({id:def.id, tr:def.tr, area:"sw", title:def.title, blurb:def.blurb, learn:def.learn,
   html:()=>`<div class="pyw"><div class="exlist" id="xlist"></div><div class="grid" style="gap:10px">
    <div><h3 id="xtitle" style="font-family:var(--display)"></h3><p id="xdesc" class="tw"></p></div>
    <label class="k" for="xcode">Seu código Python</label><textarea id="xcode" class="py" spellcheck="false"></textarea>
    <div id="xinwrap"><label class="k" for="xin">Entrada (o que o input() vai ler, uma linha por vez)</label><textarea id="xin" class="code" style="min-height:60px;font-family:var(--mono);font-size:13px"></textarea></div>
    <div class="row wrap"><button class="btn" id="xrun">▶ Executar</button><button class="btn ghost" id="xcheck">✓ Corrigir</button><button class="btn ghost sm" id="xhint">Dica</button><button class="btn ghost sm" id="xsol">Ver solução</button><span class="pystatus" id="xstat"></span></div>
    <div class="k">Saída</div><pre class="console" id="xout"></pre><div class="tests" id="xtests"></div><div id="xnote"></div></div></div>`,
   mount(root){
    const EX = def.exercises; const KEY = "pp-py-"+def.id;
    let solved = ls.get(KEY+"-ok", {}), drafts = ls.get(KEY+"-code", {}), cur = 0, tries = 0;
    function list(){ q(root,"#xlist").innerHTML = EX.map((x,i)=>`<button data-x="${i}" aria-pressed="${i===cur}"><span>${i+1}. ${esc(x.t)}</span>${solved[x.id]?'<span class="ok">✓</span>':""}</button>`).join("") + `<p class="small muted">${Object.keys(solved).filter(k=>EX.some(x=>x.id===k)).length} de ${EX.length} resolvidos</p>`; }
    function load(i){ cur=i; tries=0; const x=EX[i]; q(root,"#xtitle").textContent=x.t; q(root,"#xdesc").innerHTML=x.d; q(root,"#xcode").value=drafts[x.id]??x.start; q(root,"#xinwrap").style.display=x.stdin?"":"none"; q(root,"#xin").value=x.stdin?x.stdin[0][0]:""; q(root,"#xout").textContent=""; q(root,"#xtests").innerHTML=""; q(root,"#xnote").innerHTML=""; list(); }
    function stat(t){ q(root,"#xstat").textContent=t; }
    async function exec(code, stdin){ stat("Carregando o Python… (só demora na primeira vez)"); try { const r = await runPy(code, stdin); stat(""); return r; } catch(e){ stat(e.message); return null; } }
    function showErr(r){ if(!r.ok) q(root,"#xnote").innerHTML=`<div class="note"><b class="warntext">${esc(r.err.text)}</b><br>${esc(r.err.tip||"Leia a mensagem: ela diz o tipo do erro e a linha.")}</div>`; }
    root.addEventListener("input", e=>{ if(e.target.id==="xcode"){ drafts[EX[cur].id]=e.target.value; ls.set(KEY+"-code", drafts); } });
    root.addEventListener("keydown", e=>{ if(e.target.id==="xcode"&&e.key==="Tab"){ e.preventDefault(); e.target.setRangeText("    ", e.target.selectionStart, e.target.selectionEnd, "end"); } });
    root.addEventListener("click", async e=>{
      const b=e.target.closest("[data-x]"); if(b){ load(+b.dataset.x); return; }
      const x=EX[cur];
      if(e.target.id==="xrun"){ q(root,"#xnote").innerHTML=""; q(root,"#xtests").innerHTML=""; const r=await exec(q(root,"#xcode").value, q(root,"#xin").value); if(!r) return; q(root,"#xout").textContent=r.out||"(sem saída)"; showErr(r); }
      if(e.target.id==="xcheck"){
        tries++; q(root,"#xnote").innerHTML=""; const code=q(root,"#xcode").value; const res=[];
        if(x.stdin){ for(const [inp,exp] of x.stdin){ const r=await exec(code, inp); if(!r) return; res.push({name:`entrada: ${inp.replace(/\n/g," | ")||"(vazia)"}`, got:r.ok?norm(r.out):r.err.text, exp:norm(exp), pass:r.ok&&norm(r.out)===norm(exp)}); if(!r.ok){ showErr(r); break; } } }
        else { const r=await exec(code+"\n__T = "+JSON.stringify(x.tests)+"\n"+HARNESS, ""); if(!r) return; if(!r.ok){ q(root,"#xout").textContent=r.out; showErr(r); return; }
          const line=r.out.split("\n").find(l=>l.startsWith("@@")); JSON.parse(line.slice(2)).forEach(([ex,got,pass,expv])=>res.push({name:ex,got,exp:expv,pass})); q(root,"#xout").textContent=r.out.split("\n").filter(l=>!l.startsWith("@@")).join("\n")||"(sem saída)"; }
        const all=res.length&&res.every(t=>t.pass);
        q(root,"#xtests").innerHTML=res.map(t=>`<div class="${t.pass?"pass":"fail"}">${t.pass?"✓":"✗"} ${esc(t.name)}${t.pass?"":`<br>esperado: ${esc(t.exp)}<br>obtido: ${esc(t.got)}`}</div>`).join("");
        if(all){ solved[x.id]=true; ls.set(KEY+"-ok", solved); list(); q(root,"#xnote").innerHTML=`<div class="note"><b class="oktext">Todos os testes passaram!</b> ${cur<EX.length-1?'<button class="btn sm" id="xnext">Próximo exercício</button>':"Você terminou esta lista."}</div>`; toast("Exercício resolvido!"); }
        else if(!q(root,"#xnote").innerHTML) q(root,"#xnote").innerHTML=`<div class="note">Alguns testes falharam. Compare o esperado com o obtido.${tries>=2?" Que tal ver a dica?":""}</div>`;
      }
      if(e.target.id==="xhint") q(root,"#xnote").innerHTML=`<div class="note"><b>Dica:</b> ${esc(x.hint)}</div>`;
      if(e.target.id==="xsol"){ if(tries<1){ q(root,"#xnote").innerHTML=`<div class="note">Tente corrigir pelo menos uma vez antes de ver a solução. É na tentativa que você aprende.</div>`; return; } q(root,"#xnote").innerHTML=`<div class="k">Uma solução possível</div><pre class="console">${esc(x.sol)}</pre><p class="small muted">Agora apague e escreva de novo sem olhar.</p>`; }
      if(e.target.id==="xnext") load(cur+1);
    });
    load(0);
   }});
}

pyLab({id:"pyrun", tr:"python", title:"Python de verdade: exercícios corrigidos",
 blurb:"Escreva Python, execute no navegador e clique em Corrigir: testes automáticos dizem se está certo, como num juiz online.",
 learn:["Este é Python 3 de verdade, rodando no seu navegador.","Os testes conferem casos que você nem pensou: é assim que se garante que o código funciona.","Leia as mensagens de erro: elas dizem o tipo do problema e a linha."],
 exercises:[
  {id:"ola",t:"Olá, mundo",d:"Mostre exatamente <code>Olá, mundo!</code> na tela.",start:"# escreva seu código aqui\n",stdin:[["","Olá, mundo!"]],hint:"Use print() com o texto entre aspas.",sol:'print("Olá, mundo!")'},
  {id:"dobro",t:"O dobro",d:"Leia um número inteiro com <code>input()</code> e mostre o dobro dele.",start:"n = int(input())\n",stdin:[["4","8"],["10","20"],["-3","-6"]],hint:"input() devolve texto. int() transforma em número. Depois é só multiplicar por 2.",sol:"n = int(input())\nprint(n * 2)"},
  {id:"situ",t:"Situação do aluno",d:"Crie a função <code>situacao(n1, n2)</code>. Ela devolve <code>\"Aprovado\"</code> se a média for 7 ou mais, <code>\"Recuperação\"</code> se for 5 ou mais, e <code>\"Reprovado\"</code> nos outros casos.",start:"def situacao(n1, n2):\n    media = (n1 + n2) / 2\n    # complete\n",tests:[["situacao(8, 7)","'Aprovado'"],["situacao(7, 7)","'Aprovado'"],["situacao(5, 6)","'Recuperação'"],["situacao(5, 5)","'Recuperação'"],["situacao(2, 4)","'Reprovado'"]],hint:"Use if, elif e else, nessa ordem, do maior para o menor. E lembre do return.",sol:"def situacao(n1, n2):\n    media = (n1 + n2) / 2\n    if media >= 7:\n        return \"Aprovado\"\n    elif media >= 5:\n        return \"Recuperação\"\n    else:\n        return \"Reprovado\""},
  {id:"par",t:"Par ou ímpar",d:"Crie <code>eh_par(n)</code>, que devolve <code>True</code> se n for par e <code>False</code> se for ímpar.",start:"def eh_par(n):\n    pass\n",tests:[["eh_par(4)","True"],["eh_par(7)","False"],["eh_par(0)","True"],["eh_par(-2)","True"]],hint:"O operador % dá o resto da divisão. Número par tem resto 0 quando dividido por 2.",sol:"def eh_par(n):\n    return n % 2 == 0"},
  {id:"tab",t:"Tabuada",d:"Leia um número n e mostre a tabuada dele de 1 a 10, no formato <code>n x i = resultado</code>.",start:"n = int(input())\n",stdin:[["3","3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30"],["7","7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70"]],hint:"Use for i in range(1, 11): e um print com f-string: f\"{n} x {i} = {n*i}\".",sol:"n = int(input())\nfor i in range(1, 11):\n    print(f\"{n} x {i} = {n * i}\")"},
  {id:"vogais",t:"Contar vogais",d:"Crie <code>vogais(texto)</code>, que conta quantas vogais (a, e, i, o, u, maiúsculas ou minúsculas) existem no texto.",start:"def vogais(texto):\n    total = 0\n    # percorra cada letra\n    return total\n",tests:[["vogais('Marcio')","3"],["vogais('PYTHON')","1"],["vogais('xyz')","0"],["vogais('')","0"]],hint:"Percorra com for letra in texto.lower(): e teste se letra in 'aeiou'.",sol:"def vogais(texto):\n    total = 0\n    for letra in texto.lower():\n        if letra in \"aeiou\":\n            total += 1\n    return total"},
  {id:"maior",t:"Maior da lista sem max()",d:"Crie <code>maior(lista)</code> sem usar a função max(). Devolve o maior número da lista.",start:"def maior(lista):\n    pass\n",tests:[["maior([3, 9, 2])","9"],["maior([-5, -1, -9])","-1"],["maior([7])","7"]],hint:"Comece com m = lista[0] e troque m sempre que achar alguém maior. Cuidado: começar com 0 falha com números negativos.",sol:"def maior(lista):\n    m = lista[0]\n    for x in lista:\n        if x > m:\n            m = x\n    return m"},
  {id:"pali",t:"Palíndromo",d:"Crie <code>palindromo(p)</code>: devolve True se a palavra for igual de trás para frente, ignorando maiúsculas.",start:"def palindromo(p):\n    pass\n",tests:[["palindromo('Arara')","True"],["palindromo('ovo')","True"],["palindromo('python')","False"]],hint:"p[::-1] inverte um texto. Use .lower() antes de comparar.",sol:"def palindromo(p):\n    p = p.lower()\n    return p == p[::-1]"}
 ]});

pyLab({id:"interview", tr:"algo", title:"Problemas de entrevista",
 blurb:"Problemas clássicos de processos seletivos, com testes automáticos e dicas sobre eficiência (Big O).",
 learn:["Entrevistas avaliam como você pensa, não só se o código roda.","Primeiro faça funcionar, depois deixe eficiente.","Dicionários (hash) transformam buscas lentas em buscas instantâneas."],
 exercises:[
  {id:"fizz",t:"FizzBuzz",d:"Crie <code>fizzbuzz(n)</code> que devolve uma lista de 1 a n, trocando múltiplos de 3 por \"Fizz\", de 5 por \"Buzz\" e de ambos por \"FizzBuzz\".",start:"def fizzbuzz(n):\n    res = []\n    return res\n",tests:[["fizzbuzz(5)","[1, 2, 'Fizz', 4, 'Buzz']"],["fizzbuzz(15)[-1]","'FizzBuzz'"],["len(fizzbuzz(30))","30"]],hint:"Teste o caso de 15 (3 e 5) antes dos outros.",sol:"def fizzbuzz(n):\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0: res.append(\"FizzBuzz\")\n        elif i % 3 == 0: res.append(\"Fizz\")\n        elif i % 5 == 0: res.append(\"Buzz\")\n        else: res.append(i)\n    return res"},
  {id:"twosum",t:"Two Sum",d:"Crie <code>dois_somam(nums, alvo)</code>: devolve os índices [i, j] de dois números que somam o alvo. Desafio: faça em O(n) com um dicionário.",start:"def dois_somam(nums, alvo):\n    pass\n",tests:[["dois_somam([2, 7, 11, 15], 9)","[0, 1]"],["dois_somam([3, 2, 4], 6)","[1, 2]"],["dois_somam([1, 5, 3, 7], 10)","[2, 3]"]],hint:"Guarde num dicionário {valor: índice}. Para cada número x, procure alvo - x no dicionário.",sol:"def dois_somam(nums, alvo):\n    vistos = {}\n    for i, x in enumerate(nums):\n        if alvo - x in vistos:\n            return [vistos[alvo - x], i]\n        vistos[x] = i"},
  {id:"anag",t:"Anagramas",d:"Crie <code>anagrama(a, b)</code>: True se as palavras têm as mesmas letras nas mesmas quantidades, como “roma” e “amor”.",start:"def anagrama(a, b):\n    pass\n",tests:[["anagrama('roma', 'amor')","True"],["anagrama('Pedra', 'Padre')","True"],["anagrama('gato', 'pato')","False"]],hint:"Ordenar as letras é O(n log n). Contar com um dicionário é O(n).",sol:"def anagrama(a, b):\n    return sorted(a.lower()) == sorted(b.lower())"},
  {id:"freq",t:"Palavra mais frequente",d:"Crie <code>mais_frequente(texto)</code> que devolve a palavra que mais aparece (em minúsculas).",start:"def mais_frequente(texto):\n    pass\n",tests:[["mais_frequente('a b a c a b')","'a'"],["mais_frequente('Oi oi tchau')","'oi'"]],hint:"Use um dicionário para contar: cont[p] = cont.get(p, 0) + 1.",sol:"def mais_frequente(texto):\n    cont = {}\n    for p in texto.lower().split():\n        cont[p] = cont.get(p, 0) + 1\n    return max(cont, key=cont.get)"},
  {id:"bsearch",t:"Busca binária",d:"Crie <code>busca(lista, x)</code> numa lista ordenada. Devolve o índice de x ou -1. Precisa ser O(log n): nada de percorrer tudo.",start:"def busca(lista, x):\n    ini, fim = 0, len(lista) - 1\n    # enquanto ini <= fim...\n    return -1\n",tests:[["busca([1, 3, 5, 7, 9, 11], 7)","3"],["busca([1, 3, 5, 7, 9, 11], 1)","0"],["busca([1, 3, 5, 7, 9, 11], 4)","-1"],["busca(list(range(0, 1000000, 2)), 777776)","388888"]],hint:"Olhe o meio. Se x for maior, descarte a metade da esquerda; se for menor, a da direita.",sol:"def busca(lista, x):\n    ini, fim = 0, len(lista) - 1\n    while ini <= fim:\n        meio = (ini + fim) // 2\n        if lista[meio] == x: return meio\n        if lista[meio] < x: ini = meio + 1\n        else: fim = meio - 1\n    return -1"},
  {id:"parens",t:"Parênteses balanceados",d:"Crie <code>balanceado(s)</code>: True se (), [] e {} abrem e fecham na ordem certa.",start:"def balanceado(s):\n    pilha = []\n    return True\n",tests:[["balanceado('([]{})')","True"],["balanceado('([)]')","False"],["balanceado('((')","False"],["balanceado('')","True"]],hint:"Use uma pilha: empilhe quem abre; ao fechar, o topo precisa ser o par correspondente.",sol:"def balanceado(s):\n    pares = {')': '(', ']': '[', '}': '{'}\n    pilha = []\n    for c in s:\n        if c in '([{':\n            pilha.append(c)\n        elif c in pares:\n            if not pilha or pilha.pop() != pares[c]:\n                return False\n    return not pilha"}
 ]});

pyLab({id:"obi", tr:"prof", title:"Problemas no estilo da OBI",
 blurb:"Problemas de entrada e saída como os da Olímpiada Brasileira de Informática. Ótimos para você e para treinar alunos.",
 learn:["Na OBI, o programa lê a entrada e escreve a saída exatamente no formato pedido.","Cada problema é testado com vários casos escondidos.","Ler o enunciado com calma é metade da solução."],
 exercises:[
  {id:"lanche",t:"Fila do lanche",d:"A primeira linha tem N, o número de alunos. A segunda tem N números: quanto cada um gastou. Mostre o total gasto.",start:"n = int(input())\nvalores = list(map(int, input().split()))\n",stdin:[["3\n5 10 2","17"],["1\n40","40"],["5\n1 1 1 1 1","5"]],hint:"sum() soma uma lista inteira.",sol:"n = int(input())\nvalores = list(map(int, input().split()))\nprint(sum(valores))"},
  {id:"acima",t:"Acima da média",d:"Leia N e depois N notas inteiras, uma por linha. Mostre quantos alunos tiveram nota maior que a média da turma.",start:"n = int(input())\nnotas = []\n",stdin:[["4\n5\n7\n9\n3","2"],["3\n6\n6\n6","0"],["5\n10\n0\n0\n0\n0","1"]],hint:"Primeiro guarde todas as notas numa lista. Depois calcule a média. Só então conte.",sol:"n = int(input())\nnotas = [int(input()) for _ in range(n)]\nmedia = sum(notas) / n\nprint(sum(1 for x in notas if x > media))"},
  {id:"cedulas",t:"Troco com menos cédulas",d:"Leia um valor inteiro em reais. Mostre o menor número de cédulas e moedas de 100, 50, 20, 10, 5, 2 e 1 necessárias.",start:"v = int(input())\n",stdin:[["186","5"],["7","2"],["100","1"],["0","0"]],hint:"Comece pela maior cédula: use // para saber quantas cabem e % para o que sobra.",sol:"v = int(input())\ntotal = 0\nfor c in [100, 50, 20, 10, 5, 2, 1]:\n    total += v // c\n    v %= c\nprint(total)"},
  {id:"seq",t:"Maior sequência crescente",d:"Leia N e depois N números numa linha. Mostre o tamanho da maior sequência de números seguidos em que cada um é maior que o anterior.",start:"n = int(input())\nv = list(map(int, input().split()))\n",stdin:[["6\n1 2 3 1 2 1","3"],["5\n5 4 3 2 1","1"],["4\n1 2 3 4","4"]],hint:"Guarde o tamanho da sequência atual e o melhor já visto. Se v[i] > v[i-1], a atual cresce; senão, volta para 1.",sol:"n = int(input())\nv = list(map(int, input().split()))\natual = melhor = 1\nfor i in range(1, n):\n    atual = atual + 1 if v[i] > v[i-1] else 1\n    melhor = max(melhor, atual)\nprint(melhor)"},
  {id:"robo",t:"Robô na grade",d:"O robô começa em (0, 0). Leia uma linha com comandos N, S, L e O (norte, sul, leste, oeste). Mostre a posição final x e y separados por espaço.",start:"cmds = input()\nx, y = 0, 0\n",stdin:[["NNLL","2 2"],["NSLO","0 0"],["OOOS","-3 -1"]],hint:"Percorra cada letra e some ou subtraia 1 de x ou de y.",sol:"cmds = input()\nx, y = 0, 0\nfor c in cmds:\n    if c == 'N': y += 1\n    elif c == 'S': y -= 1\n    elif c == 'L': x += 1\n    elif c == 'O': x -= 1\nprint(x, y)"}
 ]});

const AUTO_CSV = "nome,turma,n1,n2,faltas\nAna,8A,8.5,9.0,2\nBruno,8B,6.0,4.5,5\nCarla,8A,9.2,9.8,0\nDiego,8B,4.0,5.5,9\nEva,8A,7.0,6.5,1\nFábio,8C,5.0,6.0,4\nGabi,8C,10,9.5,0";
const AUTO_PY = String.raw`import csv, io

# Em um projeto real, o texto viria de um arquivo: open("notas.csv")
leitor = csv.DictReader(io.StringIO(DADOS))

relatorio = []
for aluno in leitor:
    media = (float(aluno["n1"]) + float(aluno["n2"])) / 2
    if media >= 7:
        situacao = "Aprovado"
    elif media >= 5:
        situacao = "Recuperação"
    else:
        situacao = "Reprovado"
    if int(aluno["faltas"]) > 6:
        situacao += " (atenção: faltas)"
    relatorio.append((aluno["nome"], aluno["turma"], round(media, 1), situacao))

relatorio.sort(key=lambda linha: linha[2], reverse=True)

print("RELATÓRIO DA TURMA")
print("-" * 44)
for nome, turma, media, situacao in relatorio:
    print(f"{nome:<8} {turma:<4} {media:>5}  {situacao}")
print("-" * 44)
aprovados = sum(1 for r in relatorio if r[3].startswith("Aprovado"))
print(f"Aprovados: {aprovados} de {len(relatorio)}")
`;
lab({id:"auto", tr:"python", area:"sw", title:"Automação: o relatório da turma em segundos",
 blurb:"Um script Python lê a planilha de notas, calcula médias, aponta quem tem muitas faltas e gera o relatório. Mude os dados ou o código e rode de novo.",
 learn:["Automação é ensinar o computador a fazer a tarefa repetitiva por você.","CSV é o formato que Excel e Google Planilhas exportam.","O mesmo script funciona com 7 ou com 700 alunos."],
 html:()=>`<div class="two-even"><div><label class="k" for="acsv">Planilha (CSV exportado do Google Planilhas)</label><textarea id="acsv" class="code" style="font-family:var(--mono);font-size:13px;min-height:200px">${esc(AUTO_CSV)}</textarea></div>
 <div><label class="k" for="apy">Script Python</label><textarea id="apy" class="py" spellcheck="false">${esc(AUTO_PY)}</textarea></div></div>
 <div class="row wrap"><button class="btn" id="arun">▶ Gerar relatório</button><button class="btn ghost sm" id="arst">Restaurar original</button><span class="pystatus" id="astat"></span></div>
 <pre class="console" id="aout" style="min-height:160px"></pre><div id="anote"></div>
 <div class="note small">Desafios: (1) troque a regra de faltas de 6 para 4. (2) Adicione uma coluna com a nota que falta para chegar a 7. (3) Mostre a média de cada turma.</div>`,
 mount(root){
  root.addEventListener("keydown", e=>{ if(e.target.id==="apy"&&e.key==="Tab"){ e.preventDefault(); e.target.setRangeText("    ", e.target.selectionStart, e.target.selectionEnd, "end"); } });
  root.addEventListener("click", async e=>{
    if(e.target.id==="arst"){ q(root,"#acsv").value=AUTO_CSV; q(root,"#apy").value=AUTO_PY; }
    if(e.target.id!=="arun") return;
    q(root,"#astat").textContent="Carregando o Python… (só demora na primeira vez)"; q(root,"#anote").innerHTML="";
    try { const r=await runPy("DADOS = "+JSON.stringify(q(root,"#acsv").value)+"\n"+q(root,"#apy").value,""); q(root,"#astat").textContent=""; q(root,"#aout").textContent=r.out||"(sem saída)"; if(!r.ok) q(root,"#anote").innerHTML=`<div class="note"><b class="warntext">${esc(r.err.text)}</b><br>${esc(r.err.tip)}</div>`; }
    catch(err){ q(root,"#astat").textContent=err.message; }
  });
 }});

lab({id:"objects", tr:"python", area:"sw", title:"Classes e objetos na memória",
 blurb:"Crie alunos a partir da classe Aluno, chame métodos e veja variáveis apontando para objetos na memória, inclusive duas variáveis para o mesmo objeto.",
 learn:["A classe é o molde; o objeto é cada aluno criado a partir dele.","Variáveis guardam uma referência (um endereço), não o objeto em si.","b = a não copia: as duas variáveis passam a apontar para o mesmo objeto."],
 html:()=>`<div class="two-even"><div><div class="k">A classe (o molde)</div><pre class="console small">class Aluno:
    def __init__(self, nome):
        self.nome = nome
        self.notas = []

    def adicionar_nota(self, n):
        self.notas.append(n)

    def media(self):
        if not self.notas:
            return 0
        return sum(self.notas) / len(self.notas)</pre></div>
 <div class="grid" style="gap:8px"><div class="k">Ações</div>
  <div class="row wrap"><input id="onome" value="Ana" aria-label="Nome do aluno" style="width:8em"><input id="ovar" value="a" aria-label="Nome da variável" style="width:4em"><button class="btn sm" id="onew">Criar objeto</button></div>
  <div class="row wrap"><select id="osel" aria-label="Variável"></select><input id="onota" type="number" value="8" step="0.5" aria-label="Nota" style="width:5em"><button class="btn ghost sm" id="oadd">.adicionar_nota()</button><button class="btn ghost sm" id="omed">.media()</button></div>
  <div class="row wrap"><input id="onv" value="b" aria-label="Nova variável" style="width:4em"><span>=</span><select id="osel2" aria-label="Variável existente"></select><button class="btn ghost sm" id="oalias">Atribuir (sem copiar)</button></div>
  <pre class="console small" id="olog" style="min-height:90px"></pre></div></div>
 <div class="k">Memória</div><div class="mem"><div><div class="small muted">Variáveis</div><div class="vars2" id="ovars"></div></div><div><div class="small muted">Objetos</div><div class="heap" id="oheap"></div></div></div><div class="note" id="onote3">Crie um objeto para começar. Depois crie b = a e adicione uma nota usando b: veja o que acontece com a.</div>`,
 mount(root){
  let objs=[], vars={}, hl=null;
  const addr=()=>"0x7f"+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0");
  const log=s=>{ q(root,"#olog").textContent=s+"\n"+q(root,"#olog").textContent; };
  function draw(){
    const names=Object.keys(vars); const opts=names.map(n=>`<option>${esc(n)}</option>`).join("");
    q(root,"#osel").innerHTML=opts; q(root,"#osel2").innerHTML=opts;
    q(root,"#ovars").innerHTML=names.map(n=>{ const o=objs[vars[n]]; return `<div class="var"><span>${esc(n)}</span><span class="muted">→ ${o.addr}</span></div>`; }).join("")||'<span class="small muted">nenhuma</span>';
    q(root,"#oheap").innerHTML=objs.map((o,i)=>{ const refs=names.filter(n=>vars[n]===i); return `<div class="obj ${hl===i?"hl":""}"><span class="addr">objeto Aluno · ${o.addr}</span><br><b>${esc(o.nome)}</b><br>notas = [${o.notas.join(", ")}]<div class="chips" style="margin-top:6px">${refs.map(r=>`<span>${esc(r)}</span>`).join("")||'<span style="background:transparent;color:var(--warn)">sem referência: será apagado pelo coletor de lixo</span>'}</div></div>`; }).join("");
  }
  const okName=n=>/^[a-z_][a-z0-9_]*$/i.test(n);
  root.addEventListener("click", e=>{
    const id=e.target.id;
    if(id==="onew"){ const nome=q(root,"#onome").value.trim()||"Aluno", v=q(root,"#ovar").value.trim(); if(!okName(v)) return toast("Nome de variável inválido"); objs.push({nome,notas:[],addr:addr()}); vars[v]=objs.length-1; hl=objs.length-1; log(`${v} = Aluno("${nome}")   # novo objeto em ${objs[hl].addr}`); q(root,"#onote3").textContent="Um novo objeto foi criado e a variável aponta para ele."; draw(); }
    if(id==="oadd"){ const v=q(root,"#osel").value; if(!v) return; const n=+q(root,"#onota").value; const o=objs[vars[v]]; o.notas.push(n); hl=vars[v]; log(`${v}.adicionar_nota(${n})`); const others=Object.keys(vars).filter(k=>k!==v&&vars[k]===vars[v]); q(root,"#onote3").textContent= others.length ? `Repare: ${others.join(", ")} também “mudou”, porque aponta para o mesmo objeto que ${v}.` : "O método alterou a lista de notas deste objeto."; draw(); }
    if(id==="omed"){ const v=q(root,"#osel").value; if(!v) return; const o=objs[vars[v]]; const m=o.notas.length?o.notas.reduce((a,b)=>a+b,0)/o.notas.length:0; hl=vars[v]; log(`${v}.media()  →  ${Math.round(m*100)/100}`); draw(); }
    if(id==="oalias"){ const nv=q(root,"#onv").value.trim(), old=q(root,"#osel2").value; if(!old||!okName(nv)) return; vars[nv]=vars[old]; hl=vars[old]; log(`${nv} = ${old}   # mesma referência, nenhum objeto novo`); q(root,"#onote3").textContent=`${nv} e ${old} agora apontam para o mesmo objeto. Para copiar de verdade, seria preciso criar outro Aluno.`; draw(); }
  });
  draw();
 }});

const DF=[["Ana","8A",8.5,2],["Bruno","8B",6.0,5],["Carla","8A",9.2,0],["Diego","8B",4.5,9],["Eva","8A",7.0,1],["Fábio","8C",5.5,4],["Gabi","8C",9.8,0],["Hugo","8B",7.5,3],["Iara","8C",6.5,2],["João","8A",3.5,7]];
lab({id:"pandas", tr:"python", area:"sw", title:"Análise de dados estilo pandas",
 blurb:"Monte uma análise passo a passo (filtrar, agrupar, ordenar) e veja o código pandas, a tabela e o gráfico mudando juntos.",
 learn:["Um DataFrame é uma tabela com linhas e colunas, como uma planilha.","Filtrar, agrupar e ordenar resolvem a maior parte das perguntas sobre dados.","O mesmo raciocínio serve para notas, vendas, sensores ou redes sociais."],
 html:()=>`<div class="sqlb"><fieldset><legend>Filtrar</legend><select id="pf"><option value="">todas as linhas</option><option value="nota>=7">nota &gt;= 7</option><option value="nota<5">nota &lt; 5</option><option value="faltas>3">faltas &gt; 3</option></select></fieldset>
 <fieldset><legend>Agrupar por turma</legend><select id="pg"><option value="">não agrupar</option><option value="mean">média da nota</option><option value="count">quantidade de alunos</option><option value="sum">soma das faltas</option></select></fieldset>
 <fieldset><legend>Ordenar</legend><select id="po"><option value="">sem ordem</option><option value="desc">maior para menor</option><option value="asc">menor para maior</option></select></fieldset></div>
 <div class="k">Código pandas</div><pre class="console" id="pcode"></pre>
 <div class="two-even"><div class="tablewrap"><table id="ptab"></table></div><div><div class="k" id="pct">Gráfico</div><div class="hbars" id="pchart"></div></div></div><div class="note" id="pnote"></div>`,
 mount(root){
  function run(){
    const f=q(root,"#pf").value, g=q(root,"#pg").value, o=q(root,"#po").value;
    let rows=DF.map(([nome,turma,nota,faltas])=>({nome,turma,nota,faltas}));
    let code=`import pandas as pd\n\ndf = pd.read_csv("notas.csv")   # colunas: nome, turma, nota, faltas\n`;
    if(f){ const [col,op,val]=f.match(/(\w+)([<>=]+)(.+)/).slice(1); rows=rows.filter(r=>({">=":r[col]>=+val,"<":r[col]<+val,">":r[col]>+val})[op]); code+=`df = df[df["${col}"] ${op} ${val}]\n`; }
    let cols=["nome","turma","nota","faltas"], key="nota", lab="nome";
    if(g){ const by={}; rows.forEach(r=>{ (by[r.turma]=by[r.turma]||[]).push(r); }); const field=g==="sum"?"faltas":"nota";
      rows=Object.entries(by).map(([t,rs])=>({turma:t, valor: g==="mean"? Math.round(rs.reduce((a,r)=>a+r.nota,0)/rs.length*100)/100 : g==="count"? rs.length : rs.reduce((a,r)=>a+r.faltas,0)}));
      code+=`df = df.groupby("turma")["${field}"].${g}().reset_index(name="valor")\n`; cols=["turma","valor"]; key="valor"; lab="turma"; }
    if(o){ rows.sort((a,b)=>(a[key]-b[key])*(o==="desc"?-1:1)); code+=`df = df.sort_values("${key}", ascending=${o==="asc"?"True":"False"})\n`; }
    code+="print(df)";
    q(root,"#pcode").textContent=code;
    q(root,"#ptab").innerHTML=`<thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c])}</td>`).join("")}</tr>`).join("")||`<tr><td class="muted" colspan="${cols.length}">Nenhuma linha.</td></tr>`}</tbody>`;
    const mx=Math.max(1,...rows.map(r=>r[key])); q(root,"#pct").textContent=`Gráfico: ${key} por ${lab}`;
    q(root,"#pchart").innerHTML=rows.map(r=>`<div class="hbar"><span>${esc(r[lab])}</span><div class="bar"><span style="width:${100*r[key]/mx}%"></span></div><b class="mono">${r[key]}</b></div>`).join("");
    q(root,"#pnote").textContent = g==="mean" ? "Agrupar responde perguntas como “qual turma está pior?” em uma linha de código." : f ? `O filtro deixou ${rows.length} de ${DF.length} alunos. Combine com agrupar para ver por turma.` : "Escolha um filtro, um agrupamento ou uma ordem e veja o código mudar.";
  }
  root.addEventListener("change", run); run();
 }});
})();
