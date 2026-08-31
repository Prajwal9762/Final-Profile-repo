# Ultra-Animated Premium Developer Portfolio | Prajwal Pokharel

Website: [https://prajwal-pokharel.com.np](https://prajwal-pokharel.com.np)  
GitHub: [@prajwal9762](https://github.com/prajwal9762)

An interactive, cinematic, performance-optimized developer portfolio engineered for **Prajwal Pokharel**.

---

## 🌟 Key Features & Animations

1. **Cinematic Loading Screen**: Full-screen dark loader featuring **PP.** emblem, progress counter (0% → 100%), status text stream, and dramatic split transition. Uses `sessionStorage` for instant repeat visits.
2. **Interactive Custom Cursor**: Glowing dot with trailing lerped ring that transforms based on hovered elements (`VIEW →`, `EXPLORE`, `INSPECT`). Disables automatically on touch devices.
3. **Multi-Layer Interactive Background**: Dark gradient, animated glowing blobs, interactive mouse-repelling particle canvas, grid mesh, noise overlay, and cursor-following aura.
4. **Assembling Hero Section**: Kinetic character letter assembly for **PRAJWAL POKHAREL** with typewriter roles (`Developer`, `Technology Enthusiast`, `Builder`, `Learning by Building`).
5. **Interactive 3D Geometry & Terminal**: Three.js WebGL wireframe polyhedron and interactive developer terminal (`$ whoami`, `$ status`, `$ goal`).
6. **Cyber Sentinel Creature**: WebGL/Canvas low-poly Cyber Wolf companion that breathes, emits glowing particle energy, and tracks cursor coordinates with parallax depth.
7. **Honest About Section**: Story, philosophy, and learning goals tabs without fake experience claims.
8. **Interactive Tech Matrix**: Categorized skill cards (Web, Programming, Tools, Interests) and **Constellation Matrix Mode** with orbiting skill nodes.
9. **Honest Projects Showcase**: "Projects Loading..." empty-state card + interactive Project Card Design Playground/Simulator.
10. **Scroll-Driven Timeline Journey**: Animated progression beam line growing with scroll depth across 6 key milestones (START → LEARN → BUILD → FAIL → IMPROVE → GROW).
11. **Futuristic GitHub Section**: Direct integration for `@prajwal9762` with copy link and star simulator.
12. **Interactive Contact Section**: Direct message transmitter and official link pills (`https://prajwal-pokharel.com.np`).
13. **Audio Feedback**: Web Audio API sound generator for subtle futuristic UI clicks, beeps, and hover whooshes.

---

## 🚀 How to Deploy to GitHub Pages

This application is 100% static client-side (built with Vite, React, TypeScript, Tailwind CSS, Three.js) and requires **no backend or server**.

### Step 1: Clone or Copy Source
```bash
git clone https://github.com/prajwal9762/prajwal-pokharel-portfolio.git
cd prajwal-pokharel-portfolio
```

### Step 2: Build Static Bundle
```bash
npm install
npm run build
```
This generates the `dist/` directory with static `index.html`, JavaScript, and CSS bundles.

### Step 3: Configure CNAME for Custom Domain
Add a `CNAME` file in your `public/` directory with your domain:
```text
prajwal-pokharel.com.np
```

### Step 4: Push to GitHub & Enable Pages
```bash
git add .
git commit -m "Deploy Ultra-Animated Portfolio"
git push origin main
```
In your GitHub Repository Settings -> **Pages**:
- Select **GitHub Actions** or **Deploy from branch (`main` / `gh-pages`)**.

Your website will be live at **https://prajwal-pokharel.com.np**!
