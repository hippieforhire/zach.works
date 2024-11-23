// Flappy Bird Game Logic
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startGameButton");
const restartButton = document.getElementById("restartButton");
let bird, pipes, score, isGameOver, timer;

// Game Setup
function initGame() {
    bird = { x: 50, y: canvas.height / 2, width: 30, height: 30, gravity: 0.6, lift: -10, velocity: 0 }; // Adjusted lift value
    pipes = [];
    score = 0;
    isGameOver = false;
    timer = 0;
    updateScore();
    document.getElementById("score").style.display = "block";
    restartButton.style.display = "none";
}

function startGame() {
    initGame();
    canvas.style.display = "block";
    startButton.style.display = "block"; // Ensure the start button remains visible
    restartButton.style.display = "none";
    canvas.addEventListener("click", startMovement);
    canvas.addEventListener("touchstart", startMovement);
}

function startMovement() {
    window.addEventListener("click", birdFlap);
    window.addEventListener("touchstart", birdFlap);
    gameLoop();
    canvas.removeEventListener("click", startMovement);
    canvas.removeEventListener("touchstart", startMovement);
}

function birdFlap() {
    bird.velocity = bird.lift;
}

function gameLoop() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
    drawBird();
    updatePipes();
    drawPipes();
    checkCollisions();
    updateScore();
    timer++;
    requestAnimationFrame(gameLoop);
}

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updatePipes() {
    if (timer % 60 === 0 && !isGameOver) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 100;
        const gap = 200; // Increased gap size
        pipes.push({ x: canvas.width, y: pipeHeight, gap: gap });
    }
    pipes.forEach(pipe => {
        pipe.x -= 3;
    });
    pipes = pipes.filter(pipe => pipe.x + 50 > 0);
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipe.gap, 50, canvas.height - pipe.y - pipe.gap);
    });
}

function checkCollisions() {
    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + 50) {
            if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.gap) {
                endGame();
            }
        }
    });
}

function endGame() {
    isGameOver = true;
    window.removeEventListener("click", birdFlap);
    window.removeEventListener("touchstart", birdFlap);
    document.getElementById("score").textContent += " - Game Over!";
    setTimeout(restartGame, 2000); // Auto-restart after 2 seconds
}

function restartGame() {
    initGame();
    canvas.addEventListener("click", startMovement);
    canvas.addEventListener("touchstart", startMovement);
}

function updateScore() {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
}

startButton.addEventListener("click", startGame);
