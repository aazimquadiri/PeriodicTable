import { createLayout, utils, stagger, spring, createTimer, createAnimatable } from 'https://esm.sh/animejs@4.3.0';

// Initialize Icons
lucide.createIcons();

// ════════════════════════════════
//   THEME TOGGLE
// ════════════════════════════════
const themeToggleBtn = document.getElementById('theme-toggle');
const rootEl = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
  rootEl.classList.toggle('dark');
  const isDark = rootEl.classList.contains('dark');
  themeToggleBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  lucide.createIcons();
});

// ════════════════════════════════
//   SMART SCALER 
// ════════════════════════════════
let baseScale = 1;
let baseOffsetY = 0;

function applyScale() {
  const scaler = document.getElementById('scene-scaler');
  scaler.style.transform = `translate(0px, ${baseOffsetY}px) scale(${baseScale})`;
}

function updateScale(targetLayout) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  const layoutWidth = 1350; 
  const layoutHeight = 950; 
  
  const availableHeight = h - (w < 1050 ? 280 : 160); 
  const availableWidth = w - (w < 1050 ? 20 : 80);

  let scaleX = availableWidth / layoutWidth;
  let scaleY = availableHeight / layoutHeight;
  let scale = Math.min(scaleX, scaleY);
  
  if (scale > 1.1) scale = 1.1;
  
  // Determine which layout to base the scaling on
  const activeLayout = targetLayout || (document.getElementById('scene-content') ? document.getElementById('scene-content').dataset.layout : 'table');

  if (w < 768) {
     if (activeLayout === 'table') {
         scale = Math.max(scale, 0.45); // Keeps the table large and draggable
     } else if (activeLayout === 'helix') {
         scale = availableWidth / 940; // Helix naturally wide, perfectly spaced
     } else if (activeLayout === 'sphere') {
         scale = availableWidth / 850; // Sphere width mapping for perfect edge space
     } else if (activeLayout === 'grid') {
         scale = availableWidth / 700; // Grid is compact, scales up much bigger now
     }
  } else {
     if (scale < 0.15) scale = 0.15;
  }
  
  baseScale = scale;
  baseOffsetY = w < 1050 ? 50 : 0;
  
  applyScale();
}

window.addEventListener('resize', () => updateScale());

// ════════════════════════════════
//   DATA & DOM INJECTION
// ════════════════════════════════
const ELEMENT_FIELDS = { SYMBOL: 0, NAME: 1, COLOR: 2, COLUMN: 3, ROW: 4, ATOMIC_MASS: 5, DENSITY: 6, MELTING_POINT: 7, BOILING_POINT: 8 };
const ELEMENT_STRIDE = 9;

