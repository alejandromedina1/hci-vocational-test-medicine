class Tweezers extends Tool {

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

    catched() {
        if (this.isCatched) {
            this.x = mouseX
            this.y = mouseY
        }
    }

}