// SACRI 2027 : graphes (Chart.js), jauges, carte de chaleur, filtres communs et tableaux triables.
(function () {
  'use strict';
  var PAL = ['#E95B0F', '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#64748B'];
  var SOCC = { 'SACRI': '#E95B0F', 'PST-CI': '#0EA5E9', 'Trans-Roulements': '#8B5CF6', 'SAFIR': '#10B981', 'DEFI': '#F59E0B' };
  var CANC = { 'WhatsApp': '#10B981', 'E-mail': '#0EA5E9', 'Téléphone': '#8B5CF6', 'Comptoir': '#F59E0B' };
  var nf = function (x, d) { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 }).format(x); };
  var CH = {};
  function defaults() {
    if (!window.Chart || defaults.ok) return; defaults.ok = true;
    var C = Chart.defaults; C.font.family = '"Inter",system-ui,sans-serif'; C.font.size = 12; C.color = '#64748B'; C.animation = false; C.locale = 'fr-FR'; C.maintainAspectRatio = false; C.responsive = true;
    C.plugins.legend.display = false;
    var t = C.plugins.tooltip; t.backgroundColor = '#0F172A'; t.titleColor = '#fff'; t.bodyColor = '#E2E8F0'; t.padding = 10; t.cornerRadius = 10; t.boxPadding = 4; t.titleFont = { weight: '600', size: 12.5 }; t.bodyFont = { size: 12.5 }; t.usePointStyle = true;
    C.elements.bar.borderRadius = 6; C.elements.bar.borderSkipped = false; C.elements.line.tension = .35; C.elements.point.radius = 3; C.elements.point.hoverRadius = 5;
  }
  function mk(id, cfg) {
    defaults();
    if (CH[id]) { CH[id].destroy(); delete CH[id]; }
    var el = document.getElementById(id); if (!el || !window.Chart) return null;
    CH[id] = new Chart(el, cfg); return CH[id];
  }
  function ax(o) { return Object.assign({ grid: { display: false }, border: { display: false }, ticks: { color: '#64748B', maxRotation: 0 } }, o || {}); }
  function ay(o) { return Object.assign({ beginAtZero: true, grid: { color: '#EEF2F6' }, border: { display: false }, ticks: { color: '#94A3B8', precision: 0, maxTicksLimit: 5 } }, o || {}); }
  function legend(items) {
    return '<div class="lg">' + items.map(function (x) { return '<span><i style="background:' + x[1] + '"></i>' + x[0] + (x[2] != null ? '<b>' + x[2] + '</b>' : '') + '</span>'; }).join('') + '</div>';
  }
  function card(id, title, sub, h, extra, cls) {
    return '<div class="gc card' + (cls ? ' ' + cls : '') + '"><div class="gc-h"><div><p class="gc-t">' + title + '</p>' + (sub ? '<p class="gc-s">' + sub + '</p>' : '') + '</div>' + (extra && extra.head ? extra.head : '') + '</div>' +
      '<div class="gc-b" style="height:' + (h || 220) + 'px"><canvas id="' + id + '"></canvas>' + (extra && extra.center ? '<div class="gc-c">' + extra.center + '</div>' : '') + '</div>' + (extra && extra.foot ? extra.foot : '') + '</div>';
  }
  // jauge demi-cercle
  function gauge(id, v, max, col) {
    return mk(id, { type: 'doughnut', data: { labels: ['', ''], datasets: [{ data: [v, Math.max(0, max - v) || (max ? 0 : 1)], backgroundColor: [col, '#EEF2F6'], borderWidth: 0, borderRadius: [8, 0] }] },
      options: { rotation: -90, circumference: 180, cutout: '78%', plugins: { tooltip: { enabled: false } }, layout: { padding: { bottom: 2 } } } });
  }
  function donut(id, labels, data, cols, unit) {
    return mk(id, { type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: cols, borderWidth: 2, borderColor: '#fff', hoverOffset: 4 }] },
      options: { cutout: '70%', plugins: { tooltip: { callbacks: { label: function (c) { var t = c.dataset.data.reduce(function (a, b) { return a + b; }, 0) || 1; return ' ' + c.label + ' : ' + nf(c.parsed) + (unit ? ' ' + unit : '') + ' (' + Math.round(c.parsed / t * 100) + '\u00a0%)'; } } } } } });
  }
  // carte de chaleur HTML : rows [{k, sub, vals:[...]}], cols [libellés]
  function heat(rows, cols, opt) {
    opt = opt || {};
    var mx = 1; rows.forEach(function (r) { r.vals.forEach(function (v) { if (v > mx) mx = v; }); });
    function bg(v) { if (!v) return '#F8FAFC'; var a = .18 + .82 * v / mx; return 'rgba(233,91,15,' + a.toFixed(2) + ')'; }
    return '<div class="hm" style="--n:' + cols.length + '"><div class="hm-r hm-hd"><span></span>' + cols.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '<span class="hm-t">Total</span></div>' +
      rows.map(function (r) {
        var t = r.vals.reduce(function (a, b) { return a + b; }, 0);
        return '<div class="hm-r"><span class="hm-k" title="' + r.k + '">' + r.k + (r.sub ? '<small>' + r.sub + '</small>' : '') + '</span>' + r.vals.map(function (v, i) {
          return '<span class="hm-c' + (v / mx > .55 ? ' hi' : '') + '" style="background:' + bg(v) + '" title="' + r.k + ', ' + cols[i] + ' : ' + v + ' ' + (opt.unit || '') + '">' + (v || '') + '</span>';
        }).join('') + '<span class="hm-t"><b>' + t + '</b></span></div>';
      }).join('') + '<div class="hm-sc"><span>moins</span><i></i><span>plus</span></div></div>';
  }
  // tableau triable avec recherche : cols [{k, l, num, fmt(row), sort(row)}]
  var TB = {};
  function table(boxId, cols, rows, opt) {
    opt = opt || {};
    var st = TB[boxId] = TB[boxId] || { k: opt.sortKey || cols[0].k, dir: opt.dir || 1, q: '' };
    var box = document.getElementById(boxId); if (!box) return;
    function draw() {
      var q = st.q.toLowerCase();
      var col = cols.filter(function (c) { return c.k === st.k; })[0] || cols[0];
      var R = rows.filter(function (r) { return !q || (opt.text ? opt.text(r) : JSON.stringify(r)).toLowerCase().indexOf(q) >= 0; })
        .slice().sort(function (a, b) { var x = col.sort ? col.sort(a) : a[col.k], y = col.sort ? col.sort(b) : b[col.k]; return (x > y ? 1 : x < y ? -1 : 0) * st.dir; });
      box.querySelector('tbody').innerHTML = R.length ? R.map(function (r) { return '<tr' + (opt.rowAttr ? ' ' + opt.rowAttr(r) : '') + '>' + cols.map(function (c) { return '<td class="' + (c.num ? 'n' : '') + (c.cls ? ' ' + c.cls : '') + '" data-l="' + c.l + '">' + (c.fmt ? c.fmt(r) : r[c.k]) + '</td>'; }).join('') + '</tr>'; }).join('')
        : '<tr><td colspan="' + cols.length + '" class="empty">' + (opt.empty || 'Aucune ligne pour ces filtres.') + '</td></tr>';
      box.querySelectorAll('th').forEach(function (th) { var on = th.getAttribute('data-k') === st.k; th.classList.toggle('on', on); th.setAttribute('aria-sort', on ? (st.dir > 0 ? 'ascending' : 'descending') : 'none'); });
      var cnt = box.querySelector('.tb-n'); if (cnt) cnt.textContent = R.length + ' sur ' + rows.length;
      if (opt.bind) opt.bind(box);
    }
    box.innerHTML = '<div class="tb-tools"><label class="srch"><svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><input type="search" placeholder="' + (opt.ph || 'Rechercher') + '" value="' + st.q.replace(/"/g, '&quot;') + '" aria-label="Rechercher dans le tableau"></label><span class="tb-n"></span></div>' +
      '<div class="tb-w"><table class="tb"><thead><tr>' + cols.map(function (c) { return '<th data-k="' + c.k + '" class="' + (c.num ? 'n' : '') + '" tabindex="0">' + c.l + '<svg class="i so" viewBox="0 0 24 24"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></th>'; }).join('') + '</tr></thead><tbody></tbody></table></div>';
    box.querySelector('input').addEventListener('input', function () { st.q = this.value; draw(); });
    box.querySelectorAll('th').forEach(function (th) {
      var go = function () { var k = th.getAttribute('data-k'); if (st.k === k) st.dir = -st.dir; else { st.k = k; st.dir = 1; } draw(); };
      th.addEventListener('click', go); th.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
    draw();
  }
  function cellBar(v, max, col, txt) { return '<span class="cb"><span class="cb-t">' + txt + '</span><span class="cb-b"><i style="width:' + Math.max(4, Math.min(100, v / (max || 1) * 100)) + '%;background:' + col + '"></i></span></span>'; }

  // ---------- filtres communs ----------
  var F = window.SF = { per: 'tout', canal: 'tous', statut: 'tous' };
  var PER = [['tout', 'Tout'], ['7j', '7 jours'], ['48h', '48 h']];
  var CAN = [['tous', 'Tous les canaux'], ['WhatsApp', 'WhatsApp'], ['E-mail', 'E-mail'], ['Téléphone', 'Téléphone'], ['Comptoir', 'Comptoir']];
  var STA = [['tous', 'Tous les statuts'], ['atraiter', 'À traiter'], ['retard', 'En retard'], ['traites', 'Traités']];
  var APPLIES = { messages: [1, 1, 1], atelier: [1, 0, 1], reclamations: [1, 1, 1], rapport: [0, 0, 0], retours: [0, 0, 0], envoi: [0, 0, 0], piece: [0, 0, 0] };
  function since(ref) { var r = new Date(ref.length === 16 ? ref + ':00' : ref).getTime(); return F.per === '7j' ? r - 7 * 864e5 : F.per === '48h' ? r - 48 * 36e5 : -Infinity; }
  function perLbl(def) { return F.per === '7j' ? 'sur les 7 derniers jours' : F.per === '48h' ? 'sur les dernières 48 h' : def; }
  function filtersOn() { return F.per !== 'tout' || F.canal !== 'tous' || F.statut !== 'tous'; }
  function drawFilters(vue, onChange) {
    var box = document.getElementById('fbar'); if (!box) return;
    var ap = APPLIES[vue] || [0, 0, 0];
    box.classList.toggle('off', !ap[0] && !ap[1] && !ap[2]);
    var seg = '<div class="fseg' + (ap[0] ? '' : ' dis') + '" role="group" aria-label="Période">' + PER.map(function (p) { return '<button data-p="' + p[0] + '" class="' + (F.per === p[0] ? 'on' : '') + '"' + (ap[0] ? '' : ' disabled') + '>' + p[1] + '</button>'; }).join('') + '</div>';
    function sel(id, list, val, on, ic) { return '<label class="fsel' + (on ? '' : ' dis') + (val !== list[0][0] && on ? ' act' : '') + '">' + window.ico(ic) + '<select id="' + id + '"' + (on ? '' : ' disabled') + ' aria-label="' + list[0][1] + '">' + list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' + window.ico('chevron-down', 'cv') + '</label>'; }
    box.querySelector('.f-in').innerHTML = seg + sel('f-can', CAN, F.canal, ap[1], 'message-circle') + sel('f-sta', STA, F.statut, ap[2], 'circle-dot') +
      '<button class="freset"' + (filtersOn() ? '' : ' hidden') + '>' + window.ico('x') + 'Effacer</button>' +
      (!ap[0] && !ap[1] && !ap[2] ? '<span class="fnote">' + (vue === 'rapport' ? 'Le rapport couvre toujours la semaine entière.' : vue === 'retours' ? 'Historique complet depuis la vente : filtre par société et par matériel.' : 'Filtre par société.') + '</span>' : '');
    box.querySelectorAll('.fseg button').forEach(function (b) { b.addEventListener('click', function () { F.per = b.getAttribute('data-p'); onChange(); }); });
    var c = document.getElementById('f-can'), s = document.getElementById('f-sta');
    c.addEventListener('change', function () { F.canal = c.value; onChange(); });
    s.addEventListener('change', function () { F.statut = s.value; onChange(); });
    box.querySelector('.freset').addEventListener('click', function () { F.per = 'tout'; F.canal = 'tous'; F.statut = 'tous'; onChange(); });
  }
  window.SG = { PAL: PAL, SOCC: SOCC, CANC: CANC, mk: mk, ax: ax, ay: ay, legend: legend, card: card, gauge: gauge, donut: donut, heat: heat, table: table, cellBar: cellBar, since: since, perLbl: perLbl, drawFilters: drawFilters, nf: nf, filtersOn: filtersOn };
})();
