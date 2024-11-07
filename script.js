const colors = ["red", "yellow", "green", "blue"];
const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip", "Reverse", "Draw 2"];
let deck = [];
let discardPile = [];
let players = [];
let currentPlayer = 0;
let gameOver = false;

function startGame(playerCount) {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    initializeGame(playerCount);
}

function initializeGame(playerCount = 2) {
    createDeck();
    shuffleDeck();
    setupPlayers(playerCount);
    dealInitialCards();
    logAction(`Game started with ${playerCount} players!`);
    updateUI();
}

function createDeck() {
    deck = [];
    for (let color of colors) {
        for (let value of values) {
            deck.push({ color, value });
        }
    }
}

function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
}

function setupPlayers(count) {
    players = Array.from({ length: count }, () => []);
    for (let i = 0; i < count; i++) {
        document.getElementById(`player-${i + 1}`).style.display = "block";
    }
}

function dealInitialCards() {
    for (let i = 0; i < 7; i++) {
        players.forEach(playerHand => playerHand.push(deck.pop()));
    }
    discardPile.push(deck.pop());
}

function drawCard() {
    if (gameOver) return;
    const card = deck.pop();
    players[currentPlayer].push(card);
    logAction(`Player ${currentPlayer + 1} drew a card.`);
    updateUI();
}

function playCard(cardIndex) {
    if (gameOver) return;
    const card = players[currentPlayer][cardIndex];
    discardPile.push(card);
    players[currentPlayer].splice(cardIndex, 1);
    logAction(`Player ${currentPlayer + 1} played ${card.color} ${card.value}.`);

    if (players[currentPlayer].length === 0) {
        gameOver = true;
        logAction(`Player ${currentPlayer + 1} wins the game!`);
        alert(`Player ${currentPlayer + 1} wins!`);
    } else {
        switchTurn();
    }
    updateUI();
}

function switchTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
    logAction(`Player ${currentPlayer + 1}'s turn.`);
    updateUI();
}

function logAction(message) {
    const logContent = document.getElementById("log-content");
    const logEntry = document.createElement("div");
    logEntry.innerText = message;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}

function updateUI() {
    players.forEach((hand, i) => {
        const handContainer = document.getElementById(`hand-${i + 1}`);
        handContainer.innerHTML = "";
        hand.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card", card.color);
            cardElement.innerText = `${card.color[0].toUpperCase()} ${card.value}`;
            cardElement.onclick = () => playCard(index);
            handContainer.appendChild(cardElement);
        });
    });
    document.getElementById("discard-pile").innerText =
        `Discard Pile: ${discardPile[discardPile.length - 1].color} ${discardPile[discardPile.length - 1].value}`;
}

document.getElementById("draw-card").onclick = drawCard;
document.getElementById("next-turn").onclick = switchTurn;