const rawData = [
  'H', 'Hydrogen', 0, 1, 1, 1.008, 0.08988, -259.16, -252.88,
  'He', 'Helium', 1, 18, 1, 4.0026, 0.1786, -272.2, -268.93,
  'Li', 'Lithium', 2, 1, 2, 6.94, 0.534, 180.5, 1329.85,
  'Be', 'Beryllium', 3, 2, 2, 9.0122, 1.85, 1286.85, 2468.85,
  'B', 'Boron', 4, 13, 2, 10.81, 2.08, 2075.85, 3926.85,
  'C', 'Carbon', 0, 14, 2, 12.011, 1.821, null, null,
  'N', 'Nitrogen', 0, 15, 2, 14.007, 1.251, -210, -195.79,
  'O', 'Oxygen', 0, 16, 2, 15.999, 1.429, -218.79, -182.96,
  'F', 'Fluorine', 0, 17, 2, 18.998, 1.696, -219.67, -188.12,
  'Ne', 'Neon', 1, 18, 2, 20.180, 0.9002, -248.59, -246.05,
  'Na', 'Sodium', 2, 1, 3, 22.990, 0.968, 97.79, 882.94,
  'Mg', 'Magnesium', 3, 2, 3, 24.305, 1.738, 649.85, 1089.85,
  'Al', 'Aluminium', 5, 13, 3, 26.982, 2.7, 660.32, 2469.85,
  'Si', 'Silicon', 4, 14, 3, 28.085, 2.329, 1413.85, 3264.85,
  'P', 'Phosphorus', 0, 15, 3, 30.974, 1.823, null, null,
  'S', 'Sulfur', 0, 16, 3, 32.06, 2.07, 115.21, 444.65,
  'Cl', 'Chlorine', 0, 17, 3, 35.45, 3.2, -101.55, -34.04,
  'Ar', 'Argon', 1, 18, 3, 39.948, 1.784, -189.34, -185.85,
  'K', 'Potassium', 2, 1, 4, 39.098, 0.862, 63.55, 758.85,
  'Ca', 'Calcium', 3, 2, 4, 40.078, 1.55, 841.85, 1483.85,
  'Sc', 'Scandium', 6, 3, 4, 44.956, 2.985, 1540.85, 2835.85,
  'Ti', 'Titanium', 6, 4, 4, 47.867, 4.506, 1667.85, 3286.85,
  'V', 'Vanadium', 6, 5, 4, 50.942, 6, 1909.85, 3406.85,
  'Cr', 'Chromium', 6, 6, 4, 51.996, 7.19, 1906.85, 2670.85,
  'Mn', 'Manganese', 6, 7, 4, 54.938, 7.21, 1245.85, 2060.85,
  'Fe', 'Iron', 6, 8, 4, 55.845, 7.874, 1537.85, 2860.85,
  'Co', 'Cobalt', 6, 9, 4, 58.933, 8.9, 1494.85, 2926.85,
  'Ni', 'Nickel', 6, 10, 4, 58.693, 8.908, 1454.85, 2729.85,
  'Cu', 'Copper', 6, 11, 4, 63.546, 8.96, 1084.62, 2561.85,
  'Zn', 'Zinc', 5, 12, 4, 65.382, 7.14, 419.53, 906.85,
  'Ga', 'Gallium', 5, 13, 4, 69.723, 5.91, 29.76, 2399.85,
  'Ge', 'Germanium', 4, 14, 4, 72.631, 5.323, 938.25, 2832.85,
  'As', 'Arsenic', 4, 15, 4, 74.922, 5.727, null, null,
  'Se', 'Selenium', 0, 16, 4, 78.972, 4.81, 220.85, 684.85,
  'Br', 'Bromine', 0, 17, 4, 79.904, 3.1028, -7.35, 58.85,
  'Kr', 'Krypton', 1, 18, 4, 83.798, 3.749, -157.37, -153.22,
  'Rb', 'Rubidium', 2, 1, 5, 85.468, 1.532, 39.3, 687.85,
  'Sr', 'Strontium', 3, 2, 5, 87.621, 2.64, 776.85, 1376.85,
  'Y', 'Yttrium', 6, 3, 5, 88.906, 4.472, 1525.85, 2929.85,
  'Zr', 'Zirconium', 6, 4, 5, 91.224, 6.52, 1854.85, 4376.85,
  'Nb', 'Niobium', 6, 5, 5, 92.906, 8.57, 2476.85, 4743.85,
  'Mo', 'Molybdenum', 6, 6, 5, 95.951, 10.28, 2622.85, 4638.85,
  'Tc', 'Technetium', 6, 7, 5, 98, 11, 2156.85, 4264.85,
  'Ru', 'Ruthenium', 6, 8, 5, 101.072, 12.45, 2333.85, 4149.85,
  'Rh', 'Rhodium', 6, 9, 5, 102.906, 12.41, 1963.85, 3694.85,
  'Pd', 'Palladium', 6, 10, 5, 106.421, 12.023, 1554.9, 2962.85,
  'Ag', 'Silver', 6, 11, 5, 107.868, 10.49, 961.78, 2161.85,
  'Cd', 'Cadmium', 5, 12, 5, 112.414, 8.65, 321.07, 766.85,
  'In', 'Indium', 5, 13, 5, 114.818, 7.31, 156.6, 2071.85,
  'Sn', 'Tin', 5, 14, 5, 118.711, 7.365, 231.93, 2601.85,
  'Sb', 'Antimony', 4, 15, 5, 121.760, 6.697, 630.63, 1634.85,
  'Te', 'Tellurium', 4, 16, 5, 127.603, 6.24, 449.51, 987.85,
  'I', 'Iodine', 0, 17, 5, 126.904, 4.933, 113.7, 184.25,
  'Xe', 'Xenon', 1, 18, 5, 131.294, 5.894, -111.75, -108.1,
  'Cs', 'Cesium', 2, 1, 6, 132.905, 1.93, 28.55, 670.85,
  'Ba', 'Barium', 3, 2, 6, 137.328, 3.51, 726.85, 1844.85,
  'Hf', 'Hafnium', 6, 4, 6, 178.492, 13.31, 2232.85, 4602.85,
  'Ta', 'Tantalum', 6, 5, 6, 180.948, 16.69, 3016.85, 5457.85,
  'W', 'Tungsten', 6, 6, 6, 183.841, 19.25, 3421.85, 5929.85,
  'Re', 'Rhenium', 6, 7, 6, 186.207, 21.02, 3185.85, 5595.85,
  'Os', 'Osmium', 6, 8, 6, 190.233, 22.59, 3032.85, 5011.85,
  'Ir', 'Iridium', 6, 9, 6, 192.217, 22.56, 2445.85, 4129.85,
  'Pt', 'Platinum', 6, 10, 6, 195.085, 21.45, 1768.25, 3824.85,
  'Au', 'Gold', 6, 11, 6, 196.967, 19.3, 1064.18, 2969.85,
  'Hg', 'Mercury', 5, 12, 6, 200.592, 13.534, -38.83, 356.73,
  'Tl', 'Thallium', 5, 13, 6, 204.38, 11.85, 303.85, 1472.85,
  'Pb', 'Lead', 5, 14, 6, 207.21, 11.34, 327.46, 1748.85,
  'Bi', 'Bismuth', 5, 15, 6, 208.980, 9.78, 271.55, 1563.85,
  'Po', 'Polonium', 4, 16, 6, 209, 9.196, 253.85, 961.85,
  'At', 'Astatine', 0, 17, 6, 210, 6.35, 301.85, 336.85,
  'Rn', 'Radon', 1, 18, 6, 222, 9.73, -71.15, -61.65,
  'Fr', 'Francium', 2, 1, 7, 223, 1.87, 26.85, 676.85,
  'Ra', 'Radium', 3, 2, 7, 226, 5.5, 959.85, 1736.85,
  'Rf', 'Rutherfordium', 6, 4, 7, 267, 23.2, 2126.85, 5526.85,
  'Db', 'Dubnium', 6, 5, 7, 268, 29.3, null, null,
  'Sg', 'Seaborgium', 6, 6, 7, 269, 35, null, null,
  'Bh', 'Bohrium', 6, 7, 7, 270, 37.1, null, null,
  'Hs', 'Hassium', 6, 8, 7, 269, 40.7, -147.15, null,
  'Mt', 'Meitnerium', 9, 9, 7, 278, 37.4, null, null,
  'Ds', 'Darmstadtium', 9, 10, 7, 281, 34.8, null, null,
  'Rg', 'Roentgenium', 9, 11, 7, 282, 28.7, null, null,
  'Cn', 'Copernicium', 9, 12, 7, 285, 14, null, 3296.85,
  'Nh', 'Nihonium', 9, 13, 7, 286, 16, 426.85, 1156.85,
  'Fl', 'Flerovium', 9, 14, 7, 289, 14, 66.85, 146.85,
  'Mc', 'Moscovium', 9, 15, 7, 289, 13.5, 396.85, 1126.85,
  'Lv', 'Livermorium', 9, 16, 7, 293, 12.9, 435.85, 811.85,
  'Ts', 'Tennessine', 9, 17, 7, 294, 7.17, 449.85, 609.85,
  'Og', 'Oganesson', 9, 18, 7, 294, 4.95, null, 76.85,
  'La', 'Lanthanum', 7, 3, 8, 138.905, 6.162, 919.85, 3463.85,
  'Ce', 'Cerium', 7, 4, 8, 140.116, 6.77, 794.85, 3442.85,
  'Pr', 'Praseodymium', 7, 5, 8, 140.907, 6.77, 934.85, 3129.85,
  'Nd', 'Neodymium', 7, 6, 8, 144.242, 7.01, 1023.85, 3073.85,
  'Pm', 'Promethium', 7, 7, 8, 145, 7.26, 1041.85, 2999.85,
  'Sm', 'Samarium', 7, 8, 8, 150.362, 7.52, 1071.85, 1899.85,
  'Eu', 'Europium', 7, 9, 8, 151.964, 5.264, 825.85, 1528.85,
  'Gd', 'Gadolinium', 7, 10, 8, 157.253, 7.9, 1311.85, 2999.85,
  'Tb', 'Terbium', 7, 11, 8, 158.925, 8.23, 1355.85, 3122.85,
  'Dy', 'Dysprosium', 7, 12, 8, 162.500, 8.54, 1406.85, 2566.85,
  'Ho', 'Holmium', 7, 13, 8, 164.930, 8.79, 1460.85, 2599.85,
  'Er', 'Erbium', 7, 14, 8, 167.259, 9.066, 1528.85, 2867.85,
  'Tm', 'Thulium', 7, 15, 8, 168.934, 9.32, 1544.85, 1949.85,
  'Yb', 'Ytterbium', 7, 16, 8, 173.045, 6.9, 823.85, 1195.85,
  'Lu', 'Lutetium', 7, 17, 8, 174.966, 9.841, 1651.85, 3401.85,
  'Ac', 'Actinium', 8, 3, 9, 227, 10, 1226.85, 3226.85,
  'Th', 'Thorium', 8, 4, 9, 232.037, 11.724, 1749.85, 4787.85,
  'Pa', 'Protactinium', 8, 5, 9, 231.035, 15.37, 1567.85, 4026.85,
  'U', 'Uranium', 8, 6, 9, 238.028, 19.1, 1132.15, 4130.85,
  'Np', 'Neptunium', 8, 7, 9, 237, 20.45, 638.85, 4173.85,
  'Pu', 'Plutonium', 8, 8, 9, 244, 19.816, 639.35, 3231.85,
  'Am', 'Americium', 8, 9, 9, 243, 12, 1175.85, 2606.85,
  'Cm', 'Curium', 8, 10, 9, 247, 13.51, 1339.85, 3109.85,
  'Bk', 'Berkelium', 8, 11, 9, 247, 14.78, 985.85, 2626.85,
  'Cf', 'Californium', 8, 12, 9, 251, 15.1, 899.85, 1469.85,
  'Es', 'Einsteinium', 8, 13, 9, 252, 8.84, 859.85, 995.85,
  'Fm', 'Fermium', 8, 14, 9, 257, null, 1526.85, null,
  'Md', 'Mendelevium', 8, 15, 9, 258, null, 826.85, null,
  'No', 'Nobelium', 8, 16, 9, 259, null, 826.85, null,
  'Lr', 'Lawrencium', 8, 17, 9, 266, null, 1626.85, null,
];

