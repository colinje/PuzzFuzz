const canvas = document.querySelector('.myCanvas');
const height = canvas.height = window.innerHeight;
const width = canvas.width = (height / 12) * 15;
const ctx = canvas.getContext('2d');

const player1x1 = 0, player1y1 = 0;
const player1x2 = (width / 15) * 6;
const player1y2 = height;
let player1Score = 0;
let player1Board = [['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n'],
['n', 'n', 'n', 'n', 'n', 'n']];

const player2x1 = (width / 15) * 9;
const player2y1 = 0;
const player2x2 = player1x2;
const player2y2 = height;
// let player2Board = [[]];

const dropPattern1 = [['r3','r3','y3','y3','g3','g3'],
['r3','r3','y3','y3','g3','g3'],
['b3','b3','r3','r3','y3','y3'],
['b3','b3','r3','r3','y3','y3']];

const dropPatternDan = [['r3','r3','r3','r3','r3','r3'],
['r3','r3','r3','r3','r3','r3'],
['r3','r3','r3','r3','r3','r3'],
['r3','r3','r3','r3','r3','r3']];

const dropPattern2 = [['r3','y3','g3','b3','r3','g3'],
['r3','y3','g3','b3','r3','g3'],
['r3','y3','g3','b3','r3','g3'],
['r3','y3','g3','b3','r3','g3']];

const gameClockX = player1x2 + 20;

const blockWidth = player1x2 / 6;
const nextPieceX = gameClockX;
const nextPieceY = blockWidth * 3;

let breakerOnBoard = [];
const scoreX = gameClockX, scoreY = blockWidth * 12 - 10;
let changeMade = true, pause = false; // , gameMinutes = 0, gameSeconds = 0;
let recursiveColor = 'r';
let dropHappened = false;
let round = [];
let turnPieces = [];
let comboRunning = false;
let roundTotal = 0;
let frameCount = 1;
let frameDate = Date.now();
let frameLapTime = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

let dropBlockX = 0;
let dropBlockY = 2;
let dropBlockBottomX = 11;
let dropBlockBottomY = 2;
player1Board[dropBlockX][dropBlockY] = generateBlock();
player1Board[dropBlockBottomX][dropBlockBottomY] = 'p' + player1Board[dropBlockX][dropBlockY].charAt(1);
let nextBlock = generateBlock();

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function generateBlock() {
    let blockValue = 'n';
    const color = Math.floor(Math.random() * 100);
    const shape = Math.floor(Math.random() * 100);
    if (color < 25) {
        blockValue = 'r';
    } else if (color >= 25 && color < 50) {
        blockValue = 'g';
    } else if (color >= 50 && color < 75) {
        blockValue = 'b';
    } else if (color >= 75 && color < 100) {
        blockValue = 'y';
    }
    if (shape < 85) {
        blockValue = blockValue + 's';
    } else if (shape >= 85 && shape < 95) {
        blockValue = blockValue + 'c';
    } else if (shape >= 95 && shape < 100) {
        blockValue = 'tt';
    }
    return blockValue;
}

function getConnectedSet(breakerPosition) {
    if (breakerPosition.length === 2) {
        let up = 0, down = 0, left = 0, right = 0;
        player1Board[breakerPosition[0]][breakerPosition[1]] = 'n';
        if (0 <= breakerPosition[0] - 1 && player1Board[breakerPosition[0] - 1][breakerPosition[1]].charAt(0) === recursiveColor) {
            up = getConnectedSet([breakerPosition[0] - 1, breakerPosition[1]]);
        }
        if (player1Board.length > breakerPosition[0] + 1 && player1Board[breakerPosition[0] + 1][breakerPosition[1]].charAt(0) === recursiveColor) {
            down = getConnectedSet([breakerPosition[0] + 1, breakerPosition[1]]);
        }
        if (0 <= breakerPosition[1] - 1 && player1Board[breakerPosition[0]][breakerPosition[1] - 1].charAt(0) === recursiveColor) {
            left = getConnectedSet([breakerPosition[0], breakerPosition[1] - 1]);
        }
        if (player1Board[breakerPosition[0]].length > breakerPosition[1] + 1 && player1Board[breakerPosition[0]][breakerPosition[1] + 1].charAt(0) === recursiveColor) {
            right = getConnectedSet([breakerPosition[0], breakerPosition[1] + 1]);
        }
        return up + down + left + right + 1;
    }
}

function removeBreaker(x, y) {
    const found = breakerOnBoard.filter(breaker => { return breaker[0] !== x || breaker[1] !== y; });
    if (found.length !== breakerOnBoard.length) {
        breakerOnBoard = found;
    }
}

