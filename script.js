const colors = ["red", "green", "blue", "yellow"];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let canClick = false;

// Inicia un nuevo juego
function startGame() {
  gameSequence = [];
  playerSequence = [];
  level = 0;
  nextRound();
}

// Avanza al siguiente nivel
function nextRound() {
  level++;
  document.getElementById("level").textContent = "Nivel: " + level;

  const randomColor = colors[Math.floor(Math.random() * 4)];
  gameSequence.push(randomColor);
  playerSequence = [];
  canClick = false;
  showSequence();
}

// Muestra la secuencia del juego, un color a la vez
function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = gameSequence[i];
    flashColor(color);
    i++;
    if (i >= gameSequence.length) {
      clearInterval(interval);
      setTimeout(() => {
        canClick = true; // Habilita clics después de mostrar
      }, 300);
    }
  }, 800); // Más lento y claro
}

// Activa visualmente un color con animación
function flashColor(color) {
  const btn = document.getElementById(color);
  btn.classList.add("active");

  // Quita la clase después de 500ms para que dure más
  setTimeout(() => {
    btn.classList.remove("active");
  }, 500);
}

// Detecta el clic del jugador
function playerClick(color) {
  if (!canClick) return;

  playerSequence.push(color);
  flashColor(color);

  const index = playerSequence.length - 1;

  if (playerSequence[index] !== gameSequence[index]) {
    alert("¡Fallaste! Juego terminado. Alcanzaste el nivel " + level);
    canClick = false;
    return;
  }

  if (playerSequence.length === gameSequence.length) {
    canClick = false;
    setTimeout(() => nextRound(), 1000);
  }
}
