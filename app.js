class Sign {
  static X = "x";
  static O = "o";
}

class Tile {
  static counter = 0;

  constructor(signValue = "") {
    this.sign = signValue;
    this.coordinateNumber = ++Tile.counter;
    /* console.log(this.coordinateNumber); */
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

class UI {}

const board = new GameBoard();
board.inizializeGameBoard();

const playerOne = new Player(Sign.X);
const playerTwo = new Player(Sign.O);

playerOne.drawSign(1, board);
playerTwo.drawSign(6, board);
playerOne.drawSign(4, board);
playerTwo.drawSign(4, board);

board.displayTiles();