const $sceneContent = document.getElementById('scene-content');
const $template = document.getElementById('element-template');

for (let i = 0, l = rawData.length / ELEMENT_STRIDE; i < l; i += 1) {
  const offset = i * ELEMENT_STRIDE;
  const $el = $template.content.cloneNode(true);
  const $card = $el.querySelector('.element-card');
  
  const num = i + 1;
  const sym = rawData[offset + ELEMENT_FIELDS.SYMBOL];
  const name = rawData[offset + ELEMENT_FIELDS.NAME];
  const mass = rawData[offset + ELEMENT_FIELDS.ATOMIC_MASS];
  const dens = rawData[offset + ELEMENT_FIELDS.DENSITY];
  const melt = rawData[offset + ELEMENT_FIELDS.MELTING_POINT];
  const boil = rawData[offset + ELEMENT_FIELDS.BOILING_POINT];

  $card.querySelector('.el-num').textContent = num;
  $card.querySelector('.el-sym').textContent = sym;
  $card.querySelector('.el-name').textContent = name;
  $card.querySelector('.det-num').textContent = num;
  $card.querySelector('.det-sym').textContent = sym;
  $card.querySelector('.det-name').textContent = name;
  $card.querySelector('.mass-val').textContent = mass ? `${mass} u` : '-';
  $card.querySelector('.dens-val').textContent = dens ? `${dens} g/cm³` : '-';
  $card.querySelector('.melt-val').textContent = melt ? `${melt} °C` : '-';
  $card.querySelector('.boil-val').textContent = boil ? `${boil} °C` : '-';

  $card.dataset.color = rawData[offset + ELEMENT_FIELDS.COLOR];
  $card.dataset.sym = sym.toLowerCase();
  $card.dataset.name = name.toLowerCase();
  $card.style.gridColumn = rawData[offset + ELEMENT_FIELDS.COLUMN];
  $card.style.gridRow = rawData[offset + ELEMENT_FIELDS.ROW];

  $sceneContent.appendChild($el);
}

