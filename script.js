// === Scene Setup ===
const scene = new THREE.Scene();
// === Backgrounds ===
const backgroundTextures = {
  dark: null, // no texture, just black background for dark mode
  light: new THREE.TextureLoader().load('textures/stars_milkyway.jpg') // or use plain color instead
};
scene.background = backgroundTextures.light;
document.body.style.backgroundColor = '#eee'; // light mode background color

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
camera.position.z = 400;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === Background Milky Way ===
const backgroundTexture = new THREE.TextureLoader().load('textures/stars_milkyway.jpg');
scene.background = backgroundTexture;

// === Lights from Sun ===
const sunLight = new THREE.PointLight(0xffaa33, 3.5, 1000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

// === Sun ===
const sunTexture = new THREE.TextureLoader().load('textures/2k_sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(30, 64, 64),
  new THREE.MeshBasicMaterial({ map: sunTexture })
);
sun.userData = { name: 'Sun', distance: 0, angle: 0, speed: 0 };
scene.add(sun);

// === Create Planets ===
function createPlanet(name, size, distance, texturePath, speed) {
  const texture = new THREE.TextureLoader().load(texturePath);
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.5,
      metalness: 0.7,
      emissive: new THREE.Color(0x111111),
      emissiveIntensity: 0.2
    })
  );
  mesh.userData = { name, distance, angle: Math.random() * Math.PI * 2, speed };
  scene.add(mesh);

  const orbitGeometry = new THREE.RingGeometry(distance - 0.3, distance + 0.3, 128);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  return mesh;
}

const planets = [
  sun,
  createPlanet('Mercury', 4, 60, 'textures/8k_mercury.jpg', 0.02),
  createPlanet('Venus', 6.5, 100, 'textures/2k_venus_surface.jpg', 0.015),
  createPlanet('Earth', 8, 140, 'textures/2k_earth_daymap.jpg', 0.012),
  createPlanet('Mars', 6, 180, 'textures/mars.jpg', 0.01),
  createPlanet('Jupiter', 18, 240, 'textures/jupiter.jpg', 0.007),
  createPlanet('Saturn', 16, 300, 'textures/saturn.jpg', 0.006),
  createPlanet('Uranus', 13, 360, 'textures/uranus.jpg', 0.004),
  createPlanet('Neptune', 13, 420, 'textures/neptune.jpg', 0.003),
];

function addSaturnRing(saturn) {
  const ringTexture = new THREE.TextureLoader().load('textures/saturn_ring.png');
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(17, 23, 64),
    new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true })
  );
  ring.rotation.x = Math.PI / 2;
  saturn.add(ring);
}
addSaturnRing(planets[6]);

function createStars() {
  const geo = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 10000; i++) {
    vertices.push((Math.random() - 0.5) * 10000, (Math.random() - 0.5) * 10000, -Math.random() * 5000);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);
}
createStars();

function createMeteorites(count = 200) {
  const meteorMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.3 });
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 1.5 + 0.5;
    const geometry = new THREE.SphereGeometry(size, 12, 12);
    const meteor = new THREE.Mesh(geometry, meteorMaterial);
    meteor.position.set((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000);
    scene.add(meteor);
  }
}
createMeteorites();

const planetDescriptions = {
  Sun: "The center of our solar system. A massive ball of hot plasma that provides light and heat to all planets.",
  Mercury: "The smallest planet and closest to the Sun. It has a rocky surface covered in craters.",
  Venus: "Venus has a thick, toxic atmosphere and is the hottest planet in our solar system.",
  Earth: "Our home planet, the only one known to support life with water and atmosphere.",
  Mars: "Known as the Red Planet, Mars may have once had water and possibly life.",
  Jupiter: "The largest planet, a gas giant with a Great Red Spot — a massive storm.",
  Saturn: "Famous for its stunning ring system, Saturn is another gas giant.",
  Uranus: "A cold gas giant that rotates on its side, with faint rings.",
  Neptune: "The farthest known planet, deep blue and home to the strongest winds in the solar system."
};

const toggleBtn = document.createElement('div');
toggleBtn.innerText = '⚙️';
toggleBtn.style.position = 'absolute';
toggleBtn.style.top = '20px';
toggleBtn.style.right = '20px';
toggleBtn.style.fontSize = '24px';
toggleBtn.style.cursor = 'pointer';
toggleBtn.style.color = '#fff';
toggleBtn.style.zIndex = '1001';
document.body.appendChild(toggleBtn);

const sliderContainer = document.getElementById('sliders');
sliderContainer.style.cssText = 'position:absolute;top:60px;right:-260px;width:240px;background:rgba(0,0,0,0.7);padding:15px;border:1px solid #fff;border-radius:10px;color:#fff;font-family:Orbitron,max-height:90vh;overflow-y:auto;transition:right 0.5s ease;display:none';

let isOpen = false;
toggleBtn.onclick = () => {
  isOpen = !isOpen;
  sliderContainer.style.display = isOpen ? 'block' : 'none';
};

