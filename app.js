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
    this.gameBoard = [
      [, ,],
      [, ,],
      [, ,],
    ];
  }

  inizializeGameBoard() {
    /* for (let i = 0; i < 9; i++) {
      this.gameBoard.push(new Tile());
    } */
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
    /* return this.gameBoard.find(
      (tile) => tile.getCoordinateNumber() == coordinateNumber
    ); */
  }

  displayTiles() {
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

  isFull() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        if (this.gameBoard[i][j] == "") return false;
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
  static startGame() {
    const board = new GameBoard();
    board.inizializeGameBoard();
    const playerOne = new Player(Sign.X);
    const playerTwo = new Player(Sign.O);

    return { board, playerOne, playerTwo };
  } //add eventlistener on click to start the game (create board and players)

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
    gameBoard.displayTiles();
  }

  static checkForWinner(gameBoard, sign) {
    if (
      gameBoard.checkColumns(sign) ||
      gameBoard.checkRows(sign) ||
      gameBoard.checkDiagonals(sign)
    ) {
      console.log("Winner is: " + sign);
    } else if (gameBoard.isFull()) {
      console.log("it's a draw");
    }
  }
}

const game = UI.startGame();

const tiles = document.querySelector(".grid");
tiles.addEventListener("click", (e) => {
  if (UI.checkTileContent(game["board"], e.target.dataset.coordinate)) return; //if not "" return;
  UI.renderSign(
    e.target,
    UI.handleTurns(game["playerOne"], game["playerTwo"]),
    game["board"]
  );

  UI.handleTurns(game["playerOne"], game["playerTwo"]);
  const sign = UI.handleTurns(game["playerOne"], game["playerTwo"]).getSign();

  UI.checkForWinner(game["board"], sign);
});
