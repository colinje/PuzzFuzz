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
let replayPieces = [];

const player2x1 = (width / 15) * 9;
const player2y1 = 0;
const player2x2 = player1x2;
const player2y2 = height;
let player2Board = [['n', 'n', 'n', 'n', 'n', 'n'],
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
let player1DropPatternRowIndex = 0;
let player1DropPatternColIndex = 0;
let dropOrder = [5, 0, 4, 1, 3, 2];
// let tickersOnBoard = false;
let player1Caution = false;
let numBlocksToDrop = 0;
// box
// const dropPatternBox = [['3r', '3r', '3y', '3y', '3g', '3g'],
// ['3r', '3r', '3y', '3y', '3g', '3g'],
// ['3b', '3b', '3r', '3r', '3y', '3y'],
// ['3b', '3b', '3r', '3r', '3y', '3y']];
// // dan
// const dropPatternDan = [['3r', '3r', '3r', '3r', '3r', '3r'],
// ['3r', '3r', '3r', '3r', '3r', '3r'],
// ['3r', '3r', '3r', '3r', '3r', '3r'],
// ['3r', '3r', '3r', '3r', '3r', '3r']];
// // stripe
// const dropPatternStripe = [['3r', '3y', '3g', '3b', '3r', '3g'],
// ['3r', '3y', '3g', '3b', '3r', '3g'],
// ['3r', '3y', '3g', '3b', '3r', '3g'],
// ['3r', '3y', '3g', '3b', '3r', '3g']];
// triangle
const dropPatternTriangle = [['3r', '3r', '3y', '3b', '3b', '3g'],
['3r', '3y', '3y', '3b', '3g', '3g'],
['3r', '3y', '3y', '3b', '3g', '3g'],
['3r', '3r', '3y', '3b', '3b', '3g']];

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
let frameLapTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let dropBlockX = 0;
let dropBlockY = 2;
let dropBlockBottomX = 0;
let dropBlockBottomY = 2;
player1Board[dropBlockBottomX][dropBlockBottomY] = 'p' + player1Board[dropBlockX][dropBlockY].charAt(1);
player1Board[dropBlockX][dropBlockY] = generateBlock();
let nextBlock = generateBlock();

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function generateBlock() {
    if (replayPieces.length > 0) {
        return replayPieces.shift();
    }
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
    } else if (shape >= 85 && shape < 97) {
        blockValue = blockValue + 'c';
    } else if (shape >= 97 && shape < 100) {
        blockValue = 'tt';
    }
    turnPieces.push(blockValue);
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
                        changeMade = true;
                        break;
                    }
                }
            }
        }
    }
}

function dropTheBoard2() {
    // traverse from bottom up
    for (let rowi = player2Board.length - 2; rowi >= 0; rowi--) {
        const row = player2Board[rowi];
        for (let coli = 0; coli < row.length; coli++) {
            if (row[coli].charAt(0) !== 'n' && player2Board[rowi + 1][coli].charAt(0) === 'n') {
                for (let ri = rowi; ri < player2Board.length; ri++) {
                    if (player2Board.length === ri + 2 || player2Board[ri + 2][coli] !== 'n') {
                        player2Board[ri + 1][coli] = player2Board[rowi][coli];
                        player2Board[rowi][coli] = 'n';
                        // let breakers list know if you moved one of them (after you moved it)
                        // if (player2Board[ri + 1][coli].length === 2 && player2Board[ri + 1][coli].charAt(1) === 'c') {
                        //     const found = breakerOnBoard.filter(breaker => { return breaker[0] !== rowi || breaker[1] !== coli; });
                        //     if (found.length !== breakerOnBoard.length) {
                        //         breakerOnBoard = found;
                        //         breakerOnBoard.push([ri + 1, coli]);
                        //     }
                        // }
                        // dropHappened = true;
                        changeMade = true;
                        break;
                    }
                }
            }
        }
    }
}

// tick tick tick boom
function dropBlockCountdown() {
    for (let row = 0; row < player1Board.length; row++) {
        for (let col = 0; col < player1Board[row].length; col++) {
            const isNumberValuePlayer1 = Number(player1Board[row][col].charAt(0));
            const isNumberValuePlayer2 = Number(player2Board[row][col].charAt(0));
            if (!isNaN(isNumberValuePlayer1)) {
                player1Board[row][col] = isNumberValuePlayer1 - 1 > 0 ? (isNumberValuePlayer1 - 1) + player1Board[row][col].charAt(1) : player1Board[row][col].charAt(1) + 's';
            }
            if (!isNaN(isNumberValuePlayer2)) {
                player2Board[row][col] = isNumberValuePlayer2 - 1 > 0 ? (isNumberValuePlayer2 - 1) + player2Board[row][col].charAt(1) : player2Board[row][col].charAt(1) + 's';
            }
        }
    }
}

