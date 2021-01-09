// global stuff
const canvas = document.querySelector('.myCanvas');
const height = canvas.height = window.innerHeight;
const width = canvas.width = (height / 12) * 15;
const ctx = canvas.getContext('2d');
let replayPieces = [];
const playerTurn = [0, 0];
let dropOrder = [5, 0, 4, 1, 3, 2];
const blockWidth = width / 15;
// box
// eslint-disable-next-line no-unused-vars
const dropPatternBox = [['3r', '3r', '3y', '3y', '3g', '3g'],
['3r', '3r', '3y', '3y', '3g', '3g'],
['3b', '3b', '3r', '3r', '3y', '3y'],
['3b', '3b', '3r', '3r', '3y', '3y']];
// dan
// eslint-disable-next-line no-unused-vars
const dropPatternDan = [['3r', '3r', '3r', '3r', '3r', '3r'],
['3r', '3r', '3r', '3r', '3r', '3r'],
['3r', '3r', '3r', '3r', '3r', '3r'],
['3r', '3r', '3r', '3r', '3r', '3r']];
// stripe
// eslint-disable-next-line no-unused-vars
const dropPatternStripe = [['3r', '3y', '3g', '3b', '3r', '3g'],
['3r', '3y', '3g', '3b', '3r', '3g'],
['3r', '3y', '3g', '3b', '3r', '3g'],
['3r', '3y', '3g', '3b', '3r', '3g']];
// triangle
const dropPatternTriangle = [['3r', '3r', '3y', '3b', '3b', '3g'],
['3r', '3y', '3y', '3b', '3g', '3g'],
['3r', '3y', '3y', '3b', '3g', '3g'],
['3r', '3r', '3y', '3b', '3b', '3g']];
let changeMade = true, pause = false;
let recursiveColor = 'r';
let turnPieces = [];
let frameCount = 1;
let frameDate = Date.now();
let frameLapTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const gameClockX = blockWidth * 6.5; // currently used for FPS
const scoreX = gameClockX, scoreY = blockWidth * 12 - 10;
const nextPieceX = gameClockX;
const nextPieceY = blockWidth * 3;

// Player 1 stuff
const player1x1 = 0, player1y1 = 0;
const player1x2 = blockWidth * 6;
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
let player1DropPatternRowIndex = 0;
let player1DropPatternColIndex = 0;
let player1Caution = false;
let numBlocksToDropP1 = 0;
let comboRunningP1 = false;
let breakerOnBoardP1 = [];
let roundP1 = [];
let roundTotalP1 = 0;
let dropBlockXP1 = 0;
let dropBlockYP1 = 2;
let dropBlockBottomXP1 = 0;
let dropBlockBottomYP1 = 2;
let dropHappenedP1 = false;
let dropHappenedInTurnP1 = false;
let player1Wins = false;
let player1WinCount = 0;

// Player 2 stuff
const player2x1 = blockWidth * 9;
const player2y1 = 0;
const player2x2 = player1x2;
const player2y2 = height;
let player2Score = 0;
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
let player2DropPatternRowIndex = 0;
let player2DropPatternColIndex = 0;
let player2Caution = false;
let numBlocksToDropP2 = 0;
let comboRunningP2 = false;
let breakerOnBoardP2 = [];
let roundP2 = [];
let roundTotalP2 = 0;
let dropBlockXP2 = 0;
let dropBlockYP2 = 2;
let dropBlockBottomXP2 = 0;
let dropBlockBottomYP2 = 2;
let dropHappenedP2 = false;
let dropHappenedInTurnP2 = false;
let player2WinCount = 0;

// higher power, the menu controls all, the menu sees all
function menuLoop() {
    
}
let menuInterval = setInterval(menuLoop, 30);

