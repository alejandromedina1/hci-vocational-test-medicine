class Needle extends Tool {

  constructor({
    x,
    y,
    width,
    height,
    image
  }) {
    super()
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image
    this.isCatched = false;
  }

  showPoints(points) {
    points.forEach(point => {
      fill(200, 180, 180);
      circle(point.x, point.y, 10);
    });
  }

  clickPoints(pointsArray) {
    pointsArray.forEach((point) => {
      if (dist(point.x, point.y, mouseX, mouseY) < 10) {
        point.click = true;
      }
    });
  }

  joinPoints(pointsArray) {
    pointsArray.forEach((point, i) => {
      if (i <= 3) {
        if (point.click && pointsArray[i + 1].click) {
          stroke(10,10,180);
          line(point.x, point.y, pointsArray[i + 1].x, pointsArray[i + 1].y);
        }
      }
    });
  }
}