'use strict'

var gBoard
var gSize
var gTimerInterval
var gClick = true

var gLevel = {
    SIZE: 8,
    MINES: 12
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3
}

const SAD_SMILEY = '😢'
const NORMAL_SMILEY = '🙃'
const SUNGLASSES = '😎'

const MINE = '🍄'
const FLAG = '🚩'


function onInit() {
    gGame.isOn = true
    gGame.lives = 3
    gBoard = buildBoard(gSize)
    clearInterval(gTimerInterval)
    renderSmiley()
    placeMines()
    setMinesNegsCount()
    renderBoard(gBoard)
    renderLives()
    renderHints()
    hideModal()
}

function buildBoard(size = 8) {
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
            strHTML += `<td data-i="${i}" data-j="${j}" class="${className}" oncontextmenu="markCell(this)" onclick="onCellClicked(this, event)"></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function onCellClicked(elCell, ev) {
    var elCellI = +elCell.dataset.i
    var elCellJ = +elCell.dataset.j
    elCell.classList.add('clicked')
    if (gClick) startTimer()
    gClick = false

    if (gBoard[elCellI][elCellJ].isShown) return

    if (gBoard[elCellI][elCellJ].isMine) {

        //MODEL
        gBoard[elCellI][elCellJ].isShown = true
        gGame.lives--

        //DOM
        renderCell({ i: elCellI, j: elCellJ }, MINE)
        renderLives()

        if (!gGame.lives) gameOver()

    } else {
        var mineNegsCount = gBoard[elCellI][elCellJ].minesAroundCount

        //Handles 0 Mine negs
        if (!mineNegsCount) {
            mineNegsCount = ' '
        }

        //MODEL
        gBoard[elCellI][elCellJ].isShown = true

        //DOM
        renderCell({ i: elCellI, j: elCellJ }, mineNegsCount)
        elCell.innerText = mineNegsCount
        expandShown(elCell)
    }

    if (isVictory()) announceWinner()
    if (!gGame.lives) gameOver()
}

function expandShown(elCell) {
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j

    for (var i = elCellI - 1; i <= elCellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = elCellJ - 1; j <= elCellJ + 1; j++) {

            if (i === elCellI && j === elCellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = document.querySelector(`.cell-${i}-${j}`)
            const currCellI = currCell.dataset.i
            const currCellJ = currCell.dataset.j

            if (gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine) {

                //MODEL
                gBoard[i][j].isShown = true

                //DOM
                renderCell({ i: currCellI, j: currCellJ }, gBoard[i][j].minesAroundCount)
                currCell.innerText = `${gBoard[i][j].minesAroundCount}`
                currCell.classList.add('clicked')
            }

            if (!gBoard[i][j].minesAroundCount &&
                !gBoard[i][j].isShown &&
                !gBoard[i][j].isMine) {

                //MODEL
                gBoard[i][j].isShown = true

                //DOM
                renderCell({ i: currCellI, j: currCellJ }, ' ')
                currCell.innerText = ' '
                currCell.classList.add('clicked')

                //Recursion
                expandShown(currCell)
            }
        }
    }
}

function placeMines() {
    const minesSlots = getRandomMineLoc()
    for (let i = 0; i < minesSlots.length; i++) {
        var currI = minesSlots[i].i
        var currJ = minesSlots[i].j

        gBoard[currI][currJ].isMine = true
    }
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

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerText = value
}

function markCell(elCell) {
    preventMenu()
    
    var elCellI = +elCell.dataset.i
    var elCellJ = +elCell.dataset.j
    
    if (gBoard[elCellI][elCellJ].isMarked) {
        
        //MODEL
        gBoard[elCellI][elCellJ].isMarked = false
        
        //DOM
        renderCell({ i: elCellI, j: elCellJ }, ' ')
    } else {
        
        //MODEL
        gBoard[elCellI][elCellJ].isMarked = true
        
        //DOM
        renderCell({ i: elCellI, j: elCellJ }, FLAG)
    }
    
    renderSmiley()
    if (isVictory()) announceWinner()
    if (!gGame.lives) gameOver()
}

function onSetLevel(level) {
    gLevel.SIZE = level
    if (level === 4) gLevel.MINES = 2
    if (level === 8) gLevel.MINES = 14
    if (level === 12) gLevel.MINES = 32
    onInit()
}

function renderSmiley(value = NORMAL_SMILEY) {
    const elSmiley = document.querySelector(`.smiley`)
    elSmiley.innerText = value
}

function renderLives() {
    var strHTML = ''
    for (let i = 0; i < gGame.lives; i++) {
        strHTML += `<img class="live" src="img/heart.png">`
    }
    
    var elLives = document.querySelector('.lives-container')
    elLives.innerHTML = strHTML
}

function renderHints() {
    var strHTML = ''
    for (let i = 0; i < gGame.lives; i++) {
        strHTML += `<img class="hint" onclick="useHint(this)" src="img/hint.png">`
    }
    
    var elHints = document.querySelector('.hints-container')
    elHints.innerHTML = strHTML
}

function useHint(elHint) {
    if (gGame.hints) {
        elHint.style.backgroundColor = 'yellow'
        var notMineCells = []
        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[0].length; j++) {
                const currCell = gBoard[i][j]
                if (!currCell.isMine && !currCell.isShown) notMineCells.push({ i: i, j: j })
            }
    }

        var randIdx = getRandomInt(0, notMineCells.length)
        var hintedCell = notMineCells[randIdx]
        const elCell = document.querySelector(`.cell-${hintedCell.i}-${hintedCell.j}`)
        elCell.classList.add('reveal')
        
        setTimeout(() => {
            elCell.classList.remove('reveal')
            elCell.classList.add('unreveal')
            
        }, 1000)
        gGame.hints--
    }
}

function isVictory() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isShown) continue
            else if (currCell.isMine && currCell.isMarked) continue
            else return
        }
    }
    renderSmiley(SUNGLASSES)
    clearInterval(gTimerInterval)
    return true
}

function announceWinner() {
    const elModal = document.querySelector('.winner-modal')
    elModal.style.display = 'inline-block'
    if (gTimerInterval) clearInterval(gTimerInterval)
}

function gameOver() {
    gGame.isOn = false
    gameOverModal()
    renderSmiley(SAD_SMILEY)
    clearInterval(gTimerInterval)
}

function gameOverModal() {
    const elModal = document.querySelector('.game-over-modal')
    elModal.style.display = 'inline-block'
    
}

function hideModal() {
    const elModal = document.querySelector('.game-over-modal')
    elModal.style.display = 'none'
    
    const elWinnerModal = document.querySelector('.winner-modal')
    elWinnerModal.style.display = 'none'
    
    const elContainer = document.querySelector('.board')
    elContainer.style.display = 'block'
}

function getRandomMineLoc() {
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

function preventMenu() {
    const board = document.getElementById("myBoard")
    board.addEventListener("contextmenu", (e) => { e.preventDefault() });
}

//Timer
function startTimer() {
    const startTime = Date.now()

    if (gTimerInterval) clearInterval(gTimerInterval)
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime

        const seconds = getFormatSeconds(timeDiff)
        const milliSeconds = getFormatMilliSeconds(timeDiff)

        document.querySelector('span.seconds').innerText = seconds
        document.querySelector('span.milli-seconds').innerText = milliSeconds

    }, 10)
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return (seconds + '').padStart(2, '0')
}

function getFormatMilliSeconds(timeDiff) {
    const milliSeconds = new Date(timeDiff).getMilliseconds()
    return (milliSeconds + '').padStart(3, '0')
}