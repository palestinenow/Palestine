// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INTRO ANIMATION LOGIC ---
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');
    
    // Start transition after 2 seconds
    setTimeout(() => {
        if (splashScreen) splashScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.add('visible');
    }, 2000);


    // --- 2. MATRIX BACKGROUND LOGIC ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    const cursorEl = document.getElementById('cursor');
    let width, height;
    let particles = [];
    const particleCount = 70;
    const mouse = { x: -1000, y: -1000, radius: 150 };

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse handling
    window.addEventListener('mousemove', e => {
        mouse.x = e.x;
        mouse.y = e.y;
        // Move custom cursor
        if(cursorEl) {
            cursorEl.style.left = e.x + 'px';
            cursorEl.style.top = e.y + 'px';
            cursorEl.style.display = 'block';
        }
    });
    
    window.addEventListener('touchmove', e => {
        if(e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });
    
    window.addEventListener('touchend', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    function createParticle() {
        let homeX = Math.random() * width;
        let homeY = Math.random() * height;
        return {
            x: homeX, y: homeY,
            vx: 0, vy: 0,
            homeX: homeX, homeY: homeY,
            size: Math.random() * 2 + 1,
            color: `rgba(0, ${Math.floor(200 + Math.random()*55)}, ${Math.floor(Math.random()*50)}, 1)` 
        };
    }

    for (let i = 0; i < particleCount; i++) particles.push(createParticle());

    function animateMatrix() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Trail effect matching background
        ctx.fillRect(0, 0, width, height);

        // Connections
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            let p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p1.x - p2.x;
                let dy = p1.y - p2.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < 6000) { 
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Particles
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#00FF41";
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let homeDx = p.homeX - p.x;
            let homeDy = p.homeY - p.y;
            
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                let targetVX = Math.cos(angle + Math.PI/2) * 2 + dx * 0.03;
                let targetVY = Math.sin(angle + Math.PI/2) * 2 + dy * 0.03;
                p.vx += (targetVX - p.vx) * 0.1;
                p.vy += (targetVY - p.vy) * 0.1;
            } else {
                p.vx += homeDx * 0.05; 
                p.vy += homeDy * 0.05;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.90;
            p.vy *= 0.90;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(animateMatrix);
    }
    animateMatrix();
    // --- END MATRIX LOGIC ---


    // --- 3. APP LOGIC ---
    
    // Navigation
    window.navigateTo = function(pageId) {
        document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);
        }
        const activeBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // Data Check
    if (typeof levels === 'undefined' || typeof countriesData === 'undefined') {
        document.getElementById('countries-container').innerHTML = `<div class="text-center text-red-500 p-10">Error loading data.js</div>`;
        return;
    }

    // Rendering
    function renderApp() {
        // Render Countries Page
        const countriesContainer = document.getElementById('countries-container');
        countriesContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const lInfo = levels[i];
            const lCountries = countriesData.filter(c => c.level === i);
            if (lCountries.length === 0) continue;

            const s = document.createElement('section');
            s.className = `level-section level-${i} fade-in`;
            s.innerHTML = `
            <div class="p-6 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h2 class="text-2xl font-black tracking-tight">${lInfo.title}</h2>
                <p class="text-sm text-[var(--muted)] mt-2">${lInfo.desc}</p>
                </div>
                <span class="px-4 py-1 text-xs font-bold rounded-full" style="color: ${getLevelColor(i, 'hex')}; border: 1px solid ${getLevelColor(i, 'hex')};">
                ${lCountries.length} دول
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                ${renderCards(lCountries)}
            </div>
            `;
            countriesContainer.appendChild(s);
        }

        // Render Special Sections
        renderSpecial('palestine', 'palestine-grid', 'palestine-card');
        renderSpecial('sovereignty', 'sovereignty-grid', 'sovereignty-card');
        renderSpecial('external', 'external-grid', 'external-card');
    }

    function renderCards(countries) {
        return countries.map((c, i) => `
          <div class="country-card stagger-item" onclick="openModal(${c.id})" style="animation-delay: ${i * 0.05}s">
            <h3 class="text-xl font-black mb-2">${c.name}</h3>
            ${c.subtitle ? `<p class="text-sm text-[var(--muted)] mb-4">${c.subtitle}</p>` : ''}
            <div class="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center">
               <span class="text-xs text-[var(--matrix-green)]">ملف تفاعلي</span>
               <span class="text-xs text-[var(--muted)]">اضغط للفتح</span>
            </div>
          </div>
        `).join('');
    }

    function renderSpecial(type, gridId, cardClass) {
        let items = [];
        if (type === 'palestine') items = countriesData.filter(c => c.id === 100);
        else if (type === 'sovereignty') items = countriesData.filter(c => c.id >= 101 && c.id < 200);
        else if (type === 'external') items = countriesData.filter(c => c.id >= 200);

        const grid = document.getElementById(gridId);
        if (!grid) return;

        if (items.length > 0) {
            grid.innerHTML = items.map((item, index) => {
                let style = '';
                if (type === 'palestine') style = 'color: var(--accent-gold);';
                else if (type === 'sovereignty') style = 'color: var(--accent-purple);';
                else if (type === 'external') style = 'color: #9ca3af;';

                return `
                <div class="${cardClass} stagger-item" onclick="openModal(${item.id})" style="animation-delay: ${index * 0.1}s">
                    <h3 class="text-2xl font-black mb-2" style="${style}">${item.name}</h3>
                    ${item.subtitle ? `<p class="text-sm text-gray-400">${item.subtitle}</p>` : ''}
                </div>
                `;
            }).join('');
        }
    }

    function getLevelColor(l, t) {
        const c = { 1: { hex: '#059669' }, 2: { hex: '#0891b2' }, 3: { hex: '#d97706' }, 4: { hex: '#2563eb' }, 5: { hex: '#dc2626' }, 100: { hex: '#D4AF37' }, 101: { hex: '#8A2BE2' } };
        return c[l] ? c[l][t] : '#ffffff';
    }

    window.openModal = function(id) {
        const c = countriesData.find(x => x.id === id);
        if (!c) return;
        const m = document.getElementById('detail-modal');
        const b = document.getElementById('modal-body');
        
        let col = '#00FF41';
        if (c.level) col = getLevelColor(c.level, 'hex');
        else if (c.id === 100) col = '#D4AF37';
        else if (c.id >= 101 && c.id < 200) col = '#8A2BE2';
        else if (c.id >= 200) col = '#6b7280';

        let ev = c.events ? fmt(c.events) : '<p class="text-center text-gray-500 py-10">لا توجد بيانات</p>';
        
        let linksHtml = '';
        if (c.links && c.links.length > 0) {
            linksHtml += `<div class="links-list">
                <h4>مصادر ذات صلة:</h4>
                ${c.links.map(link => `<a href="${link.url}" target="_blank">${link.name}</a>`).join('')}
            </div>`;
        }

        b.innerHTML = `
          <button onclick="closeModal()" class="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center bg-black border border-[var(--accent-red)] text-[var(--accent-red)] rounded-full text-xs">ESC</button>
          <div class="p-10">
            <div class="mb-8 border-b border-gray-800 pb-6">
              <span class="text-xs font-bold uppercase tracking-widest" style="color: ${col}">${c.level ? levels[c.level].title.split(':')[0] : 'ملف خاص'}</span>
              <h2 class="text-4xl font-black mt-2">${c.name}</h2>
              ${c.subtitle ? `<p class="text-lg mt-2" style="color: ${col}">${c.subtitle}</p>` : ''}
            </div>
            <div>${ev}</div>
            ${linksHtml}
          </div>
        `;
        m.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() { 
        document.getElementById('detail-modal').classList.remove('active'); 
        document.body.style.overflow = ''; 
    };
    
    window.closeModalOnBackdrop = function(e) { 
        if (e.target.id === 'detail-modal') closeModal(); 
    };

    function fmt(t) {
        let p = t.replace(/\n/g, '<br>');
        p = p.replace(/الحدث:/g, '<br><span class="label-event">الحدث:</span>');
        p = p.replace(/الأثر على العرب:/g, '<br><span class="label-impact">الأثر على العرب:</span>');
        p = p.replace(/الرابط:/g, '<br><span class="label-source">الرابط:</span>');
        p = p.replace(/التفاصيل:/g, '<br><span class="label-link">التفاصيل:</span>');
        return `<div class="data-body-text">${p}</div>`;
    }

    renderApp();


    // --- 4. UTILITIES (BTC Modal) ---
    window.openBTCModal = function() { document.getElementById('btcModal').classList.add('active'); };
    window.closeBTCModal = function() { document.getElementById('btcModal').classList.remove('active'); };
    window.closeBTCModalOnBackdrop = function(e) { if (e.target.id === 'btcModal') closeBTCModal(); };
    
    window.copyBTC = function() {
        navigator.clipboard.writeText("bc1qs642vuwxtwn5z926uuhnc6t33u42csdhes09c4");
        const n = document.createElement('div');
        n.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full text-sm font-bold z-[200]';
        n.innerText = 'تم النسخ!';
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 2000);
        setTimeout(() => closeBTCModal(), 500);
    };

    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { 
            closeModal(); 
            closeBTCModal(); 
        } 
    });

});
