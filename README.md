# 🧪 3D Interactive Periodic Table

An immersive, high-performance interactive Periodic Table built with vanilla web technologies and Anime.js. This project visualizes the elements of the periodic table in beautiful, mathematically driven 3D spatial arrangements, offering a modern UI with glassmorphism and fluid animations.

**[🔗 CLICK HERE TO VISIT THE PROJECT'S OFFICIAL WEBSITE](https://elements.plaxinfy.in/)**

---

## 🎬 Image Preview

<div align="center">
  <a href="http://elements.plaxinfy.in/">
    <img src="#" alt="Periodic Table Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  </a>
  <p><i>Click the image above to experience the interactive 3D Periodic Table.</i></p>
</div>

---

## ✨ Key Features

### 🌌 3D Spatial Layouts
* **Four Unique Views:** Seamlessly morph the elements between a traditional **Table**, a global **Sphere**, a DNA-like **Helix**, and a deep **Grid**.
* **Smooth Transitions:** Powered by Anime.js, the layout transitions use advanced timing and stagger effects to gracefully rearrange over 100 elements in 3D space without dropping frames.
* **Smart Scaling:** The 3D scene automatically calculates the optimal scale and offset based on your screen size, ensuring a perfect view on both desktop and mobile.

### 🌬️ Interactive 3D Camera & Physics
* **Mouse Parallax:** The entire 3D scene reacts to your mouse movements, subtly rotating on the X and Y axes to create a deep sense of immersion.
* **Drag to Pan:** While in the Table layout, easily click and drag to pan around the grid, featuring smooth velocity damping for a premium feel.
* **Expandable Data Cards:** Click any element to smoothly expand it into a detailed card displaying its Atomic Mass, Density, Melting Point, and Boiling Point.

### 🎨 Modern UI & Aesthetics
* **Dynamic Dark/Light Mode:** A clean, minimal toggle that completely shifts the color palette, featuring custom variables for "paper," "ink," and "glass" textures.
* **Glassmorphism Controls:** The UI layer floats above the scene using heavily blurred backdrops and subtle borders for a modern, sleek aesthetic.
* **Real-time Search:** A fluid search bar that instantly highlights matching elements (by symbol or name) while fading out the rest.

---

## 🕹️ Interaction & UI Guide

### 🎛️ The Command Bar
Located at the top, the split glass-pill UI controls the entire experience:
* **Layout Toggles:** Click `Table`, `Sphere`, `Helix`, or `Grid` to trigger the mathematical realignment of the elements.
* **Search:** Type any element name (e.g., "Gold") or symbol (e.g., "Au"). Non-matching elements will gracefully fade into the background.
* **Theme Toggle (Moon/Sun):** Instantly switches the CSS custom properties between the vibrant light mode and the sleek dark mode.

### 🌪️ Environmental Control
| Action | Result |
| :--- | :--- |
| **Move Mouse** | Rotates the entire 3D wrapper to create depth parallax. |
| **Click & Drag** | Pans the camera around the elements (active only in `Table` layout). |
| **Click Element** | Expands the element card to reveal detailed scientific data. Click outside to collapse. |

---

## 🛠️ Technical Deep Dive

### CSS 3D Transforms & Math
Unlike WebGL-based projects, this table relies entirely on DOM elements heavily optimized with `transform-style: preserve-3d`. 
* **Sphere & Helix Generation:** The spatial layouts are generated using pure Javascript trigonometry (Spherical coordinates using `Math.sin`, `Math.cos`, and `Math.acos`).
* **Yaw & Pitch Calculations:** Elements are mathematically rotated (`rotateY`, `rotateX`) to continually face outward based on their position in the sphere or helix.

### FLIP Animations via Anime.js
* **Layout Morphing:** Instead of manually calculating transition paths, the project leverages `Anime.js` to animate font sizes, opacities, and complex staggering, paired with CSS transitions for height/width morphing when expanding cards.

---

## 📁 File Structure

```text
├── index.html       # DOM structure, template tags, and UI overlay
├── style.css        # Glassmorphism, Dark Mode variables, and 3D card CSS
└── script.js        # Data arrays, Math calculations, and Event Listeners
```

---

## 🚀 Local Development

Because this project relies on ES modules (`<script type="module">` for Anime.js via CDN), running it through a local server is **required** to avoid CORS (Cross-Origin Resource Sharing) security errors.

### Option 1: VS Code (Recommended)
1. Install the **Live Server** extension.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Python Server
If you have Python installed, run this command in your project folder:
```bash
# For Python 3.x
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option 3: Node.js (npx)
If you have Node.js installed, use one of these commands:
```bash
# Using 'serve'
npx serve .

# OR using 'http-server'
npx http-server .
```
Then visit the URL provided in the terminal.

---

## 👨‍💻 Author

**Aazim Quadiri**
* **GitHub:** [@aazimquadiri](https://github.com/aazimquadiri)
* **X (Twitter):** [@captainfinite](https://x.com/captainfinite)
* **Instagram:** [@captainfinite](https://www.instagram.com/captainfinite)

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute the code while providing attribution.
