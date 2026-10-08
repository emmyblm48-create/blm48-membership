// =========================================================================
// 🌐 BLM48 Membership — ระบบเปลี่ยนภาษา (ไทย = ค่าเริ่มต้น / English / 日本語)
// โหลดใน <head> ของทุกหน้า "ก่อน" สคริปต์อื่น — ทำงานแบบแปลข้อความบนจอตอนรันไทม์:
//   1) เทียบข้อความทั้งก้อน (exact) กับพจนานุกรมด้านล่าง
//   2) ข้อความที่มีตัวเลขปน (เช่น "Buy Now · 120 Tokens") เทียบแบบ template {n}
//   3) EN/JP: ข้อความไทยที่ต่อกันจากหลายท่อน แปลทีละท่อน (เฉพาะท่อนที่ไม่ติดตัวอักษรไทยอื่น)
// ใช้ MutationObserver จับทุกอย่างที่ถูกเพิ่มเข้า DOM ภายหลัง (Swal, ฟีด, ฯลฯ) อัตโนมัติ
// ไม่แปลเนื้อหาที่ผู้ใช้เขียนเอง: ใส่ translate="no" หรือ class="notranslate" ที่ element นั้น
// เพิ่มคำใหม่: เพิ่มแถว [ไทย, English, 日本語] ใน DICT — ช่องไทยเว้น "" = โหมดไทยคงคำอังกฤษไว้
// =========================================================================
(function () {
  var LANGS = { th: 'ไทย', en: 'English', ja: '日本語' };
  var lang = 'th';
  try { var saved = localStorage.getItem('blm48_lang'); if (LANGS[saved]) lang = saved; } catch (e) {}
  window.BLM48_LANG = lang;
  window.BLM48_LANGS = LANGS;
  window.blm48SetLang = function (l) {
    if (!LANGS[l]) return;
    try { localStorage.setItem('blm48_lang', l); } catch (e) {}
    location.reload();
  };
  document.documentElement.lang = lang;

  var Z = '​'; // ใช้แทน "ไม่ต้องแสดงอะไร" (เช่น "น." หลังเวลา ในภาษาอังกฤษ/ญี่ปุ่น)

  // [ไทย, English, 日本語]
  var DICT = [
    // ---------- เมนูหลัก / ทั่วไป ----------
    ["หน้าแรก", "Home", "ホーム"],
    ["", "Major Vote", "メジャー投票"],
    ["", "Major vote", "メジャー投票"],
    ["การแจ้งเตือน", "Notification", "お知らせ"],
    ["การแจ้งเตือน", "Notifications", "お知らせ"],
    ["โปรไฟล์", "Profile", "プロフィール"],
    ["คลังไอเทม", "Inventory", "インベントリ"],
    ["ร้านค้า", "Shop", "ショップ"],
    ["ค้นหา", "SEARCH", "検索"],
    ["ค้นพบ", "Discover", "ディスカバー"],
    ["ดูทั้งหมด", "View All", "すべて見る"],
    ["กำลังโหลด...", "Loading...", "読み込み中..."],
    ["กำลังโหลด...", "LOADING...", "読み込み中..."],
    ["กำลังโหลดข้อมูล...", "Loading data...", "データを読み込み中..."],
    ["ยกเลิก", "Cancel", "キャンセル"],
    ["ปิด", "Close", "閉じる"],
    ["ย้อนกลับ", "Back", "戻る"],
    ["บันทึก", "Save", "保存"],
    ["ส่ง", "Send", "送信"],
    ["ส่ง", "SEND", "送信"],
    ["ยืนยัน", "Confirm", "確認"],
    ["การยืนยัน", "Confirmation", "確認"],
    ["ใช่", "Yes", "はい"],
    ["ไม่", "No", "いいえ"],
    ["เสร็จสิ้น", "Done", "完了"],
    ["สำเร็จ", "Success", "成功"],
    ["สำเร็จ!", "Success!", "成功！"],
    ["ข้อผิดพลาด", "Error", "エラー"],
    ["ข้อผิดพลาด:", "Error:", "エラー:"],
    ["เกิดข้อผิดพลาด", "Error Occurred", "エラーが発生しました"],
    ["เครือข่ายขัดข้อง", "Network error", "ネットワークエラー"],
    ["แก้ไข", "Edit", "編集"],
    ["คัดลอก", "Copy", "コピー"],
    ["คัดลอกแล้ว", "Copied", "コピーしました"],
    ["รีเฟรช", "Refresh", "更新"],
    ["ทั้งหมด", "All", "すべて"],
    ["รายละเอียด", "Detail", "詳細"],
    ["ดูเพิ่มเติม", "More", "もっと見る"],
    ["อ่าน", "Read", "読む"],
    ["ไม่มีค่าใช้จ่าย", "Free", "無料"],
    ["ใหม่ล่าสุด", "Newest", "新着"],
    ["ตอนนี้", "now", "今"],
    ["เข้าสู่ระบบ", "Sign In", "ログイン"],
    ["ออกจากระบบ", "Log Out", "ログアウト"],
    ["ตั้งค่า", "Settings", "設定"],
    ["ภาษา", "Language", "言語"],
    ["ปิดอยู่", "Off", "オフ"],
    ["เปิดอยู่", "On", "オン"],

    // ---------- สกุลเงิน / หน่วย ----------
    ["", "Token", "Token"],
    ["", "Tokens", "Token"],
    ["", "GE Token", "GE Token"],
    ["", "GE Tokens", "GE Token"],
    ["คุกกี้", "Cookie", "クッキー"],
    ["คุกกี้", "Cookies", "クッキー"],
    ["{n} Tokens", "{n} Tokens", "{n} Token"],
    ["{n} Cookies", "{n} Cookies", "{n} クッキー"],
    ["{n} token", "{n} token", "{n} Token"],
    ["ชิ้น", "pcs", "個"],
    ["คน", "people", "人"],
    ["รายการ", "items", "件"],
    ["ชิ้น", "item", "個"],
    ["รูป", "photos", "枚"],
    ["วัน", "days", "日"],
    ["น.", Z, Z],
    ["ม.ค.", "Jan", "1月"], ["ก.พ.", "Feb", "2月"], ["มี.ค.", "Mar", "3月"], ["เม.ย.", "Apr", "4月"],
    ["พ.ค.", "May", "5月"], ["มิ.ย.", "Jun", "6月"], ["ก.ค.", "Jul", "7月"], ["ส.ค.", "Aug", "8月"],
    ["ก.ย.", "Sep", "9月"], ["ต.ค.", "Oct", "10月"], ["พ.ย.", "Nov", "11月"], ["ธ.ค.", "Dec", "12月"],
    ["มกราคม", "January", "1月"], ["กุมภาพันธ์", "February", "2月"], ["มีนาคม", "March", "3月"],
    ["เมษายน", "April", "4月"], ["พฤษภาคม", "May", "5月"], ["มิถุนายน", "June", "6月"],
    ["กรกฎาคม", "July", "7月"], ["สิงหาคม", "August", "8月"], ["กันยายน", "September", "9月"],
    ["ตุลาคม", "October", "10月"], ["พฤศจิกายน", "November", "11月"], ["ธันวาคม", "December", "12月"],
    ["เมื่อสักครู่", "Just now", "たった今"],
    ["วัน", "Days", "日"], ["ชม.", "Hrs", "時間"], ["นาที", "Mins", "分"], ["วินาที", "Secs", "秒"],

    // ---------- หน้าแรก ----------
    ["กำลังรวบรวมคุกกี้...", "Collecting cookies...", "クッキーを集計中..."],
    ["ดูข้อความขอบคุณพิเศษ", "view special thanks", "スペシャルサンクスを見る"],
    ["สมาชิกทั้งหมด", "All members", "全メンバー"],
    ["", "Official Membership", "公式メンバーシップ"],
    ["วิดีโอยอดนิยม", "Trending Video", "人気の動画"],
    ["โพสต์ยอดนิยมล่าสุด", "Latest Top Posts", "最新の人気投稿"],
    ["ภารกิจ & เช็คอิน", "Missions & Check-in", "ミッション＆チェックイン"],
    ["ยังไม่มีโพสต์", "NOT POSTS YET", "まだ投稿がありません"],
    ["ยังไม่มีโพสต์", "Not Posts Yet", "まだ投稿がありません"],
    ["ยังไม่มีคอมเมนต์", "NOT COMMENTS YET.", "まだコメントがありません。"],
    ["เขียนคอมเมนต์...", "Write a comment...", "コメントを書く..."],
    ["เขียนตอบกลับ...", "Write a reply...", "返信を書く..."],
    ["โพสต์นี้ทำคุกกี้สะสมได้", "This post has earned", "この投稿の獲得クッキー"],
    ["เมมเบอร์ยืนยันตัวตน", "Verified Member", "認証メンバー"],
    ["จบการศึกษา", "Graduated", "卒業"],
    ["จบการศึกษา", "GRADUATED", "卒業"],
    ["เมมเบอร์", "Member", "メンバー"],
    ["เมมเบอร์", "MEMBER", "メンバー"],
    ["ไม่สามารถดึงข้อมูลโพสต์ได้", "Couldn't load posts", "投稿を取得できませんでした"],
    ["เกิดข้อผิดพลาดในการโหลดฟีด ลองรีเฟรชอีกครั้ง", "Couldn't load the feed. Please refresh.", "フィードの読み込みに失敗しました。再読み込みしてください。"],
    ["เกิดข้อผิดพลาดในการโหลดฟีด ลองรีเฟรชอีกครั้งค่ะ", "Couldn't load the feed. Please refresh.", "フィードの読み込みに失敗しました。再読み込みしてください。"],
    ["โหลดโพสต์เพิ่มเติมไม่สำเร็จ", "Couldn't load more posts", "追加の投稿を読み込めませんでした"],
    ["โหลดไม่สำเร็จ แตะเพื่อลองใหม่", "Failed to load. Tap to retry", "読み込み失敗。タップして再試行"],
    ["โหลด Campaign ไม่สำเร็จ ลองใหม่อีกครั้ง", "Couldn't load campaigns. Please try again.", "キャンペーンを読み込めませんでした。もう一度お試しください。"],
    ["ยังไม่มี Campaign ในขณะนี้", "No campaigns right now", "現在キャンペーンはありません"],
    ["ไม่สามารถเชื่อมต่อระบบแคมเปญได้", "Couldn't connect to the campaign system", "キャンペーンシステムに接続できません"],
    ["บัญชีของคุณถูกระงับการใช้งานแล้ว", "Your account has been suspended", "アカウントは停止されています"],
    ["บัญชีของคุณถูกระงับการใช้งาน", "Your account has been suspended", "アカウントは停止されています"],
    ["อัปเดตข้อมูลใหม่ล่าสุดเรียบร้อย", "Data updated", "最新の情報に更新しました"],
    ["กำลังอัปเดตข้อมูล...", "Updating...", "更新中..."],
    ["ไม่สามารถดึงข้อมูลล่าสุดได้", "Couldn't fetch the latest data", "最新データを取得できませんでした"],
    ["ไม่สามารถดึงข้อมูลล่าสุดได้ กรุณาลองใหม่นะคะ", "Couldn't fetch the latest data. Please try again.", "最新データを取得できませんでした。もう一度お試しください。"],
    ["ต้องการออกจากระบบใช่ไหมคะ?", "Do you want to log out?", "ログアウトしますか？"],
    ["ออกจากระบบเรียบร้อยแล้วค่ะ", "You have been logged out", "ログアウトしました"],
    ["ออกจากระบบ?", "Log out?", "ログアウトしますか？"],
    ["คุณต้องการออกจากระบบใช่หรือไม่?", "Do you want to log out?", "ログアウトしますか？"],
    ["ผิดพลาด", "Error", "エラー"],
    ["ไม่พบข้อมูลเมมเบอร์คนนี้ในระบบค่ะ", "This member was not found", "このメンバーは見つかりませんでした"],
    ["กรอกรหัสแลกรับสิทธิ์", "Enter redeem code", "引き換えコードを入力"],
    ["กรอกรหัสโค้ดที่นี่...", "Enter your code here...", "ここにコードを入力..."],
    ["กรอกรหัสโค้ดที่นี่", "Enter your code here", "ここにコードを入力"],
    ["ยืนยัน", "Confirm", "確認"],
    ["กำลังตรวจสอบโค้ด...", "Checking code...", "コードを確認中..."],
    ["ทำรายการสำเร็จ", "Transaction successful", "処理が完了しました"],
    ["การเชื่อมต่อขัดข้อง", "Connection problem", "接続エラー"],
    ["ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้งในภายหลัง", "Couldn't reach the server. Please try again later.", "サーバーに接続できません。後でもう一度お試しください。"],
    ["แก้ไขชื่อของคุณ", "Edit your name", "名前を編集"],
    ["กรอกชื่อใหม่ที่ต้องการ", "Enter a new name", "新しい名前を入力"],
    ["กรุณากรอกชื่อด้วยนะคะ", "Please enter a name", "名前を入力してください"],
    ["ชื่อยาวเกินไปหน่อยค่ะ", "That name is too long", "名前が長すぎます"],
    ["กำลังบันทึก...", "Saving...", "保存中..."],
    ["เปลี่ยนชื่อเรียบร้อยแล้วค่ะ", "Name updated", "名前を変更しました"],
    ["ไม่สามารถเปลี่ยนชื่อได้ในขณะนี้", "Couldn't change your name right now", "現在名前を変更できません"],
    ["ระบบขัดข้อง กรุณาลองใหม่อีกครั้งงับ", "Something went wrong. Please try again.", "エラーが発生しました。もう一度お試しください。"],
    ["ระบบขัดข้อง กรุณาลองใหม่อีกครั้งค่ะ", "Something went wrong. Please try again.", "エラーが発生しました。もう一度お試しください。"],
    ["ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง", "Something went wrong. Please try again.", "エラーが発生しました。もう一度お試しください。"],
    ["เกิดข้อผิดพลาด ลองใหม่อีกครั้ง", "Something went wrong. Please try again.", "エラーが発生しました。もう一度お試しください。"],
    ["เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", "Something went wrong. Please try again.", "エラーが発生しました。もう一度お試しください。"],
    ["เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งนะงับ", "Something went wrong. Please try again.", "エラーが発生しました。もう一度お試しください。"],
    ["เกิดข้อผิดพลาด", "An error occurred", "エラーが発生しました"],
    ["เกิดข้อผิดพลาด!", "An error occurred!", "エラーが発生しました！"],
    ["เกิดข้อผิดพลาดในการโหลดข้อมูล", "Couldn't load data", "データの読み込みに失敗しました"],
    ["เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้งค่ะ", "Couldn't load data. Please try again.", "データの読み込みに失敗しました。もう一度お試しください。"],
    ["เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง", "Connection error. Please try again.", "接続エラー。もう一度お試しください。"],
    ["ไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง", "Couldn't connect to the database. Please try again later.", "データベースに接続できません。後でもう一度お試しください。"],
    ["ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่อีกครั้งในภายหลัง", "Couldn't connect to the database. Please try again later.", "データベースに接続できません。後でもう一度お試しください。"],
    ["ไม่สามารถเชื่อมต่อระบบฐานข้อมูลได้", "Couldn't connect to the database", "データベースに接続できません"],
    ["เชื่อมต่อเซิร์ฟเวอร์ไม่ได้", "Couldn't reach the server", "サーバーに接続できません"],
    ["ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ค่ะ", "Couldn't reach the server", "サーバーに接続できません"],
    ["⚠️ ไม่สามารถเชื่อมต่อข้อมูลได้", "⚠️ Couldn't load data", "⚠️ データに接続できません"],
    ["โหลดข้อมูลล้มเหลว:", "Failed to load data:", "データの読み込みに失敗:"],
    ["กรุณาลองใหม่อีกครั้งค่ะ", "Please try again", "もう一度お試しください"],
    ["ลองใหม่", "Retry", "再試行"],
    ["ไม่สำเร็จ", "Failed", "失敗しました"],
    ["ล้มเหลว!", "Failed!", "失敗しました！"],
    ["สำเร็จแล้ว!", "Done!", "完了しました！"],
    ["ขออภัย", "Sorry", "申し訳ありません"],
    ["คำเตือน", "Warning", "注意"],
    ["เอ๊ะ!", "Oops!", "あれ？"],
    ["พบปัญหา 😥", "Something's wrong 😥", "問題が発生しました 😥"],
    ["ตกลง", "OK", "OK"],
    ["รับทราบ", "Got it", "了解"],
    ["กลับ", "Back", "戻る"],
    ["ยืนยันรายการ", "Confirm", "確定"],
    ["ทำรายการไม่สำเร็จ", "Transaction failed", "処理に失敗しました"],
    ["ทำรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ", "Transaction failed. Please try again.", "処理に失敗しました。もう一度お試しください。"],
    ["กรุณาเข้าสู่ระบบ", "Please log in", "ログインしてください"],
    ["กรุณาเข้าสู่ระบบก่อนใช้งาน", "Please log in first", "先にログインしてください"],
    ["กรุณาเข้าสู่ระบบใหม่อีกครั้ง", "Please log in again", "もう一度ログインしてください"],
    ["กรุณาล็อกอินใหม่อีกครั้งค่ะ", "Please log in again", "もう一度ログインしてください"],
    ["กรุณาล็อกอินก่อนงับ", "Please log in first", "先にログインしてください"],
    ["เข้าสู่ระบบก่อนนะงับ", "Please log in first", "先にログインしてください"],
    ["กรุณากลับไปหน้าแรกเพื่อ Login", "Please go back to the home page to log in", "ホームに戻ってログインしてください"],
    ["ไม่พบเซสชัน", "Session not found", "セッションが見つかりません"],
    ["", "Session Expired", "セッション切れ"],
    ["เซสชันหมดอายุ กรุณาล็อกอินใหม่อีกครั้งครับ", "Session expired. Please log in again.", "セッションが切れました。もう一度ログインしてください。"],
    ["เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่ค่ะ", "Session expired. Please log in again.", "セッションが切れました。もう一度ログインしてください。"],
    ["ไม่พบผู้ใช้งาน", "User not found", "ユーザーが見つかりません"],
    ["ไม่พบสิทธิ์การเข้าใช้งานบัญชีของคุณงับ", "Couldn't verify your account", "アカウントを確認できません"],
    ["กำลังตรวจสอบสิทธิ์...", "Verifying...", "確認中..."],
    ["กำลังอัปเดตระบบ...", "Updating...", "更新中..."],
    ["กำลังอัพเดทข้อมูล...", "Updating...", "更新中..."],
    ["กำลังบันทึกข้อมูล...", "Saving...", "保存中..."],
    ["กำลังส่ง...", "Sending...", "送信中..."],
    ["กำลังอัปโหลด...", "Uploading...", "アップロード中..."],
    ["อัปเดตแล้ว!", "Updated!", "更新しました！"],
    ["ข้อมูลกระเป๋าเงินเป็นปัจจุบันแล้วค่ะ", "Your wallet is up to date", "ウォレットは最新です"],
    ["รีเฟรชข้อมูล", "Refresh", "更新"],
    ["คัดลอกลิงก์แล้ว", "Link copied", "リンクをコピーしました"],
    ["คัดลอกลิงก์แล้ว!", "Link copied!", "リンクをコピーしました！"],
    ["แชร์", "Share", "シェア"],
    ["มาดูโพสต์นี้ในแอป BLM48 กันเถอะ! 🌸", "Check out this post on the BLM48 app! 🌸", "BLM48アプリでこの投稿を見てね！🌸"],
    ["วางลิงก์เพื่อแชร์โพสต์นี้ได้เลยน้า", "Paste the link to share this post", "リンクを貼り付けてこの投稿をシェアしてね"],
    ["ลิงก์โพสต์นี้", "Link to this post", "この投稿のリンク"],
    ["มาดูโปรไฟล์ของ", "Check out", "BLM48アプリで"],
    ["ในแอป BLM48 กันเถอะ! 🌸", "on the BLM48 app! 🌸", "のプロフィールを見てね！🌸"],
    ["วางลิงก์เพื่อแชร์โปรไฟล์นี้ได้เลยน้า", "Paste the link to share this profile", "リンクを貼り付けてこのプロフィールをシェアしてね"],
    ["ลิงก์โปรไฟล์นี้", "Link to this profile", "このプロフィールのリンク"],
    ["อ่านเพิ่ม", "Read more", "続きを読む"],

    // ---------- โพสต์ / คอมเมนต์ ----------
    ["โพสต์", "Post", "投稿"],
    ["แก้ไขโพสต์", "Edit post", "投稿を編集"],
    ["ลบโพสต์", "Delete post", "投稿を削除"],
    ["แชร์โพสต์เป็นลิงก์", "Share post as link", "リンクで投稿をシェア"],
    ["ลบโพสต์นี้หรือไม่?", "Delete this post?", "この投稿を削除しますか？"],
    ["ลบโพสต์นี้?", "Delete this post?", "この投稿を削除しますか？"],
    ["ลบแล้วไม่สามารถกู้คืนได้!", "This can't be undone!", "削除すると元に戻せません！"],
    ["ลบแล้วไม่สามารถกู้คืนได้นะงับ!", "This can't be undone!", "削除すると元に戻せません！"],
    ["ลบเลย", "Delete", "削除する"],
    ["ลบเลย!", "Delete!", "削除する！"],
    ["ลบ!", "Delete!", "削除！"],
    ["ลบแล้ว!", "Deleted!", "削除しました！"],
    ["ลบโพสต์เรียบร้อย", "Post deleted", "投稿を削除しました"],
    ["ลบโพสต์เรียบร้อยงับ", "Post deleted", "投稿を削除しました"],
    ["เกิดข้อผิดพลาด หรือคุณไม่มีสิทธิ์ในการลบโพสต์นี้", "Error, or you don't have permission to delete this post", "エラー、またはこの投稿を削除する権限がありません"],
    ["ไม่มีรูปภาพในโพสต์นี้", "No images in this post", "この投稿に画像はありません"],
    ["ลบรูปนี้", "Remove this image", "この画像を削除"],
    ["อัปเดตโพสต์เรียบร้อย", "Post updated", "投稿を更新しました"],
    ["เกิดข้อผิดพลาด หรือคุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้", "Error, or you don't have permission to edit this post", "エラー、またはこの投稿を編集する権限がありません"],
    ["กรุณาล็อกอินเข้าสู่ระบบก่อนแสดงความคิดเห็นนะงับ", "Please log in before commenting", "コメントするにはログインしてください"],
    ["กรุณาล็อกอินเข้าสู่ระบบก่อนตอบกลับนะงับ", "Please log in before replying", "返信するにはログインしてください"],
    ["ข้อความว่างเปล่า", "Empty message", "メッセージが空です"],
    ["พิมพ์อะไรบางอย่างก่อนส่งน้า", "Type something before sending", "送信する前に何か入力してね"],
    ["พิมพ์อะไรบางอย่างก่อนบันทึกน้า", "Type something before saving", "保存する前に何か入力してね"],
    ["ส่งคอมเมนต์ไม่สำเร็จงับ", "Couldn't send comment", "コメントを送信できませんでした"],
    ["แก้ไขคอมเมนต์ไม่สำเร็จงับ", "Couldn't edit comment", "コメントを編集できませんでした"],
    ["ส่งการตอบกลับไม่สำเร็จงับ", "Couldn't send reply", "返信を送信できませんでした"],
    ["ยังไม่มีเนื้อหา", "No content yet", "内容がありません"],
    ["พิมพ์ข้อความหรือแนบรูปก่อนโพสต์น้า", "Write something or attach a photo before posting", "投稿する前にテキストか画像を追加してね"],
    ["กำลังโพสต์...", "Posting...", "投稿中..."],
    ["อัปโหลดรูปไม่ครบ", "Some images failed to upload", "一部の画像をアップロードできませんでした"],
    ["อัปโหลดสำเร็จ", "Uploaded", "アップロード成功"],
    ["รูป ต้องการโพสต่อไหมคะ?", "photos. Post anyway?", "枚。このまま投稿しますか？"],
    ["โพสต่อ", "Post anyway", "このまま投稿"],
    ["โพสต์ไม่สำเร็จค่ะ", "Couldn't publish post", "投稿できませんでした"],
    ["สมาชิกไม่สามารถคอมเมนต์โพสต์แฟนคลับได้ค่ะ", "Members can't comment on fan club posts", "メンバーはファンクラブの投稿にコメントできません"],
    ["ไม่พบโพสต์นี้ อาจถูกลบไปแล้วค่ะ", "This post wasn't found. It may have been deleted.", "この投稿は見つかりません。削除された可能性があります。"],
    ["เกิดข้อผิดพลาดในการโหลดโพสต์ ลองรีเฟรชอีกครั้งค่ะ", "Couldn't load the post. Please refresh.", "投稿の読み込みに失敗しました。再読み込みしてください。"],
    ["ไม่พบโพสต์ที่ต้องการแสดงค่ะ", "Post not found", "投稿が見つかりません"],
    ["โหลดโพสต์ไม่สำเร็จ ลองใหม่อีกครั้งนะคะ", "Couldn't load posts. Please try again.", "投稿を読み込めませんでした。もう一度お試しください。"],
    ["กำลังกรองด้วย #", "Filtering by #", "絞り込み中 #"],
    ["ล้างตัวกรอง", "Clear filter", "フィルターを解除"],

    // ---------- Fan Post ----------
    ["", "Fan Post", "ファン投稿"],
    ["สร้างโพสต์แฟนคลับ", "Create a fan club post", "ファンクラブ投稿を作成"],
    ["เพิ่มรูปภาพ", "Add photos", "画像を追加"],
    ["แชร์เรื่องราวของคุณกับแฟนคลับคนอื่น ๆ...", "Share your story with other fans...", "他のファンとあなたの話をシェアしよう..."],
    ["ยังไม่มีโพสต์แฟนคลับ มาเป็นคนแรกกันเลย!", "No fan club posts yet. Be the first!", "まだファン投稿はありません。最初の投稿をしよう！"],
    ["เกิดข้อผิดพลาดในการโหลดฟีด ลองรีเฟรชอีกครั้งค่ะ", "Couldn't load the feed. Please refresh.", "フィードの読み込みに失敗しました。再読み込みしてください。"],

    // ---------- สร้างโพสต์ (post.html) ----------
    ["", "EXCLUSIVE", "限定"],
    ["คุณคือ Champ of the Month ประจำเดือนนี้! เขียนโพสขอบคุณแฟนๆ ได้เลยค่ะ (โพสพิเศษนี้โพสได้เพียงครั้งเดียวนะคะ 💛 ทุกคนกดใจ คอมเมนต์ แชร์โพสนี้ได้เหมือนโพสปกติเลย)",
      "You are this month's Champ of the Month! Write a thank-you post for your fans (this special post can only be published once 💛 everyone can like, comment and share it like a normal post).",
      "あなたが今月のChamp of the Monthです！ファンへの感謝の投稿を書きましょう（この特別投稿は1回のみ 💛 通常の投稿と同じように、いいね・コメント・シェアができます）。"],
    ["เพิ่มรูปภาพ", "Add a Photo", "写真を追加"],
    ["เผยแพร่ข้อความขอบคุณ", "Publish Special Thanks", "スペシャルサンクスを公開"],
    ["หรือโพสต์แบบปกติ", "Or post normally", "または通常の投稿"],
    ["ซ่อนโพสต์แบบปกติ", "Hide normal post", "通常の投稿を隠す"],
    ["โพสต์ใหม่", "New Post", "新規投稿"],
    ["ใส่แฮชแท็ก", "Add hashtags", "ハッシュタグを追加"],
    ["วางลิงก์ได้เลย", "Paste links", "リンクを貼り付け"],
    ["พิมพ์ @ เพื่อแท็กเมมเบอร์", "Type @ to tag a member", "@でメンバーをタグ付け"],
    ["เพิ่มแกลเลอรี", "Add Gallery", "ギャラリーを追加"],
    ["เลือกรูปภาพ", "Choose Images", "画像を選択"],
    ["เผยแพร่โพสต์", "Publish Post", "投稿する"],
    ["เขียนข้อความขอบคุณแฟนๆ ที่นี่...", "Write your thank-you message to fans here...", "ファンへの感謝のメッセージをここに..."],
    ["แชร์อะไรบางอย่างกับคอมมูนิตี้...", "Share something with the community...", "コミュニティに何かシェアしよう..."],
    ["ยังไม่มีข้อความ", "No message yet", "メッセージがありません"],
    ["กรุณาพิมพ์ข้อความขอบคุณก่อนโพสค่ะ", "Please write your thank-you message first", "先に感謝のメッセージを入力してください"],
    ["กำลังบันทึกโพสขอบคุณของคุณ...", "Saving your thank-you post...", "感謝の投稿を保存中..."],
    ["ขอบคุณค่ะ! 👑", "Thank you! 👑", "ありがとう！👑"],
    ["โพสขอบคุณพิเศษของคุณเผยแพร่แล้ว แฟนๆ กดใจ คอมเมนต์ แชร์ได้เลย", "Your special thank-you post is live. Fans can like, comment and share it now.", "感謝の特別投稿が公開されました。ファンがいいね・コメント・シェアできます。"],
    ["อัปโหลดรูปสำเร็จ", "Uploaded", "アップロード成功"],
    ["รูป (อีก", "photos (", "枚（"],
    ["รูปอัปโหลดไม่สำเร็จ) ต้องการโพสต่อโดยไม่มีรูปที่อัปโหลดไม่สำเร็จหรือไม่?", "failed). Post without the failed photos?", "枚失敗）。失敗した画像なしで投稿しますか？"],
    ["ยกเลิก ลองใหม่", "Cancel and retry", "キャンセルして再試行"],
    ["กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการต่อ", "Please log in again to continue.", "続けるにはもう一度ログインしてください。"],
    ["กำลังเผยแพร่ข้อความขอบคุณ", "Publishing Special Thanks", "スペシャルサンクスを公開中"],
    ["กำลังเผยแพร่โพสต์", "Publishing Post", "投稿を公開中"],
    ["กำลังอัปโหลดรูปและอัปเดตไทม์ไลน์ กรุณารอสักครู่...", "Uploading media assets and updating timeline. Please wait...", "画像をアップロードしてタイムラインを更新中です。お待ちください..."],
    ["เผยแพร่โพสต์ของคุณเรียบร้อยแล้ว", "Your post has been published successfully.", "投稿が公開されました。"],

    // ---------- Campaign ----------
    ["แคมเปญ", "Campaign", "キャンペーン"],
    ["รายละเอียด Campaign", "Campaign Detail", "キャンペーン詳細"],
    ["ยังไม่มี Campaign ที่จบแล้ว", "No finished campaigns yet", "終了したキャンペーンはまだありません"],
    ["ยังไม่มี Campaign ที่เปิดอยู่ในขณะนี้", "No open campaigns right now", "現在開催中のキャンペーンはありません"],
    ["ส่งคุกกี้", "Send Cookie", "クッキーを送る"],
    ["โดย BLM48", "by BLM48", "by BLM48"],
    ["ผู้ซัพพอร์ต", "supporters", "サポーター"],
    ["ผู้ซัพพอร์ต", "Supporters", "サポーター"],
    ["ระดมทุน", "Funded", "達成"],
    ["จบแล้ว", "Ended", "終了"],
    ["ซัพพอร์ตด้วยคุกกี้เพื่อส่ง", "Support with cookies to send", "クッキーでサポートして"],
    ["ขึ้น Champ of the Month", "to Champ of the Month", "をChamp of the Monthへ"],
    ["ผู้ซัพพอร์ตสูงสุด", "Top Supporters", "トップサポーター"],
    ["พิเศษเดือนเกิด", "Birthday month special", "誕生月スペシャル"],
    ["คุกกี้คืน 100%", "100% cookie refund", "クッキー100%返還"],
    ["คุณซัพพอร์ตแล้ว", "You've supported", "あなたのサポート"],
    ["ได้รับคุกกี้คืนแล้ว", "Cookies refunded", "返還されたクッキー"],
    ["ตอนนี้ถึง Tier", "Now reached Tier", "現在 Tier"],
    ["แล้ว จะได้รับคุกกี้คืนอย่างน้อย", "— you'll get back at least", "に到達。少なくとも返還されるクッキー"],
    ["เฉพาะบัญชีแฟนคลับเท่านั้นที่ซัพพอร์ต Campaign ได้", "Only fan club accounts can support campaigns", "キャンペーンをサポートできるのはファンクラブアカウントのみです"],
    ["ซัพพอร์ตคุกกี้ให้", "Support cookies for", "クッキーでサポート:"],
    ["คุณมีคุกกี้ทั้งหมด:", "Your cookies:", "所持クッキー:"],
    ["กรอกจำนวนคุกกี้ที่ต้องการซัพพอร์ต", "Enter the number of cookies to support", "サポートするクッキー数を入力"],
    ["กรุณาระบุจำนวนคุกกี้ให้ถูกต้อง", "Please enter a valid number of cookies", "正しいクッキー数を入力してください"],
    ["คุกกี้คงเหลือไม่เพียงพอ ท่านมีคุกกี้คงเหลือ", "Not enough cookies. Your balance is", "クッキーが足りません。残高"],
    ["กำลังส่งคุกกี้...", "Sending cookies...", "クッキーを送信中..."],
    ["ปลดล็อก Tier", "Unlocked Tier", "Tier解放"],
    ["ซัพพอร์ตสำเร็จ", "Support successful", "サポート完了"],
    ["ส่งคุกกี้เรียบร้อย", "Cookies sent", "クッキーを送りました"],
    ["เปิด Campaign", "Open Campaign", "キャンペーンを開始"],
    ["เปิด Campaign เพื่อให้แฟนๆ ซัพพอร์ตคุกกี้ ดันขึ้น Champ of the Month เดือนนี้", "Open a campaign so fans can support you with cookies toward this month's Champ of the Month", "キャンペーンを開始して、今月のChamp of the Monthを目指してファンにクッキーで応援してもらおう"],
    ["ระยะเวลา Campaign", "Campaign period", "キャンペーン期間"],
    ["ปิดเวลา 00:00 น. ของวันถัดไป", "Closes at 00:00 the next day", "翌日00:00に終了"],
    ["รายละเอียด Tier", "Tier details", "Tier詳細"],
    ["เงื่อนไข", "Conditions", "条件"],
    ["เปิดได้เดือนละ 1 ครั้ง และปิดก่อนกำหนดไม่ได้", "Can be opened once a month and can't be closed early", "月1回のみ開始でき、途中で終了できません"],
    ["ยอด Campaign = ยอด Ranking ของเมมเบอร์ในเดือนนั้น (รวมการปาคุกกี้ และคุกกี้จากการกดใจ/คอมเมนต์โพส)", "Campaign total = the member's Ranking total for the month (cookie throws plus cookies from post likes/comments)", "キャンペーン合計＝その月のメンバーのランキング合計（クッキー投げ＋投稿のいいね/コメントによるクッキー）"],
    ["การคืนคุกกี้คิดจากยอดที่แฟนๆ ปาคุกกี้จริงตั้งแต่วันที่เปิด Campaign เท่านั้น ไม่รวมคุกกี้จากการกดใจ/คอมเมนต์", "Refunds are based only on cookies fans actually threw since the campaign opened, not cookies from likes/comments", "返還は開始日以降に実際に投げたクッキーのみが対象で、いいね/コメントによるクッキーは含まれません"],
    ["ระบบคืนคุกกี้ให้แฟนๆ อัตโนมัติเมื่อจบ Campaign ตาม Tier ที่ทำได้", "Cookies are refunded automatically when the campaign ends, based on the Tier reached", "キャンペーン終了時、到達したTierに応じて自動でクッキーが返還されます"],
    ["กำลังเปิด Campaign...", "Opening campaign...", "キャンペーンを開始中..."],
    ["เปิด Campaign แล้ว!", "Campaign opened!", "キャンペーンを開始しました！"],
    ["Campaign ของคุณขึ้นที่หน้า Home เรียบร้อย", "Your campaign is now on the Home page", "キャンペーンがホームに表示されました"],
    ["ยังไม่มีผู้ซัพพอร์ต เป็นคนแรกเลย!", "No supporters yet. Be the first!", "まだサポーターがいません。最初のサポーターになろう！"],
    ["(ปาคุกกี้", "(cookie throws", "（クッキー投げ"],
    ["+ กดใจ/คอมเมนต์โพส", "+ post likes/comments", "＋投稿のいいね/コメント"],
    ["· คืนคุกกี้คิดจากยอดปาคุกกี้)", "· refunds count cookie throws only)", "・返還はクッキー投げのみ対象）"],

    // ---------- ตะกร้า / ชำระเงิน / คำสั่งซื้อ ----------
    ["ตะกร้าสินค้า", "Shopping Cart", "カート"],
    ["ยอดรวม", "Total", "合計"],
    ["ชำระเงิน", "Check Out", "購入手続き"],
    ["ยังไม่มีสินค้าในตะกร้าค่ะ", "Your cart is empty", "カートは空です"],
    ["ไปที่ Shop", "Go to Shop", "ショップへ"],
    ["ยอดรวมคำสั่งซื้อ", "Order Total", "注文合計"],
    ["Token จะถูกหักทันทีที่สั่งซื้อ สินค้าจะรออยู่ใน", "Tokens are deducted as soon as you place the order. Your items wait in", "注文と同時にTokenが差し引かれます。商品は"],
    ["คำสั่งซื้อของฉัน", "My Order", "注文履歴"],
    ["จนกว่าคุณจะกด", "until you press", "で保管され、"],
    ["รับของ", "Redeem", "受け取り"],
    ["— สินค้าพรีออเดอร์จะกดรับได้หลังจัดส่งแล้ว", "— pre-order items become redeemable once they ship.", "を押すまで待機します — 予約商品は発送後に受け取れます。"],
    ["ช่องทางการชำระเงิน", "Payment Option", "支払い方法"],
    ["กระเป๋า Token", "Token Wallet", "Tokenウォレット"],
    ["ยอดคงเหลือ: -", "Balance: -", "残高: -"],
    ["ยอดคงเหลือ: {n} Tokens", "Balance: {n} Tokens", "残高: {n} Token"],
    ["สั่งซื้อ", "Place Order", "注文する"],
    ["เลือกแล้ว", "Selected", "選択中"],
    ["รอจัดส่ง", "Waiting for shipment", "発送待ち"],
    ["จัดส่งแล้ว", "Delivered", "配送済み"],
    ["พร้อมรับของ", "Redeemable", "受け取り可能"],
    ["รับของแล้ว", "Redeemed", "受け取り済み"],
    ["ยังไม่มีคำสั่งซื้อค่ะ", "No orders yet", "注文はまだありません"],
    ["รายละเอียดคำสั่งซื้อ", "Order Details", "注文詳細"],
    ["จัดส่งแล้ว · พร้อมรับของ", "Shipped · Redeemable", "発送済み・受け取り可能"],
    ["พร้อมรับของ", "Ready to redeem", "受け取り可能"],
    ["สถานะคำสั่งซื้อ", "Order Status", "注文状況"],
    ["ยอดรวมสินค้า", "Merchandise Subtotal", "商品小計"],
    ["วิธีชำระเงิน", "Payment Method", "支払い方法"],
    ["หมายเลขคำสั่งซื้อ", "Order Number", "注文番号"],
    ["เวลาสั่งซื้อ", "Order Time", "注文日時"],
    ["เวลาชำระเงิน", "Payment Time", "支払い日時"],
    ["Redeem ไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ", "Redeem failed. Please try again.", "受け取りに失敗しました。もう一度お試しください。"],
    ["สินค้าพรีออเดอร์กดรับแยกได้หลังจัดส่งแล้ว", "Pre-order items can be redeemed separately after they ship.", "予約商品は発送後に個別に受け取れます。"],
    ["ดูของที่ได้รับ", "View received items", "受け取ったアイテムを見る"],
    ["ส่วนที่เหลือของคำสั่งซื้อนี้กดรับได้หลังจัดส่งแล้ว", "The rest of this order can be redeemed after it ships.", "この注文の残りは発送後に受け取れます。"],
    ["คำสั่งซื้อนี้กดรับได้หลังจัดส่งแล้ว", "You can redeem this order after it ships.", "この注文は発送後に受け取れます。"],
    ["ยังไม่มีรายการที่ Redeem ในคำสั่งซื้อนี้ค่ะ", "Nothing has been redeemed in this order yet", "この注文で受け取ったアイテムはまだありません"],
    ["คุณได้รับ:", "You received:", "受け取ったアイテム:"],
    ["ประเภท :", "Type :", "種類 :"],
    ["จำนวน :", "Quantity :", "数量 :"],
    ["การชำระเงิน", "Payment", "お支払い"],
    ["ช้อปต่อ", "Continue Shopping", "買い物を続ける"],
    ["กลับไปที่ Shop", "Back to Shop", "ショップに戻る"],
    ["รายละเอียดคำสั่งซื้อ", "order details", "注文詳細"],
    ["ชำระเงินสำเร็จ", "Your payment is approved", "お支払いが完了しました"],
    ["ยอดชำระทั้งหมด", "Total Payment", "お支払い合計"],
    ["เพิ่มลงตะกร้าแล้ว", "Added to cart", "カートに追加しました"],
    ["ดูตะกร้า", "View cart", "カートを見る"],
    ["ใส่ตะกร้า", "Add to cart", "カートに入れる"],
    ["ซื้อเลย · {n} Tokens", "Buy Now · {n} Tokens", "今すぐ購入・{n} Token"],

    // ---------- Pre-order ----------
    ["รายละเอียดสินค้า", "Product details", "商品詳細"],
    ["รายละเอียด", "Details", "詳細"],
    ["ไม่พบสินค้าพรีออเดอร์นี้ค่ะ", "This pre-order item wasn't found", "この予約商品は見つかりません"],
    ["พรีออเดอร์เต็มแล้ว", "Pre-order is full", "予約上限に達しました"],
    ["เร็วๆ นี้", "Coming Soon", "近日公開"],
    ["พรีออเดอร์", "Pre-order", "予約"],
    ["เปิดขาย :", "On sale :", "販売開始 :"],
    ["พรีออเดอร์ :", "Pre-order :", "予約 :"],
    ["จัดส่ง :", "Shipping :", "発送 :"],
    ["ยังไม่มีสินค้าพรีออเดอร์ในตอนนี้ค่ะ", "No pre-order items right now", "現在予約商品はありません"],
    ["เต็มแล้ว", "Full", "満員"],
    ["เปิดขาย", "On sale", "販売開始"],
    ["เกิดข้อผิดพลาดในการโหลดข้อมูลพรีออเดอร์ กรุณาลองใหม่อีกครั้งค่ะ", "Couldn't load pre-orders. Please try again.", "予約情報を読み込めませんでした。もう一度お試しください。"],

    // ---------- Champ / Ranking ----------
    ["", "Champ of the Month", "Champ of the Month"],
    ["ผู้ชนะ", "The Winner", "優勝者"],
    ["ดูอันดับ", "View Ranking", "ランキングを見る"],
    ["อันดับประจำเดือน", "Monthly Ranking", "月間ランキング"],
    ["ยังไม่มีประวัติทำเนียบแชมป์ในขณะนี้ค่ะ 🌟", "No champion history yet 🌟", "まだチャンピオンの記録はありません 🌟"],
    ["ไม่พบข้อมูลพารามิเตอร์ของเดือนที่ต้องการดูอันดับค่ะ", "No month was specified for this ranking", "ランキングの月が指定されていません"],
    ["ไม่พบข้อมูลเกียรติยศของเมมเบอร์คนดังกล่าวในทำเนียบแชมป์ค่ะ", "This member isn't in the champion history", "このメンバーはチャンピオン記録にありません"],
    ["ไม่สามารถระบุเดือนของอันดับนี้ได้ค่ะ", "Couldn't determine the month for this ranking", "このランキングの月を特定できません"],
    ["ยังไม่มีข้อมูลอันดับอื่นในเดือนนี้ค่ะ", "No other rankings this month yet", "今月の他のランキングはまだありません"],
    ["รางวัลประจำเดือน", "Awards of the month", "今月のアワード"],
    ["โหวตให้เมมเบอร์คนโปรด และลุ้นรับรางวัลสุดพิเศษจากเรา!", "Votes for your favorite member and get a chance to win amazing prizes from us!", "推しメンに投票して、素敵な賞品を当てよう！"],
    ["ส่งเมมเบอร์คนโปรดให้ได้ภาคภูมิใจ!", "Make your favorite members walk tall with pride!", "推しメンを誇らしく輝かせよう！"],
    ["ธีมแอปของเมมเบอร์", "Member theme app", "メンバーのアプリテーマ"],
    ["ผู้ชนะจะได้เปลี่ยนธีมทั้งหมดของเว็บแอป BLM48", "The lucky winner will be entitled to change the all theme of BLM48 web application", "優勝者はBLM48ウェブアプリ全体のテーマを変更できます"],
    ["ข้อความขอบคุณ", "Special Thanks", "スペシャルサンクス"],
    ["ข้อความจากเมมเบอร์", "Message from Member", "メンバーからのメッセージ"],
    ["กำลังโหลดข้อมูลความรู้สึกแทนคำขอบคุณ...", "Loading the thank-you message...", "感謝のメッセージを読み込み中..."],
    ["ไม่พบข้อมูลพารามิเตอร์ของเมมเบอร์ค่ะ", "No member was specified", "メンバーが指定されていません"],

    // ---------- แฟนคลับ / Top Fans / VIP ----------
    ["แคมเปญที่ซัพพอร์ต", "Supported Campaigns", "サポートしたキャンペーン"],
    ["เมมเบอร์โอชิ", "Oshi Members", "推しメンバー"],
    ["ยังไม่เคยซัพพอร์ตเมมเบอร์ที่ได้ Champ of the Month", "Hasn't supported a Champ of the Month winner yet", "Champ of the Month受賞メンバーをまだサポートしていません"],
    ["ในเดือนที่เมมเบอร์คนนั้นได้แชมป์", "in the month that member won", "そのメンバーが優勝した月"],
    ["อันดับ", "Rank", "順位"],
    ["จาก", "of", "/"],
    ["ไม่พบโปรไฟล์แฟนคลับค่ะ", "Fan profile not found", "ファンのプロフィールが見つかりません"],
    ["แฟนตัวยง", "Top Fan", "トップファン"],
    ["", "Top Fans", "トップファン"],
    ["ยังไม่มีแฟนคลับปาคุกกี้ให้เมมเบอร์คนนี้เลยค่ะ", "No fans have thrown cookies to this member yet", "このメンバーにクッキーを投げたファンはまだいません"],
    ["ยังไม่มีข้อมูลค่ะ", "No data yet", "データはまだありません"],
    ["ยังไม่มีข้อมูลอันดับเดือนนี้", "No ranking data for this month yet", "今月のランキングデータはまだありません"],
    ["โหลดอันดับไม่สำเร็จ ลองใหม่อีกครั้งนะคะ", "Couldn't load the ranking. Please try again.", "ランキングを読み込めませんでした。もう一度お試しください。"],
    ["รางวัลสำหรับ Top Today VIP", "Reward for Top Today VIP", "Top Today VIPの特典"],
    ["ซัพพอร์ตเมมเบอร์ที่คุณรัก", "Support the member you love", "大好きなメンバーを応援して"],
    ["ให้ได้เป็น", "and become", Z],
    ["คนพิเศษ", "someone special", "特別な存在に"],
    ["ใน Top Today VIP", "in Top Today VIP", "Top Today VIPで"],
    ["ติด 3 อันดับแรกของวัน รูปโปรไฟล์ของคุณจะขึ้นกรอบมงกุฎ ทอง · เงิน · ทองแดง บนบอร์ด Top Today VIP ให้เมมเบอร์และแฟนคลับทุกคนได้เห็น", "Reach the day's top 3 and your profile photo gets a gold · silver · bronze crown frame on the Top Today VIP board for every member and fan to see", "その日のトップ3に入ると、Top Today VIPボードであなたのプロフィール写真に金・銀・銅の王冠フレームが付き、メンバーとファン全員に表示されます"],
    ["เก็บคะแนนวันนี้ได้จาก", "Earn today's points by", "今日のポイントの獲得方法"],
    ["ปาคุกกี้ให้เมมเบอร์", "Throwing cookies to members", "メンバーにクッキーを投げる"],
    ["ยิ่งปาเยอะ คะแนนยิ่งเยอะ", "The more you throw, the more points", "投げるほどポイントアップ"],
    ["กดไลก์โพสต์และคอมเมนต์ของเมมเบอร์", "Liking members' posts and comments", "メンバーの投稿とコメントにいいね"],
    ["คอมเมนต์และตอบกลับในโพสต์ของเมมเบอร์", "Commenting and replying on members' posts", "メンバーの投稿にコメント・返信"],
    ["กติกา", "Rules", "ルール"],
    ["นับคะแนนแยกตามเมมเบอร์แต่ละคน ซัพพอร์ตใครก็ขึ้นบอร์ดของคนนั้น", "Points are counted per member — you appear on the board of whoever you support", "ポイントはメンバーごとに集計され、応援したメンバーのボードに表示されます"],
    ["อันดับรีเซ็ตใหม่ทุกวันเวลา 00:00 น. (เวลาไทย) ทุกคนมีโอกาสเป็น VIP ได้ทุกวัน", "Rankings reset every day at 00:00 (Thai time) — everyone has a chance to be VIP every day", "ランキングは毎日00:00（タイ時間）にリセット。誰でも毎日VIPになるチャンスがあります"],
    ["ถ้าคะแนนเท่ากัน คนที่ซัพพอร์ตก่อนจะได้อันดับที่สูงกว่า", "If points are tied, whoever supported first ranks higher", "同点の場合は先に応援した人が上位になります"],
    ["ดูอันดับวันนี้", "See today's ranking", "今日のランキングを見る"],

    // ---------- History ----------
    ["ธุรกรรม", "Transactions", "取引"],
    ["ของขวัญ", "Gift", "ギフト"],
    ["โหวต", "Vote", "投票"],
    ["ประวัติธุรกรรม", "Transaction history", "取引履歴"],
    ["ไม่พบข้อมูลประวัติงับ", "No history found", "履歴はありません"],
    ["ไม่มีธุรกรรม", "No transactions", "取引はありません"],
    ["สำเร็จ", "Successful", "成功"],
    ["Locked · คืน 100%", "Locked · 100% refund", "Locked・100%返還"],
    ["Partially Burned · คืน", "Partially Burned · refund", "Partially Burned・返還"],
    ["คืน Token ครบแล้ว", "Tokens fully refunded", "Token全額返還済み"],
    ["คืนครบเมื่อปิดโหวต", "Full refund when voting closes", "投票終了時に全額返還"],
    ["คืนแล้ว", "Refunded", "返還済み"],
    ["คืน", "Refund", "返還"],
    ["% เมื่อปิดโหวต", "% when voting closes", "%（投票終了時）"],
    ["Locked: Token จะถูกล็อกไว้ระหว่างโหวต และได้คืนครบ 100% เมื่อปิดโหวต", "Locked: Tokens are locked during the vote and fully refunded (100%) when voting closes", "Locked: 投票期間中Tokenはロックされ、投票終了時に100%返還されます"],
    ["Partially Burned: ได้ Token คืนบางส่วนตาม % ที่กำหนดเมื่อปิดโหวต ส่วนที่เหลือถูกหักถาวร", "Partially Burned: a set % of Tokens is refunded when voting closes; the rest is permanently deducted", "Partially Burned: 投票終了時に所定の%が返還され、残りは永久に差し引かれます"],
    ["Burned: Token ที่ใช้โหวตจะถูกหักถาวร ไม่ได้คืน", "Burned: Tokens used to vote are permanently deducted and not refunded", "Burned: 投票に使ったTokenは永久に差し引かれ、返還されません"],
    ["ปาคุกกี้ให้", "Threw cookies to", "クッキーを投げた:"],
    ["Vote ให้", "Voted for", "投票:"],
    ["ส่ง \"", "Sent \"", "送った「"],
    ["ให้", "to", "→"],

    // ---------- Inventory ----------
    ["ไอเทมทั้งหมด", "Total Items", "アイテム総数"],
    ["คอลเลกชัน", "Collections", "コレクション"],
    ["คอลเลกชัน", "Collection", "コレクション"],
    ["ดูคำสั่งซื้อ สถานะจัดส่ง และกด Redeem รับของ", "View orders, shipping status and redeem items", "注文・配送状況の確認とアイテムの受け取り"],
    ["กำลังหาคอลเลกชันของคุณ...", "Finding your collection...", "コレクションを読み込み中..."],
    ["ลบไอเทม", "Delete item", "アイテムを削除"],
    ["ค้นหาไอเทมด้วยชื่อ...", "Search items by name...", "名前でアイテムを検索..."],
    ["ล้างคำค้นหา", "Clear search", "検索をクリア"],
    ["ตัวอย่างไอเทม", "Item Preview", "アイテムプレビュー"],
    ["หมวดหมู่อื่นๆ", "Other categories", "その他のカテゴリー"],
    ["ไม่พบสิทธิ์การใช้งานกระเป๋า กรุณาล็อกอินก่อนนะงับ", "Couldn't access your bag. Please log in first.", "バッグにアクセスできません。先にログインしてください。"],
    ["กำลังเปิดค้นหากระเป๋าสะสมดิจิทัลล่าสุด...", "Opening your digital collection...", "デジタルコレクションを開いています..."],
    ["ดึงข้อมูลล้มเหลว: ระบุกระเป๋าไม่ถูกต้อง", "Load failed: invalid bag", "読み込み失敗: 無効なバッグ"],
    ["โหลดข้อมูลกระเป๋าขัดข้อง กรุณาลองใหม่อีกครั้งนะงับ", "Couldn't load your bag. Please try again.", "バッグを読み込めませんでした。もう一度お試しください。"],
    ["กระเป๋ายังว่างเปล่าอยู่เลยงับ", "Your bag is still empty", "バッグはまだ空です"],
    ["มีอยู่ x", "Owned x", "所持 x"],
    ["ลบไอเทมนี้?", "Delete this item?", "このアイテムを削除しますか？"],
    ["จำนวน", "Quantity", "数量"],
    ["ชิ้น ออกจากกระเป๋าใช่ไหม?", "pcs from your bag?", "個をバッグから削除しますか？"],
    ["การลบไม่สามารถย้อนกลับได้นะงับ", "This can't be undone", "削除は元に戻せません"],
    ["ลบไอเทมเรียบร้อยแล้ว", "Item deleted", "アイテムを削除しました"],
    ["ลบไม่สำเร็จ", "Delete failed", "削除に失敗しました"],
    ["เปิดไฟล์ไม่สำเร็จ กรุณาลองใหม่ หรือดาวน์โหลดไฟล์แทน", "Couldn't open the file. Try again or download it instead.", "ファイルを開けませんでした。再試行するかダウンロードしてください。"],
    ["กำลังโหลดโฟโต้บุ๊ค...", "Loading photobook...", "フォトブックを読み込み中..."],
    ["โหลดรูปหน้าแรกไม่สำเร็จ", "Couldn't load the first page", "最初のページを読み込めませんでした"],

    // ---------- Kami-Oshi / Oshi ----------
    ["คามิโอชิของฉัน", "My Kami-Oshi", "私の神推し"],
    ["คามิโอชิล่าสุด", "Recent Kami-Oshi", "最近の神推し"],
    ["เมมเบอร์โอชิของฉัน", "My Oshi Members", "私の推しメンバー"],
    ["", "Kami-Oshi", "神推し"],
    ["", "Oshi", "推し"],
    ["เมมเบอร์คามิโอชิ", "Kami-Oshi Member", "神推しメンバー"],
    ["กำลังเรียกข้อมูลโอชิ...", "Loading your Oshi...", "推しを読み込み中..."],
    ["คุณยังไม่ได้เลือกคามิโอชิ", "You haven't chosen a Kami-Oshi yet", "まだ神推しを選んでいません"],
    ["คุณยังไม่ได้เลือกโอชิ", "You haven't chosen an Oshi yet", "まだ推しを選んでいません"],
    ["โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชอีกครั้ง", "Couldn't load data. Please refresh.", "データを読み込めませんでした。再読み込みしてください。"],
    ["คามิโอชิหลัก", "Main Kami-Oshi", "神推し"],
    ["โอชิ", "Oshi", "推し"],
    ["ยืนยันการลบข้อมูล?", "Confirm removal?", "削除しますか？"],
    ["คุณต้องการจะลบ", "Do you want to remove", "削除しますか:"],
    ["ออกจาก", "from", "から"],
    ["ใช่, ลบออกเลย", "Yes, remove", "はい、削除します"],
    ["ระบบลบรายชื่อออกจากโอชิเรียบร้อยแล้วค่ะ", "Removed from your Oshi list", "推しリストから削除しました"],
    ["ไม่สามารถลบข้อมูลได้", "Couldn't remove", "削除できませんでした"],
    ["ระบบติดต่อตารางข้อมูลขัดข้อง กรุณาลองอีกครั้งนะงับ", "Database error. Please try again.", "データベースエラー。もう一度お試しください。"],

    // ---------- หน้าเมมเบอร์ ----------
    ["คุกกี้ทั้งหมด", "Total Cookies", "クッキー合計"],
    ["ไลก์ทั้งหมด", "Total Likes", "いいね合計"],
    ["+ คามิโอชิ", "+ Kami-Oshi", "+ 神推し"],
    ["+ โอชิ", "+ Oshi", "+ 推し"],
    ["+ คุกกี้", "+ Cookie", "+ クッキー"],
    ["เปิดการแจ้งเตือน", "Turn ON notification", "通知をオン"],
    ["แชร์โปรไฟล์", "Share Profile", "プロフィールをシェア"],
    ["ยกเลิกคามิ", "REMOVE KAMI", "神推し解除"],
    ["+ คามิ", "+ KAMI", "+ 神推し"],
    ["เลิกโอชิ", "UN-OSHI", "推し解除"],
    ["+ โอชิ", "+ OSHI", "+ 推し"],
    ["คุณต้องเข้าสู่ระบบก่อนจึงจะร่วมกิจกรรมกับเมมเบอร์ได้ค่ะ 🌸", "Please log in to interact with members 🌸", "メンバーと交流するにはログインしてください 🌸"],
    ["ไม่พบข้อมูลเมมเบอร์", "Member not found", "メンバーが見つかりません"],
    ["คุณต้องการลบ", "Do you want to remove", "削除しますか:"],
    ["ออกจากรายการ \"คามิโอชิ\" ใช่ไหมงับ?", "from your Kami-Oshi?", "を神推しから外しますか？"],
    ["ยกเลิกคามิโอชิ", "Remove Kami-Oshi", "神推しを解除"],
    ["คุณมีคามิโอชิอยู่แล้วคือ", "Your current Kami-Oshi is", "現在の神推しは"],
    ["ต้องการเปลี่ยนมาเลือก", "Switch to", "変更しますか:"],
    ["เป็นคามิโอชิแทนใช่หรือไม่?", "as your Kami-Oshi instead?", "を神推しにしますか？"],
    ["ตั้งให้", "Set", "設定:"],
    ["เป็น \"คามิโอชิ\" ของคุณใช่หรือไม่?", "as your Kami-Oshi?", "をあなたの神推しにしますか？"],
    ["ข้อมูลซ้ำซ้อน", "Already set", "すでに設定済み"],
    ["เป็นคามิโอชิหลักของคุณอยู่แล้วค่ะ 👑", "is already your Kami-Oshi 👑", "はすでにあなたの神推しです 👑"],
    ["คุณต้องการเลิกติดตาม (Un-Oshi)", "Do you want to un-oshi", "推しを解除しますか:"],
    ["ใช่ไหมงับ?", "?", "？"],
    ["ยกเลิกการติดตาม", "Un-Oshi", "推し解除"],
    ["ติดตาม (Oshi)", "Oshi", "推しにする"],
    ["ใช่หรือไม่?", "?", "？"],
    ["การเชื่อมต่อขัดข้อง ระบบได้คืนค่าเดิมแล้วค่ะ", "Connection error. Changes have been reverted.", "接続エラー。変更は元に戻されました。"],
    ["คุณไม่สามารถส่งคุกกี้ได้ เนื่องจากบัญชีนี้มีสถานะเป็นเมมเบอร์หรือแอดมิน", "You can't send cookies from a member or admin account", "メンバー・管理者アカウントからはクッキーを送れません"],
    ["จบการศึกษาแล้ว", "Graduated", "卒業済み"],
    ["เมมเบอร์ท่านนี้จบการศึกษาแล้ว จึงไม่สามารถส่งคุกกี้ให้ได้ แต่ยังสามารถแสดงการสนับสนุนได้ด้วยการกำหนดเป็น Oshi หรือ Kami", "This member has graduated, so cookies can't be sent, but you can still show support by setting them as your Oshi or Kami", "このメンバーは卒業したためクッキーは送れませんが、推し・神推しに設定して応援できます"],
    ["ส่งคุกกี้ให้", "Send cookies to", "クッキーを送る:"],
    ["กรอกจำนวนคุกกี้ที่ต้องการส่ง", "Enter the number of cookies to send", "送るクッキー数を入力"],
    ["ส่งคุกกี้", "Send cookies", "クッキーを送る"],
    ["ชิ้นเรียบร้อยแล้ว", "sent", "個送りました"],
    ["ระบบขัดข้อง คุกกี้ได้ถูกคืนเข้าบัญชีของท่านเรียบร้อยแล้ว", "Something went wrong. Your cookies have been returned.", "エラーが発生しました。クッキーは返却されました。"],

    // ---------- Login ----------
    ["เข้าสู่ระบบ BLM48", "BLM48 Login", "BLM48 ログイン"],
    ["รหัสสมาชิก", "Membership ID", "会員ID"],
    ["รหัสผ่าน", "Password", "パスワード"],
    ["หรือถ้ายังไม่มีบัญชี", "Don't have an account yet?", "アカウントをお持ちでない方"],
    ["สมัครสมาชิกผ่าน LINE", "Sign up via LINE", "LINEで登録"],
    ["หมายเหตุ : ติดต่อสมัคร BLM48 Membership ฟรี", "Note: Sign up for BLM48 Membership for free", "注：BLM48 Membershipは無料で登録できます"],
    ["ได้ทาง BLM48 Line ID :", "via BLM48 Line ID :", "BLM48 LINE ID :"],
    ["กรอกรหัสสมาชิก", "Enter Membership ID", "会員IDを入力"],
    ["กรอกรหัสผ่าน", "Enter password", "パスワードを入力"],
    ["แสดงรหัสผ่าน", "Show password", "パスワードを表示"],
    ["ซ่อนรหัสผ่าน", "Hide password", "パスワードを隠す"],
    ["ข้อมูลไม่ครบถ้วน", "Missing information", "入力が不足しています"],
    ["กรุณากรอกรหัสสมาชิกและรหัสผ่านให้ครบถ้วนนะคะ", "Please enter your Membership ID and password", "会員IDとパスワードを入力してください"],
    ["กำลังตรวจสอบข้อมูล...", "Checking...", "確認中..."],
    ["ยินดีต้อนรับ", "Welcome", "ようこそ"],
    ["สวัสดีค่ะคุณ", "Hello,", "こんにちは、"],
    ["บัญชีรอการอนุมัติ", "Account pending approval", "アカウント承認待ち"],
    ["ล็อกอินล้มเหลว", "Login failed", "ログイン失敗"],
    ["ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "Incorrect username or password", "ユーザー名またはパスワードが違います"],

    // ---------- Major Vote ----------
    ["ยอดคงเหลือที่ใช้ได้", "Available balance", "利用可能残高"],
    ["รับ", "Receive", "受け取る"],
    ["จำนวนที่ต้องใช้", "Amount required", "必要数"],
    ["ยอดคงเหลือของคุณ", "Your balance", "あなたの残高"],
    ["เข้าร่วม", "Enter", "参加"],
    ["ไม่มีการกิจกรรมโหวตในขณะนี้", "No vote events right now", "現在投票イベントはありません"],
    ["คุณต้องมีอย่างน้อย", "you need to have at least", "最低限必要:"],
    ["รายละเอียดโหวต", "Poll detail", "投票詳細"],
    ["ชื่อโหวต:", "Poll name:", "投票名:"],
    ["", "Token:", "Token:"],
    ["รูปแบบ Token:", "Token mechanic:", "Tokenの仕組み:"],
    ["Burned (Token จะถูกหักถาวร)", "Burned (Your token will be permanently deducted)", "Burned（Tokenは永久に差し引かれます）"],
    ["วันสิ้นสุด:", "End date:", "終了日:"],
    ["Token ขั้นต่ำต่อโหวต:", "Minimum token per vote:", "1票あたりの最低Token:"],
    ["Token ขั้นต่ำต่อโหวต: 1 token", "Minimum token per vote: 1 token", "1票あたりの最低Token: 1 Token"],
    ["รายละเอียด:", "Description:", "説明:"],
    ["เติม Cookie", "Top up Cookie", "クッキーをチャージ"],
    ["ไม่พบรหัสกิจกรรมโหวตในระบบ", "Vote event not found", "投票イベントが見つかりません"],
    ["โหวตแบบ Locked: Token จะถูกล็อกไว้และได้คืนครบ 100% เมื่อปิดโหวต", "Locked vote: Tokens are locked and fully refunded (100%) when voting closes", "Locked投票：Tokenはロックされ、投票終了時に100%返還されます"],
    ["โหวตแบบ Partially Burned: ได้คืน", "Partially Burned vote: refund of", "Partially Burned投票：返還"],
    ["% เมื่อปิดโหวต ส่วนที่เหลือจะถูกหักถาวร", "% when voting closes; the rest is permanently deducted", "%（投票終了時）、残りは永久に差し引かれます"],
    ["โหวตแบบ Burned: Token จะถูกหักถาวร ไม่ได้คืน", "Burned vote: Tokens are permanently deducted and not refunded", "Burned投票：Tokenは永久に差し引かれ、返還されません"],
    ["ร่วมส่งคะแนนโหวตให้กับผู้สมัครที่คุณชื่นชอบ", "Vote for your favorite candidate", "好きな候補者に投票しよう"],
    ["ไม่พบข้อมูลรายชื่อผู้สมัคร", "No candidates found", "候補者が見つかりません"],
    ["ไม่มีข้อมูลผู้สมัครในกิจกรรมโหวตนี้", "No candidates in this vote event", "この投票イベントに候補者はいません"],
    ["ไม่มีข้อมูลสรุปผลคะแนนโหวตในขณะนี้", "No vote results yet", "投票結果はまだありません"],
    ["คุณต้องเข้าสู่ระบบก่อนทำการลงคะแนนโหวต", "Please log in before voting", "投票するにはログインしてください"],
    ["คุณต้องเข้าสู่ระบบก่อนส่งของขวัญให้เมมเบอร์", "Please log in before sending gifts", "ギフトを送るにはログインしてください"],
    ["กำลังโหลด...", "Loading...", "読み込み中..."],
    ["กำลังเปิด Backpack...", "Opening Backpack...", "バックパックを開いています..."],
    ["Backpack ของคุณยังว่างอยู่ค่ะ", "Your Backpack is empty", "バックパックは空です"],
    ["ซื้อของขวัญเก็บไว้ก่อนได้ ตอนกด Send ในแท็บร้านค้า", "You can buy gifts to keep when pressing Send in the shop tab", "ショップタブで送信を押すときにギフトを購入して保管できます"],
    ["ยังไม่มีของขวัญในหมวดนี้", "No gifts in this category yet", "このカテゴリーにギフトはありません"],
    ["ระบุจำนวน", "Enter amount", "数量を入力"],
    ["กรุณาใส่จำนวนเต็มตั้งแต่ 1 ขึ้นไป", "Please enter a whole number of 1 or more", "1以上の整数を入力してください"],
    ["ใส่ได้สูงสุด", "Maximum", "最大"],
    ["คุกกี้ไม่พอ", "Not enough cookies", "クッキーが足りません"],
    ["คุณมี", "You have", "所持:"],
    ["Cookies แต่ต้องใช้", "Cookies but need", "クッキー、必要:"],
    ["คะแนนโหวต · ใช้ของจาก Backpack ไม่หัก Cookie", "votes · uses Backpack items, no Cookies deducted", "票・バックパックのアイテムを使用、クッキーは消費しません"],
    ["เท่ากับ", "Equal", "＝"],
    ["ส่งของขวัญไม่สำเร็จ", "Couldn't send gift", "ギフトを送れませんでした"],
    ["เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์หรือการหักคุกกี้", "Error verifying permission or deducting cookies", "権限確認またはクッキー消費でエラーが発生しました"],
    ["เก็บ \"", "Saved \"", "保管「"],
    ["เข้า Backpack แล้ว", "to Backpack", "をバックパックに入れました"],
    ["กด Send ในแท็บ Backpack เพื่อโหวตได้เลย", "Press Send in the Backpack tab to vote", "バックパックタブで送信を押して投票しよう"],
    ["เก็บของขวัญไม่สำเร็จ", "Couldn't save gift", "ギフトを保管できませんでした"],
    ["โหวตให้", "Voted for", "投票:"],
    ["ด้วย \"", "with \"", "「"],
    ["โหวตไม่สำเร็จ", "Vote failed", "投票に失敗しました"],
    ["เกิดข้อผิดพลาดในการตรวจสอบของขวัญในกระเป๋า", "Error checking gifts in your bag", "バッグ内のギフト確認でエラーが発生しました"],
    ["โหวตด้วย Token", "Vote using token", "Tokenで投票"],
    ["ยอดคงเหลือทั้งหมด: - tokens", "Total balance: - tokens", "残高合計: - Token"],
    ["ยอดคงเหลือทั้งหมด: {n} tokens", "Total balance: {n} tokens", "残高合計: {n} Token"],
    ["ยืนยันการทำรายการ", "Confirm transaction", "取引を確認"],
    ["ส่งเรียบร้อยแล้ว", "Submission completed", "送信完了"],
    ["กรุณารอสักครู่ รายการจะแสดงในประวัติธุรกรรมของคุณ", "Please wait for this transaction to show on your transaction history", "取引履歴に反映されるまでお待ちください"],
    ["ดูประวัติธุรกรรม", "See transaction history", "取引履歴を見る"],
    ["การ์ดขอบคุณ", "Thank You Card", "サンキューカード"],
    ["จำนวนไม่ถูกต้อง", "Invalid amount", "数量が正しくありません"],
    ["ขั้นต่ำในการโหวตคือ 1", "The minimum vote is 1", "最低投票数は1です"],
    ["ไม่พอ", "not enough", "不足"],
    ["แต่ต้องการโหวต", "but you want to vote", "投票希望:"],
    ["การลงคะแนนโหวตไม่สำเร็จ", "Vote failed", "投票に失敗しました"],
    ["เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์หรือการหักเหรียญ", "Error verifying permission or deducting tokens", "権限確認またはToken消費でエラーが発生しました"],
    ["ไม่พบข้อมูลกิจกรรมโหวตหรือผู้สมัคร", "Vote event or candidate not found", "投票イベントまたは候補者が見つかりません"],

    // ---------- Membership card / tier ----------
    ["บัตรสมาชิก", "Membership Card", "会員カード"],
    ["", "BLM48 Official Membership", "BLM48 公式メンバーシップ"],
    ["กำลังสร้างการ์ด...", "Creating card...", "カードを作成中..."],
    ["ระดับสมาชิก", "Membership Tier", "会員ランク"],
    ["ระดับสมาชิกและสิทธิพิเศษของคุณ", "Your membership tier and benefits", "あなたの会員ランクと特典"],
    ["บันทึกการ์ด", "Save Card", "カードを保存"],
    ["สร้างการ์ดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "Couldn't create the card. Please try again.", "カードを作成できませんでした。もう一度お試しください。"],
    ["กด Save Card เพื่อบันทึกการ์ดเก็บไว้ในเครื่อง", "Press Save Card to save the card to your device", "「カードを保存」で端末に保存できます"],
    ["ไม่สามารถโหลดดีไซน์การ์ดได้ กรุณาลองใหม่อีกครั้ง", "Couldn't load the card design. Please try again.", "カードデザインを読み込めませんでした。もう一度お試しください。"],
    ["ระดับ Tier ของคุณคำนวณจาก", "Your Tier is calculated from your", "あなたのTierは"],
    ["Fan Score สะสมทั้งหมด", "lifetime Fan Score", "累計Fan Score"],
    ["(ยอดคุกกี้ที่มอบให้เมมเบอร์สะสมตลอดกาล) ระบบจะอัปเดตระดับ Tier ให้ทันทีเมื่อ Fan Score เปลี่ยนแปลง", "(all cookies you've ever given to members). Your Tier updates immediately when your Fan Score changes.", "（メンバーに贈ったクッキーの累計）で計算され、Fan Scoreが変わるとすぐに更新されます。"],
    ["หมายเหตุ: สิทธิพิเศษของแต่ละ Tier ใน BLM48 Membership Tier รวมทั้งเงื่อนไขและอัตราการคำนวณ อาจมีการปรับเปลี่ยนตามความเหมาะสม โดยทีมงาน BLM48 จะประกาศการเปลี่ยนแปลงล่วงหน้าผ่านแอปพลิเคชัน BLM48 Membership ก่อนมีผลบังคับใช้",
      "Note: Each Tier's benefits, conditions and calculation rates may change as appropriate. The BLM48 team will announce changes in advance in the BLM48 Membership app before they take effect.",
      "注：各Tierの特典・条件・計算方法は変更される場合があります。変更はBLM48 Membershipアプリで事前にお知らせします。"],
    ["ทุกบัญชีจะได้รับ Copper Tier ตั้งแต่วันที่เปิดใช้งานบัญชี และคงระดับนี้ไว้เมื่อมี Fan Score สะสมต่ำกว่า 5,000", "Every account starts at Copper Tier and stays there while the lifetime Fan Score is below 5,000", "全アカウントはCopper Tierから始まり、累計Fan Scoreが5,000未満の間はこのランクです"],
    ["ได้รับ Copper Membership Card ประจำตัว", "Get your own Copper Membership Card", "Copper会員カードがもらえます"],
    ["รับคุกกี้รายเดือนที่ระดับ Copper 150 Cookies ผ่านปุ่ม \"รับคุกกี้รายเดือน\" ในหน้าโปรไฟล์", "Claim 150 Copper monthly cookies with the \"Monthly Cookie\" button on your profile", "プロフィールの「マンスリークッキー」でCopperの月間クッキー150個を受け取れます"],
    ["ได้รับสถานะ Silver Tier เมื่อมี Fan Score สะสมตั้งแต่ 5,000 แต่ไม่ถึง 10,000", "Silver Tier with a lifetime Fan Score of 5,000 up to 10,000", "累計Fan Scoreが5,000以上10,000未満でSilver Tier"],
    ["ได้รับ Silver Membership Card ประจำตัว", "Get your own Silver Membership Card", "Silver会員カードがもらえます"],
    ["รับคุกกี้รายเดือนที่ระดับ Silver 300 Cookies ผ่านปุ่ม \"รับคุกกี้รายเดือน\" ในหน้าโปรไฟล์", "Claim 300 Silver monthly cookies with the \"Monthly Cookie\" button on your profile", "プロフィールの「マンスリークッキー」でSilverの月間クッキー300個を受け取れます"],
    ["ได้รับสถานะ Gold Tier เมื่อมี Fan Score สะสมตั้งแต่ 10,000 ขึ้นไป", "Gold Tier with a lifetime Fan Score of 10,000 or more", "累計Fan Scoreが10,000以上でGold Tier"],
    ["ได้รับ Gold Membership Card ประจำตัว", "Get your own Gold Membership Card", "Gold会員カードがもらえます"],
    ["รับคุกกี้รายเดือนที่ระดับ Gold 500 Cookies ผ่านปุ่ม \"รับคุกกี้รายเดือน\" ในหน้าโปรไฟล์", "Claim 500 Gold monthly cookies with the \"Monthly Cookie\" button on your profile", "プロフィールの「マンスリークッキー」でGoldの月間クッキー500個を受け取れます"],
    ["Tier ปัจจุบัน", "Current Tier", "現在のTier"],

    // ---------- Missions ----------
    ["ภารกิจประจำวัน", "Daily Missions", "デイリーミッション"],
    ["ทำภารกิจครบ รับ 5 Tokens ฟรี! รีเซ็ตในอีก", "Complete all missions for 5 free Tokens! Resets in", "全ミッション達成で5 Token無料！リセットまで"],
    ["ทำภารกิจให้ครบก่อนนะ", "Complete all missions first", "先にミッションを達成してね"],
    ["เช็คอินรายเดือน", "Monthly Check-in", "月間チェックイン"],
    ["เช็คอินให้ครบทุกวันในเดือนนี้ รับ 100 Tokens เลย!", "Check in every day this month to get 100 Tokens!", "今月毎日チェックインで100 Tokenゲット！"],
    ["สิทธิ์กู้วันที่พลาด", "Missed-day rescues", "見逃し日の救済"],
    ["เช็คอินให้ครบเดือนก่อนนะ", "Check in for the whole month first", "先に1か月チェックインしてね"],
    ["ให้คุกกี้เมมเบอร์รวม", "Give members a total of", "メンバーにクッキー合計"],
    ["กดใจโพสของเดือนนี้", "Like this month's posts", "今月の投稿にいいね"],
    ["โพส (ต่างโพสกัน)", "posts (different posts)", "件（別々の投稿）"],
    ["คอมเมนต์โพสของเดือนนี้", "Comment on this month's posts", "今月の投稿にコメント"],
    ["โพสอัปเดตประจำวัน", "Daily update post", "デイリー更新投稿"],
    ["โพส", "posts", "件"],
    ["บัญชีนี้ยังไม่มีภารกิจประจำวันค่ะ", "This account has no daily missions yet", "このアカウントにはデイリーミッションがありません"],
    ["ไม่มีภารกิจ", "No missions", "ミッションなし"],
    ["กำลังรับของรางวัล...", "Claiming reward...", "報酬を受け取り中..."],
    ["เช็คอินครบเดือนนี้แล้ว รับ 100 Tokens ไปเรียบร้อย!", "Checked in all month — 100 Tokens received!", "今月のチェックイン完了 — 100 Token獲得！"],
    ["เช็คอินครบทุกวันแล้ว! กดรับของรางวัลได้เลย", "Checked in every day! Claim your reward", "毎日チェックイン完了！報酬を受け取ろう"],
    ["เช็คอินแล้ว", "Checked in", "チェックイン済み"],
    ["วัน • ครบเดือนรับ 100 Tokens เลย!", "days • full month gets 100 Tokens!", "日 • 1か月達成で100 Token！"],
    ["กู้วันที่พลาดเช็คอิน?", "Rescue a missed check-in day?", "見逃したチェックイン日を救済しますか？"],
    ["ใช้สิทธิ์กู้", "Use rescue", "救済を使う"],
    ["กำลังกู้วันที่...", "Rescuing day...", "救済中..."],

    // ---------- My Wallet / Token Wallet ----------
    ["กระเป๋าเงินของฉัน", "My Wallet", "マイウォレット"],
    ["สแกน QR code เพื่อโอน", "Scan QR code to transfer", "QRコードをスキャンして送金"],
    ["Wallet Code:", "Wallet Code:", "ウォレットコード:"],
    ["แชร์โค้ดของฉัน", "Share My Code", "マイコードをシェア"],
    ["ไม่สามารถโหลด Wallet Code ได้", "Couldn't load Wallet Code", "ウォレットコードを読み込めませんでした"],
    ["คัดลอก Wallet Code แล้ว", "Copied Wallet Code", "ウォレットコードをコピーしました"],
    ["ชื่อ Token:", "Token name:", "Token名:"],
    ["ใช้ซื้อสินค้าใน Shop, สั่ง Pre-order และโหวตกิจกรรม Major Vote", "Used to buy Shop items, place Pre-orders and vote in Major Vote", "ショップでの購入、予約、メジャー投票に使えます"],
    ["ใช้โหวตกิจกรรม Major Vote ที่รับ GE Token", "Used to vote in Major Vote events that accept GE Token", "GE Token対応のメジャー投票で使えます"],
    ["ใช้มอบให้เมมเบอร์เพื่อสะสม Fan Score และร่วมกิจกรรม Special Fans Day", "Given to members to build Fan Score and join Special Fans Day", "メンバーに贈ってFan Scoreを貯め、Special Fans Dayに参加できます"],
    ["สลิปการโอน", "Transfer slip", "送金明細"],
    ["ทำรายการโอนสำเร็จ", "Transfer successful", "送金完了"],
    ["บันทึกสลิป", "Save slip", "明細を保存"],

    // ---------- Notifications ----------
    ["สร้างการแจ้งเตือนใหม่", "Create New Notification", "新しいお知らせを作成"],
    ["โพสต์การแจ้งเตือน", "Post Notification", "お知らせを投稿"],
    ["ล้างทั้งหมด", "Clear All", "すべてクリア"],
    ["กรอกข้อความแจ้งเตือน", "Enter notification message", "お知らせメッセージを入力"],
    ["กำลังโหลดการแจ้งเตือน...", "Loading notifications...", "お知らせを読み込み中..."],
    ["อัปเดตไม่สำเร็จ กรุณาลองใหม่อีกครั้ง!", "Failed to update. Please try again!", "更新に失敗しました。もう一度お試しください！"],
    ["ไม่สามารถอัปเดตข้อมูลใหม่ได้ โปรดลองอีกครั้งนะคะ", "Couldn't update. Please try again.", "更新できませんでした。もう一度お試しください。"],
    ["คุณแน่ใจหรือไม่ว่าต้องการลบการแจ้งเตือนนี้? 🗑️", "Are you sure you want to delete this notification? 🗑️", "このお知らせを削除しますか？🗑️"],
    ["ลบการแจ้งเตือนสำเร็จแล้ว!", "Notification deleted!", "お知らせを削除しました！"],
    ["เกิดข้อผิดพลาดในการลบ โปรดลองอีกครั้ง", "Delete failed. Please try again.", "削除に失敗しました。もう一度お試しください。"],
    ["ไม่มีการแจ้งเตือน", "No Notifications.", "お知らせはありません。"],
    ["โปรดระบุข้อความแจ้งเตือนด้วยนะคะ!", "Please enter a notification message!", "お知らせメッセージを入力してください！"],
    ["โพสต์แจ้งเตือนสำเร็จแล้วค่ะ!", "Notification posted!", "お知らせを投稿しました！"],
    ["เกิดข้อผิดพลาดในการโพสต์ข้อมูล", "Couldn't post", "投稿に失敗しました"],
    ["คุณแน่ใจไหมที่จะล้างประวัติการแจ้งเตือนทั้งหมด?", "Clear all notification history?", "お知らせ履歴をすべて消去しますか？"],
    ["ล้างข้อมูลแจ้งเตือนทั้งหมดเรียบร้อยแล้ว!", "All notifications cleared!", "すべてのお知らせを消去しました！"],
    ["เกิดข้อผิดพลาดในการล้างข้อมูล", "Couldn't clear notifications", "消去に失敗しました"],
    ["เปิดการแจ้งเตือนบนมือถือแล้วค่ะ! 🔔", "Phone notifications are on! 🔔", "スマホ通知をオンにしました！🔔"],
    ["เปิดการแจ้งเตือนบนมือถือแล้วค่ะ 🔔", "Phone notifications are on 🔔", "スマホ通知をオンにしました 🔔"],
    ["ปิดการแจ้งเตือนบนมือถือแล้วค่ะ", "Phone notifications are off", "スマホ通知をオフにしました"],
    ["เบราว์เซอร์นี้ไม่รองรับ", "Not supported", "非対応のブラウザ"],
    ["อุปกรณ์หรือเบราว์เซอร์นี้ยังไม่รองรับการแจ้งเตือนบนมือถือค่ะ", "This device or browser doesn't support phone notifications", "この端末またはブラウザはスマホ通知に対応していません"],
    ["เพิ่มลงหน้าจอโฮมก่อนนะคะ", "Add to Home Screen first", "先にホーム画面に追加してください"],
    ["บน iPhone/iPad ต้องกดปุ่มแชร์ แล้วเลือก \"เพิ่มไปยังหน้าจอโฮม\" ก่อน จากนั้นเปิดแอปจากไอคอนบนหน้าจอโฮมแล้วกดปุ่มนี้อีกครั้งค่ะ", "On iPhone/iPad, tap Share and choose \"Add to Home Screen\", then open the app from the home screen icon and tap this button again.", "iPhone/iPadでは共有ボタンから「ホーム画面に追加」を選び、ホーム画面のアイコンからアプリを開いてもう一度このボタンを押してください。"],
    ["การแจ้งเตือนถูกปิดกั้นอยู่", "Notifications are blocked", "通知がブロックされています"],
    ["กรุณาเปิดสิทธิ์การแจ้งเตือนของ BLM48 ในตั้งค่าเครื่องหรือเบราว์เซอร์ก่อนค่ะ", "Please allow BLM48 notifications in your device or browser settings first", "端末またはブラウザの設定でBLM48の通知を許可してください"],
    ["การแจ้งเตือนเปิดอยู่", "Notifications are on", "通知はオンです"],
    ["การแจ้งเตือนปิดอยู่", "Notifications are off", "通知はオフです"],
    ["เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือนแบบ Push ค่ะ", "This browser doesn't support push notifications", "このブラウザはプッシュ通知に対応していません"],
    ["กรุณาเข้าสู่ระบบก่อนเปิดการแจ้งเตือน", "Please log in before turning on notifications", "通知をオンにするにはログインしてください"],
    ["ไม่ได้รับอนุญาตให้แจ้งเตือนค่ะ", "Notification permission was denied", "通知が許可されませんでした"],
    ["บันทึกการแจ้งเตือนไม่สำเร็จ", "Couldn't save notification settings", "通知設定を保存できませんでした"],
    ["เปิดการแจ้งเตือนไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ", "Couldn't turn on notifications. Please try again.", "通知をオンにできませんでした。もう一度お試しください。"],
    ["ปิดการแจ้งเตือนไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ", "Couldn't turn off notifications. Please try again.", "通知をオフにできませんでした。もう一度お試しください。"],

    // ---------- Profile ----------
    ["กระเป๋าเงิน", "Wallet", "ウォレット"],
    ["ประวัติ", "History", "履歴"],
    ["บัญชีของฉัน", "My Account", "マイアカウント"],
    ["แลกรหัส", "Redeem Code", "コード引き換え"],
    ["คุกกี้รายเดือน", "Monthly Cookie", "マンスリークッキー"],
    ["โปรไฟล์แฟนคลับของฉัน", "My Fan Club Profile", "マイファンクラブプロフィール"],
    ["แดชบอร์ดแอดมิน", "Admin Dashboard", "管理ダッシュボード"],
    ["เว็บไซต์ทางการ", "Official Site", "公式サイト"],
    ["ปรับตำแหน่งรูปโปรไฟล์", "Adjust profile photo", "プロフィール写真を調整"],
    ["ยืนยันรูปภาพนี้", "Use this photo", "この写真を使う"],
    ["ปรับตำแหน่งภาพพื้นหลัง", "Adjust cover photo", "カバー写真を調整"],
    ["อัปเดตรูปพื้นหลังไม่สำเร็จ", "Couldn't update cover photo", "カバー写真を更新できませんでした"],
    ["เปลี่ยนภาพพื้นหลังโปรไฟล์เรียบร้อยแล้วค่ะ", "Cover photo updated", "カバー写真を変更しました"],
    ["ไม่สามารถอัปโหลดรูปได้ในขณะนี้", "Couldn't upload the photo right now", "現在写真をアップロードできません"],
    ["กำลังนำรูปภาพโปรไฟล์ใหม่ขึ้นระบบฐานข้อมูล", "Uploading your new profile photo", "新しいプロフィール写真をアップロード中"],
    ["อัปเดตรูปไม่สำเร็จ", "Couldn't update photo", "写真を更新できませんでした"],
    ["เปลี่ยนรูปภาพโปรไฟล์ของคุณเรียบร้อยงับ", "Profile photo updated", "プロフィール写真を変更しました"],
    ["ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้งนะงับ", "Couldn't save the photo. Please try again.", "写真を保存できませんでした。もう一度お試しください。"],

    // ---------- Redeem ----------
    ["กรอกรหัสของคุณ", "Enter your code", "コードを入力"],
    ["แลกรับ Token", "Redeem token", "Tokenを引き換え"],
    ["ไม่สามารถแลกโค้ดนี้ได้", "This code can't be redeemed", "このコードは引き換えできません"],

    // ---------- Search ----------
    ["กำลังโหลดข้อมูลเมมเบอร์...", "Loading members...", "メンバーを読み込み中..."],
    ["ค้นหาเมมเบอร์...", "Search members...", "メンバーを検索..."],
    ["ไม่พบฐานข้อมูลเมมเบอร์", "Member list not found", "メンバーリストが見つかりません"],
    ["ไม่พบเมมเบอร์ที่คุณค้นหา", "No members match your search", "該当するメンバーが見つかりません"],

    // ---------- Shop ----------
    ["สินค้า", "Merchandise", "グッズ"],
    ["คาเฟ่", "Cafe", "カフェ"],
    ["บันทึกรูป", "Save Image", "画像を保存"],
    ["สินค้าทางการ", "Official Merchandise", "公式グッズ"],
    ["ร้านคุกกี้", "Cookie Shop", "クッキーショップ"],
    ["แพ็ก", "Pack", "パック"],
    ["เติมคุกกี้สำหรับใช้งานทั่วไป", "Cookie top-up for general use", "通常利用のクッキーチャージ"],
    ["คุ้มที่สุด", "Best Value", "一番お得"],
    ["แพ็กคุ้มค่า", "Value Pack", "お得パック"],
    ["กำลังหมุนกาชาปอง...", "Spinning gachapon...", "ガチャを回しています..."],
    ["ยินดีด้วย", "CONGRATULATIONS", "おめでとう"],
    ["ชื่อไอเทม", "Item Name", "アイテム名"],
    ["เก็บ", "Collect", "受け取る"],
    ["ไอเทมของฉัน", "My Items", "マイアイテム"],
    ["ครบจำนวนสุ่มแล้ว", "Draw Limit Reached", "上限に達しました"],
    ["สุ่ม ×1", "Draw ×1", "1回引く"],
    ["สินค้าหมด", "Sold Out", "売り切れ"],
    ["ขายดี", "Best Seller", "ベストセラー"],
    ["เกิดข้อผิดพลาดในการโหลดข้อมูลตู้สุ่ม กรุณาลองใหม่อีกครั้งค่ะ", "Couldn't load the gacha. Please try again.", "ガチャを読み込めませんでした。もう一度お試しください。"],

    // ---------- Ticket ----------
    ["กำลังโหลดร้าน...", "LOADING STORE...", "ストアを読み込み中..."],
    ["โรงละคร & คอนเสิร์ต", "Theaters & Concerts", "劇場＆コンサート"],
    ["กำลังโหลดบัตร...", "Loading tickets...", "チケットを読み込み中..."],
    ["เลือกระดับสิทธิประโยชน์", "Selet Benefit Tiers", "特典ランクを選択"],
    ["ที่นั่งคงเหลือ", "seats left", "席残り"],
    ["ยืนยันการสั่งจองบัตร", "Confirm ticket booking", "チケット予約を確認"],
    ["เพื่อสั่งจองบัตรระดับ", "to book tier", "でチケットを予約:"],
    ["กำลังดำเนินการสั่งจองบัตร...", "Booking ticket...", "チケットを予約中..."],
    ["ระบบได้นำส่งเอกสารสิทธิ์และสิทธิประโยชน์เข้าสู่คลังส่วนตัวเรียบร้อยแล้ว", "Your ticket and benefits have been added to your inventory", "チケットと特典をインベントリに追加しました"]
  ];

  var COL = { th: 0, en: 1, ja: 2 };
  var THAI = /[฀-๿]/;
  var exact = new Map(), tmpl = new Map();
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  DICT.forEach(function (e) {
    var out = e[COL[lang]] || e[1] || e[0];
    [e[0], e[1]].forEach(function (k) {
      if (!k) return;
      k = norm(k);
      var map = k.indexOf('{n}') >= 0 ? tmpl : exact;
      if (map.has(k)) return; // แถวแรกที่เจอชนะ (คำแบรนด์อย่าง Oshi/Token ใส่ไว้ก่อน — เก็บแม้แปลแล้วได้คำเดิม)
      map.set(k, out);
    });
  });

  // EN/JP: แปลท่อนข้อความไทยที่ถูกต่อกันกับตัวเลข/ชื่อ (ท่อนต้องไม่ติดตัวอักษรไทยอื่นทั้งหน้าและหลัง)
  var fragRe = null;
  if (lang !== 'th') {
    var frags = [];
    exact.forEach(function (v, k) { if (THAI.test(k)) frags.push(k); });
    frags.sort(function (a, b) { return b.length - a.length; });
    if (frags.length) {
      fragRe = new RegExp('(?<![\\u0E00-\\u0E7F])(' + frags.map(function (f) {
        return f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('|') + ')(?![\\u0E00-\\u0E7F])', 'g');
    }
  }

  var NUM = /\d[\d,]*(?:\.\d+)?/g;
  function translate(raw) {
    if (raw == null) return null;
    var s = norm(String(raw));
    if (!s) return null;
    if (lang === 'th' && !/[A-Za-z]/.test(s)) return null; // โหมดไทย: แปลเฉพาะข้อความอังกฤษ
    var out = exact.get(s);
    if (out == null && tmpl.size) {
      var nums = [];
      var key = s.replace(NUM, function (m) { nums.push(m); return '{n}'; });
      if (nums.length) {
        var t = tmpl.get(key);
        if (t != null) { var i = 0; out = t.replace(/\{n\}/g, function () { return nums[i++]; }); }
      }
    }
    if (out == null && fragRe && THAI.test(s)) {
      var replaced = s.replace(fragRe, function (m) { return exact.get(m); });
      // วันที่แบบไทยใช้ปี พ.ศ. — แปลงเป็น ค.ศ. เมื่อมีชื่อเดือนถูกแปลในข้อความเดียวกัน
      if (replaced !== s && /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|月)/.test(replaced)) {
        replaced = replaced.replace(/\b(25[5-9]\d)\b/g, function (y) { return String(+y - 543); });
      }
      if (replaced !== s) out = replaced;
    }
    if (out == null || out === s) return null;
    // เก็บช่องว่างหน้า/หลังเดิมไว้ (ข้อความที่ต่อกับ element อื่น)
    var str = String(raw);
    var lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0];
    return lead + out.replace(/​/g, '').trim() + trail;
  }
  window.blm48T = function (s) { var r = translate(s); return r == null ? s : r; };

  var SKIP = 'script,style,textarea,noscript,code,[contenteditable="true"],.notranslate,[translate="no"]';
  var ATTRS = ['placeholder', 'title', 'aria-label'];
  var written = new WeakMap();

  function doText(node) {
    var v = node.nodeValue;
    if (!v || written.get(node) === v) return;
    var p = node.parentElement;
    if (!p || p.closest(SKIP)) return;
    var r = translate(v);
    if (r != null && r !== v) { written.set(node, r); node.nodeValue = r; }
  }
  function doAttrs(el) {
    if (el.closest && el.closest(SKIP)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = el.getAttribute && el.getAttribute(ATTRS[i]);
      if (a) { var r = translate(a); if (r != null) el.setAttribute(ATTRS[i], r); }
    }
    if (el.tagName === 'INPUT' && /^(button|submit)$/i.test(el.type) && el.value) {
      var rv = translate(el.value); if (rv != null) el.value = rv;
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (root.matches(SKIP)) return;
      doAttrs(root);
    }
    var tw = document.createTreeWalker(root, 5 /* ELEMENT | TEXT */, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return n.matches(SKIP) ? 2 /* REJECT */ : 1;
        return 1;
      }
    });
    var n;
    while ((n = tw.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }

  var mo = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var rec = records[i];
      if (rec.type === 'characterData') doText(rec.target);
      else if (rec.type === 'attributes') doAttrs(rec.target);
      else for (var j = 0; j < rec.addedNodes.length; j++) walk(rec.addedNodes[j]);
    }
  });
  mo.observe(document.documentElement, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ATTRS
  });
  if (document.readyState !== 'loading') walk(document.documentElement);
  document.addEventListener('DOMContentLoaded', function () { walk(document.documentElement); });

  // alert/confirm/prompt แบบ native ก็แปลด้วย
  ['alert', 'confirm', 'prompt'].forEach(function (fn) {
    var orig = window[fn];
    if (typeof orig !== 'function') return;
    window[fn] = function (msg) {
      var args = Array.prototype.slice.call(arguments);
      if (typeof msg === 'string') args[0] = window.blm48T(msg);
      return orig.apply(window, args);
    };
  });
})();
