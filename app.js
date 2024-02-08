const gamesBoard = document.querySelector("#gameboard");
const optionContainer = document.querySelector(".option");
const flipButton = document.querySelector("#flip");
const subamraines = document.querySelectorAll(".draggable");
const startButton = document.querySelector("#start");
const infoDisplay = document.querySelector("#info");
const turnDisplay = document.querySelector("#turn-display");
// board
const width = 50;

function createBoard(color, user) {
  const board = document.createElement("div");
  board.classList.add("game-board");
  board.style.backgroundColor = color;
  board.id = user;
  gamesBoard.append(board);

  for (let i = 0; i <= 63; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    board.append(block);
  }
}
createBoard("lightblue", "player");
createBoard("lightblue", "computer");

//  flip   //

flipButton.addEventListener("click", flip);

let angle = 0;
function flip() {
  const optionShips = Array.from(optionContainer.children);
  if (angle === 0) {
    angle = 90;
  } else {
    angle = 0;
  }
  optionShips.forEach(function (optionShip) {
    optionShip.style.transform = `rotate(${angle}deg)`;
  });
}

// ships

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}
const ship1 = new Ship("ship1", 2);
const ship2 = new Ship("ship2", 2);
const ship3 = new Ship("ship3", 3);
const ship4 = new Ship("ship4", 3);
const ship5 = new Ship("ship5", 4);

const ships = [ship1, ship2, ship3, ship4, ship5];

function addShipPiece(ship) {
  const allBoardBlocks = document.querySelectorAll("#computer .block");
  const width = 8;
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = randomBoolean;
  let maxRandomStartIndex;

  if (isHorizontal) {
    maxRandomStartIndex = width * width - ship.length;
  } else {
    maxRandomStartIndex = width * (width - ship.length);
  }

  let randomStartIndex = Math.floor(Math.random() * (maxRandomStartIndex + 1));

  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[randomStartIndex + i]);
    } else {
      shipBlocks.push(allBoardBlocks[randomStartIndex + i * width]);
    }
  }

  const isInvalidPlacement = shipBlocks.some((block) =>
    block.classList.contains("taken")
  );

  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains("taken")
  );

  let outOfBorders = false;

  if (isHorizontal) {
    outOfBorders = shipBlocks.some(
      (shipBlock, index) =>
        shipBlock.id % width === width - 1 && index !== ship.length - 1
    );
  }

  if (!isInvalidPlacement && notTaken && !outOfBorders) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    addShipPiece(ship);
  }
}

ships.forEach((ship) => addShipPiece(ship));

// dragShips //

subamraines.forEach((submarine) => {
  submarine.draggable = true;
  submarine.addEventListener("dragstart", dragStart);
});

gamesBoard.addEventListener("dragover", dragOver);
gamesBoard.addEventListener("drop", drop);

let draggedSubmarine = null;

function dragStart(e) {
  draggedSubmarine = this;
  e.dataTransfer.setData("text/plain", this.id);
}

function dragOver(e) {
  e.preventDefault();
}
// drop funqciashi aris xarvezi s
function drop(e) {
  e.preventDefault();
  const submarineId = e.dataTransfer.getData("text/plain");
  const submarine = document.getElementById(submarineId);
  const targetBlock = e.target;

  if (!targetBlock.classList.contains("taken")) {
    targetBlock.appendChild(submarine);
    submarine.classList.add("taken");
  }
}

// gameLogic

let gameOver = false;
let playerTurn;

//start game

startButton.addEventListener("click", startGame);

function startGame() {
  if (optionContainer.children.length != 0) {
    infoDisplay.textContent = "place your ships first";
  } else {
    const allBoardBlocks = document.querySelectorAll("#computer div");
    allBoardBlocks.forEach((block) => {
      block.addEventListener("click", handleClick);
      infoDisplay.textContent = "gadatene zarbazani ";
    });
  }
  let playerHits = [];

  const playerSunkShips = [];

  function handleClick(e) {
    if (!gameOver) {
      if (e.target.classList.contains("taken")) {
        e.target.classList.add("boom");
        infoDisplay.textContent = "you hit the ship";
        let classes = Array.from(e.target.classList);
        classes = classes.filter((className) => className !== "block");
        classes = classes.filter((className) => className !== "boom");
        classes = classes.filter((className) => className !== "taken");
        playerHits.push(...classes);
      }
      if (!e.target.ClassList.contains("taken")) {
        infoDisplay.textContent = "nothing hit this time";
        e.target.classList.add("empty");
      }
      playerTurn = false;
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.replaceWith(block.cloneNode(ture))
      );
    }
  }
}
