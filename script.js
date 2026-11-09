
const game = document.getElementById("game");
const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const levelText = document.getElementById("level");

const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

let score = 0;
let lives = 3;
let level = 1;
let playing = false;

let playerX = 0;
let playerY = 0;

let items = [];
let spawnTimer;
let animation;

function movePlayer(e) {
    if (!playing) return;

    const rect = game.getBoundingClientRect();

    playerX = e.clientX - rect.left;
    playerY = e.clientY - rect.top;

    playerX = Math.max(20, Math.min(rect.width - 20, playerX));
    playerY = Math.max(20, Math.min(rect.height - 20, playerY));

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

game.addEventListener("mousemove", movePlayer);

game.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!playing) return;

    const touch = e.touches[0];
    movePlayer(touch);
}, { passive: false });

function createItem() {
    if (!playing) return;

    const isBomb = Math.random() < 0.3;

    const item = document.createElement("div");
    item.className = "item";
    item.innerText = isBomb ? "💣" : "⭐";

    const x = Math.random() * (game.clientWidth - 40);
    const y = -40;

    item.style.left = x + "px";
    item.style.top = y + "px";

    game.appendChild(item);

    items.push({
        element: item,
        x: x,
        y: y,
        bomb: isBomb,
        speed: 2 + level * 0.5 + Math.random() * 2
    });
}

function updateGame() {
    if (!playing) return;

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        item.y += item.speed;
        item.element.style.top = item.y + "px";

        const distance = Math.hypot(
            playerX - (item.x + 15),
            playerY - (item.y + 15)
        );

        if (distance < 38) {
            if (item.bomb) {
                lives--;
                livesText.innerText = lives;
            } else {
                score++;
                scoreText.innerText = score;

                if (score % 10 === 0) {
                    level++;
                    levelText.innerText = level;
                }
            }

            item.element.remove();
            items.splice(i, 1);

            if (lives <= 0) {
                endGame();
                return;
            }

            continue;
        }

        if (item.y > game.clientHeight) {
            item.element.remove();
            items.splice(i, 1);
        }
    }

    animation = requestAnimationFrame(updateGame);
}

function startGame() {
    score = 0;
    lives = 3;
    level = 1;

    playerX = game.clientWidth / 2;
    playerY = game.clientHeight / 2;

    scoreText.innerText = score;
    livesText.innerText = lives;
    levelText.innerText = level;

    items.forEach(item => item.element.remove());
    items = [];

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    message.style.display = "none";
    playing = true;

    clearInterval(spawnTimer);
    cancelAnimationFrame(animation);

    spawnTimer = setInterval(createItem, 850);
    updateGame();
}

function endGame() {
    playing = false;

    clearInterval(spawnTimer);
    cancelAnimationFrame(animation);

    message.innerHTML = `
        <h2>😢 O‘yin tugadi!</h2>
        <p>Yig‘gan ballaring: ${score}</p>
        <button id="restartBtn">🔄 Qayta o‘ynash</button>
    `;

    message.style.display = "flex";

    document.getElementById("restartBtn")
        .addEventListener("click", startGame);
}

startBtn.addEventListener("click", startGame);

message.style.display = "flex";
