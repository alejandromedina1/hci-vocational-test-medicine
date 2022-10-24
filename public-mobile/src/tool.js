class Tool {

    constructor() {

    }

    show() {
        imageMode(CENTER)
        image(this.image, this.x, this.y, this.width, this.height)
        imageMode(CORNER)
    }

    selected() {
        const WIDTH_RIGHT = this.x + this.width / 2;
        const WIDTH_LEFT = this.x - this.width / 2;
        const HEIGHT_DOWN = this.y + this.height / 2;
        const HEIGHT_UP = this.y - this.height / 2;
        if (WIDTH_LEFT < mouseX && mouseX < WIDTH_RIGHT && HEIGHT_UP < mouseY && mouseY < HEIGHT_DOWN) {
            this.isCatched = true;
        }
    }

    catched() {
        if (this.isCatched) {
            this.x = mouseX + this.width / 2
            this.y = mouseY - this.height / 2
        }
    }

    returnToBoard(initX, initY) {
            this.x = initX
            this.y = initY
            this.isCatched = false;
    }

    released() {
        this.isCatched = false;
    }
}