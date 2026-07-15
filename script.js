document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadContentFromHTML();
    loadImagesFromJSON();
    initFloatingMenu(); // รันระบบปุ่ม Hamburger ลอยอันเดียวพอ
});

// --- ระบบสลับโหมด Day/Night ---
function initTheme() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        let newTheme = theme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

// --- ดึงข้อความจาก details.html ด้วย ID ---
function loadContentFromHTML() {
    fetch('details.html')
        .then(response => response.text())
        .then(htmlString => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const sections = document.querySelectorAll('[data-content-id]');
            
            sections.forEach(section => {
                const contentId = section.getAttribute('data-content-id');
                const sourceData = doc.getElementById(contentId);
                
                if (sourceData) {
                    section.querySelector('.content-box').innerHTML = sourceData.innerHTML;
                }
            });
        })
        .catch(error => console.error('เกิดข้อผิดพลาดในการโหลดข้อความ:', error));
}

// --- ดึงรูปภาพจาก JSON แบบกรองตามความสัมพันธ์ของ ID ---
function loadImagesFromJSON() {
    fetch('images.json')
        .then(response => response.json())
        .then(imagesArray => {
            const imageTargets = document.querySelectorAll('[data-image-target]');
            
            imageTargets.forEach(target => {
                const targetId = target.getAttribute('data-image-target');
                const matchedImages = imagesArray.filter(img => img.belongs_to_content === targetId);
                
                if (matchedImages.length > 0) {
                    target.innerHTML = '';
                    
                    matchedImages.forEach(imageData => {
                        const img = document.createElement('img');
                        img.src = imageData.url;
                        img.alt = `Image ID: ${imageData.img_id}`;
                        target.appendChild(img);
                    });
                }
            });
        })
        .catch(error => console.error('เกิดข้อผิดพลาดในการโหลดรูปภาพ:', error));
}

// --- ระบบจัดการเมนูปุ่มลอย Hamburger เมื่อเลื่อนหน้าจอ ---
function initFloatingMenu() {
    const mainNav = document.getElementById("main-nav");
    const floatingNav = document.getElementById("floating-nav");
    const floatingBtn = document.getElementById("floating-btn");
    const floatingMenu = document.getElementById("floating-menu");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 60) {
            mainNav.classList.add("hidden");
            floatingNav.classList.add("visible");
        } else {
            mainNav.classList.remove("hidden");
            floatingNav.classList.remove("visible");
            floatingMenu.classList.remove("active"); 
            floatingBtn.innerHTML = '<i class="fa-solid fa-bars"></i>'; 
        }
    });

    floatingBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        floatingMenu.classList.toggle("active");
        
        if (floatingMenu.classList.contains("active")) {
            floatingBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            floatingBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    document.addEventListener("click", () => {
        floatingMenu.classList.remove("active");
        floatingBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
}

// รอดึงข้อมูลเมื่อหน้าจอโหลดเสร็จสิ้น
// document.addEventListener("DOMContentLoaded", () => {
//     loadCardData();
//     initThemeToggle();
// });

// ฟังfก์ชันดึงข้อมูลจากไฟล์ JSON และใส่ลงในการ์ดตาม data-id
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

const pages = [
    "index.html",
    "board.html",
    "room1.html",
    "room2_1.html",
    "room2_2.html",
    "room3.html",
    "room4.html",
    "room5.html",
    "room6.html"
];

const current = window.location.pathname.split("/").pop();
const index = pages.indexOf(current);

document.getElementById("prevBtn").onclick = () => {
    if (index > 0) {
        window.location.href = pages[index - 1];
    }
};

document.getElementById("nextBtn").onclick = () => {
    if (index < pages.length - 1) {
        window.location.href = pages[index + 1];
    }
};

if (index === 0)
    document.getElementById("prevBtn").style.display = "none";

if (index === pages.length - 1)
    document.getElementById("nextBtn").style.display = "none";

