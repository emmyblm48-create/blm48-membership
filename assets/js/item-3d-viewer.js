// 🔍 ดูสินค้าแบบ 3D: ลากหมุนการ์ด/สินค้าได้รอบทิศ + แสงโฮโลแกรมตามมุม · แตะสองครั้ง = พลิกดูด้านหลัง
// ใช้: blm48Open3DViewer({ image, label, isSSR, collection?, collectionId? })
(function () {
  const BACK_LOGO = 'https://lh3.googleusercontent.com/d/1p6lV8bD6VVjR-Ys2EnpcQH1AOsnahQSp=s300';

  // 🖼️ ด้านหลังของสินค้าตามรูปทรงในแต่ละคอลเลกชัน (ไม่อยู่ในรายการ = ด้านหลังสีเหลือง + โลโก้เดิม)
  const BG_OCTAGON   = 'https://lh3.googleusercontent.com/d/1FfSfvrqEYzpYerms1NQtRyU8XkXnxi7K=s1000';
  const BG_CIRCLE    = 'https://lh3.googleusercontent.com/d/1cD2O5kLlkbAqQ31S88t1YWzlmoUGMnHs=s1000';
  const BG_PHOTOCARD = 'https://lh3.googleusercontent.com/d/1LRRKV6c7W-bV-_0x5Uhd4CKUkxVNJ4u2=s1000';
  const COLLECTION_BG = {
    'BLM48 Limited Coaster "BLM48 5th Generation"': BG_OCTAGON,
    'BLM48 Limited Coaster "Sustainable"': BG_OCTAGON,
    'BLM48 Limited Coaster "BINGO!"': BG_CIRCLE,
    'BLM48 Limited Coaster "New Ship"': BG_CIRCLE,
    'Concert 2026 - This Letter Says "Marry Me"': BG_PHOTOCARD,
    'BLM48 Tanabata 2026': BG_PHOTOCARD,
    'BLM48 Kami 7 in Bloom': BG_PHOTOCARD
  };
  // หน้า Success! ใช้ collection_id ของรางวัล
  const COLLECTION_ID_BG = {
    gacha_gen5: BG_OCTAGON, gacha_single10: BG_OCTAGON,
    gacha_single9: BG_CIRCLE, gacha_5thGenNewShip: BG_CIRCLE,
    votemajor_tanabata2026: BG_PHOTOCARD
  };
  function backFor(opts) {
    const name = String(opts.collection || '').trim();
    return COLLECTION_BG[name] || COLLECTION_ID_BG[opts.collectionId] || '';
  }

  function injectStyles() {
    if (document.getElementById('blm48-3d-style')) return;
    const st = document.createElement('style');
    st.id = 'blm48-3d-style';
    st.textContent = `
      .v3d-overlay { position: fixed; inset: 0; z-index: 21000; display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: radial-gradient(circle at 50% 40%, #f0454b 0%, #c8151d 55%, #8f0c12 100%); font-family: 'Quicksand', 'Kanit', sans-serif; color: #fff;
        touch-action: none; user-select: none; -webkit-user-select: none; opacity: 0; transition: opacity 0.25s; }
      .v3d-overlay.show { opacity: 1; }
      .v3d-close { position: absolute; top: calc(14px + env(safe-area-inset-top)); right: 14px; width: 40px; height: 40px; border-radius: 50%;
        border: none; background: rgba(255,255,255,0.12); color: #fff; font-size: 18px; cursor: pointer; }
      .v3d-title { position: absolute; top: calc(22px + env(safe-area-inset-top)); left: 16px; right: 64px; font-size: 15px; font-weight: 600;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .v3d-title .ssr { display: inline-block; font-size: 11px; font-weight: 700; color: #3b2a00; background: linear-gradient(135deg,#ffe9a3,#f3c548);
        border-radius: 999px; padding: 2px 8px; margin-left: 6px; vertical-align: 1px; }
      .v3d-scene { perspective: 1100px; width: 100%; display: flex; justify-content: center; }
      .v3d-card { position: relative; width: min(68vw, 300px); transform-style: preserve-3d; cursor: grab; will-change: transform; }
      .v3d-card:active { cursor: grabbing; }
      .v3d-face { position: absolute; inset: 0; border-radius: 14px; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      /* เงาตามรูปทรงของจริง (ของทรงกลม/พื้นใส เช่น Coaster จะไม่เห็นกรอบสี่เหลี่ยม) */
      .v3d-front img { width: 100%; height: 100%; object-fit: contain; display: block; pointer-events: none; -webkit-touch-callout: none;
        filter: drop-shadow(0 22px 26px rgba(0,0,0,0.5)) brightness(var(--br, 1)) saturate(var(--sat, 1)); }
      .v3d-back { transform: rotateY(180deg); background: linear-gradient(135deg, #ffe680, #ffd23f); display: flex; align-items: center; justify-content: center;
        overflow: hidden; box-shadow: 0 24px 50px rgba(0,0,0,0.45); }
      .v3d-back img { width: 42%; border-radius: 22%; pointer-events: none; }
      /* ด้านหลังเป็นรูปจริงของสินค้า: Coaster ทรงแปดเหลี่ยม/วงกลม (พื้นใส) ใช้เงาตามรูปทรง, Photocard เต็มใบ */
      /* จัดวางแบบเดียวกับด้านหน้าทุกอย่าง (ไม่ใช้ flex) ให้ขนาดเท่าด้านหน้าพอดีทุกเบราว์เซอร์ */
      .v3d-back.is-art { display: block; background: none; box-shadow: none; overflow: visible; border-radius: 0; }
      .v3d-back.is-art img { display: block; width: 100%; height: 100%; object-fit: contain; border-radius: 0; -webkit-touch-callout: none;
        filter: drop-shadow(0 22px 26px rgba(0,0,0,0.5)); }
      .v3d-back.is-art.is-card { overflow: hidden; border-radius: 14px; box-shadow: 0 24px 50px rgba(0,0,0,0.45); }
      .v3d-back.is-art.is-card img { object-fit: cover; filter: none; }
      /* 🥤 แก้ว Cafe 3D */
      .v3d-card.is-cup { cursor: grab; }
      .v3d-card.is-cup.cup-ready .v3d-face { display: none; }
      .v3d-cup, .v3d-cup-part { position: absolute; left: 50%; top: 0; width: 0; height: 0; transform-style: preserve-3d; }
      .v3d-cup-part { left: 0; }
      .v3d-cup-facet, .v3d-cup-disc { position: absolute; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .v3d-cup-facet { background-repeat: no-repeat; }
      .v3d-cup-facet i { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
      .v3d-cup-facet .sh { background: #1a0000; }
      .v3d-cup-facet .hl { background: #fff; }
      .v3d-cup-disc { border-radius: 50%; }
      .v3d-hint { margin-top: 34px; font-size: 12.5px; color: rgba(255,255,255,0.6); text-align: center; }
      .v3d-actions { margin-top: 14px; display: flex; gap: 10px; }
      .v3d-btn { border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); color: #fff; border-radius: 999px; padding: 8px 16px;
        font-family: inherit; font-size: 13px; cursor: pointer; }
    `;
    document.head.appendChild(st);
  }

  // =========================================================================
  // 🥤 แก้วเครื่องดื่ม BLM48 Cafe แบบ 3D จริง: ตัวแก้วทรงกรวยหมุนได้รอบ (ห่อลายจากรูปสินค้า) + ฝาโดม + จุกแดง + หลอด
  // รูปเครื่องดื่มทุกแก้วใช้แม่แบบเดียวกัน (วัดจากรูป 800x1000) ค่าในนี้เป็นสัดส่วนของ "ความสูงรูป"
  // x ในรูปคิดเป็นสัดส่วนความกว้าง (กว้าง = 0.8 ของความสูง)
  // =========================================================================
  const CUP = {
    aspect: 0.8, cxN: 0.527,
    body: { y0: 0.355, y1: 0.925, rTop: 0.1768, rBot: 0.1186 },
    lid: { y0: 0.264, y1: 0.355, rTop: 0.161, rBot: 0.1944 },
    straw: { x: 0.145, y: 0.262, len: 0.225, r: 0.0245, tilt: 18 },
    plug: { x: -0.115, z: 0.075, r: 0.022, h: 0.016 }
  };
  const SIDE_DEG = 50; // เกินมุมนี้ (ด้านข้าง/ด้านหลังแก้ว) ใช้สีชั้นเครื่องดื่มเรียบๆ ไม่มีโลโก้

  function isCafeDrink(opts) {
    return !!opts.cup;
  }

  // เช็กว่ารูปเป็นแม่แบบแก้วเดียวกันจริง (กลางตัวแก้วทึบ, ข้างแก้วโปร่งใส) ไม่ใช่ก็ใช้การ์ดแบนแบบเดิม
  function looksLikeCup(d, iw, ih) {
    const a = (xn, yn) => d[(Math.round(yn * ih) * iw + Math.round(xn * iw)) * 4 + 3];
    return a(0.527, 0.6) > 200 && a(0.527, 0.4) > 200 && a(0.12, 0.6) < 30 && a(0.9, 0.6) < 30 && a(0.527, 0.985) < 30 && a(0.45, 0.1) < 30;
  }

  // คลี่ลายรอบแก้ว: แต่ละคอลัมน์ = มุมรอบแก้ว (-180..180, หน้า = 0) อ่านพิกเซลจากรูปด้านหน้าตามรัศมีของแถวนั้น
  function unwrapTexture(d, iw, ih, part, U) {
    const Y0 = Math.round(part.y0 * ih), Y1 = Math.round(part.y1 * ih), Hh = Math.max(1, Y1 - Y0);
    const c = document.createElement('canvas'); c.width = U; c.height = Hh;
    const ctx = c.getContext('2d');
    const out = ctx.createImageData(U, Hh);
    const side = Math.sin(SIDE_DEG * Math.PI / 180);
    for (let v = 0; v < Hh; v++) {
      const k = v / Hh;
      const rN = (part.rTop + (part.rBot - part.rTop) * k) / CUP.aspect * 0.97;
      const Y = Y0 + v;
      for (let u = 0; u < U; u++) {
        const th = ((u + 0.5) / U) * 2 * Math.PI - Math.PI;
        let s = Math.sin(th);
        if (Math.abs(th) > SIDE_DEG * Math.PI / 180) s = Math.sign(th) * side;
        const X = Math.min(iw - 1, Math.max(0, Math.round((CUP.cxN + rN * s) * iw)));
        const si = (Y * iw + X) * 4, di = (v * U + u) * 4;
        out.data[di] = d[si]; out.data[di + 1] = d[si + 1]; out.data[di + 2] = d[si + 2]; out.data[di + 3] = d[si + 3];
      }
    }
    ctx.putImageData(out, 0, 0);
    return c;
  }
  function pixelAt(d, iw, ih, xn, yn) {
    const i = (Math.round(yn * ih) * iw + Math.round(xn * iw)) * 4;
    return `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`;
  }

  // ทรงกรวยตัด (ใช้ทั้งตัวแก้วและขอบฝา) แต่ละด้านเป็นแผ่นสี่เหลี่ยมคางหมู + เงาตามแสง
  function addCone(root, size, part, texUrl, N, lit) {
    const h = (part.y1 - part.y0) * size;
    const rt = part.rTop * size, rb = part.rBot * size;
    const slant = Math.hypot(h, rt - rb);
    const alpha = Math.atan2(rt - rb, h) * 180 / Math.PI;
    const wT = 2 * rt * Math.tan(Math.PI / N) + 1.2, wB = 2 * rb * Math.tan(Math.PI / N) + 1.2;
    const w = Math.max(wT, wB), inset = Math.abs(wT - wB) / 2 / w * 100;
    const clip = wT >= wB ? `polygon(0 0, 100% 0, ${100 - inset}% 100%, ${inset}% 100%)` : `polygon(${inset}% 0, ${100 - inset}% 0, 100% 100%, 0 100%)`;
    const rMid = (rt + rb) / 2, yMid = (part.y0 + part.y1) / 2 * size;
    for (let i = 0; i < N; i++) {
      const th = -180 + (i + 0.5) * 360 / N;
      const f = document.createElement('div');
      f.className = 'v3d-cup-facet';
      f.style.cssText = `width:${w}px;height:${slant}px;left:${-w / 2}px;top:${yMid - slant / 2}px;clip-path:${clip};-webkit-clip-path:${clip};` +
        `background-image:url("${texUrl}");background-size:${N * 100}% 100%;background-position:${(i / (N - 1)) * 100}% 0;` +
        `transform:rotateY(${th}deg) translateZ(${rMid}px) rotateX(${-alpha}deg);`;
      f.innerHTML = '<i class="sh"></i><i class="hl"></i>';
      root.appendChild(f);
      lit.push({ th, sh: f.children[0], hl: f.children[1], gloss: 1 });
    }
  }
  function addDisc(root, r, y, up, bg, extra) {
    const d = document.createElement('div');
    d.className = 'v3d-cup-disc';
    d.style.cssText = `width:${2 * r}px;height:${2 * r}px;left:${-r}px;top:${y - r}px;background:${bg};` +
      `transform:${extra || ''} rotateX(${up ? 90 : -90}deg);`;
    root.appendChild(d);
    return d;
  }
  function addTube(parent, r, len, N, color, lit, gloss) {
    for (let i = 0; i < N; i++) {
      const th = (i + 0.5) * 360 / N;
      const w = 2 * r * Math.tan(Math.PI / N) + 0.8;
      const f = document.createElement('div');
      f.className = 'v3d-cup-facet';
      f.style.cssText = `width:${w}px;height:${len}px;left:${-w / 2}px;top:${-len}px;background:${color};transform:rotateY(${th}deg) translateZ(${r}px);`;
      f.innerHTML = '<i class="sh"></i><i class="hl"></i>';
      parent.appendChild(f);
      lit.push({ th, sh: f.children[0], hl: f.children[1], gloss });
    }
  }

  // คืน { update(rx, ry) } หรือ null ถ้ารูปไม่ใช่แม่แบบแก้ว
  async function buildCafeCup(card, imageUrl) {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.src = imageUrl;
    await im.decode();
    const iw = im.naturalWidth, ih = im.naturalHeight;
    if (!iw || Math.abs(iw / ih - CUP.aspect) > 0.02) return null;
    const cv = document.createElement('canvas'); cv.width = iw; cv.height = ih;
    const cx = cv.getContext('2d');
    cx.drawImage(im, 0, 0);
    const d = cx.getImageData(0, 0, iw, ih).data;
    if (!looksLikeCup(d, iw, ih)) return null;

    const toUrl = c => new Promise(res => c.toBlob(b => res(b ? URL.createObjectURL(b) : c.toDataURL()), 'image/png'));
    const bodyTex = await toUrl(unwrapTexture(d, iw, ih, CUP.body, 1024));
    const lidTex = await toUrl(unwrapTexture(d, iw, ih, CUP.lid, 1024));
    const topColor = pixelAt(d, iw, ih, 0.40, 0.38);
    const bottomColor = pixelAt(d, iw, ih, 0.527, 0.90);

    const size = card.clientHeight || 360;
    const root = document.createElement('div');
    root.className = 'v3d-cup';
    const lit = [];
    // เงาแก้วบนพื้นโต๊ะ (หมุนไปพร้อมแก้ว)
    addDisc(root, CUP.body.rBot * size * 1.9, CUP.body.y1 * size + 3, true, 'radial-gradient(closest-side, rgba(50,0,0,0.5), rgba(50,0,0,0))');
    addCone(root, size, CUP.body, bodyTex, 40, lit);
    addCone(root, size, CUP.lid, lidTex, 40, lit);
    addDisc(root, CUP.body.rBot * size, CUP.body.y1 * size - 1, false, bottomColor);
    addDisc(root, CUP.lid.rBot * size, CUP.lid.y1 * size, false, 'rgba(225,228,232,0.95)');
    // ฝาบน: พลาสติกใสเห็นสีเครื่องดื่มชั้นบนจางๆ + วงขอบ
    addDisc(root, CUP.lid.rTop * size, CUP.lid.y0 * size, true,
      `radial-gradient(circle at 42% 40%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 55%, rgba(210,214,220,0.7) 70%, rgba(255,255,255,0.55) 74%, rgba(190,195,202,0.75) 100%), ${topColor}`);

    // จุกแดงบนฝา
    const plug = document.createElement('div');
    plug.className = 'v3d-cup-part';
    plug.style.transform = `translate3d(${CUP.plug.x * size}px, ${CUP.lid.y0 * size}px, ${CUP.plug.z * size}px)`;
    addTube(plug, CUP.plug.r * size, CUP.plug.h * size, 10, '#e5262f', lit, 0.6);
    addDisc(plug, CUP.plug.r * size, -CUP.plug.h * size, true, 'radial-gradient(circle at 40% 35%, #ff6b6b, #c8151d)');
    root.appendChild(plug);

    // หลอดสีฟ้าใส เอียงไปทางขวา
    const straw = document.createElement('div');
    straw.className = 'v3d-cup-part';
    straw.style.transform = `translate3d(${CUP.straw.x * size}px, ${(CUP.straw.y + 0.02) * size}px, 0) rotateZ(${CUP.straw.tilt}deg)`;
    const sLen = (CUP.straw.len + 0.02) * size;
    addTube(straw, CUP.straw.r * size, sLen, 12, 'rgba(150,200,232,0.82)', lit, 1.2);
    addDisc(straw, CUP.straw.r * size, -sLen, true, 'radial-gradient(circle, rgba(70,120,160,0.9) 55%, rgba(170,215,240,0.95) 60%)');
    root.appendChild(straw);

    card.appendChild(root);

    return {
      update(rx, ry) {
        // แสงหลักมาจากหน้า-ซ้ายบน: ด้านที่หันหาแสงสว่าง ด้านหลังเข้ม + ไฮไลต์พลาสติกเป็นแถบแนวตั้ง
        for (const f of lit) {
          const a = (f.th + ry) * Math.PI / 180;
          const diff = Math.cos(a + 0.55);
          const shade = Math.max(0, 0.5 - diff * 0.42);
          const spec = Math.pow(Math.max(0, Math.cos(a + 0.35)), 28) * 0.55 * f.gloss;
          f.sh.style.opacity = shade.toFixed(3);
          f.hl.style.opacity = spec.toFixed(3);
        }
      }
    };
  }

  window.blm48Open3DViewer = function (opts) {
    injectStyles();
    const o = document.createElement('div');
    o.className = 'v3d-overlay';
    const backArt = backFor(opts);
    const backClass = backArt ? ' is-art' + (backArt === BG_PHOTOCARD ? ' is-card' : '') : '';
    o.innerHTML = `
      <div class="v3d-title"></div>
      <button type="button" class="v3d-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <div class="v3d-scene">
        <div class="v3d-card${opts.isSSR ? ' is-ssr' : ''}">
          <div class="v3d-face v3d-front"><img alt="" draggable="false"></div>
          <div class="v3d-face v3d-back${backClass}"><img src="${backArt || BACK_LOGO}" alt="" draggable="false"></div>
        </div>
      </div>
      <div class="v3d-hint">Drag to rotate · Double-tap to flip</div>
      <div class="v3d-actions">
        <button type="button" class="v3d-btn" data-act="flip"><i class="fa-solid fa-rotate"></i> Flip</button>
        <button type="button" class="v3d-btn" data-act="reset"><i class="fa-solid fa-arrows-to-dot"></i> Reset</button>
      </div>`;
    const titleEl = o.querySelector('.v3d-title');
    titleEl.textContent = opts.label || '';
    if (opts.isSSR) titleEl.insertAdjacentHTML('beforeend', '<span class="ssr">SSR</span>');
    const card = o.querySelector('.v3d-card');
    const img = o.querySelector('.v3d-front img');
    let cupMode = isCafeDrink(opts);
    let cup = null;
    card.style.aspectRatio = cupMode ? String(CUP.aspect) : '5 / 7';
    img.onload = () => { if (!cup && img.naturalWidth && img.naturalHeight) card.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight; };
    img.src = opts.image || '';
    if (cupMode) {
      card.classList.add('is-cup');
      o.querySelector('.v3d-hint').textContent = 'Drag to rotate · Double-tap to spin';
      o.querySelector('[data-act="flip"]').innerHTML = '<i class="fa-solid fa-rotate"></i> Spin';
    }
    document.body.appendChild(o);
    // สร้างแก้ว 3D หลังวางลงหน้าแล้ว (ต้องรู้ขนาดจริง) ถ้าไม่สำเร็จก็แสดงเป็นการ์ดแบนเหมือนเดิม
    if (cupMode) {
      const asCard = () => { // สร้างแก้วไม่ได้ → กลับเป็นการ์ดแบน (พลิกดูด้านหลังได้ตามปกติ)
        cupMode = false;
        card.classList.remove('is-cup');
        o.querySelector('.v3d-hint').textContent = 'Drag to rotate · Double-tap to flip';
        o.querySelector('[data-act="flip"]').innerHTML = '<i class="fa-solid fa-rotate"></i> Flip';
      };
      buildCafeCup(card, opts.image || '').then(c => {
        if (!c) { asCard(); return; }
        cup = c;
        card.style.aspectRatio = String(CUP.aspect);
        card.classList.add('cup-ready');
      }).catch(err => { console.warn('cafe cup 3d:', err); asCard(); });
    }
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => o.classList.add('show'));

    let rx = -8, ry = -18;          // มุมปัจจุบัน
    let vx = 0, vy = 0;             // ความเร็วหลังปล่อยนิ้ว (เฉื่อย)
    let dragging = false, lastX = 0, lastY = 0, lastT = 0;
    let touched = false, idleT = 0, raf = 0, target = null;

    function apply() {
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      if (cup) { cup.update(rx, ry); return; }
      // แสงสะท้อนตามมุมเอียง (SSR วาวกว่า)
      const tilt = Math.sin(ry * Math.PI / 180) * 0.6 + Math.sin(rx * Math.PI / 180) * 0.4;
      card.style.setProperty('--br', (1 + tilt * (opts.isSSR ? 0.28 : 0.16)).toFixed(3));
      card.style.setProperty('--sat', (1 + Math.abs(tilt) * (opts.isSSR ? 0.5 : 0.15)).toFixed(3));
    }

    function loop(t) {
      if (target) { // หมุนไปมุมเป้าหมาย (พลิก / จัดตรง)
        rx += (target.rx - rx) * 0.14; ry += (target.ry - ry) * 0.14;
        if (Math.abs(target.rx - rx) < 0.2 && Math.abs(target.ry - ry) < 0.2) { rx = target.rx; ry = target.ry; target = null; }
      } else if (!dragging) {
        if (Math.abs(vx) > 0.02 || Math.abs(vy) > 0.02) { ry += vy; rx += vx; vx *= 0.94; vy *= 0.94; }
        else if (!touched && cupMode) { idleT += 0.016; ry = -18 + idleT * 28; rx = -12 + Math.sin(idleT * 0.9) * 4; } // แก้ว: หมุนช้าๆ บนแท่นก่อนผู้ใช้แตะ
        else if (!touched) { idleT += 0.016; ry = -18 + Math.sin(idleT * 1.2) * 16; rx = -8 + Math.sin(idleT * 0.9) * 5; } // โยกเบาๆ ก่อนผู้ใช้แตะ
        rx = Math.max(-40, Math.min(40, rx));
      }
      apply();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    let lastTap = 0;
    function flip() {
      touched = true; vx = vy = 0;
      // แก้ว: หมุนรอบหนึ่งรอบ / การ์ด: พลิกดูด้านหลัง
      target = cupMode ? { rx: -10, ry: Math.round(ry / 360) * 360 + 360 } : { rx: 0, ry: Math.round((ry + 180) / 180) * 180 };
    }

    o.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      const now = Date.now();
      if (now - lastTap < 300) { flip(); lastTap = 0; return; }
      lastTap = now;
      dragging = true; touched = true; target = null; vx = vy = 0;
      lastX = e.clientX; lastY = e.clientY; lastT = now;
      o.setPointerCapture(e.pointerId);
    });
    o.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      ry += dx * 0.45; rx = Math.max(-40, Math.min(40, rx - dy * 0.35));
      const now = Date.now(), dt = Math.max(16, now - lastT);
      vy = dx * 0.45 * (16 / dt); vx = -dy * 0.35 * (16 / dt);
      lastX = e.clientX; lastY = e.clientY; lastT = now;
    });
    const end = () => { dragging = false; };
    o.addEventListener('pointerup', end);
    o.addEventListener('pointercancel', end);

    o.querySelector('[data-act="flip"]').addEventListener('click', flip);
    o.querySelector('[data-act="reset"]').addEventListener('click', () => { touched = true; vx = vy = 0; target = { rx: 0, ry: Math.round(ry / 360) * 360 }; });

    function close() {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      o.classList.remove('show');
      document.documentElement.style.overflow = '';
      setTimeout(() => o.remove(), 250);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    o.querySelector('.v3d-close').addEventListener('click', close);
  };
})();
