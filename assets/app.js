(function () {
  'use strict';
  var O = '#E95B0F', O2 = '#F59A62', O3 = '#FDEEE5', G = '#BDBAB5', G3 = '#ECEAE7', RED = '#C0362C', AMB = '#D99A3E', GRN = '#2E7D4F', INK = '#1F1F1F', MUT = '#7E7B77';
  var SOCS = ['SACRI', 'PST-CI', 'Trans-Roulements', 'SAFIR', 'DEFI'];
  var CANAUX = ['WhatsApp', 'E-mail', 'Téléphone', 'Comptoir'];
  var STATUTS = ['Reçue', 'Diagnostic', 'Devis envoyé', 'Accord client', 'En réparation', 'Prête', 'Remise'];
  var ST_DEM = ['Répondu dans le délai', 'Répondu hors délai', 'En attente', 'En retard'];
  var D, soc = 'Groupe', sel = null, charts = {};

  var IC = {
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    WhatsApp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    'E-mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'Téléphone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    Comptoir: '<path d="M3 9h18l-1.5-5h-15L3 9z"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || '') + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  var nf1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  function n1(x) { return nf1.format(x); }
  function n0(x) { return nf0.format(x); }
  function fcfa(x) { return x == null ? '–' : n0(x) + ' FCFA'; }
  function pct(a, b) { return b ? Math.round(a / b * 100) : null; }
  function dt(s) { return s ? new Date(s + ':00') : null; }
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  function dd(s) { var d = dt(s); return d ? String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') : '–'; }
  function hh(s) { var d = dt(s); return d ? String(d.getHours()).padStart(2, '0') + ' h ' + String(d.getMinutes()).padStart(2, '0') : ''; }
  function heures(x) { if (x == null) return '–'; if (x < 1) return n0(Math.round(x * 60)) + ' min'; return n1(x) + ' h'; }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  function dem() { return D.demandes.filter(function (x) { return soc === 'Groupe' || x.soc === soc; }); }
  function atl() { return D.atelier.filter(function (x) { return soc === 'Groupe' || x.soc === soc; }); }

  function stats() {
    var d = dem(), a = atl(), ref = dt(D.ref);
    var jour = d.filter(function (x) { return sameDay(dt(x.recue), ref); }).length;
    var att = d.filter(function (x) { return x.statut === 'En attente' || x.statut === 'En retard'; }).length;
    var rep = d.filter(function (x) { return x.rep; });
    var moy = rep.length ? rep.reduce(function (s, x) { return s + x.delai; }, 0) / rep.length : null;
    var ok = d.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length;
    var hors = d.filter(function (x) { return x.statut === 'Répondu hors délai'; }).length;
    var enat = a.filter(function (x) { return x.statut !== 'Remise' && x.statut !== 'Prête'; }).length;
    var prete = a.filter(function (x) { return x.statut === 'Prête'; }).length;
    var relance = a.filter(function (x) { return x.alerte === 'Relancer le devis'; }).length;
    var retard = a.filter(function (x) { return x.alerte === 'En retard'; }).length;
    var notes = a.filter(function (x) { return x.note != null; });
    var sat = notes.length ? notes.reduce(function (s, x) { return s + x.note; }, 0) / notes.length : null;
    var rappel = a.filter(function (x) { return x.alerte === 'Rappeler le client'; }).length;
    return { total: d.length, jour: jour, att: att, moy: moy, nrep: rep.length, pctok: pct(ok, ok + hors), enat: enat, prete: prete, relance: relance, retard: retard, sat: sat, nnotes: notes.length, natl: a.length, rappel: rappel };
  }

  function pl(n, s, p) { return n0(n) + ' ' + (n > 1 ? (p || s + 's') : s); }

  function renderHead(s) {
    var so = D.societes.filter(function (x) { return x.k === soc; })[0];
    $('titre').textContent = soc === 'Groupe' ? 'Le service client du groupe' : 'Le service client de ' + soc;
    $('metier').textContent = so ? so.metier : 'SACRI, PST-CI, Trans-Roulements, SAFIR et DEFI : un seul registre des demandes, un seul suivi d\'atelier.';
    var t = 'Depuis lundi, <b>' + pl(s.total, 'demande') + '</b> ' + (s.total > 1 ? 'sont arrivées' : 'est arrivée') + ', dont ' + n0(s.jour) + ' aujourd\'hui';
    t += s.att ? ' ; <b>' + n0(s.att) + '</b> ' + (s.att > 1 ? 'attendent' : 'attend') + ' encore une réponse. ' : '. ';
    if (s.moy != null) t += 'La première réponse arrive en <b>' + heures(s.moy) + '</b> en moyenne' + (s.pctok != null ? ', dans le délai visé pour ' + s.pctok + ' % des demandes répondues. ' : '. ');
    if (s.natl) {
      t += '<b>' + pl(s.enat, 'machine') + '</b> ' + (s.enat > 1 ? 'sont' : 'est') + ' en atelier';
      t += s.retard ? ', dont <b>' + n0(s.retard) + ' en retard</b> sur le délai visé' : '';
      t += s.prete ? ', et ' + pl(s.prete, 'machine prête', 'machines prêtes') + ' à remettre.' : '.';
    } else t += 'Cette société n\'a pas de machine dans le suivi d\'atelier.';
    $('phrase').innerHTML = t;
  }

  function kpi(ic, l, v, unit, sub, warn) {
    return '<div class="kpi' + (warn ? ' warn' : '') + '"><div class="ic">' + svg(ic) + '</div><p class="l">' + l + '</p><p class="v">' + v + (unit ? '<small>' + unit + '</small>' : '') + '</p><p class="s">' + sub + '</p></div>';
  }
  function renderKpis(s) {
    var h = '';
    h += kpi('inbox', 'Demandes du jour', n0(s.jour), '', '<b>' + n0(s.att) + '</b> en attente de réponse · ' + n0(s.total) + ' depuis lundi');
    h += kpi('clock', 'Délai moyen de réponse', s.moy == null ? '–' : s.moy < 1 ? n0(Math.round(s.moy * 60)) : n1(s.moy), s.moy == null ? '' : s.moy < 1 ? 'min' : 'h', s.pctok == null ? 'aucune demande répondue' : '<b>' + s.pctok + ' %</b> dans le délai visé');
    h += kpi('wrench', 'Machines en atelier', s.natl ? n0(s.enat) : '–', '', s.natl ? '<b>' + n0(s.prete) + '</b> prêtes à remettre · ' + pl(s.relance, 'devis', 'devis') + ' à relancer' : 'pas d\'atelier dans le suivi');
    h += kpi('alert', 'Réparations en retard', s.natl ? n0(s.retard) : '–', '', 'au-delà du délai visé par matériel', s.retard > 0);
    h += kpi('star', 'Satisfaction', s.sat == null ? '–' : n1(s.sat), s.sat == null ? '' : '/ 5', s.nnotes ? pl(s.nnotes, 'note reçue', 'notes reçues') + ' à la remise' : 'aucune note reçue');
    $('kpis').innerHTML = h;
  }

  Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = MUT;
  Chart.defaults.animation = { duration: 350 };
  function kill(k) { if (charts[k]) { charts[k].destroy(); delete charts[k]; } }

  function renderCanal() {
    var d = dem();
    var col = { 'Répondu dans le délai': O, 'Répondu hors délai': O2, 'En attente': G, 'En retard': RED };
    var lab = { 'Répondu dans le délai': 'Répondu dans le délai', 'Répondu hors délai': 'Répondu hors délai', 'En attente': 'En attente', 'En retard': 'En retard' };
    var ds = ST_DEM.map(function (st) {
      return { label: lab[st], data: CANAUX.map(function (c) { return d.filter(function (x) { return x.canal === c && x.statut === st; }).length; }), backgroundColor: col[st], borderRadius: 3, barThickness: 22, borderSkipped: false };
    });
    kill('canal');
    var totals = CANAUX.map(function (c) { return d.filter(function (x) { return x.canal === c; }).length; });
    charts.canal = new Chart($('c-canal'), {
      type: 'bar', data: { labels: CANAUX, datasets: ds },
      options: {
        indexAxis: 'y', maintainAspectRatio: false, responsive: true,
        layout: { padding: { right: 28 } },
        scales: { x: { stacked: true, grid: { color: G3 }, border: { display: false }, ticks: { precision: 0, stepSize: 1 } }, y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: INK, font: { size: 13, weight: 500 } } } },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 2, padding: 14 } },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.dataset.label + ' : ' + c.raw; } } } }
      },
      plugins: [{ id: 'tot', afterDatasetsDraw: function (ch) {
        var ctx = ch.ctx, m = ch.getDatasetMeta(ch.data.datasets.length - 1);
        ctx.save(); ctx.font = '600 13px Inter, sans-serif'; ctx.fillStyle = INK; ctx.textBaseline = 'middle';
        totals.forEach(function (t, i) { var x = ch.scales.x.getPixelForValue(t); var y = ch.scales.y.getPixelForValue(i); ctx.fillText(t, x + 8, y); });
        ctx.restore(); } }]
    });
  }

  function renderDelai() {
    var d = dem();
    var rows = CANAUX.map(function (c) {
      var r = d.filter(function (x) { return x.canal === c && x.rep; });
      var ok = r.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length;
      var m = r.length ? r.reduce(function (s, x) { return s + x.delai; }, 0) / r.length : null;
      return { c: c, n: r.length, ok: ok, p: r.length ? ok / r.length * 100 : null, m: m, v: D.vise_canal[c] };
    });
    kill('delai');
    charts.delai = new Chart($('c-delai'), {
      type: 'bar',
      data: { labels: rows.map(function (r) { return r.c; }), datasets: [
        { label: 'Dans le délai', data: rows.map(function (r) { return r.p == null ? 0 : r.p; }), backgroundColor: rows.map(function (r) { return r.p != null && r.p < 75 ? O2 : O; }), borderRadius: 3, barThickness: 22 },
        { label: 'reste', data: rows.map(function (r) { return r.p == null ? 0 : 100 - r.p; }), backgroundColor: G3, borderRadius: 3, barThickness: 22 }
      ] },
      options: {
        indexAxis: 'y', maintainAspectRatio: false, responsive: true,
        scales: { x: { stacked: true, max: 100, grid: { display: false }, border: { display: false }, ticks: { display: false } },
          y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: INK, font: { size: 13, weight: 500 } } } },
        plugins: { legend: { display: false }, tooltip: { filter: function (c) { return c.datasetIndex === 0; }, callbacks: {
          label: function (c) { var r = rows[c.dataIndex]; return r.n ? ' ' + r.ok + ' sur ' + r.n + ' dans le délai · moyenne ' + heures(r.m) : ' aucune demande répondue'; } } } }
      },
      plugins: [{ id: 'lbl', afterDatasetsDraw: function (ch) {
        var ctx = ch.ctx; ctx.save(); ctx.textBaseline = 'middle';
        rows.forEach(function (r, i) {
          var y = ch.scales.y.getPixelForValue(i), x0 = ch.scales.x.getPixelForValue(0) + 9;
          ctx.font = '600 12.5px Inter, sans-serif'; ctx.fillStyle = r.n ? '#fff' : MUT;
          var t1 = r.n ? Math.round(r.p) + ' %' : 'aucune réponse';
          if (r.n && r.p < 22) ctx.fillStyle = INK;
          ctx.fillText(t1, x0, y);
          ctx.font = '400 12px Inter, sans-serif'; ctx.fillStyle = INK; ctx.textAlign = 'right';
          var t2 = r.n ? 'moy. ' + heures(r.m) + ' · visé ' + heures(r.v) : 'visé ' + heures(r.v);
          ctx.fillText(t2, ch.chartArea.right - 8, y); ctx.textAlign = 'left';
        });
        ctx.restore(); } }]
    });
  }

  var fc = 'Tous', fs = 'Tous', fq = '';
  function pillDem(st) { var k = { 'Répondu dans le délai': 'p-ok', 'Répondu hors délai': 'p-lateok', 'En attente': 'p-wait', 'En retard': 'p-late' }[st]; return '<span class="pill ' + k + '">' + esc(st) + '</span>'; }
  function renderTable() {
    var q = fq.toLowerCase();
    var d = dem().filter(function (x) {
      return (fc === 'Tous' || x.canal === fc) && (fs === 'Tous' || x.statut === fs) &&
        (!q || [x.client, x.objet, x.demande, x.n, x.transmis].join(' ').toLowerCase().indexOf(q) >= 0);
    }).slice().reverse();
    $('d-cnt').textContent = d.length + ' sur ' + dem().length;
    var tb = document.querySelector('#t-dem tbody');
    if (!d.length) { tb.innerHTML = '<tr><td colspan="8" class="empty">Aucune demande pour ces filtres.</td></tr>'; return; }
    tb.innerHTML = d.map(function (x) {
      return '<tr><td class="c-n nw">' + esc(x.n) + '</td><td class="c-dt nw">' + dd(x.recue) + ' <span class="muted">' + hh(x.recue) + '</span></td>' +
        '<td class="c-ca"><span class="canal">' + svg(x.canal) + esc(x.canal) + '</span></td>' +
        '<td class="c-cl">' + esc(x.client) + (soc === 'Groupe' ? '<span class="soc">' + esc(x.soc) + '</span>' : '') + '</td>' +
        '<td class="c-ob"><b>' + esc(x.objet) + '</b><div class="dm">« ' + esc(x.demande) + ' »</div></td>' +
        '<td class="c-de r">' + heures(x.delai) + ' <span class="muted">/ ' + heures(x.vise) + '</span></td>' +
        '<td class="c-st">' + pillDem(x.statut) + '</td><td class="c-tr">' + esc(x.transmis || '') + '</td></tr>';
    }).join('');
  }
  function fillSel(id, label, opts) {
    var s = $(id); s.innerHTML = '<option value="Tous">' + label + '</option>' + opts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('');
  }

  function alerteCls(a) { return a === 'En retard' ? 'al-r' : 'al-a'; }
  function renderBoard() {
    var a = atl();
    var h = $('board');
    $('flow').innerHTML = STATUTS.map(function (st, i) { return (i ? '<span>›</span>' : '') + '<span><b>' + a.filter(function (x) { return x.statut === st; }).length + '</b> ' + st.toLowerCase() + '</span>'; }).join(' ');
    if (!a.length) {
      $('flow').hidden = true; document.querySelector('.board-wrap').hidden = true; document.querySelector('.g-at').hidden = true;
      if (!$('noat')) { var p = document.createElement('p'); p.id = 'noat'; p.className = 'nodata'; document.querySelector('#b-atelier .bh').after(p); }
      $('noat').hidden = false;
      $('noat').textContent = soc + ' n\'a aucune machine dans le suivi d\'atelier : ses demandes passent par le registre ci-dessus. Les réparations du groupe sont suivies chez SACRI et PST-CI.';
      return;
    }
    $('flow').hidden = false; document.querySelector('.board-wrap').hidden = false; document.querySelector('.g-at').hidden = false;
    if ($('noat')) $('noat').hidden = true;
    h.innerHTML = STATUTS.map(function (st) {
      var it = a.filter(function (x) { return x.statut === st; });
      return '<div class="col' + (st === 'Remise' ? ' done' : '') + '"><div class="col-h"><p>' + st + '</p><span>' + it.length + '</span></div>' +
        it.map(function (x) {
          return '<button class="mc' + (x.alerte === 'En retard' ? ' late' : '') + (sel === x.br ? ' sel' : '') + '" data-br="' + x.br + '">' +
            '<span class="br">' + esc(x.br.replace('BR-2026-', 'BR ')) + (soc === 'Groupe' ? ' · ' + esc(x.soc) : '') + '</span>' +
            '<p class="cl">' + esc(x.client) + '</p><p class="md">' + esc(x.mat) + ' · ' + esc(x.modele) + '</p><p class="md">' + esc(x.panne) + '</p>' +
            (x.alerte ? '<span class="al ' + alerteCls(x.alerte) + '">' + esc(x.alerte) + '</span>' : '') +
            '<div class="ft"><span>' + (x.montant ? fcfa(x.montant) : 'devis à venir') + '</span><span class="j">' + (x.note != null ? '<span class="nt">★ ' + n0(x.note) + '/5</span> · ' : '') + x.jours + ' j / ' + x.vise + '</span></div></button>';
        }).join('') + '</div>';
    }).join('');
    h.querySelectorAll('.mc').forEach(function (b) { b.addEventListener('click', function () { sel = b.getAttribute('data-br'); renderBoard(); renderMsg(); if (window.innerWidth < 760) $('msg-card').scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
  }

  function renderJours() {
    var a = atl().filter(function (x) { return x.statut !== 'Remise'; }).sort(function (p, q) { return (q.jours - q.vise) - (p.jours - p.vise); });
    kill('jours');
    if (!a.length) return;
    $('ch-jours').style.height = Math.max(220, a.length * 30 + 60) + 'px';
    var vis = a.map(function (x) { return x.vise; });
    charts.jours = new Chart($('c-jours'), {
      type: 'bar',
      data: { labels: a.map(function (x) { return x.br.replace('BR-2026-', 'BR ') + ' · ' + x.client; }), datasets: [{ label: 'Jours en atelier', data: a.map(function (x) { return x.jours; }),
        backgroundColor: a.map(function (x) { return x.alerte === 'En retard' ? RED : x.statut === 'Prête' ? AMB : O; }), borderRadius: 3, barThickness: 16 }] },
      options: { indexAxis: 'y', maintainAspectRatio: false, responsive: true,
        scales: { x: { grid: { color: G3 }, border: { display: false }, ticks: { precision: 0 }, suggestedMax: 22, title: { display: true, text: 'jours en atelier', color: MUT } },
          y: { grid: { display: false }, border: { display: false }, ticks: { color: INK, autoSkip: false, callback: function (v) { var l = this.getLabelForValue(v); if (window.innerWidth < 760) { l = l.split(' · ')[1] || l; return l.length > 17 ? l.slice(0, 16) + '…' : l; } return l; } } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var x = a[c.dataIndex]; return ' ' + x.jours + ' j en atelier · visé ' + x.vise + ' j · ' + x.statut + (x.alerte ? ' · ' + x.alerte : ''); } } } },
        onClick: function (e, el) { if (el.length) { sel = a[el[0].index].br; renderBoard(); renderMsg(); } } },
      plugins: [{ id: 'vise', afterDatasetsDraw: function (ch) {
        var ctx = ch.ctx, m = ch.getDatasetMeta(0); ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 2;
        m.data.forEach(function (b, i) { var x = ch.scales.x.getPixelForValue(vis[i]); ctx.beginPath(); ctx.moveTo(x, b.y - 11); ctx.lineTo(x, b.y + 11); ctx.stroke(); });
        ctx.restore(); } }]
    });
  }

  function renderMsg() {
    var a = atl();
    var x = a.filter(function (y) { return y.br === sel; })[0];
    if (!x) { x = a.filter(function (y) { return y.alerte === 'En retard'; })[0] || a.filter(function (y) { return y.statut !== 'Remise'; })[0] || a[0]; sel = x ? x.br : null; }
    if (!x) { $('msg').innerHTML = ''; return; }
    $('msg').innerHTML = '<div class="mh2"><span><b>' + esc(x.client) + '</b> · ' + esc(x.br) + '</span><span>' + esc(x.statut) + (x.alerte ? ' · <b style="color:' + (x.alerte === 'En retard' ? RED : '#9A6416') + '">' + esc(x.alerte) + '</b>' : '') + '</span></div>' +
      '<div class="bubble">' + esc(x.msg) + '</div>' +
      '<div class="facts"><div><span>Reçue le</span><b>' + dd(x.recue) + '</b></div><div><span>En atelier</span><b>' + x.jours + ' j / ' + x.vise + ' visés</b></div><div><span>Devis</span><b>' + fcfa(x.montant) + '</b></div>' +
      '<div><span>Technicien</span><b>' + esc(x.tech) + '</b></div><div><span>N° de série</span><b>' + esc(x.serie) + '</b></div><div><span>Type de client</span><b>' + esc(x.type) + '</b></div></div>' +
      '<p class="warnline">Message relu par le service client avant l\'envoi : aucune date ni aucun montant n\'y est ajouté sans validation.</p>';
  }

  function renderPieces() {
    var sic = ['camera', 'pin', 'search', 'check'];
    $('steps').innerHTML = D.etapes.map(function (e, i) {
      return '<li><div class="sn"><i>' + e.n + '</i>' + svg(sic[i]) + '</div><h3>' + esc(e.quoi) + '</h3><p>' + esc(e.comment) + '</p><p class="who">Au client : <b>' + esc(e.client) + '</b></p><p class="who">Qui : <b>' + esc(e.qui) + '</b> · contrôle : ' + esc(e.ctrl) + '</p></li>';
    }).join('');
    function socOf(e) { return /PST-CI/.test(e.ref + e.reponse) ? 'PST-CI' : /Trans-Roulements/.test(e.ref + e.reponse) ? 'Trans-Roulements' : /STIHL/.test(e.machine + e.ref) ? 'SACRI' : 'SACRI'; }
    var ex = D.exemples.filter(function (e) { return soc === 'Groupe' || socOf(e) === soc; });
    $('cap-cases').textContent = ex.length === D.exemples.length ? 'Huit demandes types et la réponse attendue' : (ex.length ? ex.length + (ex.length > 1 ? ' demandes types' : ' demande type') + ' pour ' + soc + ' et la réponse attendue' : 'Demandes types');
    $('cases').innerHTML = ex.length ? ex.map(function (e) {
      return '<div class="case"><p class="ph">' + svg(/Message|Référence lue/.test(e.envoi) ? 'msg' : 'camera') + esc(e.envoi) + '</p><p class="m">' + esc(e.machine) + '</p>' +
        '<p class="pc">' + esc(e.piece) + '</p><p class="rf">' + esc(e.ref) + '</p><p class="rp">' + esc(e.reponse) + '</p><span class="tag">' + socOf(e) + '</span></div>';
    }).join('') : '<p class="nodata">Aucun exemple de pièce pour ' + esc(soc) + ' : la méthode en quatre étapes reste la même.</p>';
  }

  function renderSocs() {
    var all = ['Groupe'].concat(SOCS);
    $('socs').innerHTML = all.map(function (k) {
      var n = k === 'Groupe' ? D.demandes.length + D.atelier.length : D.demandes.filter(function (x) { return x.soc === k; }).length + D.atelier.filter(function (x) { return x.soc === k; }).length;
      return '<button type="button" data-k="' + k + '" class="' + (k === soc ? 'on' : '') + '" aria-pressed="' + (k === soc) + '">' + k + '</button>';
    }).join('');
    $('socs').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { soc = b.getAttribute('data-k'); sel = null; render(); }); });
  }

  function render() {
    var s = stats();
    renderSocs(); renderHead(s); renderKpis(s); renderCanal(); renderDelai(); renderTable(); renderBoard(); renderJours(); renderMsg(); renderPieces();
  }

  fetch('data/donnees.json?v=20261118d').then(function (r) { return r.json(); }).then(function (j) {
    D = j;
    var r = dt(D.ref);
    $('arrete').textContent = 'Situation au ' + JOURS[r.getDay()] + ' ' + r.getDate() + ' ' + MOIS[r.getMonth()] + ' ' + r.getFullYear() + ', ' + r.getHours() + ' h';
    fillSel('f-canal', 'Tous les canaux', CANAUX);
    fillSel('f-statut', 'Tous les statuts', ST_DEM);
    $('f-canal').addEventListener('change', function () { fc = this.value; renderTable(); });
    $('f-statut').addEventListener('change', function () { fs = this.value; renderTable(); });
    $('f-q').addEventListener('input', function () { fq = this.value.trim(); renderTable(); });
    render();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(renderJours, 200); });
  });
})();
