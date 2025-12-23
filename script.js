// CONFIG
const myPhotos = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg']; 
const letterText = "Hai sayangku Rea... Gak kerasa ya 2025 udah mau abis. Makasih ya udah nemenin aku melewati tahun ini dengan penuh warna. Kamu adalah kado terbaikku setiap hari. Di 2026 nanti, aku berharap kita masih tetap sama-sama, makin kompak, dan makin sayang. Happy New Year, cantik! I love you! ❤️";

const secretMessages = {
    game1: "Tetap semangat ya Sayangkuu, apapun yang terjadi teruslah melangkah. ❤️",
    game2: "Rea sehat-sehat selalu ya, drex ke pingin liat rea bahagiaa. ✨",
    game3: "Lagu ini indah, tapi suaramu jauh lebih indah di telingaku. 🎵",
    dateGame: "Hari itu adalah awal dari segalanya yang indah bersamamu. 🌹"
};

let currentNextScreen = 1;

function showScreen(num) {
    if (num === 2) {
        document.getElementById('myAudio').play().catch(() => console.log("Audio blocked"));
    }
    
    let screenId = (num === 'date') ? 'screen-date' : (num === 'secret' ? 'screen-secret' : `screen-${num}`);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (num === 2) setupGame();
    if (num === 6) startTyping();
}

function triggerSuccess(next, msgKey) {
    currentNextScreen = next;
    const modal = document.getElementById('success-modal');
    modal.classList.remove('hidden');
    document.getElementById('modal-next-btn').onclick = () => {
        modal.classList.add('hidden');
        openSecretCard(msgKey);
    };
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
    });
    // ... sisa kode triggerSuccess ...
}

function openSecretCard(msgKey) {
    document.getElementById('secret-content').innerText = `"${secretMessages[msgKey]}"`;
    document.getElementById('btn-secret-next').onclick = () => showScreen(currentNextScreen);
    showScreen('secret');
}

function showTroll() {
    document.getElementById('troll-modal').classList.remove('hidden');
}

function setupGame() {
    const emojis = ['🌹', '🧸', '🍫', '💍', '🍦', '❤️', '🌹', '🧸', '🍫', '💍', '🍦', '❤️'];
    emojis.sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    
    let flipped = [];
    let matched = 0;
    
    emojis.forEach(icon => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = '❓';
        
        card.onclick = () => {
            if (flipped.length < 2 && card.innerHTML === '❓') {
                card.innerHTML = icon;
                card.style.background = '#ffe0e6';
                flipped.push(card);
                
                if (flipped.length === 2) {
                    if (flipped[0].innerHTML === flipped[1].innerHTML) {
                        matched += 2;
                        flipped = [];
                        if (matched === emojis.length) setTimeout(() => triggerSuccess(3, 'game1'), 500);
                    } else {
                        setTimeout(() => {
                            flipped.forEach(c => {
                                c.innerHTML = '❓';
                                c.style.background = 'white';
                            });
                            flipped = [];
                        }, 600);
                    }
                }
            }
        };
        grid.appendChild(card);
    });
}

function checkColorGame() {
    const val = document.getElementById('color-input').value.toLowerCase().trim();
    if (val === 'merah') triggerSuccess(4, 'game2');
    else document.getElementById('color-hint').innerText = "Salah bby, masa lupa warna kesukaanku?";
}

function checkSongGame() {
    const val = document.getElementById('song-input').value.toLowerCase();
    if (val.includes('surat cinta untuk starla')) triggerSuccess('date', 'game3');
    else document.getElementById('song-hint').innerText = "Salah bby, cek deskripsi playlist kita deh";
}

function checkDateGame() {
    const val = document.getElementById('date-input').value.toLowerCase().trim();
    if (val === '13 agustus 2025') triggerSuccess(5, 'dateGame');
    else document.getElementById('date-hint').innerText = "Coba ingat lagi tanggal jadian/ketemu kita...";
}

function revealReason(el, txt) {
    if (!el.classList.contains('revealed')) {
        el.innerText = txt;
        el.classList.add('revealed');
        if (document.querySelectorAll('.reason-item.revealed').length === 3) {
            document.getElementById('btn-to-letter').classList.remove('hidden');
        }
    }
}

function startTyping() {
    let i = 0;
    const el = document.getElementById('typewriter-text');
    el.innerHTML = "";
    function type() {
        if (i < letterText.length) {
            el.innerHTML += letterText.charAt(i);
            i++;
            setTimeout(type, 35);
        } else {
            document.getElementById('fireworks-btn').classList.remove('hidden');
        }
    }
    type();
}

function startCelebration() {
    const card = document.getElementById('final-card');
    const title = document.getElementById('final-title');
    const body = document.getElementById('typewriter-text');
    const btn = document.getElementById('fireworks-btn');
    const footer = document.getElementById('final-footer');

    // 1. Ubah ke Mode Malam yang lebih elegan (Deep Night)
    card.style.background = "rgba(10, 5, 10, 0.95)";
    card.style.border = "1px solid rgba(255, 77, 109, 0.8)"; // Border lebih terang saat menyala
    card.style.boxShadow = "0 0 40px rgba(255, 77, 109, 0.4)";
    
    title.style.color = "#ffffff";
    body.style.color = "#f0f0f0";
    footer.classList.remove('hidden');
    footer.style.color = "#ffb3c1";
    btn.style.display = "none";

    // 2. Munculkan Foto di LUAR Card
    const gallery = document.getElementById('photo-gallery');
    gallery.innerHTML = '';
    
    // Posisi foto melayang di luar kartu (menggunakan nilai negatif agar keluar dari box)
    const positions = [
        { top: '-60px', left: '-50px', transform: 'rotate(-15deg)' },
        { top: '-60px', right: '-50px', transform: 'rotate(15deg)' },
        { bottom: '-60px', left: '-50px', transform: 'rotate(15deg)' },
        { bottom: '-60px', right: '-50px', transform: 'rotate(-15deg)' }
    ];

    myPhotos.forEach((src, idx) => {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'floating-photo';
            
            const pos = positions[idx % 4];
            if(pos.top) img.style.top = pos.top;
            if(pos.bottom) img.style.bottom = pos.bottom;
            if(pos.left) img.style.left = pos.left;
            if(pos.right) img.style.right = pos.right;
            img.style.transform = pos.transform;

            gallery.appendChild(img);
        }, idx * 500);
    });
    
    initFireworks();
}

// Fungsi initFireworks tetap sama seperti sebelumnya karena sudah benar

function initFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    // Sesuaikan ukuran dengan parent card
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    let particles = [];
    
    function loop() {
        requestAnimationFrame(loop);
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.08) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height / 2);
            const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            
            for (let i = 0; i < 30; i++) {
                particles.push({
                    x, y, color,
                    dx: (Math.random() - 0.5) * 5,
                    dy: (Math.random() - 0.5) * 5,
                    life: 1
                });
            }
        }
        
        particles.forEach((p, i) => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.02;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            if (p.life <= 0) particles.splice(i, 1);
        });
    }
    loop();
}

document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) { // Munculkan hati secara acak agar tidak terlalu ramai
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'cursor-heart';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
});