//declarations

const weeper = document.getElementById("weeper");
const ctx = weeper.getContext("2d");
const gameSize = 16;
const cellSize = 50;
const cellGap = 5;
const totalMines = 40;
let wonGame = false;
let flagsLeft = totalMines;
let timer = 0;
let gameOver = false;
let doneAnimation = true;
let firstTime = true;

// sprites
const smiley = document.getElementById("smiley:D");
const angy = document.getElementById("whathaveyoudone");
const yippee = document.getElementById("yippee");

const WRONG = new Audio("./assets/WRONG.mp3");
WRONG.volume = 0.1;
const beep = new Audio("./assets/WRONG.mp3");
beep.volume = 0.01
const vectorye = new Audio("./assets/vectorye.mp3");
vectorye.volume = 0.25;
const ost = new Audio("./assets/famoussongplayedbeforedisaster.mp3");
try {
  ost.loop = true;
} catch (error) {
  try {
    ost.addEventListener(
      "ended",
      function () {
        console.log("started");
        this.currentTime = 0;
        this.play();
      },
      false
    );
  } catch (error2) {
    console.log(error2);
  }
}
// Lore(yes cuz why not): war happen, we win, you clean lmao

// // debug stuff
// let mouseXPos;
// let mouseYPos;
// let x;
// let y;

class Mine {
  constructor(state, x, y) {
    this.state = state; // 0 = empty, 1 = has mines around, -1 = mine
    this.visible = false;
    this.size = 50;
    this.xPos = x;
    this.yPos = y;
    this.mineSprite = document.getElementById("bumbastic");
    this.closeMines = 0;
    this.flagSprite = document.getElementById("ERH");
    this.flagged = false;
  }
  draw = () => {
    if (!this.visible) {
      if (this.flagged) {
        ctx.drawImage(
          this.flagSprite,
          this.xPos * this.size + cellGap * (this.xPos + 1),
          this.yPos * this.size + cellGap * (this.yPos + 1) + 100,
          50,
          50
        );
      } else {
        ctx.fillStyle = "#F0F0F0";
        ctx.fillRect(
          this.xPos * this.size + cellGap * (this.xPos + 1),
          this.yPos * this.size + cellGap * (this.yPos + 1) + 100,
          this.size,
          this.size
        );
      }
    } else {
      ctx.fillStyle = "#A0A0A0";
      ctx.fillRect(
        this.xPos * this.size + cellGap * (this.xPos + 1),
        this.yPos * this.size + cellGap * (this.yPos + 1) + 100,
        this.size,
        this.size
      );
      if (this.state === 1) {
        ctx.fillRect(
          this.xPos * this.size + cellGap * (this.xPos + 1),
          this.yPos * this.size + cellGap * (this.yPos + 1) + 100,
          this.size,
          this.size
        );
        ctx.font = `24px mine-sweeper`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        switch (this.closeMines) {
          case 1:
            ctx.fillStyle = "rgb(0, 0, 255)";
            break;
          case 2:
            ctx.fillStyle = "rgb(0, 255, 0)";
            break;
          case 3:
            ctx.fillStyle = "rgb(255, 0, 0)";
            break;
          case 4:
            ctx.fillStyle = "rgb(0, 0, 139)";
            break;
          case 5:
            ctx.fillStyle = "rgb(150, 75, 0)";
            break;
          case 6:
            ctx.fillStyle = "rgb(0, 255, 255)";
            break;
          case 7:
            ctx.fillStyle = "rgb(0, 0, 0)";
            break;
          case 8:
            ctx.fillStyle = "rgb(128, 128, 128)";
            break;
        }
        ctx.fillText(
          this.closeMines,
          this.xPos * this.size + cellGap * (this.xPos + 1) + 25,
          this.yPos * this.size + cellGap * (this.yPos + 1) + 27 + 100
        );
      } else if (this.state === -1) {
        ctx.drawImage(
          this.mineSprite,
          this.xPos * this.size + cellGap * (this.xPos + 1),
          this.yPos * this.size + cellGap * (this.yPos + 1) + 100,
          50,
          50
        );
      }
    }
  };
  clickityClack = () => {
    this.visible = true;
    if (this.state === -1) {
      gameOver = true;
      clearInterval(timerInter);
      WRONG.play();
      displayGameOver();
    }
    if (this.state === 0) {
      // cells[this.yPos * 16 + this.xPos].clickityClack();
      // top
      if (
        this.yPos > 0 &&
        this.xPos > 0 &&
        cells[this.yPos * 16 + this.xPos - 17].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos - 17].clickityClack();
      }
      if (
        this.yPos > 0 &&
        cells[this.yPos * 16 + this.xPos - 16].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos - 16].clickityClack();
      }
      if (
        this.yPos > 0 &&
        this.xPos < 15 &&
        cells[this.yPos * 16 + this.xPos - 15].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos - 15].clickityClack();
      }

      // same line
      if (
        this.xPos > 0 &&
        cells[this.yPos * 16 + this.xPos - 1].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos - 1].clickityClack();
      }
      if (
        this.xPos < 15 &&
        cells[this.yPos * 16 + this.xPos + 1].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos + 1].clickityClack();
      }

      // down
      if (
        this.yPos < 15 &&
        this.xPos > 0 &&
        cells[this.yPos * 16 + this.xPos + 15].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos + 15].clickityClack();
      }
      if (
        this.yPos < 15 &&
        cells[this.yPos * 16 + this.xPos + 16].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos + 16].clickityClack();
      }
      if (
        this.yPos < 15 &&
        this.xPos < 15 &&
        cells[this.yPos * 16 + this.xPos + 17].visible === false
      ) {
        cells[this.yPos * 16 + this.xPos + 17].clickityClack();
      }
    } else if (this.state === 1) {
      checkIfWon();
    }
  };
}

