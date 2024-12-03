document.addEventListener('DOMContentLoaded', () => {
    const memoryGameBoard = document.getElementById('memoryGameBoard');
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
    let firstCard = null;
    let secondCard = null;
    let firstCardElement = null;

    function setupMemoryGame() {
        memoryGameBoard.innerHTML = '';
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5); // Properly shuffle cards
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

        // Ignore clicks on already flipped cards
        if (clickedCard.classList.contains('flipped')) return;

        if (!firstCard) {
            firstCard = clickedCard.dataset.value;
            firstCardElement = clickedCard;
            clickedCard.classList.add('flipped');
        } else if (!secondCard && clickedCard !== firstCardElement) {
            secondCard = clickedCard.dataset.value;
            clickedCard.classList.add('flipped');

            if (firstCard === secondCard) {
                // Match found: reset variables
                firstCard = null;
                secondCard = null;
                firstCardElement = null;
            } else {
                // No match: flip back cards after a short delay
                setTimeout(() => {
                    firstCardElement.classList.remove('flipped');
                    clickedCard.classList.remove('flipped');
                    firstCard = null;
                    secondCard = null;
                    firstCardElement = null;
                }, 1000);
            }
        }
    }

    setupMemoryGame();
});
