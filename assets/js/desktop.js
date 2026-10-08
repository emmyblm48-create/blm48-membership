// =========================================================================
// 🖥️ BLM48 Desktop layout (จอคอม ≥ 1024px) — โหลดอัตโนมัติจาก common.js ทุกหน้า
// - ใส่เมนูซ้าย (.dt-sidebar) แทนแถบล่างแบบมือถือ
// - หน้าใน RAIL_PAGES ได้แถบขวา (.dt-rail): กระเป๋าเงิน / Kami-Oshi / ภารกิจวันนี้ (จอ ≥ 1280px)
// - แถบ position:fixed ของแต่ละหน้า (navbar, top bar, แถบล่าง, toast) ถูกติดคลาสให้ขยับมาอยู่
//   ในช่องกลาง ไม่ไปทับเมนูซ้าย/แถบขวา (ดู scanFixed)
// สไตล์ทั้งหมดอยู่ใน assets/css/desktop.css และอยู่ใต้ @media (min-width: 1024px) เท่านั้น
// มือถือจึงหน้าตาเหมือนเดิมทุกอย่าง (DOM ถูกเพิ่มแต่ display:none)
// หน้า Admin มีธีมของตัวเอง (admin-theme.css) เลยข้ามไป
// =========================================================================
(function () {
  const page = ((location.pathname.replace(/\/+$/, '').split('/').pop() || 'index').replace(/\.html$/, '')) || 'index';
  if (/^admin/.test(page) || page === 'login') return;

  const RAIL_PAGES = ['index', 'fanpost', 'notification', 'postdetail'];
  const DESKTOP_MQ = window.matchMedia('(min-width: 1024px)');
  const FALLBACK_AVATAR = 'https://lh3.googleusercontent.com/d/1rebp2F8vyP0nyvsEOFD9Nw2mPcRtVqtG=s1000';

  // หน้าย่อยไหนให้เมนูไหนติด active
  const ACTIVE_MAP = {
    index: 'index', postdetail: 'index', post: 'index', topfans: 'index', topvip_reward: 'index',
    specialfansday: 'index', champ: 'index', champranking: 'index', specialthanks: 'index', fan: 'index',
    fanpost: 'fanpost',
    majorvote: 'majorvote', majorvote_detail: 'majorvote', majorvote_vote: 'majorvote',
    notification: 'notification',
    profile: 'profile', history: 'profile', membership_card: 'profile', membership_tier: 'profile',
    token_wallet: 'my_wallet', my_wallet: 'my_wallet', redeem: 'profile', kami: 'profile',
    missions: 'missions',
    shop: 'shop', cart: 'shop', checkout: 'shop', payment: 'shop', orders: 'shop', order_detail: 'shop',
    order_received: 'shop', preorder_detail: 'shop', my_preorders: 'shop', my_preorders_history: 'shop',
    inventory: 'inventory',
    search: 'search', member: 'search',
    campaign: 'campaign', campaign_detail: 'campaign', campaign_open: 'campaign', campaign_supporters: 'campaign'
  };

  const MAIN_NAV = [
    { key: 'index', href: 'index', icon: 'fa-house', label: 'Home' },
    { key: 'fanpost', href: 'fanpost', icon: 'fa-star', label: 'Fan Post' },
    { key: 'majorvote', href: 'majorvote', icon: 'fa-crown', label: 'Major Vote' },
    { key: 'notification', href: 'notification', icon: 'fa-bell', label: 'Notification', dot: 'noti' },
    { key: 'profile', href: 'profile', icon: 'fa-user', label: 'Profile' }
  ];
  const SUB_NAV = [
    { key: 'missions', href: 'missions', icon: 'fa-list-check', label: 'Missions', dot: 'mission' },
    { key: 'shop', href: 'shop', icon: 'fa-store', label: 'Shop' },
    { key: 'inventory', href: 'inventory', icon: 'fa-briefcase', label: 'Inventory' },
    { key: 'search', href: 'search', icon: 'fa-magnifying-glass', label: 'Search members' },
    { key: 'campaign', href: 'campaign', icon: 'fa-bullhorn', label: 'Campaign' },
    { key: 'my_wallet', href: 'my_wallet', icon: 'fa-wallet', label: 'My Wallet' }
  ];

  const root = document.documentElement;
  root.classList.add('dt-shell', 'dt-page-' + page);
  if (RAIL_PAGES.includes(page)) root.classList.add('dt-has-rail');

  if (!document.querySelector('link[href*="desktop.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/desktop.css';
    document.head.appendChild(link);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function img(url) {
    if (!url) return FALLBACK_AVATAR;
    if (String(url).includes('drive.google.com')) {
      const m = String(url).match(/[-\w]{25,}/);
      return m ? 'https://lh3.googleusercontent.com/d/' + m[0] : url;
    }
    return url;
  }
  function num(n) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString('en-US') : '-';
  }
  function session() {
    try { return (typeof getUserSession === 'function') ? getUserSession() : null; } catch (e) { return null; }
  }

  // ---------------- Sidebar ----------------
  function navLink(item, activeKey) {
    return `<a href="${item.href}" class="${item.key === activeKey ? 'active' : ''}">
      <i class="fa-solid ${item.icon}"></i><span>${esc(item.label)}</span>
      ${item.dot ? `<span class="dt-dot" data-dt-dot="${item.dot}"></span>` : ''}
    </a>`;
  }

  function buildSidebar() {
    const activeKey = ACTIVE_MAP[page] || '';
    const el = document.createElement('aside');
    el.className = 'dt-sidebar';
    el.setAttribute('aria-label', 'BLM48 menu');
    el.innerHTML = `
      <a href="index" class="dt-brand">
        <div class="dt-brand-mark">BLM</div>
        <div class="dt-brand-text"><b>BLM48</b><span>MEMBERSHIP</span></div>
      </a>
      <nav class="dt-nav">${MAIN_NAV.map(i => navLink(i, activeKey)).join('')}</nav>
      <a href="post" class="dt-post-btn" id="dt-post-btn"><i class="fa-solid fa-plus"></i> Create post</a>
      <div class="dt-nav-label">More</div>
      <nav class="dt-nav dt-nav-sub">
        ${SUB_NAV.map(i => navLink(i, activeKey)).join('')}
        <a href="admin" id="dt-admin-link" style="display:none;"><i class="fa-solid fa-user-shield"></i><span>Admin</span></a>
      </nav>
      <a href="profile" class="dt-me" id="dt-me"></a>
    `;
    document.body.appendChild(el);
    renderSidebarUser();
  }

  function renderSidebarUser() {
    const u = session();
    const me = document.getElementById('dt-me');
    if (!me) return;
    if (!u || !u.username) { me.innerHTML = ''; return; }
    me.innerHTML = `
      <img src="${esc(img(u.profile_img))}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_AVATAR}'">
      <div class="dt-me-text"><b>${esc(u.name || u.username)}</b><span>@${esc(u.username)}</span></div>`;
    const role = String(u.role || '').trim().toLowerCase();
    const postBtn = document.getElementById('dt-post-btn');
    if (postBtn) postBtn.classList.toggle('on', role === 'member');
    const admin = document.getElementById('dt-admin-link');
    if (admin) admin.style.display = (role === 'admin' || u.is_admin === true) ? 'flex' : 'none';
  }

  // จุดแดง: แจ้งเตือนใช้ค่าเดียวกับ checkNotificationBadge(), ภารกิจดูจากจุดแดงบนหัว Home หรือข้อมูลภารกิจในแถบขวา
  let missionClaimable = false;
  function isShown(id) {
    const el = document.getElementById(id);
    return !!(el && el.style.display && el.style.display !== 'none');
  }
  function updateDots() {
    let noti = false;
    try { noti = localStorage.getItem('blm48_has_new_noti') === 'true'; } catch (e) {}
    const mission = missionClaimable || isShown('mission-badge') || isShown('streak-badge');
    document.querySelectorAll('[data-dt-dot]').forEach(d => {
      const on = d.dataset.dtDot === 'noti' ? noti : mission;
      d.classList.toggle('on', on);
    });
  }
  if (typeof window.checkNotificationBadge === 'function') {
    const orig = window.checkNotificationBadge;
    window.checkNotificationBadge = function () {
      const r = orig.apply(this, arguments);
      updateDots();
      return r;
    };
  }
  window.addEventListener('storage', updateDots);

  // ---------------- Right rail ----------------
  function buildRail() {
    const el = document.createElement('aside');
    el.className = 'dt-rail';
    el.setAttribute('aria-label', 'My account');
    el.innerHTML = `
      <a href="my_wallet" class="dt-card" id="dt-wallet-card"></a>
      <div class="dt-card" id="dt-kami-card">
        <div class="dt-card-head">Kami-Oshi</div>
        <div class="dt-empty">Loading...</div>
      </div>
      <a href="missions" class="dt-card" id="dt-mission-card">
        <div class="dt-card-head">Today's missions</div>
        <div class="dt-empty">Loading...</div>
      </a>
      <div class="dt-links">
        <a href="topfans"><i class="fa-solid fa-medal"></i>Top Fans</a>
        <a href="specialfansday"><i class="fa-solid fa-calendar-days"></i>Fans Day</a>
        <a href="champranking"><i class="fa-solid fa-trophy"></i>Champ</a>
        <a href="cart"><i class="fa-solid fa-cart-shopping"></i>Cart</a>
      </div>
      <div class="dt-foot">© 2026 BLM48 MEMBERSHIP</div>
    `;
    document.body.appendChild(el);
    renderWallet(session());
    loadRailData();
  }

  function renderWallet(u) {
    const card = document.getElementById('dt-wallet-card');
    if (!card) return;
    if (!u || !u.username) { card.style.display = 'none'; return; }
    card.innerHTML = `
      <div class="dt-profile">
        <img src="${esc(img(u.profile_img))}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_AVATAR}'">
        <div><b>${esc(u.name || u.username)}</b><span>@${esc(u.username)}${u.role ? ' · ' + esc(u.role) : ''}</span></div>
      </div>
      <div class="dt-wallet">
        <div><b>${num(u.token)}</b><span><i class="fa-solid fa-coins"></i>Token</span></div>
        <div><b>${num(u.cookie)}</b><span><i class="fa-solid fa-cookie-bite"></i>Cookie</span></div>
        <div><b>${num(u.geToken)}</b><span><i class="fa-solid fa-gem"></i>GE</span></div>
      </div>`;
  }

  const MISSION_META = {
    cookie: { icon: 'fa-cookie-bite', label: 'Give cookies' },
    like: { icon: 'fa-heart', label: 'Like posts' },
    comment: { icon: 'fa-comment-dots', label: 'Comment' },
    post: { icon: 'fa-pen-to-square', label: 'Daily post' }
  };

  function renderMissions(res) {
    const card = document.getElementById('dt-mission-card');
    if (!card) return;
    const list = (res && Array.isArray(res.missions)) ? res.missions : [];
    if (!list.length) {
      card.innerHTML = `<div class="dt-card-head">Today's missions</div><div class="dt-empty">No missions today</div>`;
      return;
    }
    const done = list.filter(m => m.done).length;
    card.innerHTML = `
      <div class="dt-card-head">Today's missions <span>${done}/${list.length}${res.claimed ? ' · claimed' : ''}</span></div>
      ${list.map(m => {
        const meta = MISSION_META[m.key] || { icon: 'fa-circle', label: m.key };
        const pct = Math.min(100, Math.round((Number(m.progress) / Math.max(1, Number(m.target))) * 100));
        return `<div class="dt-mission">
          <div class="dt-mission-row ${m.done ? 'done' : ''}">
            <span><i class="fa-solid ${m.done ? 'fa-circle-check' : meta.icon}"></i> ${esc(meta.label)}</span>
            <span>${num(m.progress)}/${num(m.target)}</span>
          </div>
          <div class="dt-bar"><div style="width:${pct}%"></div></div>
        </div>`;
      }).join('')}`;
    missionClaimable = !!(res.allDone && !res.claimed);
    updateDots();
  }

  function renderKami(kami, members) {
    const card = document.getElementById('dt-kami-card');
    if (!card) return;
    if (!kami || !kami.name) {
      card.innerHTML = `<div class="dt-card-head">Kami-Oshi</div>
        <div class="dt-empty">You haven't picked a Kami-Oshi yet. <a href="search" style="color:var(--dt-pink);font-weight:700;text-decoration:none;">Find members</a></div>`;
      return;
    }
    const m = (members || []).find(x => String(x.name || '').trim().toLowerCase() === kami.name.toLowerCase());
    const photo = m ? (m.profile || m.profile_img) : '';
    card.innerHTML = `
      <div class="dt-card-head">Kami-Oshi</div>
      <a class="dt-kami" href="member?name=${encodeURIComponent(kami.name)}" style="text-decoration:none;color:inherit;">
        <img src="${esc(img(photo))}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_AVATAR}'">
        <div><b>${esc(kami.name)}</b><span class="dt-kami-days"><i class="fa-solid fa-crown"></i> ${num(Number(kami.days) || 1)} Days</span></div>
      </a>`;
  }

  async function loadRailData() {
    const u = session();
    if (!u || !u.username) {
      renderKami(null);
      renderMissions(null);
      return;
    }
    let kami = u.kamioshi ? { name: String(u.kamioshi).trim(), days: u.kamioshiDays } : null;
    let members = [];

    const jobs = [];
    if (typeof blm48GetWallet === 'function') {
      jobs.push(blm48GetWallet(u.username).then(w => {
        if (w && w.token !== undefined) renderWallet(Object.assign({}, u, { token: w.token, cookie: w.cookie, geToken: w.geToken }));
      }).catch(() => {}));
    }
    if (typeof blm48GetUserInfo === 'function') {
      jobs.push(blm48GetUserInfo(u.username).then(res => {
        if (res && res.status === 'success' && res.data) {
          kami = res.data.kamioshi ? { name: String(res.data.kamioshi).trim(), days: res.data.kamioshiDays } : null;
        }
      }).catch(() => {}));
    }
    if (typeof blm48GetAllMembers === 'function') {
      jobs.push(blm48GetAllMembers().then(res => {
        if (res && res.status === 'success' && Array.isArray(res.data)) members = res.data;
      }).catch(() => {}));
    }
    if (typeof blm48GetDailyMissions === 'function') {
      jobs.push(blm48GetDailyMissions(u.username).then(renderMissions).catch(() => renderMissions(null)));
    } else {
      renderMissions(null);
    }
    await Promise.all(jobs);
    renderKami(kami, members);
  }

  // ---------------- แถบ position:fixed ของแต่ละหน้า ----------------
  // ไล่หา element ที่ fixed แล้วจัดกลุ่มจากตำแหน่งจริงบนจอ (ทำครั้งเดียวต่อ element ตอนที่มันมองเห็นได้):
  //   เต็มความกว้าง -> .dt-fixbar (หดให้เท่าช่องกลาง)
  //   กึ่งกลางจอ   -> .dt-fixcenter (เลื่อนไปกึ่งกลางช่องกลาง)
  //   เกาะขอบซ้าย/ขวา -> .dt-fixleft / .dt-fixright
  //   สูงเกิน 60% จอ (overlay/modal/พื้นหลัง) -> ปล่อยไว้คลุมทั้งจอเหมือนเดิม
  const SKIP_SUBTREE = '#posts-container, .feed-section, .horizontal-list, .dt-sidebar, .dt-rail';
  const DONE = ['dt-fixbar', 'dt-fixcenter', 'dt-fixleft', 'dt-fixright', 'dt-fixskip'];

  function classify(el) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const cw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    if (r.height > vh * 0.6) { el.classList.add('dt-fixskip'); return; }
    if (r.left <= 2 && r.right >= cw - 2) { el.classList.add('dt-fixbar'); return; }
    const mid = (r.left + r.right) / 2;
    if (Math.abs(mid - cw / 2) < 4) { el.classList.add('dt-fixcenter'); return; }
    if (r.left > cw / 2) { el.classList.add('dt-fixright'); return; }
    if (r.right < cw / 2) { el.classList.add('dt-fixleft'); return; }
    el.classList.add('dt-fixskip');
  }

  function walk(node, depth) {
    for (const el of node.children) {
      if (el.matches(SKIP_SUBTREE) || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      const pos = getComputedStyle(el).position;
      if (pos === 'fixed') {
        if (!DONE.some(c => el.classList.contains(c))) classify(el);
        continue;
      }
      if (depth < 7) walk(el, depth + 1);
    }
  }

  let scanTimer = null;
  function scanFixed() {
    if (!DESKTOP_MQ.matches || !document.body) return;
    walk(document.body, 0);
  }
  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scanFixed, 250);
  }

  // ---------------- start ----------------
  function start() {
    buildSidebar();
    if (RAIL_PAGES.includes(page)) buildRail();
    updateDots();
    scanFixed();
    [600, 1800, 4000].forEach(t => setTimeout(() => { scanFixed(); updateDots(); renderSidebarUser(); }, t));
    window.addEventListener('resize', scheduleScan);
    DESKTOP_MQ.addEventListener && DESKTOP_MQ.addEventListener('change', scheduleScan);
    new MutationObserver(() => { scheduleScan(); updateDots(); })
      .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && RAIL_PAGES.includes(page)) loadRailData();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
