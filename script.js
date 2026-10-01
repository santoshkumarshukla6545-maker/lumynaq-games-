/* =========================================================
   LUMYNAQ GAMES
   TIC TAC TOE
   FAST MOBILE GAME ENGINE
   ========================================================= */

"use strict";


/* ---------------------------------------------------------
   ELEMENTS
--------------------------------------------------------- */

const gameBoard =
  document.getElementById("gameBoard");


const cells =
  Array.from(
    document.querySelectorAll(".cell")
  );


const playerXCard =
  document.getElementById("playerXCard");


const playerOCard =
  document.getElementById("playerOCard");


const scoreXElement =
  document.getElementById("scoreX");


const scoreOElement =
  document.getElementById("scoreO");


const roundElement =
  document.getElementById("roundNumber");


const statusX =
  document.getElementById("statusX");


const statusO =
  document.getElementById("statusO");


const turnText =
  document.getElementById("turnText");


const turnIndicator =
  document.getElementById("turnIndicator");


const resultCard =
  document.getElementById("resultCard");


const resultIcon =
  document.getElementById("resultIcon");


const resultTitle =
  document.getElementById("resultTitle");


const resultDescription =
  document.getElementById(
    "resultDescription"
  );


const newRoundButton =
  document.getElementById(
    "newRoundButton"
  );


const resetButton =
  document.getElementById(
    "resetButton"
  );


const winningLine =
  document.getElementById(
    "winningLine"
  );


const yearElement =
  document.getElementById(
    "year"
  );


/* ---------------------------------------------------------
   CONSTANTS
--------------------------------------------------------- */

const STORAGE_KEY =
  "lumynaq_tictactoe_v3";


const WIN_PATTERNS = [

  [0, 1, 2],

  [3, 4, 5],

  [6, 7, 8],

  [0, 3, 6],

  [1, 4, 7],

  [2, 5, 8],

  [0, 4, 8],

  [2, 4, 6]

];


/* ---------------------------------------------------------
   GAME STATE
--------------------------------------------------------- */

let board = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
];


let currentPlayer = "X";


let gameActive = true;


let scoreX = 0;


let scoreO = 0;


let round = 1;


/*
   This prevents the same physical touch from
   being processed twice on some older browsers.
*/

let lastPointerTime = 0;


let lastPointerIndex = -1;


/* ---------------------------------------------------------
   SAVE
--------------------------------------------------------- */

function saveGame() {

  const data = {

    board,

    currentPlayer,

    gameActive,

    scoreX,

    scoreO,

    round

  };


  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

  } catch (error) {

    /*
      Storage is optional.
      The game itself continues working.
    */

  }

}


/* ---------------------------------------------------------
   LOAD
--------------------------------------------------------- */

function loadGame() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!saved) {

      return;

    }


    const data =
      JSON.parse(saved);


    if (
      !data ||
      typeof data !== "object"
    ) {

      return;

    }


    if (
      Array.isArray(data.board) &&
      data.board.length === 9
    ) {

      board =
        data.board.map(value => {

          if (value === "X") {

            return "X";

          }


          if (value === "O") {

            return "O";

          }


          return "";

        });

    }


    currentPlayer =
      data.currentPlayer === "O"
        ? "O"
        : "X";


    gameActive =
      data.gameActive !== false;


    scoreX =
      Number.isFinite(
        Number(data.scoreX)
      )
        ? Math.max(
            0,
            Number(data.scoreX)
          )
        : 0;


    scoreO =
      Number.isFinite(
        Number(data.scoreO)
      )
        ? Math.max(
            0,
            Number(data.scoreO)
          )
        : 0;


    round =
      Number.isFinite(
        Number(data.round)
      )
        ? Math.max(
            1,
            Number(data.round)
          )
        : 1;


    const winner =
      findWinner();


    if (winner) {

      gameActive = false;

    }


    if (
      !winner &&
      board.every(
        value => value !== ""
      )
    ) {

      gameActive = false;

    }

  } catch (error) {

    /*
      If old/corrupt storage exists,
      start with a clean game.
    */

    board = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ];

    currentPlayer = "X";

    gameActive = true;

  }

}


/* ---------------------------------------------------------
   WINNER
--------------------------------------------------------- */

function findWinner() {

  for (
    let i = 0;
    i < WIN_PATTERNS.length;
    i++
  ) {

    const pattern =
      WIN_PATTERNS[i];


    const a =
      pattern[0];


    const b =
      pattern[1];


    const c =
      pattern[2];


    if (

      board[a] !== "" &&

      board[a] === board[b] &&

      board[b] === board[c]

    ) {

      return {

        player: board[a],

        pattern

      };

    }

  }


  return null;

}


