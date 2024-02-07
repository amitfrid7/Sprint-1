'use strict'

var gBoard
var gSize
var gLevel = {
    SIZE: 8,
    MINES: 4
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

const MINE = '💣'
const FLAG = '🚩'

gBoard = buildBoard(gSize)


function onInit() {
    gGame.isOn = true
    gGame.lives = 3
    placeMines()
    setMinesNegsCount()
    renderBoard(gBoard)
    renderLives()
    hideModal()
    console.log('gBoard:', gBoard)
}

function buildBoard(size = 4) {
    const board = []
    for (let i = 0; i < gLevel.SIZE; i++) {
        board.push([])

        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: ' ',
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board
}

function renderBoard(board) {
    var strHTML = ''
    var cell
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[0].length; j++) {

            if (!gBoard[i][j].isMine) {
                cell = ' '
            }
            var className = `cell cell-${i}-${j}`
            strHTML += `<td data-i="${i}" data-j="${j}" class="${className}" oncontextmenu="markCell(this)" onclick="onCellClicked(this)"></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function onCellClicked(elCell) {
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if (gBoard[elCellI][elCellJ].isMine) {
        renderCell({ i: elCellI, j: elCellJ }, MINE)
        gGame.lives--
        renderLives()
        if (!gGame.lives) gameOver()

    } else {
        // gBoard[elCellI][elCellJ].minesAroundCount = countMineNeighbors(elCellI, elCellJ, gBoard)
        var negsCount = gBoard[elCellI][elCellJ].minesAroundCount
        renderCell({ i: elCellI, j: elCellJ }, negsCount)
        elCell.innerText = negsCount
    }
}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerText = value
}

function placeMines() {
    const minesSlots = getRandomLoc()
    for (let i = 0; i < minesSlots.length; i++) {
        var currI = minesSlots[i].i
        var currJ = minesSlots[i].j

        gBoard[currI][currJ].isMine = true
    }
}

function getRandomLoc() {
    const randomLocations = []

    for (let i = 0; i < gLevel.MINES; i++) {
        const randLoc = {
            i: getRandomInt(0, gLevel.SIZE - 1),
            j: getRandomInt(0, gLevel.SIZE - 1)
        }
        randomLocations.push(randLoc)
    }
    return randomLocations
}

function countMineNeighbors(cellI, cellJ) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine) {
                neighborsCount++
            }
        }
    }
    return neighborsCount
}

function setMinesNegsCount() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            currCell.minesAroundCount = countMineNeighbors(i, j)
        }
    }
}

function preventMenu() {
    const board = document.getElementById("myBoard")
    board.addEventListener("contextmenu", (e) => { e.preventDefault() });
}

function markCell(elCell) {
    preventMenu()
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    //MODEL
    gBoard[elCellI][elCellJ].isMarked = true

    //DOM
    renderCell({ i: elCellI, j: elCellJ }, FLAG)
}

function renderLives() {
    var strHTML = ''
    for (let i = 0; i < gGame.lives; i++) {
        strHTML += `<img class="live" src="img/heart.png">`
    }

    var elLives = document.querySelector('.lives-container')
    elLives.innerHTML = strHTML
}

function gameOver() {
    gGame.isOn = false
    gameOverModal()
}

function gameOverModal() {
    const elModal = document.querySelector('.game-over-modal')
    elModal.style.display = 'inline-block'

    // const elContainer = document.querySelector('.board')
    // elContainer.style.display = 'none'
}

function hideModal() {
    const elModal = document.querySelector('.game-over-modal')
    elModal.style.display = 'none'

    const elContainer = document.querySelector('.board')
    elContainer.style.display = 'block'
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}