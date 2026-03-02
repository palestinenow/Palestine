/**
 * THE "SAMUD" ENGINE
 * A tribute to resilience.
 * Features: Simplified Perlin Noise Flow Field, Additive Blending, 
 * and Mouse-Driven Gravitational Forces.
 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 1000; // Dense for high detail
const noiseScale = 0.005;   // Flow field smoothness
let time = 0;

const mouse = { x: null, y: null, radius: 150 };

// Color Palette (Flag colors in RGBA for additive blending)
const palette = [
    { r: 0, g: 122, b: 61 },   // Green
    { r: 255, g: 255, b: 255 }, // White
    { r: 0, g: 0, b: 0 },       // Black (will be rendered as dark glow)
    { r: 206, g: 17, b: 38 }    // Red
];

// --- SIMPLEX NOISE IMPLEMENTATION (Simplified) ---
class SimplifiedNoise {
    constructor() { 
        this.p = []; 
        for(let i=0; i<256; i++) this.p[i] = Math.floor(Math.random()*256); 
        for(let i=0; i<256; i++) this.p[256+i] = this.p[i]; 
    }
    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t, a, b) { return a + t * (b - a); }
    grad(hash, x, y, z) {
        let h = hash & 15; 
        let u = h < 8 ? x : y; 
        let v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }
    noise(x, y, z) {
        let X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        let u = this.fade(x), v = this.fade(y), w = this.fade(z);
        let A = this.p[X]+Y, AA = this.p[A]+Z, AB = this.p[A+1]+Z;
        let B = this.p[X+1]+Y, BA = this.p[B]+Z, BB = this.p[B+1]+Z;
        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x-1, y, z)), this.lerp(u, this.grad(this.p[AB], x, y-1, z), this.grad(this.p[BB], x-1, y-1, z))), this.lerp(v, this.lerp(u, this.grad(this.p[AA+1], x, y, z-1), this.grad(this.p[BA+1], x-1, y, z-1)), this.lerp(u, this.grad(this.p[AB+1], x, y-1, z-1), this.grad(this.p[BB+1], x-1, y-1, z-1))));
    }
}

const noise = new SimplifiedNoise();

// --- PARTICLE CLASS ---
class Particle {
    constructor() {
        this.reset();
        // Initialize with random color from palette
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0;
        this.vy = 0;
        this.speed = Math.random() * 1.5 + 0.5;
        this.size = Math.random() * 1.5 + 0.5;
    }

    update() {
        // 1. Flow Field Force (The "Wind")
        let angle = noise.noise(this.x * noiseScale, this.y * noiseScale, time * 0.0003) * Math.PI * 4;
        
        let fx = Math.cos(angle) * this.speed;
        let fy = Math.sin(angle) * this.speed;

        // 2. Mouse Interaction (Gravitational Pull)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
                // Create a vortex effect
                let force = (mouse.radius - dist) / mouse.radius;
                let pushAngle = Math.atan2(dy, dx) + Math.PI / 2; // Perpendicular
                fx += Math.cos(pushAngle) * force * 3;
                fy += Math.sin(pushAngle) * force * 3;
            }
        }

        this.vx += (fx - this.vx) * 0.1; // Damping
        this.vy += (fy - this.vy) * 0.1;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.5)`;
        ctx.fill();
    }
}

// --- SETUP ---
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

resize();

// --- ANIMATION LOOP ---
function animate() {
    // Create the "Ghosting" effect
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; // Very slow fade
    ctx.fillRect(0, 0, width, height);

    // Set blending mode for "Light" effect
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    ctx.globalCompositeOperation = 'source-over'; // Reset

    time++;
    requestAnimationFrame(animate);
}

animate();
