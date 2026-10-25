// GET /api/mv-views → { updated, views: { [youtubeId]: count } }
// ยอดวิว Music Video ดึงจาก EmmyBLM48 Official Site (/api/views ซึ่งใช้ YouTube Data API)
// ต้องเรียกฝั่งเซิร์ฟเวอร์ เพราะ /api/views ของเว็บนั้นไม่ส่ง CORS header ให้เบราว์เซอร์เรียกข้ามโดเมนได้
// คลิปที่ไม่มีใน data.js ของ Official Site จะไม่มียอดวิว (หน้าเว็บจะโชว์แค่วันที่)
const SOURCE = "https://emmyblm48.vercel.app/api/views";

module.exports = async (req, res) => {
  try {
    const r = await fetch(SOURCE);
    if (!r.ok) throw new Error(`official site ${r.status}`);
    const d = await r.json();
    if (!d || !d.views) throw new Error("no views");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ updated: d.updated, views: d.views });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ error: String(e.message || e) });
  }
};
