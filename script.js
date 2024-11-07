// Basic UNO Deck Data
const colors = ["red", "yellow", "green", "blue"];
const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip", "Reverse", "Draw 2"];
let deck = [];
let discardPile = [];
let players = [];
let currentPlayer = 0;
let gameOver = false;

// Game Setup
function initializeGame(playerCount = 2) {
    createDeck();
    shuffleDeck();
    setupPlayers(playerCount);
    dealInitialCards();
    updateUI();
}

// Creates and shuffles the deck
function createDeck() {
    deck = [];
    for (let color of colors) {
        for (let value of values) {
            deck.push({ color, value });
        }
    }
}

function shuffleDeck() {
    deck = deck.sort(() => Math.random() - 0.5);
}

// Deals initial cards to each player
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
    discardPile.push(deck.pop()); // Start discard pile
}

// Draw a card and add to current player's hand
function drawCard() {
    const card = deck.pop();
    players[currentPlayer].push(card);
    updateUI();
}

// Discard a card from the player's hand
function playCard(cardIndex) {
    if (gameOver) return;
    const card = players[currentPlayer][cardIndex];
    discardPile.push(card);
    players[currentPlayer].splice(cardIndex, 1);
    if (players[currentPlayer].length === 0) {
        gameOver = true;
        alert(`Player ${currentPlayer + 1} wins!`);
    } else {
        switchTurn();
    }
    updateUI();
}

// Switch to the next player's turn
function switchTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
    updateUI();
}

// Updates the game interface
function updateUI() {
    players.forEach((hand, i) => {
        const handContainer = document.getElementById(`hand-${i + 1}`);
        handContainer.innerHTML = "";
        hand.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.innerText = `${card.color[0].toUpperCase()} ${card.value}`;
            cardElement.onclick = () => playCard(index);
            handContainer.appendChild(cardElement);
        });
    });
    document.getElementById("discard-pile").innerText =
        `Discard Pile: ${discardPile[discardPile.length - 1].color} ${discardPile[discardPile.length - 1].value}`;
}

// Event Listeners
document.getElementById("draw-card").onclick = drawCard;
document.getElementById("next-turn").onclick = switchTurn;

// Initialize Game for 2 Players by Default
initializeGame(2);