/* ---------------------------------------------------------
   DRAW
--------------------------------------------------------- */

function isDraw() {

  return (
    board.every(
      value => value !== ""
    ) &&
    findWinner() === null
  );

}


/* ---------------------------------------------------------
   DRAW BOARD
--------------------------------------------------------- */

function renderBoard() {

  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const cell =
      cells[i];


    const value =
      board[i];


    cell.classList.remove(
      "x",
      "o",
      "taken",
      "winner"
    );


    if (value === "") {

      cell.setAttribute(
        "aria-label",
        `Cell ${i + 1}`
      );

      cell.setAttribute(
        "aria-pressed",
        "false"
      );

      continue;

    }


    cell.classList.add(
      value.toLowerCase(),
      "taken"
    );


    cell.setAttribute(
      "aria-label",
      `Cell ${i + 1}, ${value}`
    );


    cell.setAttribute(
      "aria-pressed",
      "true"
    );

  }

}


/* ---------------------------------------------------------
   TURN UI
--------------------------------------------------------- */

function renderTurn() {

  const isX =
    currentPlayer === "X";


  playerXCard.classList.toggle(
    "active",
    isX
  );


  playerOCard.classList.toggle(
    "active",
    !isX
  );


  statusX.textContent =
    isX
      ? "YOUR TURN"
      : "WAITING";


  statusO.textContent =
    !isX
      ? "YOUR TURN"
      : "WAITING";


  turnText.textContent =
    `Player ${currentPlayer}'s turn`;


  if (isX) {

    turnIndicator.style.background =
      "var(--cyan)";

    turnIndicator.style.boxShadow =
      "0 0 12px rgba(32,231,255,.65)";

  } else {

    turnIndicator.style.background =
      "var(--purple)";

    turnIndicator.style.boxShadow =
      "0 0 12px rgba(225,60,255,.65)";

  }

}


/* ---------------------------------------------------------
   SCORE UI
--------------------------------------------------------- */

function renderScore() {

  scoreXElement.textContent =
    String(scoreX);


  scoreOElement.textContent =
    String(scoreO);


  roundElement.textContent =
    String(round);

}


/* ---------------------------------------------------------
   HIDE RESULT
--------------------------------------------------------- */

function hideResult() {

  resultCard.classList.add(
    "hidden"
  );


  winningLine.classList.remove(
    "show"
  );

}


/* ---------------------------------------------------------
   SHOW WIN
--------------------------------------------------------- */

function showWinner(
  winner
) {

  const player =
    winner.player;


  for (
    let i = 0;
    i < winner.pattern.length;
    i++
  ) {

    const index =
      winner.pattern[i];


    cells[index].classList.add(
      "winner"
    );

  }


  resultCard.classList.remove(
    "hidden"
  );


  resultIcon.textContent =
    player === "X"
      ? "✦"
      : "✧";


  resultTitle.textContent =
    `Player ${player} Wins`;


  resultDescription.textContent =
    "Three in a row! Great round.";


  /*
    Draw line after the browser has
    painted the winning cells.
  */

  requestAnimationFrame(
    () => {

      drawWinningLine(
        winner.pattern
      );

    }
  );

}


/* ---------------------------------------------------------
   SHOW DRAW
--------------------------------------------------------- */

function showDraw() {

  resultCard.classList.remove(
    "hidden"
  );


  resultIcon.textContent =
    "•";


  resultTitle.textContent =
    "It's a Draw";


  resultDescription.textContent =
    "The board is full. Try another round.";

}


/* ---------------------------------------------------------
   WINNING LINE
--------------------------------------------------------- */

function drawWinningLine(
  pattern
) {

  if (
    !pattern ||
    pattern.length !== 3
  ) {

    return;

  }


  const boardRect =
    gameBoard.getBoundingClientRect();


  const first =
    cells[pattern[0]]
      .getBoundingClientRect();


  const last =
    cells[pattern[2]]
      .getBoundingClientRect();


  const startX =
    first.left +
    first.width / 2 -
    boardRect.left;


  const startY =
    first.top +
    first.height / 2 -
    boardRect.top;


  const endX =
    last.left +
    last.width / 2 -
    boardRect.left;


  const endY =
    last.top +
    last.height / 2 -
    boardRect.top;


  const dx =
    endX - startX;


  const dy =
    endY - startY;


  const length =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  const angle =
    Math.atan2(
      dy,
      dx
    ) *
    180 /
    Math.PI;


  winningLine.style.left =
    `${startX}px`;


  winningLine.style.top =
    `${startY}px`;


  winningLine.style.width =
    `${length}px`;


  winningLine.style.transform =
    `translateY(-50%) rotate(${angle}deg)`;


  winningLine.classList.add(
    "show"
  );

}


