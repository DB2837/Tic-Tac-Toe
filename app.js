class Sign {
  static X = "X";
  static O = "O";
}

class Tile {
  static counter = 0;

  constructor(signValue = "") {
    this.sign = signValue;
    this.coordinateNumber = ++Tile.counter;
  }

  getCoordinateNumber() {
    return this.coordinateNumber;
  }

  setSignValue(sign) {
    this.sign = sign;
  }

  getSignValue() {
    return this.sign;
  }
}

class Player {
  playerScore = 0;
  isMyTurn = true;
  playerType = "";

  constructor(sign) {
    this.signValue = sign;
  }

  drawSign(coordinateNumber, gameBoard) {
    if (
      gameBoard.getTile(coordinateNumber).getSignValue() == Sign.X ||
      gameBoard.getTile(coordinateNumber).getSignValue() == Sign.O
    ) {
      return;
    } else {
      gameBoard.getTile(coordinateNumber).setSignValue(this.signValue);
    }
  }

  getSign() {
    return this.signValue;
  }

  setType(type) {
    this.playerType = type;
  }

  getType() {
    return this.playerType;
  }
}

class GameBoard {
  static randomTile;

  constructor() {
    this.gameBoard = [
      [, ,],
      [, ,],
      [, ,],
    ];
  }

  inizializeGameBoard() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        this.gameBoard[i][j] = new Tile();
      }
    }

    Tile.counter = 0;
  }

  getTile(coordinateNumber) {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        if (this.gameBoard[i][j].getCoordinateNumber() == coordinateNumber) {
          return this.gameBoard[i][j];
        }
      }
    }
  }

  /*   displayTiles() {
    for (let tileArray of this.gameBoard) {
      for (let i = 0; i < this.gameBoard.length; i++) {
        console.log(
          tileArray[i].getSignValue() +
            ": " +
            tileArray[i].getCoordinateNumber()
        );
      }
    }
  }
 */
  getRandomPossibleTiles() {
    let possibleMoves = [];
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        if (this.gameBoard[i][j].getSignValue() == "") {
          possibleMoves.push(this.gameBoard[i][j].getCoordinateNumber());
        }
      }
    }

    for (let num in possibleMoves) {
    }

    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    GameBoard.randomTile = possibleMoves[randomIndex];
  }

  clearBoard() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        this.gameBoard[i][j].setSignValue("");
      }
    }

    Tile.counter = 0;
  }

  isFull() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        if (this.gameBoard[i][j].getSignValue() == "") return false;
      }
    }
    return true;
  }

  checkColumns(sign) {
    for (let i = 0; i < this.gameBoard.length; i++) {
      let count = 0;
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        if (this.gameBoard[j][i].getSignValue() == sign) count++;
      }

      if (count === 3) return true;
    }

    return false;
  }

  checkRows(sign) {
    for (let i = 0; i < this.gameBoard.length; i++) {
      let count = 0;
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        if (this.gameBoard[i][j].getSignValue() == sign) count++;
      }

      if (count === 3) return true;
    }
    return false;
  }

  checkDiagonals(sign) {
    for (let i = 0; i < this.gameBoard.length; i++) {
      if (
        (this.gameBoard[0][0].getSignValue() == sign &&
          this.gameBoard[1][1].getSignValue() == sign &&
          this.gameBoard[2][2].getSignValue() == sign) ||
        (this.gameBoard[0][2].getSignValue() == sign &&
          this.gameBoard[1][1].getSignValue() == sign &&
          this.gameBoard[2][0].getSignValue() == sign)
      )
        return true;
    }
    return false;
  }
}

class UI {
  static startGame(playerTipe) {
    const board = new GameBoard();
    board.inizializeGameBoard();
    const playerOne = new Player(Sign.X);
    const playerTwo = new Player(Sign.O);

    playerOne.setType("human");

    if (playerTipe == "human") {
      playerTwo.setType("human");
    } else if (playerTipe == "AI") {
      playerTwo.setType("AI");
    }

    return { board, playerOne, playerTwo };
  } //add eventlistener on click to start the game (create board and players, take players as parameter for CPU)

  static checkTileContent(gameBoard, coordinateNumber) {
    return gameBoard.getTile(coordinateNumber).getSignValue();
  }

  static handleTurns(playerOne, playerTwo) {
    if (playerOne.isMyTurn == true) {
      playerOne.isMyTurn = false;
      playerTwo.isMyTurn = true;
      return [playerOne, playerOne.getSign()];
    } else if (playerOne.isMyTurn == false) {
      playerOne.isMyTurn = true;
      playerTwo.isMyTurn = false;
      return [playerTwo, playerTwo.getSign()];
    }
  }

  static playerInTurn(playerOne, playerTwo) {
    if (playerOne.isMyTurn == true) return playerOne;

    return playerTwo;
  }

  static renderSignPvP(target, player, gameBoard) {
    if (UI.checkTileContent(gameBoard, target.dataset.coordinate)) return;

    const tile = document.querySelector(
      `[data-coordinate="${target.dataset.coordinate}"]`
    );
    player.drawSign(target.dataset.coordinate, gameBoard);

    const sign = document.createTextNode(player.getSign());

    tile.appendChild(sign);
  }

