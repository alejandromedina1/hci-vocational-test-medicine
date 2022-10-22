class Button {

    constructor({
        x,
        y,
        width,
        height,
        image
    }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image
        this.isClicked = false;
    }

    show() {
        imageMode(CENTER)
        image(this.image, this.x, this.y, this.width, this.height)
        imageMode(CORNER)
    }

    pressedButton() {
        const WIDTH_RIGHT = this.x + this.width / 2;
        const WIDTH_LEFT = this.x - this.width / 2;
        const HEIGHT_DOWN = this.y + this.height / 2;
        const HEIGHT_UP = this.y - this.height / 2;
        if (WIDTH_LEFT < mouseX && mouseX < WIDTH_RIGHT && HEIGHT_UP < mouseY && mouseY < HEIGHT_DOWN) {
            this.isClicked = true;
        }
    }
}