planets.forEach((planet) => {
  if (planet.userData.name === 'Sun') return;
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '10px';

  const label = document.createElement('label');
  label.innerText = planet.userData.name;
  label.style.cssText = 'display:block;margin-bottom:5px;font-weight:bold';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0.001;
  slider.max = 0.05;
  slider.step = 0.001;
  slider.value = planet.userData.speed;
  slider.style.width = '100%';
  slider.oninput = () => (planet.userData.speed = parseFloat(slider.value));

  wrapper.appendChild(label);
  wrapper.appendChild(slider);
  sliderContainer.appendChild(wrapper);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetPlanet = null;
let zoomedIn = false;

const infoBox = document.createElement('div');
infoBox.style.cssText = 'position:absolute;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.6);border:1px solid #fff;border-radius:12px;padding:20px;color:#fff;font-family:Orbitron,sans-serif;font-size:14px;width:320px;box-shadow:0 0 20px rgba(255,255,255,0.3);display:none;z-index:1000';
document.body.appendChild(infoBox);

// Existing click handler remains as is:
window.addEventListener('click', (event) => {
  if (zoomedIn) return;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    targetPlanet = intersects[0].object;
    zoomedIn = true;
    const name = targetPlanet.userData.name;
    const description = planetDescriptions[name];
    infoBox.innerHTML = `
      <h2 style="margin:0 0 10px;text-align:center;font-size:20px;">${name}</h2>
      <p style="text-align:justify;line-height:1.5">${description}</p>
      <div style="text-align:center;margin-top:15px;">
        <button id="backButton" style="padding:6px 12px;background:#000;border:1px solid #fff;border-radius:6px;color:#fff;cursor:pointer;font-family:Orbitron">🔙 Back to Solar View</button>
      </div>`;
    document.getElementById('backButton').onclick = () => {
      zoomedIn = false;
      targetPlanet = null;
      camAngle = 0;
      cameraY = 0;
      infoBox.style.display = 'none';
    };
    infoBox.style.display = 'block';
  }
});

// New minimal addition to support touch tap on mobile devices:
window.addEventListener('touchstart', (event) => {
  if (zoomedIn) return;
  if (event.touches.length === 0) return;
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    targetPlanet = intersects[0].object;
    zoomedIn = true;
    const name = targetPlanet.userData.name;
    const description = planetDescriptions[name];
    infoBox.innerHTML = `
      <h2 style="margin:0 0 10px;text-align:center;font-size:20px;">${name}</h2>
      <p style="text-align:justify;line-height:1.5">${description}</p>
      <div style="text-align:center;margin-top:15px;">
        <button id="backButton" style="padding:6px 12px;background:#000;border:1px solid #fff;border-radius:6px;color:#fff;cursor:pointer;font-family:Orbitron">🔙 Back to Solar View</button>
      </div>`;
    document.getElementById('backButton').onclick = () => {
      zoomedIn = false;
      targetPlanet = null;
      camAngle = 0;
      cameraY = 0;
      infoBox.style.display = 'none';
    };
    infoBox.style.display = 'block';
  }
}, { passive: true });


// Play/Pause Button
let isPaused = false;
const pauseBtn = document.createElement('button');
pauseBtn.innerText = '⏸️ Pause';
pauseBtn.style.cssText = 'position:absolute;bottom:20px;right:20px;padding:8px 12px;font-size:14px;background:rgba(0,0,0,0.7);border:1px solid #fff;border-radius:6px;color:#fff;font-family:Orbitron,cursor:pointer;z-index:1001';
document.body.appendChild(pauseBtn);

pauseBtn.onclick = () => {
  isPaused = !isPaused;
  pauseBtn.innerText = isPaused ? '▶️ Resume' : '⏸️ Pause';
};

// === Dark/Light Mode Toggle ===
let isDarkMode = false;
const modeBtn = document.createElement('button');
modeBtn.innerText = '🌙 Dark Mode';
modeBtn.style.cssText = 'position:absolute;top:60px;left:20px;z-index:1001;padding:6px 10px;border-radius:8px;border:1px solid #fff;background:#000;color:#fff;cursor:pointer;font-family:Orbitron';

modeBtn.onclick = () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    scene.background = null;          // pure black background in scene
    document.body.style.backgroundColor = '#000';  // black page background
    modeBtn.innerText = '☀️ Light Mode';
  } else {
    scene.background = backgroundTextures.light;   // set light texture background
    document.body.style.backgroundColor = '#eee';  // light page background
    modeBtn.innerText = '🌙 Dark Mode';
  }
};

document.body.appendChild(modeBtn);


const clock = new THREE.Clock();
let camAngle = 0;
let cameraY = 0;
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Animate always if zoomedIn (ignore pause), else respect pause
  if (!isPaused || zoomedIn) {
    planets.forEach((planet) => {
      if (planet.userData.distance > 0) {
        planet.userData.angle += planet.userData.speed;
        const a = planet.userData.angle;
        const d = planet.userData.distance;
        planet.position.x = Math.cos(a) * d;
        planet.position.z = Math.sin(a) * d;
      }
      planet.rotation.y += 0.01;
    });
  }

  if (zoomedIn && targetPlanet) {
    let targetPos;
    if (targetPlanet.userData.name === 'Sun') {
      targetPos = new THREE.Vector3(0, 60, 100);
    } else {
      targetPos = new THREE.Vector3().copy(targetPlanet.position).add(new THREE.Vector3(0, 10, 50));
    }
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(targetPlanet.position);
  } else {
    camAngle += 0.0005;
    cameraY += 0.005;
    camera.position.x = Math.cos(camAngle) * 400 + Math.sin(cameraY) * 100;
    camera.position.y = Math.sin(cameraY) * 50;
    camera.position.z = Math.sin(camAngle) * 400 + Math.cos(cameraY) * 100;
    camera.lookAt(scene.position);
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
});


