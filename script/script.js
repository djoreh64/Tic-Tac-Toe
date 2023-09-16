'use strict';

const cells = document.querySelectorAll('.cell');
const background = document.querySelector('main');
const container = document.querySelector('.container');
const restartBtn = document.querySelector('.restart');
const counter = document.querySelector('.counter');
const cursorRed = document.querySelector('.cursor-red');
const cursorBlue = document.querySelector('.cursor-blue');
let popup;
let firstPlayer = true;
let redPoints = 0;
let bluePoints = 0;
let redPointsCounter = document.querySelector('.red_points');
let bluePointsCounter = document.querySelector('.blue_points');
const clickAudio = document.querySelector('.click_audio');
const restartAudio = document.querySelector('.restart_audio');
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

document.addEventListener('mousemove', (e) => {
  let x = e.clientX;
  let y = e.clientY;
  cursorRed.animate(
    {
      top: `${y}px`,
      left: `${x}px`,
    },
    { duration: 1000, fill: 'forwards' }
  );
  cursorBlue.animate(
    {
      top: `${y}px`,
      left: `${x}px`,
    },
    { duration: 1000, fill: 'forwards' }
  );
});

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    if (!cell.innerHTML) {
      clickAudioPlay();
      themeChange();
      if (firstPlayer) {
        cell.innerHTML = '<span class=\'cell_text\'>Х</span>';
        if (checkWin('Х')) {
          showPopup('Победили крестики!');
          setTimeout(restartAudioPlay, 1000);
          setTimeout(resetBoard, 2000);
          redPoints += 1;
          updateRedPoints();
        } else if (isBoardFull()) {
          showPopup('Ничья!');
          setTimeout(restartAudioPlay, 1000);
          setTimeout(resetBoard, 2000);
        }
        firstPlayer = false;
      } else {
        cell.innerHTML = '<span class=\'cell_text\'>O</span>';
        if (checkWin('O')) {
          showPopup('Победили нолики!');
          setTimeout(restartAudioPlay, 1000);
          setTimeout(resetBoard, 2000);
          bluePoints += 1;
          updateBluePoints();
        } else if (isBoardFull()) {
          showPopup('Ничья!');
          setTimeout(restartAudioPlay, 1000);
          setTimeout(resetBoard, 2000);
        }
        firstPlayer = true;
      }
    }
  });
});

function themeChange() {
  cursorRed.classList.toggle('hide');
  cursorBlue.classList.toggle('hide');
  counter.classList.toggle('zero_theme_counter');
  background.classList.toggle('zero_theme');
  container.classList.toggle('zero_theme');
  restartBtn.classList.toggle('zero_theme_btn');
  cells.forEach((cell) => {
    cell.classList.toggle('zero_theme_cells');
  });
}

function restartAudioPlay() {
  if (redPoints !== 0 || bluePoints !== 0) {
    restartAudio.play();
    restartAudio.currentTime = 0;
  }
}

function clickAudioPlay() {
  clickAudio.play();
  clickAudio.currentTime = 0;
}

restartBtn.addEventListener('click', () => {
  restartAudioPlay();
  redPoints = 0;
  redPointsCounter.innerText = `${redPoints}`;
  bluePoints = 0;
  bluePointsCounter.innerText = `${bluePoints}`;
  resetBoard();
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyR') {
    resetBoard();
    restartAudioPlay();
    redPoints = 0;
    redPointsCounter.innerText = `${redPoints}`;
    bluePoints = 0;
    bluePointsCounter.innerText = `${bluePoints}`;
  }
});

function animateText() {
  const cellText = document.querySelectorAll('.cell_text');
  cellText.forEach((text) => {
    text.style.cssText = 'transform: translateY(200px); animation: cellTextOut 1s';
    setTimeout(() => {
      text.remove();
    }, 1000);
  });
  cells.forEach((cell) => {
    cell.classList.remove('zero_theme_cells');
  });
}

function isBoardFull() {
  return Array.from(cells).every((cell) => cell.innerHTML !== '');
}

function resetBoard() {
  cells.forEach((cell) => {
    setTimeout(() => {
      cell.style.cssText = 'pointer-events: all';
    }, 1000);
  });
  cursorBlue.classList.add('hide');
  cursorRed.classList.remove('hide');
  firstPlayer = true;
  counter.classList.remove('zero_theme_counter');
  background.classList.remove('zero_theme');
  container.classList.remove('zero_theme');
  restartBtn.classList.remove('zero_theme_btn');
  animateText();
}

function checkWin(p) {
  const isWin = winCombinations.some((combination) => {
    return combination.every((i) => {
      return cells[i].innerHTML.includes(p);
    });
  });

  if (isWin) {
    cells.forEach((cell) => {
      cell.style.cssText = 'pointer-events: none';
    });
    return true;
  }
  return false;
}

function showPopup(text) {
  if (!popup) {
    popup = document.createElement('div');
    popup.innerText = text;
    popup.classList.add('popup');
    background.appendChild(popup);
    setTimeout(() => {
      popup.remove();
      popup = '';
    }, 4000);
  }
}

function updateRedPoints() {
  redPointsCounter.innerText = `${redPoints}`;
}

function updateBluePoints() {
  bluePointsCounter.innerText = `${bluePoints}`;
}