/*const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
let socket = io(NGROK, {
  path: '/real-time'
})*/

nP = navigator.platform;
if (nP == "iPad" || nP == "iPhone" || nP == "iPod" || nP == "iPhone Simulator" || nP == "iPad Simulator") {
    $('select option[disabled]').remove();
}

let screens = []
let currentScreenIndex;
let interface = 'HOME'

let buttonImages = []
let HOME_BUTTON;
let INTRUCTIONS_BUTTON;

let toolsImages = []
let scalpel;
let needle;
let tweezers;

let nearestPoint = {};
let points = []
let userPoints = []
let matrix = []
let deviationArray = [];

let xMax;
let xMin;

let vitalSignsSong;
let vitalSignsSongIsPlaying = false;

let point = function (x, y) {
    this.x = x,
        this.y = y
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

    buttonImages.push(loadImage(`./assets/screenButtons/home.png`))
    buttonImages.push(loadImage(`./assets/screenButtons/instructions.png`))

    toolsImages.push(loadImage(`./assets/elements/scalpel.png`))
    toolsImages.push(loadImage(`./assets/elements/needle.png`))
    toolsImages.push(loadImage(`./assets/elements/tweezers.png`))


    //vitalSignsSong = loadSound("./assets/soundFile/signos.wav");

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
    console.log(nearestPoint.x, xMax)


    if (nearestPoint.x >= xMax - 10 && userPoints.length >= points.length) {
        console.log('holi')
        interface = newInterface;
    }
}

function draw() {
    image(screens[currentScreenIndex], 0, 0, windowWidth, windowHeight)
    showInterface()
}

function touchStarted() {
    changeScreen()
    itemsSelection()
    closure()
}

function mouseRelease() {

}

function touchMoved() {
    switch (interface) {
        case 'LEVEL 1: CUT':
            scalpel.showTrace()
            scalpel.catched();
            let pointA = new point((windowWidth / 9) * 2, (windowHeight / 11) * 5);
            let pointB = new point((windowWidth / 9) * 7, (windowHeight / 11) * 5);
            findCloserPoint(pointA, pointB);
            break;
        case 'LEVEL 2: CUT':
            scalpel.showTrace()
            findCloserPoint();
            break;
        case 'LEVEL 3: CUT':
            scalpel.showTrace()
            //findCloserPoint();
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
            needle.clickPoints(points);
            needle.joinPoints(points)
            break;
        case 'LEVEL 2: CLOSURE':
            needle.clickPoints(points);
            needle.joinPoints(points)
            break;
        case 'LEVEL 3: CLOSURE':
            needle.clickPoints(points);
            needle.joinPoints(points)
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
            //scalpel.returnToBoard()
            saveUserPoints()

            showStraightLine(points);

            break;
        case 'LEVEL 1: EXTRACT':
            currentScreenIndex = 3;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            break;
        case 'LEVEL 1: CLOSURE':
            currentScreenIndex = 4;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            break;
        case 'LEVEL 2: CUT':
            currentScreenIndex = 5;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            saveUserPoints()
            break;
        case 'LEVEL 2: EXTRACT':
            currentScreenIndex = 6;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            break;
        case 'LEVEL 2: CLOSURE':
            currentScreenIndex = 7;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            break;
        case 'LEVEL 3: CUT':
            currentScreenIndex = 8;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            saveUserPoints()
            break;
        case 'LEVEL 3: EXTRACT':
            currentScreenIndex = 9;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            break;
        case 'LEVEL 3: CLOSURE':
            currentScreenIndex = 10;
            scalpel.show()
            needle.show()
            tweezers.show()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
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
                interface = 'LEVEL 1: CUT'

                let pointA = new point((windowWidth / 9) * 2, (windowHeight / 11) * 5);
                let pointB = new point((windowWidth / 9) * 7, (windowHeight / 11) * 5);
                xMin = createStraightLine(pointA, pointB);


            }
            break;
        case 'LEVEL 1: CUT':
            scalpel.returnToBoard()
            scalpel.catched()
            needle.catched()
            tweezers.catched()
            let pointA = new point((windowWidth / 9) * 2, (windowHeight / 11) * 5);
            let pointB = new point((windowWidth / 9) * 7, (windowHeight / 11) * 5);
            endLevel(pointA, pointB, 'LEVEL 1: EXTRACT')
            break;
        case 'LEVEL 1: EXTRACT':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 1: CLOSURE':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 2: CUT':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 2: EXTRACT':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 2: CLOSURE':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 3: CUT':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 3: EXTRACT':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
            break;
        case 'LEVEL 3: CLOSURE':
            scalpel.returnToBoard()
            needle.returnToBoard()
            tweezers.returnToBoard()
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
    console.log(points);
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

function validatePrecision(gap) { //Mientras se presiona
    if (dist(mouseX, mouseY, nearestPoint.x, nearestPoint.y) <= gap && mouseIsPressed && startInteraction) {
        console.log('BUEN PULSO CRACK!')
    }
    if (dist(mouseX, mouseY, nearestPoint.x, nearestPoint.y) > gap && mouseIsPressed && startInteraction) {
        console.log('NO SIRVES PARA CIRUJANO')
    }
}

function getDeviation(points) {
    let deviation;
    let finalPoint = points.length

    deviation = dist(nearestPoint.x, nearestPoint.y, mouseX, mouseY) / dist(points[0].x, points[0].y, points[finalPoint - 1].x, points[finalPoint - 1].y);
    matrix.push(deviation);
}

function deviationMedia(matrix) {
    let media;
    matrix.forEach(element => {
        media += element;
    });
    media = media / matrix.length;

    deviationArray.push(media);
}