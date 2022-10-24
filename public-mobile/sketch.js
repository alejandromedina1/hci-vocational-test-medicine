/*const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
let socket = io(NGROK, {
  path: '/real-time'
})*/

nP = navigator.platform;
if (nP == "iPad" || nP == "iPhone" || nP == "iPod" || nP == "iPhone Simulator" || nP == "iPad Simulator") {
    $('select option[disabled]').remove();
}

let screens = [];
let currentScreenIndex;
let interface = 'HOME';

let buttonImages = [];
let HOME_BUTTON;
let INTRUCTIONS_BUTTON;

let toolsImages = [];
let scalpel;
let needle;
let tweezers;

let extractionElementsImages = [];
let bullet;
let appendix;

let nearestPoint = {};
let points = [];
let userPoints = []
let pointsGame = [];
let suturePoints = [];

let matrix = []
let deviationArray = [];

let xMax;
let xMin;

let vitalSignsSong;
let vitalSignsSongIsPlaying = false;

let time = 30;
let counter = 30;
let timeLevel = [];
let counterTime = 0;
let score = 0;
let finalGame = false;

let point = function (x, y) {
    this.x = x,
        this.y = y,
        this.click = false;
}


function preload() {
    currentScreenIndex = 0;

    screens.push(loadImage(`./assets/screens/home.png`))
    screens.push(loadImage(`./assets/screens/instructions.png`))


    for (let i = 0; i < 3; i++) {
        screens.push(loadImage(`./assets/screens/level1-${i+1}.png`))
    }
    for (let i = 0; i < 3; i++) {
        screens.push(loadImage(`./assets/screens/level2-${i+1}.png`))
    }
    for (let i = 0; i < 3; i++) {
        screens.push(loadImage(`./assets/screens/level3-${i+1}.png`))
    }

    screens.push(loadImage(`./assets/screens/score.png`))

    buttonImages.push(loadImage(`./assets/screenButtons/home.png`))
    buttonImages.push(loadImage(`./assets/screenButtons/instructions.png`))

    toolsImages.push(loadImage(`./assets/elements/scalpel.png`))
    toolsImages.push(loadImage(`./assets/elements/needle.png`))
    toolsImages.push(loadImage(`./assets/elements/tweezers.png`))

    extractionElementsImages.push(loadImage(`./assets/elements/bullet.png`))
    extractionElementsImages.push(loadImage(`./assets/elements/appendix.png`))


    vitalSignsSong = loadSound("./assets/soundFile/signos.wav");

}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.style('z-index', '-1')
    canvas.style('position', 'fixed')
    canvas.style('top', '0')
    canvas.style('right', '0')
    background(255)

    HOME_BUTTON = new Button({
        x: windowWidth / 2,
        y: windowHeight / 10 * 9,
        width: 120,
        height: 60,
        image: buttonImages[0]
    });

    INTRUCTIONS_BUTTON = new Button({
        x: windowWidth / 4 * 3,
        y: windowHeight / 10 * 9,
        width: 120,
        height: 60,
        image: buttonImages[1]
    });

    scalpel = new Scalpel({
        x: windowWidth / 9 * 2,
        y: windowHeight / 10 * 8.5,
        width: 50,
        height: 80,
        image: toolsImages[0]
    })

    needle = new Needle({
        x: windowWidth / 9 * 4.5,
        y: windowHeight / 10 * 8.5,
        width: 80,
        height: 80,
        image: toolsImages[1]
    })

    tweezers = new Tweezers({
        x: windowWidth / 9 * 7,
        y: windowHeight / 10 * 8.5,
        width: 100,
        height: 100,
        image: toolsImages[2]
    })

    bullet = new Bullet({
        x: windowWidth / 2,
        y: windowHeight / 11 * 5,
        width: 80,
        height: 50,
        image: extractionElementsImages[0]
    })
    appendix = new Appendix({
        x: windowWidth / 7 * 5,
        y: windowHeight / 13 * 7.5,
        width: 50,
        height: 30,
        image: extractionElementsImages[1]
    })
}

function saveUserPoints() {
    if (mouseIsPressed && dist(mouseX, mouseY, windowWidth / 2, windowHeight / 2) < windowHeight / 2) {
        let point = {
            x: mouseX,
            y: mouseY
        }
        userPoints.push(point);
    }
}