function dropTheBoard() {
    // traverse from bottom up
    for (let rowi = player1Board.length - 2; rowi >= 0; rowi--) {
        const row = player1Board[rowi];
        for (let coli = 0; coli < row.length; coli++) {
            if (row[coli].charAt(0) !== 'n' && player1Board[rowi + 1][coli].charAt(0) === 'n') {
                for (let ri = rowi; ri < player1Board.length; ri++) {
                    if (player1Board.length === ri + 2 || player1Board[ri + 2][coli] !== 'n') {
                        player1Board[ri + 1][coli] = player1Board[rowi][coli];
                        player1Board[rowi][coli] = 'n';
                        // let breakers list know if you moved one of them (after you moved it)
                        if (player1Board[ri + 1][coli].length === 2 && player1Board[ri + 1][coli].charAt(1) === 'c') {
                            const found = breakerOnBoard.filter(breaker => { return breaker[0] !== rowi || breaker[1] !== coli; });
                            if (found.length !== breakerOnBoard.length) {
                                breakerOnBoard = found;
                                breakerOnBoard.push([ri + 1, coli]);
                            }
                        }
                        dropHappened = true;
                        break;
                    }
                }
            }
        }
    }
}

const evaluateBoard = (breakerList) => {
    return (new Promise((resolve) => {
        if (breakerList.length > 0) {
            let breakerRound = [];
            breakerLoop:
            for (let index = 0; index < breakerList.length; index++) {
                const breaker = breakerList[index];
                if (breaker.length === 2) {
                    const breakerValue = player1Board[breaker[0]][breaker[1]];
                    recursiveColor = breakerValue.charAt(0);
                    if (recursiveColor === 'n') {
                        console.log('There is some nasty data here');
                        removeBreaker(breaker[0], breaker[1]);
                        continue breakerLoop;
                    }
                    let blocksRemoved = 0;
                    if (recursiveColor === 't') {
                        if (breaker[0] + 1 === player1Board.length) {
                            player1Board[breaker[0]][breaker[1]] = 'n';
                            blocksRemoved = 20;
                        } else {
                            player1Board[breaker[0]][breaker[1]] = 'n';
                            const colorToRemove = player1Board[breaker[0] + 1][breaker[1]].charAt(0);
                            player1Board.forEach((row, ri) => {
                                row.forEach((col, ci) => {
                                    if (col.charAt(0) === colorToRemove) {
                                        player1Board[ri][ci] = 'n';
                                        blocksRemoved += 1;
                                    }
                                });
                            });
                            blocksRemoved = blocksRemoved * 5;
                        }
                    } else {
                        blocksRemoved = getConnectedSet(breaker);
                    }
                    if (blocksRemoved < 2) {
                        player1Board[breaker[0]][breaker[1]] = breakerValue;
                    }
                    else {
                        removeBreaker(breaker[0], breaker[1]);
                        breakerRound.push(blocksRemoved);
                    }
                }
            }
            // finished breaker loop
            if (breakerRound.length > 0) {
                round.push(breakerRound.reduce((a, b) => a + b, 0));
                dropTheBoard();
            }
            if (dropHappened) {
                changeMade = true;
                dropHappened = false;
                return setTimeout(() => { resolve(evaluateBoard(breakerOnBoard)); }, 768);
            }
        }
        resolve();
    }));
}

function setDropBottom() {
    if (!pause && !comboRunning) {
        for (let ri = dropBlockX; ri < player1Board.length; ri++) {
            if (ri + 1 === player1Board.length || !(player1Board[ri + 1][dropBlockY] === 'n' || player1Board[ri + 1][dropBlockY].charAt(0) === 'p')) {
                dropBlockBottomX = ri;
                dropBlockBottomY = dropBlockY;
                if (dropBlockBottomX != dropBlockX) {
                    player1Board[dropBlockBottomX][dropBlockBottomY] = 'p' + player1Board[dropBlockX][dropBlockY].charAt(1);
                }
                break;
            }
        }
    }
}

