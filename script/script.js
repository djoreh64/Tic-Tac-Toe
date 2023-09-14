'use strict';

const cells = document.querySelectorAll('.cell');
const background = document.querySelector('main');
const container = document.querySelector('.container');
const restartBtn = document.querySelector('.restart');
const counter = document.querySelector('.counter')
const cursorRed = document.querySelector('.cursor-red')
const cursorBlue = document.querySelector('.cursor-blue')
let popup = ''
let redPoints = 0;
let bluePoints = 0;
let redPointsCounter = document.querySelector('.red_points')
let bluePointsCounter = document.querySelector('.blue_points')
let firstPlayer = true;
const clickAudio = document.querySelector('.click_audio')
const restartAudio = document.querySelector('.restart_audio')
const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

cursorRed.style.cssText = 'animation: cursorRedShake 1s infinite alternate'
cursorBlue.style.cssText = 'animation: cursorBlueShake 1s infinite alternate'

document.addEventListener('mousemove', (e) => {
    let x = e.clientX
    let y = e.clientY
    cursorRed.animate({
        top: `${y}px`,
        left: `${x}px`
    }, {duration: 1000, fill: 'forwards'}
    )
    cursorBlue.animate({
        top: `${y}px`,
        left: `${x}px`
    }, {duration: 1000, fill: 'forwards'})
})

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!cell.innerHTML) {
            clickAudio.play()
            backgroundChange();
            if (firstPlayer) {
                cell.innerHTML = '<span class=\'cell_text\'>Х</span>';
                checkWin('Х');
                firstPlayer = false;
            } else  {
                cell.innerHTML = '<span class=\'cell_text\'>O</span>';
                checkWin('O');
                firstPlayer = true;
            }
            if (isBoardFull() && !checkWin('Х') && !checkWin('O')) {
                showPopup('Ничья!');
                setTimeout(restart, 2000)
            }
        }
    });
});

function backgroundChange() {
    cursorRed.classList.toggle('hide')
    cursorBlue.classList.toggle('hide')
    counter.classList.toggle('zero_theme_counter')
    background.classList.toggle('zero_theme');
    container.classList.toggle('zero_theme');
    restartBtn.classList.toggle('zero_theme_btn');
    cells.forEach(cell => {
        cell.classList.toggle('zero_theme_cells');
    });
}

restartBtn.addEventListener('click', () => {
    if(isBoardNotEmpty()) {
        redPoints = 0
        redPointsCounter.innerText = `${redPoints}`
        bluePoints = 0
        bluePointsCounter.innerText = `${bluePoints}`
        restart();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR') {
        restart();
        redPoints = 0
        redPointsCounter.innerText = `${redPoints}`
        bluePoints = 0
        bluePointsCounter.innerText = `${bluePoints}`
    }
});

function animateText () {
    let cellText = document.querySelectorAll('.cell_text')
    cellText.forEach(text => {
        text.style.cssText = 'transform: translateY(200px); animation: cellTextOut 1s'
        setTimeout(() => {text.remove()}, 1000)
    }) 
    cells.forEach(cell => {
        cell.classList.remove('zero_theme_cells')
    });
}

function isBoardFull() {
    return Array.from(cells).every(cell => cell.innerHTML !== '');
}

function isBoardNotEmpty() {
    return Array.from(cells).some(cell => cell.innerHTML !== '');
}

function restart() {
    restartAudio.play()
    cells.forEach(cell => {
        setTimeout(() => {cell.style.cssText = 'pointer-events: all'}, 1000)
    })
    cursorBlue.classList.add('hide')
    cursorRed.classList.remove('hide')
    firstPlayer = true;
    counter.classList.remove('zero_theme_counter')
    background.classList.remove('zero_theme');
    container.classList.remove('zero_theme');
    restartBtn.classList.remove('zero_theme_btn');
    animateText()
}


function checkWin(p) {
    const isWin = winCombinations.some(combination => {
        return combination.every(i => {
            return cells[i].innerHTML.includes(p);
        });
    });

    if (isWin) {
        setTimeout(restart, 2000);
        cells.forEach(cell => {
            cell.style.cssText = 'pointer-events: none'
        })
        popup = document.createElement('div');
        popup.classList.add('popup');
        background.appendChild(popup);
        setTimeout(() => {
            popup.remove();
        }, 4000);
        
        if (p === 'Х') {
            redPoints++;
            redPointsCounter.innerText = `${redPoints}`;
            popup.innerText = 'Победили крестики!';
        } else {
            bluePoints++;
            bluePointsCounter.innerText = `${bluePoints}`;
            popup.innerText = 'Победили нолики!';
        }
        return true;
    }
    return false;
}

function showPopup(text) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerText = text;
    background.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 4000);
}