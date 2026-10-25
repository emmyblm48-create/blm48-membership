// =========================================================================
// 🎵 BLM48 — รายการ Music Video (ใช้ร่วมกัน: Home แถว "Music Video" + หน้า musicvideo.html)
// เพิ่ม MV ใหม่: ใส่ไว้บนสุดของ blm48MVs (เรียงใหม่ → เก่า) ใส่ title / date / image / link
// =========================================================================
const blm48MVs = [
   { 
    title: "【Cover】มปร. (It’s OK.) - BLM48", 
    date: "4 October 2026",
    image: "https://lh3.googleusercontent.com/d/1_YU62p83JdEfJtzyMEnF_0iCWyHmQbVq=s1000",
    link: "https://youtu.be/gxRNWB1iBJA?si=jp7Be1TwkQ7HBA1t"
  },   
   { 
    title: "【Thai ver.】Rapsodi - BLM48", 
    date: "26 September 2026",
    image: "https://lh3.googleusercontent.com/d/1w76J_EDRQBmuxedSm7NkJ6kLL4WCn6J9=s1000",
    link: "https://youtu.be/g-IiXvDfBRg?si=INlaVJN0wNOd_kzz"
  },  
   { 
    title: "【Thai ver.】NEW SHIP / BLM48", 
    date: "5 September 2026",
    image: "https://lh3.googleusercontent.com/d/17_oA1gsb5v8B3OdnAqhy_RWaGrrYh-QK=s1000",
    link: "https://youtube.com/watch?v=z8E1PEdRCac"
  },
   { 
    title: "【Thai ver.】Suki-ish ( 好きish ) - BLM48", 
    date: "16 August 2026",
    image: "https://lh3.googleusercontent.com/d/1cVLuEr53ofCWXbE-A97t0bZ5MFDWHv__=s1000",
    link: "https://youtu.be/euoIySADf2c?si=a3zjAkdLnbDsNZNg"
  },
   { 
    title: "【Thai ver.】Kimi wa Motto Dekiru / BLM48", 
    date: "10 August 2026",
    image: "https://lh3.googleusercontent.com/d/1APdcxbFMY2NVg73HxvGiwx6DvLiapGSo=s1000",
    link: "https://youtu.be/EDNEaF8ujLw?si=K_L20wJs3WVlqgVo"
  },     
   { 
    title: "【Cover】Nagiichi (Thai ver.) / BLM48 ", 
    date: "25 June 2026",
    image: "https://lh3.googleusercontent.com/d/1yx9L-d9mNZlxuVJ-RMH93sLW0OtYY5mK=s1000",
    link: "https://youtu.be/bhbjo1UWOwU?si=aPsCrkof5edM5C-V"
  },
   { 
    title: "【Cover】Dakishimecha Ikenai - กอดเธอไม่ได้หรอก ( Thai Version ) / BLM48 ", 
    date: "20 June 2026",
    image: "https://lh3.googleusercontent.com/d/12oY6a47NtLHsAyqsavAPUw6TSPbYYwRa=s1000",
    link: "https://youtu.be/f9t5C4K3Wk0?si=E29cE4T9qSV7BZ9u"
  },
  { 
    title: "【Cover】Sustainable ( Thai Version ) / BLM48 ", 
    date: "25 April 2026",
    image: "https://lh3.googleusercontent.com/d/1WXp1ZbzQ8ib1gb3imrDGQ7KjnFJZUaOO=s1000",
    link: "https://youtu.be/1Vwg1iQUDtc?si=kVNFI4TQdqiNF-Zs"
  },
  { 
    title: "【Cover】Celebration / BLM48 ", 
    date: "4 April 2026",
    image: "https://lh3.googleusercontent.com/d/11zU0OJFxJ9WFzqQvfrqPJrCUUyG-KJZJ=s1000",
    link: "https://youtu.be/TAPlWWZMGFQ?si=v7ikM7O89ftDQ2S8"
  },
  { 
    title: "【Cover】Sekai no Hito e - ถึงบรรเลง..ถ้อยเพลงของเรา ( Thai ver. ) / BLM48 ", 
    date: "21 March 2026",
    image: "https://lh3.googleusercontent.com/d/1wD34e9W6bHHuf9SJ_qBf6I_4e-c_oLen=s1000",
    link: "https://youtu.be/tqFr0QPgqR0?si=31bFJP2MmgCRiFre"
  },
  { 
    title: "【Male Cover】Eien Pressure – ผูกพันนิรันดร์ / BLM48 ", 
    date: "28 February 2026",
    image: "https://lh3.googleusercontent.com/d/1-GMwAgsjKBORWgEHNKPUyecvDRo1w-Gc=s1000",
    link: "https://www.youtube.com/watch?v=-rhmBTZoZk0"
  },
  { 
    title: "【Cover】Oh my pumpkin! ( CGM48 Version ) / BLM48 ", 
    date: "15 February 2026",
    image: "https://lh3.googleusercontent.com/d/1RUXDQSqKG43mWcJ01uNmwDMj8ARugdwS=s1000",
    link: "https://youtu.be/03UW5ok6de4?si=c5vM4PtXGipCbO1O"
  },
  { 
    title: "【Cover】Bingo! ( Thai ver. ) / BLM48 ", 
    date: "31 January 2026",
    image: "https://lh3.googleusercontent.com/d/1UY2KxZBjcAQQJc2XHUvmtsGNG9rSFn5A=s1000",
    link: "https://youtu.be/QaxSjLIxcSE?si=8G7rfyE3_mxaQ6sH"
  }
];

