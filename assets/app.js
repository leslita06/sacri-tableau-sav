(function () {
  'use strict';
  var O = '#E95B0F', O2 = '#F59A62', G = '#BDBAB5', G3 = '#ECEAE7', RED = '#C0362C', AMB = '#D99A3E', GRN = '#2E7D4F', INK = '#1F1F1F', MUT = '#7E7B77';
  var SOCS = ['SACRI', 'PST-CI', 'Trans-Roulements', 'SAFIR', 'DEFI'];
  var CANAUX = ['WhatsApp', 'E-mail', 'Téléphone', 'Comptoir'];
  var ST3 = ['Traité', 'En cours', 'Non traité'];
  var ETAPES = [
    ['Reçue', 'Reçue', 'inbox', 'Machine déposée, bon remis'],
    ['Diagnostic', 'Diagnostic', 'search', 'Le technicien cherche la panne'],
    ['Devis envoyé', 'Devis en attente', 'doc', 'On attend l\'accord du client'],
    ['Accord client', 'Attente pièce', 'box', 'Pièce à sortir ou à commander'],
    ['En réparation', 'En réparation', 'wrench', 'Le technicien répare'],
    ['Prête', 'Réparée', 'check', 'Prête à retirer'],
    ['Remise', 'Rendue', 'hand', 'Rendue au client']
  ];
  var ETQ = {}; ETAPES.forEach(function (e) { ETQ[e[0]] = e[1]; });
  var VUES = [
    ['messages', 'Messages reçus', 'inbox'],
    ['atelier', 'Machines en atelier', 'wrench'],
    ['envoi', 'Écrire aux clients', 'send'],
    ['piece', 'Pièce sur photo', 'camera']
  ];
  var D, soc = 'Groupe', vue = 'messages', sel = null, charts = {};

  var IC = {
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    WhatsApp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    'E-mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'Téléphone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    Comptoir: '<path d="M3 9h18l-1.5-5h-15L3 9z"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    hand: '<path d="M20 12v5a4 4 0 0 1-4 4h-4a6 6 0 0 1-6-6v-3"/><path d="M6 12V8a2 2 0 0 1 4 0v4"/><path d="M10 8V6a2 2 0 0 1 4 0v6"/><path d="M14 8a2 2 0 0 1 4 0v4"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    reply: '<path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    play: '<path d="m6 4 14 8-14 8z"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || '') + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  var nf1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  function n1(x) { return nf1.format(x); }
  function n0(x) { return nf0.format(x); }
  function fcfa(x) { return x == null ? 'à venir' : n0(x) + ' FCFA'; }
  function pct(a, b) { return b ? Math.round(a / b * 100) : null; }
  function dt(s) { return s ? new Date(s + ':00') : null; }
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  function dd(s) { var d = dt(s); return d ? String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') : ''; }
  function hh(s) { var d = dt(s); return d ? String(d.getHours()).padStart(2, '0') + ' h ' + String(d.getMinutes()).padStart(2, '0') : ''; }
  function heures(x) { if (x == null) return ''; if (x < 1) return n0(Math.round(x * 60)) + ' min'; return n1(x) + ' h'; }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function pl(n, s, p) { return n0(n) + ' ' + (n > 1 ? (p || s + 's') : s); }
  function q(k) { return new URLSearchParams(location.search).get(k); }

  // Statut d'un message : traité (répondu), en cours (transmis, dans le délai), non traité (délai dépassé sans réponse).
  function st3(x) { return x.rep ? 'Traité' : x.statut === 'En retard' ? 'Non traité' : 'En cours'; }
  function dem() { return D.demandes.filter(function (x) { return soc === 'Groupe' || x.soc === soc; }); }
  function atl() { return D.atelier.filter(function (x) { return soc === 'Groupe' || x.soc === soc; }); }

  // Photos produits issues du site sacri-ci.com (une par famille de matériel).
  function photo(a) {
    if (a.modele === 'STIHL MS 661') return 'assets/img/tronconneuse-ms661.jpg';
    if (a.mat === 'Tronçonneuse') return 'assets/img/tronconneuse.jpg';
    if (/FS 250/.test(a.modele)) return 'assets/img/debroussailleuse-fs250.jpg';
    if (a.mat === 'Débroussailleuse') return 'assets/img/debroussailleuse-fs400.jpg';
    if (a.mat === 'Compresseur') return 'assets/img/compresseur.jpg';
    return 'assets/img/hydraulique.jpg';
  }

  // ---------- navigation entre vues ----------
  function renderViews() {
    $('views').innerHTML = VUES.map(function (v) {
      return '<a href="#' + v[0] + '" data-v="' + v[0] + '" class="' + (v[0] === vue ? 'on' : '') + '"' + (v[0] === vue ? ' aria-current="page"' : '') + '>' + svg(v[2]) + '<span>' + v[1] + '</span></a>';
    }).join('');
  }
  function setVue(v, scroll) {
    if (!VUES.some(function (x) { return x[0] === v; })) v = 'messages';
    vue = v;
    VUES.forEach(function (x) { $('v-' + x[0]).hidden = x[0] !== v; });
    renderViews(); render();
    if (scroll) window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', function () { setVue(location.hash.slice(1), true); });

  function renderSocs() {
    $('socs').innerHTML = ['Groupe'].concat(SOCS).map(function (k) {
      return '<button type="button" data-k="' + k + '" class="' + (k === soc ? 'on' : '') + '" aria-pressed="' + (k === soc) + '">' + k + '</button>';
    }).join('');
    $('socs').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { soc = b.getAttribute('data-k'); sel = null; renderSocs(); render(); }); });
  }

  // ---------- vue 1 : messages reçus ----------
  function kpi(ic, l, v, unit, sub, cls) {
    return '<div class="kpi' + (cls ? ' ' + cls : '') + '"><div class="ic">' + svg(ic) + '</div><p class="l">' + l + '</p><p class="v">' + v + (unit ? '<small>' + unit + '</small>' : '') + '</p><p class="s">' + sub + '</p></div>';
  }
  function renderMessages() {
    var d = dem(), ref = dt(D.ref);
    var c = { 'Traité': 0, 'En cours': 0, 'Non traité': 0 };
    d.forEach(function (x) { c[st3(x)]++; });
    var jour = d.filter(function (x) { return sameDay(dt(x.recue), ref); }).length;
    var mail = d.filter(function (x) { return x.canal === 'E-mail'; }), wa = d.filter(function (x) { return x.canal === 'WhatsApp'; });
    var rep = d.filter(function (x) { return x.rep; });
    var moy = rep.length ? rep.reduce(function (s, x) { return s + x.delai; }, 0) / rep.length : null;
    var ok = d.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length;
    var pok = pct(ok, rep.length);
    function tr(a) { return a.filter(function (x) { return x.rep; }).length; }
    var h = kpi('inbox', 'Messages reçus', n0(d.length), '', 'depuis lundi, dont <b>' + n0(jour) + '</b> aujourd\'hui');
    h += kpi('E-mail', 'E-mails', n0(mail.length), '', mail.length ? '<b>' + n0(tr(mail)) + '</b> traités sur ' + n0(mail.length) : 'aucun e-mail reçu');
    h += kpi('WhatsApp', 'Messages WhatsApp', n0(wa.length), '', wa.length ? '<b>' + n0(tr(wa)) + '</b> traités sur ' + n0(wa.length) : 'aucun message reçu');
    h += kpi('clock', 'Délai moyen de réponse', moy == null ? '–' : moy < 1 ? n0(Math.round(moy * 60)) : n1(moy), moy == null ? '' : moy < 1 ? 'min' : 'h', pok == null ? 'aucun message traité' : '<b>' + pok + ' %</b> dans le délai visé');
    $('m-kpis').innerHTML = h;
    var t = '<b>' + pl(d.length, 'message') + '</b> ' + (d.length > 1 ? 'sont arrivés' : 'est arrivé') + ' depuis lundi' + (soc === 'Groupe' ? '' : ' chez ' + soc) + ' : ';
    t += '<span class="st s-t">' + n0(c['Traité']) + ' traité' + (c['Traité'] > 1 ? 's' : '') + '</span>, <span class="st s-c">' + n0(c['En cours']) + ' en cours</span>, <span class="st s-n">' + n0(c['Non traité']) + ' non traité' + (c['Non traité'] > 1 ? 's' : '') + '</span>.';
    $('m-phrase').innerHTML = t;
    renderCanal(d); renderDelai(d); renderTable();
  }
  function kill(k) { if (charts[k]) { charts[k].destroy(); delete charts[k]; } }
  var COL3 = { 'Traité': O, 'En cours': AMB, 'Non traité': RED };
  function renderCanal(d) {
    var ds = ST3.map(function (st) {
      return { label: st, data: CANAUX.map(function (c) { return d.filter(function (x) { return x.canal === c && st3(x) === st; }).length; }), backgroundColor: COL3[st], borderRadius: 3, barThickness: 22, borderSkipped: false };
    });
    var totals = CANAUX.map(function (c) { return d.filter(function (x) { return x.canal === c; }).length; });
    kill('canal');
    charts.canal = new Chart($('c-canal'), {
      type: 'bar', data: { labels: CANAUX, datasets: ds },
      options: { indexAxis: 'y', maintainAspectRatio: false, responsive: true, layout: { padding: { right: 28 } },
        scales: { x: { stacked: true, grid: { color: G3 }, border: { display: false }, ticks: { precision: 0, stepSize: 1 } }, y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: INK, font: { size: 13, weight: 500 } } } },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 2, padding: 14 } } } },
      plugins: [{ id: 'tot', afterDatasetsDraw: function (ch) {
        var ctx = ch.ctx; ctx.save(); ctx.font = '600 13px Inter, sans-serif'; ctx.fillStyle = INK; ctx.textBaseline = 'middle';
        totals.forEach(function (t, i) { ctx.fillText(t, ch.scales.x.getPixelForValue(t) + 8, ch.scales.y.getPixelForValue(i)); }); ctx.restore(); } }]
    });
  }
  function renderDelai(d) {
    var rows = CANAUX.map(function (c) {
      var r = d.filter(function (x) { return x.canal === c && x.rep; });
      var ok = r.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length;
      return { n: r.length, ok: ok, p: r.length ? ok / r.length * 100 : null, m: r.length ? r.reduce(function (s, x) { return s + x.delai; }, 0) / r.length : null, v: D.vise_canal[c] };
    });
    kill('delai');
    charts.delai = new Chart($('c-delai'), {
      type: 'bar',
      data: { labels: CANAUX, datasets: [
        { data: rows.map(function (r) { return r.p || 0; }), backgroundColor: rows.map(function (r) { return r.p != null && r.p < 75 ? O2 : O; }), borderRadius: 3, barThickness: 20 },
        { data: rows.map(function (r) { return r.p == null ? 0 : 100 - r.p; }), backgroundColor: G3, borderRadius: 3, barThickness: 20 }] },
      options: { indexAxis: 'y', maintainAspectRatio: false, responsive: true,
        scales: { x: { stacked: true, max: 100, grid: { display: false }, border: { display: false }, ticks: { display: false } }, y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: INK, font: { size: 13, weight: 500 } } } },
        layout: { padding: { bottom: 18 } }, plugins: { legend: { display: false }, tooltip: { enabled: false } } },
      plugins: [{ id: 'lbl', afterDatasetsDraw: function (ch) {
        var ctx = ch.ctx; ctx.save(); ctx.textBaseline = 'middle';
        rows.forEach(function (r, i) {
          var y = ch.scales.y.getPixelForValue(i), x0 = ch.scales.x.getPixelForValue(0) + 9;
          ctx.font = '600 12.5px Inter, sans-serif'; ctx.fillStyle = r.n ? (r.p < 22 ? INK : '#fff') : MUT; ctx.textAlign = 'left';
          ctx.fillText(r.n ? Math.round(r.p) + ' %' : 'aucun traité', x0, y);
          ctx.font = '400 12px Inter, sans-serif'; ctx.fillStyle = MUT; ctx.textAlign = 'left';
          ctx.fillText(r.n ? 'en moyenne ' + heures(r.m) + ', délai visé ' + heures(r.v) : 'délai visé ' + heures(r.v), ch.scales.x.getPixelForValue(0), y + 22);
        });
        ctx.restore(); } }]
    });
  }
  var fc = 'Tous', fs = 'Tous', fq = '';
  function pill3(s) { return '<span class="pill ' + { 'Traité': 'p-ok', 'En cours': 'p-wait', 'Non traité': 'p-late' }[s] + '">' + s + '</span>'; }
  function renderTable() {
    var qq = fq.toLowerCase(), all = dem();
    var d = all.filter(function (x) {
      return (fc === 'Tous' || x.canal === fc) && (fs === 'Tous' || st3(x) === fs) && (!qq || [x.client, x.objet, x.demande, x.n, x.transmis].join(' ').toLowerCase().indexOf(qq) >= 0);
    }).slice().reverse();
    $('d-cnt').textContent = d.length + ' sur ' + all.length;
    var tb = document.querySelector('#t-dem tbody');
    if (!d.length) { tb.innerHTML = '<tr><td colspan="8" class="empty">Aucun message pour ces filtres.</td></tr>'; return; }
    tb.innerHTML = d.map(function (x) {
      var s = st3(x);
      var del = x.rep ? heures(x.delai) + ' <span class="muted">/ ' + heures(x.vise) + '</span>' : '<span class="muted">attend depuis</span> ' + heures(x.delai);
      return '<tr><td class="c-n nw">' + esc(x.n) + '</td><td class="c-dt nw">' + dd(x.recue) + ' <span class="muted">' + hh(x.recue) + '</span></td>' +
        '<td class="c-ca"><span class="canal">' + svg(x.canal) + esc(x.canal) + '</span></td>' +
        '<td class="c-cl">' + esc(x.client) + (soc === 'Groupe' ? '<span class="soc">' + esc(x.soc) + '</span>' : '') + '</td>' +
        '<td class="c-ob"><b>' + esc(x.objet) + '</b><div class="dm">« ' + esc(x.demande) + ' »</div></td>' +
        '<td class="c-de r' + (x.rep && x.statut === 'Répondu hors délai' ? ' late' : '') + '">' + del + '</td>' +
        '<td class="c-st">' + pill3(s) + '</td><td class="c-tr">' + esc(x.transmis || 'Service client') + '</td></tr>';
    }).join('');
  }

  // ---------- vue 2 : machines en atelier ----------
  var fe = 'Toutes';
  function renderAtelier() {
    var a = atl();
    if (!a.length) {
      $('a-phrase').innerHTML = soc + ' n\'a aucune machine dans le suivi d\'atelier : les réparations du groupe sont suivies chez SACRI et PST-CI.';
      $('etapes').innerHTML = ''; $('a-rows').innerHTML = '<p class="empty">Aucune machine pour ' + esc(soc) + '.</p>'; $('a-cnt').textContent = ''; $('a-det').hidden = true; return;
    }
    $('a-det').hidden = false;
    var enc = a.filter(function (x) { return x.statut !== 'Remise'; });
    var ret = a.filter(function (x) { return x.alerte === 'En retard'; }).length;
    var pr = a.filter(function (x) { return x.statut === 'Prête'; }).length;
    $('a-phrase').innerHTML = '<b>' + pl(enc.length, 'machine') + '</b> ' + (enc.length > 1 ? 'sont' : 'est') + ' à l\'atelier' + (ret ? ', dont <b class="red">' + n0(ret) + ' en retard</b> sur le délai visé' : '') + (pr ? ' ; ' + pl(pr, 'machine réparée', 'machines réparées') + ' ' + (pr > 1 ? 'attendent' : 'attend') + ' leur client.' : '.');
    $('etapes').innerHTML = ETAPES.map(function (e) {
      var n = a.filter(function (x) { return x.statut === e[0]; }).length;
      return '<li><button type="button" data-e="' + e[0] + '" class="' + (fe === e[0] ? 'on' : '') + (n ? '' : ' zero') + '"><span class="ei">' + svg(e[2]) + '</span><b>' + n + '</b><span class="el">' + e[1] + '</span><span class="ed">' + e[3] + '</span></button></li>';
    }).join('');
    $('etapes').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { var e = b.getAttribute('data-e'); fe = fe === e ? 'Toutes' : e; $('f-etape').value = fe; renderAtelier(); }); });
    var rows = a.filter(function (x) { return fe === 'Toutes' || x.statut === fe; })
      .sort(function (p, q2) { return (p.statut === 'Remise') - (q2.statut === 'Remise') || (q2.jours - q2.vise) - (p.jours - p.vise); });
    $('a-cnt').textContent = rows.length + ' sur ' + a.length;
    if (!rows.some(function (x) { return x.br === sel; })) sel = rows.length ? rows[0].br : null;
    $('a-rows').innerHTML = rows.map(function (x) {
      var late = x.alerte === 'En retard', w = Math.min(100, x.jours / Math.max(x.vise * 2, x.jours) * 100), wv = Math.min(100, x.vise / Math.max(x.vise * 2, x.jours) * 100);
      return '<button type="button" class="ar' + (sel === x.br ? ' sel' : '') + (late ? ' late' : '') + '" data-br="' + x.br + '">' +
        '<img src="' + photo(x) + '" alt="" loading="lazy" width="64" height="64">' +
        '<span class="ac"><span class="an">' + esc(x.client) + (soc === 'Groupe' ? ' <i>' + esc(x.soc) + '</i>' : '') + '</span>' +
        '<span class="am">' + esc(x.mat) + ', ' + esc(x.modele) + '</span><span class="ab">' + esc(x.br) + '</span></span>' +
        '<span class="ae"><span class="pill e-' + ETAPES.findIndex(function (e) { return e[0] === x.statut; }) + '">' + ETQ[x.statut] + '</span>' +
        (x.alerte && x.statut !== 'Remise' ? '<span class="al ' + (late ? 'al-r' : 'al-a') + '">' + esc(x.alerte) + '</span>' : '') + '</span>' +
        '<span class="aj"><span class="jt"><b>' + x.jours + ' j</b> / ' + x.vise + ' visés</span><span class="bar"><span style="width:' + w + '%" class="' + (late ? 'r' : x.statut === 'Prête' ? 'a' : '') + '"></span><i style="left:' + wv + '%"></i></span></span></button>';
    }).join('') || '<p class="empty">Aucune machine à cette étape.</p>';
    $('a-rows').querySelectorAll('.ar').forEach(function (b) { b.addEventListener('click', function () { sel = b.getAttribute('data-br'); renderAtelier(); if (window.innerWidth < 900) $('a-det').scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
    renderDetail(a.filter(function (x) { return x.br === sel; })[0]);
  }
  function renderDetail(x) {
    if (!x) { $('a-det').innerHTML = ''; return; }
    var idx = ETAPES.findIndex(function (e) { return e[0] === x.statut; });
    var jal = [['Reçue', x.recue], ['Devis envoyé', x.devis_le], ['Accord du client', x.accord], ['Réparée', x.prete], ['Rendue', x.remise]];
    $('a-det').innerHTML = '<div class="dh"><img src="' + photo(x) + '" alt="' + esc(x.mat) + '" width="96" height="96"><div><p class="ab">' + esc(x.br) + ', ' + esc(x.soc) + '</p><h3>' + esc(x.client) + '</h3><p class="am">' + esc(x.mat) + ', ' + esc(x.modele) + '</p><p class="am">Panne : ' + esc(x.panne) + '</p></div></div>' +
      '<ol class="prog">' + ETAPES.map(function (e, i) { return '<li class="' + (i < idx ? 'done' : i === idx ? 'cur' : '') + '"><i></i><span>' + e[1] + '</span></li>'; }).join('') + '</ol>' +
      '<div class="facts"><div><span>À l\'atelier</span><b class="' + (x.alerte === 'En retard' ? 'red' : '') + '">' + x.jours + ' j / ' + x.vise + ' visés</b></div><div><span>Devis</span><b>' + fcfa(x.montant) + '</b></div><div><span>Technicien</span><b>' + esc(x.tech) + '</b></div></div>' +
      '<ul class="jal">' + jal.map(function (j) { return '<li class="' + (j[1] ? 'ok' : '') + '">' + svg(j[1] ? 'check' : 'clock') + '<span>' + j[0] + '</span><b>' + (j[1] ? dd(j[1]) : 'à venir') + '</b></li>'; }).join('') + '</ul>' +
      '<p class="cap sm">' + svg('WhatsApp') + 'Message envoyé au client à cette étape</p><div class="bubble">' + esc(x.msg) + '</div>' +
      '<a class="lnk" href="#envoi">' + svg('zap') + 'Voir les messages qui partent tout seuls</a>';
  }

  // ---------- vue 4 : pièce sur photo ----------
  function renderPieces() {
    var sic = ['camera', 'pin', 'search', 'check'];
    $('steps').innerHTML = D.etapes.map(function (e, i) {
      return '<li><div class="sn"><i>' + e.n + '</i>' + svg(sic[i]) + '</div><h3>' + esc(e.quoi) + '</h3><p>' + esc(e.comment) + '</p><p class="who">Au client : <b>' + esc(e.client) + '</b></p><p class="who">Qui : <b>' + esc(e.qui) + '</b>, contrôle : ' + esc(e.ctrl) + '</p></li>';
    }).join('');
    function socOf(e) { return /PST-CI/.test(e.ref + e.reponse) ? 'PST-CI' : /Trans-Roulements/.test(e.ref + e.reponse) ? 'Trans-Roulements' : 'SACRI'; }
    var ex = D.exemples.filter(function (e) { return soc === 'Groupe' || socOf(e) === soc; });
    $('cap-cases').textContent = ex.length === D.exemples.length ? 'Huit demandes types et la réponse attendue' : ex.length ? ex.length + (ex.length > 1 ? ' demandes types' : ' demande type') + ' pour ' + soc : 'Demandes types';
    $('cases').innerHTML = ex.length ? ex.map(function (e) {
      return '<div class="case"><p class="ph">' + svg(/Message|Référence lue/.test(e.envoi) ? 'msg' : 'camera') + esc(e.envoi) + '</p><p class="m">' + esc(e.machine) + '</p><p class="pc">' + esc(e.piece) + '</p><p class="rf">' + esc(e.ref) + '</p><p class="rp">' + esc(e.reponse) + '</p><span class="tag">' + socOf(e) + '</span></div>';
    }).join('') : '<p class="nodata">Aucun exemple de pièce pour ' + esc(soc) + ' : la méthode en quatre étapes reste la même.</p>';
  }

  function render() {
    if (!D) return;
    $('filters').hidden = false;
    if (vue === 'messages') renderMessages();
    if (vue === 'atelier') renderAtelier();
    if (vue === 'envoi' && window.SacriEnvoi) window.SacriEnvoi.render(soc);
    if (vue === 'piece') renderPieces();
  }

  Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = MUT;
  Chart.defaults.animation = { duration: 350 };

  fetch('data/donnees.json?v=20261119a').then(function (r) { return r.json(); }).then(function (j) {
    D = j; window.SACRI_D = j;
    var r = dt(D.ref);
    $('arrete').textContent = 'Situation au ' + JOURS[r.getDay()] + ' ' + r.getDate() + ' ' + MOIS[r.getMonth()] + ' ' + r.getFullYear() + ', ' + r.getHours() + ' h';
    $('f-canal').innerHTML = '<option value="Tous">Tous les canaux</option>' + CANAUX.map(function (o) { return '<option>' + o + '</option>'; }).join('');
    $('f-statut').innerHTML = '<option value="Tous">Tous les statuts</option>' + ST3.map(function (o) { return '<option>' + o + '</option>'; }).join('');
    $('f-etape').innerHTML = '<option value="Toutes">Toutes les étapes</option>' + ETAPES.map(function (e) { return '<option value="' + e[0] + '">' + e[1] + '</option>'; }).join('');
    $('f-canal').addEventListener('change', function () { fc = this.value; renderTable(); });
    $('f-statut').addEventListener('change', function () { fs = this.value; renderTable(); });
    $('f-q').addEventListener('input', function () { fq = this.value.trim(); renderTable(); });
    $('f-etape').addEventListener('change', function () { fe = this.value; renderAtelier(); });
    renderSocs();
    var s = document.createElement('script'); s.src = 'assets/envoi.js?v=20261119a';
    s.onload = function () { setVue(q('vue') || location.hash.slice(1) || 'messages'); };
    document.body.appendChild(s);
    window.addEventListener('resize', function () { if (vue === 'messages') { /* Chart.js se redimensionne seul */ } });
  });
})();
