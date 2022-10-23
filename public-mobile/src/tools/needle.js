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

  clickPoints(pointsArray) {
    pointsArray.forEach((point, i) => {
      if (dist(point.x, point.y, mouseX, mouseY) < 10) {
        point.click = true;
      }
    });
  }

  joinPoints(pointsArray) {
    pointsArray.forEach((point, i) => {
      if (i <= 3) {
        if (point.click && points[i + 1].click) {
          line(point.x, point.y, points[i + 1].x, points[i + 1].y);
        }
      }
    });
  }
}