const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fileBtns = document.querySelectorAll(".fileBtn");
const rankBtns = document.querySelectorAll(".rankBtn");
const startSquareEl = document.getElementById("startSquare");
const targetSquareEl = document.getElementById("targetSquare");

let selectedFile = null;
let selectedRank = null;
let inputPath = [];
let startSquare = null;
let targetSquare = null;

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
  statusText.textContent = "Reset. Press Start to begin.";
}

function startGame() {
  inputPath = [];
  selectedFile = null;
  selectedRank = null;

  startSquare = randomSquare();
  do {
    targetSquare = randomSquare();
  } while (targetSquare === startSquare);

  startSquareEl.textContent = startSquare;
  targetSquareEl.textContent = targetSquare;
  statusText.textContent = "Begin your knight path.";
}

function handleInput() {
  if (!selectedFile || !selectedRank) {
    statusText.textContent = "Please select both file and rank.";
    return;
  }

  const square = selectedFile + selectedRank;

  if (inputPath.length === 0) {
    if (square !== startSquare) {
      statusText.textContent = `❗ First square must be ${startSquare}`;
      return;
    }
  } else {
    const prev = inputPath[inputPath.length - 1];
    if (!isKnightMove(prev, square)) {
      statusText.textContent = `❌ ${square} is not a valid knight move from ${prev}. Restarting path.`;
      inputPath = [];
      return;
    }
  }

  inputPath.push(square);
  selectedFile = null;
  selectedRank = null;

  if (square === targetSquare) {
    statusText.textContent = `✅ Reached ${targetSquare} in ${inputPath.length} moves!`;
  } else if (inputPath.length >= 20) {
    statusText.textContent = `❌ Limit of 20 moves reached. Try again.`;
    inputPath = [];
  } else {
    statusText.textContent = `🧠 Path so far: ${inputPath.join(" → ")}`;
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
