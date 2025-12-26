// CONFIG
const myPhotos = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg']; 
const letterText = "Hai sayangku Rea... Gak kerasa ya 2025 udah mau abis. Makasih ya udah nemenin aku melewati tahun ini dengan penuh warna. Kamu adalah kado terbaikku setiap hari. Di 2026 nanti, aku berharap kita masih tetap sama-sama, makin kompak, dan makin sayang. Happy New Year, cantik! I love you! ❤️";

// GEMINI API CONFIG
const apiKey = "AIzaSyBAo9C8jlF0gpQ5E9DMrgL6H8lpxNkOIfc";
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
const secretMessages = {
    game1: "Tetap semangat ya Sayangkuu, apapun yang terjadi teruslah melangkah. ❤️",
    game2: "Rea sehat-sehat selalu ya, drex ke pingin liat rea bahagiaa. ✨",
    game3: "Lagu ini indah, tapi suaramu jauh lebih indah di telingaku. 🎵",
    dateGame: "Hari itu adalah awal dari segalanya yang indah bersamamu. 🌹"
};

let currentNextScreen = 1;
let noClickCount = 0;
const noMessages = ["Oh Gitu Km Ya", "Oke bby Fine", "Bodo Amat", "Aku Betmut", "pikir aja sendiri", "Say YES dong! ❤️"];

// --- FITUR GEMINI AI ---
async function generateAIMessage() {
    const btn = document.getElementById('btn-ai-generate');
    const loading = document.getElementById('ai-loading');
    const resultDiv = document.getElementById('ai-result');

    btn.disabled = true;
    btn.style.opacity = "0.5";
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = ""; // Perbaikan: innerHTML

    const prompts = [
        "Berikan pesan penyemangat singkat yang sangat romantis untuk pacar saya Rea, tambahkan emoji lucu.",
        "Buatkan satu baris kata cinta manis untuk Rea.",
        "Bilang ke Rea kalau dia adalah kado terindah tahun ini dengan gaya bahasa santai."
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    try {
        const response = await fetch(geminiApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: randomPrompt }] }]
            })
        });

        const data = await response.json();
        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kamu cantik banget hari ini! ❤️";
        
        // Bersihkan tanda bintang (bold) dari AI agar tidak kotor
        aiText = aiText.replace(/\*\*/g, "");

        loading.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        
        // Efek Mengetik
        let i = 0;
        function typeWriter() {
            if (i < aiText.length) {
                resultDiv.innerHTML += aiText.charAt(i);
                i++;
                setTimeout(typeWriter, 40);
            }
        }
        typeWriter();

    } catch (error) {
        console.error("Error:", error);
        loading.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        resultDiv.innerText = "Maaf sayang, AI-nya lagi pusing mikirin cantiknya kamu. Coba lagi ya! ❤️";
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

// Helper untuk Retry API (Exponential Backoff)
async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(r => setTimeout(r, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}

// --- LOGIKA UTAMA ---

function handleNoClick() {
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const msgElement = document.getElementById('no-message');
    
    noClickCount++;
    const messageIndex = Math.min(noClickCount - 1, noMessages.length - 1);
    msgElement.innerText = noMessages[messageIndex];

    const noScale = Math.max(1 - (noClickCount * 0.1), 0.3);
    btnNo.style.transform = `scale(${noScale})`;

    const yesScale = 1 + (noClickCount * 0.4); 
    btnYes.style.transform = `scale(${yesScale})`;
    btnYes.style.zIndex = "100";
}

function goToWelcome() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-1').classList.add('active');
    
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
    });
}

function showScreen(num) {
    if (num === 2) {
        document.getElementById('myAudio').play().catch(() => console.log("Audio blocked"));
    }
    
    let screenId;
    if (num === 'valentine') screenId = 'screen-valentine';
    else if (num === 'date') screenId = 'screen-date';
    else if (num === 'secret') screenId = 'screen-secret';
    else screenId = `screen-${num}`;
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if(target) target.classList.add('active');
    
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

    card.style.background = "rgba(10, 5, 10, 0.95)";
    card.style.border = "1px solid rgba(255, 77, 109, 0.8)"; 
    card.style.boxShadow = "0 0 40px rgba(255, 77, 109, 0.4)";
    
    title.style.color = "#ffffff";
    body.style.color = "#f0f0f0";
    footer.classList.remove('hidden');
    footer.style.color = "#ffb3c1";
    btn.style.display = "none";

    const gallery = document.getElementById('photo-gallery');
    gallery.innerHTML = '';
    
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

    startCountdown();
    initFireworks();

        // 2. Tampilkan tombol Magic Particle
        const magicBtn = document.getElementById('btn-magic-particle');
        if (magicBtn) {
            magicBtn.classList.remove('hidden'); // Menghapus class hidden agar muncul
            magicBtn.style.display = "block";    // Memastikan display-nya muncul
        }
        
        // 3. Sembunyikan tombol kembang api agar tidak tumpang tindih
        document.getElementById('fireworks-btn').classList.add('hidden');
}

function startCountdown() {
    const targetDate = new Date("Jan 1, 2026 00:00:00").getTime();
    const timerElement = document.getElementById('timer');
    const container = document.getElementById('countdown-container');

    container.classList.remove('hidden');

    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(countdownInterval);
            timerElement.innerHTML = "HAPPY NEW YEAR REA! ❤️";
        }
    }, 1000);
}

function initFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
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
    if (Math.random() < 0.1) { 
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'cursor-heart';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
});

// Loader Control
window.addEventListener('load', () => {
    const loader = document.getElementById('screen-0');
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 4000); 
});

function startMagic() {
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffd700', '#ffffff']
    });
}