weeper.oncontextmenu = function () {
  return false;
};

weeper.addEventListener("mousedown", (event) => {
  let mouseXPos = event.offsetX;
  let mouseYPos = event.offsetY;
  let x = Math.floor(mouseXPos / (cellSize + cellGap));
  let y = Math.floor((mouseYPos - 100) / (cellSize + cellGap));
  // why do i have to do this????
  if (firstTime) {
    ost.play();
    firstTime = false;
  }
  if (x < 0 || x > 15 || y < 0 || y > 15) {
    if (
      mouseXPos >= 10 + 295 + 97.5 &&
      mouseXPos <= 10 + 295 + 97.5 + 80 &&
      mouseYPos >= 10 &&
      mouseYPos <= 90 &&
      doneAnimation
    ) {
      console.log(doneAnimation);
      clearInterval(timerInter);
      init();
    }
    return null;
  }
  if (gameOver) {
    return null;
  }
  if (event.button === 0 && cells[y * 16 + x].visible === false) {
    if (cells[y * 16 + x].flagged === true) {
      return null;
    }
    cells[y * 16 + x].clickityClack();
  } else if (event.button === 2) {
    if (cells[y * 16 + x].visible == true) {
      return null;
    }
    if (cells[y * 16 + x].flagged === false) {
      if (flagsLeft === 0) {
        return null;
      }
      cells[y * 16 + x].flagged = true;
      flagsLeft--;
    } else {
      cells[y * 16 + x].flagged = false;
      flagsLeft++;
    }
  }
});

function checkIfWon() {
  if (cells.filter((elem) => !elem.visible).length == totalMines) {
    wonGame = true;
    vectorye.play();
    clearInterval(timerInter);
    displayWon();
  }
}

function displayWon() {
  ctx.clearRect(0, 0, 885, 985);
  drawGUI(false, true);
  drawGame();
}

function drawGUI(lost, won) {
  lost = lost || false;
  won = won || false;

  ctx.globalAlpha = 1;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 8085, 985);

  ctx.fillStyle = "#000000";
  ctx.fillRect(10, 10, 200, 80);
  ctx.fillRect(10 + 295 + 97.5 + 80 + 97.5 + 95, 10, 200, 80);

  ctx.font = "72px hudFont";
  ctx.textBaseline = "middle";
  ctx.textAlign = "end";
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillText(flagsLeft, 10 + 200 - 5, 58);
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillText(
    Math.floor(timer / 60),
    10 + 295 + 97.5 + 80 + 97.5 + 95 + 200 - 5,
    58
  );
  ctx.fillStyle = "#F0F0F0";

  if (!lost && !won) {
    ctx.drawImage(smiley, 10 + 295 + 97.5, 10, 80, 80);
  } else if (lost) {
    ctx.drawImage(angy, 10 + 295 + 97.5, 10, 80, 80);
  } else if (won) {
    ctx.drawImage(yippee, 10 + 295 + 97.5, 10, 80, 80);
  }
}

const cells = [];

function generateMines() {
  let random = totalMines;
  let randomIndex = [];
  while (random) {
    let randomNum = Math.floor(Math.random() * 16 * 16);
    while (randomIndex.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * 16 * 16);
    }
    randomIndex.push(randomNum);
    random--;
  }
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      if (randomIndex.includes(row * 16 + col)) {
        cells.push(new Mine(-1, col, row));
      } else {
        cells.push(new Mine(0, col, row));
      }
    }
  }
}

function inititializeMines() {
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      if (cells[row * 16 + col].state !== -1) {
        // top
        if (row > 0 && col > 0 && cells[row * 16 + col - 17].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }
        if (row > 0 && cells[row * 16 + col - 16].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }
        if (row > 0 && col < 15 && cells[row * 16 + col - 15].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }

        // same line
        if (col > 0 && cells[row * 16 + col - 1].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }
        if (col < 15 && cells[row * 16 + col + 1].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }

        // down
        if (row < 15 && col > 0 && cells[row * 16 + col + 15].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }
        if (row < 15 && cells[row * 16 + col + 16].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }
        if (row < 15 && col < 15 && cells[row * 16 + col + 17].state === -1) {
          cells[row * 16 + col].closeMines++;
          cells[row * 16 + col].state = 1;
        }
      }
    }
  }
}

function drawGame() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 100, 885, 885);
  ctx.fillStyle = "#F0F0F0";
  for (let row = 0; row < gameSize; row++) {
    for (let col = 0; col < gameSize; col++) {
      cells[row * 16 + col].draw();
    }
  }
}

function displayGameOver() {
  ctx.clearRect(0, 0, 885, 985);
  ctx.globalAlpha = 1;
  doneAnimation = false;
  for (let amountOfAlpha = 100; amountOfAlpha >= 0; amountOfAlpha -= 0.25) {
    setTimeout(() => {
      ctx.globalAlpha = 1;
      drawGUI(true);
      drawGame();
      ctx.globalAlpha = amountOfAlpha / 100;
      ctx.drawImage(document.getElementById("ERH"), 0, 0, 885, 985);
    }, 1000 / 60);
  }
  doneAnimation = true;
  ctx.globalAlpha = 1;
}

function init() {
  ctx.globalAlpha = 1;
  while (cells.length) {
    cells.pop();
  }
  flagsLeft = totalMines;
  timer = 0;
  gameOver = false;
  won = false;
  drawGUI();
  generateMines();
  inititializeMines();
  drawGame();
  timerInter = setInterval(() => {
    ctx.clearRect(0, 0, 885, 985);
    timer++;
    drawGUI();
    drawGame();
  }, 1000 / 60);
}

window.onload = init();
