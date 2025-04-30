// Mobile-friendly Snake Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 16;
const tileCount = 20;
let snake, direction, food, score, gameInterval, isGameOver, nextDirection;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: -1 };
  nextDirection = direction;
  food = randomFood();
  score = 0;
  isGameOver = false;
  scoreEl.textContent = 'Score: 0';
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}

function randomFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function gameLoop() {
  // Move
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return endGame();
  }
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    return endGame();
  }
  snake.unshift(head);
  // Food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = 'Score: ' + score;
    food = randomFood();
  } else {
    snake.pop();
  }
  draw();
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw snake
  ctx.fillStyle = '#4caf50';
  snake.forEach((s, i) => {
    ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2);
  });
  // Draw food
  ctx.fillStyle = '#ff5252';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  // Game over overlay
  if (isGameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
  }
}

function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  draw();
}

// Controls
window.addEventListener('keydown', e => {
  if (isGameOver) return;
  switch (e.key) {
    case 'ArrowUp': if (direction.y !== 1) nextDirection = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (direction.y !== -1) nextDirection = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (direction.x !== 1) nextDirection = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (direction.x !== -1) nextDirection = { x: 1, y: 0 }; break;
  }
});

// Touch controls for mobile
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});
canvas.addEventListener('touchmove', e => {
  if (isGameOver) return;
  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
    else if (dx < -20 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  } else {
    if (dy > 20 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
    else if (dy < -20 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  }
});

restartBtn.addEventListener('click', resetGame);

resetGame();
