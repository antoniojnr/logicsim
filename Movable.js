class Movable {
  static ACTIVE = "#d4f2ff";
  static SELECTED = "#35b7f0";
  static NOT_SELECTED = "#FFFFFF";

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.mouseOffset = {
      x: 0,
      y: 0,
    };
    this.state = Movable.NOT_SELECTED;
    this.over = false;
    this.isDragged = false;
  }

  mousePressed() {
    if (this.over) {
      this.state = Movable.SELECTED;
    }
  }

  mouseDragged() {
    if (this.over) {
      this.isDragged = true;
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  mouseOver() {
    if (this.isDragged) {
      this.mouseOffset = {
        x: mouseX - this.x,
        y: mouseY - this.y,
      };
    }
  }

  mouseReleased() {
    this.isDragged = false;
    if (this.over) {
      this.state = Movable.ACTIVE;
    } else {
      this.state = Movable.NOT_SELECTED;
    }
  }
}
