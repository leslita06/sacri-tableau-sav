// Vue « Écrire aux clients » : envoi automatique et campagne. Simulation : rien ne part réellement.
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var I = {
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>', users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>', send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>', play: '<path d="m6 4 14 8-14 8z"/>', reply: '<path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>', file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>', reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[k] || '') + '</svg>'; }
  var mode = new URLSearchParams(location.search).get('mode') === 'campagne' ? 'campagne' : 'auto';
  var timers = [];
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function stop() { timers.forEach(clearTimeout); timers = []; }
  var FAST = new URLSearchParams(location.search).get('rapide') === '1';
  function T(ms) { return FAST ? 1 : ms; }

  // ---------- Envoi automatique ----------
  var REGLES = [
    ['wrench', 'Machine réparée', 'Le client est prévenu dès que le technicien passe la machine en « Réparée ».', 'tout de suite'],
    ['check', 'Chaque étape d\'atelier', 'Réception, diagnostic, devis, réparation : un message court à chaque étape.', 'tout de suite'],
    ['doc', 'Devis sans réponse', 'Relance polie si le client n\'a pas répondu au devis de réparation.', 'après 3 jours'],
    ['cal', 'Révision à prévoir', 'Rappel d\'entretien avant la saison, pour les machines non révisées depuis six mois.', '15 jours avant'],
    ['tag', 'Nouveauté ou promotion', 'Annonce aux clients concernés par la gamme, une fois le texte validé par le responsable commercial.', 'à la date prévue']
  ];
  var EVTS = [
    { h: '09:12', r: 0, ic: 'wrench', quoi: 'Machine passée en « Réparée »', cl: 'Scierie du Haut-Sassandra', soc: 'SACRI', img: 'tronconneuse-ms661.jpg',
      msg: 'Bonjour, ici le service client SACRI. Bonne nouvelle : votre tronçonneuse STIHL MS 661 (bon BR-2026-0422) est réparée et prête à retirer au comptoir de l\'atelier, boulevard de Marseille. Présentez le bon de réception.', fin: 'repondu', rep: 'Merci, on passe demain matin.' },
    { h: '09:30', r: 2, ic: 'doc', quoi: 'Devis sans réponse depuis 3 jours', cl: 'BTP Kanga & Fils', soc: 'PST-CI', img: 'compresseur.jpg',
      msg: 'Bonjour, ici le service client PST-CI. Le devis de réparation de votre compresseur à piston 270 L (bon BR-2026-0420), envoyé le 10/11, attend votre accord. Répondez OUI pour lancer la réparation, ou posez-nous votre question ici.', fin: 'lu' },
    { h: '10:05', r: 3, ic: 'cal', quoi: 'Révision à prévoir avant la saison', cl: 'Résidence Les Palmiers', soc: 'SACRI', img: 'debroussailleuse-fs250.jpg',
      msg: 'Bonjour, ici le service client SACRI. Votre débroussailleuse STIHL FS 260 n\'a pas été révisée depuis six mois. Une révision avant la saison des pluies : bougie, filtre, lame, réglage. Répondez RDV pour choisir votre créneau à l\'atelier.', fin: 'repondu', rep: 'RDV' },
    { h: '10:20', r: 1, ic: 'check', quoi: 'Machine passée en « Diagnostic »', cl: 'Huilerie Agnéby', soc: 'PST-CI', img: 'hydraulique.jpg',
      msg: 'Bonjour, ici le service client PST-CI. Votre pompe à engrenages (bon BR-2026-0429) est en diagnostic à l\'atelier. Le devis de réparation vous arrive ici dès qu\'il est prêt.', fin: 'lu' },
    { h: '10:40', r: 4, ic: 'tag', quoi: 'Promotion de saison, texte validé', cl: 'Plantations Akoupé Sud', soc: 'SACRI', img: 'debroussailleuse-fs400.jpg',
      msg: 'Bonjour, ici SACRI. La saison des pluies arrive : la débroussailleuse STIHL FS 400 est disponible en stock à Abidjan, avec harnais et lame. Répondez PRIX pour recevoir l\'offre du service commercial.', fin: 'envoye' }
  ];
  var STAT = { envoye: ['✓', 'Envoyé'], recu: ['✓✓', 'Reçu'], lu: ['✓✓', 'Lu'], repondu: ['', 'A répondu'] };
  function chip(s) { return '<span class="sc s-' + s + '"><i>' + STAT[s][0] + '</i>' + STAT[s][1] + '</span>'; }

  function auto(soc) {
    var ev = EVTS.filter(function (e) { return soc === 'Groupe' || e.soc === soc; });
    $('envoi').innerHTML =
      '<div class="au">' +
      '<div class="au-l"><div class="card"><p class="cap">' + svg('zap') + 'Ce qui part tout seul</p><p class="sub">Chaque règle envoie son message dès qu\'elle se déclenche, sans qu\'un agent ouvre WhatsApp.</p>' +
      '<ul class="rg">' + REGLES.map(function (r, i) { return '<li id="rg' + i + '"><span class="ri">' + svg(r[0]) + '</span><span class="rt"><b>' + r[1] + '</b><span>' + r[2] + '</span></span><span class="rq">' + r[3] + '</span><span class="sw on" role="img" aria-label="Règle active"><i></i></span></li>'; }).join('') + '</ul>' +
      '<p class="garde">' + svg('shield') + 'Jamais de prix, de délai ni de geste commercial dans un message automatique : un conseiller les donne.</p></div></div>' +
      '<div class="au-r"><div class="card live"><div class="lh"><p class="cap"><span class="dot"></span>En direct, ce matin</p><button type="button" class="btn sm" id="au-go">' + svg('reset') + 'Rejouer</button></div>' +
      '<div class="cpt"><div><b id="au-n">–</b><span>messages partis</span></div><div><b id="au-l">–</b><span>lus</span></div><div><b id="au-r">–</b><span>réponses</span></div><div><b>Aucun</b><span>agent mobilisé</span></div></div>' +
      '<ol class="feed" id="feed"></ol></div>' +
      '<div class="ph-wrap"><div class="phone"><div class="ph-h"><span class="pa">S</span><span><b id="ph-cl">Client</b><i>vu par le client sur WhatsApp</i></span></div><div class="ph-c" id="ph-c"></div></div></div></div>' +
      '</div>';
    $('au-go').addEventListener('click', function () { auto(soc); });
    var n = 0, l = 0, rp = 0;
    function maj() { $('au-n').textContent = n || '–'; $('au-l').textContent = l || '–'; $('au-r').textContent = rp || '–'; }
    if (!ev.length) { $('feed').innerHTML = '<li class="empty">Aucun message automatique pour ' + esc(soc) + ' ce matin.</li>'; return; }
    ev.forEach(function (e, i) {
      var t0 = T(600 + i * 2600);
      later(function () {
        document.querySelectorAll('.rg li').forEach(function (x) { x.classList.remove('hit'); });
        var rg = $('rg' + e.r); if (rg) rg.classList.add('hit');
        var li = document.createElement('li'); li.className = 'fi new';
        li.innerHTML = '<span class="fh">' + e.h + '</span><span class="fic">' + svg(e.ic) + '</span><span class="fb"><span class="fq">' + esc(e.quoi) + '</span><b>' + esc(e.cl) + ' <i>' + esc(e.soc) + '</i></b><span class="fm">' + esc(e.msg.slice(0, 92)) + '…</span><span class="fs" id="fs' + i + '">' + chip('envoye') + '<em>parti tout seul</em></span></span>';
        $('feed').insertBefore(li, $('feed').firstChild); n++; maj();
        $('ph-cl').textContent = e.cl;
        $('ph-c').innerHTML = '<div class="day">Aujourd\'hui</div><div class="bb"><img src="assets/img/' + e.img + '" alt=""><p>' + esc(e.msg) + '</p><span class="bm">' + e.h + '</span></div>';
      }, t0);
      later(function () { var s = $('fs' + i); if (s) s.firstChild.outerHTML = chip('recu'); }, t0 + T(700));
      if (e.fin !== 'envoye') later(function () { var s = $('fs' + i); if (s) s.firstChild.outerHTML = chip('lu'); l++; maj(); }, t0 + T(1400));
      if (e.fin === 'repondu') later(function () {
        var s = $('fs' + i); if (s) s.firstChild.outerHTML = chip('repondu'); rp++; maj();
        if ($('ph-cl').textContent === e.cl) $('ph-c').insertAdjacentHTML('beforeend', '<div class="bo"><p>' + esc(e.rep) + '</p><span class="bm">' + e.h + '</span></div>');
      }, t0 + T(2200));
    });
    later(function () { document.querySelectorAll('.fi.new').forEach(function (x) { x.classList.remove('new'); }); }, T(600 + ev.length * 2600 + 400));
  }

  // ---------- Campagne ----------
  var BASE = [
    { id: 'c1', nom: 'Plantations Akoupé Sud', contact: 'M. Aka', tel: '07 •• •• 21 48', soc: 'SACRI', mach: 'STIHL FS 400', devis: { br: 'BR-2026-0428', le: '17/11', m: 58000 }, rev: '7 mois' },
    { id: 'c2', nom: 'BTP Kanga & Fils', contact: 'M. Kanga', tel: '05 •• •• 63 10', soc: 'PST-CI', mach: 'Compresseur à piston 270 L', devis: { br: 'BR-2026-0420', le: '10/11', m: 275000 }, rev: '9 mois' },
    { id: 'c3', nom: 'Scierie Bandama Bois', contact: 'Mme Konan', tel: '07 •• •• 90 27', soc: 'SACRI', mach: 'STIHL MS 381', devis: { br: 'BR-2026-0426', le: '13/11', m: 39500 }, rev: '6 mois' },
    { id: 'c4', nom: 'Scierie de Soubré', contact: 'M. Gbané', tel: '01 •• •• 35 82', soc: 'SACRI', mach: 'STIHL MS 462', devis: null, rev: '8 mois' },
    { id: 'c5', nom: 'Résidence Les Palmiers', contact: 'Mme Yao', tel: '07 •• •• 44 06', soc: 'SACRI', mach: 'STIHL FS 260', devis: null, rev: '6 mois' },
    { id: 'c6', nom: 'Transports Lagune Express', contact: 'M. Ehui', tel: '05 •• •• 18 73', soc: 'PST-CI', mach: 'Compresseur à piston 270 L', devis: null, rev: '10 mois' },
    { id: 'c7', nom: 'M. Paul Kouakou', contact: 'M. Kouakou', tel: '07 •• •• 52 39', soc: 'SACRI', mach: 'STIHL FS 250', devis: null, rev: '6 mois' },
    { id: 'c8', nom: 'Mme Mariam Diallo', contact: 'Mme Diallo', tel: '01 •• •• 77 14', soc: 'SACRI', mach: 'STIHL MS 250', devis: null, rev: '12 mois' }
  ];
  var CSV = [
    { id: 'f1', nom: 'Coopérative agricole de Daloa', contact: 'M. Gnagne', tel: '07 •• •• 30 58', soc: 'SACRI', mach: 'STIHL FS 400', devis: null, rev: '7 mois', csv: 1 },
    { id: 'f2', nom: 'Espaces Verts du Plateau', contact: 'Mme Touré', tel: '05 •• •• 81 22', soc: 'SACRI', mach: 'STIHL FS 250', devis: null, rev: '6 mois', csv: 1 },
    { id: 'f3', nom: 'Ferme avicole de Bingerville', contact: 'M. Kouamé', tel: '07 •• •• 09 61', soc: 'SACRI', mach: 'STIHL RE 130 Plus', devis: null, rev: '8 mois', csv: 1 },
    { id: 'f4', nom: 'Golf Club Lagune', contact: 'M. Bamba', tel: '01 •• •• 46 95', soc: 'SACRI', mach: 'STIHL RM 448', devis: null, rev: '6 mois', csv: 1 },
    { id: 'f5', nom: 'Plantations de Gagnoa', contact: 'Mme Zadi', tel: '07 •• •• 72 30', soc: 'SACRI', mach: 'STIHL SR 420', devis: null, rev: '11 mois', csv: 1 }
  ];
  var TYPES = {
    entretien: { t: 'Rappel d\'entretien', ic: 'cal', img: 'debroussailleuse-fs400.jpg', ok: function () { return true; },
      msg: function (c) { return 'Bonjour ' + c.contact + ', ici le service client ' + c.soc + '. Votre ' + c.mach + ' n\'a pas été révisée depuis ' + c.rev + '. Avant la saison des pluies, une révision évite la panne en plein travail. Répondez RDV pour choisir votre créneau à l\'atelier.'; } },
    devis: { t: 'Relance de devis', ic: 'doc', img: 'compresseur.jpg', ok: function (c) { return !!c.devis; },
      msg: function (c) { return 'Bonjour ' + c.contact + ', ici le service client ' + c.soc + '. Le devis de réparation de votre ' + c.mach + ' (bon ' + c.devis.br + '), envoyé le ' + c.devis.le + ', attend votre accord. Répondez OUI pour lancer la réparation.'; } },
    promo: { t: 'Promotion de saison', ic: 'tag', img: 'debroussailleuse-fs400.jpg', ok: function () { return true; },
      msg: function (c) { return 'Bonjour ' + c.contact + ', ici SACRI. La saison des pluies arrive : débroussailleuses STIHL FS 400 et FS 250 en stock à Abidjan, avec harnais et lame. Répondez PRIX pour recevoir l\'offre du service commercial.'; } }
  };
  var C = { type: 'entretien', clients: BASE.slice(), coches: {}, apercu: 0, envoye: false, imp: false };
  BASE.forEach(function (c) { if (['c1', 'c3', 'c4', 'c5', 'c7'].indexOf(c.id) >= 0) C.coches[c.id] = true; });

  function liste(soc) { var tp = TYPES[C.type]; return C.clients.filter(function (c) { return (soc === 'Groupe' || c.soc === soc) && tp.ok(c); }); }
  function choisis(soc) { return liste(soc).filter(function (c) { return C.coches[c.id]; }); }

  function campagne(soc) {
    var tp = TYPES[C.type], L = liste(soc), S = choisis(soc);
    if (C.apercu >= S.length) C.apercu = 0;
    var cur = S[C.apercu];
    $('envoi').innerHTML =
      '<ol class="cp-steps"><li class="on"><i>1</i>Le message</li><li class="' + (S.length ? 'on' : '') + '"><i>2</i>Les clients</li><li class="' + (S.length ? 'on' : '') + '"><i>3</i>L\'aperçu</li><li class="' + (C.envoye ? 'on' : '') + '"><i>4</i>L\'envoi</li></ol>' +
      '<div class="cp">' +
      '<div class="cp-l">' +
        '<div class="card"><p class="cap">1. Quel message ?</p><div class="ty">' + Object.keys(TYPES).map(function (k) { return '<button type="button" data-t="' + k + '" class="' + (k === C.type ? 'on' : '') + '">' + svg(TYPES[k].ic) + TYPES[k].t + '</button>'; }).join('') + '</div></div>' +
        '<div class="card"><div class="lh"><p class="cap">2. Quels clients ? <span class="cnt">' + S.length + ' sur ' + L.length + '</span></p>' +
        '<div class="lb"><button type="button" class="btn sm ghost" id="cp-all">' + (S.length === L.length && L.length ? 'Tout décocher' : 'Tout cocher') + '</button><button type="button" class="btn sm" id="cp-imp"' + (C.imp ? ' disabled' : '') + '>' + svg('upload') + (C.imp ? 'Fichier importé' : 'Importer un fichier') + '</button></div></div>' +
        (C.imp ? '<p class="impf">' + svg('file') + '<b>clients_saison_pluies.csv</b> : 5 lignes, 5 numéros valides, 0 doublon. Clients ajoutés à la liste.</p>' : '') +
        '<ul class="cl">' + (L.length ? L.map(function (c) {
          return '<li><label><input type="checkbox" data-c="' + c.id + '"' + (C.coches[c.id] ? ' checked' : '') + (C.envoye ? ' disabled' : '') + '><span class="ck"></span><span class="cn"><b>' + esc(c.nom) + (c.csv ? ' <i class="nv">importé</i>' : '') + '</b><span>' + esc(c.contact) + ', +225 ' + esc(c.tel) + ', ' + esc(c.mach) + '</span></span></label></li>';
        }).join('') : '<li class="empty">Aucun client concerné par ce message' + (soc === 'Groupe' ? '' : ' chez ' + esc(soc)) + '.</li>') + '</ul></div>' +
      '</div>' +
      '<div class="cp-r"><div class="card"><div class="lh"><p class="cap">3. Le message de chaque client</p>' +
        (S.length > 1 ? '<span class="nav"><button type="button" id="cp-p" aria-label="Client précédent">' + svg('left') + '</button><span>' + (C.apercu + 1) + ' / ' + S.length + '</span><button type="button" id="cp-n" aria-label="Client suivant">' + svg('right') + '</button></span>' : '') + '</div>' +
        (cur ? '<div class="pv"><p class="pvh"><b>' + esc(cur.nom) + '</b>, +225 ' + esc(cur.tel) + '</p><div class="pvz"><div class="bb"><img src="assets/img/' + tp.img + '" alt=""><p>' + esc(tp.msg(cur)) + '</p><span class="bm">maintenant</span></div></div>' +
          '<p class="pvn">Les mots en couleur changent d\'un client à l\'autre : <span class="vr">nom</span>, <span class="vr">machine</span>, <span class="vr">bon</span>, <span class="vr">date</span>.</p></div>' : '<p class="empty">Cochez au moins un client pour voir son message.</p>') +
        '<button type="button" class="btn big" id="cp-go"' + (!S.length || C.envoye ? ' disabled' : '') + '>' + svg('send') + (C.envoye ? 'Campagne envoyée' : 'Envoyer à ' + S.length + ' client' + (S.length > 1 ? 's' : '')) + '</button>' +
        '<p class="garde">' + svg('shield') + 'Un seul clic pour tous, un message personnel pour chacun. Le prix et les remises restent donnés par un conseiller.</p></div>' +
        '<div class="card" id="cp-res"' + (C.envoye ? '' : ' hidden') + '></div></div>' +
      '</div>';
    // surligne les variables dans l'aperçu
    var p = document.querySelector('.pv .bb p');
    if (p && cur) {
      var h = p.innerHTML;
      [cur.contact, cur.mach, cur.devis && cur.devis.br, cur.devis && cur.devis.le, cur.rev].filter(Boolean).forEach(function (v) { h = h.split(esc(v)).join('<span class="vr">' + esc(v) + '</span>'); });
      p.innerHTML = h;
    }
    document.querySelectorAll('.ty button').forEach(function (b) { b.addEventListener('click', function () { if (C.envoye) { C.envoye = false; } C.type = b.getAttribute('data-t'); C.apercu = 0; campagne(soc); }); });
    document.querySelectorAll('.cl input').forEach(function (b) { b.addEventListener('change', function () { C.coches[b.getAttribute('data-c')] = b.checked; campagne(soc); }); });
    $('cp-all').addEventListener('click', function () { var all = S.length === L.length; L.forEach(function (c) { C.coches[c.id] = !all; }); C.envoye = false; campagne(soc); });
    $('cp-imp').addEventListener('click', function () {
      var b = $('cp-imp'); b.disabled = true; b.innerHTML = svg('upload') + 'Lecture du fichier…';
      later(function () { C.imp = true; C.clients = BASE.concat(CSV); CSV.forEach(function (c) { C.coches[c.id] = true; }); C.envoye = false; campagne(soc); }, T(900));
    });
    if ($('cp-p')) { $('cp-p').addEventListener('click', function () { C.apercu = (C.apercu - 1 + S.length) % S.length; campagne(soc); }); $('cp-n').addEventListener('click', function () { C.apercu = (C.apercu + 1) % S.length; campagne(soc); }); }
    $('cp-go').addEventListener('click', function () { C.envoye = true; campagne(soc); envoyer(S); });
    if (C.envoye && C.res) resultats(C.res, true);
  }
  function envoyer(S) {
    var rep = { 0: 'RDV', 2: 'OUI, on passe vendredi', 5: 'RDV' };
    C.res = S.map(function (c, i) { return { c: c, s: 'envoye', r: rep[i] || null, lu: i % 4 !== 3 }; });
    resultats(C.res, false);
    $('cp-res').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    C.res.forEach(function (x, i) {
      later(function () { x.s = 'recu'; resultats(C.res, true); }, T(500 + i * 220));
      if (x.lu) later(function () { x.s = 'lu'; resultats(C.res, true); }, T(1500 + i * 300));
      if (x.r) later(function () { x.s = 'repondu'; resultats(C.res, true); }, T(2600 + i * 400));
    });
  }
  function resultats(R, keep) {
    var el = $('cp-res'); if (!el) return; el.hidden = false;
    var c = { envoye: 0, lu: 0, repondu: 0 };
    R.forEach(function (x) { c.envoye++; if (x.s === 'lu' || x.s === 'repondu') c.lu++; if (x.s === 'repondu') c.repondu++; });
    el.innerHTML = '<p class="cap">4. Le suivi de l\'envoi <span class="cnt">' + TYPES[C.type].t.toLowerCase() + '</span></p>' +
      '<div class="cpt"><div><b>' + c.envoye + '</b><span>envoyés</span></div><div><b>' + c.lu + '</b><span>lus</span></div><div><b>' + c.repondu + '</b><span>ont répondu</span></div></div>' +
      '<ul class="rs">' + R.map(function (x) { return '<li><span class="rn"><b>' + esc(x.c.nom) + '</b><span>+225 ' + esc(x.c.tel) + '</span></span>' + chip(x.s) + (x.s === 'repondu' ? '<span class="rr">« ' + esc(x.r) + ' »</span>' : '') + '</li>'; }).join('') + '</ul>' +
      '<p class="sub">Les réponses arrivent dans la conversation WhatsApp de chaque client ; un conseiller les reprend.</p>';
  }

  function render(soc) {
    stop();
    $('modes').innerHTML = [['auto', 'zap', 'Envoi automatique', 'Les messages partent seuls'], ['campagne', 'users', 'Campagne', 'Plusieurs clients en un clic']].map(function (m) {
      return '<button type="button" role="tab" aria-selected="' + (m[0] === mode) + '" data-m="' + m[0] + '" class="' + (m[0] === mode ? 'on' : '') + '">' + svg(m[1]) + '<span><b>' + m[2] + '</b><i>' + m[3] + '</i></span></button>';
    }).join('');
    document.querySelectorAll('#modes button').forEach(function (b) { b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(soc); }); });
    if (mode === 'auto') auto(soc); else campagne(soc);
  }
  window.SacriEnvoi = { render: render };
})();
