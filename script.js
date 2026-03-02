// script.js

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainApp = document.getElementById('main-app');
    const dragonWipe = document.getElementById('dragon-wipe');
    const brainContainer = document.getElementById('brain-container');

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        particleCount: 800,
        noiseScale: 0.005,
        mouseRadius: 150,
        fadeSpeed: 0.05,
        cleanupTime: 4000,
        loadingDuration: 2000, 
        palette: [
            { r: 0, g: 122, b: 61 },
            { r: 255, g: 255, b: 255 },
            { r: 30, g: 30, b: 35 },
            { r: 206, g: 17, b: 38 }
        ]
    };

    // ==================== STATE ====================
    let width = 0, height = 0;
    let particles = [];
    let time = 0;
    let animationActive = true;
    const mouse = { x: null, y: null, radius: CONFIG.mouseRadius };

    // ==================== SIMPLEX NOISE ====================
    class SimplifiedNoise {
        constructor() { this.p = new Array(512); const perm = new Array(256); for (let i = 0; i < 256; i++) perm[i] = Math.floor(Math.random() * 256); for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255]; }
        fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
        lerp(t, a, b) { return a + t * (b - a); }
        grad(hash, x, y, z) { const h = hash & 15; const u = h < 8 ? x : y; const v = h < 4 ? y : h === 12 || h === 14 ? x : z; return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v); }
        noise(x, y, z) {
            const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
            x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
            const u = this.fade(x), v = this.fade(y), w = this.fade(z);
            const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z, B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
            return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)), this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))), this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)), this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
        }
    }
    const noise = new SimplifiedNoise();

    // ==================== PARTICLE CLASS ====================
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = 0; this.vy = 0;
            this.speed = Math.random() * 1.5 + 0.5;
            this.size = Math.max(0.5, Math.random() * 1.5 + 0.5);
            this.color = CONFIG.palette[Math.floor(Math.random() * CONFIG.palette.length)];
        }
        update() {
            if (!animationActive) return;
            const angle = noise.noise(this.x * CONFIG.noiseScale, this.y * CONFIG.noiseScale, time * 0.0003) * Math.PI * 4;
            let fx = Math.cos(angle) * this.speed;
            let fy = Math.sin(angle) * this.speed;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const pushAngle = Math.atan2(dy, dx) + Math.PI / 2;
                    fx += Math.cos(pushAngle) * force * 3;
                    fy += Math.sin(pushAngle) * force * 3;
                }
            }
            this.vx += (fx - this.vx) * 0.1;
            this.vy += (fy - this.vy) * 0.1;
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
        }
        draw() {
            const { r, g, b } = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
            ctx.fill();
        }
    }

    // ==================== APP LOGIC ====================
    function initAppLogic() {
        if (typeof levels === 'undefined') return;

        window.navigateTo = function(pageId) {
            document.querySelectorAll('.page-view').forEach(el => {
                el.classList.remove('active');
                el.style.display = 'none';
            });
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

            const target = document.getElementById(`page-${pageId}`);
            if (target) {
                target.style.display = 'block';
                setTimeout(() => target.classList.add('active'), 10);
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
            const btn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
            if (btn) btn.classList.add('active');
        };

        renderApp();
    }

    function renderApp() {
        const container = document.getElementById('countries-container');
        if(!container) return;
        container.innerHTML = '';

        for (let i = 1; i <= 5; i++) {
            const levelInfo = levels[i];
            const countries = countriesData.filter(c => c.level === i);
            if (countries.length === 0) continue;

            const section = document.createElement('section');
            section.className = 'level-section';
            section.innerHTML = `
                <div style="margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                    <h3 style="font-size: 1.2rem; letter-spacing: 0.1em; text-transform: uppercase;">${levelInfo.title}</h3>
                </div>
                <div class="grid-container">
                    ${countries.map(c => `
                        <div class="country-card" onclick="openModal(${c.id})">
                            <div class="card-name">${c.name}</div>
                            <div class="card-sub">${c.subtitle || ''}</div>
                            <div class="card-action">View File</div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        }

        renderSpecial('palestine', 'palestine-grid', countriesData.filter(c => c.id === 100));
        renderSpecial('sovereignty', 'sovereignty-grid', countriesData.filter(c => c.id >= 101 && c.id < 200));
        renderSpecial('external', 'external-grid', countriesData.filter(c => c.id >= 200));
    }

    function renderSpecial(type, gridId, items) {
        const grid = document.getElementById(gridId);
        if (!grid || items.length === 0) return;
        
        grid.innerHTML = items.map(item => `
            <div class="country-card" onclick="openModal(${item.id})">
                <div class="card-name">${item.name}</div>
                <div class="card-sub">${item.subtitle || ''}</div>
                <div class="card-action">Explore</div>
            </div>
        `).join('');
    }

    // ==================== TABLE PARSER ====================
    function parseTextToHTML(text) {
        const lines = text.split('\n');
        let isTable = false;
        if (lines.length > 2 && lines.filter(l => l.includes('\t')).length > 2) {
            isTable = true;
        }

        if (isTable) {
            const rows = lines.filter(l => l.trim() !== '');
            let html = '<table class="data-table">';
            rows.forEach((row, index) => {
                const cells = row.split('\t');
                const tag = index === 0 ? 'th' : 'td';
                const rowTag = index === 0 ? 'thead' : (index === 1 ? 'tbody' : '');
                const rowClose = index === 0 ? '</thead>' : (index === rows.length - 1 ? '</tbody>' : '');
                const rowOpen = index === 0 ? '<thead>' : (index === 1 ? '<tbody>' : '');

                if (rowOpen) html += rowOpen;
                html += '<tr>';
                cells.forEach(cell => { html += `<${tag}>${cell.trim()}</${tag}>`; });
                html += '</tr>';
                if (rowClose) html += rowClose;
            });
            html += '</table>';
            return html;
        } else {
            return text.replace(/\n/g, '<br>');
        }
    }

    window.openModal = function(id) {
        const item = countriesData.find(c => c.id === id);
        if (!item) return;

        const modal = document.getElementById('detail-modal');
        const body = document.getElementById('modal-body');
        let content = parseTextToHTML(item.events || '');
        
        body.innerHTML = `
            <button class="modal-close" onclick="closeModal()">×</button>
            <div style="margin-bottom: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${item.name}</div>
                <div style="font-size: 0.9rem; color: var(--muted);">${item.subtitle || ''}</div>
            </div>
            <div class="data-body-text">${content}</div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        document.getElementById('detail-modal').classList.remove('active');
        document.body.style.overflow = '';
    };
    
    document.getElementById('detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'detail-modal') closeModal();
    });

    window.donateAlert = function() {
        const address = "bc1qs642vuwxtwn5z926uuhnc6t33u42csdhes09c4";
        navigator.clipboard.writeText(address).then(() => alert("BTC Address copied!"), () => alert("BTC: " + address));
    };

    // ==================== LIGHT PAGE & BRAIN LOGIC ====================
    window.openBrain = function() {
        brainContainer.classList.add('visible');
        // Directly show dashboard, skipping login
        document.getElementById('brain-login').style.display = 'none';
        document.getElementById('brain-closed').style.display = 'none';
        document.getElementById('brain-dashboard').style.display = 'flex';
        showAllBrainQuestions();
        updateBrainStats();
    };

    window.closeBrain = function() {
        brainContainer.classList.remove('visible');
    };

    // Brain App Data
    const quranData = [
        { id: 1, question: "ما معنى الصبر في القرآن؟", answer: "الصبر هو حبس النفس عن الجزع والتسخط...", reference: "سورة البقرة ٢:١٥٣", keywords: ["صبر"] },
        { id: 2, question: "ما هي آية الكرسي؟", answer: "﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ...﴾", reference: "سورة البقرة ٢:٢٥٥", keywords: ["آية الكرسي"] }
    ];

    function showAllBrainQuestions() {
        displayBrainResults(quranData);
    }

    window.handleBrainSearch = function() {
        const q = document.getElementById('brain-search').value.trim();
        if (q.length > 0) {
            const r = quranData.filter(i => i.question.includes(q) || i.answer.includes(q) || i.keywords.some(k => k.includes(q)));
            displayBrainResults(r);
        } else showAllBrainQuestions();
    }

    function displayBrainResults(res) {
        const c = document.getElementById('brain-results');
        c.innerHTML = res.length === 0 ? '<div class="brain-result-card"><p>لا توجد نتائج</p></div>' : 
        res.map(i => `
            <div class="brain-result-card">
                <div class="brain-result-question">${i.question}</div>
                <div class="brain-result-answer">${i.answer}</div>
                <div class="brain-result-reference">📖 ${i.reference}</div>
            </div>
        `).join('');
    }

    function updateBrainStats() {
        document.getElementById('brain-total').textContent = quranData.length;
    }

    window.toggleBrainModal = function(show) {
        const m = document.getElementById('brain-modal');
        if(show) m.classList.add('show'); else m.classList.remove('show');
    }

    window.addBrainQuestion = function(e) {
        e.preventDefault();
        const nQ = {
            id: quranData.length + 1,
            question: document.getElementById('b-q').value,
            answer: document.getElementById('b-a').value,
            reference: document.getElementById('b-r').value || "غير محدد",
            keywords: document.getElementById('b-k').value.split(',')
        };
        quranData.push(nQ);
        showAllBrainQuestions();
        updateBrainStats();
        toggleBrainModal(false);
        const t = document.getElementById('brain-toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    };

    // ==================== ANIMATION LOOP ====================
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle());
    }

    function animate() {
        if (time > CONFIG.cleanupTime) ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; 
        else ctx.fillStyle = `rgba(5,5,5,${CONFIG.fadeSpeed})`;

        ctx.fillRect(0, 0, width, height);
        
        if (time < CONFIG.cleanupTime + 200) {
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); }
            ctx.globalCompositeOperation = 'source-over';
        }
        
        time++;
        requestAnimationFrame(animate);
    }

    // ==================== LOADING SEQUENCE ====================
    function startSequence() {
        resize();
        animate();
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                dragonWipe.classList.add('active');
                setTimeout(() => { mainApp.classList.add('visible'); initAppLogic(); }, 500);
                setTimeout(() => { dragonWipe.style.transition = "opacity 2.5s ease-out"; dragonWipe.classList.remove('active'); }, 1000);
            }, 500);
        }, CONFIG.loadingDuration);
    }

    // Events
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    
    startSequence();

});
