class Sign {
  static X = "x";
  static O = "o";
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
}

class GameBoard {
  constructor() {
    this.gameBoard = [];
  }

  inizializeGameBoard() {
    for (let i = 0; i < 9; i++) {
      this.gameBoard.push(new Tile());
    }
  }

  getTile(coordinateNumber) {
    return this.gameBoard.find(
      (tile) => tile.getCoordinateNumber() == coordinateNumber
    );
  }

  displayTiles() {
    for (let tile of this.gameBoard) {
      console.log(tile.getSignValue() + ": " + tile.getCoordinateNumber());
    }
  }
}

class UI {
  static startGame() {} //add eventlistener on click to start the game (create board and players)

  static checkTileContent(gameBoard, coordinateNumber) {
    return gameBoard.getTile(coordinateNumber).getSignValue();
  }

  static handleTurns(playerOne, playerTwo) {
    if (playerOne.isMyTurn == true) {
      playerOne.isMyTurn = false;
      playerTwo.isMyTurn = true;
      return playerOne;
    } else if (playerOne.isMyTurn == false) {
      playerOne.isMyTurn = true;
      playerTwo.isMyTurn = false;
      return playerTwo;
    }
  }

  static renderSign(target, player, gameBoard) {
    if (UI.checkTileContent(gameBoard, target.dataset.coordinate)) return;

    const tile = document.querySelector(
      `[data-coordinate="${target.dataset.coordinate}"]`
    );
    player.drawSign(target.dataset.coordinate, gameBoard);

    const sign = document.createTextNode(player.getSign());

    tile.appendChild(sign);
    board.displayTiles();
  }

  static checkForWinner(gameBoard) {}
}

const board = new GameBoard();
board.inizializeGameBoard();
const playerOne = new Player(Sign.X);
const playerTwo = new Player(Sign.O);

/* playerOne.isMyTurn = false; */

const tiles = document.querySelector(".grid");
tiles.addEventListener("click", (e) => {
  if (UI.checkTileContent(board, e.target.dataset.coordinate)) return; //if not "" return;
  UI.renderSign(e.target, UI.handleTurns(playerOne, playerTwo), board);
  UI.checkForWinner(board);
});
