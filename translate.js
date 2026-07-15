/* ==========================================================================
   translate.js
   ระบบปุ่มแปลภาษา (TH / EN / CN) โดยใช้ Google Translate Website API
   ========================================================================== */

// ฟังก์ชันนี้จะถูกเรียกอัตโนมัติโดย Google Translate script (ผ่าน cb=googleTranslateElementInit)
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'th',
            includedLanguages: 'th,en,zh-CN,ja',
            autoDisplay: false
        },
        'google_translate_element'
    );

    // เมื่อ widget พร้อมใช้งานแล้ว ให้ทำเครื่องหมายปุ่มที่ตรงกับภาษาปัจจุบัน
    markActiveLangButton(getCurrentLangFromCookie());
}

// อ่านค่าภาษาปัจจุบันจากคุกกี้ googtrans ที่ Google Translate ใช้เก็บสถานะ
function getCurrentLangFromCookie() {
    const match = document.cookie.match(/googtrans=\/th\/([a-zA-Z-]+)/);
    return match ? match[1] : 'th';
}

// ทำเครื่องหมายปุ่มภาษาที่กำลังใช้งานอยู่ (ใส่ class active)
function markActiveLangButton(lang) {
    const buttons = {
        th: document.getElementById('lang-th'),
        en: document.getElementById('lang-en'),
        'zh-CN': document.getElementById('lang-cn'),
        ja: document.getElementById('lang-jp')
    };
    Object.values(buttons).forEach(btn => btn && btn.classList.remove('active'));
    if (buttons[lang]) {
        buttons[lang].classList.add('active');
    }
}

// ตั้งค่าคุกกี้ googtrans เพื่อสั่งให้ Google Translate แปลหน้าเว็บเป็นภาษาที่ต้องการ แล้วโหลดหน้าใหม่
function setLanguage(lang) {
    if (lang === 'th') {
        // กลับไปเป็นภาษาไทย (ภาษาต้นฉบับ) ด้วยการลบคุกกี้การแปล
        clearGoogTransCookie();
    } else {
        const value = '/th/' + lang;
        document.cookie = 'googtrans=' + value + '; path=/';
        document.cookie = 'googtrans=' + value + '; path=/; domain=' + window.location.hostname;
    }
    window.location.reload();
}

function clearGoogTransCookie() {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
}

// ผูกปุ่มทั้ง 3 กับฟังก์ชันเปลี่ยนภาษาเมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const btnTH = document.getElementById('lang-th');
    const btnEN = document.getElementById('lang-en');
    const btnCN = document.getElementById('lang-cn');
    const btnJP = document.getElementById('lang-jp');

    if (btnTH) btnTH.addEventListener('click', () => setLanguage('th'));
    if (btnEN) btnEN.addEventListener('click', () => setLanguage('en'));
    if (btnCN) btnCN.addEventListener('click', () => setLanguage('zh-CN'));
    if (btnJP) btnJP.addEventListener('click', () => setLanguage('ja'));

    // ทำเครื่องหมายปุ่มที่ใช้งานอยู่ทันทีตามคุกกี้ปัจจุบัน (ก่อน widget โหลดเสร็จ)
    markActiveLangButton(getCurrentLangFromCookie());
});
