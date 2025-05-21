// Obtener referencias a los elementos del DOM
const startBtn = document.getElementById('start-btn');
const repeatBtn = document.getElementById('repeat-btn');
const muteBtn = document.getElementById('mute-btn');
const restartBtn = document.getElementById('restart-btn');
const modal = document.getElementById('game-over-modal');
const levelDisplay = document.getElementById('level');
const bgMusic = document.getElementById('bg-music');
const failSound = document.getElementById('fail-sound');
const restartSound = document.getElementById('restart-sound');

// Obtener referencias a los botones de colores
const colorButtons = {
  red: document.getElementById('red'),
  green: document.getElementById('green'),
  blue: document.getElementById('blue'),
  yellow: document.getElementById('yellow'),
};

// Obtener referencias a los sonidos de clic de cada color
const colorSounds = {
  red: document.getElementById('click-red'),
  green: document.getElementById('click-green'),
  blue: document.getElementById('click-blue'),
  yellow: document.getElementById('click-yellow'),
};

// Variables del estado del juego
let sequence = [];          // Secuencia generada por el sistema
let playerSequence = [];    // Secuencia que el jugador repite
let level = 0;              // Nivel actual
let allowInput = false;     // Controla si el jugador puede hacer clic
let repeatsLeft = 3;        // Repeticiones disponibles del patrón
let isMuted = false;        // Estado del sonido (activado o silenciado)

// Función para iniciar el juego
function startGame() {
  sequence = [];
  level = 0;
  repeatsLeft = 3;
  repeatBtn.innerText = `Repetir Patrón (${repeatsLeft})`;
  repeatBtn.disabled = false;
  startBtn.style.display = 'none'; // Ocultar botón de inicio

  bgMusic.currentTime = 0;
  if (!isMuted) {
    bgMusic.volume = 0.2;
    bgMusic.play();
  }

  nextLevel(); // Inicia el primer nivel
}

// Función que avanza al siguiente nivel
function nextLevel() {
  level++;
  levelDisplay.innerText = `Nivel: ${level}`;
  playerSequence = [];
  sequence.push(randomColor()); // Añade nuevo color aleatorio
  allowInput = false;
  showSequence(); // Muestra secuencia al jugador
}

// Devuelve un color aleatorio
function randomColor() {
  const colors = Object.keys(colorButtons);
  return colors[Math.floor(Math.random() * colors.length)];
}

// Muestra la secuencia visual y sonora al jugador
function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = sequence[i];
    flashColor(color); // Ilumina el botón
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      allowInput = true; // Permitir que el jugador empiece a responder
    }
  }, 800);
}

// Ilumina temporalmente el botón y reproduce sonido
function flashColor(color) {
  const el = colorButtons[color];
  el.style.opacity = 1;
  if (!isMuted) colorSounds[color].play();
  setTimeout(() => {
    el.style.opacity = 0.8;
  }, 400);
}

// Maneja los clics del jugador sobre los colores
function handleColorClick(color) {
  if (!allowInput) return;

  playerSequence.push(color);
  flashColor(color);

  const index = playerSequence.length - 1;
  if (playerSequence[index] !== sequence[index]) {
    gameOver(); // Error: finaliza el juego
    return;
  }

  if (playerSequence.length === sequence.length) {
    allowInput = false;
    setTimeout(nextLevel, 1000); // Espera y pasa al siguiente nivel
  }
}

// Termina el juego y muestra el modal de Game Over
function gameOver() {
  allowInput = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;

  if (!isMuted) failSound.play();
  modal.classList.remove('hidden');
}

// Reproduce la secuencia otra vez si quedan repeticiones
function repeatPattern() {
  if (repeatsLeft > 0) {
    repeatsLeft--;
    repeatBtn.innerText = `Repetir Patrón (${repeatsLeft})`;
    showSequence();
    if (repeatsLeft === 0) repeatBtn.disabled = true;
  }
}

// Alternar sonido de fondo (activar/desactivar)
function toggleMute() {
  isMuted = !isMuted;

  if (isMuted) {
    muteBtn.innerText = '🔇 Silenciado';
    bgMusic.pause();
  } else {
    muteBtn.innerText = '🔊 Música';
    bgMusic.play();
  }
}

// Reinicia el juego desde el modal
function restartGame() {
  if (!isMuted) restartSound.play();
  modal.classList.add('hidden');
  startBtn.style.display = 'inline-block';
}

// Cambia el tema visual (oscuro/neón)
const themeSelect = document.getElementById('theme-select');
themeSelect.addEventListener('change', () => {
  const selectedTheme = themeSelect.value;
  document.body.className = `theme-${selectedTheme}`;
});

// Asignación de eventos a botones del juego
startBtn.addEventListener('click', startGame);
repeatBtn.addEventListener('click', repeatPattern);
muteBtn.addEventListener('click', toggleMute);
restartBtn.addEventListener('click', restartGame);

// Asignar eventos de clic a cada botón de color
Object.keys(colorButtons).forEach(color => {
  colorButtons[color].addEventListener('click', () => handleColorClick(color));
});

// Elementos para el video secreto
const secretVideoBtn = document.getElementById('secret-video-btn');
const videoModal = document.getElementById('video-modal');
const secretVideo = document.getElementById('secret-video');
const closeVideoBtn = document.getElementById('close-video-btn');

// Mostrar el video secreto al hacer clic
secretVideoBtn.addEventListener('click', () => {
  videoModal.classList.remove('hidden');
  secretVideo.play();
});

// Ocultar el video al cerrar
closeVideoBtn.addEventListener('click', () => {
  secretVideo.pause();
  secretVideo.currentTime = 0;
  videoModal.classList.add('hidden');
});

// Elementos del gato secreto (easter egg)
const catImage = document.getElementById('cat-image');
const catAudio = document.getElementById('cat-audio');

// Muestra el gato animado y reproduce su audio
catImage.addEventListener('click', () => {
  if (catImage.classList.contains('active')) return;
  catImage.classList.add('active');
  catAudio.play();
});

// Oculta el gato cuando termina el audio
catAudio.addEventListener('ended', () => {
  catImage.classList.remove('active');
});