function endLevel(pointA, pointB, newInterface) {
    let xMax;
    if (pointA.x > pointB.x) {
        xMax = pointA.x
    } else {
        xMax = pointB.x
    }

    if (nearestPoint.x >= xMax - 10 && userPoints.length >= points.length) {
        interface = newInterface;
    }
}

function draw() {
    image(screens[currentScreenIndex], 0, 0, windowWidth, windowHeight)
    showInterface()
    closure()

}

function touchStarted() {
    changeScreen()
    itemsSelection()
}

function mouseRelease() {

}

function touchMoved() {
    switch (interface) {
        case 'LEVEL 1: CUT':
            scalpel.catched();
            findCloserPoint(pointsGame[0], pointsGame[1]);

            if (scalpel.isCatched) {
                endLevel(pointsGame[0], pointsGame[1], 'LEVEL 1: EXTRACT')
            }
            break;
        case 'LEVEL 1: EXTRACT':
            if (dist(tweezers.x, tweezers.y, bullet.x, bullet.y) < 50) {
                bullet.x = mouseX;
                bullet.y = mouseY;
            }

            if (dist(bullet.x, bullet.y, windowWidth / 2,
                    windowHeight / 11 * 5) > 200) {
                bullet = undefined;
                interface = 'LEVEL 1: CLOSURE'

                let pointA = new point((windowWidth / 13) * 4, (windowHeight / 9) * 4);
                let pointB = new point((windowWidth / 13) * 5.15, (windowHeight / 9) * 4.3);
                let pointC = new point((windowWidth / 13) * 6.35, (windowHeight / 9) * 4);
                let pointD = new point((windowWidth / 13) * 7.55, (windowHeight / 9) * 4.3);
                let pointE = new point((windowWidth / 13) * 8.75, (windowHeight / 9) * 4);
                suturePoints.push(pointA);
                suturePoints.push(pointB);
                suturePoints.push(pointC);
                suturePoints.push(pointD);
                suturePoints.push(pointE);
            }
            break;

        case 'LEVEL 1: CLOSURE':

            if (suturePoints.every((point) => point.click)) {
                interface = 'LEVEL 2: CUT';

                let pointA = new point((windowWidth / 9) * 2, (windowHeight / 21) * 11);
                let pointB = new point((windowWidth / 9) * 3, (windowHeight / 35) * 18);
                let pointC = new point((windowWidth / 9) * 4, (windowHeight / 91) * 45);
                let pointD = new point((windowWidth / 9) * 5, (windowHeight / 21) * 10);
                let pointE = new point((windowWidth / 9) * 6, (windowHeight / 9) * 4);
                let pointF = new point((windowWidth / 9) * 7, (windowHeight / 5) * 2);

                pointsGame.push(pointA);
                pointsGame.push(pointB);
                pointsGame.push(pointC);
                pointsGame.push(pointD);
                pointsGame.push(pointE);
                pointsGame.push(pointF);

                xMin = createStraightLine(pointsGame[0], pointsGame[1]);
                createStraightLine(pointsGame[1], pointsGame[2]);
                createStraightLine(pointsGame[2], pointsGame[3]);
                createStraightLine(pointsGame[3], pointsGame[4]);
                createStraightLine(pointsGame[4], pointsGame[5]);
            }
            break;
        case 'LEVEL 2: CUT':

            findCloserPoint(pointsGame[0], pointsGame[pointsGame.length - 1]);

            if (scalpel.isCatched) {
                endLevel(pointsGame[0], pointsGame[pointsGame.length - 1], 'LEVEL 2: EXTRACT')
            }
            break;
        case 'LEVEL 2: EXTRACT':
            if (dist(tweezers.x, tweezers.y, appendix.x, appendix.y) < 50) {
                appendix.x = mouseX;
                appendix.y = mouseY;
            }

            if (dist(appendix.x, appendix.y, windowWidth / 2,
                    windowHeight / 11 * 5) > 300) {
                appendix = undefined;
                interface = 'LEVEL 2: CLOSURE'

                let pointA = new point((windowWidth / 7) * 2.13, (windowHeight / 9) * 4.43);
                let pointB = new point((windowWidth / 7) * 3.15, (windowHeight / 9) * 4.68);
                let pointC = new point((windowWidth / 7) * 3.38, (windowHeight / 9) * 4.19);
                let pointD = new point((windowWidth / 7) * 4.67, (windowHeight / 9) * 4.45);
                let pointE = new point((windowWidth / 7) * 4.85, (windowHeight / 9) * 3.93);
                suturePoints.push(pointA);
                suturePoints.push(pointB);
                suturePoints.push(pointC);
                suturePoints.push(pointD);
                suturePoints.push(pointE);
            }
            break;

        case 'LEVEL 2: CLOSURE':
            if (suturePoints.every((point) => point.click)) {
                interface = 'LEVEL 3: CUT';

                let pointA = new point((windowWidth / 9) * 2, (windowHeight / 11) * 5.12);
                let pointB = new point((windowWidth / 9) * 2.6, (windowHeight / 11) * 5.37);
                let pointC = new point((windowWidth / 9) * 3.4, (windowHeight / 11) * 5.58);
                let pointD = new point((windowWidth / 9) * 4, (windowHeight / 11) * 5.65);
                let pointE = new point((windowWidth / 9) * 4.6, (windowHeight / 11) * 5.67);
                let pointF = new point((windowWidth / 9) * 5.2, (windowHeight / 11) * 5.64);
                let pointG = new point((windowWidth / 9) * 5.6, (windowHeight / 11) * 5.58);
                let pointH = new point((windowWidth / 9) * 6.4, (windowHeight / 11) * 5.37);
                let pointI = new point((windowWidth / 9) * 7, (windowHeight / 11) * 5.12);

                pointsGame.push(pointA);
                pointsGame.push(pointB);
                pointsGame.push(pointC);
                pointsGame.push(pointD);
                pointsGame.push(pointE);
                pointsGame.push(pointF);
                pointsGame.push(pointG);
                pointsGame.push(pointH);
                pointsGame.push(pointI);

                xMin = createStraightLine(pointsGame[0], pointsGame[1]);
                createStraightLine(pointsGame[1], pointsGame[2]);
                createStraightLine(pointsGame[2], pointsGame[3]);
                createStraightLine(pointsGame[3], pointsGame[4]);
                createStraightLine(pointsGame[4], pointsGame[5]);
                createStraightLine(pointsGame[5], pointsGame[6]);
                createStraightLine(pointsGame[6], pointsGame[7]);
                createStraightLine(pointsGame[7], pointsGame[8]);

            }
            break;
        case 'LEVEL 3: CUT':
            findCloserPoint(pointsGame[0], pointsGame[pointsGame.length - 1]);
            if (scalpel.isCatched) {
                endLevel(pointsGame[0], pointsGame[pointsGame.length - 1], 'SCORE')
            }
            break;
    }
}