// start doing things
player1Board[dropBlockBottomXP1][dropBlockBottomYP1] = 'p' + player1Board[dropBlockXP1][dropBlockYP1].charAt(1);
player1Board[dropBlockBottomXP1][dropBlockBottomYP1] = 'p' + player1Board[dropBlockXP1][dropBlockYP1].charAt(1);
player1Board[dropBlockXP1][dropBlockYP1] = generateBlock(0);
player2Board[dropBlockXP2][dropBlockYP2] = generateBlock(1);
let nextBlockP1 = generateBlock(0);
let nextBlockP2 = generateBlock(1);

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function generateBlock(playerIndex) {
    if (replayPieces.length > 0) {
        return replayPieces.shift();
    }
    let blockValue = 'n';
    if (playerTurn[playerIndex] > turnPieces.length - 2) {
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
    }
    blockValue = turnPieces[playerTurn[playerIndex]];
    playerTurn[playerIndex] += 1;
    return blockValue;
}

function getP1ConnectedSet(breakerPosition) {
    if (breakerPosition.length === 2) {
        let up = 0, down = 0, left = 0, right = 0;
        player1Board[breakerPosition[0]][breakerPosition[1]] = 'n';
        if (0 <= breakerPosition[0] - 1 && player1Board[breakerPosition[0] - 1][breakerPosition[1]].charAt(0) === recursiveColor) {
            up = getP1ConnectedSet([breakerPosition[0] - 1, breakerPosition[1]]);
        }
        if (player1Board.length > breakerPosition[0] + 1 && player1Board[breakerPosition[0] + 1][breakerPosition[1]].charAt(0) === recursiveColor) {
            down = getP1ConnectedSet([breakerPosition[0] + 1, breakerPosition[1]]);
        }
        if (0 <= breakerPosition[1] - 1 && player1Board[breakerPosition[0]][breakerPosition[1] - 1].charAt(0) === recursiveColor) {
            left = getP1ConnectedSet([breakerPosition[0], breakerPosition[1] - 1]);
        }
        if (player1Board[breakerPosition[0]].length > breakerPosition[1] + 1 && player1Board[breakerPosition[0]][breakerPosition[1] + 1].charAt(0) === recursiveColor) {
            right = getP1ConnectedSet([breakerPosition[0], breakerPosition[1] + 1]);
        }
        return up + down + left + right + 1;
    }
}

function getP2ConnectedSet(breakerPosition) {
    if (breakerPosition.length === 2) {
        let up = 0, down = 0, left = 0, right = 0;
        player2Board[breakerPosition[0]][breakerPosition[1]] = 'n';
        if (0 <= breakerPosition[0] - 1 && player2Board[breakerPosition[0] - 1][breakerPosition[1]].charAt(0) === recursiveColor) {
            up = getP2ConnectedSet([breakerPosition[0] - 1, breakerPosition[1]]);
        }
        if (player2Board.length > breakerPosition[0] + 1 && player2Board[breakerPosition[0] + 1][breakerPosition[1]].charAt(0) === recursiveColor) {
            down = getP2ConnectedSet([breakerPosition[0] + 1, breakerPosition[1]]);
        }
        if (0 <= breakerPosition[1] - 1 && player2Board[breakerPosition[0]][breakerPosition[1] - 1].charAt(0) === recursiveColor) {
            left = getP2ConnectedSet([breakerPosition[0], breakerPosition[1] - 1]);
        }
        if (player2Board[breakerPosition[0]].length > breakerPosition[1] + 1 && player2Board[breakerPosition[0]][breakerPosition[1] + 1].charAt(0) === recursiveColor) {
            right = getP2ConnectedSet([breakerPosition[0], breakerPosition[1] + 1]);
        }
        return up + down + left + right + 1;
    }
}

function dropTheBoardP1() {
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
                            const found = breakerOnBoardP1.filter(breaker => { return breaker[0] !== rowi || breaker[1] !== coli; });
                            if (found.length !== breakerOnBoardP1.length) {
                                breakerOnBoardP1 = found;
                                breakerOnBoardP1.push([ri + 1, coli]);
                            }
                        }
                        dropHappenedP1 = true;
                        if (coli == 2) {
                            dropHappenedInTurnP1 = true;
                        }
                        changeMade = true;
                        break;
                    }
                }
            }
        }
    }
}

