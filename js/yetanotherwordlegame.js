// yetanotherwordlegame.js

document.addEventListener('DOMContentLoaded', () => {
  const wordleBoard = document.getElementById('wordleBoard');
  const wordleInput = document.getElementById('wordleInput');
  const wordleMessage = document.getElementById('wordleMessage');
  const startWordleButton = document.getElementById('startWordleButton');
  const powerUpButton = document.getElementById('powerUpButton');
  const wordleKeyboard = document.getElementById('wordleKeyboard');
  const themeDisplay = document.getElementById('themeLetters'); // Corrected Element
  const roundIndicator = document.getElementById('roundIndicator'); // Added Element
  const correctGuessMessage = document.getElementById('correctGuessMessage'); // Existing Element
  const confettiContainer = document.getElementById('confetti'); // Existing Element
  const progressBar = document.getElementById('progressBar'); // Existing Element
  const resetButton = document.getElementById('resetButton'); // Reset Button

  // Configuration for the game with Anagrams related to seasons
  const dailyGames = {
    "2024-12-09": {
      theme: "Famous Movies",
      words: ["alien", "psycho", "titanic"],
      anagram: "cinema" // Related to fall (movie season)
    },
    "2024-12-10": {
      theme: "Famous Bands",
      words: ["queen", "weezer", "nirvana"],
      anagram: "winter" // Related to winter season
    },
    "2024-12-11": {
      theme: "Country or State Capitals",
      words: ["texas", "berlin", "jakarta"],
      anagram: "county" // Related to land zoning
    },
    "2024-12-12": {
      theme: "Common Cat Names",
      words: ["salem", "oliver", "smokey"],
      anagram: "cocoa" // Related to winter season
    },
    "2024-12-13": {
      theme: "Car Types/Models",
      words: ["civic", "accord", "mustang"],
      anagram: "civic" // Self-anagram for demonstration
    },
    "2024-12-14": {
      theme: "Common Dog Names",
      words: ["buddy", "bailey", "charlie"],
      anagram: "buddy" // Self-anagram for demonstration
    },
    "2024-12-15": {
      theme: "American Cuisine",
      words: ["cajun", "burger", "hotdogs"],
      anagram: "bunch" // Related to gatherings
    }
  };

  // Helper function to get current date in YYYY-MM-DD format (Central Standard Time)
  function getCurrentDate() {
    const now = new Date();
    // Convert to Central Standard Time by adjusting the time offset
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const centralTime = new Date(utc - (3600000 * 6)); // CST is UTC-6
    const year = centralTime.getFullYear();
    let month = centralTime.getMonth() + 1;
    let day = centralTime.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
  }

  let currentDate = getCurrentDate();
  let gameData = dailyGames[currentDate];

  // If no game data for today, loop back to the first day
  if (!gameData) {
    const dates = Object.keys(dailyGames);
    const firstDate = dates[0];
    gameData = dailyGames[firstDate];
    currentDate = firstDate;
  }

  let { theme, words, anagram } = gameData;
  let currentRound = 0; // 0,1,2 for rounds 1,2,3
  const totalRounds = 3;
  let usedPowerUp = false;
  let secretWord = words[currentRound].toLowerCase();
  let wordLength = secretWord.length;
  let maxGuesses = 6;
  let guesses = [];
  let currentGuess = '';
  let gameOver = false;
  let anagramGuess = '';
  let anagramFound = false;

  // Initialize the game
  function initializeWordleGame() {
    currentRound = 0;
    usedPowerUp = false;
    anagramFound = false;
    secretWord = words[currentRound].toLowerCase();
    wordLength = secretWord.length;
    maxGuesses = 6;
    guesses = [];
    currentGuess = '';
    anagramGuess = '';
    gameOver = false;
    wordleMessage.textContent = `Theme: ${theme}`;
    displayClickableTheme();
    createBoard();
    createKeyboard();
    wordleInput.disabled = false;
    wordleInput.value = '';
    wordleInput.focus(); // Ensure the input is focused
    powerUpButton.disabled = false;
    powerUpButton.textContent = "Use Power-Up";
    updateKeyboard();
    showRoundIndicator(); // Show Round Indicator
    updateProgressBar(); // Reset Progress Bar
  }

  // Create the Wordle Board based on word length
  function createBoard() {
    wordleBoard.innerHTML = '';
    for (let i = 0; i < maxGuesses; i++) {
      const row = document.createElement('div');
      row.classList.add('wordle-row');
      row.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`; // Dynamic columns
      for (let j = 0; j < wordLength; j++) {
        const cell = document.createElement('div');
        cell.classList.add('wordle-cell');
        row.appendChild(cell);
      }
      wordleBoard.appendChild(row);
    }
  }

  // Create the On-Screen Keyboard
  function createKeyboard() {
    const keys = [
      'Q','W','E','R','T','Y','U','I','O','P',
      'A','S','D','F','G','H','J','K','L',
      'Ent','Z','X','C','V','B','N','M','BCK'
    ];
    wordleKeyboard.innerHTML = '';
    // Create keyboard rows
    const firstRow = document.createElement('div');
    firstRow.classList.add('flex', 'justify-center', 'mb-2');
    keys.slice(0,10).forEach(key => {
      const keyButton = document.createElement('div');
      keyButton.classList.add('wordle-key');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => handleKeyPress(key));
      firstRow.appendChild(keyButton);
    });
    wordleKeyboard.appendChild(firstRow);

    const secondRow = document.createElement('div');
    secondRow.classList.add('flex', 'justify-center', 'mb-2');
    keys.slice(10,19).forEach(key => {
      const keyButton = document.createElement('div');
      keyButton.classList.add('wordle-key');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => handleKeyPress(key));
      secondRow.appendChild(keyButton);
    });
    wordleKeyboard.appendChild(secondRow);

    const thirdRow = document.createElement('div');
    thirdRow.classList.add('flex', 'justify-center');
    keys.slice(19).forEach(key => {
      const keyButton = document.createElement('div');
      keyButton.classList.add('wordle-key');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => handleKeyPress(key));
      thirdRow.appendChild(keyButton);
    });
    wordleKeyboard.appendChild(thirdRow);
  }

  // Update Keyboard based on guesses
  function updateKeyboard() {
    guesses.forEach(guessObj => {
      const { guess, feedback } = guessObj;
      guess.split('').forEach((letter, index) => {
        const key = letter.toUpperCase();
        const keyButton = Array.from(wordleKeyboard.querySelectorAll('.wordle-key')).find(btn => btn.textContent === key);
        if (keyButton) {
          if (feedback[index] === 'correct') {
            keyButton.classList.remove('present', 'absent');
            keyButton.classList.add('correct', 'animate-press');
            setTimeout(() => {
              keyButton.classList.remove('animate-press');
            }, 600); // Match animation duration
          } else if (feedback[index] === 'present') {
            if (!keyButton.classList.contains('correct')) {
              keyButton.classList.remove('absent');
              keyButton.classList.add('present', 'animate-press');
              setTimeout(() => {
                keyButton.classList.remove('animate-press');
              }, 600);
            }
          } else {
            if (!keyButton.classList.contains('correct') && !keyButton.classList.contains('present')) {
              keyButton.classList.add('absent', 'animate-press');
              setTimeout(() => {
                keyButton.classList.remove('animate-press');
              }, 600);
            }
          }
        }
      });
    });
  }

  // Handle Keyboard Input (Physical)
  wordleInput.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if inside a form
      submitGuess();
    } else if (e.key === 'Backspace') {
      currentGuess = currentGuess.slice(0, -1);
      updateBoardUI();
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
      currentGuess += e.key.toUpperCase();
      updateBoardUI();
    }
  });

  // Handle On-Screen Keyboard Click
  function handleKeyPress(key) {
    if (gameOver) return;
    if (key === 'Ent') {
      submitGuess();
    } else if (key === 'BCK') {
      currentGuess = currentGuess.slice(0, -1);
      updateBoardUI();
    } else {
      if (currentGuess.length < wordLength) {
        currentGuess += key.toUpperCase();
        updateBoardUI();
      }
    }
  }

  // Update the Board UI with current guess
  function updateBoardUI() {
    const currentRow = wordleBoard.children[guesses.length];
    Array.from(currentRow.children).forEach((cell, index) => {
      cell.textContent = currentGuess[index] || '';
    });
  }

  // Submit the current guess
  function submitGuess() {
    if (gameOver) return;
    if (currentGuess.length !== wordLength) {
      wordleMessage.textContent = `Please enter a ${wordLength}-letter word.`;
      return;
    }
    // Uncomment and implement word validation if needed
    /*
    if (!isValidWord(currentGuess.toLowerCase())) {
      wordleMessage.textContent = "Word not in list.";
      return;
    }
    */

    // Process the guess
    const feedback = getFeedback(currentGuess.toLowerCase());
    guesses.push({ guess: currentGuess.toLowerCase(), feedback });
    updateBoardColors(feedback);
    updateKeyboard();
    currentGuess = '';
    updateBoardUI();
    wordleMessage.textContent = '';

    // Update Progress Bar
    updateProgressBar();

    // Check for win
    if (guesses[guesses.length - 1].guess === secretWord) {
      wordleMessage.textContent = "Congratulations! You've guessed the word!";
      wordleInput.disabled = true;
      powerUpButton.disabled = true;
      displayCorrectGuess(); // Display Correct Guess Message
      triggerConfetti(); // Trigger Confetti Animation
      proceedToNextRound(true);
      saveGameState(true); // Save win state
      return;
    }

    // Check for loss
    if (guesses.length === maxGuesses) {
      wordleMessage.textContent = `You've run out of guesses! The word was "${secretWord.toUpperCase()}".`;
      wordleInput.disabled = true;
      powerUpButton.disabled = true;
      proceedToNextRound(false);
      saveGameState(false); // Save loss state
      return;
    }
  }

  // Get feedback for a guess
  function getFeedback(guess) {
    const feedback = Array(wordLength).fill('absent');
    const secretArr = secretWord.split('');

    // First pass for correct letters
    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === secretArr[i]) {
        feedback[i] = 'correct';
        secretArr[i] = null;
      }
    }

    // Second pass for present letters
    for (let i = 0; i < wordLength; i++) {
      if (feedback[i] === 'correct') continue;
      const index = secretArr.indexOf(guess[i]);
      if (index !== -1) {
        feedback[i] = 'present';
        secretArr[index] = null;
      }
    }

    return feedback;
  }

  // Update the board colors based on feedback
  function updateBoardColors(feedback) {
    const currentRow = wordleBoard.children[guesses.length - 1];
    Array.from(currentRow.children).forEach((cell, index) => {
      // Remove existing classes to re-trigger animation
      cell.classList.remove('animate-flip', 'bounce');
      void cell.offsetWidth; // Trigger reflow

      // Add feedback class and animations
      cell.classList.add(feedback[index], 'animate-flip', 'bounce');

      // Remove the animation class after animation completes
      setTimeout(() => {
        cell.classList.remove('animate-flip', 'bounce');
      }, 1000); // Duration matches the CSS animation duration
    });
  }

  // Power-Up Functionality
  powerUpButton.addEventListener('click', () => {
    if (usedPowerUp) {
      wordleMessage.textContent = "You have already used your power-up for this game.";
      return;
    }

    // Present options to the user
    const powerUpChoice = prompt("Choose a Power-Up:\n1. Reveal a Letter\n2. Get an Extra Guess");

    if (powerUpChoice === '1') {
      revealLetterFunction();
      usedPowerUp = true;
    } else if (powerUpChoice === '2') {
      getExtraGuessFunction();
      usedPowerUp = true;
    } else {
      wordleMessage.textContent = "Invalid Power-Up choice.";
    }
  });

  function revealLetterFunction() {
    // Find a letter in the secret word that hasn't been revealed yet
    for (let i = 0; i < wordLength; i++) {
      const cell = wordleBoard.children[guesses.length].children[i];
      if (cell.textContent === '') {
        // Remove existing feedback classes to avoid conflicts
        cell.classList.remove('correct', 'present', 'absent', 'animate-flip', 'bounce');
        void cell.offsetWidth; // Trigger reflow

        cell.textContent = secretWord[i].toUpperCase();
        cell.classList.add('correct', 'animate-flip', 'bounce');
        // Remove the animation class after animation completes
        setTimeout(() => {
          cell.classList.remove('animate-flip', 'bounce');
        }, 1000); // Match animation duration

        // Update keyboard
        const key = secretWord[i].toUpperCase();
        const keyButton = Array.from(wordleKeyboard.querySelectorAll('.wordle-key')).find(btn => btn.textContent === key);
        if (keyButton) {
          // Remove existing feedback classes to avoid conflicts
          keyButton.classList.remove('present', 'absent', 'animate-press');
          void keyButton.offsetWidth; // Trigger reflow

          keyButton.classList.add('correct', 'animate-press');
          setTimeout(() => {
            keyButton.classList.remove('animate-press');
          }, 600); // Match animation duration
        }
        break;
      }
    }
  }

  function getExtraGuessFunction() {
    maxGuesses += 1;
    // Add an extra row to the board based on current word length
    const row = document.createElement('div');
    row.classList.add('wordle-row');
    row.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`; // Dynamic columns
    for (let j = 0; j < wordLength; j++) {
      const cell = document.createElement('div');
      cell.classList.add('wordle-cell');
      row.appendChild(cell);
    }
    wordleBoard.appendChild(row);
    wordleMessage.textContent = "An extra guess has been added!";
    updateProgressBar(); // Update progress bar to reflect the extra guess
  }

  // Proceed to the next round
  function proceedToNextRound(won) {
    if (won && currentRound < totalRounds - 1) {
      currentRound += 1;
      gameData = dailyGames[getNextDate()];
      if (gameData) {
        const { theme: newTheme, words: newWords, anagram: newAnagram } = gameData;
        theme = newTheme;
        anagram = newAnagram;
        secretWord = newWords[0].toLowerCase(); // Assuming single word per theme
        wordLength = secretWord.length;
        maxGuesses = 6;
        guesses = [];
        currentGuess = '';
        anagramGuess = '';
        gameOver = false;
        anagramFound = false;
        wordleMessage.textContent = `Round ${currentRound + 1}: ${newTheme}`;
        // Reset theme display
        resetThemeDisplay();
        // Adjust the board based on new word length
        adjustBoardForNewRound();
        createKeyboard();
        wordleInput.disabled = false;
        wordleInput.value = '';
        wordleInput.focus();
        powerUpButton.disabled = false;
        powerUpButton.textContent = "Use Power-Up";
        updateKeyboard();
        showRoundIndicator(); // Show Round Indicator
        updateProgressBar(); // Reset Progress Bar
      } else {
        wordleMessage.textContent += " No more rounds available.";
        gameOver = true;
      }
    } else {
      wordleMessage.textContent += " Game Over.";
      gameOver = true;
    }
  }

  // Function to get the next date key from dailyGames
  function getNextDate() {
    const dates = Object.keys(dailyGames).sort();
    const currentIndex = dates.indexOf(currentDate);
    if (currentIndex >= 0 && currentIndex < dates.length - 1) {
      return dates[currentIndex + 1];
    }
    return null;
  }

  // Save game state to localStorage
  function saveGameState(won) {
    const today = getCurrentDate();
    localStorage.setItem('wordle_last_played', today);
    localStorage.setItem('wordle_won', won);
  }

  // Check if the game has already been played today
  function hasPlayedToday() {
    const lastPlayed = localStorage.getItem('wordle_last_played');
    const today = getCurrentDate();
    return lastPlayed === today;
  }

  // Initialize the game when Start Game is clicked
  startWordleButton.addEventListener('click', () => {
    if (hasPlayedToday()) {
      wordleMessage.textContent = "You have already played today's game.";
      wordleInput.disabled = true;
      powerUpButton.disabled = true;
      return;
    }
    initializeWordleGame();
  });

  // Initialize the game if not played yet
  if (!hasPlayedToday()) {
    // Wait for the user to click Start
  } else {
    wordleMessage.textContent = "You have already played today's game.";
    wordleInput.disabled = true;
    powerUpButton.disabled = true;
    displayClickableTheme(); // Display theme letters
    updateProgressBar(); // Initialize Progress Bar
  }

  // Function to show Round Indicator with fade-in and fade-out
  function showRoundIndicator() {
    const roundText = `Round ${currentRound + 1}`;
    roundIndicator.textContent = roundText;
    roundIndicator.classList.remove('animate-fade-out');
    roundIndicator.classList.add('animate-fade-in');

    // After fade-in, wait for 2.5 seconds and then fade out
    setTimeout(() => {
      roundIndicator.classList.remove('animate-fade-in');
      roundIndicator.classList.add('animate-fade-out');
    }, 2500); // Match animation duration
  }

  // Function to display Correct Guess Message with animation
  function displayCorrectGuess() {
    correctGuessMessage.textContent = "Correct Guess!";
    correctGuessMessage.style.display = 'flex';
    correctGuessMessage.classList.remove('hidden');
    correctGuessMessage.classList.add('animate-fade-in');

    // After displaying, fade out the message after 3 seconds
    setTimeout(() => {
      correctGuessMessage.classList.remove('animate-fade-in');
      correctGuessMessage.classList.add('animate-fade-out');
      setTimeout(() => {
        correctGuessMessage.classList.add('hidden');
        correctGuessMessage.classList.remove('animate-fade-out');
        correctGuessMessage.textContent = '';
      }, 1000); // Duration matches the CSS animation duration
    }, 3000); // Display duration
  }

  // Function to trigger confetti animation
  function triggerConfetti() {
    const confettiCount = 100;
    const colors = ['#FFC700', '#FF0000', '#2E3192', '#41BBC7'];
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti-piece');
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 5}s`;
      confettiContainer.appendChild(confetti);

      // Remove confetti after animation
      confetti.addEventListener('animationend', () => {
        confetti.remove();
      });
    }
  }

  // Function to update Progress Bar
  function updateProgressBar() {
    const progress = (guesses.length / maxGuesses) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Function to create a confetti piece
  function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confettiContainer.appendChild(confetti);

    // Remove confetti after animation
    confetti.addEventListener('animationend', () => {
      confetti.remove();
    });
  }

  // Function to continuously generate confetti
  function startConfetti() {
    const confettiInterval = setInterval(() => {
      createConfettiPiece();
      if (confettiContainer.children.length > 200) {
        clearInterval(confettiInterval);
      }
    }, 200);
  }
  
  // Modified triggerConfetti to start multiple confetti pieces
  function triggerConfetti() {
    startConfetti();
  }

  // Reset Game Functionality
  resetButton.addEventListener('click', () => {
    initializeWordleGame();
    wordleMessage.textContent = "Game has been reset.";
  });

  // Handle Theme Letter Clicks for Anagram
  function handleThemeLetterClick(event) {
    if (gameOver || anagramFound) return;
    const cell = event.target;
    const letter = cell.textContent.toLowerCase();

    if (cell.classList.contains('selected')) {
      // Deselect the letter
      cell.classList.remove('selected');
      anagramGuess = anagramGuess.slice(0, -1);
    } else {
      // Select the letter
      cell.classList.add('selected');
      anagramGuess += letter;
    }

    // Check if the anagram is complete
    if (anagramGuess.length === anagram.length) {
      if (anagramGuess === anagram.toLowerCase()) {
        wordleMessage.textContent = "Anagram Correct! You've earned an extra Power-Up!";
        triggerAnagramSuccessAnimation();
        awardExtraPowerUp();
        anagramFound = true;
      } else {
        wordleMessage.textContent = "Incorrect Anagram. Try Again!";
      }
      anagramGuess = '';
      // Reset all selections
      const allLetters = document.querySelectorAll('.theme-letter');
      allLetters.forEach(letterSpan => {
        letterSpan.classList.remove('selected');
      });
    }
  }

  // Award Extra Power-Up
  function awardExtraPowerUp() {
    // Implement the logic to grant an extra power-up
    // For simplicity, we'll reset the usedPowerUp flag and enable the power-up button again
    if (usedPowerUp) {
      usedPowerUp = false;
      powerUpButton.disabled = false;
      powerUpButton.textContent = "Use Power-Up";
      wordleMessage.textContent += " You can use another Power-Up now.";
    }
  }

  // Function to display theme as clickable text
  function displayClickableTheme() {
    const themeText = theme;
    const themeLetters = themeText.split('').map(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.classList.add('theme-letter');
      span.addEventListener('click', handleThemeLetterClick);
      return span;
    });
    themeDisplay.innerHTML = '';
    themeLetters.forEach(span => themeDisplay.appendChild(span));
  }

  // Reset Theme Display for New Rounds
  function resetThemeDisplay() {
    const themeContainer = document.getElementById('themeLetters');
    themeContainer.innerHTML = '';
    displayClickableTheme();
  }

  // Function to adjust the board based on new round's word length
  function adjustBoardForNewRound() {
    wordleBoard.innerHTML = '';
    for (let i = 0; i < maxGuesses; i++) {
      const row = document.createElement('div');
      row.classList.add('wordle-row');
      row.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`; // Dynamic columns
      for (let j = 0; j < wordLength; j++) {
        const cell = document.createElement('div');
        cell.classList.add('wordle-cell');
        row.appendChild(cell);
      }
      wordleBoard.appendChild(row);
    }
  }

  // Function to handle anagram success animation
  function triggerAnagramSuccessAnimation() {
    // Highlight random letters in the theme to flash gray
    const allLetters = document.querySelectorAll('.theme-letter');
    allLetters.forEach(letterSpan => {
      const random = Math.random();
      if (random < 0.3) { // 30% chance to highlight
        letterSpan.style.transition = 'background-color 0.5s';
        letterSpan.style.backgroundColor = '#9ca3af'; // Tailwind gray-400
        setTimeout(() => {
          letterSpan.style.backgroundColor = ''; // Revert back
        }, 1000); // Duration of the flash
      }
    });
  }

  // Initialize the theme display when the game starts
  function initializeThemeDisplay() {
    displayClickableTheme();
  }

});