function dropTickerLoop() {
    if (!pause && !comboRunning) {
        if (dropBlockX + 1 < player1Board.length && (player1Board[dropBlockX + 1][dropBlockY] === 'n' || player1Board[dropBlockX + 1][dropBlockY].charAt(0) === 'p')) {
            player1Board[dropBlockX + 1][dropBlockY] = player1Board[dropBlockX][dropBlockY];
            player1Board[dropBlockX][dropBlockY] = 'n';
            dropBlockX += 1;
            changeMade = true;
        } else if (dropBlockX + 1 === player1Board.length || player1Board[dropBlockX + 1][dropBlockY] !== 'n') {
            if (player1Board[dropBlockX][dropBlockY].charAt(1) !== 's') {
                breakerOnBoard.push([dropBlockX, dropBlockY]);
            }
            clearInterval(dropTicker);
            round = [];
            comboRunning = true;
            evaluateBoard(breakerOnBoard)
                .then(() => {
                    roundTotal = 0;
                    for (let index = 0; index < round.length; index++) {
                        const element = round[index];
                        player1Score += Math.pow(2, (index + 1)) * element;
                        roundTotal += Math.pow(2, (index + 1)) * element;
                    }
                    dropBlockX = 0;
                    dropBlockY = 2;
                    player1Board[dropBlockX][dropBlockY] = nextBlock;
                    comboRunning = false;
                    setDropBottom();
                    nextBlock = generateBlock();
                    dropTicker = setInterval(dropTickerLoop, 2000);
                    changeMade = true;
                });
        }
    }
}

let dropTicker = setInterval(dropTickerLoop, 2000);

// eslint-disable-next-line no-unused-vars
let gameLoop = setInterval(() => {
    if (changeMade) {
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(player1x1, player1y1, player1x2, player1y2);
        ctx.fillRect(player2x1, player2y1, player2x2, player2y2);
        ctx.fillRect(nextPieceX, nextPieceY, blockWidth * 2, blockWidth * 2);

        // ctx.fillStyle = 'white';
        ctx.font = '32px georgia';
        // if (gameSeconds < 10) {
        //     ctx.fillText('Time: ' + gameMinutes + ':0' + gameSeconds, gameClockX, 30, blockWidth * 3);
        // } else {
        //     ctx.fillText('Time: ' + gameMinutes + ':' + gameSeconds, gameClockX, 30, blockWidth * 3);
        // }
        ctx.fillText((1000 / (frameLapTime.reduce((a, b) => a + b, 0) / frameLapTime.length)).toPrecision(4) + 'fps', gameClockX, 30, blockWidth * 3);
        ctx.fillText('Score: ' + player1Score, scoreX, scoreY);
        if (nextBlock.charAt(0) === 'r') {
            ctx.fillStyle = 'rgb(255, 0, 0)';
        } else if (nextBlock.charAt(0) === 'g') {
            ctx.fillStyle = 'rgb(0, 255, 0)';
        } else if (nextBlock.charAt(0) === 'b') {
            ctx.fillStyle = 'rgb(0, 0, 255)';
        } else if (nextBlock.charAt(0) === 'y') {
            ctx.fillStyle = 'rgb(255, 255, 0)';
        } else if (nextBlock.charAt(0) === 't') {
            ctx.fillStyle = 'black';
        }
        if (nextBlock.charAt(1) === 's') {
            ctx.fillRect(nextPieceX + (blockWidth / 2), nextPieceY + (blockWidth / 2), blockWidth, blockWidth);
        } else if (nextBlock.charAt(1) === 'c') {
            ctx.beginPath();
            ctx.arc(nextPieceX + blockWidth, nextPieceY + blockWidth, blockWidth / 2, degToRad(0), degToRad(360), false);
            ctx.fill();
        } else if (nextBlock.charAt(1) === 't') {
            ctx.beginPath();
            let triHeight = (blockWidth / 2) * Math.tan(degToRad(60));
            ctx.moveTo(nextPieceX + (blockWidth / 2), nextPieceY + (blockWidth / 2) + (blockWidth - triHeight));
            ctx.lineTo(nextPieceX + (blockWidth / 2) + blockWidth, nextPieceY + (blockWidth / 2) + (blockWidth - triHeight));
            ctx.lineTo(nextPieceX + blockWidth, (nextPieceY + (blockWidth / 2) + triHeight) + (blockWidth - triHeight));
            ctx.lineTo(nextPieceX + (blockWidth / 2), nextPieceY + (blockWidth / 2) + (blockWidth - triHeight));
            ctx.fill();
        }
        player1Board.forEach((row, ri) => {
            row.forEach((col, coli) => {
                if (col.charAt(0) === 'r') {
                    ctx.fillStyle = 'rgb(255, 0, 0)';
                } else if (col.charAt(0) === 'g') {
                    ctx.fillStyle = 'rgb(0, 255, 0)';
                } else if (col.charAt(0) === 'b') {
                    ctx.fillStyle = 'rgb(0, 0, 255)';
                } else if (col.charAt(0) === 'y') {
                    ctx.fillStyle = 'rgb(255, 255, 0)';
                } else if (col.charAt(0) === 'p') {
                    ctx.fillStyle = 'rgba(128,0,128,0.2)';
                } else if (col.charAt(0) === 't') {
                    ctx.fillStyle = 'black';
                }
                if (col != 'n') {
                    if (col.charAt(1) === 's') {
                        ctx.fillRect(coli * blockWidth, ri * blockWidth, blockWidth, blockWidth);
                    } else if (col.charAt(1) === 'c') {
                        ctx.beginPath();
                        ctx.arc((coli * blockWidth) + (blockWidth / 2), (ri * blockWidth) + (blockWidth / 2), blockWidth / 2, degToRad(0), degToRad(360), false);
                        ctx.fill();
                    } else if (col.charAt(1) === 't') {
                        ctx.beginPath();
                        let triHeight = (blockWidth / 2) * Math.tan(degToRad(60));
                        ctx.moveTo(coli * blockWidth, ri * blockWidth + (blockWidth - triHeight) / 2);
                        ctx.lineTo((coli * blockWidth) + blockWidth, ri * blockWidth + (blockWidth - triHeight) / 2);
                        ctx.lineTo((coli * blockWidth) + (blockWidth / 2), ((ri * blockWidth) + triHeight) + (blockWidth - triHeight) / 2);
                        ctx.lineTo(coli * blockWidth, ri * blockWidth + (blockWidth - triHeight) / 2);
                        ctx.fill();
                    }
                }
            });
        });
        changeMade = false;
    }
    frameLapTime[frameCount] = Date.now() - frameDate;
    if (frameCount + 1 === frameLapTime.length) {
        frameCount = 0;
    } else {
        frameCount++;
    }
    frameDate = Date.now();
}, 10);

