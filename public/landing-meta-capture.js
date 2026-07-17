/**
 * Meta Parameter Builder — planificadoc.website
 *
 * Incluir en el <head> de la landing, ANTES del Meta Pixel.
 * Captura _fbp/_fbc en cuanto el script carga (no espera al clic de compra).
 * Parchea automáticamente todos los links hacia planificadoc.app
 * para pasar fbp/fbc como query params (cross-domain attribution).
 *
 * Reglas Meta:
 *  - _fbc: NO alterar, NO lowercasear — pasar el valor exacto del cookie.
 *  - Si no hay cookie _fbc pero la URL trae fbclid → construir
 *    fbc = "fb.1.<timestamp_ms>.<fbclid>"  (spec Meta).
 *  - _fbp: pasar tal cual, no modificar.
 */
(function () {
  "use strict";

  var TARGET_DOMAIN = "planificadoc.app";

  /* ── helpers ──────────────────────────────────────────────────────────── */

  function getCookie(name) {
    var pairs = document.cookie.split("; ");
    for (var i = 0; i < pairs.length; i++) {
      var sep = pairs[i].indexOf("=");
      if (sep === -1) continue;
      if (pairs[i].substring(0, sep) === name) {
        return decodeURIComponent(pairs[i].substring(sep + 1));
      }
    }
    return null;
  }

  function getParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function store(key, val) {
    try { sessionStorage.setItem(key, val); } catch (e) {}
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  function retrieve(key) {
    try { var v = sessionStorage.getItem(key); if (v) return v; } catch (e) {}
    try { var v2 = localStorage.getItem(key); if (v2) return v2; } catch (e) {}
    return null;
  }

  /* ── captura temprana ─────────────────────────────────────────────────── */

  function capture() {
    var fbp = getCookie("_fbp");
    // _fbc: NO alterar, pasar exacto
    var fbc = getCookie("_fbc");
    var fbclid = getParam("fbclid");

    // Construir fbc desde fbclid SOLO si no hay cookie _fbc
    if (!fbc && fbclid) {
      fbc = "fb.1." + Date.now() + "." + fbclid;
    }

    if (fbp) store("pdoc_fbp", fbp);
    if (fbc) store("pdoc_fbc", fbc);
    if (fbclid) store("pdoc_fbclid", fbclid);
  }

  /* ── parchar links hacia .app ─────────────────────────────────────────── */

  function patchLink(anchor) {
    try {
      var href = anchor.getAttribute("href") || "";
      if (href.indexOf(TARGET_DOMAIN) === -1) return;
      var fbp = retrieve("pdoc_fbp");
      var fbc = retrieve("pdoc_fbc");
      if (!fbp && !fbc) return;
      var url = new URL(anchor.href, window.location.href);
      if (fbp) url.searchParams.set("fbp", fbp);
      if (fbc) url.searchParams.set("fbc", fbc);
      anchor.href = url.toString();
    } catch (e) {}
  }

  function patchAllLinks() {
    var anchors = document.querySelectorAll("a");
    for (var i = 0; i < anchors.length; i++) {
      patchLink(anchors[i]);
    }
  }

  /* ── observar cambios dinámicos (SPA / React) ─────────────────────────── */

  function observeDom() {
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (node.nodeType !== 1) continue;
          if (node.tagName === "A") { patchLink(node); continue; }
          var anchors = node.querySelectorAll ? node.querySelectorAll("a") : [];
          for (var k = 0; k < anchors.length; k++) patchLink(anchors[k]);
        }
      }
    });
    obs.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  /* ── parchar en el clic (fallback para links dinámicos) ──────────────── */

  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      while (t && t.tagName !== "A") t = t.parentNode;
      if (!t || t.tagName !== "A") return;
      patchLink(t);
    },
    true // capture phase: parchamos antes de que se procese el clic
  );

  /* ── inicializar ──────────────────────────────────────────────────────── */

  // Capturar inmediatamente (el script se carga en <head>)
  capture();

  // Parchar links cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      patchAllLinks();
      observeDom();
    });
  } else {
    patchAllLinks();
    observeDom();
  }
})();
