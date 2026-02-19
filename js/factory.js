// Factory Animation Module
// Handles the creation and animation of the "Ganesh's Blissful Ice Cream Factory"
// Premium Version with Mandalas and Gradients

class IceCreamFactory {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found.`);
            return;
        }
        this.width = 800;
        this.height = 600;
        this.ns = "http://www.w3.org/2000/svg";
        this.init();
    }

    init() {
        this.svg = document.createElementNS(this.ns, "svg");
        this.svg.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        this.svg.style.width = "100%";
        this.svg.style.height = "100%";
        this.svg.style.overflow = "visible";
        
        this.createDefs();
        
        // Groups for layering
        this.backgroundGroup = document.createElementNS(this.ns, "g");
        this.machineGroup = document.createElementNS(this.ns, "g");
        this.conveyorGroup = document.createElementNS(this.ns, "g"); 
        this.ganeshaGroup = document.createElementNS(this.ns, "g");
        this.foregroundGroup = document.createElementNS(this.ns, "g"); 

        this.svg.appendChild(this.backgroundGroup);
        this.svg.appendChild(this.machineGroup);
        this.svg.appendChild(this.conveyorGroup);
        this.svg.appendChild(this.ganeshaGroup);
        this.svg.appendChild(this.foregroundGroup);

        this.container.appendChild(this.svg);

        this.createBackgroundAtmosphere();
        this.createMandalaGears();
        this.createConveyors();
        this.createGanesha();
        this.createIceCreamParticles();
    }

    createDefs() {
        const defs = document.createElementNS(this.ns, "defs");
        
        // Gradients
        const gradGold = document.createElementNS(this.ns, "linearGradient");
        gradGold.id = "gradGold";
        gradGold.innerHTML = `<stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#FFAA00"/>`;
        defs.appendChild(gradGold);
        
        const gradPink = document.createElementNS(this.ns, "radialGradient");
        gradPink.id = "gradPink";
        gradPink.innerHTML = `<stop offset="0%" stop-color="#FFB7B2"/><stop offset="100%" stop-color="#FF69B4"/>`;
        defs.appendChild(gradPink);

        const gradBlue = document.createElementNS(this.ns, "linearGradient");
        gradBlue.id = "gradBlue";
        gradBlue.innerHTML = `<stop offset="0%" stop-color="#E0FFFF"/><stop offset="100%" stop-color="#A2E1DB"/>`;
        defs.appendChild(gradBlue);

        // Filters (Glow/Shadow)
        const filterGlow = document.createElementNS(this.ns, "filter");
        filterGlow.id = "glow";
        filterGlow.innerHTML = `<feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>`;
        defs.appendChild(filterGlow);
        
        const filterShadow = document.createElementNS(this.ns, "filter");
        filterShadow.id = "dropShadow";
        filterShadow.innerHTML = `<feDropShadow dx="2" dy="4" stdDeviation="2" flood-opacity="0.3"/>`;
        defs.appendChild(filterShadow);

