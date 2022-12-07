

const breakLength = document.getElementById('break-length')
const breakDecrement = document.getElementById('break-decrement')
const breakIncrement = document.getElementById('break-increment')
const sessionLength = document.getElementById('session-length')
const sessionDecrement = document.getElementById('session-decrement')
const sessionIncrement = document.getElementById('session-increment')
const timerText = document.getElementById('timer-text')
const timerClock = document.getElementById('timer-clock')
const startStop = document.getElementById('start-stop')
const reset = document.getElementById('reset')

console.log(timerClock.innerHTML.split(':')[0] )

class Clock {
    constructor(breakLength, sessionLength, timerClock, timerText) {
        this.breakLength = parseInt(breakLength.innerHTML)
        this.sessionLength = parseInt(sessionLength.innerHTML)

        // Actual clock values in minutes
        this.breakMin = parseInt(breakLength.innerHTML)
        this.breakSec = 0;
        this.sessionMin = parseInt(timerClock.innerHTML.split(':')[0])
        this.sessionSec = parseInt(timerClock.innerHTML.split(':')[1])
        this.timerBool = false
        this.sessionOrBreak = true
        this.interval
        console.log([this.breakMin, this.breakSec, this.breakLength])
    }
    
    decrementBreak() { 
        if (!this.timerBool) {
            this.breakLength = this.breakLength - 1
            this.breakLength = Math.max(this.breakLength, 1)
            this.breakMin = this.breakLength
            this.updateDisplay()
        }
    }
    incrementBreak() { 
        if (!this.timerBool) {
            this.breakLength = this.breakLength + 1
            this.breakLength = Math.min(this.breakLength, 60)
            this.breakMin = this.breakLength
            this.updateDisplay()
        }
    }
    decrementSession() { 
        if (!this.timerBool) {
            this.sessionLength = this.sessionLength - 1
            this.sessionLength = Math.max(this.sessionLength, 1)
            this.sessionMin = this.sessionLength
            this.updateDisplay()
        }
    }
    incrementSession() { 
        if (!this.timerBool) {
            this.sessionLength = this.sessionLength + 1
            this.sessionLength = Math.min(this.sessionLength, 60)
            this.sessionMin = this.sessionLength
            this.updateDisplay()
        }
    }

    updateDisplay() {
        if (!this.timerBool) {
            breakLength.innerHTML = this.breakLength.toString()
            sessionLength.innerHTML = this.sessionLength.toString()
        }
        let sec = this.sessionOrBreak ? this.sessionSec : this.breakSec
        let min = this.sessionOrBreak ? this.sessionMin : this.breakMin
        let secStr = (sec<10) ? '0'+sec.toString() : sec.toString()
        timerClock.innerHTML = min.toString() + ':' + secStr
    }
    
    startStopClock() {
        this.timerBool = !this.timerBool;
        this.timerBool ? this.startInterval() : this.stopInterval()
    }

    endOfTimer() {
        this.sessionOrBreak = !this.sessionOrBreak;
        this.stopInterval()
        this.playTune()
        !this.sessionOrBreak ? this.sessionMin = this.sessionLength : this.breakMin = this.breakLength
        timerText.innerHTML = this.sessionOrBreak ? "Session" : "Break"
        this.startInterval()
    }

    startInterval() {
        // IMPORTANT to bind 'this' here, otherwise 'this' wont be recognized in the function that setInterval calls!!!
        this.interval = setInterval(this.tickTock.bind(this), 1000);
    }

    stopInterval() {
        clearInterval(this.interval)
    }

    playTune() {
        let audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        audio.play();
        console.log('Music')
    }

    consoleAll() {
        console.table([
        {name: "timerBool", value: this.timerBool}, {name: "sessionOrBreak", value: this.sessionOrBreak},
        {name: "sessionLength", value: this.sessionLength}, {name: "sessionMin", value: this.sessionMin}, 
        {name: "sessionSec", value: this.sessionSec}, {name: "breakLength", value: this.breakLength}, 
        {name: "breakMin", value: this.breakMin}, {name: "breakSec", value: this.breakSec}])
    }

    tickTock() {
        //this.consoleAll()
        if (this.timerBool) {
            if (this.sessionOrBreak) {
                [this.sessionMin, this.sessionSec] = this.decrementSecMin(this.sessionMin, this.sessionSec)
                if (this.sessionMin == 0 && this.sessionSec == 0) {
                    this.endOfTimer()
                } 
            }
            else {
                [this.breakMin, this.breakSec] = this.decrementSecMin(this.breakMin, this.breakSec)
                if (this.breakMin == 0 && this.breakSec == 0) {
                    this.endOfTimer()
                } 
            }
            this.updateDisplay()
        }  
    }
    
    decrementSecMin(min, sec) {
        sec = sec - 1
            if (sec == -1) {
                min = min -1
                sec = 59
            }
            return [min, sec]
        }

    resetAll() {
        if (this.timerBool) {
            this.stopInterval()
            this.breakMin = parseInt(breakLength.innerHTML)
            this.breakSec = 0;
            this.breakLength = parseInt(breakLength.innerHTML)
            this.sessionMin = parseInt(sessionLength.innerHTML)
            this.sessionSec = 0
            this.sessionLength = parseInt(sessionLength.innerHTML)
            this.updateDisplay();
            this.timerBool = false
            this.sessionOrBreak = true
            this.consoleAll()
            console.log('Resetting')
        }
    }
}

const clock = new Clock(breakLength, sessionLength, timerClock, timerText)

breakDecrement.onclick=function() {
    clock.decrementBreak()
}
breakIncrement.onclick=function() {
    clock.incrementBreak()
}
sessionDecrement.onclick=function() {
    clock.decrementSession()
}
sessionIncrement.onclick=function() {
    clock.incrementSession()
}
startStop.onclick=function() {
    clock.startStopClock()
}
reset.onclick=function() {
    clock.resetAll()
}