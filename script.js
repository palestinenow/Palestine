// script.js

(function() {
    'use strict';

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainApp = document.getElementById('main-app');

    let width, height;
    let particles = [];
    let dragonPassed = false; // Flag to check if dragon event happened

    const mouse = { x: width/2, y: height/2 };

    // Chinese Characters for Background
    const chineseLetters = "道法自然天地人神鬼力量生老病死苦成败利钝兴衰存亡".split("");

    // ==================== PARTICLE CLASS (Chinese Letters) ====================
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.char = chineseLetters[Math.floor(Math.random() * chineseLetters.length)];
            this.size = Math.random() * 10 + 8;
            this.speedY = -Math.random() * 0.5 - 0.1;
            this.opacity = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.y += this.speedY;
            
            // Mouse interaction (move away slightly)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 100) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }

            if (this.y < -20) this.reset();
            if (this.y > height + 20) this.reset();
        }

        draw() {
            ctx.font = `${this.size}px 'Noto Sans SC', sans-serif`;
            ctx.fillStyle = `rgba(185, 28, 28, ${this.opacity})`; // Red semi-transparent
            ctx.fillText(this.char, this.x, this.y);
        }
    }

    // ==================== DRAGON WIPE ANIMATION ====================
    class BlackDragon {
        constructor() {
            this.x = width + 100;
            this.speed = 50; // Very fast
            this.width = 300; // Thickness of the dragon/body
            this.active = true;
        }

        update() {
            if (!this.active) return;
            
            this.x -= this.speed;

            // When dragon passes center, trigger blackout
            if (this.x < width / 2 && !dragonPassed) {
                dragonPassed = true;
                // Trigger recovery flash
                setTimeout(() => {
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fillRect(0,0,width,height);
                }, 0);
            }

            // When dragon leaves screen
            if (this.x < -500) {
                this.active = false;
            }
        }

        draw() {
            if (!this.active) return;

            ctx.fillStyle = '#000000';
            // Draw dragon body (simplified black wave/shape)
            ctx.beginPath();
            ctx.moveTo(this.x + this.width, 0);
            
            // Sine wave shape
            for (let y = 0; y <= height; y += 20) {
                const xOff = Math.sin(y * 0.02) * 50;
                ctx.lineTo(this.x + xOff, y);
            }
            
            ctx.lineTo(this.x + this.width, height);
            ctx.closePath();
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
                <div class="level-title">${levelInfo.title}</div>
                <div class="grid-container">
                    ${countries.map(c => `
                        <div class="country-card" onclick="openModal(${c.id})">
                            <div class="card-name">${c.name}</div>
                            <div class="card-sub">${c.subtitle || ''}</div>
                            <div class="card-action">Access</div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        }

        // Render Special Sections
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
                <div class="card-action">View File</div>
            </div>
        `).join('');
    }

    window.openModal = function(id) {
        const item = countriesData.find(c => c.id === id);
        if (!item) return;

        const modal = document.getElementById('detail-modal');
        const body = document.getElementById('modal-body');
        
        let content = item.events ? item.events.replace(/\n/g, '<br>') : '';
        let links = item.links && item.links.length > 0 
            ? `<div class="links-list">${item.links.map(l => `<a href="${l.url}" target="_blank">${l.name}</a>`).join(' • ')}</div>` 
            : '';

        body.innerHTML = `
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-header">
                <div class="modal-title">${item.name}</div>
                <div class="modal-subtitle">${item.subtitle || ''}</div>
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
    
    document.getElementById('detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'detail-modal') closeModal();
    });


    // ==================== ANIMATION LOOP ====================
    let dragon;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Init Particles
        particles = [];
        for(let i=0; i<50; i++) particles.push(new Particle());
        
        // Init Dragon
        dragon = new BlackDragon();
    }

    function animate() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        // Draw Particles (Chinese Letters)
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw Dragon
        if (dragon && dragon.active) {
            dragon.update();
            dragon.draw();
        }

        requestAnimationFrame(animate);
    }

    function startSequence() {
        resize();
        animate();

        // 1. Wait 3 seconds on loading
        setTimeout(() => {
            // 2. Hide Loading
            loadingOverlay.classList.add('hidden');
            
            // 3. Trigger Dragon Animation immediately after load
            // Dragon is automatically triggered in the loop now.
            
            // 4. Show Main App
            setTimeout(() => {
                mainApp.classList.add('visible');
                initAppLogic();
            }, 500);

        }, 3000);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    
    startSequence();

})();