        this.svg.appendChild(defs);
    }
    
    createBackgroundAtmosphere() {
         // Rotating Mandala Background
         const mandala = document.createElementNS(this.ns, "circle");
         mandala.setAttribute("cx", this.width/2);
         mandala.setAttribute("cy", this.height/2);
         mandala.setAttribute("r", "250");
         mandala.setAttribute("fill", "none");
         mandala.setAttribute("stroke", "rgba(255, 215, 0, 0.1)");
         mandala.setAttribute("stroke-width", "2");
         mandala.setAttribute("stroke-dasharray", "10 5");
         mandala.style.animation = "spin 60s linear infinite";
         this.backgroundGroup.appendChild(mandala);
         
         // Subtle particles
         for(let i=0; i<5; i++) {
             const p = document.createElementNS(this.ns, "circle");
             p.setAttribute("r", Math.random() * 5 + 2);
             p.setAttribute("fill", "white");
             p.setAttribute("opacity", "0.5");
             p.style.animation = `float ${Math.random()*5+3}s ease-in-out infinite`;
             p.style.transformBox = "fill-box";
             p.style.transformOrigin = "center";
             
             // Random placement
             const g = document.createElementNS(this.ns, "g");
             g.setAttribute("transform", `translate(${Math.random()*this.width}, ${Math.random()*this.height})`);
             g.appendChild(p);
             this.backgroundGroup.appendChild(g);
         }
    }

    createGear(cx, cy, r, teeth, colorUrl, direction = 1, speed = 4) {
        const group = document.createElementNS(this.ns, "g");
        const gearPath = document.createElementNS(this.ns, "path");
        
        let pathData = "";
        const holeRadius = r * 0.3;
        const outerRadius = r;
        const innerRadius = r * 0.85;
        
        for (let i = 0; i < teeth; i++) {
            const angle = (Math.PI * 2 * i) / teeth;
            const nextAngle = (Math.PI * 2 * (i + 1)) / teeth;
            const toothWidth = (Math.PI * 2) / (teeth * 2.5); // Thinner teeth
            
            // Outer point
            const x1 = cx + Math.cos(angle) * outerRadius;
            const y1 = cy + Math.sin(angle) * outerRadius;
            const x2 = cx + Math.cos(angle + toothWidth) * outerRadius;
            const y2 = cy + Math.sin(angle + toothWidth) * outerRadius;
            
            // Inner base
            const x3 = cx + Math.cos(angle + toothWidth * 1.2) * innerRadius;
            const y3 = cy + Math.sin(angle + toothWidth * 1.2) * innerRadius;
            const x4 = cx + Math.cos(nextAngle) * innerRadius;
            const y4 = cy + Math.sin(nextAngle) * innerRadius;

            if (i === 0) pathData += `M ${x1} ${y1} `;
            pathData += `L ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 1 ${x4} ${y4} `;
        }
        pathData += "Z";
        
        // Complex Center pattern (Mandala-ish)
        pathData += ` M ${cx + holeRadius} ${cy} A ${holeRadius} ${holeRadius} 0 1 0 ${cx - holeRadius} ${cy} A ${holeRadius} ${holeRadius} 0 1 0 ${cx + holeRadius} ${cy} Z`;

        gearPath.setAttribute("d", pathData);
        gearPath.setAttribute("fill", colorUrl);
        gearPath.setAttribute("filter", "url(#dropShadow)");
        gearPath.style.transformOrigin = `${cx}px ${cy}px`;
        gearPath.style.animation = `spin ${speed}s linear infinite`;
        if (direction === -1) {
            gearPath.style.animationDirection = "reverse";
        }

        group.appendChild(gearPath);
        
        // Add metallic rim
        const rim = document.createElementNS(this.ns, "circle");
        rim.setAttribute("cx", cx);
        rim.setAttribute("cy", cy);
        rim.setAttribute("r", holeRadius);
        rim.setAttribute("fill", "none");
        rim.setAttribute("stroke", "white");
        rim.setAttribute("stroke-width", "2");
        rim.setAttribute("stroke-opacity", "0.5");
        group.appendChild(rim);
        
        this.machineGroup.appendChild(group);
    }

    createMandalaGears() {
        this.createGear(100, 100, 60, 12, "url(#gradGold)", 1, 15);
        this.createGear(190, 100, 40, 8, "url(#gradPink)", -1, 10);
        this.createGear(700, 500, 80, 16, "url(#gradBlue)", 1, 20);
        this.createGear(600, 550, 50, 10, "url(#gradGold)", -1, 12);
    }

    createConveyors() {
        const path = document.createElementNS(this.ns, "path");
        path.setAttribute("d", "M 0 450 L 300 450 Q 400 450 400 350 L 400 200");
        path.setAttribute("stroke", "#444");
        path.setAttribute("stroke-width", "12");
        path.setAttribute("fill", "none");
        path.setAttribute("filter", "url(#dropShadow)");
        this.conveyorGroup.appendChild(path);
        
        // Add "rollers" details
        const pathLength = path.getTotalLength();
        for(let i=0; i<pathLength; i+=30) {
            const point = path.getPointAtLength(i);
            const roller = document.createElementNS(this.ns, "circle");
            roller.setAttribute("cx", point.x);
            roller.setAttribute("cy", point.y);
            roller.setAttribute("r", "5");
            roller.setAttribute("fill", "#666");
            this.conveyorGroup.appendChild(roller);
        }
    }

    createGanesha() {
        // Wrapper for animation
        const wrapper = document.createElementNS(this.ns, "g");
        wrapper.setAttribute("transform", `translate(${this.width/2}, ${this.height/2})`);
        
        const g = document.createElementNS(this.ns, "g");

        // Halo/Chakra - More detailed
        const halo = document.createElementNS(this.ns, "g");
        const haloCircle = document.createElementNS(this.ns, "circle");
        haloCircle.setAttribute("r", "130");
        haloCircle.setAttribute("fill", "none");
        haloCircle.setAttribute("stroke", "url(#gradGold)");
        haloCircle.setAttribute("stroke-width", "2");
        haloCircle.setAttribute("stroke-dasharray", "2 8");
        halo.appendChild(haloCircle);
        
        // Rays
        for(let i=0; i<12; i++) {
            const ray = document.createElementNS(this.ns, "path");
            ray.setAttribute("d", "M 0 -130 L 0 -150");
            ray.setAttribute("stroke", "gold");
            ray.setAttribute("stroke-width", "2");
            ray.setAttribute("transform", `rotate(${i * 30})`);
            halo.appendChild(ray);
        }
        halo.style.animation = "spin 25s linear infinite";
        g.appendChild(halo);

        // Body Shape ( Simplified but smoother )
        const body = document.createElementNS(this.ns, "path");
        // Head and Ears combined
        body.setAttribute("d", `
            M -60 -40 
            Q -100 -60 -90 0 
            Q -80 60 -40 40
            Q -20 80 20 80
            Q 60 40 40 -10
            Q 100 0 90 -60
            Q 60 -40 0 -50 
            Q -30 -45 -60 -40
            Z
        `); 
        // Note: Coordinates are approximate, aiming for stylized elephant head
        // Let's use simple shapes again but refined with gradients
        
        // Ears
        const earL = document.createElementNS(this.ns, "path");
        earL.setAttribute("d", "M -40 -20 Q -100 -50 -90 20 Q -60 60 -40 40 Z");
        earL.setAttribute("fill", "url(#gradPink)");
        earL.setAttribute("filter", "url(#dropShadow)");
        g.appendChild(earL);

        const earR = document.createElementNS(this.ns, "path");
        earR.setAttribute("d", "M 40 -20 Q 100 -50 90 20 Q 60 60 40 40 Z");
        earR.setAttribute("fill", "url(#gradPink)");
        earR.setAttribute("filter", "url(#dropShadow)");
        g.appendChild(earR);
        
        // Head Base
        const head = document.createElementNS(this.ns, "circle");
        head.setAttribute("r", "50");
        head.setAttribute("cy", "0");
        head.setAttribute("fill", "url(#gradPink)");
        g.appendChild(head);

        // Trunk
        const trunk = document.createElementNS(this.ns, "path");
        trunk.setAttribute("d", "M -10 20 Q 0 80 40 60 Q 50 50 35 55"); // Curled trunk
        trunk.setAttribute("stroke", "url(#gradPink)");
        trunk.setAttribute("stroke-width", "25");
        trunk.setAttribute("stroke-linecap", "round");
        trunk.setAttribute("fill", "none");
        g.appendChild(trunk);

        // Eyes - Expressive
        const eyeL = document.createElementNS(this.ns, "ellipse");
        eyeL.setAttribute("cx", "-20");
        eyeL.setAttribute("cy", "-10");
        eyeL.setAttribute("rx", "6");
        eyeL.setAttribute("ry", "4");
        eyeL.setAttribute("fill", "#fff");
        g.appendChild(eyeL);
        const pupilL = document.createElementNS(this.ns, "circle");
        pupilL.setAttribute("cx", "-20");
        pupilL.setAttribute("cy", "-10");
        pupilL.setAttribute("r", "2");
        pupilL.setAttribute("fill", "#000");
        g.appendChild(pupilL);

        const eyeR = document.createElementNS(this.ns, "ellipse");
        eyeR.setAttribute("cx", "20");
        eyeR.setAttribute("cy", "-10");
        eyeR.setAttribute("rx", "6");
        eyeR.setAttribute("ry", "4");
        eyeR.setAttribute("fill", "#fff");
        g.appendChild(eyeR);
        const pupilR = document.createElementNS(this.ns, "circle");
        pupilR.setAttribute("cx", "20");
        pupilR.setAttribute("cy", "-10");
        pupilR.setAttribute("r", "2");
        pupilR.setAttribute("fill", "#000");
        g.appendChild(pupilR);

        // Crown/Jewelry
        const crown = document.createElementNS(this.ns, "path");
        crown.setAttribute("d", "M -20 -40 L 0 -70 L 20 -40 Z");
        crown.setAttribute("fill", "url(#gradGold)");
        crown.setAttribute("filter", "url(#glow)");
        g.appendChild(crown);

        // Tilak
        const tilak = document.createElementNS(this.ns, "path");
        tilak.setAttribute("d", "M 0 -35 L 0 -15");
        tilak.setAttribute("stroke", "#FF4500");
        tilak.setAttribute("stroke-width", "4");
        tilak.setAttribute("stroke-linecap", "round");
        g.appendChild(tilak);

        g.style.animation = "float 4s ease-in-out infinite";
        wrapper.appendChild(g);
        this.ganeshaGroup.appendChild(wrapper);
    }

    createIceCreamParticles() {
        const colors = ["#FFB7B2", "#A2E1DB", "#FFF5BA", "#E2C6FF"]; // Solid colors for contrast
        const numParticles = 12;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElementNS(this.ns, "g");
            
            // Ice cream scoop shape (circle with ruffled bottom)
            const circle = document.createElementNS(this.ns, "circle");
            circle.setAttribute("r", "12");
            circle.setAttribute("fill", colors[i % colors.length]);
            // Add shine
            const shine = document.createElementNS(this.ns, "circle");
            shine.setAttribute("r", "4");
            shine.setAttribute("cx", "-4");
            shine.setAttribute("cy", "-4");
            shine.setAttribute("fill", "rgba(255,255,255,0.6)");
            
            particle.appendChild(circle);
            particle.appendChild(shine);
            
            const animateMotion = document.createElementNS(this.ns, "animateMotion");
            animateMotion.setAttribute("dur", "5s");
            animateMotion.setAttribute("repeatCount", "indefinite");
            animateMotion.setAttribute("path", "M 0 435 L 300 435 Q 400 435 400 335 L 400 180"); 
            animateMotion.setAttribute("begin", `${i * (5/numParticles)}s`);
            
            particle.appendChild(animateMotion);
            this.foregroundGroup.appendChild(particle);
        }
    }
}

// Global styles for animations
if (!document.getElementById('factory-style')) {
    const style = document.createElement('style');
    style.id = 'factory-style';
    style.innerHTML = `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 
            0%, 100% { transform: translateY(0px); } 
            50% { transform: translateY(-15px); } 
        }
    `;
    document.head.appendChild(style);
}

window.IceCreamFactory = IceCreamFactory;