const cards = Array.from(document.querySelectorAll('#scene-content .element-card'));

const elementsLayout = createLayout($sceneContent, {
  properties: ['font-size'],
  duration: 1000, 
  ease: 'outExpo',
});

// Increased default rotation bounds to make it feel deeply 3D
const sceneAnimatable = createAnimatable('#scene', { rotateX: 45, rotateY: 60, translateX: 0, translateY: 0 });
const pointer = { x: 0, y: 0, rotateX: 0, rotateY: 0, rx: 0, ry: 0 };
const dragState = { isDragging: false, startX: 0, startY: 0, tx: 0, ty: 0, smoothTx: 0, smoothTy: 0, baseTx: 0, baseTy: 0, hasDragged: false };

createTimer({
  onUpdate: () => {
    pointer.rx = utils.lerp(pointer.rx, pointer.rotateX, 0.06);
    pointer.ry = utils.lerp(pointer.ry, pointer.rotateY, 0.06);

    dragState.smoothTx = utils.lerp(dragState.smoothTx, dragState.tx, 0.08);
    dragState.smoothTy = utils.lerp(dragState.smoothTy, dragState.ty, 0.08);

    // Apply smooth 3D rotation based on mouse/touch parallax
    sceneAnimatable.rotateX(pointer.y * pointer.rx);
    sceneAnimatable.rotateY(pointer.x * pointer.ry);
    
    // Apply smooth dragging translation
    sceneAnimatable.translateX(dragState.smoothTx);
    sceneAnimatable.translateY(dragState.smoothTy);
  }
});

