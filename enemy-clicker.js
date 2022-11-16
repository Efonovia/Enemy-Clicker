const hitsText = document.querySelector('.hits')
const clicksText = document.querySelector('.clicks')
const remainingEnemiesText = document.querySelector('.remainingEnemies')
const timeText = document.querySelector('.time')
const gameTip = document.querySelector(".tip")
const endText = document.querySelector(".endText")
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const colors = ["green", "blue", "red", "yellow", "orange", "brown"]
const bgSrc = "baloonPopperBg.png"
const crossHairSrc = "crossHair.png"
const opp1Src = "opp1.png"
const opp2Src = "opp2.png"
const opp3Src = "opp3.png"
const opp4Src = "opp4.png"
const opp5Src = "opp5.png"
const opp6Src = "opp6.png"
const opp7Src = "opp7.png"
const randColor = () => colors[Math.floor(Math.random() * colors.length)]
const anyNum = (min, max) => (Math.floor(Math.random() * (max - min))) + min
const mouse = {x: 10, y: 10,}
const opps = [opp1Src, opp2Src, opp3Src, opp4Src, opp5Src, opp6Src, opp7Src]
const randOpp = () => opps[Math.floor(Math.random() * opps.length)]
let offsetX
let offsetY
let isClicked = false
let gameHasStarted = false
let hits
let clicks
let remainingEnemies
let time
canvas.width = 1024
canvas.height = 576


addEventListener('mousemove', (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
})

class CrossHair {
    constructor() {
        this.radius = 15
        this.color = "purple"
        this.x = mouse.x
        this.y = mouse.y
        this.image = createImage(crossHairSrc)
        this.width = 80
        this.height = 50
        this.ratio = this.width/this.height
        this.aimerWidth = this.width/this.ratio
        this.aimerHeight = this.height/this.ratio
        this.aimerX = (this.width - this.aimerWidth) / 2
        this.aimerY = (this.height - this.aimerHeight) / 2
    }

    draw() {
        c.drawImage(this.image, mouse.x, mouse.y, this.width, this.height)
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 90
        this.height = 90
        // this.opp = randOpp()
        this.image = createImage(randOpp())
    }

    draw() {
        c.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    
    update() {
        this.draw()
    }
    
}

let randX
let randY
randX = anyNum(50, 930)
randY = anyNum(60, 510)
const aimer = new CrossHair()
const enemyProto = new Enemy(randX, randY)

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

function moveRandomly() {
    enemyProto.x = anyNum(50, 950)
    enemyProto.y = anyNum(60, 510)
}

function resetGame() {
    hits = 0
    clicks = 0
    remainingEnemies = 10
    time = 0
}

resetGame()

function showStats() {
    hitsText.textContent = hits
    clicksText.textContent = clicks
    remainingEnemiesText.textContent = remainingEnemies
    timeText.textContent = time
}

function checkForContact(yourX, yourY, opp) {
    if(
        (yourX + aimer.aimerX) >= opp.x && 
        (yourX + aimer.width - aimer.aimerX) <= (opp.x + opp.width) && 
        (yourY + aimer.aimerY) >= opp.y && 
        (yourY + aimer.height - aimer.aimerY) <= (opp.y + opp.height)
        ) {
            hits += 1
            return true
        }
}



function loop() {
    requestAnimationFrame(loop)
    c.drawImage(createImage(bgSrc), 0, 0)
    if (gameHasStarted) {
        enemyProto.update()
        aimer.draw()
        showStats()
    }
}


loop()
setInterval(moveRandomly, 800)



canvas.addEventListener("click", (e) => {
    // isClicked = true
    clicks += 1
    offsetX = e.offsetX
    offsetY = e.offsetY
    if(checkForContact(offsetX, offsetY, enemyProto)) {
        console.log(hits);
        remainingEnemies -= 1
        randX = anyNum(50, 930)
        randY = anyNum(60, 510)
        enemyProto.image = createImage(randOpp())

    }

    if(remainingEnemies <= 0) {
        endText.style.display = "block"
        gameHasStarted = false
        remainingEnemiesText.textContent = 0
    }
})

addEventListener("keyup", (e) => {
    if(e.keyCode === 32) {
        gameHasStarted = true
        gameTip.style.display = "none"
        endText.style.display = "none"
        resetGame()
        setInterval(() => {
            time += 1
        }, 1000)
    }
})