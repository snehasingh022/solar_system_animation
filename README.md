# solar_system_animation

This is a 3D interactive Solar System built using **Three.js**, HTML, CSS, and JavaScript. It simulates the Sun and planets with realistic textures, orbits, and lighting. The project includes a starry background, controls for adjusting orbital speeds, pause/resume functionality, light/dark modes, and an immersive zoom-on-click feature for exploring planets up close.

---

## Live Demo

Explore the live 3D Solar System visualization hosted on Vercel here:

👉 [View the Solar System App on Vercel]([https://your-vercel-app-url.vercel.app](https://solar-system-animation-olive.vercel.app/))

---

## Features

- Realistic textured planets orbiting the sun  
- Saturn’s transparent and detailed ring system  
- Immersive starfield background for space feel  
- Speed control sliders to adjust each planet’s orbit speed in real-time  
- Pause and resume orbital animations  
- Light and dark mode toggle for different visual themes  
- Responsive canvas adjusting to window resizing  
- Mouse orbit controls for rotating and zooming the camera manually  
- **Zoom in on planets by clicking:** Click a planet to smoothly zoom the camera closer and focus on it  
- “Back to Solar View” button to smoothly return to the full system view after zooming in  

---

## Project Structure

- `index.html` — Main HTML file containing the canvas element and UI containers  
- `style.css` — CSS styles for layout, sliders, buttons, and fonts  
- `script.js` — Main JavaScript file initializing Three.js scene, creating planets and orbits, handling animations and user interactions  
- `textures/` — Folder with all texture images for planets, sun, rings, and background  

---

## Getting Started

### Prerequisites

To run this project locally, you need a local HTTP server because Three.js textures cannot be loaded via `file://` protocol due to browser security restrictions.

You can use:

- [VSCode Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)  
- Python built-in HTTP server:

  ```bash
  python -m http.server 8000
