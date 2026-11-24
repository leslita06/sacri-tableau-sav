// SACRI : réclamations suivies et retours machines par numéro de série.
// Données de démonstration. Aucun message ne part de cette page.
(function () {
  'use strict';
  // ---------- données ----------
  // Réclamations : rep = première réponse au client, fin = réclamation close.
  var RECL = [
    { n: 'R-2026-118', soc: 'SACRI', client: 'Exploitation forestière Doka', machine: 'STIHL MS 661', serie: '5108 4457', recue: '2026-11-14T09:20', canal: 'WhatsApp', quoi: 'Troisième retour à l\'atelier en sept mois, le client demande un échange de la machine', suivi: 'Atelier SACRI', rep: null, fin: null,
      fait: ['Machine reçue à l\'atelier le 18/11 (bon BR-2026-0430)', 'Diagnostic pas encore commencé', 'Aucune réponse écrite au client sur la demande d\'échange'] },
    { n: 'R-2026-119', soc: 'SACRI', client: 'Scierie du Haut-Sassandra', machine: 'STIHL MS 661', serie: '5108 9921', recue: '2026-11-15T11:40', canal: 'Téléphone', quoi: 'Même panne qu\'en juin : la tronçonneuse manque de puissance', suivi: 'Comptoir SACRI', rep: null, fin: null,
      fait: ['Appel noté au comptoir le 15/11', 'Machine réparée, prête à retirer (bon BR-2026-0422)', 'Client pas rappelé sur la panne répétée'] },
    { n: 'R-2026-120', soc: 'Trans-Roulements', client: 'Huilerie Agnéby', machine: 'Roulements 6310, livraison du 12/11', serie: null, recue: '2026-11-17T10:05', canal: 'E-mail', quoi: 'Mauvaise référence livrée, la ligne de pressage attend la bonne pièce', suivi: 'Magasin Trans-Roulements', rep: null, fin: null,
      fait: ['E-mail reçu le 17/11', 'Stock de la bonne référence vérifié : disponible', 'Aucune réponse envoyée au client'] },
    { n: 'R-2026-121', soc: 'DEFI', client: 'Huilerie Agnéby', machine: 'Tuyauterie vapeur, chantier de septembre', serie: null, recue: '2026-11-16T15:20', canal: 'E-mail', quoi: 'Fuite sur une soudure de la tuyauterie posée en septembre', suivi: 'Chef de chantier DEFI', rep: null, fin: null,
      fait: ['E-mail transmis au chef de chantier le 17/11', 'Visite sur site pas encore planifiée'] },
    { n: 'R-2026-122', soc: 'PST-CI', client: 'Carrières Exemple', machine: 'Compresseur à vis 7,5 kW', serie: 'C-31 0285', recue: '2026-11-18T16:00', canal: 'E-mail', quoi: 'Le compresseur s\'arrête encore en surchauffe, troisième retour', suivi: 'Atelier PST-CI', rep: '2026-11-19T09:10', fin: null,
      fait: ['Réponse au client le 19/11 à 9 h 10', 'Technicien PST-CI désigné', 'Machine en réparation (bon BR-2026-0421)'] },
    { n: 'R-2026-123', soc: 'SACRI', client: 'Cité Verte Paysages', machine: 'STIHL FS 450', serie: '4421 3308', recue: '2026-11-18T08:45', canal: 'WhatsApp', quoi: 'Réparation plus longue qu\'annoncé au dépôt', suivi: 'Atelier SACRI', rep: '2026-11-18T09:30', fin: null,
      fait: ['Réponse au client le 18/11 à 9 h 30', 'Nouvelle date de retrait à confirmer par l\'atelier'] },
    { n: 'R-2026-124', soc: 'SACRI', client: 'Mme Adjoua Brou', machine: 'STIHL MS 250', serie: '1873 4410', recue: '2026-11-17T15:40', canal: 'WhatsApp', quoi: 'Refus de prise en garantie contesté', suivi: 'Responsable après-vente SACRI', rep: '2026-11-17T18:10', fin: null,
      fait: ['Réponse au client le 17/11 à 18 h 10', 'Dossier de garantie transmis au responsable après-vente', 'Machine en attente de pièce (bon BR-2026-0424)'] },
    { n: 'R-2026-125', soc: 'SACRI', client: 'Plantations Akoupé Sud', machine: 'STIHL FS 400', serie: '4421 7752', recue: '2026-11-15T07:50', canal: 'Téléphone', quoi: 'Machine revenue deux fois depuis l\'achat en mars', suivi: 'Atelier SACRI', rep: '2026-11-15T10:00', fin: null,
      fait: ['Rappel du client le 15/11 à 10 h', 'Devis envoyé, accord du client attendu (bon BR-2026-0428)'] },
    { n: 'R-2026-126', soc: 'PST-CI', client: 'Agro-Industries du Sud-Comoé', machine: 'Pompe à engrenages', serie: 'PH-1180', recue: '2026-11-07T09:00', canal: 'Téléphone', quoi: 'Fuite au joint d\'arbre, deuxième fois cette année', suivi: 'Atelier PST-CI', rep: '2026-11-07T11:20', fin: null,
      fait: ['Rappel du client le 07/11 à 11 h 20', 'Pompe réparée, prête à retirer (bon BR-2026-0419)', 'Client à prévenir du retrait'] },
    { n: 'R-2026-127', soc: 'PST-CI', client: 'BTP Kanga & Fils', machine: 'Compresseur à piston 270 L', serie: 'C-27 1193', recue: '2026-11-13T10:30', canal: 'E-mail', quoi: 'Le client conteste le devis de réparation', suivi: 'Atelier PST-CI', rep: '2026-11-13T14:00', fin: null,
      fait: ['Réponse au client le 13/11 à 14 h', 'Détail du devis renvoyé, pièce par pièce', 'Accord du client attendu (bon BR-2026-0420)'] },
    { n: 'R-2026-128', soc: 'SAFIR', client: 'Scierie du Haut-Sassandra', machine: 'Scie à ruban 800 mm', serie: 'SR-0614', recue: '2026-11-19T08:10', canal: 'Téléphone', quoi: 'Bruit au volant, la scie est déjà revenue deux fois', suivi: 'Atelier SAFIR', rep: null, fin: null,
      fait: ['Appel noté le 19/11 à 8 h 10'] },
    { n: 'R-2026-129', soc: 'PST-CI', client: 'Menuiserie Grâce Divine', machine: 'Compresseur à piston 100 L', serie: 'C-12 6604', recue: '2026-11-19T09:15', canal: 'WhatsApp', quoi: 'Aucune nouvelle depuis le dépôt du 10/11', suivi: 'Atelier PST-CI', rep: null, fin: null,
      fait: ['Message reçu le 19/11 à 9 h 15', 'Machine au diagnostic (bon BR-2026-0423)'] },
    { n: 'R-2026-112', soc: 'SAFIR', client: 'Scierie Bandama Bois', machine: 'Scie à ruban 1 100 mm', serie: 'SR-0702', recue: '2026-11-16T08:30', canal: 'Téléphone', quoi: 'La lame dévie de nouveau après affûtage', suivi: 'Atelier SAFIR', rep: '2026-11-16T10:15', fin: '2026-11-18T15:00',
      fait: ['Rappel du client le 16/11 à 10 h 15', 'Technicien passé sur site le 18/11, guides de lame réglés', 'Client satisfait, réclamation close'] },
    { n: 'R-2026-109', soc: 'DEFI', client: 'Charpentes Métalliques du Port', machine: 'Garde-corps, chantier du port', serie: null, recue: '2026-11-12T14:00', canal: 'E-mail', quoi: 'Retard de pose sur le chantier', suivi: 'Chef de chantier DEFI', rep: '2026-11-12T16:30', fin: '2026-11-14T12:00',
      fait: ['Réponse au client le 12/11 à 16 h 30', 'Équipe renforcée, pose terminée le 14/11'] },
    { n: 'R-2026-104', soc: 'SACRI', client: 'M. Serge Kouadio', machine: 'STIHL FS 250', serie: '2209 8835', recue: '2026-11-10T09:00', canal: 'WhatsApp', quoi: 'Lanceur cassé deux fois en deux mois', suivi: 'Atelier SACRI', rep: '2026-11-10T09:40', fin: '2026-11-12T17:00',
      fait: ['Réponse au client le 10/11 à 9 h 40', 'Lanceur remplacé, cause expliquée au client', 'Réclamation close le 12/11'] },
    { n: 'R-2026-098', soc: 'SAFIR', client: 'Menuiserie Grâce Divine', machine: 'Lames de scie à ruban, livraison du 05/11', serie: null, recue: '2026-11-06T11:00', canal: 'Comptoir', quoi: 'Lames livrées à la mauvaise longueur', suivi: 'Magasin SAFIR', rep: '2026-11-06T12:00', fin: '2026-11-08T10:00',
      fait: ['Réponse au comptoir le 06/11', 'Lames échangées le 08/11'] }
  ];
  // Machines vendues, suivies par numéro de série ; chaque retour à l'atelier porte son bon.
  var MACH = [
    ['5108 3274', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Scierie Bandama Bois', '2025-11-04', [['2026-05-12', 'Guide-chaîne usé', 'BR-2026-0188'], ['2026-10-20', 'Ne démarre plus', 'BR-2026-0412']]],
    ['5108 9921', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Scierie du Haut-Sassandra', '2026-02-09', [['2026-06-22', 'Manque de puissance', 'BR-2026-0231'], ['2026-11-10', 'Manque de puissance', 'BR-2026-0422']]],
    ['5108 4457', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Exploitation forestière Doka', '2026-04-14', [['2026-08-03', 'Frein de chaîne bloqué', 'BR-2026-0309'], ['2026-09-28', 'Lanceur cassé', 'BR-2026-0352'], ['2026-11-18', 'Frein de chaîne bloqué', 'BR-2026-0430']]],
    ['5108 6630', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Scierie Bandama Bois', '2026-06-15', []],
    ['4421 0917', 'SACRI', 'STIHL FS 400', 'Débroussailleuse', 'Plantations Akoupé Sud', '2025-12-01', [['2026-10-23', 'Moteur cale à chaud', 'BR-2026-0413']]],
    ['4421 7752', 'SACRI', 'STIHL FS 400', 'Débroussailleuse', 'Plantations Akoupé Sud', '2026-03-02', [['2026-07-20', 'Tête faucheuse bloquée', 'BR-2026-0274'], ['2026-11-14', 'Arbre de transmission cassé', 'BR-2026-0428']]],
    ['3317 5562', 'SACRI', 'STIHL MS 381', 'Tronçonneuse', 'Exploitation forestière Doka', '2025-09-15', [['2026-11-02', 'Chaîne qui ne tourne pas', 'BR-2026-0416']]],
    ['3317 0846', 'SACRI', 'STIHL MS 381', 'Tronçonneuse', 'Scierie Bandama Bois', '2026-05-18', [['2026-11-12', 'Carburateur noyé', 'BR-2026-0426']]],
    ['3317 2290', 'SACRI', 'STIHL MS 381', 'Tronçonneuse', 'Hévéa Bonoua SA', '2026-03-23', []],
    ['2209 8835', 'SACRI', 'STIHL FS 250', 'Débroussailleuse', 'M. Serge Kouadio', '2026-06-08', [['2026-09-07', 'Lanceur cassé', 'BR-2026-0341'], ['2026-11-04', 'Lanceur cassé', 'BR-2026-0417']]],
    ['2209 1164', 'SACRI', 'STIHL FS 250', 'Débroussailleuse', 'M. Ibrahim Touré', '2026-08-24', [['2026-11-19', 'Fumée blanche', 'BR-2026-0431']]],
    ['2209 5517', 'SACRI', 'STIHL FS 250', 'Débroussailleuse', 'Cité Verte Paysages', '2026-05-04', []],
    ['4002 7716', 'SACRI', 'STIHL MS 461', 'Tronçonneuse', 'Exploitation forestière Doka', '2026-01-12', [['2026-11-05', 'Embrayage qui patine', 'BR-2026-0418']]],
    ['1873 4410', 'SACRI', 'STIHL MS 250', 'Tronçonneuse', 'Mme Adjoua Brou', '2026-07-06', [['2026-11-11', 'Chaîne qui saute', 'BR-2026-0424']]],
    ['4421 3308', 'SACRI', 'STIHL FS 450', 'Débroussailleuse', 'Cité Verte Paysages', '2026-04-27', [['2026-11-12', 'Ne démarre plus', 'BR-2026-0425']]],
    ['C-27 4410', 'PST-CI', 'Compresseur à piston 500 L', 'Compresseur', 'BTP Kanga & Fils', '2025-07-21', [['2026-04-13', 'Soupape de sécurité qui fuit', 'BR-2026-0142'], ['2026-10-27', 'Perte de pression', 'BR-2026-0414']]],
    ['C-27 1193', 'PST-CI', 'Compresseur à piston 270 L', 'Compresseur', 'BTP Kanga & Fils', '2026-01-19', [['2026-11-06', 'Ne monte plus en pression', 'BR-2026-0420']]],
    ['C-27 3051', 'PST-CI', 'Compresseur à piston 270 L', 'Compresseur', 'Charpentes Métalliques du Port', '2026-05-11', []],
    ['C-31 0285', 'PST-CI', 'Compresseur à vis 7,5 kW', 'Compresseur', 'Carrières Exemple', '2025-10-06', [['2026-02-23', 'S\'arrête en surchauffe', 'BR-2026-0071'], ['2026-06-29', 'Filtre à huile colmaté', 'BR-2026-0236'], ['2026-11-09', 'S\'arrête en surchauffe', 'BR-2026-0421']]],
    ['C-12 6604', 'PST-CI', 'Compresseur à piston 100 L', 'Compresseur', 'Menuiserie Grâce Divine', '2026-03-16', [['2026-11-10', 'Moteur ne tourne pas', 'BR-2026-0423']]],
    ['PH-2245', 'PST-CI', 'Pompe à pistons axiaux', 'Pompe hydraulique', 'Plantations Akoupé Sud', '2025-11-17', [['2026-10-29', 'Débit faible', 'BR-2026-0415']]],
    ['PH-1180', 'PST-CI', 'Pompe à engrenages', 'Pompe hydraulique', 'Agro-Industries du Sud-Comoé', '2025-12-08', [['2026-05-25', 'Fuite au joint d\'arbre', 'BR-2026-0201'], ['2026-11-06', 'Fuite au joint d\'arbre', 'BR-2026-0419']]],
    ['PH-1534', 'PST-CI', 'Pompe à engrenages', 'Pompe hydraulique', 'Huilerie Agnéby', '2026-04-06', [['2026-11-17', 'Surchauffe', 'BR-2026-0429']]],
    ['PH-0937', 'PST-CI', 'Pompe à palettes', 'Pompe hydraulique', 'Hévéa Bonoua SA', '2026-02-02', [['2026-11-13', 'Bruit anormal', 'BR-2026-0427']]],
    ['SR-0614', 'SAFIR', 'Scie à ruban 800 mm', 'Scie à ruban', 'Scierie du Haut-Sassandra', '2025-08-18', [['2026-03-02', 'Volant désaligné', 'BR-2026-0098'], ['2026-09-14', 'Roulement de volant bruyant', 'BR-2026-0338']]],
    ['SR-0702', 'SAFIR', 'Scie à ruban 1 100 mm', 'Scie à ruban', 'Scierie Bandama Bois', '2026-01-26', [['2026-07-27', 'Lame qui dévie', 'BR-2026-0287']]],
    ['SR-0731', 'SAFIR', 'Scie à ruban 800 mm', 'Scie à ruban', 'Menuiserie Grâce Divine', '2026-06-01', []]
  ].map(function (m) { return { serie: m[0], soc: m[1], modele: m[2], mat: m[3], client: m[4], vente: m[5], ret: m[6].map(function (r) { return { d: r[0], motif: r[1], br: r[2] }; }) }; });
  window.SACRI_SUIVI = { reclamations: RECL, machines: MACH };

  // ---------- outils ----------
  function $(id) { return document.getElementById(id); }
  function ico(k, c) { return window.ico(k, c); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  function n0(x) { return nf0.format(x); }
  function n1(x) { return nf1.format(x); }
  function dt(s) { return s ? new Date(s.length === 10 ? s + 'T00:00:00' : s.length === 16 ? s + ':00' : s) : null; }
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var MC = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  function dd(s) { var d = dt(s); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); }
  function dlong(s) { var d = dt(s); return d.getDate() + ' ' + MC[d.getMonth()] + ' ' + d.getFullYear(); }
  function hh(s) { var d = dt(s); return d.getHours() + '\u00a0h\u00a0' + String(d.getMinutes()).padStart(2, '0'); }
  function par(c) { return c === 'WhatsApp' ? 'WhatsApp' : c === 'Comptoir' ? 'au comptoir' : c === 'Téléphone' ? 'téléphone' : 'e-mail'; }
  function jour(s) { var d = dt(s); return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()]; }
  function hours(a, b) { return (dt(b) - dt(a)) / 36e5; }
  function days(a, b) { return Math.round((dt(b) - dt(a)) / 864e5); }
  function age(h) { if (h < 1) return n0(Math.max(1, Math.round(h * 60))) + ' min'; if (h < 24) return n0(Math.round(h)) + ' h'; var j = Math.floor(h / 24), r = Math.round(h - j * 24); if (r === 24) { j++; r = 0; } return n0(j) + ' j' + (r ? ' ' + n0(r) + ' h' : ''); }
  function agel(h) { if (h < 24) return age(h); var j = Math.floor(h / 24), r = Math.round(h - j * 24); if (r === 24) { j++; r = 0; } return n0(j) + (j > 1 ? ' jours' : ' jour') + (r ? ' et ' + n0(r) + ' h' : ''); }
  function pl(n, s, p) { return n0(n) + ' ' + (n > 1 ? (p || s + 's') : s); }
  function median(a) { if (!a.length) return null; var s = a.slice().sort(function (x, y) { return x - y; }), m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function mois(j) { return n1(j / 30.44).replace(/,0$/, '') + ' mois'; }
  function kc(o) { return '<div class="kc' + (o.cls ? ' ' + o.cls : '') + '"><p class="l">' + ico(o.ic) + o.l + '</p><div class="vr"><p class="v">' + o.v + (o.u ? '<small>' + o.u + '</small>' : '') + '</p></div><p class="s">' + o.s + '</p></div>'; }
  function photo(m) {
    if (m.modele === 'STIHL MS 661') return 'assets/img/tronconneuse-ms661.jpg';
    if (m.mat === 'Tronçonneuse') return 'assets/img/tronconneuse.jpg';
    if (/FS 250/.test(m.modele)) return 'assets/img/debroussailleuse-fs250.jpg';
    if (m.mat === 'Débroussailleuse') return 'assets/img/debroussailleuse-fs400.jpg';
    if (m.mat === 'Compresseur') return 'assets/img/compresseur.jpg';
    if (m.mat === 'Pompe hydraulique') return 'assets/img/hydraulique.jpg';
    return null;
  }
  function thumb(m, cls) { var p = photo(m); return '<span class="th' + (cls ? ' ' + cls : '') + '">' + (p ? '<img src="' + p + '" alt="" loading="lazy">' : ico('axe')) + '</span>'; }
  function openDr(title, html) {
    $('dr-id').textContent = title; $('dr-b').className = 'dr-b'; $('dr-b').innerHTML = html;
    $('drawer').classList.add('on'); $('scrim').classList.add('on'); $('drawer').setAttribute('aria-hidden', 'false'); $('dr-b').scrollTop = 0;
  }
  var REF, SOC = 'Groupe', D;
  var SOCS = ['SACRI', 'PST-CI', 'Trans-Roulements', 'SAFIR', 'DEFI'];

  // ---------- réclamations : état ----------
  function etat(r) {
    if (r.fin) return 'close';
    if (!r.rep) return hours(r.recue, REF) > 48 ? 'rouge' : 'attente';
    return 'cours';
  }
  var ETL = { rouge: ['Plus de 48 h sans réponse', 'r'], attente: ['Sans réponse', 'a'], cours: ['En cours', 'b'], close: ['Résolue', 'g'] };
  function pill(r) { var e = ETL[etat(r)]; return '<span class="pill ' + e[1] + '"><i class="d"></i>' + e[0] + '</span>'; }
  var fRe = 'ouvertes';
  function recl() { return RECL.filter(function (r) { return SOC === 'Groupe' || r.soc === SOC; }); }
  function ouvertes(list) { return list.filter(function (r) { return !r.fin; }); }

  function renderRecl() {
    var all = recl(), op = ouvertes(all), red = op.filter(function (r) { return etat(r) === 'rouge'; }), wait = op.filter(function (r) { return etat(r) === 'attente'; });
    var opAll = ouvertes(RECL);
    $('rc-lede').innerHTML = '<b>' + pl(op.length, 'réclamation ouverte', 'réclamations ouvertes') + '</b>' + (SOC === 'Groupe' ? ' dans le groupe' : ' chez ' + esc(SOC)) +
      (red.length ? ', dont <span class="r">' + pl(red.length, 'sans réponse depuis plus de 48 h', 'sans réponse depuis plus de 48 h') + '</span>' : ', aucune sans réponse au-delà de 48 h') +
      '. Chaque nouvelle réclamation prévient la direction ; au-delà de 48 h sans réponse, elle passe en rouge et l\'alerte est prête à partir.';
    var rep = all.filter(function (r) { return r.rep; }), mrep = median(rep.map(function (r) { return hours(r.recue, r.rep); }));
    var h = kc({ ic: 'flag', l: 'Réclamations ouvertes', v: n0(op.length), cls: 'key', s: pl(all.length, 'réclamation reçue', 'réclamations reçues') + ' depuis le 6 novembre' });
    h += kc({ ic: 'siren', l: 'Plus de 48 h sans réponse', v: red.length ? n0(red.length) : 'Aucune', cls: red.length ? 'bad' : '', s: red.length ? '<span>la plus ancienne : <b>' + esc(red.slice().sort(function (a, b) { return dt(a.recue) - dt(b.recue); })[0].client) + '</b>, ' + age(hours(red.slice().sort(function (a, b) { return dt(a.recue) - dt(b.recue); })[0].recue, REF)) + '</span>' : 'toutes ont une réponse dans les 48 h' });
    h += kc({ ic: 'hourglass', l: 'Sans réponse, moins de 48 h', v: wait.length ? n0(wait.length) : 'Aucune', s: wait.length ? 'à traiter avant de passer en rouge' : 'rien en attente' });
    h += kc({ ic: 'timer', l: 'Première réponse, délai médian', v: mrep == null ? 'Aucune' : mrep < 24 ? n1(mrep).replace(/,0$/, '') : n1(mrep / 24).replace(/,0$/, ''), u: mrep == null ? '' : mrep < 24 ? 'h' : 'j', s: 'sur ' + pl(rep.length, 'réclamation répondue', 'réclamations répondues') });
    $('rc-kpis').innerHTML = h;

    // compteur et filtre par société
    var chips = [['Groupe', 'Toutes les sociétés', opAll.length, ouvertes(RECL).filter(function (r) { return etat(r) === 'rouge'; }).length]].concat(SOCS.map(function (k) {
      var o = opAll.filter(function (r) { return r.soc === k; }); return [k, k, o.length, o.filter(function (r) { return etat(r) === 'rouge'; }).length];
    }));
    $('rc-socs').innerHTML = chips.map(function (c) {
      return '<button class="sc' + (SOC === c[0] ? ' on' : '') + '" data-k="' + c[0] + '"><span class="sn">' + esc(c[1]) + '</span><span class="sv"><b>' + n0(c[2]) + '</b> ' + (c[2] > 1 ? 'ouvertes' : 'ouverte') + '</span>' +
        '<span class="sr' + (c[3] ? '' : ' z') + '">' + (c[3] ? n0(c[3]) + ' en rouge' : 'aucune en rouge') + '</span></button>';
    }).join('');
    $('rc-socs').querySelectorAll('.sc').forEach(function (b) { b.addEventListener('click', function () { window.SacriSetSoc(b.getAttribute('data-k')); }); });

    var segs = [['ouvertes', 'Ouvertes', op.length], ['rouge', 'Plus de 48 h', red.length], ['closes', 'Résolues', all.length - op.length], ['toutes', 'Toutes', all.length]];
    $('rc-seg').innerHTML = segs.map(function (s) { return '<button data-s="' + s[0] + '" class="' + (fRe === s[0] ? 'on' : '') + '">' + s[1] + ' <span class="c' + (s[0] === 'rouge' && s[2] ? ' r' : '') + '">' + n0(s[2]) + '</span></button>'; }).join('');
    $('rc-seg').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { fRe = b.getAttribute('data-s'); renderRecl(); }); });
    $('rc-alert-all').disabled = !red.length;
    $('rc-alert-all').innerHTML = ico('siren') + (red.length ? 'Alerte direction (' + n0(red.length) + ')' : 'Alerte direction');

    var rank = { rouge: 0, attente: 1, cours: 2, close: 3 };
    var L = all.filter(function (r) { var e = etat(r); return fRe === 'toutes' || (fRe === 'ouvertes' && e !== 'close') || (fRe === 'rouge' && e === 'rouge') || (fRe === 'closes' && e === 'close'); })
      .sort(function (a, b) { return (rank[etat(a)] - rank[etat(b)]) || (dt(a.recue) - dt(b.recue)); });
    $('rc-rows').innerHTML = L.length ? L.map(function (r) {
      var e = etat(r), hAge = hours(r.recue, r.fin || REF);
      var del = e === 'close' ? 'résolue en ' + age(hAge) : e === 'cours' ? 'reçue il y a ' + age(hAge) + ', répondue en ' + age(hours(r.recue, r.rep)) : 'reçue il y a ' + age(hAge) + ', sans réponse';
      return '<div class="rr ' + e + '" data-n="' + r.n + '">' +
        '<div class="c1"><span class="soc">' + esc(r.soc) + '</span><p class="cl">' + esc(r.client) + '</p><p class="q">' + esc(r.quoi) + '</p></div>' +
        '<div class="c2"><p class="lb">Machine</p><p class="mv">' + esc(r.machine) + '</p>' + (r.serie ? '<button class="sl" data-s="' + esc(r.serie) + '">N° ' + esc(r.serie) + ico('arrow-up-right') + '</button>' : '<p class="mt">sans numéro de série</p>') + '</div>' +
        '<div class="c3"><p class="lb">Reçue le</p><p class="mv">' + dd(r.recue) + ' à ' + hh(r.recue) + '</p><p class="mt">' + esc(r.canal) + '</p></div>' +
        '<div class="c4"><p class="lb">Délai depuis réception</p><p class="mv dl' + (e === 'rouge' ? ' red' : '') + '">' + age(hAge) + '</p><p class="mt">' + del.replace(/^[^,]*, ?/, '') + '</p></div>' +
        '<div class="c5">' + pill(r) + (e !== 'close' ? '<button class="bt al' + (e === 'rouge' ? ' pri' : '') + '" data-n="' + r.n + '">' + ico('siren') + 'Alerte direction</button>' : '<button class="bt al" data-n="' + r.n + '">' + ico('file-text') + 'Détail</button>') + '</div>' +
        '</div>';
    }).join('') : '<p class="empty">Aucune réclamation dans ce filtre' + (SOC === 'Groupe' ? '' : ' pour ' + esc(SOC)) + '.</p>';
    $('rc-rows').querySelectorAll('.al').forEach(function (b) { b.addEventListener('click', function () { alerte([RECL.filter(function (r) { return r.n === b.getAttribute('data-n'); })[0]]); }); });
    $('rc-rows').querySelectorAll('.sl').forEach(function (b) { b.addEventListener('click', function () { openFiche(b.getAttribute('data-s')); }); });
  }

  // ---------- message d'alerte vers la direction ----------
  function msgWA(L) {
    if (L.length > 1) {
      return 'Alerte réclamations, service client SACRI\n' + pl(L.length, 'réclamation', 'réclamations') + ' sans réponse depuis plus de 48 h :\n\n' + L.map(function (r, i) {
        return (i + 1) + '. ' + r.client + ' (' + r.soc + ')\nQuoi : ' + r.quoi + '\nMachine : ' + r.machine + (r.serie ? ', n° ' + r.serie : '') + '\nDepuis : ' + jour(r.recue) + ' à ' + hh(r.recue) + ', soit ' + agel(hours(r.recue, REF)) + '\nFait : ' + r.fait.join(' ; ') + '\nSuivi par : ' + r.suivi;
      }).join('\n\n') + '\n\nService client SACRI';
    }
    var r = L[0], e = etat(r), h = hours(r.recue, r.fin || REF);
    return 'Alerte réclamation, service client SACRI\n\nQui : ' + r.client + ', client ' + r.soc + '\nQuoi : ' + r.quoi + '\nMachine : ' + r.machine + (r.serie ? ', n° de série ' + r.serie : '') +
      '\nDepuis quand : reçue le ' + jour(r.recue) + ' à ' + hh(r.recue) + ' ' + (r.canal === 'Comptoir' ? '' : 'par ') + par(r.canal) + ', ' + (e === 'close' ? 'résolue en ' + agel(h) : e === 'cours' ? 'ouverte depuis ' + agel(h) + ', première réponse en ' + agel(hours(r.recue, r.rep)) : 'sans réponse depuis ' + agel(h)) +
      '\nCe qui a été fait :\n' + r.fait.map(function (f) { return '- ' + f; }).join('\n') + '\nSuivi par : ' + r.suivi + '\n\nService client SACRI';
  }
  function msgMail(L) {
    var obj, body;
    if (L.length > 1) {
      obj = pl(L.length, 'réclamation', 'réclamations') + ' sans réponse depuis plus de 48 h';
      body = 'Monsieur le Directeur général,\n\nVoici les réclamations restées sans réponse au-delà de 48 h, au ' + jour(D.ref) + ' à ' + hh(D.ref) + '.\n\n' + L.map(function (r, i) {
        return (i + 1) + '. ' + r.client + ', client ' + r.soc + '\n   Quoi : ' + r.quoi + '\n   Machine : ' + r.machine + (r.serie ? ', n° de série ' + r.serie : '') + '\n   Depuis quand : reçue le ' + jour(r.recue) + ' à ' + hh(r.recue) + ', sans réponse depuis ' + agel(hours(r.recue, REF)) + '\n   Ce qui a été fait : ' + r.fait.join(' ; ') + '\n   Suivi par : ' + r.suivi;
      }).join('\n\n') + '\n\nLe service client';
    } else {
      var r = L[0], e = etat(r), h = hours(r.recue, r.fin || REF);
      obj = (e === 'rouge' ? 'Réclamation sans réponse depuis ' + agel(h) : e === 'close' ? 'Réclamation résolue' : 'Réclamation en cours') + ' : ' + r.client + ' (' + r.soc + ')';
      body = 'Monsieur le Directeur général,\n\nQui : ' + r.client + ', client ' + r.soc + '.\nQuoi : ' + r.quoi + '.\nMachine : ' + r.machine + (r.serie ? ', n° de série ' + r.serie : '') + '.\nDepuis quand : reçue le ' + jour(r.recue) + ' à ' + hh(r.recue) + ' ' + (r.canal === 'Comptoir' ? '' : 'par ') + par(r.canal) + ' ; ' +
        (e === 'close' ? 'résolue en ' + agel(h) : e === 'cours' ? 'ouverte depuis ' + agel(h) + ', première réponse en ' + agel(hours(r.recue, r.rep)) : 'sans réponse depuis ' + agel(h)) + '.\n\nCe qui a été fait :\n' + r.fait.map(function (f) { return '- ' + f; }).join('\n') + '\n\nSuivi par : ' + r.suivi + '.\n\nLe service client';
    }
    return { obj: obj, body: body };
  }
  var canalAl = 'wa';
  function alerte(L) {
    function draw() {
      var m = msgMail(L), wa = msgWA(L);
      var head = L.length > 1 ? '<p class="al-t">' + pl(L.length, 'réclamation', 'réclamations') + ' sans réponse depuis plus de 48 h</p>' : '<div class="al-h">' + pill(L[0]) + '<p class="al-t">' + esc(L[0].client) + '</p><p class="al-s">' + esc(L[0].soc) + ', ' + esc(L[0].n) + '</p></div>';
      $('dr-b').innerHTML = head +
        '<div class="al-tabs" role="tablist"><button data-c="wa" class="' + (canalAl === 'wa' ? 'on' : '') + '">' + ico('message-circle') + 'WhatsApp</button><button data-c="mail" class="' + (canalAl === 'mail' ? 'on' : '') + '">' + ico('mail') + 'E-mail</button></div>' +
        '<div class="al-to"><span>À</span><b>Directeur général</b><em>' + (canalAl === 'wa' ? 'numéro WhatsApp de la direction' : 'adresse e-mail de la direction') + '</em></div>' +
        (canalAl === 'mail' ? '<div class="al-to"><span>Objet</span><b>' + esc(m.obj) + '</b></div>' : '') +
        '<div class="' + (canalAl === 'wa' ? 'wab al-wa' : 'al-mail') + '"><p>' + esc(canalAl === 'wa' ? wa : m.body).replace(/\n/g, '<br>') + '</p></div>' +
        '<div class="al-act"><button class="bt pri" id="al-copy">' + ico('check-check') + 'Copier le message</button><span class="al-n" id="al-n">Démonstration : le message est prêt, rien ne part de cette page.</span></div>';
      $('dr-b').querySelectorAll('.al-tabs button').forEach(function (b) { b.addEventListener('click', function () { canalAl = b.getAttribute('data-c'); draw(); }); });
      $('al-copy').addEventListener('click', function () {
        var t = canalAl === 'wa' ? wa : 'Objet : ' + m.obj + '\n\n' + m.body;
        var done = function () { $('al-n').textContent = 'Message copié. Collez-le dans ' + (canalAl === 'wa' ? 'WhatsApp' : 'votre messagerie') + ' pour l\'envoyer.'; };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
      });
    }
    openDr(L.length > 1 ? 'Alerte direction, ' + pl(L.length, 'réclamation', 'réclamations') : 'Alerte direction, ' + L[0].n, '');
    draw();
  }

  // ---------- retours machines ----------
  function mach() { return MACH.filter(function (m) { return SOC === 'Groupe' || m.soc === SOC; }); }
  function first(m) { return m.ret.length ? days(m.vente, m.ret[0].d) : null; }
  var qS = '';
  function norm(s) { return String(s).toUpperCase().replace(/[\s-]/g, ''); }
  function renderRet() {
    var M = mach(), back = M.filter(function (m) { return m.ret.length; }), rec = M.filter(function (m) { return m.ret.length >= 2; }), nret = M.reduce(function (s, m) { return s + m.ret.length; }, 0);
    var med = median(back.map(first));
    if (!M.length) {
      $('rt-lede').innerHTML = esc(SOC) + ' ne vend pas de machine suivie par numéro de série : ' + (SOC === 'DEFI' ? 'ses ouvrages sont réalisés sur devis.' : 'elle fournit des pièces de transmission.') + ' Les retours à l\'atelier concernent SACRI, PST-CI et SAFIR.';
      ['rt-kpis', 'rt-rec', 'rt-med-m', 'rt-med-s', 'rt-top'].forEach(function (id) { $(id).innerHTML = ''; });
      $('rt-body').hidden = true; $('rt-none').hidden = false;
      $('rt-none').innerHTML = '<div class="nodata">Aucune machine suivie pour ' + esc(SOC) + '. Choisissez SACRI, PST-CI, SAFIR ou toutes les sociétés.</div>';
      renderSearch(); return;
    }
    $('rt-body').hidden = false; $('rt-none').hidden = true;
    $('rt-lede').innerHTML = 'Aucune machine n\'entre à l\'atelier sans son numéro de série : chaque retour se rattache à la vente. <b>' + pl(M.length, 'machine vendue', 'machines vendues') + '</b> suivies' + (SOC === 'Groupe' ? '' : ' chez ' + esc(SOC)) + ', <b>' + pl(back.length, 'revenue', 'revenues') + '</b> au moins une fois, dont <span class="r">' + n0(rec.length) + ' deux fois ou plus</span>.';
    var h = kc({ ic: 'package', l: 'Machines suivies', v: n0(M.length), s: 'vendues depuis juillet 2025, par numéro de série' });
    h += kc({ ic: 'rotate-ccw', l: 'Revenues à l\'atelier', v: n0(back.length), cls: 'key', s: pl(nret, 'passage', 'passages') + ' à l\'atelier au total' });
    h += kc({ ic: 'triangle-alert', l: 'Revenues 2 fois ou plus', v: rec.length ? n0(rec.length) : 'Aucune', cls: rec.length ? 'bad' : '', s: rec.length ? 'à examiner : panne répétée ou usage' : 'aucune machine récidiviste' });
    h += kc({ ic: 'calendar-clock', l: 'Vente au premier retour, médiane', v: med == null ? 'Aucun' : n0(med), u: med == null ? '' : 'j', s: med == null ? 'aucun retour' : 'soit ' + mois(med) + ' après la vente' });
    $('rt-kpis').innerHTML = h;

    // machines revenues 2 fois ou plus
    var rs = rec.slice().sort(function (a, b) { return (b.ret.length - a.ret.length) || (first(a) - first(b)); });
    $('rt-rec-n').textContent = rs.length ? n0(rs.length) : '';
    $('rt-rec').innerHTML = rs.length ? rs.map(function (m) {
      var same = m.ret.length > 1 && m.ret.some(function (r, i) { return m.ret.some(function (q, j) { return j !== i && q.motif === r.motif; }); });
      return '<button class="mr" data-s="' + esc(m.serie) + '">' + thumb(m) + '<span class="mb"><span class="t1"><b>' + esc(m.modele) + '</b><span class="nb">' + n0(m.ret.length) + ' retours</span></span><span class="t2">N° ' + esc(m.serie) + ', ' + esc(m.client) + '</span>' +
        '<span class="t3"><span class="soc">' + esc(m.soc) + '</span>premier retour ' + n0(first(m)) + ' j après la vente' + (same ? '<span class="pill r">même panne</span>' : '') + '</span></span></button>';
    }).join('') : '<p class="empty">Aucune machine revenue deux fois ou plus.</p>';
    $('rt-rec').querySelectorAll('.mr').forEach(function (b) { b.addEventListener('click', function () { openFiche(b.getAttribute('data-s')); }); });

    // délai médian par modèle et par société
    function tab(key) {
      var g = {}; back.forEach(function (m) { (g[m[key]] = g[m[key]] || []).push(first(m)); });
      var rows = Object.keys(g).map(function (k) { return [k, median(g[k]), g[k].length]; }).sort(function (a, b) { return a[1] - b[1]; });
      var mx = Math.max.apply(null, rows.map(function (r) { return r[1]; }));
      return '<div class="tb-h"><span>' + (key === 'modele' ? 'Modèle' : 'Société') + '</span><span>Médiane</span></div>' + rows.map(function (r) {
        return '<div class="tb-r"><span class="k">' + esc(r[0]) + '<small>' + pl(r[2], 'machine revenue', 'machines revenues') + '</small></span><span class="bar"><i style="width:' + Math.max(6, r[1] / mx * 100) + '%"></i></span><span class="v"><b>' + n0(r[1]) + ' j</b><small>' + mois(r[1]) + '</small></span></div>';
      }).join('');
    }
    $('rt-med-m').innerHTML = tab('modele');
    $('rt-med-s').innerHTML = tab('soc');

    // modèles qui reviennent le plus
    var gm = {}; M.forEach(function (m) { var x = gm[m.modele] = gm[m.modele] || { k: m.modele, soc: m.soc, v: 0, b: 0, r: 0, m: m }; x.v++; if (m.ret.length) x.b++; x.r += m.ret.length; });
    var top = Object.keys(gm).map(function (k) { return gm[k]; }).filter(function (x) { return x.r; }).sort(function (a, b) { return (b.r - a.r) || (b.b / b.v - a.b / a.v); }).slice(0, 6);
    var tmx = top.length ? top[0].r : 1;
    $('rt-top').innerHTML = top.map(function (x, i) {
      return '<div class="tp"><span class="rk">' + (i + 1) + '</span>' + thumb(x.m, 'sm') + '<span class="tk"><b>' + esc(x.k) + '</b><small>' + esc(x.soc) + ', ' + n0(x.b) + ' sur ' + pl(x.v, 'machine vendue', 'machines vendues') + ' revenue' + (x.b > 1 ? 's' : '') + '</small></span><span class="bar"><i style="width:' + (x.r / tmx * 100) + '%"></i></span><span class="tv"><b>' + n0(x.r) + '</b> retours</span></div>';
    }).join('');
    renderSearch();
  }
  function fiche(m, inline) {
    var ev = [{ d: m.vente, t: 'Vendue à ' + m.client, s: 'vente, ' + m.soc, k: 'v' }].concat(m.ret.map(function (r, i) {
      var prev = i ? m.ret[i - 1].d : m.vente;
      return { d: r.d, t: (i + 1) + (i ? 'e' : 'er') + ' retour à l\'atelier : ' + r.motif, s: 'bon ' + r.br + ', ' + n0(days(prev, r.d)) + ' j après ' + (i ? 'le retour précédent' : 'la vente'), k: 'r' };
    }));
    var recs = RECL.filter(function (r) { return r.serie === m.serie; });
    return '<div class="fh">' + thumb(m, 'lg') + '<div><div class="fp">' + (m.ret.length >= 2 ? '<span class="pill r">' + n0(m.ret.length) + ' retours</span>' : m.ret.length ? '<span class="pill a">1 retour</span>' : '<span class="pill g">aucun retour</span>') + '<span class="soc">' + esc(m.soc) + '</span></div>' +
      '<h3>' + esc(m.modele) + '</h3><p>N° de série <b>' + esc(m.serie) + '</b></p><p>' + esc(m.client) + '</p></div></div>' +
      '<dl class="props"><dt>Vendue le</dt><dd>' + dlong(m.vente) + '</dd><dt>Premier retour</dt><dd class="' + (m.ret.length >= 2 ? 'red' : '') + '">' + (m.ret.length ? n0(first(m)) + ' j après la vente (' + mois(first(m)) + ')' : 'pas encore revenue') + '</dd><dt>Passages atelier</dt><dd>' + n0(m.ret.length) + '</dd></dl>' +
      '<div class="tl fl"><h4>' + ico('history') + 'Historique de la machine</h4>' + ev.map(function (e) { return '<div class="e ok ' + e.k + '"><span><b class="et">' + esc(e.t) + '</b><small>' + esc(e.s) + '</small></span><b>' + dd(e.d) + '/' + dt(e.d).getFullYear() + '</b></div>'; }).join('') + '</div>' +
      (recs.length ? '<div class="frc"><h4>' + ico('flag') + 'Réclamation liée</h4>' + recs.map(function (r) { return '<p>' + pill(r) + '<span>' + esc(r.quoi) + ', reçue le ' + dd(r.recue) + '</span></p>'; }).join('') + '</div>' : '');
  }
  function find(q) { var k = norm(q); return MACH.filter(function (m) { return norm(m.serie).indexOf(k) >= 0; }); }
  function openFiche(s) { var m = MACH.filter(function (x) { return x.serie === s; })[0]; if (m) openDr('Fiche machine, n° ' + m.serie, fiche(m)); }
  function renderSearch() {
    var box = $('rt-res');
    if (!qS) {
      var ex = mach().filter(function (m) { return m.ret.length >= 2; }).slice(0, 3).concat(MACH.filter(function (m) { return m.ret.length >= 2; })).slice(0, 3);
      box.innerHTML = '<p class="hint">Saisissez un numéro de série, par exemple ' + ex.map(function (m) { return '<button class="ex" data-s="' + esc(m.serie) + '">' + esc(m.serie) + '</button>'; }).join(', ') + '.</p>';
    } else {
      var r = find(qS);
      if (!r.length) box.innerHTML = '<p class="empty">Aucune machine avec le numéro « ' + esc(qS) + ' ». Vérifiez le numéro sur la plaque de la machine.</p>';
      else if (r.length === 1) box.innerHTML = '<div class="card fc">' + fiche(r[0], true) + '</div>';
      else box.innerHTML = '<div class="sres">' + r.slice(0, 8).map(function (m) { return '<button class="ex2" data-s="' + esc(m.serie) + '">' + thumb(m, 'sm') + '<span><b>' + esc(m.serie) + '</b><small>' + esc(m.modele) + ', ' + esc(m.client) + '</small></span><span class="nb">' + pl(m.ret.length, 'retour') + '</span></button>'; }).join('') + '</div>';
    }
    box.querySelectorAll('[data-s]').forEach(function (b) { b.addEventListener('click', function () { qS = b.getAttribute('data-s'); $('rt-q').value = qS; renderSearch(); }); });
  }

  var bound = false;
  function bind() {
    if (bound) return; bound = true;
    $('rc-alert-all').addEventListener('click', function () { var red = ouvertes(recl()).filter(function (r) { return etat(r) === 'rouge'; }).sort(function (a, b) { return dt(a.recue) - dt(b.recue); }); if (red.length) alerte(red); });
    $('rt-q').addEventListener('input', function () { qS = this.value.trim(); renderSearch(); });
    var q = new URLSearchParams(location.search).get('serie');
    if (q) { qS = q; $('rt-q').value = q; }
  }
  window.SacriSuivi = {
    counts: function (D0, soc) { REF = D0.ref; var o = RECL.filter(function (r) { return !r.fin && (soc === 'Groupe' || r.soc === soc); }); return { red: o.filter(function (r) { return etat(r) === 'rouge'; }).length, rec: MACH.filter(function (m) { return m.ret.length >= 2 && (soc === 'Groupe' || m.soc === soc); }).length }; },
    render: function (v, soc, D0) { D = D0; REF = D0.ref; SOC = soc; bind(); if (v === 'reclamations') renderRecl(); if (v === 'retours') renderRet(); }
  };
})();
