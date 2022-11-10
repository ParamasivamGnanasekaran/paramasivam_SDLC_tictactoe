import { updateResult } from "./service.js";

let game;
const X = "X";
const CIRCLE = "O";
let circleTurn = false;
let origBoard;
let huPlayer = "O";
let aiPlayer = "X";
let player1 = 0;
let player2 = 0;
let computer = 0;
let firstPlayer;
let data;
let history = {};
let finalArray = [];
let showingHistory;
let nextAdd = 0;
let tieBreak = true;
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6],
];
const cells = document.querySelectorAll(".cell");
let table = document.getElementById("myTable");

/**
 * @description loading game page at starting for the function
 *
 */
function loadPage() {
  data = JSON.parse(localStorage.getItem("data"));
  player1 = data.player1;
  player2 = data.player2;
  computer = data.computer;
  document.getElementById("player1").innerHTML = player1;
  document.getElementById("player2").innerHTML = player2;
  document.getElementById("computer").innerHTML = computer;
  document.getElementById("selectPerson").innerHTML = "Select Symbol";
  document.querySelector(".next").style.display = "none";
  displayHistory();
}

/**
 * @description logout from game app
 */
function logout() {
  window.location = "index.html";
}

/**
 * @description selecting level for the game
 *
 * @param {string} value selected level
 */
function cardfunction(value) {
  game = value;
  if (game === "game") {
    // document.getElementById("player1").innerHTML = 0;
    // document.getElementById("player2").innerHTML = 0;
    // document.getElementById("computer").innerHTML = 0;
    document.getElementById("selectPerson").innerHTML =
      "Selecting Person is Player 1";
  } else {
    document.getElementById("selectPerson").innerHTML = "Select Symbol";
  }

  document.querySelector(".selectSym").style.display = "block";
  startGame();
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  document.querySelector(".next").style.display = "none";
}

/**
 * @description selecting x or o in game
 *
 * @param {string} sym selecting x or o in the game
 */
function selectSym(sym) {
  huPlayer = sym;
  aiPlayer = sym === "O" ? "X" : "O";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", turnClick, false);
  }

  if (game !== "game") {
    if (aiPlayer === "X") {
      turn(bestSpot(), aiPlayer);
    }
  } else if (sym === "O" && game === "game") {
    circleTurn = true;
    firstPlayer = sym;
  } else if (sym === "X" && game === "game") {
    firstPlayer = sym;
  }
  document.querySelector(".selectSym").style.display = "none";
}

/**
 * @description startGame while reset
 *
 */
function startGame() {
  tieBreak = true;
  history = {};
  finalArray = [];
  circleTurn = false;
  document.querySelector(".endgame").style.display = "none";
  document.querySelector(".endgame .text").innerText = "";
  document.querySelector(".selectSym").style.display = "block";
  document.querySelector(".next").style.display = "none";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
  }
}

/**
 * @description closing selection of selecting X or O
 */
function Close() {
  document.querySelector(".selectSym").style.display = "none";
}

/**
 * @description getting selected cell in table
 *
 * @param {event} square get select td in table
 */
function turnClick(square) {
  if (game === "game") {
    const cell = square.target;
    const currentClass = circleTurn ? CIRCLE : X;
    document.getElementById(square.target.id).innerHTML = currentClass;
    finalArray.push({ position: square.target.id, value: currentClass });
    cells[square.target.id].removeEventListener("click", turnClick, false);
    if (checkWinGame(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      // setBoardHoverClass()
    }
  } else {
    if (typeof origBoard[square.target.id] === "number") {
      turn(square.target.id, huPlayer);
      if (!checkWin(origBoard, huPlayer) && !checkTie())
        turn(bestSpot(), aiPlayer);
    }
  }
}

/**
 * @description getting about win or lose
 *
 * @param {number} squareId selected cell index
 * @param {string} player x or o
 */
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  finalArray.push({ position: squareId.toString(), value: player });
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
  checkTie(gameWon);
}