function itemsSelection() {
    switch (interface) {
        case 'LEVEL 1: CUT':
            scalpel.selected();
            break;
        case 'LEVEL 1: EXTRACT':
            tweezers.selected();
            break;
        case 'LEVEL 1: CLOSURE':
            needle.selected();
            break;
        case 'LEVEL 2: CUT':
            scalpel.selected();
            break;
        case 'LEVEL 2: EXTRACT':
            tweezers.selected();
            break;
        case 'LEVEL 2: CLOSURE':
            needle.selected();
            break;
        case 'LEVEL 3: CUT':
            scalpel.selected();
            break;
        case 'LEVEL 3: EXTRACT':
            tweezers.selected();
            break;
        case 'LEVEL 3: CLOSURE':
            needle.selected();
            break;
    }
}

function itemsRelease() {
    scalpel.released();
    tweezers.released()
}

function closure() {
    switch (interface) {
        case 'LEVEL 1: CLOSURE':
            if (needle.isCatched) {
                needle.clickPoints(suturePoints);
            }
            break;
        case 'LEVEL 2: CLOSURE':
            if (needle.isCatched) {
                needle.clickPoints(suturePoints);
            }
            break;
        case 'LEVEL 3: CLOSURE':
            if (needle.isCatched) {
                needle.clickPoints(suturePoints);
            }
            break;
    }
}

function touchEnded() {
    clear()
}

