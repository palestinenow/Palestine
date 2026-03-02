// script.js

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        particleCount: 1000,
        noiseScale: 0.005,
        mouseRadius: 150,
        fadeSpeed: 0.05,
        loadingDuration: 3000, // 3 Seconds transition
        palette: [
            { r: 0, g: 122, b: 61 },    // Green
            { r: 255, g: 255, b: 255 }, // White
            { r: 30, g: 30, b: 35 },    // Near-black
            { r: 206, g: 17, b: 38 }    // Red
        ]
    };

    // ==================== DOM ELEMENTS ====================
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainApp = document.getElementById('main-app');

    let width, height, particles = [], time = 0;
    const mouse = { x: null, y: null, radius: CONFIG.mouseRadius };

    // ==================== SIMPLEX NOISE (from Design) ====================
    class SimplifiedNoise {
        constructor() {
            this.p = new Array(512);
            const perm = new Array(256);
            for (let i = 0; i < 256; i++) perm[i] = Math.floor(Math.random() * 256);
            for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
        }
        fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
        lerp(t, a, b) { return a + t * (b - a); }
        grad(hash, x, y, z) {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }
        noise(x, y, z) {
            const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
            x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
            const u = this.fade(x), v = this.fade(y), w = this.fade(z);
            const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z;
            const B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
            return this.lerp(w,
                this.lerp(v,
                    this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
                    this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))),
                this.lerp(v,
                    this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                    this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
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
        // Check Data
        if (typeof levels === 'undefined' || typeof countriesData === 'undefined') {
            console.error("Data not loaded");
            return;
        }

        // Navigation
        window.navigateTo = function(pageId) {
            document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            const target = document.getElementById(`page-${pageId}`);
            if (target) {
                target.classList.add('active');
                // Scroll to top or keep scroll? Let's reset scroll for pages
                window.scrollTo(0, 0); 
            }
            const btn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
            if (btn) btn.classList.add('active');
        };

        // Render
        renderApp();
    }

    function renderApp() {
        const container = document.getElementById('countries-container');
        if(!container) return;
        
        container.innerHTML = ''; // Clear loading
        
        for (let i = 1; i <= 5; i++) {
            const levelInfo = levels[i];
            const countries = countriesData.filter(c => c.level === i);
            if (countries.length === 0) continue;

            const section = document.createElement('section');
            section.className = 'level-section fade-in';
            section.innerHTML = `
                <div class="level-header">
                    <h3 class="level-title">${levelInfo.title.split(':')[1] || levelInfo.title}</h3>
                    <span class="level-count">${countries.length} States</span>
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

        // Special Sections
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

    window.openModal = function(id) {
        const item = countriesData.find(c => c.id === id);
        if (!item) return;

        const modal = document.getElementById('detail-modal');
        const body = document.getElementById('modal-body');
        
        // Format Content
        let content = item.events ? item.events.replace(/\n/g, '<br>') : '';
        content = content.replace(/الحدث:/g, '<span class="label-event">Event:</span>');
        content = content.replace(/الأثر:/g, '<span class="label-impact">Impact:</span>');

        let links = '';
        if(item.links && item.links.length > 0) {
            links = `<div class="links-list">
                <strong>Sources:</strong><br>
                ${item.links.map(l => `<a href="${l.url}" target="_blank">${l.name}</a>`).join(' • ')}
            </div>`;
        }

        body.innerHTML = `
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-header">
                <div class="modal-title">${item.name}</div>
                ${item.subtitle ? `<div class="modal-subtitle">${item.subtitle}</div>` : ''}
            </div>
            <div class="data-body-text">${content}</div>
            ${links}
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        document.getElementById('detail-modal').classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Close on backdrop click
    document.getElementById('detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'detail-modal') closeModal();
    });


    // ==================== INITIALIZATION ====================
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.fillStyle = `rgba(5,5,5,${CONFIG.fadeSpeed})`;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        ctx.globalCompositeOperation = 'source-over';
        time++;
        requestAnimationFrame(animate);
    }

    function startSequence() {
        // 1. Start Animation immediately
        animate();

        // 2. Hide Loading after 3s
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            
            // 3. Show App
            setTimeout(() => {
                mainApp.classList.add('visible');
                initAppLogic(); // Initialize logic when app is visible
            }, 300);

        }, CONFIG.loadingDuration);
    }

    // Event Listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    
    // Start
    resize();
    startSequence();

})();
