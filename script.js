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
        particleCount: 800, // Optimized count
        noiseScale: 0.005,
        mouseRadius: 150,
        fadeSpeed: 0.05,
        cleanupTime: 4000, // 4 seconds
        loadingDuration: 2000, 
        palette: [
            { r: 0, g: 122, b: 61 },    // Green
            { r: 255, g: 255, b: 255 }, // White
            { r: 30, g: 30, b: 35 },    // Near-black
            { r: 206, g: 17, b: 38 }    // Red
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
            const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z, B = this.p[X + 1] +
