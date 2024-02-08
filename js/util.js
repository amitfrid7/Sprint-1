'use strict'




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
