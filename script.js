const canvas = document.getElementById("magic-canvas");
const ctx = canvas.getContext("2d");
const heroSection = document.getElementById("hero");

// Spiral Background
const spiralCanvas = document.getElementById('spiral-bg');
const spiralCtx = spiralCanvas.getContext('2d');

let width, height;
let spiralWidth, spiralHeight;
let particles = [];
let time = 0;

function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    
    spiralWidth = spiralCanvas.width = window.innerWidth;
    spiralHeight = spiralCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// --- Spiral Logic ---
class SpiralBackground {
    constructor() {
        this.angleOffset = 0;
    }

    draw() {
        spiralCtx.clearRect(0, 0, spiralWidth, spiralHeight);
        
        let centerX = spiralWidth / 2;
        // Bind center to the Hero section's center (Ganesh's location).
        // Since canvas is fixed, we adjust Y by the scroll position.
        // Hero is at the top, so its center is offsetHeight / 2.
        let centerY = (heroSection.offsetHeight / 2) - window.scrollY;
        
        // Calculate distance to the furthest corner to ensure full coverage
        const distToTopLeft = Math.hypot(centerX - 0, centerY - 0);
        const distToTopRight = Math.hypot(centerX - spiralWidth, centerY - 0);
        const distToBottomLeft = Math.hypot(centerX - 0, centerY - spiralHeight);
        const distToBottomRight = Math.hypot(centerX - spiralWidth, centerY - spiralHeight);
        
        let maxRadius = Math.max(distToTopLeft, distToTopRight, distToBottomLeft, distToBottomRight);

        // Creamy colors based on the reference image
        const colors = [
            { h: 340, s: 100, l: 88, name: 'pink' },    
            { h: 45, s: 100, l: 85, name: 'yellow' },   
            { h: 190, s: 90, l: 80, name: 'blue' },
             { h: 340, s: 100, l: 88, name: 'pink' },    
            { h: 45, s: 100, l: 85, name: 'yellow' },   
            { h: 190, s: 90, l: 80, name: 'blue' }
        ];

        let coils = 4; // Tighter coils
        let lineWidth = maxRadius / coils / 2; // Dynamic thickness
        
        // Twist factor to make it look like a swirl
        let twist = 5; 

        for (let i = 0; i < colors.length; i++) {
            let color = colors[i];
            let angleShift = (i / colors.length) * Math.PI * 2;
            
            spiralCtx.beginPath();
            // Increase step for performance on huge radii
            let step = 10;
            if (maxRadius > 2000) step = 20;

            for (let r = 0; r < maxRadius; r += step) {
                // Logarithmic-ish spiral equation
                let currentAngle = (r / 2000) * twist * Math.PI + angleShift + this.angleOffset;
                
                let x = centerX + r * Math.cos(currentAngle);
                let y = centerY + r * Math.sin(currentAngle);
                
                if (r === 0) {
                    spiralCtx.moveTo(x, y);
                } else {
                    spiralCtx.lineTo(x, y);
                }
            }
            
            spiralCtx.lineWidth = 150; // Very thick lines to blend into a surface
            if (spiralWidth < 600) spiralCtx.lineWidth = 80; // Mobile adjust

            spiralCtx.lineCap = 'round';
            spiralCtx.lineJoin = 'round';
            spiralCtx.strokeStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
            spiralCtx.stroke();
            
            // Highlight for 3D glossy effect
            spiralCtx.lineWidth = spiralCtx.lineWidth * 0.4;
            spiralCtx.strokeStyle = `hsla(${color.h}, ${color.s}%, 95%, 0.3)`;
            spiralCtx.stroke();
             
             // Shadow for depth
             spiralCtx.lineWidth = spiralCtx.lineWidth * 0.5;
             spiralCtx.strokeStyle = `hsla(${color.h}, ${color.s}%, 60%, 0.1)`;
             spiralCtx.stroke();
        }

        this.angleOffset -= 0.005; // Smooth rotation
    }
}

const spiral = new SpiralBackground();

// --- Particle Logic ---
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1 - 0.5; // Slight upward drift
        this.size = Math.random() * 3 + 1;
        this.color = this.randomColor();
        this.alpha = Math.random();
        this.fade = Math.random() * 0.01 + 0.005;
    }

    randomColor() {
        const colors = [
            '255, 105, 180', // Pink
            '0, 188, 212',   // Teal
            '255, 215, 0',   // Gold
            '255, 153, 51'   // Saffron
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fade;

        if (this.alpha <= 0) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1 - 1;
        this.alpha = 1;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles(count) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    time += 0.01;
    
    // Animate Particles
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Animate Spiral
    spiral.draw();

    requestAnimationFrame(animate);
}

initParticles(150);
animate();
