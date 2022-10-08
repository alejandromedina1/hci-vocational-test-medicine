const NGROK = `https://${window.location.hostname}`
console.log('Server IP: ', NGROK)
const DNS = getDNS
let socket = io(NGROK, {
    path: '/real-time'
})

nP = navigator.platform;
if (nP == "iPad" || nP == "iPhone" || nP == "iPod" || nP == "iPhone Simulator" || nP == "iPad Simulator") {
    $('select option[disabled]').remove();
}

const A = {
    x: 500,
    y: 500
}

const B = {
    x: 800,
    y: 700
}
let startInteraction = false;
let nearestPoint = {}
let points = [];
let m = 0;
let p = 0;
let y = 0;

let xMin = 0;
let xMax = 0;

function compare() {
    if (A.x <= B.x) {
        xMin = A.x
        xMax = B.x
    }
    if (A.x > B.x) {
        xMin = B.x
        xMax = A.x
    }
}

function calculateAllPoints(){
    m = (B.y - A.y) / (B.x - A.x);
    p = B.y - (m * B.x);
    for (let x = xMin; x <= xMax; x++) {
        y = m * x + p;
        let point = {}
        point['x'] = x;
        point['y'] = y;
        points.push(point);
    }
    console.log(points);
}

function findCloserPoint(){
    xPrev = xMin
    yPrev = m * xPrev + p;
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

function validatePrecision() {
    if (dist(mouseX, mouseY, nearestPoint.x, nearestPoint.y) <= 10 && mouseIsPressed && startInteraction) {
        console.log('BUEN PULSO CRACK!')
    }
    if (dist(mouseX, mouseY, nearestPoint.x, nearestPoint.y) > 10 && mouseIsPressed && startInteraction) {
        console.log('NO SIRVES PARA CIRUJANO')
    }
    socket.emit('coords', nearestPoint);
}

function preload() {}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(255);
}

function draw() {
    stroke(0)
    findCloserPoint();
    line(500, 500, 800, 700)
    if (mouseIsPressed) {
        validatePrecision();
    }
    circle(100,100, 50);

}

function mousePressed() {
    if (dist(mouseX, mouseY, 100, 100) < 25) {
        compare();
        calculateAllPoints();
        startInteraction = true;
    }
}

function keyPressed() {
    if (key == 'p') {
        compare();
        calculateAllPoints();
    }
    if (key == 'o') {
        console.log(nearestPoint);
    }
}

function touchMoved() {
    stroke(255, 0, 255)
    fill(255, 0, 255)
    line(mouseX, mouseY, pmouseX, pmouseY);
    return false;
}

function touchEnded() {

}