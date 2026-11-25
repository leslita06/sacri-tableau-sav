// SACRI : réclamations suivies et retours machines par numéro de série.
// Données de démonstration. Aucun message ne part de cette page.
(function () {
  'use strict';
  // ---------- données ----------
  // Réclamations : rep = première réponse au client, fin = réclamation close.
  var RECL = [
    { n: 'R-2026-118', soc: 'SACRI', client: 'Exploitation forestière Bandama Est', machine: 'STIHL MS 661', serie: '5108 4457', recue: '2026-11-14T09:20', canal: 'WhatsApp', quoi: 'Troisième retour à l\'atelier en sept mois, le client demande un échange de la machine', suivi: 'Atelier SACRI', rep: null, fin: null,
      fait: ['Machine reçue à l\'atelier le 18/11 (bon BR-2026-0430)', 'Diagnostic pas encore commencé', 'Aucune réponse écrite au client sur la demande d\'échange'] },
    { n: 'R-2026-119', soc: 'SACRI', client: 'Scierie du Haut-Sassandra', machine: 'STIHL MS 661', serie: '5108 9921', recue: '2026-11-15T11:40', canal: 'Téléphone', quoi: 'Même panne qu\'en juin : la tronçonneuse manque de puissance', suivi: 'Comptoir SACRI', rep: null, fin: null,
      fait: ['Appel noté au comptoir le 15/11', 'Machine réparée, prête à retirer (bon BR-2026-0422)', 'Client pas rappelé sur la panne répétée'] },
    { n: 'R-2026-120', soc: 'Trans-Roulements', client: 'Huilerie Agnéby', machine: 'Roulements 6310, livraison du 12/11', serie: null, recue: '2026-11-17T10:05', canal: 'E-mail', quoi: 'Mauvaise référence livrée, la ligne de pressage attend la bonne pièce', suivi: 'Magasin Trans-Roulements', rep: null, fin: null,
      fait: ['E-mail reçu le 17/11', 'Stock de la bonne référence vérifié : disponible', 'Aucune réponse envoyée au client'] },
    { n: 'R-2026-121', soc: 'DEFI', client: 'Huilerie Agnéby', machine: 'Tuyauterie vapeur, chantier de septembre', serie: null, recue: '2026-11-16T15:20', canal: 'E-mail', quoi: 'Fuite sur une soudure de la tuyauterie posée en septembre', suivi: 'Chef de chantier DEFI', rep: null, fin: null,
      fait: ['E-mail transmis au chef de chantier le 17/11', 'Visite sur site pas encore planifiée'] },
    { n: 'R-2026-122', soc: 'PST-CI', client: 'Carrières du N’Zi', machine: 'Compresseur à vis 7,5 kW', serie: 'C-31 0285', recue: '2026-11-18T16:00', canal: 'E-mail', quoi: 'Le compresseur s\'arrête encore en surchauffe, troisième retour', suivi: 'Atelier PST-CI', rep: '2026-11-19T09:10', fin: null,
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
    { n: 'R-2026-104', soc: 'SACRI', client: 'M. Serge Kouadio', machine: 'STIHL FS 250', serie: '2209 8835', recue: '2026-11-10T08:38', canal: 'WhatsApp', quoi: 'Lanceur cassé deux fois en deux mois', suivi: 'Atelier SACRI', rep: '2026-11-10T09:20', fin: '2026-11-12T17:00',
      fait: ['Alerte à la direction le 10/11 à 8 h 40', 'Rappel du client par le technicien le 10/11 à 9 h 20', 'Lanceur remplacé, cause expliquée au client', 'Réclamation close le 12/11'],
      frise: [['2026-11-10T08:38', 'Reçue', 'Message WhatsApp du client, numéro de série 2209 8835 donné', 'Client', 'c'],
        ['2026-11-10T08:39', 'Réclamation ouverte', 'L\'assistant retrouve la machine et ses 2 retours, ouvre R-2026-104', 'Assistant', 'a'],
        ['2026-11-10T08:40', 'Alerte à la direction', 'Directeur général et responsable de l\'atelier prévenus sur WhatsApp et par e-mail', 'Automatique', 'a'],
        ['2026-11-10T08:55', 'Prise en charge', 'Yao K., technicien SACRI, prend le dossier', 'Atelier', 'h'],
        ['2026-11-10T09:20', 'Rappel du client', 'Le technicien appelle le client, 42 min après son message', 'Atelier', 'h'],
        ['2026-11-12T17:00', 'Clôturée', 'Lanceur remplacé, cause expliquée au client, client satisfait', 'Atelier', 'h']] },
    { n: 'R-2026-098', soc: 'SAFIR', client: 'Menuiserie Grâce Divine', machine: 'Lames de scie à ruban, livraison du 05/11', serie: null, recue: '2026-11-06T11:00', canal: 'Comptoir', quoi: 'Lames livrées à la mauvaise longueur', suivi: 'Magasin SAFIR', rep: '2026-11-06T12:00', fin: '2026-11-08T10:00',
      fait: ['Réponse au comptoir le 06/11', 'Lames échangées le 08/11'] }
  ];
  // Machines vendues, suivies par numéro de série ; chaque retour à l'atelier porte son bon.
  var MACH = [
    ['5108 3274', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Scierie Bandama Bois', '2025-11-04', [['2026-05-12', 'Guide-chaîne usé', 'BR-2026-0188'], ['2026-10-20', 'Ne démarre plus', 'BR-2026-0412']]],
    ['5108 9921', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Scierie du Haut-Sassandra', '2026-02-09', [['2026-06-22', 'Manque de puissance', 'BR-2026-0231'], ['2026-11-10', 'Manque de puissance', 'BR-2026-0422']]],
    ['5108 4457', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Exploitation forestière Bandama Est', '2026-04-14', [['2026-08-03', 'Frein de chaîne bloqué', 'BR-2026-0309'], ['2026-09-28', 'Lanceur cassé', 'BR-2026-0352'], ['2026-11-18', 'Frein de chaîne bloqué', 'BR-2026-0430']]],
    ['5108 6630', 'SACRI', 'STIHL MS 661', 'Tronçonneuse', 'Scierie Bandama Bois', '2026-06-15', []],
    ['4421 0917', 'SACRI', 'STIHL FS 400', 'Débroussailleuse', 'Plantations Akoupé Sud', '2025-12-01', [['2026-10-23', 'Moteur cale à chaud', 'BR-2026-0413']]],
    ['4421 7752', 'SACRI', 'STIHL FS 400', 'Débroussailleuse', 'Plantations Akoupé Sud', '2026-03-02', [['2026-07-20', 'Tête faucheuse bloquée', 'BR-2026-0274'], ['2026-11-14', 'Arbre de transmission cassé', 'BR-2026-0428']]],
    ['3317 5562', 'SACRI', 'STIHL MS 381', 'Tronçonneuse', 'Exploitation forestière Bandama Est', '2025-09-15', [['2026-11-02', 'Chaîne qui ne tourne pas', 'BR-2026-0416']]],
    ['3317 0846', 'SACRI', 'STIHL MS 381', 'Tronçonneuse', 'Scierie Bandama Bois', '2026-05-18', [['2026-11-12', 'Carburateur noyé', 'BR-2026-0426']]],
    ['3317 2290', 'SACRI', 'STIHL MS 381', 'Tronçonneuse', 'Hévéa Bonoua SA', '2026-03-23', []],
    ['2209 8835', 'SACRI', 'STIHL FS 250', 'Débroussailleuse', 'M. Serge Kouadio', '2026-06-08', [['2026-09-07', 'Lanceur cassé', 'BR-2026-0341'], ['2026-11-04', 'Lanceur cassé', 'BR-2026-0417']]],
    ['2209 1164', 'SACRI', 'STIHL FS 250', 'Débroussailleuse', 'M. Ibrahim Touré', '2026-08-24', [['2026-11-19', 'Fumée blanche', 'BR-2026-0431']]],
    ['2209 5517', 'SACRI', 'STIHL FS 250', 'Débroussailleuse', 'Cité Verte Paysages', '2026-05-04', []],
    ['4002 7716', 'SACRI', 'STIHL MS 461', 'Tronçonneuse', 'Exploitation forestière Bandama Est', '2026-01-12', [['2026-11-05', 'Embrayage qui patine', 'BR-2026-0418']]],
    ['1873 4410', 'SACRI', 'STIHL MS 250', 'Tronçonneuse', 'Mme Adjoua Brou', '2026-07-06', [['2026-11-11', 'Chaîne qui saute', 'BR-2026-0424']]],
    ['4421 3308', 'SACRI', 'STIHL FS 450', 'Débroussailleuse', 'Cité Verte Paysages', '2026-04-27', [['2026-11-12', 'Ne démarre plus', 'BR-2026-0425']]],
    ['C-27 4410', 'PST-CI', 'Compresseur à piston 500 L', 'Compresseur', 'BTP Kanga & Fils', '2025-07-21', [['2026-04-13', 'Soupape de sécurité qui fuit', 'BR-2026-0142'], ['2026-10-27', 'Perte de pression', 'BR-2026-0414']]],
    ['C-27 1193', 'PST-CI', 'Compresseur à piston 270 L', 'Compresseur', 'BTP Kanga & Fils', '2026-01-19', [['2026-11-06', 'Ne monte plus en pression', 'BR-2026-0420']]],
    ['C-27 3051', 'PST-CI', 'Compresseur à piston 270 L', 'Compresseur', 'Charpentes Métalliques du Port', '2026-05-11', []],
    ['C-31 0285', 'PST-CI', 'Compresseur à vis 7,5 kW', 'Compresseur', 'Carrières du N’Zi', '2025-10-06', [['2026-02-23', 'S\'arrête en surchauffe', 'BR-2026-0071'], ['2026-06-29', 'Filtre à huile colmaté', 'BR-2026-0236'], ['2026-11-09', 'S\'arrête en surchauffe', 'BR-2026-0421']]],
    ['C-12 6604', 'PST-CI', 'Compresseur à piston 100 L', 'Compresseur', 'Menuiserie Grâce Divine', '2026-03-16', [['2026-11-10', 'Moteur ne tourne pas', 'BR-2026-0423']]],
    ['PH-2245', 'PST-CI', 'Pompe à pistons axiaux', 'Pompe hydraulique', 'Plantations Akoupé Sud', '2025-11-17', [['2026-10-29', 'Débit faible', 'BR-2026-0415']]],
    ['PH-1180', 'PST-CI', 'Pompe à engrenages', 'Pompe hydraulique', 'Agro-Industries du Sud-Comoé', '2025-12-08', [['2026-05-25', 'Fuite au joint d\'arbre', 'BR-2026-0201'], ['2026-11-06', 'Fuite au joint d\'arbre', 'BR-2026-0419']]],
    ['PH-1534', 'PST-CI', 'Pompe à engrenages', 'Pompe hydraulique', 'Huilerie Agnéby', '2026-04-06', [['2026-11-17', 'Surchauffe', 'BR-2026-0429']]],
    ['PH-0937', 'PST-CI', 'Pompe à palettes', 'Pompe hydraulique', 'Hévéa Bonoua SA', '2026-02-02', [['2026-11-13', 'Bruit anormal', 'BR-2026-0427']]],
    ['SR-0614', 'SAFIR', 'Scie à ruban 800 mm', 'Scie à ruban', 'Scierie du Haut-Sassandra', '2025-08-18', [['2026-03-02', 'Volant désaligné', 'BR-2026-0098'], ['2026-09-14', 'Roulement de volant bruyant', 'BR-2026-0338']]],
    ['SR-0702', 'SAFIR', 'Scie à ruban 1 100 mm', 'Scie à ruban', 'Scierie Bandama Bois', '2026-01-26', [['2026-07-27', 'Lame qui dévie', 'BR-2026-0287']]],
    ['SR-0731', 'SAFIR', 'Scie à ruban 800 mm', 'Scie à ruban', 'Menuiserie Grâce Divine', '2026-06-01', []]
  ].map(function (m) { return { serie: m[0], soc: m[1], modele: m[2], mat: m[3], client: m[4], vente: m[5], ret: m[6].map(function (r) { return { d: r[0], motif: r[1], br: r[2] }; }) }; });
  var CAUSE = { 'R-2026-118': 'Panne qui revient après réparation', 'R-2026-119': 'Panne qui revient après réparation', 'R-2026-120': 'Erreur de livraison ou de référence',
    'R-2026-121': 'Défaut de pose sur chantier', 'R-2026-122': 'Panne qui revient après réparation', 'R-2026-123': 'Délai dépassé ou client sans nouvelles',
    'R-2026-124': 'Garantie ou devis contesté', 'R-2026-125': 'Panne qui revient après réparation', 'R-2026-126': 'Panne qui revient après réparation',
    'R-2026-127': 'Garantie ou devis contesté', 'R-2026-128': 'Panne qui revient après réparation', 'R-2026-129': 'Délai dépassé ou client sans nouvelles',
    'R-2026-112': 'Panne qui revient après réparation', 'R-2026-109': 'Délai dépassé ou client sans nouvelles', 'R-2026-104': 'Panne qui revient après réparation',
    'R-2026-098': 'Erreur de livraison ou de référence' };
  RECL.forEach(function (r) { r.cause = CAUSE[r.n]; });
  var RESP = { 'SACRI': 'Responsable après-vente SACRI', 'PST-CI': 'Responsable atelier PST-CI', 'Trans-Roulements': 'Responsable magasin Trans-Roulements', 'SAFIR': 'Responsable atelier SAFIR', 'DEFI': 'Responsable chantiers DEFI' };
  window.SACRI_SUIVI = { reclamations: RECL, machines: MACH };

  // ---------- outils ----------
  function $(id) { return document.getElementById(id); }
  function ico(k, c) { return window.ico(k, c); }
  function hcol(n) { var h = 0; n = String(n || ''); for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0; return 'c' + (h % 6); }
  function initials(n) { var p = String(n || '').replace(/^(M\.|Mme|Mlle)\s+/, '').trim().split(/\s+/); return esc(((p[0] || '')[0] || '') + ((p[1] || '')[0] || '')).toUpperCase(); }
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
  function kc(o) { return '<div class="kc' + (o.cls ? ' ' + o.cls : '') + '"><p class="l">' + ico(o.ic) + o.l + '</p><div class="vr"><p class="v">' + o.v + (o.u ? '<small>' + o.u + '</small>' : '') + '</p>' + (o.sp || '') + '</div><p class="s">' + o.s + '</p></div>'; }
  function spark(vals, color) {
    var w = 96, h = 38, p = 3, mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
    if (mx === mn) { mx += 1; mn -= 1; }
    var pts = vals.map(function (v, i) { return [p + i * (w - 2 * p) / (vals.length - 1), h - p - (v - mn) / (mx - mn) * (h - 2 * p)]; });
    var d = pts.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
    var a = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + h + ' L' + pts[0][0].toFixed(1) + ' ' + h + ' Z';
    var l = pts[pts.length - 1], gid = 'h' + Math.random().toString(36).slice(2, 7);
    return '<svg class="sp" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".18"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs><path d="' + a + '" fill="url(#' + gid + ')"/><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="' + l[0].toFixed(1) + '" cy="' + l[1].toFixed(1) + '" r="2.6" fill="' + color + '"/></svg>';
  }
  function delta(cur, prev, upGood, lbl, fmt) {
    if (prev == null || cur == null) return '';
    var df = cur - prev;
    if (Math.abs(df) < 1e-9) return '<span class="dl nt">= stable</span><span>' + lbl + '</span>';
    var good = upGood == null ? null : (df > 0) === upGood;
    return '<span class="dl ' + (good == null ? 'nt' : good ? 'up' : 'dn') + '">' + (df > 0 ? '\u25b2 ' : '\u25bc ') + (fmt ? fmt(Math.abs(df)) : n0(Math.abs(df))) + '</span><span>' + lbl + '</span>';
  }
  // jours du 6 au 19 novembre, pour les courbes
  function jours14() { var out = [], e = dt(REF.slice(0, 10)); for (var i = 13; i >= 0; i--) out.push(new Date(e.getTime() - i * 864e5)); return out; }
  function finJour(d) { return new Date(d.getTime() + 864e5 - 1).toISOString ? new Date(d.getTime() + 864e5 - 60000) : d; }
  function etatAt(r, t) {
    if (dt(r.recue) > t) return null;
    if (r.fin && dt(r.fin) <= t) return 'close';
    if (!(r.rep && dt(r.rep) <= t)) return (t - dt(r.recue)) / 36e5 > 48 ? 'rouge' : 'attente';
    return 'cours';
  }
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
  function reclS() { return RECL.filter(function (r) { return SOC === 'Groupe' || r.soc === SOC; }); }
  function recl() {
    var F = window.SF || { per: 'tout', canal: 'tous', statut: 'tous' }, t0 = window.SG ? window.SG.since(REF) : -Infinity;
    return reclS().filter(function (r) {
      if (dt(r.recue).getTime() < t0) return false;
      if (F.canal !== 'tous' && r.canal !== F.canal) return false;
      var e = etat(r);
      if (F.statut === 'atraiter' && (e === 'close' || e === 'cours')) return false;
      if (F.statut === 'retard' && e !== 'rouge') return false;
      if (F.statut === 'traites' && e !== 'close') return false;
      return true;
    });
  }
  function ouvertes(list) { return list.filter(function (r) { return !r.fin; }); }

  function renderRecl() {
    var all = recl(), op = ouvertes(all), red = op.filter(function (r) { return etat(r) === 'rouge'; }), wait = op.filter(function (r) { return etat(r) === 'attente'; });
    var opAll = ouvertes(RECL);
    $('rc-lede').innerHTML = '<b>' + pl(op.length, 'réclamation ouverte', 'réclamations ouvertes') + '</b>' + (SOC === 'Groupe' ? ' dans le groupe' : ' chez ' + esc(SOC)) +
      (red.length ? ', dont <span class="r">' + pl(red.length, 'sans réponse depuis plus de 48 h', 'sans réponse depuis plus de 48 h') + '</span>' : ', aucune sans réponse au-delà de 48 h') +
      '. Chaque nouvelle réclamation prévient la direction ; au-delà de 48 h sans réponse, elle passe en rouge et l\'alerte est prête à partir.';
    var rep = all.filter(function (r) { return r.rep; }), mrep = median(rep.map(function (r) { return hours(r.recue, r.rep); }));
    var J = jours14(), base = reclS().filter(function (r) { return (!window.SF || window.SF.canal === 'tous' || r.canal === window.SF.canal); });
    var sOp = J.map(function (j) { var t = finJour(j); return base.filter(function (r) { var e = etatAt(r, t); return e && e !== 'close'; }).length; });
    var sRed = J.map(function (j) { var t = finJour(j); return base.filter(function (r) { return etatAt(r, t) === 'rouge'; }).length; });
    var sW = J.map(function (j) { var t = finJour(j); return base.filter(function (r) { return etatAt(r, t) === 'attente'; }).length; });
    var sMed = J.map(function (j) { var t = finJour(j), v = base.filter(function (r) { return r.rep && dt(r.rep) <= t; }).map(function (r) { return hours(r.recue, r.rep); }); return v.length ? median(v) : 0; });
    var h = kc({ ic: 'flag', l: 'Réclamations ouvertes', v: n0(op.length), cls: 'key', sp: spark(sOp, '#E95B0F'), s: delta(sOp[13], sOp[6], false, 'en 7 jours') + '<span>' + pl(all.length, 'reçue', 'reçues') + ' ' + (window.SG ? window.SG.perLbl('depuis le 6 novembre') : 'depuis le 6 novembre') + '</span>' });
    h += kc({ ic: 'siren', l: 'Plus de 48 h sans réponse', v: red.length ? n0(red.length) : 'Aucune', cls: red.length ? 'bad' : '', sp: spark(sRed, '#EF4444'), s: red.length ? '<span>la plus ancienne : <b>' + esc(red.slice().sort(function (a, b) { return dt(a.recue) - dt(b.recue); })[0].client) + '</b>, ' + age(hours(red.slice().sort(function (a, b) { return dt(a.recue) - dt(b.recue); })[0].recue, REF)) + '</span>' : 'toutes ont une réponse dans les 48 h' });
    h += kc({ ic: 'hourglass', l: 'Sans réponse, moins de 48 h', v: wait.length ? n0(wait.length) : 'Aucune', sp: spark(sW, '#F59E0B'), s: wait.length ? 'à traiter avant de passer en rouge' : 'rien en attente' });
    h += kc({ ic: 'timer', l: 'Première réponse, délai médian', v: mrep == null ? 'Aucune' : mrep < 24 ? n1(mrep).replace(/,0$/, '') : n1(mrep / 24).replace(/,0$/, ''), u: mrep == null ? '' : mrep < 24 ? 'h' : 'j', sp: spark(sMed, '#0EA5E9'), s: 'sur ' + pl(rep.length, 'réclamation répondue', 'réclamations répondues') });
    $('rc-kpis').innerHTML = h;
    rcGraphs(all, op, red);
    renderEsc(all);
    renderFrise();

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
    var G = window.SG, AC = { rouge: '#EF4444', attente: '#F59E0B', cours: '#0EA5E9', close: '#10B981' };
    G.table('rc-rows', [
      { k: 'client', l: 'Client et réclamation', fmt: function (r) { return '<div class="tc-cl"><span class="av ' + hcol(r.client) + '">' + initials(r.client) + '</span><span><b>' + esc(r.client) + '</b><small>' + esc(r.quoi) + '</small><span class="soc">' + esc(r.soc) + '</span></span></div>'; } },
      { k: 'machine', l: 'Machine', fmt: function (r) { return '<span class="tc-m">' + esc(r.machine) + '</span>' + (r.serie ? '<button class="sl" data-s="' + esc(r.serie) + '">N° ' + esc(r.serie) + ico('arrow-up-right') + '</button>' : '<small class="mt">sans numéro de série</small>'); } },
      { k: 'recue', l: 'Reçue le', sort: function (r) { return dt(r.recue).getTime(); }, fmt: function (r) { return '<b>' + dd(r.recue) + ' à ' + hh(r.recue) + '</b><small class="mt ch-ic">' + ico({ 'WhatsApp': 'message-circle', 'E-mail': 'mail', 'Téléphone': 'phone', 'Comptoir': 'store' }[r.canal]) + esc(r.canal) + '</small>'; } },
      { k: 'age', l: 'Délai depuis réception', num: true, sort: function (r) { return hours(r.recue, r.fin || REF); }, fmt: function (r) {
        var e = etat(r), hA = hours(r.recue, r.fin || REF);
        var sub = e === 'close' ? 'résolue' : e === 'cours' ? 'répondue en ' + age(hours(r.recue, r.rep)) : 'sans réponse';
        return G.cellBar(Math.min(hA, 96), 96, AC[e], '<b class="' + (e === 'rouge' ? 'red' : '') + '">' + age(hA) + '</b>') + '<small class="mt">' + sub + '</small>'; } },
      { k: 'etat', l: 'Statut', sort: function (r) { return rank[etat(r)]; }, fmt: function (r) { return pill(r) + escLine(r); } },
      { k: 'act', l: 'Action', sort: function (r) { return rank[etat(r)]; }, fmt: function (r) { var e = etat(r); return e !== 'close' ? '<button class="bt al' + (e === 'rouge' ? ' pri' : '') + '" data-n="' + r.n + '">' + ico('siren') + 'Alerte direction</button>' : '<button class="bt al" data-n="' + r.n + '">' + ico('file-text') + 'Détail</button>'; } }
    ], L, { sortKey: 'etat', dir: 1, ph: 'Rechercher un client, une machine, un n° de série', empty: 'Aucune réclamation dans ce filtre' + (SOC === 'Groupe' ? '' : ' pour ' + esc(SOC)) + '.',
      text: function (r) { return [r.client, r.quoi, r.machine, r.serie, r.soc, r.canal, r.n].join(' '); }, rowAttr: function (r) { return 'class="rt-' + etat(r) + '"'; },
      bind: function (box) {
        box.querySelectorAll('.al').forEach(function (b) { b.addEventListener('click', function () { alerte([RECL.filter(function (r) { return r.n === b.getAttribute('data-n'); })[0]]); }); });
        box.querySelectorAll('.sl').forEach(function (b) { b.addEventListener('click', function () { openFiche(b.getAttribute('data-s')); }); });
      } });
  }

  // ---------- graphes des réclamations ----------
  var CAUSEC = { 'Panne qui revient après réparation': '#E95B0F', 'Délai dépassé ou client sans nouvelles': '#0EA5E9', 'Garantie ou devis contesté': '#8B5CF6', 'Erreur de livraison ou de référence': '#F59E0B', 'Défaut de pose sur chantier': '#10B981' };
  var SEM = [['2026-11-02', 'Sem. du 2 nov.'], ['2026-11-09', 'Sem. du 9 nov.'], ['2026-11-16', 'Sem. du 16 nov.']];
  function rcGraphs(all, op, red) {
    var G = window.SG, box = $('rc-graphs');
    if (!G) return;
    if (!all.length) { box.innerHTML = '<div class="nodata card">Aucune réclamation pour ces filtres.</div>'; return; }
    var socs = SOCS.filter(function (k) { return all.some(function (r) { return r.soc === k; }); });
    var cz = {}; all.forEach(function (r) { cz[r.cause] = (cz[r.cause] || 0) + 1; });
    var cks = Object.keys(cz).sort(function (a, b) { return cz[b] - cz[a]; });
    var ech = all.filter(function (r) { return r.rep || hours(r.recue, REF) > 48; }), s48 = ech.filter(function (r) { return r.rep && hours(r.recue, r.rep) <= 48; }).length;
    var p48 = ech.length ? Math.round(s48 / ech.length * 100) : null;
    var chrono = all.slice().sort(function (a, b) { return dt(a.recue) - dt(b.recue); });
    box.innerHTML = G.card('ch-rc-sem', 'Réclamations reçues par semaine', 'par société', 230, { head: G.legend(socs.map(function (k) { return [k, G.SOCC[k]]; })) }, 'w2') +
      G.card('ch-rc-cause', 'Causes des réclamations', pl(all.length, 'réclamation'), 230, { center: '<b>' + n0(all.length) + '</b><span>réclamations</span>', foot: G.legend(cks.map(function (k) { return [k, CAUSEC[k] || '#64748B', n0(cz[k])]; })) }) +
      G.card('ch-rc-g48', 'Réponse en moins de 48 h', ech.length ? 'sur ' + pl(ech.length, 'réclamation échue', 'réclamations échues') : 'aucune réclamation échue', 150, { center: '<b>' + (p48 == null ? '–' : n0(p48) + '\u00a0%') + '</b><span>' + n0(s48) + ' sur ' + n0(ech.length) + '</span>', foot: '<p class="gc-f">' + (red.length ? '<span class="r">' + pl(red.length, 'réclamation', 'réclamations') + ' au-delà de 48 h</span>' : 'aucune au-delà de 48 h') + (all.length - ech.length ? ' ; ' + n0(all.length - ech.length) + ' encore dans le délai' : '') + '</p>' }, 'gauge') +
      G.card('ch-rc-delai', 'Délai de première réponse, réclamation par réclamation', 'en heures ; en rouge, sans réponse à ce jour', 220, { head: G.legend([['Répondue', '#0EA5E9'], ['Sans réponse', '#EF4444'], ['Seuil 48 h', '#94A3B8']]) }, 'w2') +
      G.card('ch-rc-soc', 'Par société', 'ouvertes et résolues', 220, { head: G.legend([['Plus de 48 h', '#EF4444'], ['Ouvertes', '#E95B0F'], ['Résolues', '#10B981']]) }, 'w2');
    G.mk('ch-rc-sem', { type: 'bar', data: { labels: SEM.map(function (w) { return w[1]; }), datasets: socs.map(function (k) { return { label: k, data: SEM.map(function (w, i) { var a = dt(w[0]), b = new Date(a.getTime() + 7 * 864e5); return all.filter(function (r) { return r.soc === k && dt(r.recue) >= a && dt(r.recue) < b; }).length; }), backgroundColor: G.SOCC[k], stack: 's', maxBarThickness: 64 }; }) },
      options: { interaction: { mode: 'index', intersect: false }, scales: { x: G.ax({ stacked: true }), y: G.ay({ stacked: true }) }, plugins: { tooltip: { filter: function (i) { return i.parsed.y > 0; }, callbacks: { footer: function (c) { return 'Total : ' + c.reduce(function (s, x) { return s + x.parsed.y; }, 0); } } } } } });
    G.donut('ch-rc-cause', cks, cks.map(function (k) { return cz[k]; }), cks.map(function (k) { return CAUSEC[k] || '#64748B'; }), 'réclamations');
    G.gauge('ch-rc-g48', s48, ech.length || 1, p48 == null ? '#CBD5E1' : p48 >= 90 ? '#10B981' : p48 >= 70 ? '#F59E0B' : '#EF4444');
    var vals = chrono.map(function (r) { return +(r.rep ? hours(r.recue, r.rep) : hours(r.recue, r.fin || REF)).toFixed(1); });
    G.mk('ch-rc-delai', { type: 'line', data: { labels: chrono.map(function (r) { return dd(r.recue); }), datasets: [
      { label: 'Première réponse', data: vals, borderColor: '#0EA5E9', backgroundColor: 'rgba(14,165,233,.08)', fill: true, borderWidth: 2, pointRadius: 4, pointBackgroundColor: chrono.map(function (r) { return r.rep ? '#0EA5E9' : '#EF4444'; }), pointBorderColor: '#fff', pointBorderWidth: 1.5 },
      { label: 'Seuil 48 h', data: chrono.map(function () { return 48; }), borderColor: '#94A3B8', borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0, fill: false }] },
      options: { interaction: { mode: 'index', intersect: false }, scales: { x: G.ax({ ticks: { color: '#94A3B8', autoSkip: true, maxTicksLimit: 9, maxRotation: 0 } }), y: G.ay({ ticks: { color: '#94A3B8', maxTicksLimit: 5, callback: function (v) { return v + ' h'; } } }) },
        plugins: { tooltip: { filter: function (i) { return i.datasetIndex === 0; }, callbacks: { title: function (c) { var r = chrono[c[0].dataIndex]; return r.client + ' (' + r.soc + ')'; }, label: function (c) { var r = chrono[c.dataIndex]; return r.rep ? ' Première réponse en ' + age(hours(r.recue, r.rep)) : ' Sans réponse depuis ' + age(hours(r.recue, REF)); } } } } } });
    var sr = socs.map(function (k) { var l = all.filter(function (r) { return r.soc === k; }); return [l.filter(function (r) { return etat(r) === 'rouge'; }).length, l.filter(function (r) { var e = etat(r); return e === 'attente' || e === 'cours'; }).length, l.filter(function (r) { return etat(r) === 'close'; }).length]; });
    G.mk('ch-rc-soc', { type: 'bar', data: { labels: socs, datasets: [['Plus de 48 h', '#EF4444', 0], ['Ouvertes', '#E95B0F', 1], ['Résolues', '#10B981', 2]].map(function (d) { return { label: d[0], data: sr.map(function (x) { return x[d[2]]; }), backgroundColor: d[1], stack: 's', maxBarThickness: 18 }; }) },
      options: { indexAxis: 'y', interaction: { mode: 'index', intersect: false }, scales: { x: G.ay({ stacked: true }), y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: '#334155', autoSkip: false, font: { size: 11.5 } } } }, plugins: { tooltip: { filter: function (i) { return i.parsed.x > 0; } } },
        onClick: function (e, el) { if (el && el.length) window.SacriSetSoc(socs[el[0].index]); } } });
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
      ['rt-kpis', 'rt-rec', 'rt-med-m', 'rt-med-s', 'rt-top', 'rt-graphs', 'rt-table'].forEach(function (id) { $(id).innerHTML = ''; });
      $('rt-body').hidden = true; $('rt-none').hidden = false;
      $('rt-none').innerHTML = '<div class="nodata">Aucune machine suivie pour ' + esc(SOC) + '. Choisissez SACRI, PST-CI, SAFIR ou toutes les sociétés.</div>';
      renderSearch(); return;
    }
    $('rt-body').hidden = false; $('rt-none').hidden = true;
    $('rt-lede').innerHTML = 'Aucune machine n\'entre à l\'atelier sans son numéro de série : chaque retour se rattache à la vente. <b>' + pl(M.length, 'machine vendue', 'machines vendues') + '</b> suivies' + (SOC === 'Groupe' ? '' : ' chez ' + esc(SOC)) + ', <b>' + pl(back.length, 'revenue', 'revenues') + '</b> au moins une fois, dont <span class="r">' + n0(rec.length) + ' deux fois ou plus</span>.';
    var MOx = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
    function cumAt(mo, f) { return M.filter(function (m) { return f(m.ret.filter(function (r) { return r.d.slice(0, 7) <= mo; }).length, m, mo); }).length; }
    var sV = MOx.map(function (mo) { return M.filter(function (m) { return m.vente.slice(0, 7) <= mo; }).length; });
    var sB = MOx.map(function (mo) { return cumAt(mo, function (n) { return n >= 1; }); }), sR = MOx.map(function (mo) { return cumAt(mo, function (n) { return n >= 2; }); });
    var h = kc({ ic: 'package', l: 'Machines suivies', v: n0(M.length), sp: spark(sV, '#64748B'), s: delta(sV[7], sV[6], null, 'depuis octobre') + '<span>par numéro de série</span>' });
    h += kc({ ic: 'rotate-ccw', l: 'Revenues à l\'atelier', v: n0(back.length), cls: 'key', sp: spark(sB, '#E95B0F'), s: delta(sB[7], sB[6], false, 'depuis octobre') + '<span>' + pl(nret, 'passage', 'passages') + ' au total</span>' });
    h += kc({ ic: 'triangle-alert', l: 'Revenues 2 fois ou plus', v: rec.length ? n0(rec.length) : 'Aucune', cls: rec.length ? 'bad' : '', sp: spark(sR, '#EF4444'), s: rec.length ? 'à examiner : panne répétée ou usage' : 'aucune machine récidiviste' });
    h += kc({ ic: 'calendar-clock', l: 'Vente au premier retour, médiane', v: med == null ? 'Aucun' : n0(med), u: med == null ? '' : 'j', s: med == null ? 'aucun retour' : 'soit ' + mois(med) + ' après la vente' });
    $('rt-kpis').innerHTML = h;

    // machines revenues 2 fois ou plus
    var rs = rec.slice().sort(function (a, b) { return (b.ret.length - a.ret.length) || (first(a) - first(b)); });
    rtGraphs(M, back, rec);
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
  function rtGraphs(M, back, rec) {
    var G = window.SG; if (!G) return;
    var MO = ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
    var ML = MO.map(function (m) { return MC[+m.slice(5) - 1].replace('.', ''); });
    var gm = {}; M.forEach(function (m) { var x = gm[m.modele] = gm[m.modele] || { k: m.modele, mat: m.mat, n: 0, vals: MO.map(function () { return 0; }) }; x.n++; m.ret.forEach(function (r) { var i = MO.indexOf(r.d.slice(0, 7)); if (i >= 0) x.vals[i]++; }); });
    var rows = Object.keys(gm).map(function (k) { return gm[k]; }).filter(function (x) { return x.vals.some(function (v) { return v; }); }).sort(function (a, b) { return b.vals.reduce(function (s, v) { return s + v; }, 0) - a.vals.reduce(function (s, v) { return s + v; }, 0); });
    var nret = M.reduce(function (s, m) { return s + m.ret.length; }, 0);
    var mats = {}; M.forEach(function (m) { m.ret.forEach(function () { mats[m.mat] = (mats[m.mat] || 0) + 1; }); });
    var mk = Object.keys(mats).sort(function (a, b) { return mats[b] - mats[a]; });
    var BK = [['moins de 3 mois', 0, 91], ['3 à 6 mois', 91, 183], ['6 à 9 mois', 183, 274], ['9 mois et plus', 274, 1e9]];
    var bk = BK.map(function (b) { return back.filter(function (m) { var f = first(m); return f >= b[1] && f < b[2]; }).length; });
    var parM = MO.map(function (mo) { return M.reduce(function (s, m) { return s + m.ret.filter(function (r) { return r.d.slice(0, 7) === mo; }).length; }, 0); });
    var cum = []; parM.reduce(function (a, v, i) { cum[i] = a + v; return a + v; }, 0);
    var pr = M.length ? Math.round(back.length / M.length * 100) : 0;
    $('rt-graphs').innerHTML = '<div class="gc card w3"><div class="gc-h"><div><p class="gc-t">Carte de chaleur des retours par modèle</p><p class="gc-s">passages à l\'atelier par mois, de février à novembre 2026 ; survolez une case</p></div></div>' + G.heat(rows.map(function (r) { return { k: r.k, sub: pl(r.n, 'machine vendue', 'machines vendues'), vals: r.vals }; }), ML, { unit: 'retour(s)' }) + '</div>' +
      G.card('ch-rt-mois', 'Retours par mois', 'passages à l\'atelier et cumul', 220, { head: G.legend([['Retours du mois', '#E95B0F'], ['Cumul', '#0EA5E9']]) }, 'w2') +
      G.card('ch-rt-mat', 'Retours par matériel', pl(nret, 'passage'), 220, { center: '<b>' + n0(nret) + '</b><span>passages</span>', foot: G.legend(mk.map(function (k, i) { return [k, G.PAL[i % 6], n0(mats[k])]; })) }) +
      G.card('ch-rt-g', 'Machines revenues', 'sur ' + pl(M.length, 'machine suivie', 'machines suivies'), 150, { center: '<b>' + n0(pr) + '\u00a0%</b><span>' + n0(back.length) + ' sur ' + n0(M.length) + '</span>', foot: '<p class="gc-f"><span class="r">' + pl(rec.length, 'machine', 'machines') + ' 2 fois ou plus</span></p>' }, 'gauge') +
      G.card('ch-rt-bk', 'Délai entre la vente et le premier retour', pl(back.length, 'machine revenue', 'machines revenues'), 200, null, 'w2') +
      G.card('ch-rt-soc', 'Machines suivies par société', 'revenues ou non', 200, { head: G.legend([['2 fois ou plus', '#EF4444'], ['1 fois', '#F59E0B'], ['Jamais', '#CBD5E1']]) }, 'w2');
    G.mk('ch-rt-mois', { type: 'bar', data: { labels: ML, datasets: [{ type: 'bar', label: 'Retours du mois', data: parM, backgroundColor: '#E95B0F', maxBarThickness: 30, yAxisID: 'y' }, { type: 'line', label: 'Cumul', data: cum, borderColor: '#0EA5E9', borderWidth: 2, pointRadius: 2.5, yAxisID: 'y2' }] },
      options: { interaction: { mode: 'index', intersect: false }, scales: { x: G.ax(), y: G.ay(), y2: G.ay({ position: 'right', grid: { display: false } }) } } });
    G.donut('ch-rt-mat', mk, mk.map(function (k) { return mats[k]; }), mk.map(function (k, i) { return G.PAL[i % 6]; }), 'passages');
    G.gauge('ch-rt-g', back.length, M.length || 1, '#F59E0B');
    G.mk('ch-rt-bk', { type: 'bar', data: { labels: BK.map(function (b) { return b[0]; }), datasets: [{ label: 'Machines', data: bk, backgroundColor: ['#EF4444', '#F59E0B', '#0EA5E9', '#10B981'], maxBarThickness: 56 }] }, options: { scales: { x: G.ax(), y: G.ay() } } });
    var ss = SOCS.filter(function (k) { return M.some(function (m) { return m.soc === k; }); });
    G.mk('ch-rt-soc', { type: 'bar', data: { labels: ss, datasets: [['2 fois ou plus', '#EF4444', function (m) { return m.ret.length >= 2; }], ['1 fois', '#F59E0B', function (m) { return m.ret.length === 1; }], ['Jamais', '#CBD5E1', function (m) { return !m.ret.length; }]].map(function (d) { return { label: d[0], data: ss.map(function (k) { return M.filter(function (m) { return m.soc === k && d[2](m); }).length; }), backgroundColor: d[1], stack: 's', maxBarThickness: 18 }; }) },
      options: { indexAxis: 'y', interaction: { mode: 'index', intersect: false }, scales: { x: G.ay({ stacked: true }), y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: '#334155' } } }, plugins: { tooltip: { filter: function (i) { return i.parsed.x > 0; } } } } });
    var mxr = Math.max.apply(null, M.map(function (m) { return m.ret.length; }).concat([1]));
    G.table('rt-table', [
      { k: 'serie', l: 'N° de série', fmt: function (m) { return '<b>' + esc(m.serie) + '</b>'; } },
      { k: 'modele', l: 'Machine', fmt: function (m) { return '<div class="tc-cl">' + thumb(m, 'sm') + '<span><b>' + esc(m.modele) + '</b><small>' + esc(m.mat) + '</small><span class="soc">' + esc(m.soc) + '</span></span></div>'; } },
      { k: 'client', l: 'Client', fmt: function (m) { return esc(m.client); } },
      { k: 'vente', l: 'Vendue le', sort: function (m) { return m.vente; }, fmt: function (m) { return dlong(m.vente); } },
      { k: 'nret', l: 'Retours', num: true, sort: function (m) { return m.ret.length; }, fmt: function (m) { return G.cellBar(m.ret.length, mxr, m.ret.length >= 2 ? '#EF4444' : m.ret.length ? '#F59E0B' : '#CBD5E1', '<b>' + n0(m.ret.length) + '</b>'); } },
      { k: 'first', l: '1er retour', num: true, sort: function (m) { return m.ret.length ? first(m) : 1e9; }, fmt: function (m) { return m.ret.length ? n0(first(m)) + ' j' : '<small class="mt">pas revenue</small>'; } }
    ], M, { sortKey: 'nret', dir: -1, ph: 'Rechercher un n° de série, un modèle, un client', text: function (m) { return [m.serie, m.modele, m.client, m.soc, m.mat].join(' '); }, rowAttr: function (m) { return 'data-s="' + esc(m.serie) + '" class="clk"'; },
      bind: function (box) { box.querySelectorAll('tr.clk').forEach(function (tr) { tr.addEventListener('click', function () { openFiche(tr.getAttribute('data-s')); }); }); } });
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


  // ---------- escalade automatique ----------
  // Niveau 1 : alerte à la direction dès la réception. Niveau 2 : 24 h sans réponse au client. Niveau 3 : 48 h sans réponse.
  function sansRep(r) { return hours(r.recue, r.rep || r.fin || REF); }
  function niv(r) { var h = sansRep(r); return h > 48 ? 3 : h > 24 ? 2 : 1; }
  function escLine(r) {
    var n = niv(r), t = ['direction alertée', '+ responsable ' + r.soc, '+ directeur général'];
    return '<p class="esc-l n' + n + '">' + ico('bell') + t.slice(0, n).join(' ') + '</p>';
  }
  function renderEsc(all) {
    var n2 = all.filter(function (r) { return niv(r) >= 2; }).length, n3 = all.filter(function (r) { return niv(r) >= 3; }).length;
    var R = [
      ['Dès la réception', 'Alerte à la direction', 'Toute réclamation, quel que soit le canal, part tout de suite à la direction : client, machine, retours précédents, responsable prévenu, heure du rappel prévu.', 'Directeur général', pl(all.length, 'réclamation alertée', 'réclamations alertées') + ' depuis le 6 novembre', 'zap', ''],
      ['24 h sans réponse au client', 'Nouvelle alerte au responsable de la société', 'Si le client n\'a reçu aucune réponse 24 h après sa réclamation, le responsable de la société concernée est relancé, avec ce qui a déjà été fait.', 'Responsable de la société', n2 ? pl(n2, 'réclamation concernée', 'réclamations concernées') : 'aucune réclamation concernée', 'hourglass', n2 ? 'w' : ''],
      ['48 h sans réponse au client', 'Alerte au directeur général', 'Au bout de 48 h sans réponse, la réclamation passe en rouge et le directeur général reçoit une alerte nominative.', 'Directeur général', n3 ? pl(n3, 'réclamation en rouge', 'réclamations en rouge') : 'aucune réclamation en rouge', 'siren', n3 ? 'r' : '']
    ];
    $('rc-esc').innerHTML = R.map(function (x, i) {
      return '<div class="es card"><div class="es-h"><span class="es-n">' + (i + 1) + '</span><span class="es-w">' + ico(x[5]) + x[0] + '</span><span class="sw" role="switch" aria-checked="true" aria-label="Règle activée"><i></i>Activée</span></div>' +
        '<h3>' + x[1] + '</h3><p class="es-p">' + x[2] + '</p>' +
        '<dl class="es-d"><dt>À</dt><dd>' + x[3] + '</dd><dt>Par</dt><dd><span class="ch">' + ico('message-circle') + 'WhatsApp</span><span class="ch">' + ico('mail') + 'E-mail</span></dd></dl>' +
        '<p class="es-c ' + x[6] + '">' + x[4] + '</p></div>';
    }).join('');
  }
  function renderFrise() {
    var r = RECL.filter(function (x) { return x.frise; })[0];
    if (!r) { $('rc-frise').innerHTML = ''; return; }
    var t0 = r.frise[0][0];
    function apres(d) { var h = hours(t0, d); return h === 0 ? 'à la réception' : '+ ' + age(h); }
    $('rc-frise').innerHTML = '<div class="fr-h"><div><p class="fr-t">' + esc(r.n) + ', ' + esc(r.client) + '</p><p class="fr-s">' + esc(r.machine) + ', n° de série ' + esc(r.serie) + ' : ' + esc(r.quoi.toLowerCase()) + '</p></div>' + pill(r) + '</div>' +
      '<ol class="fr">' + r.frise.map(function (e) {
        return '<li class="' + e[4] + '"><span class="fr-d"></span><p class="fr-k">' + esc(e[1]) + '</p><p class="fr-m">' + dd(e[0]) + ' à ' + hh(e[0]) + '<span>' + apres(e[0]) + '</span></p><p class="fr-x">' + esc(e[2]) + '</p><p class="fr-w">' + esc(e[3]) + '</p></li>';
      }).join('') + '</ol>' +
      '<p class="fr-n">' + ico('check') + 'Client rappelé en ' + age(hours(r.recue, r.rep)) + ' : les alertes des 24 h et des 48 h ne sont pas parties. <button class="sl" data-s="' + esc(r.serie) + '">Voir la fiche machine ' + ico('arrow-up-right') + '</button></p>';
    $('rc-frise').querySelectorAll('.sl').forEach(function (b) { b.addEventListener('click', function () { openFiche(b.getAttribute('data-s')); }); });
  }

  // ---------- rapport du lundi ----------
  function renderRap() {
    var all = RECL, op = ouvertes(all), red = op.filter(function (r) { return etat(r) === 'rouge'; });
    var repd = all.filter(function (r) { return r.rep; }).map(function (r) { return hours(r.recue, r.rep); });
    var moy = repd.reduce(function (a, b) { return a + b; }, 0) / repd.length, med = median(repd);
    function hfmt(x) { return x == null ? 'aucune réponse' : x < 1 ? n0(Math.round(x * 60)) + ' min' : n1(x).replace(/,0$/, '') + ' h'; }
    var socs = SOCS.map(function (k) {
      var l = all.filter(function (r) { return r.soc === k; }), o = ouvertes(l), d = l.filter(function (r) { return r.rep; }).map(function (r) { return hours(r.recue, r.rep); });
      return { k: k, n: l.length, o: o.length, r: o.filter(function (r) { return etat(r) === 'rouge'; }).length, m: d.length ? d.reduce(function (a, b) { return a + b; }, 0) / d.length : null, sr: l.filter(function (r) { return !r.rep; }).length };
    }).sort(function (a, b) { return b.n - a.n; });
    var risk = red.slice().sort(function (a, b) { return dt(a.recue) - dt(b.recue); }).slice(0, 3);
    var rec = MACH.filter(function (m) { return m.ret.length >= 2; }).sort(function (a, b) { return (b.ret.length - a.ret.length) || (dt(b.ret[b.ret.length - 1].d) - dt(a.ret[a.ret.length - 1].d)); });
    var back = MACH.filter(function (m) { return m.ret.length; }), medv = median(back.map(first));
    var cz = {}; all.forEach(function (r) { cz[r.cause] = (cz[r.cause] || 0) + 1; });
    var causes = Object.keys(cz).map(function (k) { return [k, cz[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
    var ms661 = MACH.filter(function (m) { return m.modele === 'STIHL MS 661'; }), ms661r = ms661.filter(function (m) { return m.ret.length >= 2; });
    var ech = RECL.filter(function (r) { return r.n === 'R-2026-118'; })[0];
    var c31 = MACH.filter(function (m) { return m.serie === 'C-31 0285'; })[0];
    var DEC = [
      [pl(red.length, 'réclamation', 'réclamations') + ' sans réponse depuis plus de 48 h : un responsable nommé pour chacune et le client rappelé aujourd\'hui.', 'Directeur général, avec les responsables des sociétés'],
      ['Demande d\'échange de la tronçonneuse ' + ech.machine + ' n° ' + ech.serie + ' (' + ech.client + ', 3e retour) : accepter l\'échange ou proposer une autre solution, et le dire au client.', 'Responsable après-vente SACRI'],
      [ms661r.length + ' tronçonneuses ' + ms661[0].modele + ' sur ' + ms661.length + ' vendues sont revenues 2 fois ou plus : faire analyser la cause (usage, pièce ou réglage) par le chef d\'atelier.', 'Chef d\'atelier SACRI'],
      ['Compresseur n° ' + c31.serie + ' (' + c31.client + ') revenu ' + c31.ret.length + ' fois, 2 fois pour surchauffe : diagnostic complet avant toute nouvelle réparation.', 'Responsable atelier PST-CI']
    ];
    var cmax = causes[0][1];
    var ech = all.filter(function (r) { return r.rep || hours(r.recue, REF) > 48; }), s48 = ech.filter(function (r) { return r.rep && hours(r.recue, r.rep) <= 48; }).length, p48 = ech.length ? Math.round(s48 / ech.length * 100) : 0;
    $('rap').innerHTML =
      '<header class="rp-h"><img src="assets/logo-sacri.png" alt="SACRI"><div><p class="rp-k">Service client et après-vente, groupe SACRI</p><h2>Rapport des réclamations de la semaine</h2><p class="rp-s">Pour la réunion du lundi matin. Réclamations reçues du 6 au 19 novembre 2026, situation au ' + jour(REF) + ' 2026 à ' + hh(REF) + '.</p></div></header>' +
      '<p class="rp-demo">Données de démonstration : clients, machines et numéros fictifs.</p>' +
      '<div class="rp-k4">' +
        '<div><b>' + n0(all.length) + '</b><span>réclamations reçues</span></div>' +
        '<div><b>' + n0(op.length) + '</b><span>encore ouvertes</span></div>' +
        '<div class="r"><b>' + n0(red.length) + '</b><span>sans réponse depuis plus de 48 h</span></div>' +
        '<div><b>' + hfmt(moy) + '</b><span>délai moyen de première réponse (médiane ' + hfmt(med) + ', sur ' + n0(repd.length) + ' répondues)</span></div>' +
      '</div>' +
      '<div class="rp-gr"><div class="rp-ch w2"><h3>Réclamations reçues par semaine et par société</h3><div class="rp-cv" style="height:190px"><canvas id="rp-ch-sem"></canvas></div></div>' +
        '<div class="rp-ch"><h3>Causes</h3><div class="rp-cv dn" style="height:190px"><canvas id="rp-ch-cause"></canvas><div class="gc-c"><b>' + n0(all.length) + '</b><span>reçues</span></div></div></div>' +
        '<div class="rp-ch"><h3>Réponse en moins de 48 h</h3><div class="rp-cv dn" style="height:120px"><canvas id="rp-ch-g"></canvas><div class="gc-c g"><b>' + n0(p48) + '\u00a0%</b><span>' + n0(s48) + ' sur ' + n0(ech.length) + '</span></div></div><p class="rp-gn">' + pl(red.length, 'réclamation', 'réclamations') + ' au-delà de 48 h</p></div></div>' +
      '<div class="rp-g">' +
        '<section><h3>Par société</h3><table class="rp-t"><thead><tr><th>Société</th><th>Reçues</th><th>Ouvertes</th><th>+ de 48 h</th><th>Délai moyen de réponse</th></tr></thead><tbody>' +
          socs.map(function (x) { return '<tr><td>' + esc(x.k) + '</td><td>' + n0(x.n) + '</td><td>' + n0(x.o) + '</td><td class="' + (x.r ? 'r' : '') + '">' + n0(x.r) + '</td><td>' + (x.m == null ? '<span class="r">aucune réponse</span>' : hfmt(x.m) + (x.sr ? ' <small>(' + n0(x.sr) + ' sans réponse)</small>' : '')) + '</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<h3>Causes principales</h3><div class="rp-c">' + causes.map(function (c) { return '<p><span>' + esc(c[0]) + '</span><i><em style="width:' + Math.round(c[1] / cmax * 100) + '%"></em></i><b>' + n0(c[1]) + '</b></p>'; }).join('') + '</div></section>' +
        '<section><h3>3 réclamations à risque</h3>' + risk.map(function (r, i) {
          return '<div class="rp-r"><p class="t"><span class="n">' + (i + 1) + '</span>' + esc(r.client) + ' <small>' + esc(r.soc) + ', ' + esc(r.n) + '</small></p><p>' + esc(r.quoi) + '.</p><p class="m">Reçue le ' + dd(r.recue) + ', <b>sans réponse depuis ' + agel(hours(r.recue, REF)) + '</b>. Suivi : ' + esc(r.suivi) + '.</p></div>';
        }).join('') + '</section>' +
      '</div>' +
      '<section><h3>Machines qui reviennent <small>' + n0(MACH.length) + ' machines suivies, ' + n0(back.length) + ' revenues, dont ' + n0(rec.length) + ' 2 fois ou plus ; ' + n0(medv) + ' j en médiane de la vente au premier retour</small></h3><table class="rp-t rp-m"><thead><tr><th>N° de série</th><th>Machine</th><th>Client</th><th>Retours</th><th>Dernier motif</th></tr></thead><tbody>' +
        rec.map(function (m) { var l = m.ret[m.ret.length - 1], same = m.ret.some(function (r, i) { return m.ret.some(function (q, j) { return j !== i && q.motif === r.motif; }); }); return '<tr><td>' + esc(m.serie) + '</td><td>' + esc(m.modele) + '</td><td>' + esc(m.client) + '</td><td class="' + (m.ret.length >= 3 ? 'r' : '') + '">' + n0(m.ret.length) + '</td><td>' + esc(l.motif) + ', ' + dd(l.d) + (same ? ' <small class="r">même panne</small>' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></section>' +
      '<section><h3>Décisions à prendre</h3><ol class="rp-dec">' + DEC.map(function (d) { return '<li><p>' + esc(d[0]) + '</p><p class="q">Qui tranche : ' + esc(d[1]) + '</p></li>'; }).join('') + '</ol></section>' +
      '<p class="rp-f">SACRI, service client et après-vente. Rapport préparé automatiquement chaque lundi à 7 h et envoyé à la direction. Données de démonstration.</p>';
    var G = window.SG; if (!G) return;
    var ss = SOCS.slice();
    function img(id, ch) { if (!ch) return; var c = document.getElementById(id); var im = new Image(); im.src = ch.toBase64Image('image/png', 1); im.alt = ''; im.className = 'rp-img'; c.parentNode.replaceChild(im, c); ch.destroy(); }
    var c1 = G.mk('rp-ch-sem', { type: 'bar', data: { labels: SEM.map(function (w) { return w[1]; }), datasets: ss.map(function (k) { return { label: k, data: SEM.map(function (w) { var a = dt(w[0]), b = new Date(a.getTime() + 7 * 864e5); return all.filter(function (r) { return r.soc === k && dt(r.recue) >= a && dt(r.recue) < b; }).length; }), backgroundColor: G.SOCC[k], stack: 's', maxBarThickness: 54 }; }) },
      options: { devicePixelRatio: 3, plugins: { legend: { display: true, position: 'right', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'rectRounded', font: { size: 11 }, color: '#334155' } } }, scales: { x: G.ax({ stacked: true }), y: G.ay({ stacked: true }) } } });
    img('rp-ch-sem', c1);
    var cks = causes.map(function (c) { return c[0]; });
    img('rp-ch-cause', G.mk('rp-ch-cause', { type: 'doughnut', data: { labels: cks, datasets: [{ data: causes.map(function (c) { return c[1]; }), backgroundColor: cks.map(function (k) { return CAUSEC[k] || '#64748B'; }), borderWidth: 2, borderColor: '#fff' }] }, options: { devicePixelRatio: 3, cutout: '68%' } }));
    img('rp-ch-g', G.mk('rp-ch-g', { type: 'doughnut', data: { labels: ['', ''], datasets: [{ data: [s48, Math.max(0, ech.length - s48)], backgroundColor: [p48 >= 90 ? '#10B981' : p48 >= 70 ? '#F59E0B' : '#EF4444', '#EEF2F6'], borderWidth: 0, borderRadius: [8, 0] }] }, options: { devicePixelRatio: 3, rotation: -90, circumference: 180, cutout: '76%', plugins: { tooltip: { enabled: false } } } }));
    // pastilles de couleur devant les causes
    $('rap').querySelectorAll('.rp-c p').forEach(function (p, i) { var k = causes[i] && causes[i][0]; if (k) p.querySelector('em').style.background = CAUSEC[k] || '#64748B'; });
  }

  var bound = false;
  function bind() {
    if (bound) return; bound = true;
    $('rc-alert-all').addEventListener('click', function () { var red = ouvertes(recl()).filter(function (r) { return etat(r) === 'rouge'; }).sort(function (a, b) { return dt(a.recue) - dt(b.recue); }); if (red.length) alerte(red); });
    $('rt-q').addEventListener('input', function () { qS = this.value.trim(); renderSearch(); });
    $('rap-print').addEventListener('click', function () { window.print(); });
    var q = new URLSearchParams(location.search).get('serie');
    if (q) { qS = q; $('rt-q').value = q; }
  }
  window.SacriSuivi = {
    counts: function (D0, soc) { REF = D0.ref; var o = RECL.filter(function (r) { return !r.fin && (soc === 'Groupe' || r.soc === soc); }); return { red: o.filter(function (r) { return etat(r) === 'rouge'; }).length, rec: MACH.filter(function (m) { return m.ret.length >= 2 && (soc === 'Groupe' || m.soc === soc); }).length }; },
    render: function (v, soc, D0) { D = D0; REF = D0.ref; SOC = soc; bind(); if (v === 'reclamations') renderRecl(); if (v === 'retours') renderRet(); if (v === 'rapport') renderRap(); }
  };
})();
