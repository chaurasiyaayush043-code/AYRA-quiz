const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const gridSize = 60;
let scanY = 0;
let lightningBolts = [];
let flashes = [];

// Particle Class (Background stars/particles)
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = Math.random();
    this.size = Math.random() * 3 + 1;
    this.speed = 0.02 + Math.random() * 0.03;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1) this.alpha = 0;
  }
  draw() {
    ctx.fillStyle = `rgba(0, 243, 255, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Lightning Class
class Lightning {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.segments = [];
    this.alpha = 1;
    this.createBolt();
  }

  createBolt() {
    let x = this.x;
    let y = this.y;
    this.segments.push({ x, y });

    while (y < canvas.height && this.segments.length < 20) {
      x += (Math.random() - 0.5) * 100; 
      y += Math.random() * 80 + 40; 
      this.segments.push({ x, y });
    }
  }

  update() {
    this.alpha -= 0.03;
    return this.alpha > 0;
  }

  draw() {
    ctx.strokeStyle = `rgba(0, 243, 255, ${this.alpha})`;
    ctx.shadowColor = "#00f3ff";
    ctx.shadowBlur = 25;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.segments[0].x, this.segments[0].y);
    for (let i = 1; i < this.segments.length; i++) {
      ctx.lineTo(this.segments[i].x, this.segments[i].y);
    }
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Sparks around strike
    for (let i = 0; i < 5; i++) {
      let sparkX = this.segments[this.segments.length - 1].x + (Math.random() - 0.5) * 50;
      let sparkY = this.segments[this.segments.length - 1].y + (Math.random() - 0.5) * 50;
      ctx.fillStyle = `rgba(0, 243, 255, ${Math.random()})`;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Flash Effect
class Flash {
  constructor() {
    this.alpha = 0.6;
  }
  update() {
    this.alpha -= 0.05;
    return this.alpha > 0;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Init Particles
for (let i = 0; i < 80; i++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  particles.push(new Particle(x, y));
}

// Draw Everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = "rgba(0, 243, 255, 0.15)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Scanner Line
  ctx.fillStyle = "rgba(0, 243, 255, 0.15)";
  ctx.fillRect(0, scanY, canvas.width, 8);
  scanY += 2;
  if (scanY > canvas.height) scanY = 0;

  // Background particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Lightning bolts
  lightningBolts = lightningBolts.filter(bolt => {
    bolt.draw();
    return bolt.update();
  });

  // Flashes
  flashes = flashes.filter(f => {
    f.draw();
    return f.update();
  });

  requestAnimationFrame(draw);
}
draw();

// Random Lightning Spawner
setInterval(() => {
  if (Math.random() < 0.7) { // high chance
    let strikes = Math.floor(Math.random() * 3) + 1; // 1-3 strikes
    for (let i = 0; i < strikes; i++) {
      let x = Math.random() * canvas.width;
      lightningBolts.push(new Lightning(x));
    }
    flashes.push(new Flash());
  }
}, 1500);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