/**
 * @description checking whether win
 *
 * @param {array} board array of filled table
 * @param {string} player x or o
 * @returns object of index and player or null
 */
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

/**
 * @description  after completing game display of the table
 *
 * @param {object} gameWon index and player
 */
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === huPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  if (gameWon.player === huPlayer) {
    player1 = player1 + 1;
    history.time = history.time = createTime();
    history.finalArray = finalArray;
    history.player = "player 1";
    updateLocal();
    updateResult(data.email, player1, player2, computer, history);
    document.getElementById("player1").innerHTML = player1;
    declareWinner("You win!");
  } else {
    computer = computer + 1;
    history.time = createTime();
    history.finalArray = finalArray;
    history.player = "computer";
    updateLocal();
    updateResult(data.email, player1, player2, computer, history);
    document.getElementById("computer").innerHTML = computer;
    declareWinner("You lose");
  }
}

/**
 * @description declaring Winner
 *
 * @param {string} who winner x or o
 */
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
  displayHistory();
}

/**
 * @description getting empty cells in table
 *
 * @returns array of empty cells
 */
function emptySquares() {
  return origBoard.filter((elm, i) => i === elm);
}

/**
 * @description bestspot for next move of computer
 *
 * @returns index of next value moved by computer
 */
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

/**
 * @description checking weather tie or not
 *
 * @param {object} gameWon contains index and player
 * @returns true or false  about game tie or not
 */
function checkTie(gameWon) {
  if (emptySquares().length === 0 && gameWon == null) {
    for (let cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener("click", turnClick, false);
      declareWinner("Tie game");
    }
    if (tieBreak) {
      history.time = createTime();
      history.finalArray = finalArray;
      history.player = "Tie";
      updateLocal();
      updateResult(data.email, player1, player2, computer, history);
      tieBreak = !tieBreak;
    }
    return true;
  }
  return false;
}

/**
 * @description minimax algorthim
 *
 * @param {array} newBoard array of new board after click every time in cell
 * @param {string} player x or o
 * @returns best move for computer
 */