  static renderSignPvE(target, player, gameBoard) {
    if (player.getType() == "human") {
      if (UI.checkTileContent(gameBoard, target.dataset.coordinate)) return;
      const tile = document.querySelector(
        `[data-coordinate="${target.dataset.coordinate}"]`
      );
      player.drawSign(target.dataset.coordinate, gameBoard);

      const sign = document.createTextNode(player.getSign());

      tile.appendChild(sign);
      if (game["board"].isFull()) return;
    } else if (player.getType() == "AI") {
      if (game["board"].isFull()) return;
      const tile = document.querySelector(
        `[data-coordinate="${GameBoard.randomTile}"]`
      );

      setTimeout(() => {
        player.drawSign(GameBoard.randomTile, gameBoard);

        const sign = document.createTextNode(player.getSign());

        tile.appendChild(sign);
        UI.checkForWinner(game["board"], player);
      }, 900);
    }
  }

  static clearBoard() {
    const tiles = document.querySelectorAll("[data-coordinate]");
    tiles.forEach((tile) => (tile.textContent = ""));
  }

  static renderPlayerScore(player) {
    if (player.getSign() == Sign.X) {
      scorePlayerOne.textContent = player.playerScore;
      return;
    }

    scorePlayerTwo.textContent = player.playerScore;
  }

  static highlightCurrentPlayer(player) {
    if (player.getSign() == Sign.X) {
      textPlayerTwo.classList.toggle("active");
      scorePlayerTwo.classList.toggle("active");
      textPlayerOne.classList.remove("active");
      scorePlayerOne.classList.remove("active");
      return;
    }

    textPlayerOne.classList.toggle("active");
    scorePlayerOne.classList.toggle("active");
    textPlayerTwo.classList.remove("active");
    scorePlayerTwo.classList.remove("active");
  }

  static handlePvPGame(target, game) {
    const currentPlayer = UI.playerInTurn(game["playerOne"], game["playerTwo"]);

    UI.renderSignPvP(
      target,
      UI.handleTurns(game["playerOne"], game["playerTwo"])[0],
      game["board"]
    );

    UI.checkForWinner(game["board"], currentPlayer);
    UI.highlightCurrentPlayer(currentPlayer);
  }

  static handlePvEGame(target, game) {
    const currentPlayer = UI.playerInTurn(game["playerOne"], game["playerTwo"]);

    UI.renderSignPvE(
      target,
      UI.handleTurns(game["playerOne"], game["playerTwo"])[0],
      game["board"]
    );

    UI.checkForWinner(game["board"], currentPlayer);
  }

  static checkForWinner(gameBoard, player) {
    if (
      gameBoard.checkColumns(player.getSign()) ||
      gameBoard.checkRows(player.getSign()) ||
      gameBoard.checkDiagonals(player.getSign())
    ) {
      player.playerScore++;
      UI.renderPlayerScore(player);
      tiles.classList.add("not-clickable");

      setTimeout(() => {
        tiles.classList.remove("not-clickable");
        gameBoard.clearBoard();
        UI.clearBoard();
      }, 900);
    } else if (gameBoard.isFull()) {
      setTimeout(() => {
        gameBoard.clearBoard();
        UI.clearBoard();
      }, 900);
    } else return;
  }
}

const scorePlayerOne = document.querySelector("#scoreOne");
const scorePlayerTwo = document.querySelector("#scoreTwo");
const textPlayerOne = document.querySelector("#playerOne");
const textPlayerTwo = document.querySelector("#playerTwo");
const overlay = document.querySelector(".overlay");
const neonButtons = document.querySelectorAll(".neon-btn");
const pvpButton = document.querySelector(".pvp");
const pveButton = document.querySelector(".pve");
const bottomBtn = document.querySelector(".btn-bottom");
const dropdownMenu = document.querySelector(".dropdown-content");

const grid = document.querySelector(".grid");
const tiles = document.querySelector(".grid");
let game;

tiles.addEventListener("click", (e) => {
  game["board"].getRandomPossibleTiles();

  if (game["playerTwo"].getType() == "human") {
    if (UI.checkTileContent(game["board"], e.target.dataset.coordinate)) return;
    UI.handlePvPGame(e.target, game);
  } else if (game["playerTwo"].getType() == "AI") {
    if (game["playerOne"].isMyTurn) {
      if (UI.checkTileContent(game["board"], e.target.dataset.coordinate))
        return;
      UI.handlePvEGame(e.target, game);
    } else if (game["playerTwo"].isMyTurn) {
      UI.handlePvEGame(GameBoard.randomTile, game);
    }

    tiles.click();
  }
});

pvpButton.addEventListener("click", () => {
  overlay.classList.toggle("displayNone");
  pveButton.classList.toggle("displayNone");
  pvpButton.classList.toggle("displayNone");
  game = UI.startGame("human");
  textPlayerOne.classList.add("active");
  scorePlayerOne.classList.add("active");
});

bottomBtn.addEventListener("click", () => {
  overlay.classList.toggle("displayNone");
  pveButton.classList.toggle("displayNone");
  pvpButton.classList.toggle("displayNone");
  game["board"].clearBoard();
  UI.clearBoard();
  game = UI.startGame();
  scorePlayerOne.textContent = 0;
  scorePlayerTwo.textContent = 0;
});

pveButton.addEventListener("click", () => {
  game = UI.startGame("AI");
  overlay.classList.toggle("displayNone");
  pveButton.classList.toggle("displayNone");
  pvpButton.classList.toggle("displayNone");
});