function dropTheBoardP2() {
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
                        if (player2Board[ri + 1][coli].length === 2 && player2Board[ri + 1][coli].charAt(1) === 'c') {
                            const found = breakerOnBoardP2.filter(breaker => { return breaker[0] !== rowi || breaker[1] !== coli; });
                            if (found.length !== breakerOnBoardP2.length) {
                                breakerOnBoardP2 = found;
                                breakerOnBoardP2.push([ri + 1, coli]);
                            }
                        }
                        dropHappenedP2 = true;
                        if (coli == 2) {
                            dropHappenedInTurnP2 = true;
                        }
                        changeMade = true;
                        break;
                    }
                }
            }
        }
    }
}

// tick tick tick boom
function dropBlockCountdownP1() {
    for (let row = 0; row < player1Board.length; row++) {
        for (let col = 0; col < player1Board[row].length; col++) {
            const isNumberValuePlayer1 = Number(player1Board[row][col].charAt(0));
            if (!isNaN(isNumberValuePlayer1)) {
                player1Board[row][col] = isNumberValuePlayer1 - 1 > 0 ? (isNumberValuePlayer1 - 1) + player1Board[row][col].charAt(1) : player1Board[row][col].charAt(1) + 's';
            }
        }
    }
}

function dropBlockCountdownP2() {
    for (let row = 0; row < player1Board.length; row++) {
        for (let col = 0; col < player1Board[row].length; col++) {
            const isNumberValuePlayer2 = Number(player2Board[row][col].charAt(0));
            if (!isNaN(isNumberValuePlayer2)) {
                player2Board[row][col] = isNumberValuePlayer2 - 1 > 0 ? (isNumberValuePlayer2 - 1) + player2Board[row][col].charAt(1) : player2Board[row][col].charAt(1) + 's';
            }
        }
    }
}

function evaluateBoardP1() {
    return (new Promise((resolve) => {
        if (breakerOnBoardP1.length > 0) {
            let breakerRound = [];
            let unbroken = [];
            dropHappenedP1 = false;
            breakerLoop: for (let index = 0; index < breakerOnBoardP1.length; index++) {
                const breaker = breakerOnBoardP1[index];
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
                        blocksRemoved = getP1ConnectedSet(breaker);
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
                roundP1.push(breakerRound.reduce((a, b) => a + b, 0));
                breakerOnBoardP1 = unbroken;
                dropTheBoardP1();
            }
            if (dropHappenedP1) {
                dropHappenedP1 = false;
                return setTimeout(() => { resolve(evaluateBoardP1()); }, 768);
            }
        }
        resolve();
    }));
}

function evaluateBoardP2() {
    return (new Promise((resolve) => {
        if (breakerOnBoardP2.length > 0) {
            let breakerRound = [];
            let unbroken = [];
            dropHappenedP2 = false;
            breakerLoop2: for (let index = 0; index < breakerOnBoardP2.length; index++) {
                const breaker = breakerOnBoardP2[index];
                if (breaker.length === 2) {
                    const breakerValue = player2Board[breaker[0]][breaker[1]];
                    recursiveColor = breakerValue.charAt(0);
                    if (recursiveColor === 'n') {
                        console.log('There is some nasty data here');
                        continue breakerLoop2;
                    }
                    let blocksRemoved = 0;
                    if (recursiveColor === 't') {
                        if (breaker[0] + 1 === player2Board.length) {
                            player2Board[breaker[0]][breaker[1]] = 'n';
                            blocksRemoved = 20;
                        } else {
                            player2Board[breaker[0]][breaker[1]] = 'n';
                            const isNumberValue = Number(player2Board[breaker[0] + 1][breaker[1]].charAt(0));
                            const colorToRemove = isNaN(isNumberValue) ? player2Board[breaker[0] + 1][breaker[1]].charAt(0) : player2Board[breaker[0] + 1][breaker[1]].charAt(1);
                            player2Board.forEach((row, ri) => {
                                row.forEach((col, ci) => {
                                    if (col.charAt(0) === colorToRemove) {
                                        player2Board[ri][ci] = 'n';
                                        blocksRemoved += 1;
                                    }
                                });
                            });
                            blocksRemoved = blocksRemoved * 4;
                        }
                    } else {
                        blocksRemoved = getP2ConnectedSet(breaker);
                    }
                    if (blocksRemoved < 2) {
                        player2Board[breaker[0]][breaker[1]] = breakerValue;
                        unbroken.push(breaker);
                    }
                    else {
                        player2Caution = true;
                        breakerRound.push(blocksRemoved);
                    }
                }
            }
            // finished breaker loop
            if (breakerRound.length > 0) {
                roundP2.push(breakerRound.reduce((a, b) => a + b, 0));
                breakerOnBoardP2 = unbroken;
                dropTheBoardP2();
            }
            if (dropHappenedP2) {
                dropHappenedP2 = false;
                return setTimeout(() => { resolve(evaluateBoardP2()); }, 768);
            }
        }
        resolve();
    }));
}

