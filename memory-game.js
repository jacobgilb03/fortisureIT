let cardIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (0 != currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

cardIds = shuffle(cardIds);

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.add('flipped');
    });
});

let flippedCards = [];
let numFlipped = 0;

cards.forEach(card => {
    card.addEventListener('click', () => {
      if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card.getAttribute('data-card-id'));
        numFlipped++;
  
        if (numFlipped === 2) {
          if (flippedCards[0] === flippedCards[1]) {
            flippedCards = [];
            numFlipped = 0;
            checkWin();
          } else {
            setTimeout(() => {
              cards.forEach(card => {
                if (flippedCards.includes(card.getAttribute('data-card-id'))) {
                  card.classList.remove('flipped');
                }
              });
              flippedCards = [];
              numFlipped = 0;
            }, 1000);
          }
        }
      }
    });
  });
  
  function checkWin() {
    let allFlipped = true;
    cards.forEach(card => {
      if (!card.classList.contains('flipped')) {
        allFlipped = false;
      }
    });
  
    if (allFlipped) {
      alert('Congratulations, you win!');
    }
  }
  