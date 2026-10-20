// =========================================================================
// BLM48 Membership — 🎉 ธีมเทศกาลอัตโนมัติ (สากล + ไทย) + ของตกแต่งลอยบนจอ
// Loaded in <head> of every member-facing page, right after festivals.css.
// Picks the festival whose window contains today's date and adds
// html.theme-festival + html.theme-<id> (which activate the rules in
// festivals.css). Outside every window nothing happens, so the pages fall
// back to the normal theme without touching them again.
//
// ⚠️ ตั้งแต่ 2026-10-20 ทำงานเฉพาะหน้า Home (index) — หน้าอื่นไม่ใส่ธีมแล้ว
//    (ยกเว้นธีมที่มี tabBarEverywhere: หน้าอื่นได้แถบเมนูล่างของธีมอย่างเดียว)
//
// ดูตัวอย่างธีมไหนก็ได้ทุกเวลา: เปิดหน้า Home พร้อม ?festival=<id>
//   เช่น index?festival=songkran  (จำไว้จนปิดแท็บ)
//   ?festival=none = ปิดธีมทั้งหมด, ?festival=auto = กลับไปใช้ตามวันที่จริง
// =========================================================================

(function festivalTheme() {
  // ธีมเทศกาลใช้เฉพาะหน้า Home (index) เท่านั้น — หน้าอื่นกลับเป็นหน้าตาปกติแบบก่อนมีธีม (ตามคำขอ 2026-10-20)
  // ยกเว้นธีมที่ตั้ง tabBarEverywhere: หน้าอื่นได้แค่แถบเมนูล่างของธีม (html.theme-tabbar-<id>) อย่างเดียว
  const IS_HOME = /^\/(index(\.html)?)?$/.test(window.location.pathname);

  // ---------------------------------------------------------------------
  // วันที่ของเทศกาลตามปฏิทินจันทรคติ (เปลี่ยนทุกปี) — เดือน-วัน ตามเวลาไทย
  // ---------------------------------------------------------------------
  const CHINESE_NEW_YEAR = {
    2027: '02-06', 2028: '01-26', 2029: '02-13', 2030: '02-03',
    2031: '01-23', 2032: '02-11', 2033: '01-31', 2034: '02-19', 2035: '02-08'
  };
  // ปีที่ไม่มีในตารางนี้จะประมาณจากวันเพ็ญที่ใกล้ 15 พ.ย. ที่สุด (อาจคลาด ±1 วัน)
  // ควรเช็กกับปฏิทินไทยแล้วเติมลงตารางล่วงหน้า
  const LOY_KRATHONG = {
    2026: '11-24', 2027: '11-13'
  };

  const DAY = 86400000;
  // นับเป็น "เลขวัน" (ไม่สนเวลา) เทียบช่วงวันที่ได้ง่ายและข้ามปีได้
  function dayNum(y, m, d) { return Date.UTC(y, m - 1, d) / DAY; }
  function fixed(y, mmdd) { const p = mmdd.split('-'); return dayNum(y, +p[0], +p[1]); }

  // วันเพ็ญ (เวลาไทย) ที่ใกล้วันที่กำหนดที่สุด — ใช้เป็นค่าประมาณวันลอยกระทง
  function nearestFullMoon(y, m, d) {
    const SYNODIC = 29.530588853;
    const REF_FULL_MOON = Date.UTC(2000, 0, 21, 4, 40) / DAY; // 21 ม.ค. 2000 04:40 UTC
    const target = dayNum(y, m, d);
    const n = Math.round((target - REF_FULL_MOON) / SYNODIC);
    return Math.floor(REF_FULL_MOON + n * SYNODIC + 7 / 24); // +7 ชม. = เวลาไทย
  }

  // เสาร์ที่ 2 ของเดือนมกราคม (วันเด็ก)
  function secondSaturdayOfJanuary(y) {
    const firstDow = new Date(Date.UTC(y, 0, 1)).getUTCDay();
    return dayNum(y, 1, 1 + ((6 - firstDow + 7) % 7) + 7);
  }

  // ---------------------------------------------------------------------
  // รายการเทศกาล — เรียงตามลำดับความสำคัญ (ถ้าช่วงทับกัน อันที่อยู่บนกว่าชนะ)
  // window(y) คืน [วันเริ่ม, วันสุดท้าย] เป็นเลขวันของเทศกาลรอบปี y (หรือ null)
  //   barColor: สีแถบสถานะเบราว์เซอร์ / PWA
  //   fall:  ของที่ร่วงลงมาจากด้านบน    rise: ของที่ลอยขึ้นจากด้านล่าง
  //   icons: สลับไอคอนพื้นหลังหลังการ์ดอันดับหน้าแรก (index.html #bg-decorations)
  // ---------------------------------------------------------------------
  const FESTIVALS = [
    {
      // ธีม "Magic Hour" ดำ-แดง (ห้องโถงโกธิก พระจันทร์สีเลือด เทียน กลีบกุหลาบ)
      // เริ่ม 1 พ.ย. 2026 เวลา 00:00 (เวลาเครื่องผู้ใช้) ยังไม่กำหนดวันจบ -> ปลายไว้ไกลๆ จนกว่าจะได้วันจบจริง
      // อยู่บนสุด = ชนะทุกธีมถ้าช่วงทับกัน (ลอยกระทง คริสต์มาส ปีใหม่ จะไม่ขึ้นระหว่างนี้)
      id: 'magichour', name: 'Magic Hour',
      window: y => [dayNum(2026, 11, 1), dayNum(2099, 12, 31)],
      barColor: '#120709',
      tabBarEverywhere: true, // แถบเมนูล่างของธีมใช้กับทุกหน้าที่มีแถบเมนูล่าง
      sparkles: true,         // ฝุ่นเวทสีทองวิบวับอยู่กับที่ ไม่มีของร่วง/อิโมจิ
      floatingCandles: true,  // เทียนลอยกลางอากาศขยับขึ้นลงช้าๆ เหนือป้าย Champ (บรรยากาศห้องโถงโรงเรียนเวทมนตร์)
      // กลิ่นอายโลกเวทมนตร์ (ของทั่วไปในโลกพ่อมด — ไม่ใช้โลโก้/ชื่อ/ตราบ้านของ Harry Potter เพราะติดลิขสิทธิ์)
      decorSvgs: {
        'fa-crown': 'wand',                    // ไม้กายสิทธิ์มีประกาย
        'fa-heart': 'potion',                  // ขวดยาวิเศษสีแดง
        'fa-star': 'candle',                   // เทียน
        'fa-music': 'spellbook',               // ตำราเวท
        'fa-wand-magic-sparkles': 'owl'        // นกฮูก
      }
    },
    {
      // ธีมซิงเกิล BLM48 10th Single "Sustainable" (ชมพูพาสเทล กลีบดอกไม้ ไข่มุก)
      // เปิดใช้ 20-31 ต.ค. 2026 (1 พ.ย. 00:00 เปลี่ยนเป็นธีม Magic Hour ตามคำขอ)
      id: 'sustainable', name: 'BLM48 10th Single Sustainable',
      window: y => [dayNum(2026, 10, 20), dayNum(2026, 10, 31)],
      barColor: '#e98aae',
      tabBarEverywhere: true, // แถบเมนูล่างแบบทิวทัศน์ใช้กับทุกหน้าที่มีแถบเมนูล่าง (fanpost/majorvote/notification/profile)
      sparkles: true, // ไม่ใช้อิโมจิ และไม่มีของร่วงจากด้านบน (ตามคำขอ) -> มีแค่ประกายไข่มุก ไม่มี fall/rise
      // ไอคอนพื้นหลังหลังการ์ดอันดับ = ภาพวาด SVG หลายสีตามโปสเตอร์ (แทนไอคอน Font Awesome สีเดียว)
      decorSvgs: {
        'fa-crown': 'cosmos',                  // ดอกคอสมอสชมพู
        'fa-heart': 'ribbon',                  // โบว์ริบบิ้น
        'fa-star': 'butterfly',                // ผีเสื้อลาเวนเดอร์
        'fa-music': 'pearl',                   // ไข่มุก
        'fa-wand-magic-sparkles': 'lavender'   // ช่อลาเวนเดอร์
      }
    },
    {
      id: 'childrensday', name: 'วันเด็ก',
      window: y => { const s = secondSaturdayOfJanuary(y); return [s - 3, s]; },
      barColor: '#2ec4b6',
      rise: ['🎈', '🪁', '🎈', '🧸', '🎈'],
      icons: { 'fa-crown': 'fa-child-reaching', 'fa-heart': 'fa-gift', 'fa-music': 'fa-puzzle-piece', 'fa-wand-magic-sparkles': 'fa-ice-cream' }
    },
    {
      id: 'chinesenewyear', name: 'ตรุษจีน',
      window: y => CHINESE_NEW_YEAR[y] ? [fixed(y, CHINESE_NEW_YEAR[y]) - 5, fixed(y, CHINESE_NEW_YEAR[y]) + 4] : null,
      barColor: '#8b0000',
      fall: ['🧧', '✨', '🧧'],
      rise: ['🏮', '🍊', '🏮', '🍊', '🏮'],
      icons: { 'fa-crown': 'fa-dragon', 'fa-heart': 'fa-coins', 'fa-star': 'fa-fan', 'fa-music': 'fa-drum', 'fa-wand-magic-sparkles': 'fa-envelope' }
    },
    {
      id: 'loykrathong', name: 'ลอยกระทง',
      window: y => {
        const day = LOY_KRATHONG[y] ? fixed(y, LOY_KRATHONG[y]) : nearestFullMoon(y, 11, 15);
        return [day - 6, day + 1];
      },
      barColor: '#0b1d3a',
      rise: ['🪷', '🕯️', '✨', '🪷', '🕯️'],
      icons: { 'fa-crown': 'fa-moon', 'fa-heart': 'fa-water', 'fa-wand-magic-sparkles': 'fa-fire' }
    },
    {
      id: 'songkran', name: 'สงกรานต์',
      window: y => [dayNum(y, 4, 10), dayNum(y, 4, 16)],
      barColor: '#0077b6',
      fall: ['💧', '💦', '💧', '💧'],
      rise: ['🌼', '🌸', '🐘', '🌼', '🌸'],
      icons: { 'fa-crown': 'fa-sun', 'fa-heart': 'fa-droplet', 'fa-star': 'fa-umbrella-beach', 'fa-music': 'fa-water' }
    },
    {
      id: 'valentine', name: 'วาเลนไทน์',
      window: y => [dayNum(y, 2, 7), dayNum(y, 2, 14)],
      barColor: '#c9184a',
      fall: ['💕', '💗', '❤️', '💕'],
      rise: ['💌', '🌹', '💝', '🌹', '💌'],
      icons: { 'fa-crown': 'fa-heart', 'fa-star': 'fa-envelope', 'fa-wand-magic-sparkles': 'fa-gift' }
    },
    {
      id: 'christmas', name: 'คริสต์มาส',
      window: y => [dayNum(y, 12, 1), dayNum(y, 12, 25)],
      barColor: '#14532d',
      fall: ['❄️', '❄', '❄️', '❄'],
      rise: ['🎄', '🎁', '⛄', '🎁', '🎄'],
      icons: { 'fa-crown': 'fa-tree', 'fa-heart': 'fa-gifts', 'fa-star': 'fa-snowflake', 'fa-music': 'fa-bell', 'fa-wand-magic-sparkles': 'fa-candy-cane' }
    },
    {
      id: 'newyear', name: 'ปีใหม่',
      window: y => [dayNum(y, 12, 26), dayNum(y + 1, 1, 3)],
      barColor: '#0f1b3d',
      fall: ['✨', '🎊', '✨', '🎉'],
      rise: ['🎆', '🥂', '🎇', '🥂', '🎆'],
      icons: { 'fa-crown': 'fa-champagne-glasses', 'fa-heart': 'fa-gift' }
    },
    {
      id: 'halloween', name: 'ฮาโลวีน',
      window: y => [dayNum(y, 10, 1), dayNum(y, 11, 2)],
      barColor: '#2b1745',
      rise: ['🎃', '👻', '🍬', '👻', '🎃'],
      bats: true,
      icons: { 'fa-crown': 'fa-ghost', 'fa-heart': 'fa-spider', 'fa-star': 'fa-moon', 'fa-music': 'fa-hat-wizard', 'fa-wand-magic-sparkles': 'fa-skull' }
    }
  ];

  // ---------------------------------------------------------------------
  // เลือกเทศกาลของวันนี้ (หรือธีมที่สั่งดูตัวอย่างผ่าน ?festival=)
  // ---------------------------------------------------------------------
  const PREVIEW_KEY = 'blm48_festival_preview';
  function readPreview() {
    try {
      const param = new URLSearchParams(window.location.search).get('festival');
      if (param === 'auto') sessionStorage.removeItem(PREVIEW_KEY);
      else if (param) sessionStorage.setItem(PREVIEW_KEY, param);
      return sessionStorage.getItem(PREVIEW_KEY);
    } catch (e) {
      return null;
    }
  }

  function festivalForToday() {
    const now = new Date();
    const y = now.getFullYear();
    const today = dayNum(y, now.getMonth() + 1, now.getDate());
    // เช็กรอบปีที่แล้วด้วย สำหรับเทศกาลที่คร่อมปี (ปีใหม่ 26 ธ.ค. - 3 ม.ค.)
    return FESTIVALS.find(f => [y - 1, y].some(yy => {
      const w = f.window(yy);
      return w && today >= w[0] && today <= w[1];
    })) || null;
  }

  const preview = readPreview();
  const festival = preview === 'none' ? null
    : (preview && FESTIVALS.find(f => f.id === preview)) || festivalForToday();
  if (!festival) return;
  if (!IS_HOME) {
    if (festival.tabBarEverywhere) document.documentElement.classList.add('theme-tabbar-' + festival.id);
    return;
  }

  // ใส่คลาสทันทีตั้งแต่ใน <head> กันหน้ากระพริบเป็นธีมเดิมก่อนเปลี่ยน
  document.documentElement.classList.add('theme-festival', 'theme-' + festival.id);

  function setThemeColor() {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = festival.barColor;
  }

  const BAT_SVG = '<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><path fill="#2a1d33" d="M32 10c-2-4-3-6-3-6l-1 4c-4-3-10-3-14 0 2 1 3 3 3 5-4-2-10-1-13 2 4 0 7 2 8 5 5-3 11-2 15 2 1-3 3-5 5-6 2 1 4 3 5 6 4-4 10-5 15-2 1-3 4-5 8-5-3-3-9-4-13-2 0-2 1-4 3-5-4-3-10-3-14 0l-1-4s-1 2-3 6z"/></svg>';
  const WEB_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2a1d33" stroke-width="1"><path d="M0 0L100 100M0 0L100 38M0 0L38 100M0 0L100 0M0 0L0 100"/><path d="M20 0Q16 9 20 20Q9 16 0 20M42 0Q34 18 42 42Q18 34 0 42M66 0Q54 28 66 66Q28 54 0 66M90 0Q74 40 90 90Q40 74 0 90"/></svg>';
  const SPIDER_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="#2a1d33" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M9 11L3 7M9 13L2 13M9 15L3 19M10 16L6 22M15 11L21 7M15 13L22 13M15 15L21 19M14 16L18 22"/></g><ellipse cx="12" cy="9" rx="3" ry="3" fill="#2a1d33"/><ellipse cx="12" cy="15" rx="4" ry="5" fill="#2a1d33"/><circle cx="11" cy="8.5" r=".8" fill="#ff7518"/><circle cx="13" cy="8.5" r=".8" fill="#ff7518"/></svg>';

  function buildDecorations() {
    if (document.getElementById('fx-deco') || !document.body) return;
    const deco = document.createElement('div');
    deco.id = 'fx-deco';
    deco.setAttribute('aria-hidden', 'true');
    let html = '';

    // ฮาโลวีน: ใยแมงมุม แมงมุมห้อย และค้างคาวบินผ่านจอ
    if (festival.bats) {
      html += '<div class="fx-web left">' + WEB_SVG + '</div>'
        + '<div class="fx-web right">' + WEB_SVG + '</div>'
        + '<div class="fx-spider">' + SPIDER_SVG + '</div>';
      [
        { top: 18, size: 42, dur: 16, delay: 0 },
        { top: 34, size: 30, dur: 21, delay: 6 },
        { top: 55, size: 36, dur: 18, delay: 11 },
        { top: 72, size: 26, dur: 24, delay: 3 }
      ].forEach(function (b) {
        html += '<div class="fx-bat" style="top:' + b.top + '%;width:' + b.size + 'px;animation-duration:'
          + b.dur + 's;animation-delay:' + b.delay + 's">' + BAT_SVG + '</div>';
      });
    }

    // ประกายวิบวับอยู่กับที่ (ไม่มีของร่วงจากด้านบน ตามคำขอ) — Sustainable = ไข่มุก, Magic Hour = ฝุ่นเวททอง
    if (festival.sparkles) {
      [[12, 14, 3.2, 0], [78, 9, 4.1, 1.4], [30, 33, 3.6, 2.2], [88, 40, 4.4, 0.6],
       [8, 58, 3.9, 1.9], [62, 22, 4.6, 3.1], [46, 70, 3.4, 0.9], [92, 78, 4.2, 2.6]].forEach(function (s) {
        html += '<div class="fx-sparkle" style="left:' + s[0] + '%;top:' + s[1] + '%;animation-duration:'
          + s[2] + 's;animation-delay:' + s[3] + 's"></div>';
      });
    }

    // ของที่ร่วงลงมา (หิมะ หยดน้ำ หัวใจ พลุกระดาษ) — ตำแหน่ง/ความเร็ว/ดีเลย์ต่างกันให้ดูเป็นธรรมชาติ
    (festival.fall || []).forEach(function (icon, i) {
      html += '<div class="fx-fall" style="left:' + (12 + i * 24) + '%;animation-duration:' + (14 + (i % 3) * 5)
        + 's;animation-delay:' + (i * 4) + 's">' + icon + '</div>';
    });

    // ของที่ลอยขึ้นช้าๆ จากขอบล่าง
    const riseLeft = [8, 30, 55, 78, 92];
    const riseDur = [26, 32, 28, 30, 34];
    const riseDelay = [0, 9, 4, 15, 20];
    (festival.rise || []).forEach(function (icon, i) {
      html += '<div class="fx-rise" style="left:' + riseLeft[i % 5] + '%;animation-duration:' + riseDur[i % 5]
        + 's;animation-delay:' + riseDelay[i % 5] + 's">' + icon + '</div>';
    });

    deco.innerHTML = html;
    document.body.appendChild(deco);
  }

  // ไอคอนพื้นหลังหลังการ์ดอันดับ (index.html #bg-decorations) → ไอคอนของเทศกาล
  // ภาพวาดไอคอนพื้นหลังแบบหลายสี (ใช้กับ festival.decorSvgs) — viewBox 24x24
  const DECOR_SVGS = {
    cosmos: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="#f59fbf" stroke="#fff" stroke-width=".6">'
      + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) {
        return '<ellipse cx="12" cy="6.2" rx="2.9" ry="5" transform="rotate(' + a + ' 12 12)"/>';
      }).join('')
      + '</g><circle cx="12" cy="12" r="2.7" fill="#ffd56b" stroke="#f2b84b" stroke-width=".6"/></svg>',
    ribbon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<path fill="#e8749f" d="M11 12l-3.2 8.5 2.2-1 1.4 1.6L12.4 12zM13 12l3.2 8.5-2.2-1-1.4 1.6L11.6 12z"/>'
      + '<path fill="#f590b6" d="M12 11.5C9.5 7 3.5 5.5 3.5 9.2c0 3 2 5 4.5 4.6 1.8-.3 3.2-1.2 4-2.3zM12 11.5c2.5-4.5 8.5-6 8.5-2.3 0 3-2 5-4.5 4.6-1.8-.3-3.2-1.2-4-2.3z"/>'
      + '<circle cx="12" cy="11.6" r="2" fill="#e05f92"/></svg>',
    butterfly: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<g fill="#bba8f0" stroke="#9c86de" stroke-width=".5"><path d="M11.5 11C10 6 5.5 2.5 3 4.5S2.5 11.5 7 12.6c-3 1-4 4-2 5.3s5.3-1 6.5-5.3z"/>'
      + '<path d="M12.5 11C14 6 18.5 2.5 21 4.5S21.5 11.5 17 12.6c3 1 4 4 2 5.3s-5.3-1-6.5-5.3z"/></g>'
      + '<rect x="11.3" y="7" width="1.4" height="11" rx=".7" fill="#7d6bb3"/>'
      + '<path d="M11.6 7.4L9.8 4.2M12.4 7.4l1.8-3.2" stroke="#7d6bb3" stroke-width=".7" stroke-linecap="round" fill="none"/></svg>',
    pearl: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="fxPearl" cx=".38" cy=".34" r=".7">'
      + '<stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f6e3ef"/><stop offset="1" stop-color="#d9c4ec"/></radialGradient></defs>'
      + '<circle cx="12" cy="12" r="7.5" fill="url(#fxPearl)" stroke="#e7cfe3" stroke-width=".6"/>'
      + '<ellipse cx="9.6" cy="9.2" rx="2" ry="1.3" fill="#fff" opacity=".9" transform="rotate(-30 9.6 9.2)"/></svg>',
    lavender: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M12 22.5V7" stroke="#8fb58a" stroke-width="1.4" stroke-linecap="round"/><g fill="#a48ad6">'
      + [[12, 3.6, 0], [10.6, 6.4, -25], [13.4, 6.4, 25], [10.6, 9.4, -25], [13.4, 9.4, 25], [10.8, 12.4, -25], [13.2, 12.4, 25]].map(function (b) {
        return '<ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="1.4" ry="2" transform="rotate(' + b[2] + ' ' + b[0] + ' ' + b[1] + ')"/>';
      }).join('')
      + '</g></svg>',
    // ---- ธีม Magic Hour (ดำ-แดง) ----
    candle: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<ellipse cx="12" cy="5.4" rx="3.2" ry="4" fill="#ffcf6b" opacity=".35"/>'
      + '<path d="M12 2.2c1.4 1.8 1.9 3 1.9 4a1.9 1.9 0 0 1-3.8 0c0-1 .5-2.2 1.9-4z" fill="#ffb627"/>'
      + '<path d="M12 4.4c.6.9.8 1.5.8 2a.8.8 0 0 1-1.6 0c0-.5.2-1.1.8-2z" fill="#fff3c4"/>'
      + '<rect x="9.6" y="9" width="4.8" height="11" rx="1" fill="#f4e9e1"/><path d="M9.6 10.2c1.2.8 2.2-.4 3.2.4.6.5 1.2.2 1.6-.2V9H9.6z" fill="#e6d6cb"/>'
      + '<rect x="7.5" y="19.6" width="9" height="2.2" rx="1.1" fill="#a07d3c"/></svg>',
    wand: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M4 20.5L15.5 9" stroke="#3b2414" stroke-width="2.2" stroke-linecap="round"/>'
      + '<path d="M4 20.5l3.2-3.2" stroke="#6b4423" stroke-width="2.6" stroke-linecap="round"/>'
      + '<path d="M15.5 9l1.2-1.2" stroke="#d4a24c" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M19 2.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z" fill="#ffd56b"/>'
      + '<circle cx="21" cy="9.5" r=".9" fill="#ffe7a8"/><circle cx="13.5" cy="3.5" r=".7" fill="#ffe7a8"/></svg>',
    potion: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<rect x="9.6" y="2.5" width="4.8" height="2.6" rx=".8" fill="#8a5a2b"/>'
      + '<path d="M10.2 5h3.6v3.4c3 1 5 3.6 5 6.7a6.8 6.8 0 0 1-13.6 0c0-3.1 2-5.7 5-6.7z" fill="#e9e4f2" opacity=".9"/>'
      + '<path d="M5.6 14.4h12.8a6.6 6.6 0 0 1-6.4 7.3 6.6 6.6 0 0 1-6.4-7.3z" fill="#c1121f"/>'
      + '<circle cx="10" cy="17" r="1" fill="#ff8a8f"/><circle cx="13.6" cy="18.6" r=".7" fill="#ff8a8f"/>'
      + '<path d="M8.4 10.6c-.8.8-1.2 1.8-1.3 2.8" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".8"/></svg>',
    spellbook: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M4 5.2C6.8 4 9.6 4.2 12 5.8v14c-2.4-1.6-5.2-1.8-8-.6z" fill="#7a0a12"/>'
      + '<path d="M20 5.2C17.2 4 14.4 4.2 12 5.8v14c2.4-1.6 5.2-1.8 8-.6z" fill="#a4161a"/>'
      + '<path d="M5.4 6.4c2-.7 4-.5 5.6.5v11.2c-1.6-.9-3.6-1.1-5.6-.5z" fill="#f4e9d8"/>'
      + '<path d="M18.6 6.4c-2-.7-4-.5-5.6.5v11.2c1.6-.9 3.6-1.1 5.6-.5z" fill="#efe2cc"/>'
      + '<path d="M15.8 9.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" fill="#d4a24c"/>'
      + '<path d="M6.8 9.4h3M6.8 11.4h3M6.8 13.4h2.2" stroke="#b9a07a" stroke-width=".7" stroke-linecap="round"/></svg>',
    owl: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M6 7.5L7.2 3.5 9.6 6M18 7.5l-1.2-4L14.4 6" fill="#6b4a33"/>'
      + '<ellipse cx="12" cy="13" rx="7" ry="8.4" fill="#8a6446"/>'
      + '<ellipse cx="12" cy="15.6" rx="4.2" ry="5" fill="#d9c2a3"/>'
      + '<circle cx="9.1" cy="10.2" r="2.7" fill="#f4e9d8"/><circle cx="14.9" cy="10.2" r="2.7" fill="#f4e9d8"/>'
      + '<circle cx="9.1" cy="10.3" r="1.4" fill="#d4a24c"/><circle cx="14.9" cy="10.3" r="1.4" fill="#d4a24c"/>'
      + '<circle cx="9.1" cy="10.3" r=".7" fill="#1a0a0d"/><circle cx="14.9" cy="10.3" r=".7" fill="#1a0a0d"/>'
      + '<path d="M12 11.6l-1 1.6h2z" fill="#d4a24c"/></svg>'
  };

  function swapDecorIcons() {
    // แบบภาพวาด SVG: ถอดคลาส Font Awesome ออก แล้วใส่ภาพแทน (คลาส dX-Y ตำแหน่ง/องศาเดิมยังอยู่)
    const svgs = festival.decorSvgs || {};
    document.querySelectorAll('.bg-decorations .decor-item').forEach(function (icon) {
      Object.keys(svgs).forEach(function (from) {
        if (!icon.classList.contains(from) || !DECOR_SVGS[svgs[from]]) return;
        icon.classList.remove('fa-solid', from);
        icon.classList.add('fx-decor-svg');
        icon.innerHTML = DECOR_SVGS[svgs[from]];
      });
    });

    const swaps = festival.icons || {};
    document.querySelectorAll('.bg-decorations .decor-item').forEach(function (icon) {
      Object.keys(swaps).forEach(function (from) {
        if (icon.classList.contains(from)) icon.classList.replace(from, swaps[from]);
      });
    });
  }

  // เทียนลอยกลางอากาศ (festival.floatingCandles): อยู่ช่วงบนของหน้า Home ลอยหน้าป้าย Champ ขยับขึ้นลงช้าๆ
  // ใช้ position: absolute (เลื่อนหายไปพร้อมหน้า) ไม่ใช่ fixed เลยไม่ลอยทับโพสต์ตอนเลื่อนลง; ไม่รับการแตะ
  function buildFloatingCandles() {
    if (!festival.floatingCandles || document.getElementById('fx-candles') || !document.body) return;
    const wrap = document.createElement('div');
    wrap.id = 'fx-candles';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = [
      // [ซ้าย %, บน px, ขนาด px, ระยะเวลาลอย s, ดีเลย์ s]
      [2, 62, 30, 4.6, 0], [17, 50, 22, 5.4, 1.2], [36, 60, 19, 4.9, 2.1], [56, 48, 21, 5.8, 0.6],
      [75, 56, 25, 5.1, 1.7], [90, 66, 30, 4.4, 2.6], [0, 168, 20, 5.6, 0.9], [94, 160, 20, 5.2, 2.3]
    ].map(function (c) {
      return '<div class="fx-fcandle" style="left:' + c[0] + '%;top:' + c[1] + 'px;width:' + c[2]
        + 'px;animation-duration:' + c[3] + 's;animation-delay:-' + c[4] + 's">' + DECOR_SVGS.candle + '</div>';
    }).join('');
    document.body.appendChild(wrap);
  }

  function init() {
    setThemeColor();
    buildDecorations();
    swapDecorIcons();
    buildFloatingCandles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
