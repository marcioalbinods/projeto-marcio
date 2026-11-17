(function () {
  var CFG_KEY = "pp-drive";
  var inClaude = !!(window.claude && typeof window.claude.use === "function");
  var cfg = null;
  try { cfg = JSON.parse(localStorage.getItem(CFG_KEY) || "null"); } catch (e) { cfg = null; }
  var pushTimer = null, pushing = false, again = false, lastError = "";

  function saveCfg(c) {
    cfg = c;
    try { if (c) localStorage.setItem(CFG_KEY, JSON.stringify(c)); else localStorage.removeItem(CFG_KEY); } catch (e) {}
  }
  async function call(body) {
    var payload = Object.assign({}, body, { key: cfg.key });
    var r = await fetch(cfg.url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error("http");
    var j = await r.json();
    if (!j.ok) throw new Error(j.error || "erro");
    return j;
  }
  function fail(e) {
    lastError = e && e.message === "chave" ? "A chave não confere. Confira a chave e conecte de novo." : "Sem conexão com o Drive agora. O progresso fica salvo neste navegador e sobe quando a conexão voltar.";
    setSync("busy", e && e.message === "chave" ? "Chave do Drive inválida" : "Drive fora do ar, salvo neste navegador");
  }
  async function pull() {
    if (!cfg) return;
    try {
      setSync("busy", "Sincronizando com o Drive…");
      var j = await call({ action: "get" });
      var remote = normalize(j.data || {});
      lastError = "";
      if (remote.updated > state.updated) { state = remote; saveLocal(); render(); }
      else if (state.updated > remote.updated) { await push(); return; }
      setSync("cloud", "Salvo no Google Drive");
    } catch (e) { fail(e); }
  }
  async function push() {
    if (!cfg) return;
    if (pushing) { again = true; return; }
    pushing = true;
    try {
      setSync("busy", "Salvando no Drive…");
      await call({ action: "set", data: JSON.parse(JSON.stringify(state)) });
      lastError = "";
      setSync("cloud", "Salvo no Google Drive");
    } catch (e) {
      fail(e);
      if (!(e && e.message === "chave")) setTimeout(push, 8000);
    }
    pushing = false;
    if (again) { again = false; push(); }
  }

  var baseTouch = touch;
  touch = function () {
    baseTouch();
    if (cfg && !inClaude) { clearTimeout(pushTimer); pushTimer = setTimeout(push, 1500); }
  };

  function section() {
    if (inClaude) {
      return '<section class="card"><h2>Google Drive</h2><p class="muted" style="margin-top:6px;max-width:70ch">Esta versão já salva o progresso na sua conta do Claude e aparece em qualquer aparelho. A sincronização com o Google Drive fica na versão do GitHub: <a href="https://marcioalbinods.github.io/projeto-marcio/#backup" target="_blank" rel="noopener">marcioalbinods.github.io/projeto-marcio</a>.</p></section>';
    }
    if (cfg) {
      return '<section class="card"><h2>Google Drive conectado</h2><p class="muted" style="margin-top:6px;max-width:70ch">Cada mudança é salva no arquivo <b>projeto-perfeicao-progresso.json</b> do seu Drive. Em outro aparelho, abra este site e conecte com o mesmo endereço e a mesma chave.</p>' +
        (lastError ? '<p style="margin-top:8px;color:var(--warn)">' + esc(lastError) + '</p>' : '') +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn" id="drv-sync">Sincronizar agora</button><button class="btn ghost" id="drv-off">Desconectar deste aparelho</button></div></section>';
    }
    return '<section class="card"><h2>Conectar ao Google Drive</h2><p class="muted" style="margin-top:6px;max-width:70ch">Faça isso uma vez em cada aparelho (Mac, tablet, celular). Depois, o progresso é salvo no seu Drive automaticamente e aparece em todos eles.</p>' +
      '<div class="form" style="grid-template-columns:2fr 1.4fr auto;margin-top:12px">' +
      '<label class="f" for="drv-url">Endereço do app da web (Apps Script)<input id="drv-url" placeholder="https://script.google.com/macros/s/.../exec" autocomplete="off"></label>' +
      '<label class="f" for="drv-key">Chave secreta<input id="drv-key" type="password" autocomplete="off"></label>' +
      '<button class="btn" id="drv-on">Conectar</button></div>' +
      (lastError ? '<p style="margin-top:8px;color:var(--warn)">' + esc(lastError) + '</p>' : '') +
      '</section>';
  }
  var baseBackup = VIEWS["backup"];
  VIEWS["backup"] = function () {
    var html = baseBackup();
    var i = html.indexOf("</section>");
    return html.slice(0, i + 10) + '<div class="sec">' + section() + '</div>' + html.slice(i + 10);
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest("#drv-on,#drv-off,#drv-sync");
    if (!b) return;
    if (b.id === "drv-on") {
      var u = (document.getElementById("drv-url").value || "").trim();
      var k = (document.getElementById("drv-key").value || "").trim();
      if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec/.test(u)) { lastError = "O endereço precisa começar com https://script.google.com/macros/s/ e terminar em /exec."; render(); return; }
      if (k.length < 20) { lastError = "Cole a chave completa."; render(); return; }
      saveCfg({ url: u, key: k }); lastError = ""; render(); pull().then(function () { render(); toast(lastError ? "Não consegui conectar" : "Drive conectado"); });
    } else if (b.id === "drv-off") {
      saveCfg(null); setSync("", "Salvo neste navegador"); render();
    } else if (b.id === "drv-sync") {
      pull().then(function () { render(); toast(lastError ? "Não consegui sincronizar" : "Sincronizado"); });
    }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && cfg && !inClaude && !pushing) pull();
  });

  if (cfg && !inClaude) pull();
  if (location.hash === "#backup") render();
})();
