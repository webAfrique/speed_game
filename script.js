const gameEnvironment = document.querySelector(".game-environment");
const balloonContainer = document.querySelector(".balloon-container")
const displayScore = document.querySelector(".score span")
const score_info_container = document.querySelector(".score-and-instruction")
const startStopBtn = document.querySelector(".start-stop-btn")
const modalMsg = document.querySelector('.modal p')
const closeModalBtn = document.querySelector('.close-modal')
const overlay = document.querySelector('.overlay')
const balloonPopAudio = document.querySelector('#balloon-pop-audio')
const laughAudio = document.querySelector('#laugh-audio')
const backgroundAudio = document.querySelector('#background-audio')
const applauseAudio = document.querySelector('#applause-audio')
let score 
let intervalId
let microSeconds 

/*floating balloon code from https://codepen.io/Jemimaabu/pen/vYEYdOy*/

function random(num) {
  return Math.floor(Math.random() * num);
}

function startScreenBalloonStyles() {
  const r = random(255)
  const g = random(255)
  const b = random(255)
  const marginTop = random(200)
  const marginLeft = random(50)
  const duration = random(5) + 5
  return `
  background-color: rgba(${r},${g},${b},0.7);
  color: rgba(${r},${g},${b},0.7); 
  box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
  margin: ${marginTop}px 0 0 ${marginLeft}px;
  animation: float ${duration}s ease-in infinite
  `
}

function createStartScreenBalloons(num) {
  for (let i = num; i > 0; i--) {
    const balloon = document.createElement("div")
    balloon.className = "balloon"
    balloon.style.cssText = startScreenBalloonStyles()
    gameEnvironment.append(balloon)
  }
}

function gameBalloonStyles(r, g, b) {
  return `
  background-color: rgba(${r},${g},${b},0.7);
  color: rgba(${r},${g},${b},0.7); 
  box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
  `
}

function createGameBalloons(num) {
  const rand = Math.floor(Math.random() * (4 - 1 + 1)) + 1
for (let i = num; i > 0; i--) {
  const balloon = document.createElement("div");
  balloon.className = "balloon";
  
  if ( i === rand ) {
      balloon.style.cssText = gameBalloonStyles(255, 0, 0)
      balloon.addEventListener('click', popBalloon)
  }
  else {
      balloon.style.cssText = gameBalloonStyles(173, 255, 47)
      balloon.addEventListener('click', showLoserModal)
  }
    balloonContainer.append(balloon)
  }
}

function popBalloon(event) {
  event.target.style.visibility = 'hidden'
  balloonPopAudio.play()
  score++
  displayScore.textContent = score
}

function toggleStartBtn(event) {
 if (event.target.textContent === 'Start Game'){
    event.target.textContent = 'End Game'
    clearStartScreen()
    score_info_container.style.display = 'block'
    initGame()
 }
 else if (event.target.textContent === 'End Game'){
    window.location.reload()
 }
}

function showStartScreen() {
  createStartScreenBalloons(20)
}

function clearStartScreen() {
  gameEnvironment.style.opacity = 0
  setTimeout(() => {
    gameEnvironment.remove()
  }, 500)
}

function runGame() {
  //end the game when timer interval is 100 ms or below
  if (microSeconds <= 100) {
    clearInterval(intervalId)
    showLoserModal()
    return
  }

  balloonContainer.innerHTML = ""
  createGameBalloons(4)

  // Clear the previous setInterval timer and sets another with new time
  clearInterval(intervalId)
  intervalId = setInterval(runGame, microSeconds);

  microSeconds-=50 //reduce timer by 50 ms
}

function initGame(){
  score = 0
  microSeconds = 2000
  displayScore.textContent = score
  backgroundAudio.play()
  backgroundAudio.volume = 0.5
  backgroundAudio.loop = true
  runGame()
}

function showWinnerModal() {
  clearInterval(intervalId) 
  modalMsg.textContent = `You popped ${score} balloons!` 
  document.querySelector('.loser-gif').style.display = 'none'
  document.querySelector('.winner-gif').style.display = 'block'
  overlay.classList.add('visible')
  backgroundAudio.pause()
  backgroundAudio.currentTime = 0
  applauseAudio.play()
}

function showLoserModal() {
  if (score >= 5) {
    showWinnerModal()
    return
  }
  else {
    clearInterval(intervalId) 
    modalMsg.textContent = 'Game Over' 
    document.querySelector('.winner-gif').style.display = 'none'
    document.querySelector('.loser-gif').style.display = 'block'
    overlay.classList.add('visible')
    backgroundAudio.pause()
    backgroundAudio.currentTime = 0
    laughAudio.play()
  }
}

/****************** Event Listeners ****************************/
window.addEventListener("load", showStartScreen())

startStopBtn.addEventListener('click', toggleStartBtn)

closeModalBtn.addEventListener('click', () => {
    overlay.classList.remove('visible') 
    initGame()
})