function showInterface() {
    switch (interface) {
        case 'HOME':
            currentScreenIndex = 0;
            HOME_BUTTON.show();
            break;
        case 'INSTRUCTIONS':
            currentScreenIndex = 1;
            INTRUCTIONS_BUTTON.show()
            break;
        case 'LEVEL 1: CUT':
            currentScreenIndex = 2;
            scalpel.show()
            needle.show()
            tweezers.show()
            if (scalpel.isCatched) {
                saveUserPoints()
                scalpel.showTrace(points[0])
                getDeviation(points);
            }

            break;
        case 'LEVEL 1: EXTRACT':
            countTimeLevel();
            currentScreenIndex = 3;
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            scalpel.show()
            needle.show()
            tweezers.show()
            bullet.show();
            break;
        case 'LEVEL 1: CLOSURE':
            if (countTimeLevel === 0) {
                countTimeLevel();
            }
            currentScreenIndex = 4;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            fill(10, 10, 200);
            needle.joinPoints(suturePoints)
            break;
        case 'LEVEL 2: CUT':
            currentScreenIndex = 5;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            if (scalpel.isCatched) {
                saveUserPoints()
                scalpel.showTrace(points[0])
                getDeviation(points);
            }
            break;
        case 'LEVEL 2: EXTRACT':
            if (countTimeLevel === 0) {
                countTimeLevel();
            }
            currentScreenIndex = 6;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            appendix.show();
            break;
        case 'LEVEL 2: CLOSURE':
            if (countTimeLevel === 0) {
                countTimeLevel();
            }
            currentScreenIndex = 7;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            fill(10, 10, 200);
            needle.joinPoints(suturePoints)
            break;
        case 'LEVEL 3: CUT':
            currentScreenIndex = 8;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            countDown();
            if (vitalSignsSongIsPlaying === false) {
                vitalSignsSong.play();
                vitalSignsSongIsPlaying = true;
            } else if (frameCount % 300 === 0) {
                vitalSignsSongIsPlaying = false;
            }
            if (scalpel.isCatched) {
                saveUserPoints()
                scalpel.showTrace(points[0])
                getDeviation(points);
            }
            break;
        case 'SCORE':
            currentScreenIndex = 11;
            if (finalGame === false) {
                deviationMedia(matrix);
                gameResult();
                finalGame = true;
            }
            textSize(40);
            noStroke();
            fill(255);
            text(score, (windowWidth / 9) * 6, (windowHeight / 11) * 3.3);
            break;
    }
}

function changeScreen() {
    switch (interface) {
        case 'HOME':
            HOME_BUTTON.pressedButton()
            if (HOME_BUTTON.isClicked) {
                interface = 'INSTRUCTIONS'
            }
            break;
        case 'INSTRUCTIONS':
            INTRUCTIONS_BUTTON.pressedButton()
            if (INTRUCTIONS_BUTTON.isClicked) {
                interface = 'LEVEL 1: CUT';
                let pointA = new point((windowWidth / 9) * 2, (windowHeight / 11) * 5);
                let pointB = new point((windowWidth / 9) * 7, (windowHeight / 11) * 5);
                pointsGame.push(pointA);
                pointsGame.push(pointB);
                xMin = createStraightLine(pointsGame[0], pointsGame[1]);
            }
            break;
        case 'LEVEL 1: CUT':
            //scalpel.returnToBoard()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            break;
        case 'LEVEL 1: EXTRACT':
            tweezers.catched()
            scalpel.returnToBoard(windowWidth / 9 * 2, windowHeight / 10 * 8.5)
            points = [];
            deviationMedia(matrix);
            matrix = [];
            break;
        case 'LEVEL 1: CLOSURE':
            timeLevel.push(counterTime);
            counterTime = 0;
            tweezers.returnToBoard(windowWidth / 9 * 7, windowHeight / 10 * 8.5)
            needle.catched()
            break;
        case 'LEVEL 2: CUT':
            needle.returnToBoard(windowWidth / 9 * 4.5, windowHeight / 10 * 8.5, )
            suturePoints = [];
            break;
        case 'LEVEL 2: EXTRACT':
            timeLevel.push(counterTime);
            counterTime = 0;
            scalpel.returnToBoard(windowWidth / 9 * 2, windowHeight / 10 * 8.5)
            points = [];
            deviationMedia(matrix);
            matrix = [];
            break;
        case 'LEVEL 2: CLOSURE':
            timeLevel.push(counterTime);
            counterTime = 0;
            tweezers.returnToBoard(windowWidth / 9 * 7, windowHeight / 10 * 8.5)
            break;
        case 'LEVEL 3: CUT':
            suturePoints = [];
            needle.returnToBoard(windowWidth / 9 * 4.5, windowHeight / 10 * 8.5, )
            break;
        case 'LEVEL 3: EXTRACT':
            scalpel.returnToBoard(windowWidth / 9 * 2, windowHeight / 10 * 8.5)
            break;
        case 'LEVEL 3: CLOSURE':
            tweezers.returnToBoard(windowWidth / 9 * 7, windowHeight / 10 * 8.5)
            break;
    }
}