function setDropBottomP1() {
    if (!pause && !comboRunningP1) {
        for (let ri = dropBlockXP1; ri < player1Board.length; ri++) {
            if (ri + 1 === player1Board.length || !(player1Board[ri + 1][dropBlockYP1] === 'n' || player1Board[ri + 1][dropBlockYP1].charAt(0) === 'p')) {
                dropBlockBottomXP1 = ri;
                dropBlockBottomYP1 = dropBlockYP1;
                if (dropBlockBottomXP1 != dropBlockXP1) {
                    player1Board[dropBlockBottomXP1][dropBlockBottomYP1] = 'p' + player1Board[dropBlockXP1][dropBlockYP1].charAt(1);
                }
                break;
            }
        }
    }
}

function setDropBottomP2() {
    if (!pause && !comboRunningP2) {
        for (let ri = dropBlockXP2; ri < player2Board.length; ri++) {
            if (ri + 1 === player2Board.length || !(player2Board[ri + 1][dropBlockYP2] === 'n' || player2Board[ri + 1][dropBlockYP2].charAt(0) === 'p')) {
                dropBlockBottomXP2 = ri;
                dropBlockBottomYP2 = dropBlockYP2;
                if (dropBlockBottomXP2 != dropBlockXP2) {
                    player2Board[dropBlockBottomXP2][dropBlockBottomYP2] = 'p' + player2Board[dropBlockXP2][dropBlockYP2].charAt(1);
                }
                break;
            }
        }
    }
}

function evaluateBoardDoneP1() {
    while (numBlocksToDropP1 > 0) {
        for (let di = player1DropPatternColIndex % 6; di < 6; di++) {
            if (numBlocksToDropP1 == 0) {
                break;
            }
            const dropIndex = dropOrder[di];
            if (player2Board[0][dropIndex] != 'n') {
                numBlocksToDropP1--;
                player1DropPatternColIndex++;
                continue;
            } else {
                player2Board[0][dropIndex] = dropPatternTriangle[player1DropPatternRowIndex % 4][dropIndex];
                numBlocksToDropP1--;
                player1DropPatternColIndex++;
            }
        }
        if (numBlocksToDropP1 > 0) {
            player1DropPatternRowIndex++;
        }
        dropTheBoardP2();
    }
    numBlocksToDropP1 = 0;
    player1Caution = false;
}

function evaluateBoardDoneP2() {
    while (numBlocksToDropP2 > 0) {
        for (let di = player2DropPatternColIndex % 6; di < 6; di++) {
            if (numBlocksToDropP2 == 0) {
                break;
            }
            const dropIndex = dropOrder[di];
            if (player1Board[0][dropIndex] != 'n') {
                numBlocksToDropP2--;
                player2DropPatternColIndex++;
                continue;
            } else {
                player1Board[0][dropIndex] = dropPatternTriangle[player2DropPatternRowIndex % 4][dropIndex];
                numBlocksToDropP2--;
                player2DropPatternColIndex++;
            }
        }
        if (numBlocksToDropP2 > 0) {
            player2DropPatternRowIndex++;
        }
        dropTheBoardP1();
    }
    numBlocksToDropP2 = 0;
    player2Caution = false;
}

