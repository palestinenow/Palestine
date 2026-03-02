// script.js

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        loadingDuration: 3000, // 3 Seconds
        dragonSegments: 80,
        numbersCount: 30
    };

    // ==================== DOM ELEMENTS ====================
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainApp = document.getElementById('main-app');

    let width, height;
    let animationId;
    const mouse = { x: width/2, y: height/2 };

    // ==================== SHADOW DRAGON CLASS ====================
    class ShadowDragon {
        constructor() {
            this.segments = [];
            this.numbers = [];
            
            // Init Segments
            for(let i=0; i<CONFIG.dragonSegments; i++) {
                this.segments.push({
                    x: width/2, 
                    y: height/2,
                    size: Math.max(1, 20 - i * 0.2) // Head is largest
                });
            }

            // Init Floating Numbers
            for(let i=0; i<CONFIG.numbersCount; i++) {
                this.numbers.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    val: Math.floor(Math.random() * 80) + 20, // 20-100
                    speed: Math.random() * 0.5 + 0.1,
                    opacity: Math.random()
                });
            }
        }

        update() {
            // Move Head towards mouse
            const head = this.segments[0];
            const dx = mouse.x - head.x;
            const dy = mouse.y - head.y;
            
            // Easing
            head.x += dx * 0.05;
            head.y += dy * 0.05;

            // Move Body (Follow the leader)
            for (let i = 1; i < this.segments.length; i++) {
                const prev = this.segments[i-1];
                const curr = this.segments[i];
                
                const angle = Math.atan2(prev.y - curr.y, prev.x - curr.x);
                const dist = 5; // Tightness of the dragon
                
                curr.x = prev.x - Math.cos(angle) * dist;
                curr.y = prev.y - Math.sin(angle) * dist;
            }

            // Update Floating Numbers
            this.numbers.forEach(n => {
                n.y -= n.speed;
                n.opacity -= 0.002;
                
                // Reset if faded or off screen
                if (n.opacity <= 0 || n.y < 0) {
                    n.y = height + 20;
                    n.x = Math.random() * width;
                    n.opacity = 0.5 + Math.random() * 0.5;
                    n.val = Math.floor(Math.random() * 80) + 20;
                }
            });
        }

        draw() {
            // Draw Dragon Body
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; // Solid black shadow
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Start path
            if (this.segments.length > 0) {
                ctx.moveTo(this.segments[0].x, this.segments[0].y);
                
                // Draw smooth curve through points
                for (let i = 1; i < this.segments.length - 2; i++) {
                    const xc = (this.segments[i].x + this.segments[i + 1].x) / 2;
                    const yc = (this.segments[i].y + this.segments[i + 1].y) / 2;
                    ctx.quadraticCurveTo(this.segments[i].x, this.segments[i].y, xc, yc);
                }
                
                ctx.stroke();
            }

            // Draw Head Glow (Scary Eye effect)
            const head = this.segments[0];
            ctx.beginPath();
            ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#b91c1c'; // Red Eye
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#b91c1c";
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Floating Numbers
            ctx.font = "12px 'Roboto Mono'";
            this.numbers.forEach(n => {
                ctx.fillStyle = `rgba(185, 28, 28, ${n.opacity})`; // Red numbers
                ctx.fillText(n.val, n.x, n.y);
            });
        }
    }

    // ==================== APP LOGIC ====================
    function initAppLogic() {
        if (typeof levels === 'undefined') return;

        // Navigation Fix
        window.navigateTo = function(pageId) {
            // 1. Hide all views
            document.querySelectorAll('.page-view').forEach(el => {
                el.classList.remove('active');
                // Critical: Force display none to prevent layout thrashing
                el.style.display = 'none'; 
            });

            // 2. Deactivate buttons
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

            // 3. Show target view
            const target = document.getElementById(`page-${pageId}`);
            if (target) {
                target.style.display = 'block'; // Force display block first
                // Small delay to trigger transition
                setTimeout(() => target.classList.add('active'), 10);
                
                // Scroll to top instantly
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

        // Render Levels
        for (let i = 1; i <= 5; i++) {
            const levelInfo = levels[i];
            const countries = countriesData.filter(c => c.level === i);
            if (countries.length === 0) continue;

            const section = document.createElement('section');
            section.className = 'level-section fade-in';
            section.innerHTML = `
                <div class="level-title">${levelInfo.title}</div>
                <p style="font-family:'Roboto Mono'; font-size:0.8rem; color:var(--muted); margin-bottom:1rem;">${levelInfo.desc}</p>
                <div class="grid-container">
                    ${countries.map(c => `
                        <div class="country-card" onclick="openModal(${c.id})">
                            <div class="card-name">${c.name}</div>
                            <div class="card-sub">${c.subtitle || 'Classified'}</div>
                            <div class="card-action">Access File</div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        }

        // Special Grids
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
                <div class="card-action">Read More</div>
            </div>
        `).join('');
    }

    window.openModal = function(id) {
        const item = countriesData.find(c => c.id === id);
        if (!item) return;

        const modal = document.getElementById('detail-modal');
        const body = document.getElementById('modal-body');
        
        let content = item.events ? item.events.replace(/\n/g, '<br>') : 'No data available.';
        content = content.replace(/الحدث:/g, '<span class="label-event">EVENT:</span>');

        let links = '';
        if(item.links && item.links.length > 0) {
            links = `<div class="links-list">
                <strong>Sources:</strong> 
                ${item.links.map(l => `<a href="${l.url}" target="_blank">${l.name}</a>`).join(' • ')}
            </div>`;
        }

        body.innerHTML = `
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-header">
                <div class="modal-title">${item.name}</div>
                <div class="modal-subtitle">${item.subtitle || 'Classified File'}</div>
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
        dragon = new ShadowDragon();
    }

    function animate() {
        // Clear with trail effect
        ctx.fillStyle = 'rgba(8, 8, 8, 0.2)'; // Matches --bg with fade
        ctx.fillRect(0, 0, width, height);

        dragon.update();
        dragon.draw();

        animationId = requestAnimationFrame(animate);
    }

    // ==================== STARTUP ====================
    function startSequence() {
        resize();
        animate();

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            
            setTimeout(() => {
                mainApp.classList.add('visible');
                initAppLogic();
            }, 300);

        }, CONFIG.loadingDuration);
    }

    // Events
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    
    // Start
    startSequence();

})();
