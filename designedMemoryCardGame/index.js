const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const difficultySelect = document.getElementById('difficulty');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');

let cards = [];
let flippedCards = [];
let moves = 0;
let time = 0;
let timer;
let gameStarted = false;

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'];

const difficulties = {
    easy: { gridSize: 4, cardCount: 16 },
    medium: { gridSize: 6, cardCount: 36 },
    hard: { gridSize: 8, cardCount: 64 }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(emoji) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${emoji}</div>
        </div>
    `;
    card.addEventListener('click', flipCard);
    return card;
}

function initializeGame() {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    moves = 0;
    time = 0;
    gameStarted = false;
    clearInterval(timer);
    movesDisplay.textContent = moves;
    timeDisplay.textContent = time;

    const { gridSize, cardCount } = difficulties[difficultySelect.value];
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Adjust card size based on difficulty
    const cardSize = gridSize === 8 ? '60px' : (gridSize === 6 ? '70px' : '80px');
    document.documentElement.style.setProperty('--card-size', cardSize);

    const gameEmojis = emojis.slice(0, cardCount / 2);
    const shuffledEmojis = shuffleArray([...gameEmojis, ...gameEmojis]);

    shuffledEmojis.forEach(emoji => {
        const card = createCard(emoji);
        cards.push(card);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const emoji1 = card1.querySelector('.card-back').textContent;
    const emoji2 = card2.querySelector('.card-back').textContent;

    if (emoji1 === emoji2) {
        flippedCards = [];
        checkForWin();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function checkForWin() {
    if (cards.every(card => card.classList.contains('flipped'))) {
        clearInterval(timer);
        setTimeout(() => {
            alert(`Congratulations! You won in ${moves} moves and ${time} seconds!`);
        }, 500);
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);
}

resetButton.addEventListener('click', initializeGame);
difficultySelect.addEventListener('change', initializeGame);

initializeGame();