function evaluateBoard() {
    return (new Promise((resolve) => {
        if (breakerOnBoard.length > 0) {
            let breakerRound = [];
            let unbroken = [];
            dropHappened = false;
            breakerLoop: for (let index = 0; index < breakerOnBoard.length; index++) {
                const breaker = breakerOnBoard[index];
                if (breaker.length === 2) {
                    const breakerValue = player1Board[breaker[0]][breaker[1]];
                    recursiveColor = breakerValue.charAt(0);
                    if (recursiveColor === 'n') {
                        console.log('There is some nasty data here');
                        continue breakerLoop;
                    }
                    let blocksRemoved = 0;
                    if (recursiveColor === 't') {
                        if (breaker[0] + 1 === player1Board.length) {
                            player1Board[breaker[0]][breaker[1]] = 'n';
                            blocksRemoved = 20;
                        } else {
                            player1Board[breaker[0]][breaker[1]] = 'n';
                            const isNumberValue = Number(player1Board[breaker[0] + 1][breaker[1]].charAt(0));
                            const colorToRemove = isNaN(isNumberValue) ? player1Board[breaker[0] + 1][breaker[1]].charAt(0) : player1Board[breaker[0] + 1][breaker[1]].charAt(1);
                            player1Board.forEach((row, ri) => {
                                row.forEach((col, ci) => {
                                    if (col.charAt(0) === colorToRemove) {
                                        player1Board[ri][ci] = 'n';
                                        blocksRemoved += 1;
                                    }
                                });
                            });
                            blocksRemoved = blocksRemoved * 4;
                        }
                    } else {
                        blocksRemoved = getConnectedSet(breaker);
                    }
                    if (blocksRemoved < 2) {
                        player1Board[breaker[0]][breaker[1]] = breakerValue;
                        unbroken.push(breaker);
                    }
                    else {
                        player1Caution = true;
                        breakerRound.push(blocksRemoved);
                    }
                }
            }
            // finished breaker loop
            if (breakerRound.length > 0) {
                round.push(breakerRound.reduce((a, b) => a + b, 0));
                breakerOnBoard = unbroken;
                dropTheBoard();
            }
            if (dropHappened) {
                dropHappened = false;
                return setTimeout(() => { resolve(evaluateBoard()); }, 768);
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

function evaluateBoardDone() {
    roundTotal = 0;
    numBlocksToDrop = 0;
    for (let index = 0; index < round.length; index++) {
        const element = round[index];
        roundTotal += Math.pow(2, (index)) * element;
    }
    player1Score += roundTotal;
    numBlocksToDrop = Math.trunc(roundTotal / 4);
    // let numBlocksDropped = 0;
    while (numBlocksToDrop > 0) {
        for (let di = player1DropPatternColIndex % 6; di < 6; di++) {
            if (numBlocksToDrop == 0) {
                break;
            }
            const dropIndex = dropOrder[di];
            if (player2Board[0][dropIndex] != 'n') {
                numBlocksToDrop--;
                player1DropPatternColIndex++;
                continue;
            } else {
                player2Board[0][dropIndex] = dropPatternTriangle[player1DropPatternRowIndex % 4][dropIndex];
                // numBlocksDropped++;
                numBlocksToDrop--;
                player1DropPatternColIndex++;
            }
        }
        if (numBlocksToDrop > 0) {
            player1DropPatternRowIndex++;
        }
        dropTheBoard2();
    }
    player1Caution = false;
    // setup next piece
    dropBlockX = 0;
    dropBlockY = 2;
    player1Board[dropBlockX][dropBlockY] = nextBlock;
    comboRunning = false;
    setDropBottom();
    nextBlock = generateBlock();
    dropTicker = setInterval(dropTickerLoop, 2000);
    changeMade = true;
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
                breakerOnBoard.unshift([dropBlockX, dropBlockY]);
            }
            clearInterval(dropTicker);
            round = [];
            comboRunning = true;
            dropBlockCountdown();
            evaluateBoard().then(evaluateBoardDone);
        }
    }
}

let dropTicker = setInterval(dropTickerLoop, 2000);

setDropBottom();

// eslint-disable-next-line no-unused-vars
let gameLoop = setInterval(() => {
    if (changeMade) {
        // black base
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);
        // white game boards and next piece spot
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(player1x1, player1y1, player1x2, player1y2);
        ctx.fillRect(player2x1, player2y1, player2x2, player2y2);
        ctx.fillRect(nextPieceX, nextPieceY, blockWidth * 2, blockWidth * 2);

        ctx.font = '32px georgia';
        ctx.fillText((1000 / (frameLapTime.reduce((a, b) => a + b, 0) / frameLapTime.length)).toPrecision(4) + 'fps', gameClockX, 30, blockWidth * 3);
        ctx.fillText('Score: ' + player1Score, scoreX, scoreY);
        if (player1Caution && numBlocksToDrop == 0) {
            ctx.fillStyle = 'green';
            ctx.fillText('Incoming!', gameClockX, 65);
        }
        if (numBlocksToDrop > 0) {
            ctx.fillStyle = 'green';
            ctx.fillText('Dropping ' + numBlocksToDrop, gameClockX, 65);
        }
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
                if (col != 'n') {
                    const isNumberValue = col.charAt(0);
                    const colorSymbol = isNaN(isNumberValue) ? col.charAt(0) : col.charAt(1);
                    if (colorSymbol === 'r') {
                        ctx.fillStyle = 'rgb(255, 0, 0)';
                    } else if (colorSymbol === 'g') {
                        ctx.fillStyle = 'rgb(0, 255, 0)';
                    } else if (colorSymbol === 'b') {
                        ctx.fillStyle = 'rgb(0, 0, 255)';
                    } else if (colorSymbol === 'y') {
                        ctx.fillStyle = 'rgb(255, 255, 0)';
                    } else if (colorSymbol === 'p') {
                        ctx.fillStyle = 'rgba(128,0,128,0.2)';
                    } else if (colorSymbol === 't') {
                        ctx.fillStyle = 'black';
                    }
                    if (col.charAt(1) === 's' || !isNaN(isNumberValue)) {
                        ctx.fillRect(coli * blockWidth, ri * blockWidth, blockWidth, blockWidth);
                        if (!isNaN(isNumberValue)) {
                            ctx.fillStyle = 'black';
                            ctx.fillText(isNumberValue, (coli * blockWidth) + (blockWidth/2) - 15, (ri * blockWidth) + (blockWidth/2) + 15);
                        }
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
        player2Board.forEach((row, ri) => {
            row.forEach((col, coli) => {
                if (col != 'n') {
                    const isNumberValue = col.charAt(0);
                    const colorSymbol = isNaN(isNumberValue) ? col.charAt(0) : col.charAt(1);
                    if (colorSymbol === 'r') {
                        ctx.fillStyle = 'rgb(255, 0, 0)';
                    } else if (colorSymbol === 'g') {
                        ctx.fillStyle = 'rgb(0, 255, 0)';
                    } else if (colorSymbol === 'b') {
                        ctx.fillStyle = 'rgb(0, 0, 255)';
                    } else if (colorSymbol === 'y') {
                        ctx.fillStyle = 'rgb(255, 255, 0)';
                    } else if (colorSymbol === 'p') {
                        ctx.fillStyle = 'rgba(128,0,128,0.2)';
                    } else if (colorSymbol === 't') {
                        ctx.fillStyle = 'black';
                    }
                    if (col.charAt(1) === 's' || !isNaN(isNumberValue)) {
                        ctx.fillRect((coli * blockWidth) + (9 * blockWidth), ri * blockWidth, blockWidth, blockWidth);
                        if (!isNaN(isNumberValue)) {
                            ctx.fillStyle = 'black';
                            ctx.fillText(isNumberValue, (coli * blockWidth) + (9 * blockWidth) + (blockWidth/2) - 15, (ri * blockWidth) + (blockWidth/2) + 15);
                        }
                    } else if (col.charAt(1) === 'c') {
                        ctx.beginPath();
                        ctx.arc((coli * blockWidth) + (blockWidth / 2) + (9 * blockWidth), (ri * blockWidth) + (blockWidth / 2), blockWidth / 2, degToRad(0), degToRad(360), false);
                        ctx.fill();
                    } else if (col.charAt(1) === 't') {
                        ctx.beginPath();
                        let triHeight = (blockWidth / 2) * Math.tan(degToRad(60));
                        ctx.moveTo((coli * blockWidth) + (9 * blockWidth), ri * blockWidth + (blockWidth - triHeight) / 2);
                        ctx.lineTo((coli * blockWidth) + blockWidth + (9 * blockWidth), ri * blockWidth + (blockWidth - triHeight) / 2);
                        ctx.lineTo((coli * blockWidth) + (blockWidth / 2) + (9 * blockWidth), ((ri * blockWidth) + triHeight) + (blockWidth - triHeight) / 2);
                        ctx.lineTo((coli * blockWidth) + (9 * blockWidth), ri * blockWidth + (blockWidth - triHeight) / 2);
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
                breakerOnBoard.unshift([dropBlockBottomX, dropBlockBottomY]);
            }
            if ((dropBlockBottomX !== dropBlockX) || (dropBlockBottomY != dropBlockY)) {
                player1Board[dropBlockX][dropBlockY] = 'n';
            }
            clearInterval(dropTicker);
            round = [];
            comboRunning = true;
            dropBlockCountdown();
            evaluateBoard().then(evaluateBoardDone);
        }
        else if (event.key == 'b') {
            console.log('Player1 board: ' + player1Board);
            console.log('Player1 breakerList: ' + breakerOnBoard);
            console.log('Turn piece list: ' + turnPieces);
        }
    }
});