// eslint-disable-next-line no-unused-vars
// let gameTime = setInterval(() => {
//     if (!pause) {
//         if (gameSeconds + 1 === 60) {
//             gameMinutes += 1;
//             gameSeconds = 0;
//         } else {
//             gameSeconds += 1;
//         }
//         changeMade = true;
//     }
// }, 1000)

document.addEventListener('keyup', function (event) {
    if (!pause && !comboRunning) {
        if (event.key == 'ArrowLeft' && dropBlockY - 1 >= 0 && player1Board[dropBlockX][dropBlockY - 1] === 'n') {
            player1Board[dropBlockX][dropBlockY - 1] = player1Board[dropBlockX][dropBlockY];
            player1Board[dropBlockX][dropBlockY] = 'n';
            dropBlockY = dropBlockY - 1;
            player1Board[dropBlockBottomX][dropBlockBottomY] = 'n';
            setDropBottom();
            changeMade = true;
        }
        else if (event.key == 'ArrowRight' && dropBlockY + 1 < 6 && player1Board[dropBlockX][dropBlockY + 1] === 'n') {
            player1Board[dropBlockX][dropBlockY + 1] = player1Board[dropBlockX][dropBlockY];
            player1Board[dropBlockX][dropBlockY] = 'n';
            dropBlockY = dropBlockY + 1;
            player1Board[dropBlockBottomX][dropBlockBottomY] = 'n';
            setDropBottom();
            changeMade = true;
        }
        else if (event.key == ' ') {
            player1Board[dropBlockBottomX][dropBlockBottomY] = player1Board[dropBlockX][dropBlockY];
            if (player1Board[dropBlockBottomX][dropBlockBottomY].charAt(1) !== 's') {
                breakerOnBoard.push([dropBlockBottomX, dropBlockBottomY]);
            }
            if ((dropBlockBottomX !== dropBlockX) || (dropBlockBottomY != dropBlockY)) {
                player1Board[dropBlockX][dropBlockY] = 'n';
            }
            clearInterval(dropTicker);
            round = [];
            comboRunning = true;
            evaluateBoard(breakerOnBoard)
                .then(() => {
                    roundTotal = 0;
                    for (let index = 0; index < round.length; index++) {
                        const element = round[index];
                        player1Score += Math.pow(element, (index + 1));
                        roundTotal += Math.pow(element, (index + 1));
                    }
                    console.log('Round Total: ' + roundTotal);
                    dropBlockX = 0;
                    dropBlockY = 2;
                    player1Board[dropBlockX][dropBlockY] = nextBlock;
                    comboRunning = false;
                    setDropBottom();
                    nextBlock = generateBlock();
                    dropTicker = setInterval(dropTickerLoop, 2000);
                    changeMade = true;
                });
        }
        else if (event.key == 'b') {
            console.log(player1Board);
            console.log(breakerOnBoard);
        }
    }
});
