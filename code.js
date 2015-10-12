var canvas = document.getElementById("imgCanvas");
var context = canvas.getContext("2d");
player = 1;
gameState = new Array(8);
stateX = 0;
stateY = 0;

initField();
drawGrid();

function initField() {
    for (var i = 0; i < 8; i++) {
        gameState[i] = new Array(8);
        for (var i2 = 0; i2 < 8; i2++) {
            gameState[i][i2] = 0;
        }
    }
}


function drawGrid() {
    for (py = 50; py <= 350; py = py + 50) {
        context.moveTo(0, py);
        context.lineTo(400, py);
        context.stroke();
    }
    for (px = 50; px <= 350; px = px + 50) {
        context.moveTo(px, 0);
        context.lineTo(px, 400);
        context.stroke();
    }
}

function draw(e) {
    var pos = getMousePos(canvas, e);
    calcPos(pos);

    context.fillStyle = player == 1 ? "#FF0000" : "#000000";
    context.beginPath();
    context.arc(posx, posy, 22, 0, 2 * Math.PI);
    context.fill();

    checkNeighbours();

    // swap players
    player = player == 1 ? 2 : 1;
}

function calcPos(pos) {
    stateX = Math.floor(pos.x / 50);
    stateY = 0;

    // let current chip "fall down"
    for (var i = 7; i >= 0; i--) {
        if (gameState[stateX][i] != 0) {
            stateY = i + 1;
            break;
        }
    }

    // set chip position
    gameState[stateX][stateY] = player;

    posx = stateX * 50 + 25;
    posy = Math.abs(stateY - 7) * 50 + 25; // invert for drawing
}

function checkNeighbours() {
    // check half of the directions
    if (checkPath(stateX, stateY, 0, 1, 1, false)) return;
    if (checkPath(stateX, stateY, 1, 1, 1, false)) return;
    if (checkPath(stateX, stateY, 1, 0, 1, false)) return;
    if (checkPath(stateX, stateY, 1, -1, 1, false)) return;
}

function checkPath(lastPosX, lastPosY, diffX, diffY, lastCount, turned) {
    // check field bounds and correct color
    newPosX = lastPosX + diffX;
    newPosY = lastPosY + diffY;

    console.log("dX: " + diffX + ", dY:" + diffY);
    if (newPosX < 0 || newPosX > 7 || newPosY < 0 || newPosY > 7 || gameState[newPosX][newPosY] != player) {

        // try different direction if it wasn't done already
        if (turned == false) {
            console.log("Turned!");
            otherDirX = diffX - 2 * diffX;
            otherDirY = diffY - 2 * diffY;
            return checkPath(lastPosX, lastPosY, otherDirX, otherDirY, 1, true);
        }
        console.log("Stop!");
        return false;
    }

    // return true if player has 4 in a line (including new field)
    if (lastCount == 3) {
        window.alert("Gewonnen!");
        return true;
    }

    checkPath(newPosX, newPosY, diffX, diffY, lastCount + 1, turned);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

window.draw = draw;
