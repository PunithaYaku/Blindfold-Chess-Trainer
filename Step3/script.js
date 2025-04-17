const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fileBtns = document.querySelectorAll(".fileBtn");
const rankBtns = document.querySelectorAll(".rankBtn");
const startSquareEl = document.getElementById("startSquare");
const targetSquareEl = document.getElementById("targetSquare");
const board = document.getElementById("board");

let selectedFile = null;
let selectedRank = null;
let inputPath = [];
let startSquare = null;
let targetSquare = null;
let squares = [];

function createBoard() {
  board.innerHTML = "";
  squares = [];

  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = document.createElement("div");
      const squareName = String.fromCharCode(97 + file) + rank;
      const isLight = (file + (8 - rank)) % 2 === 0;

      square.classList.add("square", isLight ? "light" : "dark");
      square.dataset.name = squareName;
      board.appendChild(square);
      squares.push(square);
    }
  }
}

function colorSquare(name, cssClass) {
  const square = squares.find(sq => sq.dataset.name === name);
  if (square) square.classList.add(cssClass);
}

function clearHighlights() {
  squares.forEach(sq => {
    sq.classList.remove("highlight", "path");
  });
}

function randomSquare() {
  const file = String.fromCharCode(97 + Math.floor(Math.random() * 8));
  const rank = 1 + Math.floor(Math.random() * 8);
  return file + rank;
}

function isKnightMove(from, to) {
  const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
  const dy = Math.abs(parseInt(from[1]) - parseInt(to[1]));
  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
}

function resetGame() {
  inputPath = [];
  selectedFile = null;
  selectedRank = null;
  startSquare = null;
  targetSquare = null;
  startSquareEl.textContent = "?";
  targetSquareEl.textContent = "?";
  clearHighlights();
  statusText.textContent = "Path cleared. Press Start to begin.";
}

function startGame() {
  clearHighlights();
  inputPath = [];
  selectedFile = null;
  selectedRank = null;

  startSquare = randomSquare();
  do {
    targetSquare = randomSquare();
  } while (targetSquare === startSquare);

  startSquareEl.textContent = startSquare;
  targetSquareEl.textContent = targetSquare;

  colorSquare(startSquare, "highlight");
  colorSquare(targetSquare, "highlight");

  statusText.textContent = "Input your path, one square at a time.";
}

function handleInput() {
  if (!selectedFile || !selectedRank) {
    statusText.textContent = "Please select both file and rank.";
    return;
  }

  const square = selectedFile + selectedRank;

  if (inputPath.length === 0) {
    if (square !== startSquare) {
      statusText.textContent = `First square must be ${startSquare}`;
      return;
    }
  } else {
    const prev = inputPath[inputPath.length - 1];
    if (!isKnightMove(prev, square)) {
      statusText.textContent = `❌ ${square} is not a valid knight move from ${prev}. Restarting.`;
      inputPath = [];
      clearHighlights();
      colorSquare(startSquare, "highlight");
      colorSquare(targetSquare, "highlight");
      return;
    }
  }

  inputPath.push(square);
  colorSquare(square, "path");

  selectedFile = null;
  selectedRank = null;

  if (square === targetSquare) {
    statusText.textContent = `✅ Success! Reached ${targetSquare} in ${inputPath.length} moves.`;
  } else if (inputPath.length >= 20) {
    statusText.textContent = `❌ Limit of 20 moves reached. Start over.`;
    inputPath = [];
    clearHighlights();
    colorSquare(startSquare, "highlight");
    colorSquare(targetSquare, "highlight");
  } else {
    statusText.textContent = `🧠 Current path: ${inputPath.join(" → ")}`;
  }
}

fileBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedFile = btn.dataset.file;
  });
});

rankBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedRank = btn.dataset.rank;
    handleInput();
  });
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

createBoard();
