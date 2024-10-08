class Switch extends Connector {
  static ON = "#FF0000";
  static OFF = "#FFFFFF";
  constructor(x, y) {
    super(x, y, 10);
    this.value = false;
  }

  show() {
    super.show();
    fill(this.value ? Switch.ON : Switch.OFF);
    circle(this.x, this.y, 12);
  }

  mouseClicked() {
    this.setValue(!this.value);
  }

  adjust(x, y) {
    if (this.over) {
      this.x = x;
      this.y = y;
    }
  }
}
