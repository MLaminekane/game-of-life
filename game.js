const gridSize = 20;
const birthThreshold = 3;
const survivalMinThreshold = 2;
const survivalMaxThreshold = 3;

let grid = createRandomGrid(gridSize);
let running = false;
let updateInterval;

document.addEventListener('DOMContentLoaded', function () {
  const gridContainer = document.getElementById('grid');
  const startButton = document.getElementById('startButton');
  const pauseButton = document.getElementById('pauseButton');
  const resetButton = document.getElementById('resetButton');

  initializeGrid(gridContainer);

  startButton.addEventListener('click', toggleGame);
  pauseButton.addEventListener('click', toggleGame);
  resetButton.addEventListener('click', resetGame);
});

function initializeGrid(gridContainer) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.addEventListener('click', toggleCell);
      gridContainer.appendChild(cell);
    }
  }
  updateGridDisplay();
}

function toggleCell() {
  const index = Array.from(this.parentNode.children).indexOf(this);
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  grid[row][col] = !grid[row][col];
  updateGridDisplay();
}

function updateGridDisplay() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    cell.classList.toggle('active', grid[row][col]);
  });
}

function toggleGame() {
  running = !running;
  if (running) {
    updateInterval = setInterval(updateGame, 500);
  } else {
    clearInterval(updateInterval);
  }
}

function updateGame() {
  const newGrid = createEmptyGrid(gridSize);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const neighbors = countNeighbors(i, j);
      const isCellAlive = grid[i][j];

      if (isCellAlive) {
        newGrid[i][j] = neighbors >= survivalMinThreshold && neighbors <= survivalMaxThreshold;
      } else {
        newGrid[i][j] = neighbors === birthThreshold;
      }
    }
  }

  grid = newGrid;
  updateGridDisplay();
}

function countNeighbors(row, col) {
  const neighborsOffsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  return neighborsOffsets.reduce((acc, [offsetRow, offsetCol]) => {
    const newRow = row + offsetRow;
    const newCol = col + offsetCol;

    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
      acc += grid[newRow][newCol] ? 1 : 0;
    }

    return acc;
  }, 0);
}

function createRandomGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() < 0.2)
  );
}

function createEmptyGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );
}

function resetGame() {
  grid = createRandomGrid(gridSize);
  updateGridDisplay();
  if (running) {
    toggleGame();
  }
}

function pauseGame() {
  if (running) {
    running = false;
    clearInterval(updateInterval);
  }
}

function startGame() {
  if (!running) {
    running = true;
    updateInterval = setInterval(updateGame, 500);
  }
}