// "4 October 2026" -> "4 Oct 2026" (แบบการ์ดวิดีโอในรูปอ้างอิง) ถ้าแปลงไม่ได้ใช้ข้อความเดิม
function formatMvDate(raw) {
  const d = new Date(raw);
  if (isNaN(d)) return mvEsc(raw || "");
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return d.getDate() + " " + M[d.getMonth()] + " " + d.getFullYear();
}

function mvEsc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}

// ป้ายริบบิ้นมุมขวาบน (ไอคอนเล่น + BLM 48)
const MV_RIBBON_HTML = '<div class="mv-ribbon"><i class="fa-regular fa-circle-play"></i><span>BLM</span><span>48</span></div>';

function openMv(mv) {
  if (mv && mv.link) window.open(mv.link, "_blank");
}

// ---------- ยอดวิว (จาก EmmyBLM48 Official Site ผ่าน /api/mv-views) ----------
const MV_VIEWS_CACHE_KEY = "blm48_mv_views";

// ดึง YouTube ID จากลิงก์ (youtu.be/ID, watch?v=ID)
function mvYoutubeId(link) {
  const m = String(link || "").match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  return m ? m[1] : "";
}

// 1373 -> "1.4K views" (แบบ iAM48)
function formatMvViews(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M views";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K views";
  return n + " views";
}

// ช่องยอดวิวในการ์ด (ซ่อนไว้จนกว่าจะได้ตัวเลข คลิปที่ไม่มีข้อมูลจะโชว์แค่วันที่)
function mvViewsHtml(mv) {
  const id = mvYoutubeId(mv.link);
  return id ? `<span class="mv-views" data-mv-yt="${id}" hidden></span>` : "";
}

function fillMvViews(views) {
  document.querySelectorAll(".mv-views[data-mv-yt]").forEach(el => {
    const n = views[el.dataset.mvYt];
    if (n == null) return;
    el.textContent = formatMvViews(n);
    el.hidden = false;
  });
}

// โชว์ตัวเลขจาก cache ทันที แล้วค่อยอัปเดตจากเซิร์ฟเวอร์
function loadMvViews() {
  try {
    const cached = JSON.parse(localStorage.getItem(MV_VIEWS_CACHE_KEY) || "null");
    if (cached) fillMvViews(cached);
  } catch (e) {}
  fetch("/api/mv-views")
    .then(r => (r.ok ? r.json() : null))
    .then(d => {
      if (!d || !d.views) return;
      fillMvViews(d.views);
      try { localStorage.setItem(MV_VIEWS_CACHE_KEY, JSON.stringify(d.views)); } catch (e) {}
    })
    .catch(() => {});
}
