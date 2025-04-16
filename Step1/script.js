const board = document.getElementById('board');
const statusText = document.getElementById('status');
const scoreText = document.getElementById('score');
const colorButtons = document.querySelectorAll('.colorBtn');
const letterButtons = document.querySelectorAll('.fileBtn');
const numberButtons = document.querySelectorAll('.rankBtn');
const startBtn = document.getElementById('startBtn');

let squares = [];
let highlighted = null;
let hidden = false;
let score = 0;
let selectedFile = null;
let selectedRank = null;

// Create board
function createBoard() {
  board.innerHTML = '';
  squares = [];

  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = document.createElement('div');
      const squareName = String.fromCharCode(97 + file) + rank;
      const isLight = (file + rank) % 2 === 0;

      square.classList.add('square');
      square.classList.add(isLight ? 'light' : 'dark');
      square.dataset.name = squareName;

      board.appendChild(square);
      squares.push(square);
    }
  }
}

// Start test
function startTest() {
  hidden = true;
  selectedFile = null;
  selectedRank = null;
  for (const sq of squares) {
    sq.classList.add('hidden');
    sq.classList.remove('highlight');
  }
  nextHighlight();
}

// Highlight a square
function nextHighlight() {
  highlighted = squares[Math.floor(Math.random() * squares.length)];
  highlighted.classList.add('highlight');
}

// Validate input
function checkAnswer(color) {
  if (!selectedFile || !selectedRank) {
    statusText.textContent = "❗ Please select a file and rank.";
    return;
  }

  const selectedSquareName = selectedFile + selectedRank;
  const highlightedName = highlighted.dataset.name;

  const file = selectedSquareName.charCodeAt(0) - 97;
  const rank = parseInt(selectedSquareName[1]) - 1;
  const isLight = (file + rank) % 2 === 0;
  const expectedColor = isLight ? 'light' : 'dark';

  if (selectedSquareName === highlightedName && color === expectedColor) {
    score++;
    scoreText.textContent = score;
    selectedFile = null;
    selectedRank = null;
    highlighted.classList.remove('highlight');
    statusText.textContent = "✅ Correct!";
    nextHighlight();
  } else {
    const expectedSquare = highlighted.dataset.name;
    statusText.textContent = `❌ Wrong! ${expectedSquare} was a ${expectedColor} square. Showing board...`;
    hidden = false;
    selectedFile = null;
    selectedRank = null;
    for (const sq of squares) {
      sq.classList.remove('hidden');
      sq.classList.remove('highlight');
    }
    setTimeout(() => {
      startTest();
      statusText.textContent = '';
    }, 2000);
  }
}

// Event Listeners
startBtn.addEventListener('click', startTest);

letterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedFile = btn.dataset.file;
    statusText.textContent = `Selected: ${selectedFile || ""}${selectedRank || ""}`;
  });
});

numberButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRank = btn.dataset.rank;
    statusText.textContent = `Selected: ${selectedFile || ""}${selectedRank || ""}`;
  });
});

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (highlighted && hidden) {
      checkAnswer(btn.dataset.color);
    }
  });
});

createBoard();