function dropTickerLoopP1() {
    if (!pause && !comboRunningP1) {
        if (dropBlockXP1 + 1 < player1Board.length && (player1Board[dropBlockXP1 + 1][dropBlockYP1] === 'n' || player1Board[dropBlockXP1 + 1][dropBlockYP1].charAt(0) === 'p')) {
            player1Board[dropBlockXP1 + 1][dropBlockYP1] = player1Board[dropBlockXP1][dropBlockYP1];
            player1Board[dropBlockXP1][dropBlockYP1] = 'n';
            dropBlockXP1 += 1;
            changeMade = true;
        } else if (dropBlockXP1 + 1 === player1Board.length || player1Board[dropBlockXP1 + 1][dropBlockYP1] !== 'n') {
            if (player1Board[dropBlockXP1][dropBlockYP1].charAt(1) !== 's') {
                breakerOnBoardP1.unshift([dropBlockXP1, dropBlockYP1]);
            }
            clearInterval(dropTickerP1);
            roundP1 = [];
            comboRunningP1 = true;
            dropBlockCountdownP1();
            evaluateBoardP1().then(() => {
                roundTotalP1 = 0;
                for (let index = 0; index < roundP1.length; index++) {
                    const element = roundP1[index];
                    roundTotalP1 += Math.pow(2, (index)) * element;
                }
                player1Score += roundTotalP1;
                numBlocksToDropP1 += Math.trunc(roundTotalP1 / 3);
                comboRunningP1 = false;
                if (numBlocksToDropP1 >= numBlocksToDropP2) {
                    numBlocksToDropP1 = numBlocksToDropP1 - numBlocksToDropP2;
                    numBlocksToDropP2 = 0;
                }
                if (numBlocksToDropP2 > 0) {
                    evaluateBoardDoneP2();
                } else {
                    player1Caution = false;
                }
                // endgame check
                if (player1Board[0][2] !== 'n') {
                    pause = true;
                    player2WinCount++;
                } else {
                    dropHappenedInTurnP1 = false;
                    dropBlockXP1 = 0;
                    dropBlockYP1 = 2;
                    player1Board[dropBlockXP1][dropBlockYP1] = nextBlockP1;
                    setDropBottomP1();
                    nextBlockP1 = generateBlock(0);
                    dropTickerP1 = setInterval(dropTickerLoopP1, 2000);
                }
                changeMade = true;
            });
        }
    }
}

function dropTickerLoopP2() {
    if (!pause && !comboRunningP2) {
        if (dropBlockXP2 + 1 < player2Board.length && (player2Board[dropBlockXP2 + 1][dropBlockYP2] === 'n' || player2Board[dropBlockXP2 + 1][dropBlockYP2].charAt(0) === 'p')) {
            player2Board[dropBlockXP2 + 1][dropBlockYP2] = player2Board[dropBlockXP2][dropBlockYP2];
            player2Board[dropBlockXP2][dropBlockYP2] = 'n';
            dropBlockXP2 += 1;
            changeMade = true;
        } else if (dropBlockXP2 + 1 === player2Board.length || player2Board[dropBlockXP2 + 1][dropBlockYP2] !== 'n') {
            if (player2Board[dropBlockXP2][dropBlockYP2].charAt(1) !== 's') {
                breakerOnBoardP2.unshift([dropBlockXP2, dropBlockYP2]);
            }
            clearInterval(dropTickerP2);
            roundP2 = [];
            comboRunningP2 = true;
            dropBlockCountdownP2();
            evaluateBoardP2().then(() => {
                roundTotalP2 = 0;
                for (let index = 0; index < roundP2.length; index++) {
                    const element = roundP2[index];
                    roundTotalP2 += Math.pow(2, (index)) * element;
                }
                player2Score += roundTotalP2;
                numBlocksToDropP2 += Math.trunc(roundTotalP2 / 3);
                comboRunningP2 = false;
                if (numBlocksToDropP2 >= numBlocksToDropP1) {
                    numBlocksToDropP2 = numBlocksToDropP2 - numBlocksToDropP1;
                    numBlocksToDropP1 = 0;
                }
                if (numBlocksToDropP1 > 0) {
                    evaluateBoardDoneP1();
                } else {
                    player2Caution = false;
                }
                // endgame check
                if (player2Board[0][2] !== 'n') {
                    player1Wins = true;
                    player1WinCount++;
                    pause = true;
                } else {
                    dropHappenedInTurnP2 = false;
                    dropBlockXP2 = 0;
                    dropBlockYP2 = 2;
                    player2Board[dropBlockXP2][dropBlockYP2] = nextBlockP2;
                    setDropBottomP2();
                    nextBlockP2 = generateBlock(1);
                    dropTickerP2 = setInterval(dropTickerLoopP2, 2000);
                }
                changeMade = true;
            });
        }
    }
}