const transformLayout = {
  table: () => {
    pointer.rotateX = 5; pointer.rotateY = 8;
    cards.forEach($el => $el.style.transform = $el.classList.contains('is-expanded') ? 'translateZ(250px)' : 'translateZ(0px)');
  },
  sphere: () => {
    const radius = 400;
    pointer.rotateX = 12; pointer.rotateY = 50;
    cards.forEach(($el, i) => {
      const offsetZ = $el.classList.contains('is-expanded') ? 250 : 0;
      const phi = Math.acos(-1 + (2 * i) / cards.length);
      const theta = Math.sqrt(cards.length * Math.PI) * phi;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const yaw = Math.atan2(x, z);
      const pitch = -Math.atan2(y, Math.hypot(x, z));
      $el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${yaw}rad) rotateX(${pitch}rad) translateZ(${offsetZ}px)`;
    });
  },
  helix: () => {
    pointer.rotateX = 10; pointer.rotateY = 45;
    const radius = 450; const thetaStep = 0.213; const verticalSpacing = 6.5;
    const yOffset = (cards.length * verticalSpacing) / 2;
    cards.forEach(($el, i) => {
      const offsetZ = $el.classList.contains('is-expanded') ? 250 : 0;
      const theta = i * thetaStep + Math.PI;
      const y = -(i * verticalSpacing) + yOffset;
      const x = radius * Math.sin(theta);
      const z = radius * Math.cos(theta);
      const yaw = Math.atan2(x, z);
      const pitch = -Math.atan2(y, Math.hypot(x, z) * 2);
      $el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${yaw}rad) rotateX(${pitch}rad) translateZ(${offsetZ}px)`;
    });
  },
  grid: () => {
    pointer.rotateX = 8; pointer.rotateY = 15;
    const cols = 5; const rows = 5; const gapX = 160; const gapY = 120; const gapZ = 200;
    const perLayer = cols * rows; const layers = Math.ceil(cards.length / perLayer);
    cards.forEach(($el, i) => {
      const offsetZ = $el.classList.contains('is-expanded') ? 250 : 0;
      const col = i % cols; const row = Math.floor(i / cols) % rows; const layer = Math.floor(i / perLayer);
      const x = (col - (cols - 1) / 2) * gapX;
      const y = ((rows - 1) / 2 - row) * gapY;
      const z = offsetZ + ((layer - (layers - 1) / 2) * gapZ);
      $el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    });
  },
  random: () => {
    pointer.rotateX = 10; pointer.rotateY = 15;
    utils.set(cards, { x: () => utils.random(-600, 600), y: () => utils.random(-600, 600), z: () => utils.random(-600, 600) });
  },
};

// ════════════════════════════════
//   INTERACTION EVENT LISTENERS
// ════════════════════════════════

document.addEventListener('pointerdown', e => {
  if (e.target.closest('.ui-layer') || e.target.closest('.bottom-bar')) return;
  
  // ONLY allow dragging on the Table layout
  if ($sceneContent.dataset.layout !== 'table') return; 

  dragState.isDragging = true;
  dragState.hasDragged = false;
  dragState.startX = e.clientX;
  dragState.startY = e.clientY;
  dragState.baseTx = dragState.tx;
  dragState.baseTy = dragState.ty;
  document.body.classList.add('is-dragging');
});

