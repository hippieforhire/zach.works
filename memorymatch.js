document.addEventListener('DOMContentLoaded', () => {
    const memoryGameBoard = document.getElementById('memoryGameBoard');
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
    let firstCard = null;
    let secondCard = null;
    let firstCardElement = null;

    function setupMemoryGame() {
        memoryGameBoard.innerHTML = '';
        const shuffledCards = cards.sort(() => 0.5 - Math.random());
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.value = card;
            cardElement.innerHTML = `<div class="card-back">?</div><div class="card-front">${card}</div>`;
            cardElement.addEventListener('click', onCardClick);
            memoryGameBoard.appendChild(cardElement);
        });
    }

    function onCardClick(event) {
        const clickedCard = event.currentTarget;
        if (!firstCard) {
            firstCard = clickedCard.dataset.value;
            firstCardElement = clickedCard;
            clickedCard.classList.add('flipped');
        } else if (!secondCard && clickedCard !== firstCardElement) {
            secondCard = clickedCard.dataset.value;
            clickedCard.classList.add('flipped');
            if (firstCard === secondCard) {
                firstCardElement = null;
                firstCard = null;
                secondCard = null;
            } else {
                setTimeout(() => {
                    firstCardElement.classList.remove('flipped');
                    clickedCard.classList.remove('flipped');
                    firstCardElement = null;
                    firstCard = null;
                    secondCard = null;
                }, 1000);
            }
        }
    }

    setupMemoryGame();
});