let dropTickerP1 = setInterval(dropTickerLoopP1, 2000);
let dropTickerP2 = setInterval(dropTickerLoopP2, 2000);

setDropBottomP1();
setDropBottomP2();

function gameLoop() {
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
        if (player1WinCount > 0) {
            ctx.fillStyle = 'yellow';
            const displayWinCount = player1WinCount == 1 ? 'V' : 'VV';
            ctx.fillText(displayWinCount, blockWidth * 6.5, blockWidth * 11)
        }
        if (player2WinCount > 0) {
            ctx.fillStyle = 'yellow';
            const displayWinCount = player2WinCount == 1 ? 'V' : 'VV';
            ctx.fillText(displayWinCount, blockWidth * 8, blockWidth * 11)
        }
        if (!pause) {
            if (player1Caution && numBlocksToDropP1 == 0) {
                ctx.fillStyle = 'yellow';
                ctx.fillText('Incoming!', gameClockX, 65);
            }
            if (numBlocksToDropP1 > 0) {
                ctx.fillStyle = 'yellow';
                ctx.fillText('Dropping ' + numBlocksToDropP1, gameClockX, 65);
            }
            if (player2Caution && numBlocksToDropP2 == 0) {
                ctx.fillStyle = 'yellow';
                ctx.fillText('Incoming!', gameClockX, 100);
            }
            if (numBlocksToDropP2 > 0) {
                ctx.fillStyle = 'yellow';
                ctx.fillText('Dropping ' + numBlocksToDropP2, gameClockX, 100);
            }
        }
        if (nextBlockP1.charAt(0) === 'r') {
            ctx.fillStyle = 'rgb(255, 0, 0)';
        } else if (nextBlockP1.charAt(0) === 'g') {
            ctx.fillStyle = 'rgb(0, 255, 0)';
        } else if (nextBlockP1.charAt(0) === 'b') {
            ctx.fillStyle = 'rgb(0, 0, 255)';
        } else if (nextBlockP1.charAt(0) === 'y') {
            ctx.fillStyle = 'rgb(255, 255, 0)';
        } else if (nextBlockP1.charAt(0) === 't') {
            ctx.fillStyle = 'black';
        }
        if (nextBlockP1.charAt(1) === 's') {
            ctx.fillRect(nextPieceX + (blockWidth / 2), nextPieceY + (blockWidth / 2), blockWidth, blockWidth);
        } else if (nextBlockP1.charAt(1) === 'c') {
            ctx.beginPath();
            ctx.arc(nextPieceX + blockWidth, nextPieceY + blockWidth, blockWidth / 2, degToRad(0), degToRad(360), false);
            ctx.fill();
        } else if (nextBlockP1.charAt(1) === 't') {
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
                            ctx.fillText(isNumberValue, (coli * blockWidth) + (blockWidth / 2) - 15, (ri * blockWidth) + (blockWidth / 2) + 15);
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
                            ctx.fillText(isNumberValue, (coli * blockWidth) + (9 * blockWidth) + (blockWidth / 2) - 15, (ri * blockWidth) + (blockWidth / 2) + 15);
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
        if (pause) {
            ctx.fillStyle = 'black';
            if (player1Wins) {
                ctx.fillText('You Win!', blockWidth * 2, blockWidth * 5);
            }
            if (!player1Wins) {
                ctx.fillText('You Lose!', blockWidth * 2, blockWidth * 5);
            }
            if (player1WinCount < 2 && player2WinCount < 2) {
                ctx.fillText('Press R to ready', blockWidth, blockWidth * 6);
            }
            else {
                ctx.fillText('Press Q to quit', blockWidth, blockWidth * 6);
            }
        }
        changeMade = false;
    }
    frameLapTime[frameCount] = Date.now() - frameDate;
    if (frameCount + 1 === frameLapTime.length) {
        frameCount = 0;
    } else {
        frameCount++;
    }
    frameDate = Date.now();
}

