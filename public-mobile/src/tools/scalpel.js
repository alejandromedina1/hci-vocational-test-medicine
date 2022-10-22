class Scalpel extends Tool {

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
        this.initX = this.x;
        this.initY = this.y;
    }

    showTrace() {
        stroke(255, 0, 255)
        fill(255, 0, 255)
        line(mouseX, mouseY, pmouseX, pmouseY);
    }

}