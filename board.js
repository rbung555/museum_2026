// รอดึงข้อมูลเมื่อหน้าจอโหลดเสร็จสิ้น
document.addEventListener("DOMContentLoaded", () => {
    loadCardData();
    initThemeToggle();
});

// ฟังก์ชันดึงข้อมูลจากไฟล์ JSON และใส่ลงในการ์ดตาม data-id
async function loadCardData() {
    try {
        // ดึงไฟล์ข้อมูล json
        const response = await fetch('board.json');
        const data = await response.json();

        // เลือก Element การ์ดทั้งหมดที่มีการระบุ data-id
        const cards = document.querySelectorAll('.card_body');

        cards.forEach(card => {
            const id = card.getAttribute('data-id');
            // ค้นหาข้อมูลใน json ที่มี id ตรงกับ data-id ของการ์ด
            const itemData = data.find(item => item.id == id);

            if (itemData) {
                // สร้างโครงสร้าง HTML ด้านในและใส่ข้อมูลที่ดึงมา
                card.innerHTML = `
                    <div class="card_pic">
                        <img src="${itemData.img}" alt="${itemData.name}">
                    </div>
                    <div class="card_data">                
                        <div class="card_name"><h2>${itemData.name}</h2></div>
                        <div class="card_job"><h4>${itemData.job}</h4></div>
                    </div>
                `;
            } else {
                card.innerHTML = `<div class="card_data">ไม่พบข้อมูล ID: ${id}</div>`;
            }
        });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล JSON:", error);
    }
}

// // ฟังก์ชันระบบสลับโหมด กลางวัน / กลางคืน
// function initThemeToggle() {
//     const toggleBtn = document.getElementById('theme-toggle');
    
//     // ตรวจสอบว่าเคยเซฟโหมดไหนไว้ในเครื่องไหม
//     const currentTheme = localStorage.getItem('theme') || 'light';
//     document.documentElement.setAttribute('data-theme', currentTheme);

//     toggleBtn.addEventListener('click', () => {
//         let theme = document.documentElement.getAttribute('data-theme');
//         let newTheme = theme === 'dark' ? 'light' : 'dark';
        
//         document.documentElement.setAttribute('data-theme', newTheme);
//         localStorage.setItem('theme', newTheme); // บันทึกสถานะลงใน Browser
//     });
// }