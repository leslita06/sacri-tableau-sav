// SACRI, service client et après-vente : boîte de réception, atelier, envoi, pièce sur photo.
// Données de démonstration (data/donnees.json). Aucun message ne part de cette page.
(function () {
  'use strict';
  var SOCS = ['SACRI', 'PST-CI', 'Trans-Roulements', 'SAFIR', 'DEFI'];
  var CANAUX = [['WhatsApp', 'message-circle'], ['E-mail', 'mail'], ['Téléphone', 'phone'], ['Comptoir', 'store']];
  var CIC = {}; CANAUX.forEach(function (c) { CIC[c[0]] = c[1]; });
  var COLS = [
    ['Reçue', 'Reçue', '#A3A3A0', 'Machine déposée, bon remis'],
    ['Diagnostic', 'Diagnostic', '#6B8FB8', 'Le technicien cherche la panne'],
    ['Devis envoyé', 'Devis en attente', '#D99A1E', 'On attend l\'accord du client'],
    ['Accord client', 'Attente pièce', '#8E79B8', 'Pièce à sortir ou à commander'],
    ['En réparation', 'En réparation', '#E95B0F', 'Le technicien répare'],
    ['Prête', 'Réparée', '#3FA06A', 'Prête à retirer']
  ];
  var PROG = COLS.map(function (c) { return [c[0], c[1]]; }).concat([['Remise', 'Rendue']]);
  var ETQ = {}; PROG.forEach(function (e) { ETQ[e[0]] = e[1]; });
  var VUES = { messages: 'Boîte de réception', atelier: 'Atelier', reclamations: 'Réclamations', retours: 'Retours machines', rapport: 'Rapport de la semaine', envoi: 'Écrire aux clients', piece: 'Pièce sur photo' };
  var D, soc = 'Groupe', vue = 'messages', selM = null, fst = 'tous', fq = '', showAll = false;

  function $(id) { return document.getElementById(id); }
  function ico(k, c) { return window.ico(k, c); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fillIcons(root) { (root || document).querySelectorAll('i[data-i]').forEach(function (i) { i.outerHTML = ico(i.getAttribute('data-i')); }); }
  var nf1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  function n0(x) { return nf0.format(x); }
  function n1(x) { return nf1.format(x); }
  function dt(s) { return s ? new Date(s.length === 16 ? s + ':00' : s) : null; }
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var JC = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  function dd(s) { var d = dt(s); return d ? String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') : ''; }
  function hh(s) { var d = dt(s); return d ? d.getHours() + ' h ' + String(d.getMinutes()).padStart(2, '0') : ''; }
  function jour(s) { var d = dt(s); return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()]; }
  function dur(x) { if (x == null) return ''; if (x < 1) return n0(Math.round(x * 60)) + ' min'; return n1(x) + ' h'; }
  function fcfa(x) { return x == null ? 'à établir' : n0(x) + ' FCFA'; }
  function day0(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function sameDay(a, b) { return day0(a).getTime() === day0(b).getTime(); }
  function pl(n, s, p) { return n0(n) + ' ' + (n > 1 ? (p || s + 's') : s); }
  function initials(n) {
    var w = String(n).replace(/^(M\.|Mme|Mlle)\s+/, '').replace(/[&,]/g, ' ').split(/\s+/).filter(function (x) { return x && !/^(du|de|des|la|le|les|d'|et|SA)$/i.test(x); });
    return ((w[0] || '?')[0] + (w[1] ? w[1][0] : (w[0] || '?')[1] || '')).toUpperCase();
  }
  function hcol(n) { var h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0; return 'c' + (h % 6); }
  function avatar(n, cls) { return '<span class="av ' + hcol(n) + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + esc(initials(n)) + '</span>'; }

  // ---------- statut des messages ----------
  function st3(x) { return x.rep ? 'Traité' : x.statut === 'En retard' ? 'Non traité' : 'En cours'; }
  var STP = { 'Traité': 'g', 'En cours': 'a', 'Non traité': 'r' };
  function stPill(x) { var s = st3(x); return '<span class="pill ' + STP[s] + '"><i class="d"></i>' + s + '</span>'; }
  function dem() { return D.demandes.filter(function (x) { return soc === 'Groupe' || x.soc === soc; }); }
  function atl() { return D.atelier.filter(function (x) { return soc === 'Groupe' || x.soc === soc; }); }

  // ---------- photos ----------
  function photo(a) {
    if (a.modele === 'STIHL MS 661') return 'assets/img/tronconneuse-ms661.jpg';
    if (a.mat === 'Tronçonneuse') return 'assets/img/tronconneuse.jpg';
    if (/FS 250/.test(a.modele)) return 'assets/img/debroussailleuse-fs250.jpg';
    if (a.mat === 'Débroussailleuse') return 'assets/img/debroussailleuse-fs400.jpg';
    if (a.mat === 'Compresseur') return 'assets/img/compresseur.jpg';
    return 'assets/img/hydraulique.jpg';
  }

  // ---------- chiffres clés ----------
  function spark(vals, color) {
    var w = 96, h = 38, p = 3, mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
    if (mx === mn) { mx += 1; mn -= 1; }
    var pts = vals.map(function (v, i) { return [p + i * (w - 2 * p) / (vals.length - 1), h - p - (v - mn) / (mx - mn) * (h - 2 * p)]; });
    var d = pts.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
    var a = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + h + ' L' + pts[0][0].toFixed(1) + ' ' + h + ' Z';
    var l = pts[pts.length - 1], gid = 'g' + Math.random().toString(36).slice(2, 7);
    return '<svg class="sp" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".16"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs><path d="' + a + '" fill="url(#' + gid + ')"/><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="' + l[0].toFixed(1) + '" cy="' + l[1].toFixed(1) + '" r="2.6" fill="' + color + '"/></svg>';
  }
  // delta : sens de la variation et si la hausse est une bonne nouvelle
  function delta(cur, prev, upGood, fmt, lbl) {
    if (prev == null || cur == null) return '';
    var df = cur - prev;
    if (Math.abs(df) < 1e-9) return '<span class="dl nt">= stable</span>' + (lbl ? '<span>' + lbl + '</span>' : '');
    var good = upGood == null ? null : (df > 0) === upGood;
    return '<span class="dl ' + (good == null ? 'nt' : good ? 'up' : 'dn') + '">' + (df > 0 ? '▲ ' : '▼ ') + (fmt ? fmt(Math.abs(df)) : n0(Math.abs(df))) + '</span>' + (lbl ? '<span>' + lbl + '</span>' : '');
  }
  function kc(o) {
    return '<div class="kc' + (o.cls ? ' ' + o.cls : '') + '"><p class="l">' + ico(o.ic) + o.l + '</p><div class="vr"><p class="v">' + o.v + (o.u ? '<small>' + o.u + '</small>' : '') + '</p>' + (o.sp || '') + '</div><p class="s">' + o.s + '</p></div>';
  }

  // ---------- menu société ----------
  function renderSel() {
    $('sel-l').textContent = soc === 'Groupe' ? 'Toutes les sociétés' : soc;
    $('sel-b').classList.toggle('on', soc !== 'Groupe');
    var it = [['Groupe', 'Toutes les sociétés', 'Vue d\'ensemble du groupe']].concat(SOCS.map(function (k) {
      var m = D.demandes.filter(function (x) { return x.soc === k; }).length, a = D.atelier.filter(function (x) { return x.soc === k && x.statut !== 'Remise'; }).length;
      return [k, k, pl(m, 'message') + (a ? ', ' + pl(a, 'machine') + ' à l\'atelier' : '')];
    }));
    $('menu').innerHTML = it.map(function (x, i) {
      return (i === 1 ? '<div class="msep"></div>' : '') + '<button class="mi' + (soc === x[0] ? ' on' : '') + '" data-k="' + x[0] + '"><span><b>' + esc(x[1]) + '</b><small>' + esc(x[2]) + '</small></span>' + ico('check', 'ck') + '</button>';
    }).join('');
    $('menu').querySelectorAll('.mi').forEach(function (b) {
      b.addEventListener('click', function () { soc = b.getAttribute('data-k'); selM = null; showAll = false; closeMenu(); renderSel(); render(); });
    });
  }
  function closeMenu() { $('menu').classList.remove('on'); $('sel-b').setAttribute('aria-expanded', 'false'); }

  // ---------- vue 1 : boîte de réception ----------
  function days() {
    var ref = day0(dt(D.ref)), out = [];
    for (var i = 3; i >= 0; i--) out.push(new Date(ref.getTime() - i * 864e5));
    return out;
  }
  function renderMessages() {
    var d = dem(), ref = dt(D.ref), J = days();
    var c = { 'Traité': 0, 'En cours': 0, 'Non traité': 0 };
    d.forEach(function (x) { c[st3(x)]++; });
    var perDay = J.map(function (j) { return d.filter(function (x) { return sameDay(dt(x.recue), j); }).length; });
    var rep = d.filter(function (x) { return x.rep; });
    function moyJ(j) { var r = rep.filter(function (x) { return sameDay(dt(x.recue), j); }); return r.length ? r.reduce(function (s, x) { return s + x.delai; }, 0) / r.length : null; }
    function okJ(j) { var r = rep.filter(function (x) { return sameDay(dt(x.recue), j); }); return r.length ? r.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length / r.length * 100 : null; }
    var moy = rep.length ? rep.reduce(function (s, x) { return s + x.delai; }, 0) / rep.length : null;
    var pok = rep.length ? Math.round(rep.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length / rep.length * 100) : null;
    var mj = J.map(moyJ), oj = J.map(okJ);
    function lastTwo(a) { var v = a.filter(function (x) { return x != null; }); return v.length > 1 ? [v[v.length - 1], v[v.length - 2]] : [null, null]; }
    var ld = lastTwo(mj), lo = lastTwo(oj);
    var aT = c['Non traité'] + c['En cours'];
    var nt = d.filter(function (x) { return st3(x) === 'Non traité'; });

    $('m-lede').innerHTML = '<b>' + pl(d.length, 'message') + '</b> ' + (d.length > 1 ? 'reçus' : 'reçu') + ' depuis le lundi 16 novembre' + (soc === 'Groupe' ? '' : ' chez ' + esc(soc)) + ' : ' + n0(c['Traité']) + ' ' + (c['Traité'] > 1 ? 'traités' : 'traité') +
      (c['En cours'] ? ', ' + n0(c['En cours']) + ' en cours' : '') + (nt.length ? ', <span class="r">' + pl(nt.length, 'non traité', 'non traités') + '</span> au-delà du délai visé.' : ', aucun en retard.');

    var h = kc({ ic: 'inbox', l: 'Messages reçus', v: n0(d.length), sp: spark(perDay, '#E95B0F'), cls: 'key',
      s: delta(perDay[3], perDay[2], null, null, 'aujourd\'hui (' + n0(perDay[3]) + ') contre hier') });
    h += kc({ ic: 'triangle-alert', l: 'Non traités', v: nt.length ? n0(nt.length) : 'Aucun', cls: nt.length ? 'bad' : '',
      s: nt.length ? '<span><b>' + esc(nt[0].client) + '</b> attend depuis ' + dur(nt[0].delai) + '</span>' : c['En cours'] ? pl(c['En cours'], 'message') + ' en cours, dans le délai' : 'tous les messages ont une réponse' });
    h += kc({ ic: 'timer', l: 'Délai moyen de réponse', v: moy == null ? '–' : moy < 1 ? n0(Math.round(moy * 60)) : n1(moy), u: moy == null ? '' : moy < 1 ? 'min' : 'h',
      sp: mj.filter(function (x) { return x != null; }).length > 1 ? spark(mj.map(function (x) { return x == null ? 0 : x; }), '#6B6B6B') : '',
      s: ld[0] != null ? delta(ld[0], ld[1], false, function (v) { return dur(v); }, 'sur le dernier jour') : 'sur les messages traités' });
    h += kc({ ic: 'circle-check-big', l: 'Répondus dans le délai visé', v: pok == null ? '–' : n0(pok), u: pok == null ? '' : '%',
      sp: oj.filter(function (x) { return x != null; }).length > 1 ? spark(oj.map(function (x) { return x == null ? 0 : x; }), '#18794E') : '',
      s: lo[0] != null ? delta(Math.round(lo[0]), Math.round(lo[1]), true, function (v) { return n0(v) + ' pts'; }, 'sur le dernier jour') : 'délai visé selon le canal' });
    $('m-kpis').innerHTML = h;

    // segments de filtre
    var segs = [['tous', 'Tous', d.length, ''], ['atraiter', 'À traiter', aT, nt.length ? 'r' : ''], ['traites', 'Traités', c['Traité'], '']];
    $('f-st').innerHTML = segs.map(function (s) { return '<button data-s="' + s[0] + '" class="' + (fst === s[0] ? 'on' : '') + '">' + s[1] + (s[2] ? ' <span class="c ' + s[3] + '">' + n0(s[2]) + '</span>' : '') + '</button>'; }).join('');
    $('f-st').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { fst = b.getAttribute('data-s'); showAll = false; renderMessages(); }); });

    renderRows(d);
    renderChan(d);
  }
  function filtered(d) {
    var q = fq.toLowerCase();
    return d.filter(function (x) {
      var s = st3(x);
      if (fst === 'atraiter' && s === 'Traité') return false;
      if (fst === 'traites' && s !== 'Traité') return false;
      return !q || [x.client, x.objet, x.demande, x.n, x.transmis, x.canal, x.soc].join(' ').toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) {
      var r = { 'Non traité': 0, 'En cours': 1, 'Traité': 2 };
      return (r[st3(a)] - r[st3(b)]) || (dt(b.recue) - dt(a.recue));
    });
  }
  function relTime(s) {
    var d = dt(s), ref = dt(D.ref);
    if (sameDay(d, ref)) return hh(s);
    return JC[d.getDay()] + ' ' + d.getDate();
  }
  function renderRows(all) {
    var d = filtered(all), mob = window.innerWidth <= 900, LIM = 7;
    if (!d.length) { $('ib-rows').innerHTML = '<p class="empty">Aucun message pour cette recherche.</p>'; $('ib-conv').innerHTML = ''; return; }
    if (!d.some(function (x) { return x.n === selM; })) selM = d[0].n;
    $('ib-rows').innerHTML = d.map(function (x, i) {
      return '<button class="ir' + (x.n === selM ? ' on' : '') + (mob && !showAll && i >= LIM ? ' hid' : '') + '" data-n="' + x.n + '">' + avatar(x.client) +
        '<span style="min-width:0"><span class="t1"><span class="nm">' + esc(x.client) + '</span><span class="tm">' + relTime(x.recue) + '</span></span>' +
        '<span class="ob" style="display:block">' + esc(x.objet) + '</span>' +
        '<span class="pv" style="display:block">' + esc(x.demande) + '</span>' +
        '<span class="t3">' + stPill(x) + '<span class="ch-ic">' + ico(CIC[x.canal]) + esc(x.canal) + '</span>' + (soc === 'Groupe' ? '<span class="soc">' + esc(x.soc) + '</span>' : '') + '</span></span></button>';
    }).join('') + (mob && !showAll && d.length > LIM ? '<button class="more" id="more">Voir les ' + n0(d.length - LIM) + ' autres messages' + ico('chevron-down') + '</button>' : '');
    $('ib-rows').querySelectorAll('.ir').forEach(function (b) {
      b.addEventListener('click', function () {
        selM = b.getAttribute('data-n');
        if (window.innerWidth <= 900) { openConv(all.filter(function (x) { return x.n === selM; })[0]); return; }
        $('ib-rows').querySelectorAll('.ir').forEach(function (r) { r.classList.toggle('on', r === b); });
        $('ib-conv').innerHTML = conv(all.filter(function (x) { return x.n === selM; })[0], false); bindConv($('ib-conv'));
      });
    });
    if ($('more')) $('more').addEventListener('click', function () { showAll = true; renderRows(all); });
    $('ib-conv').innerHTML = conv(d.filter(function (x) { return x.n === selM; })[0], false); bindConv($('ib-conv'));
  }
  function machineOf(x) {
    return D.atelier.filter(function (a) { return a.client === x.client && a.statut !== 'Remise'; }).sort(function (a, b) { return dt(b.recue) - dt(a.recue); })[0];
  }
  function conv(x, inDrawer) {
    if (!x) return '';
    var s = st3(x), m = machineOf(x);
    var thread = '<div class="thread"><span class="dsep">' + jour(x.recue) + '</span>' +
      '<div class="msg">' + avatar(x.client) + '<div><div class="bb">' + esc(x.demande) + '</div><p class="bm">' + ico(CIC[x.canal]) + esc(x.canal) + ', ' + hh(x.recue) + '</p></div></div>' +
      '<div class="ev">' + '<span class="ei">' + ico('tag') + '</span><span>Classé <b>' + esc(x.objet) + '</b>, délai visé <b>' + dur(x.vise) + '</b></span></div>' +
      (x.transmis ? '<div class="ev"><span class="ei">' + ico('send') + '</span><span>Transmis à <b>' + esc(x.transmis) + '</b></span></div>' : '') +
      (x.rep ? '<div class="ev ' + (x.statut === 'Répondu dans le délai' ? 'ok' : 'late') + '"><span class="ei">' + ico(x.statut === 'Répondu dans le délai' ? 'check' : 'clock') + '</span><span>Réponse envoyée le ' + dd(x.rep) + ' à ' + hh(x.rep) + ', en <b>' + dur(x.delai) + '</b>' + (x.statut === 'Répondu dans le délai' ? ', dans le délai' : ', au-delà du délai visé') + '</span></div>'
        : s === 'Non traité' ? '<div class="ev late"><span class="ei">' + ico('triangle-alert') + '</span><span>Sans réponse depuis <b>' + dur(x.delai) + '</b>, délai visé ' + dur(x.vise) + ' dépassé</span></div>'
        : '<div class="ev wait"><span class="ei">' + ico('hourglass') + '</span><span>En attente de réponse depuis <b>' + dur(x.delai) + '</b>, délai visé ' + dur(x.vise) + '</span></div>') +
      (m ? '<div class="ev"><span class="ei">' + ico('wrench') + '</span><span>Machine à l\'atelier : <b>' + esc(m.modele) + '</b>, ' + esc(ETQ[m.statut].toLowerCase()) + ' (' + esc(m.br) + ')</span></div>' : '') +
      '</div>';
    var sideKV = '<aside class="cv-side"><h4>Détails</h4><div class="kv">' +
      '<div><span>Statut</span><b>' + stPill(x) + '</b></div>' +
      '<div><span>Société</span><b>' + esc(x.soc) + '</b></div>' +
      '<div><span>Canal</span><b>' + esc(x.canal) + '</b></div>' +
      '<div><span>Reçu le</span><b>' + dd(x.recue) + ' à ' + hh(x.recue) + '</b></div>' +
      '<div><span>Délai de réponse</span><b class="' + (x.statut === 'Répondu hors délai' || s === 'Non traité' ? 'red' : '') + '">' + dur(x.delai) + ' / ' + dur(x.vise) + ' visé</b></div>' +
      '<div><span>Suivi par</span><b>' + esc(x.transmis || 'Service client') + '</b></div>' +
      (m ? '<div><span>Machine</span><b><a href="#atelier" data-br="' + m.br + '" class="go-m" style="color:var(--acct)">' + esc(m.br) + '</a></b></div>' : '') +
      '</div></aside>';
    var head = '<div class="cv-h">' + avatar(x.client) + '<div style="min-width:0"><p class="nm">' + esc(x.client) + '</p><p class="mt"><span>' + esc(x.n) + '</span><span class="soc">' + esc(x.soc) + '</span><span class="ch-ic">' + ico(CIC[x.canal]) + esc(x.canal) + '</span></p></div>' +
      (inDrawer ? '' : '<div class="act">' + stPill(x) + '</div>') + '</div>';
    var comp = '<div class="comp"><span class="in">' + ico('square-pen') + 'Répondre sur ' + esc(x.canal === 'WhatsApp' ? 'WhatsApp' : x.canal === 'E-mail' ? 'e-mail' : 'la fiche client') + ' (démonstration)</span><span class="snd">' + ico('send') + '</span></div>';
    if (inDrawer) return head + thread + '<div style="padding:16px 18px;border-top:1px solid var(--line2)"><div class="kv">' + sideKV.replace(/^<aside class="cv-side"><h4>Détails<\/h4><div class="kv">/, '').replace(/<\/div><\/aside>$/, '') + '</div></div>' + comp;
    return head + '<div class="cv-body">' + thread + sideKV + '</div>' + comp;
  }
  function bindConv(root) {
    root.querySelectorAll('.go-m').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); closeDrawer(); var br = a.getAttribute('data-br'); location.hash = 'atelier'; setTimeout(function () { openMachine(D.atelier.filter(function (z) { return z.br === br; })[0]); }, 60); }); });
  }
  function renderChan(d) {
    $('m-chan').innerHTML = CANAUX.map(function (c) {
      var r = d.filter(function (x) { return x.canal === c[0]; });
      if (!r.length) return '';
      var t = r.filter(function (x) { return st3(x) === 'Traité'; }).length, e = r.filter(function (x) { return st3(x) === 'En cours'; }).length, n = r.length - t - e;
      var rp = r.filter(function (x) { return x.rep; }), ok = rp.filter(function (x) { return x.statut === 'Répondu dans le délai'; }).length;
      var moy = rp.length ? rp.reduce(function (s, x) { return s + x.delai; }, 0) / rp.length : null;
      return '<div class="chc"><p class="h"><span class="ti">' + ico(c[1]) + '</span>' + c[0] + '<span class="n">' + n0(r.length) + '</span></p>' +
        '<div class="tr"><i style="flex:' + t + ';background:#BDBDB8"></i>' + (e ? '<i style="flex:' + e + ';background:#D99A1E"></i>' : '') + (n ? '<i style="flex:' + n + ';background:var(--red)"></i>' : '') + '</div>' +
        '<p class="s">' + (rp.length ? '<b>' + n0(Math.round(ok / rp.length * 100)) + ' %</b> dans le délai, en moyenne ' + dur(moy) + ', visé ' + dur(D.vise_canal[c[0]]) : 'en attente de réponse, délai visé ' + dur(D.vise_canal[c[0]])) + '</p></div>';
    }).join('');
  }

  // ---------- vue 2 : atelier ----------
  function lateAt(a, d) {
    var r = day0(dt(a.recue)), age = Math.round((d - r) / 864e5);
    if (r > d) return null;
    if (a.remise && day0(dt(a.remise)) <= d) return null;
    var st = { open: true, late: false, ready: !!(a.prete && day0(dt(a.prete)) <= d) };
    var waitDevis = a.devis_le && day0(dt(a.devis_le)) <= d && !(a.accord && day0(dt(a.accord)) <= d);
    st.late = !st.ready && !waitDevis && age > a.vise;
    return st;
  }
  function renderAtelier() {
    var a = atl(), enc = a.filter(function (x) { return x.statut !== 'Remise'; });
    if (!a.length) {
      $('a-lede').innerHTML = esc(soc) + ' n\'a pas de machine dans le suivi d\'atelier : les réparations du groupe passent par les ateliers SACRI et PST-CI.';
      $('a-kpis').innerHTML = ''; $('kb').innerHTML = '<div class="nodata" style="grid-column:1/-1;flex:1">Aucune machine en atelier pour ' + esc(soc) + '. Choisissez SACRI, PST-CI ou toutes les sociétés.</div>';
      $('rendu').innerHTML = ''; $('r-cnt').textContent = ''; return;
    }
    var ret = enc.filter(function (x) { return x.alerte === 'En retard'; }), pr = enc.filter(function (x) { return x.statut === 'Prête'; }), dv = enc.filter(function (x) { return x.statut === 'Devis envoyé'; });
    $('a-lede').innerHTML = '<b>' + pl(enc.length, 'machine') + '</b> ' + (enc.length > 1 ? 'sont' : 'est') + ' à l\'atelier' + (ret.length ? ', dont <span class="r">' + n0(ret.length) + ' en retard</span> sur le délai visé' : '') + (pr.length ? ' ; ' + pl(pr.length, 'machine réparée', 'machines réparées') + ' ' + (pr.length > 1 ? 'attendent' : 'attend') + ' leur client.' : '.');
    var ref = day0(dt(D.ref)), J = [];
    for (var i = 7; i >= 0; i--) J.push(new Date(ref.getTime() - i * 864e5));
    var sOpen = J.map(function (d) { return a.filter(function (x) { return lateAt(x, d); }).length; });
    var sLate = J.map(function (d) { return a.filter(function (x) { var s = lateAt(x, d); return s && s.late; }).length; });
    var sReady = J.map(function (d) { return a.filter(function (x) { var s = lateAt(x, d); return s && s.ready; }).length; });
    var h = kc({ ic: 'wrench', l: 'Machines à l\'atelier', v: n0(enc.length), cls: 'key', sp: spark(sOpen, '#E95B0F'), s: delta(sOpen[7], sOpen[0], null, null, 'en une semaine') });
    h += kc({ ic: 'triangle-alert', l: 'En retard', v: ret.length ? n0(ret.length) : 'Aucune', cls: ret.length ? 'bad' : '', sp: spark(sLate, '#C8352B'), s: delta(sLate[7], sLate[0], false, null, 'en une semaine') });
    h += kc({ ic: 'circle-check-big', l: 'Réparées, à rendre', v: pr.length ? n0(pr.length) : 'Aucune', sp: spark(sReady, '#18794E'), s: pr.length ? 'clients à prévenir ou à rappeler' : 'aucune machine n\'attend son client' });
    h += kc({ ic: 'file-text', l: 'Devis en attente d\'accord', v: dv.length ? n0(dv.length) : 'Aucun', s: dv.length ? '<span><b>' + n0(dv.filter(function (x) { return x.alerte === 'Relancer le devis'; }).length) + '</b> à relancer, ' + n0(dv.reduce(function (s, x) { return s + (x.montant || 0); }, 0)) + ' FCFA</span>' : 'tous les devis ont une réponse' });
    $('a-kpis').innerHTML = h;

    $('kb').innerHTML = COLS.map(function (c) {
      var it = enc.filter(function (x) { return x.statut === c[0]; }).sort(function (p, q) { return (q.jours - q.vise) - (p.jours - p.vise); });
      return '<div class="col"><p class="col-h"><span class="dt" style="background:' + c[2] + '"></span>' + c[1] + '<span class="n">' + it.length + '</span></p><p class="col-d">' + c[3] + '</p>' +
        (it.length ? it.map(card).join('') : '<p class="col-d" style="padding:14px 4px;text-align:center">Aucune machine à cette étape</p>') + '</div>';
    }).join('');
    var rd = a.filter(function (x) { return x.statut === 'Remise'; });
    $('r-cnt').textContent = rd.length ? n0(rd.length) : '';
    $('rendu').innerHTML = rd.length ? rd.map(function (x) {
      return '<button class="rc" data-br="' + x.br + '"><img src="' + photo(x) + '" alt="" loading="lazy"><div><p class="cl">' + esc(x.client) + '</p><p class="md">' + esc(x.modele) + ', rendue le ' + dd(x.remise) + ', en ' + x.jours + ' j</p></div></button>';
    }).join('') : '<p class="hint">Aucune machine rendue sur la période.</p>';
    document.querySelectorAll('#kb .mc, #rendu .rc').forEach(function (b) { b.addEventListener('click', function () { openMachine(D.atelier.filter(function (x) { return x.br === b.getAttribute('data-br'); })[0]); }); });
  }
  function alertPill(x) {
    if (!x.alerte || x.statut === 'Remise') return '';
    var k = x.alerte === 'En retard' ? 'r' : /Relancer/.test(x.alerte) ? 'a' : 'b';
    return '<span class="pill ' + k + '">' + esc(x.alerte) + '</span>';
  }
  function card(x) {
    var late = x.alerte === 'En retard', w = Math.min(100, x.jours / Math.max(x.vise, 1) * 100);
    return '<button class="mc" data-br="' + x.br + '"><span class="ph"><img src="' + photo(x) + '" alt="' + esc(x.mat) + '" loading="lazy">' + alertPill(x) + '</span>' +
      '<span class="bd" style="display:block"><span class="cl">' + esc(x.client) + '</span><span class="md" style="display:block">' + esc(x.modele) + ', ' + esc(x.br.replace('BR-2026-', 'BR ')) + '</span>' +
      '<span class="ft"><span class="jt' + (late ? ' late' : '') + '">' + x.jours + ' j / ' + x.vise + '</span><span class="gb"><i class="' + (late ? 'late' : '') + '" style="width:' + w + '%"></i></span>' + avatar(x.tech) + '</span></span></button>';
  }
  function openMachine(x) {
    if (!x) return;
    var idx = PROG.findIndex(function (e) { return e[0] === x.statut; });
    var jal = [['Machine reçue', x.recue], ['Devis envoyé', x.devis_le], ['Accord du client', x.accord], ['Réparée', x.prete], ['Rendue au client', x.remise]];
    $('dr-id').textContent = x.br + ', ' + x.soc;
    $('dr-b').className = 'dr-b';
    $('dr-b').innerHTML = '<div class="dh"><span class="img"><img src="' + photo(x) + '" alt="' + esc(x.mat) + '"></span><div><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="pill n">' + ETQ[x.statut] + '</span>' + alertPill(x) + '</div><h3>' + esc(x.client) + '</h3><p>' + esc(x.mat) + ', ' + esc(x.modele) + '</p></div></div>' +
      '<ol class="prog">' + PROG.map(function (e, i) { return '<li class="' + (i < idx ? 'done' : i === idx ? 'cur' : '') + '"><i></i>' + e[1] + '</li>'; }).join('') + '</ol>' +
      '<dl class="props"><dt>Panne</dt><dd>' + esc(x.panne) + '</dd><dt>À l\'atelier</dt><dd class="' + (x.alerte === 'En retard' ? 'red' : '') + '">' + x.jours + ' j pour ' + x.vise + ' j visés</dd><dt>Devis</dt><dd>' + fcfa(x.montant) + '</dd><dt>Technicien</dt><dd>' + avatar(x.tech) + esc(x.tech) + '</dd><dt>N° de série</dt><dd>' + esc(x.serie) + '</dd></dl>' +
      '<div class="tl"><h4>' + ico('history') + 'Suivi</h4>' + jal.map(function (j) { return '<div class="e' + (j[1] ? ' ok' : '') + '"><span>' + j[0] + '</span><b>' + (j[1] ? dd(j[1]) : 'à venir') + '</b></div>'; }).join('') + '</div>' +
      (x.msg ? '<div class="wa"><h4>' + ico('message-circle') + 'Message WhatsApp envoyé au client à cette étape</h4><div class="wab"><p>' + esc(x.msg) + '</p></div></div>' : '');
    openDrawer();
  }
  function openConv(x) {
    $('dr-id').textContent = x.n + ', ' + x.objet;
    $('dr-b').className = 'dr-b conv';
    $('dr-b').innerHTML = conv(x, true); bindConv($('dr-b'));
    openDrawer();
  }
  function openDrawer() { $('drawer').classList.add('on'); $('scrim').classList.add('on'); $('drawer').setAttribute('aria-hidden', 'false'); $('dr-b').scrollTop = 0; }
  function closeDrawer() { $('drawer').classList.remove('on'); $('scrim').classList.remove('on'); $('drawer').setAttribute('aria-hidden', 'true'); }

  // ---------- vue 4 : pièce sur photo ----------
  function renderPieces() {
    var sic = ['camera', 'scan-search', 'search', 'circle-check-big'];
    $('steps').innerHTML = D.etapes.map(function (e, i) {
      return '<li><div class="sn"><em>' + e.n + '</em>' + ico(sic[i]) + '</div><h3>' + esc(e.quoi) + '</h3><p>' + esc(e.comment) + '</p><p class="who">Au client : <b>' + esc(e.client) + '</b></p><p class="who">Qui : <b>' + esc(e.qui) + '</b>, contrôle : ' + esc(e.ctrl) + '</p></li>';
    }).join('');
    function socOf(e) { return /PST-CI/.test(e.ref + e.reponse) ? 'PST-CI' : /Trans-Roulements/.test(e.ref + e.reponse) ? 'Trans-Roulements' : 'SACRI'; }
    var ex = D.exemples.filter(function (e) { return soc === 'Groupe' || socOf(e) === soc; });
    $('cap-cases').innerHTML = (ex.length ? 'Demandes types et réponse attendue <span class="cnt">' + n0(ex.length) + '</span>' : 'Demandes types');
    $('cases').innerHTML = ex.length ? ex.map(function (e) {
      return '<div class="case"><p class="ph">' + ico(/Message|Référence lue/.test(e.envoi) ? 'message-circle' : 'camera') + esc(e.envoi) + '</p><p class="m">' + esc(e.machine) + '</p><p class="pc">' + esc(e.piece) + '</p><p class="rf">' + esc(e.ref) + '</p><p class="rp">' + esc(e.reponse) + '</p><span class="soc">' + socOf(e) + '</span></div>';
    }).join('') : '<p class="nodata" style="grid-column:1/-1">Pas d\'exemple de pièce pour ' + esc(soc) + ' : la méthode en quatre étapes reste la même.</p>';
  }

  // ---------- navigation ----------
  function badges() {
    var d = dem(), aT = d.filter(function (x) { return st3(x) !== 'Traité'; }).length, r = atl().filter(function (x) { return x.alerte === 'En retard' && x.statut !== 'Remise'; }).length;
    $('k-msg').textContent = aT ? n0(aT) : ''; $('t-msg').textContent = aT ? n0(aT) : '';
    $('k-at').textContent = r ? n0(r) : ''; $('t-at').textContent = r ? n0(r) : '';
    if (window.SacriSuivi) { var sc = window.SacriSuivi.counts(D, soc); $('k-rc').textContent = sc.red ? n0(sc.red) : ''; $('t-rc').textContent = sc.red ? n0(sc.red) : ''; $('k-rt').textContent = sc.rec ? n0(sc.rec) : ''; }
  }
  function render() {
    badges();
    if (vue === 'messages') renderMessages();
    if (vue === 'atelier') renderAtelier();
    if (vue === 'envoi' && window.SacriEnvoi) window.SacriEnvoi.render(soc);
    if (vue === 'piece') renderPieces();
    if ((vue === 'reclamations' || vue === 'retours' || vue === 'rapport') && window.SacriSuivi) window.SacriSuivi.render(vue, soc, D);
  }
  window.SacriSetSoc = function (k) { soc = k; selM = null; showAll = false; renderSel(); render(); };
  function setVue(v, scroll) {
    if (!VUES[v]) v = 'messages';
    vue = v; closeDrawer();
    Object.keys(VUES).forEach(function (k) { $('v-' + k).classList.toggle('on', k === v); });
    document.querySelectorAll('.ni, .tabbar a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-v') === v); });
    $('crumb-v').textContent = VUES[v];
    render();
    if (scroll) window.scrollTo({ top: 0 });
  }

  fillIcons();
  window.addEventListener('hashchange', function () { setVue(location.hash.slice(1), true); });
  $('sel-b').addEventListener('click', function (e) { e.stopPropagation(); var on = $('menu').classList.toggle('on'); $('sel-b').setAttribute('aria-expanded', on); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.sel')) closeMenu(); });
  $('scrim').addEventListener('click', closeDrawer);
  $('dr-x').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeMenu(); } });
  $('f-q').addEventListener('input', function () { fq = this.value.trim(); showAll = !!fq; renderRows(dem()); });
  var lastMob = window.innerWidth <= 900;
  window.addEventListener('resize', function () { var m = window.innerWidth <= 900; if (m !== lastMob) { lastMob = m; render(); } });

  var boot = function (j) {
    D = j; window.SACRI_D = j;
    var r = dt(D.ref);
    $('date').textContent = JOURS[r.getDay()] + ' ' + r.getDate() + ' ' + MOIS[r.getMonth()] + ', ' + r.getHours() + ' h';
    var q = new URLSearchParams(location.search);
    if (q.get('societe') && SOCS.indexOf(q.get('societe')) >= 0) soc = q.get('societe');
    renderSel();
    setVue(q.get('vue') || location.hash.slice(1) || 'messages');
  };
  if (window.SACRI_DATA) boot(window.SACRI_DATA);
  else fetch('data/donnees.json?v=20261125a').then(function (r) { return r.json(); }).then(boot);
})();
