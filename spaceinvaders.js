const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    width: 50,
    height: 20,
    x: canvas.width / 2 - 25,
    y: canvas.height - 30,
    speed: 5,
    dx: 0
};

const bullets = [];
const invaders = [];
const invaderRows = 5;
const invaderCols = 8;
const invaderWidth = 40;
const invaderHeight = 20;
const invaderPadding = 20;
const invaderOffsetTop = 30;
const invaderOffsetLeft = 30;
const bulletSpeed = 7;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let touchStartX = 0;
let touchEndX = 0;

// Create invaders
for (let i = 0; i < invaderRows; i++) {
    invaders[i] = [];
    for (let j = 0; j < invaderCols; j++) {
        invaders[i][j] = { x: 0, y: 0, status: 1 };
    }
}

// Draw player
function drawPlayer() {
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

// Draw bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        } else {
            ctx.beginPath();
            ctx.rect(bullet.x, bullet.y, 5, 10);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
            bullet.y -= bulletSpeed;
        }
    });
}

// Draw invaders
function drawInvaders() {
    for (let i = 0; i < invaderRows; i++) {
        for (let j = 0; j < invaderCols; j++) {
            if (invaders[i][j].status === 1) {
                const invaderX = j * (invaderWidth + invaderPadding) + invaderOffsetLeft;
                const invaderY = i * (invaderHeight + invaderPadding) + invaderOffsetTop;
                invaders[i][j].x = invaderX;
                invaders[i][j].y = invaderY;
                ctx.beginPath();
                ctx.rect(invaderX, invaderY, invaderWidth, invaderHeight);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Move player
function movePlayer() {
    player.x += player.dx;

    // Wall collision detection
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Shoot bullet
function shootBullet() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
}

// Keydown event handler
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
        player.dx = player.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = true;
        shootBullet();
    }
}

// Keyup event handler
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
        player.dx = 0;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
        player.dx = 0;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = false;
    }
}

// Touch event handlers
function touchStartHandler(e) {
    touchStartX = e.touches[0].clientX;
}

function touchMoveHandler(e) {
    touchEndX = e.touches[0].clientX;
    const touchDiff = touchEndX - touchStartX;

    if (touchDiff > 0) {
        player.dx = player.speed;
    } else if (touchDiff < 0) {
        player.dx = -player.speed;
    }
}

function touchEndHandler(e) {
    player.dx = 0;
    shootBullet();
}

// Collision detection
function collisionDetection() {
    bullets.forEach((bullet, bulletIndex) => {
        for (let i = 0; i < invaderRows; i++) {
            for (let j = 0; j < invaderCols; j++) {
                const invader = invaders[i][j];
                if (invader.status === 1) {
                    if (
                        bullet.x > invader.x &&
                        bullet.x < invader.x + invaderWidth &&
                        bullet.y > invader.y &&
                        bullet.y < invader.y + invaderHeight
                    ) {
                        invader.status = 0;
                        bullets.splice(bulletIndex, 1);
                    }
                }
            }
        }
    });
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawInvaders();
    collisionDetection();
    movePlayer();
}

// Update game
function update() {
    draw();
    requestAnimationFrame(update);
}

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
canvas.addEventListener('touchstart', touchStartHandler);
canvas.addEventListener('touchmove', touchMoveHandler);
canvas.addEventListener('touchend', touchEndHandler);

// Start the game
update();