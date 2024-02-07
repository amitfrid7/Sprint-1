'use strict'

var gBoard
var gSize
var gLevel = {
    SIZE: 8,
    MINES: 20
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}


var MINE = '💣'


function onInit() {
    gGame.isOn = true
    gBoard = buildBoard(gSize)
    renderBoard(gBoard)
    placeMines()
    hideModal()

}

function buildBoard(size = 4) {
    const board = []
    for (let i = 0; i < gLevel.SIZE; i++) {
        board.push([])

        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: '',
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
                cell = countMineNeighbors()
            }
            var className = `cell cell-${i}-${j}`
            strHTML += `<td data-i="${i}" data-j="${j}" class="${className} hide" onclick="onCellClicked(this, event)"></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
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

        //MODEL
        gBoard[currI][currJ].isMine = true

        //DOM

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function countMineNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gLevel.SIZE) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function onCellClicked(elCell, ev) {
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if (gBoard[elCellI][elCellJ].isMine) {
        // const mines = document.querySelectorAll('mine')
        // mines.classList.remove('.hide')
        renderCell({ i: elCellI, j: elCellJ }, MINE)
        gameOver()
    } else {
        console.log('hh');
        console.log('countMineNeighbors(elCellI, elCellJ, gBoard):', countMineNeighbors(elCellI, elCellJ, gBoard))
        renderCell({ i: elCellI, j: elCellJ }, countMineNeighbors(elCellI, elCellJ, gBoard))
    }
    elCell.innerText = gBoard[elCellI][elCellJ].minesAroundCount

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





// function setMinesNegsCount() {
//     for (let i = 0; i < gLevel.SIZE; i++) {
//         for (let j = 0; j < gLevel.SIZE; j++) {
//             var minesCount = countMineNeighbors(i, j, gBoard)
//             gBoard[i][j].minesAroundCount = minesCount
//         }
//     }
// }