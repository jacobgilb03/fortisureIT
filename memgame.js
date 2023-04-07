const boardContainerEl = document.querySelector('.board-container');
const boardEl = document.querySelector('.board');
const movesEl = document.querySelector('.moves');
const timerEl = document.querySelector('.timer');
const startBtnEl = document.querySelector('button');
const winEl = document.querySelector('.win');

const gameState = {
  gameStarted: false,
  flippedCards: 0,
  totalFlips: 0,
  totalTime: 0,
  loop: null,
};

const shuffle = array => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }
  return shuffledArray;
};

const pickRandom = (array, num) => {
  const randomPicks = [];
  const clonedArray = array.slice();
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    randomPicks.push(clonedArray.splice(randomIndex, 1)[0]);
  }
  return randomPicks;
};

const generateGame = () => {
  const boardDimension = boardEl.getAttribute('data-dimension');
  if (boardDimension % 2 !== 0) {
    throw new Error("The dimension of the board must be an even number.")
  }
  const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];
  const picks = pickRandom(emojis, (boardDimension * boardDimension) / 2);
  const items = shuffle([...picks, ...picks]);
  const cardElements = items.map(item => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    const cardFrontEl = document.createElement('div');
    cardFrontEl.className = 'card-front';
    const cardBackEl = document.createElement('div');
    cardBackEl.className = 'card-back';
    cardBackEl.innerText = item;
    cardEl.appendChild(cardFrontEl);
    cardEl.appendChild(cardBackEl);
    return cardEl;
  });
  boardEl.innerHTML = '';
  cardElements.forEach(cardEl => boardEl.appendChild(cardEl));
};

const startGame = () => {
  gameState.gameStarted = true;
  startBtnEl.classList.add('disabled');
  gameState.loop = setInterval(() => {
    gameState.totalTime++;
    movesEl.innerText = `${gameState.totalFlips} moves`;
    timerEl.innerText = `time: ${gameState.totalTime} sec`;
  }, 1000);
};

const flipBackCards = () => {
  document.querySelectorAll('.card:not(.matched)').forEach(cardEl => {
    cardEl.classList.remove('flipped');
  });
  gameState.flippedCards = 0;
};

const flipCard = cardEl => {
  gameState.flippedCards++;
  gameState.totalFlips++;

  if (!gameState.gameStarted) {
    startGame();
  }

  if (gameState.flippedCards <= 2) {
    cardEl.classList.add('flipped');
  }

  if (gameState.flippedCards === 2) {
    const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

    if (flippedCards.length === 2 && flippedCards[0].querySelector('.card-back').innerText.trim() === flippedCards[1].querySelector('.card-back').innerText.trim()) {
      flippedCards.forEach(card => {
        card.classList.add('matched');
        // card.classList.remove('flipped');
      });

      gameState.matches++;
      if (gameState.matches === gameState.totalMatches) {
        endGame();
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.classList.remove('flipped');
        });
      }, 1000);
    }
    gameState.flippedCards = 0;
  }

  if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
      boardContainerEl.classList.add('flipped');
      winEl.innerHTML = `
        <span class="win-text">
          You won!<br />
          with <span class="highlight">${gameState.totalFlips}</span> moves<br />
          under <span class="highlight">${gameState.totalTime}</span> seconds
        </span>
      `

      clearInterval(gameState.loop)
    }, 1000);
  }
};

  



const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}
    
generateGame()
attachEventListeners()