function minimax(newBoard, player) {
  let availSpots = emptySquares(newBoard);
  if (game === "easy") {
    if (checkWin(newBoard, huPlayer)) {
      return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
  } else {
    if (checkWin(newBoard, huPlayer)) {
      return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) move.score = minimax(newBoard, huPlayer).score;
    else move.score = minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if (
      (player === aiPlayer && move.score === 10) ||
      (player === huPlayer && move.score === -10)
    )
      return move;
    else moves.push(move);
  }

  let bestMove, bestScore;
  if (game === "hard" || game == "medium") {
    if (player === aiPlayer) {
      bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
  } else {
    if (player === aiPlayer) {
      bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
  }

  return moves[bestMove];
}

/**
 * @description checking win when dual players are playing
 *
 * @param {string} currentClass player x or o when double player playing
 * @returns true or false whether win or not
 */
function checkWinGame(currentClass) {
  return winCombos.some((combination) => {
    return combination.every((index) => {
      return document.getElementById(index).textContent === currentClass;
    });
  });
}

/**
 * @description check draw for dual player game
 *
 * @returns true or false
 */
function isDraw() {
  let carray = [];
  for (let line = 0; line < table.rows.length; line++) {
    for (let lines = 0; lines < table.rows[line].cells.length; lines++) {
      carray.push(
        table.rows[line].cells[lines].textContent === X ||
          table.rows[line].cells[lines].textContent === CIRCLE
      );
    }
  }
  const isBelowThreshold = (currentValue) => currentValue === true;

  return carray.every(isBelowThreshold);
}

/**
 * @description result for dual player game
 *
 * @param {bool} draw true or false
 */
function endGame(draw) {
  if (draw) {
    history.time = createTime();
    history.finalArray = finalArray;
    history.player = "Tie";
    updateLocal();
    updateResult(data.email, player1, player2, computer, history);
    declareWinner("Tie game");
  } else {
    if (firstPlayer === (circleTurn ? "O" : "X")) {
      player1 = player1 + 1;
      history.time = createTime();
      history.finalArray = finalArray;
      history.player = "player 1";
      updateLocal();
      updateResult(data.email, player1, player2, computer, history);
      document.getElementById("player1").innerHTML = player1;
      declareWinner("Player 1 winner!");
    } else {
      player2 = player2 + 1;
      history.time = createTime();
      history.finalArray = finalArray;
      history.player = "player 2";
      updateLocal();
      updateResult(data.email, player1, player2, computer, history);
      document.getElementById("player2").innerHTML = player2;
      declareWinner("Player 2 winner!");
    }
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
}

/**
 * @description swap x and o while selecting cells in dual player game
 *
 */
function swapTurns() {
  circleTurn = !circleTurn;
}

/**
 * @description deleting score and history
 *
 */
function clearResult() {
  alert("deleting score and history");
  player1 = 0;
  player2 = 0;
  computer = 0;
  document.getElementById("player1").innerHTML = player1;
  document.getElementById("player2").innerHTML = player2;
  document.getElementById("computer").innerHTML = computer;
  updateResult(data.email, player1, player2, computer);
  updateLocal(true);
}

/**
 * @description updating locally
 *
 */
function updateLocal(state) {
  data.player1 = player1;
  data.player2 = player2;
  data.computer = computer;
  if (player1 === 0 && player2 === 0 && computer === 0 && state) {
    data.history = [];
    displayHistory();
  } else {
    data.history.push(history);
  }
  localStorage.setItem("data", JSON.stringify(data));
}

/**
 * @description formatting time to diplayed
 *
 * @returns time to display
 */
function createTime() {
  let currentDate = new Date(new Date().getTime() + 330 * 60 * 1000)
    .toJSON()
    .slice(0, 10);
  let currentTime = new Date(new Date().getTime() + 330 * 60 * 1000)
    .toJSON()
    .slice(11, 19);
  return currentDate + "/" + currentTime;
}

/**
 * @description displaing history
 *
 */
function displayHistory() {
  let card = document.getElementById("Historycard");
  card.innerHTML = "";
  card.innerHTML = "<option value='select' selected>Select</option>";
  for (let i = 0; i < data.history.length; i++) {
    let option = document.createElement("option");
    let displayData = data.history[i].time.split("/");
    option.innerHTML = `Game ${i + 1} at ${displayData[0]} ${displayData[1]}`;
    option.setAttribute("value", data.history[i].time);
    card.add(option);
  }
}

/**
 * @description displaying one by one
 *
 * @param {string} value time string
 */
function gameFunction(value) {
  game = "";
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  if (value === "select") {
    return false;
  }
  startGame();
  nextAdd = 0;
  document.querySelector(".selectSym").style.display = "none";
  for (let i = 0; i < data.history.length; i++) {
    if (value === data.history[i].time) {
      document.querySelector(".next").style.display = "inline-block";
      showingHistory = data.history[i];
    }
  }
}

/**
 * @description displaying one by one when clicking next
 *
 */
function clickNext() {
  if (nextAdd < showingHistory.finalArray.length) {
    document.getElementById(
      showingHistory.finalArray[nextAdd].position
    ).innerHTML = showingHistory.finalArray[nextAdd].value;
    nextAdd = nextAdd + 1;
  } else {
    document.querySelector(".next").style.display = "none";
    if (showingHistory.player === "Tie") {
      declareWinner(showingHistory.player);
    } else {
      declareWinner(`${showingHistory.player} winner`);
    }
  }
}

/**
 * @description Initialize game page section
 *
 * @export {function}
 */
export function gameStart() {
  window.loadPage = loadPage;
  window.selectSym = selectSym;
  window.startGame = startGame;
  window.cardFunction = cardfunction;
  window.gameFunction = gameFunction;
  window.closeData = Close;
  window.clearResult = clearResult;
  window.Logout = logout;
  window.clickNext = clickNext;
}
