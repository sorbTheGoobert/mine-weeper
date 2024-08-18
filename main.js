const weeper = document.getElementById("weeper");
const ctx = weeper.getContext("2d");
const gameSize = 16;
const cellSize = 50;
const cellGap = 5;

function init() {
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 100, 885, 885);
    ctx.fillStyle = "#000000"
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(10 + 295 + 97.5, 10, 80, 80);
    ctx.fillStyle = "#000000"
    ctx.fillRect(10 + 295 + 97.5 + 80 + 97.5 + 95, 10, 200, 80);
    ctx.fillStyle = "#A0A0A0";
    ctx.translate(0, 100);
    for (let i = 0; i < gameSize; i++) {
        for (let j = 0; j < gameSize; j++) {
            ctx.fillRect(i * cellSize + (i + 1) * cellGap, j * cellSize + (j + 1) * cellGap, cellSize, cellSize);
        }
    }
    console.log("Initialized");
}

window.onload = init();
