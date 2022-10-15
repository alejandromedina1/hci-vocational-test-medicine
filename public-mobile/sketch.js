class Button {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = 50;
    this.pressed = false;
  }

  show() {
    circle(this.x, this.y, this.d);
  }

  click() {
    return dist(mouseX, mouseY, this.x, this.y) < 25;
  }
}

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
  x: 200,
  y: 200
}

const B = {
  x: 500,
  y: 600
}

let startInteraction = false;
let nearestPoint = {}
let points = [];
let m = 0;
let p = 0;
let y = 0;

let xMin = 0;
let xMax = 0;

let screen = 0;
let play; // El botón para empezar (círculo)
let startLevel1 = false;
let referencePointsLevel1 = [];

let vitalSigns;
let sound = false;


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

function calculateAllPoints() {
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

function findCloserPoint() {
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

  return nearestPoint;
}

function referencePoints() {

  let point = findCloserPoint();

  referencePointsLevel1.push(point);
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

function endLevel() {

  if (nearestPoint.x >= xMax - 10 && referencePointsLevel1.length >= points.length) {
    console.log('holi')
    screen++;
  }
}

function preload() {
  vitalSigns = loadSound("./sounds/signos.mp3");

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight)
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('right', '0');
  background(255);

  play = new Button(100, 100);
}

function draw() {
  //background(220);

  console.log(screen);
  switch (screen) {
    case 0:
      fill(250);
      play.show();

      if (play.pressed) {
        screen++;
        play.pressed = false;
      }

      break;

    case 1:
      // console.log(nearestPoint.x, A.x, nearestPoint.y, A.y )
      fill(250);
      // rect(0, 0, windowWidth, windowHeight);

      stroke(0)
      line(A.x, A.y, B.x, B.y);
      if (startLevel1) {
        validatePrecision();
      }
      endLevel();

      console.log(nearestPoint.x, xMax);
      break;

    case 2:
      rect(0, 0, 100, 100);
  }


}

// function mousePressed() {
//   if (dist(mouseX, mouseY, 100, 100) < 25) {
//       compare();
//       calculateAllPoints();
//       startInteraction = true;
//   }
// }

function touchMoved() {

  switch (screen) {
    case 0:
      if (play.click() === true) {
        play.pressed = true;
        compare();
        calculateAllPoints();
        startInteraction = true;
      }


      break;

    case 1:
      findCloserPoint();
      referencePoints();
      if (nearestPoint.x === A.x && nearestPoint.y === A.y) {
        startLevel1 = true;
      }

      if (startLevel1) {
        stroke(255, 0, 255)
        fill(255, 0, 255)
        line(mouseX, mouseY, pmouseX, pmouseY);
      }
      // eso del start level no está funcionando, porque pinta la línea incluso sin que haya tocado el inicio de la línea

      break;
  }

}

function touchEnded() {

}