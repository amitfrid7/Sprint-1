// 'use strict'

// function createMat(ROWS, COLS) {
//     const mat = []
//     for (var i = 0; i < ROWS; i++) {
//         const row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

// function drawNum(nums) {
//     var randIdx = getRandomInt(0, nums.length)
//     var num = nums[randIdx]
//     nums.splice(randIdx, 1)
//     return num
// }

// function makeId(length = 6) {
//     var txt = ''
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length))
//     }

//     return txt
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// function renderBoard(board) {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {

//             const cell = board[i][j]
//             const className = `cell cell-${i}-${j}`

//             strHTML += `<td class="${className}">${cell}</td>`
//         }
//         strHTML += '</tr>'
//     }
//     const elContainer = document.querySelector('.board')
//     elContainer.innerHTML = strHTML
// }

// // location is an object like this - { i: 2, j: 7 }
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

// function findSlot() {
//     const emptySlots = findEmptySlots(gBoard)
//     const randIdx = getRandomInt(0, emptySlots.length)
//     return emptySlots[randIdx]
// }

// function findEmptySlots(board) {
//     var emptySlots = []
//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[0].length; j++) {
//             var currCell = board[i][j]
//             if (!currCell.isMine) emptySlots.push({ i, j })
//         }
//     }
//     return emptySlots
// }

// function buildBoard() {
//     const size = 10
//     const board = []

//     for (var i = 0; i < size; i++) {
//         board.push([])

//         for (var j = 0; j < size; j++) {
//             board[i][j] = ' '
//         }
//     }
//     return board
// }

// function countNeighbors(cellI, cellJ, mat) {
//     var neighborsCount = 0
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= mat[i].length) continue
//             // if () neighborsCount++
//         }
//     }
//     return neighborsCount
// }


// function startTimer() {

//     if (gTimerInterval) clearInterval(gTimerInterval)

//     gTimerInterval = setInterval(() => {
//         const timeDiff = Date.now() - startTime

//         const seconds = getFormatSeconds(timeDiff)
//         const milliSeconds = getFormatMilliSeconds(timeDiff)

//         document.querySelector('span.seconds').innerText = seconds
//         document.querySelector('span.milli-seconds').innerText = milliSeconds

//     }, 10)
// }

// function getFormatSeconds(timeDiff) {
//     const seconds = Math.floor(timeDiff / 1000)
//     return (seconds + '').padStart(2, '0')
// }

// function getFormatMilliSeconds(timeDiff) {
//     const milliSeconds = new Date(timeDiff).getMilliseconds()
//     return (milliSeconds + '').padStart(3, '0')
// }