// eslint-disable-next-line no-unused-vars
let gameLoopInterval = setInterval(gameLoop, 10);

// AI THINGS
function simpleAILoop() {
    if (!pause && !comboRunningP2) {
        const decisionNumber = Math.floor(Math.random() * 10);
        if (decisionNumber < 3 && dropBlockYP2 - 1 >= 0 && player2Board[dropBlockXP2][dropBlockYP2 - 1] === 'n') {
            player2Board[dropBlockXP2][dropBlockYP2 - 1] = player2Board[dropBlockXP2][dropBlockYP2];
            player2Board[dropBlockXP2][dropBlockYP2] = 'n';
            dropBlockYP2 = dropBlockYP2 - 1;
            player2Board[dropBlockBottomXP2][dropBlockBottomYP2] = 'n';
            setDropBottomP2();
            changeMade = true;
        }
        else if (decisionNumber >= 3 && decisionNumber < 7 && dropBlockYP2 + 1 < 6 && player2Board[dropBlockXP2][dropBlockYP2 + 1] === 'n') {
            player2Board[dropBlockXP2][dropBlockYP2 + 1] = player2Board[dropBlockXP2][dropBlockYP2];
            player2Board[dropBlockXP2][dropBlockYP2] = 'n';
            dropBlockYP2 = dropBlockYP2 + 1;
            player2Board[dropBlockBottomXP2][dropBlockBottomYP2] = 'n';
            setDropBottomP2();
            changeMade = true;
        }
        else if (decisionNumber >= 7) {
            player2Board[dropBlockBottomXP2][dropBlockBottomYP2] = player2Board[dropBlockXP2][dropBlockYP2];
            if (player2Board[dropBlockBottomXP2][dropBlockBottomYP2].charAt(1) !== 's') {
                breakerOnBoardP2.unshift([dropBlockBottomXP2, dropBlockBottomYP2]);
            }
            if ((dropBlockBottomXP2 !== dropBlockXP2) || (dropBlockBottomYP2 != dropBlockYP2)) {
                player2Board[dropBlockXP2][dropBlockYP2] = 'n';
            }
            clearInterval(dropTickerP2);
            roundP2 = [];
            comboRunningP2 = true;
            dropBlockCountdownP2();
            evaluateBoardP2().then(() => {
                roundTotalP2 = 0;
                for (let index = 0; index < roundP2.length; index++) {
                    const element = roundP2[index];
                    roundTotalP2 += Math.pow(2, (index)) * element;
                }
                player2Score += roundTotalP2;
                numBlocksToDropP2 += Math.trunc(roundTotalP2 / 3);
                comboRunningP2 = false;
                if (numBlocksToDropP2 >= numBlocksToDropP1) {
                    numBlocksToDropP2 = numBlocksToDropP2 - numBlocksToDropP1;
                    numBlocksToDropP1 = 0;
                }
                if (numBlocksToDropP1 > 0) {
                    evaluateBoardDoneP1();
                } else {
                    player2Caution = false;
                }
                // endgame check
                if (player2Board[0][2] !== 'n') {
                    player1Wins = true;
                    player1WinCount++;
                    pause = true;
                } else {
                    dropHappenedInTurnP2 = false;
                    dropBlockXP2 = 0;
                    dropBlockYP2 = 2;
                    player2Board[dropBlockXP2][dropBlockYP2] = nextBlockP2;
                    setDropBottomP2();
                    nextBlockP2 = generateBlock(1);
                    dropTickerP2 = setInterval(dropTickerLoopP2, 2000);
                }
                changeMade = true;
            });
        }
    }
}
let AIInterval = setInterval(simpleAILoop, 500);

