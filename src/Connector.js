class Connector {
  static ACTIVE = "#d4f2ff";
  static SELECTED = "#35b7f0";
  static NOT_SELECTED = "#FFFFFF";

  constructor(x, y, r) {
    this.id = Utils.generateUniqueId();
    this.x = x;
    this.y = y;
    this.r = r;

    this.connected = false;
    this.value = false;
    this.state = Connector.NOT_SELECTED;
    this.over = false;
    this.connections = [];
  }

  addConnection(conn) {
    this.connections.push(conn);
    this.propagate();
  }

  setValue(value) {
    this.connected = true;
    this.value = value;
    this.propagate();
  }

  propagate() {
    this.connections.forEach((c) => {
      if (!this.equals(c.c1)) {
        c.c1.setValue(this.value);
      }

      if (!this.equals(c.c2)) {
        c.c2.setValue(this.value);
      }
    });
  }

  equals(o) {
    return this.x == o.x && this.y == o.y;
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

      return this;
    }

    return null;
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
    fill(
      this.value && this.connected
        ? "rgba(255, 170, 0, 0.4)"
        : "rgba(255, 255, 255, 0.6)"
    );
    circle(this.x, this.y, this.r * 2);
  }
}