function showStraightLine(points) { //Al cambiar de pantalla (click)

    points.forEach((point) => {

        circle(point.x, point.y, 2);


    });
}

function createStraightLine(pointA, pointB) { //Al cambiar de pantalla (click)
    const numberOfPoints = (pointB.y - pointA.x) / pointA.x
    const m = (pointB.y - pointA.y) / (pointB.x - pointA.x)
    const b = pointA.y - m * pointA.x
    const distance = dist(pointA.x, pointA.y, pointB.x, pointB.y)
    const gap = distance / numberOfPoints

    let xMin;

    if (pointA.x > pointB.x) {
        xMin = pointB.x
    } else {
        xMin = pointA.x
    }

    let xMax;
    if (pointA.x > pointB.x) {
        xMax = pointA.x
    } else {
        xMax = pointB.x
    }

    for (let i = 0; i < numberOfPoints; i++) {
        let x = xMin + gap * i;
        let y = m * x + b;

        let point = {
            x: x,
            y: y
        }
        points.push(point);

    }
    points.push(pointB);
    return xMin
}

function findCloserPoint(pointA, pointB) { //Mientras se presiona
    let xMin;

    if (pointA.x > pointB.x) {
        xMin = pointB.x
    } else {
        xMin = pointA.x
    }
    const m = (pointB.y - pointA.y) / (pointB.x - pointA.x)
    const p = pointB.y - (m * pointB.x);
    let xPrev = xMin;
    let yPrev = m * xPrev + p;

    points.forEach(point => {
        if (dist(mouseX, mouseY, point.x, point.y) < dist(mouseX, mouseY, xPrev, yPrev)) {
            xPrev = point.x
            yPrev = point.y
        }
    });
    nearestPoint = {
        x: xPrev,
        y: yPrev
    }
}

// function validatePrecision(gap) { //Mientras se presiona
//     if (dist(mouseX, mouseY, nearestPoint.x, nearestPoint.y) <= gap && mouseIsPressed && startInteraction) {
//         console.log('BUEN PULSO CRACK!')
//     }
//     if (dist(mouseX, mouseY, nearestPoint.x, nearestPoint.y) > gap && mouseIsPressed && startInteraction) {
//         console.log('NO SIRVES PARA CIRUJANO')
//     }
// }

function getDeviation(points) {
    let deviation;
    let finalPoint = points.length

    deviation = dist(nearestPoint.x, nearestPoint.y, mouseX, mouseY) / dist(points[0].x, points[0].y, points[finalPoint - 1].x, points[finalPoint - 1].y);
    if (frameCount % 30 === 0 && deviation > 0) {
        matrix.push(deviation);
    }
    //console.log(matrix)
}

function deviationMedia(matrix) {
    let media = 0;
    matrix.forEach(element => {
        media = media + element;
    });
    //console.log(media)
    media = media / matrix.length;

    deviationArray.push(media);
    //console.log(deviationArray);
}

function countDown() {
    time++;
    if (time % 60 == 0) {
        counter--;
    }
    textSize(30);
    noStroke();
    fill(255);
    textAlign(LEFT, CENTER)
    textFont('Laqonic4FUnicase-SemiBold')
    text(counter, (windowWidth / 9) * 6.8, (windowHeight / 11) * 0.9);
    if (counter === 0) {
        interface = 'SCORE'
    }
}

function countTimeLevel() {
    if (frameCount % 60 === 0) {
        counterTime++
    }
}

function gameResult() {
    let mediaDeviation = 0;
    deviationArray.forEach(number => {
        if (number > 0) {
            mediaDeviation += number;
        }
    });
    mediaDeviation = mediaDeviation / 3;

    if (mediaDeviation > 0 && mediaDeviation < 0.1) {
        score += 5000
    } else if (mediaDeviation >= 0.1 && mediaDeviation < 0.3) {
        score += 3500
    } else if (mediaDeviation >= 0.3) {
        score += 1000
    }

    getPointsLevel();
}

function getPointsLevel() {
    timeLevel.forEach(number => {
        if (number >= 0 && number < 3) {
            score += 500
        } else if (number >= 3 && number < 5) {
            score += 300
        } else if (number >= 5) {
            score += 100
        }
    });
}