/* ---------------------------------------------------------
   MAKE MOVE
--------------------------------------------------------- */

function makeMove(
  index
) {

  /*
    Invalid game state:
    do absolutely nothing.
  */

  if (!gameActive) {

    return;

  }


  /*
    Invalid index:
    do nothing.
  */

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8
  ) {

    return;

  }


  /*
    Occupied cell:
    do nothing.
  */

  if (board[index] !== "") {

    return;

  }


  /*
    ACTUAL MOVE
  */

  board[index] =
    currentPlayer;


  /*
    Immediately render the mark.
  */

  renderBoard();


  /*
    Check winner.
  */

  const winner =
    findWinner();


  if (winner) {

    gameActive = false;


    if (
      winner.player === "X"
    ) {

      scoreX++;

    } else {

      scoreO++;

    }


    renderScore();

    showWinner(winner);

    saveGame();

    return;

  }


  /*
    Check draw.
  */

  if (isDraw()) {

    gameActive = false;


    renderScore();

    showDraw();

    saveGame();

    return;

  }


  /*
    Change player.
  */

  currentPlayer =
    currentPlayer === "X"
      ? "O"
      : "X";


  /*
    Update turn UI.
  */

  renderTurn();


  /*
    Save.
  */

  saveGame();

}


/* ---------------------------------------------------------
   FAST POINTER HANDLER
--------------------------------------------------------- */

function handlePointerDown(
  event
) {

  /*
    Only accept the primary touch/mouse pointer.
  */

  if (
    event.isPrimary === false
  ) {

    return;

  }


  const cell =
    event.target.closest(
      ".cell"
    );


  if (!cell) {

    return;

  }


  /*
    Make absolutely sure the
    clicked element belongs to
    this board.
  */

  if (
    !gameBoard.contains(cell)
  ) {

    return;

  }


  const index =
    Number(
      cell.dataset.index
    );


  /*
    Prevent duplicate pointer
    processing on some old Android
    browser implementations.
  */

  const now =
    performance.now();


  if (
    index === lastPointerIndex &&
    now - lastPointerTime < 120
  ) {

    return;

  }


  lastPointerIndex =
    index;


  lastPointerTime =
    now;


  event.preventDefault();


  makeMove(index);

}


/* ---------------------------------------------------------
   KEYBOARD
--------------------------------------------------------- */

function handleKeyDown(
  event
) {

  if (
    event.key !== "Enter" &&
    event.key !== " "
  ) {

    return;

  }


  const cell =
    event.target.closest(
      ".cell"
    );


  if (!cell) {

    return;

  }


  event.preventDefault();


  const index =
    Number(
      cell.dataset.index
    );


  makeMove(index);

}


/* ---------------------------------------------------------
   NEW ROUND
--------------------------------------------------------- */

function newRound() {

  board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ];


  currentPlayer = "X";


  gameActive = true;


  round++;


  hideResult();


  renderBoard();


  renderTurn();


  renderScore();


  saveGame();

}


/* ---------------------------------------------------------
   RESET
--------------------------------------------------------- */

function resetGame() {

  board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ];


  currentPlayer = "X";


  gameActive = true;


  scoreX = 0;


  scoreO = 0;


  round = 1;


  hideResult();


  renderBoard();


  renderTurn();


  renderScore();


  saveGame();

}


/* ---------------------------------------------------------
   EVENT LISTENERS
--------------------------------------------------------- */

/*
   ONE listener for the entire board.
   This is lighter and safer than nine
   separate touch handlers.
*/

gameBoard.addEventListener(
  "pointerdown",
  handlePointerDown,
  {
    passive: false
  }
);


/*
   Keyboard support.
*/

gameBoard.addEventListener(
  "keydown",
  handleKeyDown
);


/*
   Buttons.
*/

newRoundButton.addEventListener(
  "click",
  newRound
);


resetButton.addEventListener(
  "click",
  resetGame
);


/* ---------------------------------------------------------
   RESIZE
--------------------------------------------------------- */

let resizeTimer = null;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        () => {

          const winner =
            findWinner();


          if (
            winner &&
            !gameActive
          ) {

            drawWinningLine(
              winner.pattern
            );

          }

        },
        100
      );

  },
  {
    passive: true
  }
);


/* ---------------------------------------------------------
   INITIALIZE
--------------------------------------------------------- */

function initialize() {

  yearElement.textContent =
    String(
      new Date().getFullYear()
    );


  loadGame();


  renderBoard();


  renderTurn();


  renderScore();


  const winner =
    findWinner();


  if (winner) {

    gameActive = false;

    showWinner(winner);

    return;

  }


  if (isDraw()) {

    gameActive = false;

    showDraw();

    return;

  }


  hideResult();

}


/* START */

initialize();
