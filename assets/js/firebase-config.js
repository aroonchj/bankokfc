/* =========================================================================
   ตั้งค่า Firebase สำหรับระบบ "นักกีฬา" ของบ้านคอก เอฟซี
   ทำตามคู่มือ "วิธีตั้งค่า Firebase.txt" ที่แนบมาในไฟล์ดาวน์โหลด
   แล้วนำค่าที่ได้มาใส่แทนที่ข้อความ YOUR_XXX ด้านล่างนี้
   ========================================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyCkOsU-m7hMWNoHqD9oeBjBgcI_HywPFvQ",
  authDomain: "bankok-fc.firebaseapp.com",
  projectId: "bankok-fc",
  storageBucket: "bankok-fc.firebasestorage.app",
  messagingSenderId: "534844237973",
  appId: "1:534844237973:web:48ae2188761ff4acd4939c"
};

/* รหัสผ่านแอดมิน สำหรับเพิ่ม/ลบนักกีฬา
   เปลี่ยนเป็นรหัสของคุณเอง แล้วนำรหัสเดียวกันไปใส่ใน Firestore Rules ด้วย
   (ดูขั้นตอนในคู่มือ ข้อ 4) */
const ADMIN_PIN = "bankok6fc2569";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ---- ตั้งค่าเพื่อความเร็ว/ความเสถียร ----
   1) บังคับใช้ long-polling แทน WebSocket โดยตรวจจับอัตโนมัติ
      ช่วยเลี่ยงปัญหาค้างจาก ad-blocker / extension / เครือข่ายบางที่บล็อกการเชื่อมต่อ
   2) เปิด cache แบบ IndexedDB ไว้ในเครื่อง ทำให้เข้าเว็บครั้งถัดไปโหลดข้อมูลจากแคชได้ทันที
      แล้วค่อยอัปเดตของใหม่แบบเงียบๆ เมื่อเชื่อมต่อสำเร็จ */
try {
  db.settings({
    experimentalAutoDetectLongPolling: true,
    useFetchStreams: false,
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });
} catch (e) { /* settings ต้องถูกเรียกก่อนใช้งาน db ครั้งแรกเท่านั้น ข้ามได้ถ้าพลาด */ }

try {
  db.enablePersistence({ synchronizeTabs: true }).catch(() => {
    /* เปิดหลายแท็บพร้อมกัน หรือเบราว์เซอร์ไม่รองรับ — ใช้งานต่อได้ปกติ แค่ไม่มีแคชออฟไลน์ */
  });
} catch (e) { /* เบราว์เซอร์รุ่นเก่าบางตัวไม่รองรับ ข้ามได้ */ }
