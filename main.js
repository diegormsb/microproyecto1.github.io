// main.js

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('time');
    const scoreElement = document.getElementById('score-value');
    const usernameElement = document.getElementById('username');
  
    // Variables del juego
    let cards = [];
    let flippedCards = [];
    let score = 0;
    let timer;
    let timeLeft = 180;
    let username = '';
  
    initializeGame();
  
    // Inizializar el game
    function initializeGame() {
      startButton.addEventListener('click', startGame);
      restartButton.addEventListener('click', restartGame);
      getUsername();
    }
  
    // Nombre de usuario
    function getUsername() {
      username = prompt('Ingrese su nombre de usuario:');
      usernameElement.textContent = username;
    }
  
    // Empezar el game
    function startGame() {
      startButton.disabled = true;
      restartButton.disabled = false;
  
      generateCards();
      renderCards();
  
      // Empezar el temporizador
      timer = setInterval(updateTimer, 1000);
    }
  
    // Reiniciar el game
    function restartGame() {
      clearInterval(timer);
      timeLeft = 180;
      score = 0;
      flippedCards = [];
  
      timerElement.textContent = timeLeft;
      scoreElement.textContent = score;
  
      gameBoard.innerHTML = '';
      startButton.disabled = false;
      restartButton.disabled = true;
    }
  
    // Esta función genera las cartas
    function generateCards() {
      const images = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8'];
      cards = [...images, ...images]; // Duplicar las imágenes para tener pares
  
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }

    // Ajustar las imágenes en las cartas
    function renderCards() {
      for (let i = 0; i < cards.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardIndex = i;
        card.addEventListener('click', flipCard);
  
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
  
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
  
        const reverseImage = new Image();
        reverseImage.src = 'assets/reverse.jpg';
        reverseImage.alt = 'Card Reverse';
        reverseImage.classList.add('card-image');
  
        const frontImage = new Image();
        frontImage.src = `assets/${cards[i]}.jpg`;
        frontImage.alt = 'Card Front';
        frontImage.classList.add('card-image');
  
        backFace.appendChild(reverseImage);
        frontFace.appendChild(frontImage);
  
        card.appendChild(frontFace);
        card.appendChild(backFace);
        gameBoard.appendChild(card);
      }
    }
  
    // Flipping cards
    function flipCard() {
      if (!this.classList.contains('flipped') && !this.classList.contains('found') && flippedCards.length < 2) {
        const frontFace = this.querySelector('.front-face');
        const backFace = this.querySelector('.back-face');
  
        frontFace.style.display = 'block';
        backFace.style.display = 'none';
        this.classList.add('flipped');
        flippedCards.push(this);
  
        if (flippedCards.length === 2) {
          setTimeout(checkMatch, 1000);
        }
      }
    }
  
    // Buscar coicidencia al flippear las cartas
    function checkMatch() {
      const card1 = flippedCards[0];
      const card2 = flippedCards[1];
      const index1 = Number(card1.dataset.cardIndex);
      const index2 = Number(card2.dataset.cardIndex);
  
      if (cards[index1] === cards[index2]) {
        card1.classList.add('found');
        card2.classList.add('found');
  
        const frontImage1 = card1.querySelector('.front-face img');
        const frontImage2 = card2.querySelector('.front-face img');
        frontImage1.style.display = 'block';
        frontImage2.style.display = 'block';
  
        flippedCards = [];
  
        score += 10;
        scoreElement.textContent = score;
  
        checkGameCompletion();
      } else {
        setTimeout(() => {
          const frontFace1 = card1.querySelector('.front-face');
          const backFace1 = card1.querySelector('.back-face');
          frontFace1.style.display = 'none';
          backFace1.style.display = 'block';
          card1.classList.remove('flipped');
  
          const frontFace2 = card2.querySelector('.front-face');
          const backFace2 = card2.querySelector('.back-face');
          frontFace2.style.display = 'none';
          backFace2.style.display = 'block';
          card2.classList.remove('flipped');
  
          flippedCards = [];
        }, 1000);
      }
    }
  
    // Verificar si se completó el juego
    function checkGameCompletion() {
      const foundCards = document.querySelectorAll('.found');
      if (foundCards.length === cards.length) {
        clearInterval(timer);
        saveScore();
        displayScores();
        alert('¡Felicidades! Has completado el juego.');
      }
    }
  
    // Guardar la puntuación en el localstorage
    function saveScore() {
      const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
      const playerScore = {
        username: username,
        score: calculateScore(),
      };
      highScores.push(playerScore);
      highScores.sort((a, b) => b.score - a.score);
      localStorage.setItem('highScores', JSON.stringify(highScores));
    }
  
    // Puntuación del jugador
    function calculateScore() {
    const remainingTime = Number(timerElement.textContent);
    const totalTime = 180; // Tiempo total del juego en segundos
    const maxScore = 100; // Puntuación máxima
    const score = maxScore * (remainingTime / totalTime);
    return Math.round(score);
  }
  
    // Leaderboard
    function displayScores() {
      const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
      const tbody = document.querySelector('#scoreboard tbody');
      tbody.innerHTML = '';
      highScores.forEach((score) => {
        const row = document.createElement('tr');
        const usernameCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        usernameCell.textContent = score.username;
        scoreCell.textContent = score.score;
        row.appendChild(usernameCell);
        row.appendChild(scoreCell);
        tbody.appendChild(row);
      });
    }
  
    // Actualizar el temporizador
    function updateTimer() {
      timeLeft--;
      timerElement.textContent = timeLeft;
  
      if (timeLeft === 0) {
        clearInterval(timer);
        saveScore();
        displayScores();
        alert('¡Se acabó el tiempo! Inténtalo de nuevo.');
        restartGame();
      }
    }
  });  