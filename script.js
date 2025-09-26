const gameArea = document.getElementById('game');
const pickle = document.getElementById('pickle');
const scoreEl = document.getElementById('score');
const multiplierEl = document.getElementById('multiplier');

let score = 0;
let multiplier = 1;
let pickleY = 20;
let holding = false;
let objects = [];
let lastMilestone = 0;
let gameRunning = false;

const milestones = [1000, 10000, 50000, 100000]; 

// Start game from intro screen
document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('intro-screen').style.display = 'none';
  gameRunning = true;
  gameLoop();
});

// Input handling
document.addEventListener('keydown', e => {
  if (e.code === 'Space') holding = true;
});
document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    holding = false;
    if (gameRunning) {
      showEndScore(score);
      resetGame();
    }
  }
});

function resetGame() {
  score = 0;
  pickleY = 20;
  multiplier = 1;
  lastMilestone = 0;
  multiplierEl.textContent = multiplier;
  pickle.style.bottom = pickleY + 'px';
  objects.forEach(obj => obj.remove());
  objects = [];
}

function spawnCloud() {
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  cloud.style.width = 80 + Math.random()*70 + 'px';
  cloud.style.height = 50 + Math.random()*30 + 'px';
  cloud.style.top = Math.random() * (gameArea.clientHeight - 100) + 'px';
  cloud.style.left = gameArea.clientWidth + 'px';
  cloud.dataset.speed = 1;
  gameArea.appendChild(cloud);
  objects.push(cloud);
}

function spawnRainbow() {
  if (Math.random() < 0.002) {
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow';
    rainbow.style.top = Math.random() * (gameArea.clientHeight - 150) + 'px';
    rainbow.style.left = gameArea.clientWidth + 'px';
    rainbow.dataset.speed = 1; // same as clouds
    gameArea.appendChild(rainbow);
    objects.push(rainbow);
  }
}

function spawnParticles(x, y) {
  for (let i=0; i<20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
    gameArea.appendChild(p);
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 4 + 2;
    let dx = Math.cos(angle) * speed;
    let dy = Math.sin(angle) * speed;
    let life = 30;
    function animate() {
      if (life-- > 0) {
        p.style.left = (parseFloat(p.style.left) + dx) + 'px';
        p.style.top = (parseFloat(p.style.top) + dy) + 'px';
        requestAnimationFrame(animate);
      } else p.remove();
    }
    animate();
  }
}

function showMultiplierPopup(mult) {
  const popup = document.createElement('div');
  popup.className = 'multiplier-popup';
  popup.textContent = `Multiplier ${mult}x!`;
  gameArea.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

function showEndScore(score) {
  const popup = document.createElement('div');
  popup.className = 'multiplier-popup';
  popup.textContent = `Your Score: ${score}`;
  popup.style.top = '250px';
  popup.style.fontSize = '2em';
  gameArea.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

function checkMilestones() {
  for (let i=0; i<milestones.length; i++) {
    if (score >= milestones[i] && lastMilestone < milestones[i]) {
      multiplier++;
      lastMilestone = milestones[i];
      multiplierEl.textContent = multiplier;
      spawnParticles(275, gameArea.clientHeight/2);
      showMultiplierPopup(multiplier);
    }
  }
  if (score >= lastMilestone + 100000) {
    multiplier++;
    lastMilestone = score;
    multiplierEl.textContent = multiplier;
    spawnParticles(275, gameArea.clientHeight/2);
    showMultiplierPopup(multiplier);
  }
}

function gameLoop() {
  if (gameRunning) {
    if (holding) {
      pickleY += 2;
      score += 1 * multiplier;
      scoreEl.textContent = score;
      checkMilestones();
    }
    pickle.style.bottom = pickleY + 'px';
    gameArea.style.backgroundPositionY = -pickleY/5 + 'px';

    objects.forEach((obj, idx) => {
      obj.style.left = (parseFloat(obj.style.left) - obj.dataset.speed) + 'px';
      if (parseFloat(obj.style.left) < -200) {
        obj.remove();
        objects.splice(idx,1);
      }
    });

    if (Math.random() < 0.01) spawnCloud();
    spawnRainbow();
  }
  requestAnimationFrame(gameLoop);
}