document.addEventListener('keyup', function (event) {
    if (!pause && !comboRunningP1) {
        if (event.key == 'ArrowLeft' && dropBlockYP1 - 1 >= 0 && player1Board[dropBlockXP1][dropBlockYP1 - 1] === 'n') {
            player1Board[dropBlockXP1][dropBlockYP1 - 1] = player1Board[dropBlockXP1][dropBlockYP1];
            player1Board[dropBlockXP1][dropBlockYP1] = 'n';
            dropBlockYP1 = dropBlockYP1 - 1;
            player1Board[dropBlockBottomXP1][dropBlockBottomYP1] = 'n';
            setDropBottomP1();
            changeMade = true;
        }
        else if (event.key == 'ArrowRight' && dropBlockYP1 + 1 < 6 && player1Board[dropBlockXP1][dropBlockYP1 + 1] === 'n') {
            player1Board[dropBlockXP1][dropBlockYP1 + 1] = player1Board[dropBlockXP1][dropBlockYP1];
            player1Board[dropBlockXP1][dropBlockYP1] = 'n';
            dropBlockYP1 = dropBlockYP1 + 1;
            player1Board[dropBlockBottomXP1][dropBlockBottomYP1] = 'n';
            setDropBottomP1();
            changeMade = true;
        }
        else if (event.key == ' ') {
            player1Board[dropBlockBottomXP1][dropBlockBottomYP1] = player1Board[dropBlockXP1][dropBlockYP1];
            if (player1Board[dropBlockBottomXP1][dropBlockBottomYP1].charAt(1) !== 's') {
                breakerOnBoardP1.unshift([dropBlockBottomXP1, dropBlockBottomYP1]);
            }
            if ((dropBlockBottomXP1 !== dropBlockXP1) || (dropBlockBottomYP1 != dropBlockYP1)) {
                player1Board[dropBlockXP1][dropBlockYP1] = 'n';
            }
            clearInterval(dropTickerP1);
            roundP1 = [];
            comboRunningP1 = true;
            dropBlockCountdownP1();
            evaluateBoardP1().then(() => {
                roundTotalP1 = 0;
                for (let index = 0; index < roundP1.length; index++) {
                    const element = roundP1[index];
                    roundTotalP1 += Math.pow(2, (index)) * element;
                }
                player1Score += roundTotalP1;
                numBlocksToDropP1 += Math.trunc(roundTotalP1 / 3);
                comboRunningP1 = false;
                if (numBlocksToDropP1 >= numBlocksToDropP2) {
                    numBlocksToDropP1 = numBlocksToDropP1 - numBlocksToDropP2;
                    numBlocksToDropP2 = 0;
                }
                if (numBlocksToDropP2 > 0) {
                    evaluateBoardDoneP2();
                } else {
                    player1Caution = false;
                }
                // endgame check
                if (player1Board[0][2] !== 'n') {
                    pause = true;
                    player2WinCount++;
                } else {
                    dropHappenedInTurnP1 = false;
                    dropBlockXP1 = 0;
                    dropBlockYP1 = 2;
                    player1Board[dropBlockXP1][dropBlockYP1] = nextBlockP1;
                    setDropBottomP1();
                    nextBlockP1 = generateBlock(0);
                    dropTickerP1 = setInterval(dropTickerLoopP1, 2000);
                }
                changeMade = true;
            });
        }
        else if (event.key == 'b') {
            console.log('Player1 board: ' + player1Board);
            console.log('Player1 breakerList: ' + breakerOnBoardP1);
            console.log('Turn piece list: ' + turnPieces);
        }
    } else {
        if (player1WinCount < 2 && player2WinCount < 2 && event.key == 'r') {
            // reset the things and turn pause off
            player1Board = [['n', 'n', 'n', 'n', 'n', 'n'],
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
            player2Board = [['n', 'n', 'n', 'n', 'n', 'n'],
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
            pause = false;
        }
        else if ((player1WinCount == 2 || player2WinCount == 2) && event.key == 'q') {
            console.log('time to quit back to the menu that doesn\'t exist');
        }
    }
});