document.addEventListener('pointermove', e => {
  const hw = window.innerWidth * .5;
  const hh = window.innerHeight * .5;
  
  // Map pointer movement to 3D rotation parallax (Always running for all layouts)
  pointer.x = utils.mapRange(e.clientX - hw, -hw, hw, 1.5, -1.5);
  pointer.y = utils.mapRange(e.clientY - hh, -hh, hh, -1.5, 1.5);

  // Handle translation (dragging) - Restricted to when pointerdown confirmed Table layout
  if (dragState.isDragging) {
    const dx = (e.clientX - dragState.startX) / baseScale;
    const dy = (e.clientY - dragState.startY) / baseScale;
    
    // Threshold check to prevent accidental clicks
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragState.hasDragged = true;
    }

    dragState.tx = dragState.baseTx + dx;
    dragState.ty = dragState.baseTy + dy;
  }
});

document.addEventListener('pointerup', e => {
  if (dragState.isDragging) {
    dragState.isDragging = false;
    document.body.classList.remove('is-dragging');
  }
});

document.addEventListener('pointercancel', e => {
  if (dragState.isDragging) {
    dragState.isDragging = false;
    document.body.classList.remove('is-dragging');
  }
});

document.addEventListener('click', event => {
  // Prevent click if we were dragging the view
  if (dragState.hasDragged) {
    dragState.hasDragged = false;
    return;
  }

  const $toggleBtn = event.target.closest('.layout-btn');
  const $card = event.target.closest('.element-card');
  const layoutType = $sceneContent.dataset.layout;

  // Handle UI Layout Switch
  if ($toggleBtn) {
    document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('is-active'));
    $toggleBtn.classList.add('is-active');

    // Reset drag translation back to center when switching layouts
    dragState.tx = 0;
    dragState.ty = 0;

    // Toggle drag cursor dynamically based on Table layout
    const sceneEl = document.getElementById('scene');
    if ($toggleBtn.id === 'table') {
      sceneEl.classList.add('is-draggable');
    } else {
      sceneEl.classList.remove('is-draggable');
    }

    // Trigger dynamic scale update early to crossfade the zoom state while AnimeJS transitions
    updateScale($toggleBtn.id);

    // Disable specific CSS transitions so Anime FLIP can animate layout switches cleanly!
    cards.forEach(c => c.classList.remove('transition-active'));

    elementsLayout.update(() => {
      cards.forEach($el => $el.classList.remove('is-expanded'));
      $sceneContent.dataset.layout = $toggleBtn.id;
      transformLayout[$toggleBtn.id]();
    }, { delay: stagger([0, 300], { from: 'center' }) });
    return;
  }

  // Handle Card Expand
  if ($card) {
    const isAlreadyExpanded = $card.classList.contains('is-expanded');
    
    // Enable CSS transitions for silky smooth expand/collapse without FLIP glitch
    cards.forEach(c => c.classList.add('transition-active'));

    cards.forEach($el => $el.classList.remove('is-expanded'));
    if (!isAlreadyExpanded) $card.classList.add('is-expanded');
    
    // Manually update mathematical transforms (which are now CSS transitioned)
    transformLayout[layoutType]();
    return;
  }

  // Handle Click Outside to Collapse
  const hasExpandedCard = cards.some($el => $el.classList.contains('is-expanded'));
  const clickedOutside = !event.target.closest('.element-card') && !event.target.closest('.ui-layer') && !event.target.closest('.bottom-bar');
  
  if (hasExpandedCard && clickedOutside) {
    // Enable CSS transitions for the collapse 
    cards.forEach(c => c.classList.add('transition-active'));

    cards.forEach($el => $el.classList.remove('is-expanded'));
    transformLayout[layoutType]();
  }
});

document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  cards.forEach((card) => {
    const match = !query || card.dataset.sym.includes(query) || card.dataset.name.includes(query);
    if (match) {
      card.classList.remove('is-faded');
    } else {
      card.classList.add('is-faded');
      if(card.classList.contains('is-expanded')) {
        // Enable CSS transitions for the collapse
        cards.forEach(c => c.classList.add('transition-active'));
        card.classList.remove('is-expanded');
        transformLayout[$sceneContent.dataset.layout]();
      }
    }
  });
});

// Initializations
updateScale();
transformLayout.random();
cards.forEach(c => c.style.opacity = 0);

setTimeout(() => {
  elementsLayout.update(() => {
    cards.forEach(c => c.style.opacity = 1);
    transformLayout.table();
  }, { delay: stagger([0, 350], { from: 'center' }) });
}, 100);