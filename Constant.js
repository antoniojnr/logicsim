class Constant extends Connector {
  constructor(x, y, value) {
    super(x, y, 10);
    this.value = value;
  }

  show() {
    super.show();
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    strokeWeight(1);
    text(this.value ? "1" : "0", this.x, this.y);
  }
}
