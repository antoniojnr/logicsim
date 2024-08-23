class Connector {
  static ACTIVE = "#d4f2ff";
  static SELECTED = "#35b7f0";
  static NOT_SELECTED = "#FFFFFF";

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.state = Connector.NOT_SELECTED;
    this.over = false;
  }

  mouseOver() {
    if (dist(this.x, this.y, mouseX, mouseY) < this.r) {
      this.state = Connector.ACTIVE;
      this.over = true;
    } else {
      this.state = Connector.NOT_SELECTED;
      this.over = false;
    }

    return this.over;
  }

  mousePressed() {
    if (this.over) {
      this.state = Connector.SELECTED;
    }
  }

  mouseDragged() {
    if (this.over) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  mouseReleased() {
    if (this.over) {
      this.state = Connector.ACTIVE;
    } else {
      this.state = Connector.NOT_SELECTED;
    }
  }

  show() {
    fill(this.state);
    circle(this.x, this.y, this.r * 2);
  }

  // select() {
  //   this.color = Connector.SELECTED;
  // }

  // active() {
  //   this.color = Connector.ACTIVE;
  // }

  // normal() {
  //   this.color = Connector.NOT_SELECTED;
  // }
}
