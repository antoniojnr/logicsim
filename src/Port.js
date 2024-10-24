class Port extends Movable {
  constructor(x, y, type, ...connectors) {
    super(x, y);

    this.id = Utils.generateUniqueId();
    this.size = 35;
    this.connectorSize = 5;
    this.type = type;

    if (type == "NOT") {
      this.setIn1(connectors[0]);
      this.setOut(connectors[1]);
    } else {
      this.setIn1(connectors[0]);
      this.setIn2(connectors[1]);
      this.setOut(connectors[2]);
    }

    this.updateConnectorsPositions();
  }

  getConnectorPositions() {
    if (this.type == "NOT") {
      return {
        c1: {
          x: this.x - 20,
          y: this.y + this.size / 2,
        },
        c2: {
          x: this.x + this.size + 20,
          y: this.y + this.size / 2,
        },
      };
    } else {
      return {
        c1: {
          x: this.x - 20,
          y: this.y + this.size / 4,
        },
        c2: {
          x: this.x - 20,
          y: this.y + 3 * (this.size / 4),
        },
        c3: {
          x: this.x + this.size + 20,
          y: this.y + 2 * (this.size / 4),
        },
      };
    }
  }

  setIn1(ctor) {
    this.in1 = ctor;

    if (this.in1) {
      this.in1.port = this;
      this.in1.r = this.connectorSize;
    }
  }

  setIn2(ctor) {
    this.in2 = ctor;

    if (this.in2) {
      this.in2.port = this;
      this.in2.r = this.connectorSize;
    }
  }

  setOut(ctor) {
    this.out = ctor;

    if (this.out) {
      this.out.port = this;
      this.out.r = this.connectorSize;
    }
  }

  updateConnectorsPositions() {
    let conn = this.getConnectorPositions();

    if (this.in1) {
      this.in1.x = conn.c1.x;
      this.in1.y = conn.c1.y;
    }

    if (this.type == "NOT") {
      if (this.out) {
        this.out.x = conn.c2.x;
        this.out.y = conn.c2.y;
      }
    } else {
      if (this.in2) {
        this.in2.x = conn.c2.x;
        this.in2.y = conn.c2.y;
      }

      if (this.out) {
        this.out.x = conn.c3.x;
        this.out.y = conn.c3.y;
      }
    }
  }

  mouseOver() {
    super.mouseOver();
    if (this.isMouseOver()) {
      this.state = Connector.ACTIVE;
      this.over = true;
    } else {
      this.state = Connector.NOT_SELECTED;
      this.over = false;
    }

    return this.over;
  }

  isMouseOver() {
    return (
      this.x < mouseX &&
      mouseX < this.x + this.size &&
      this.y < mouseY &&
      mouseY < this.y + this.size
    );
  }

  mouseDragged() {
    if (this.over) {
      this.isDragged = true;

      this.x = mouseX - this.mouseOffset.x;
      this.y = mouseY - this.mouseOffset.y;

      this.updateConnectorsPositions();
    }
  }

  and() {
    rect(this.x, this.y, this.size / 2, this.size);
    arc(
      this.x + this.size / 2 - 2,
      this.y + this.size / 2,
      this.size,
      this.size,
      HALF_PI + PI,
      HALF_PI
    );
  }

  not() {
    triangle(
      this.x,
      this.y,
      this.x,
      this.y + this.size,
      this.x + this.size - 10,
      this.y + this.size / 2
    );
    circle(this.x + this.size - 5, this.y + this.size / 2, 10);
  }

  or() {
    beginShape();

    vertex(this.x, this.y);

    bezierVertex(
      this.x + 15,
      this.y + this.size / 6,
      this.x + 15,
      this.y + 5 * (this.size / 6),
      this.x,
      this.y + this.size
    );

    bezierVertex(
      this.x,
      this.y + this.size,
      this.x + 5 * (this.size / 6),
      this.y + this.size,
      this.x + this.size + 5, // pontax
      this.y + this.size / 2 // pontay
    );

    bezierVertex(
      this.x + this.size + 5, // pontax
      this.y + this.size / 2, // pontay
      this.x + 5 * (this.size / 6),
      this.y,
      this.x,
      this.y
    );

    endShape();
  }

  show() {
    push();
    fill(this.state);
    // linhas
    strokeWeight(2);
    let conn = this.getConnectorPositions();
    if (this.type == "NOT") {
      line(conn.c1.x, conn.c1.y, conn.c1.x + 30, conn.c1.y);
      line(conn.c2.x, conn.c2.y, conn.c2.x - 20, conn.c2.y);
    } else {
      line(conn.c1.x, conn.c1.y, conn.c1.x + 30, conn.c1.y);
      line(conn.c2.x, conn.c2.y, conn.c2.x + 30, conn.c2.y);
      line(conn.c3.x, conn.c3.y, conn.c3.x - 20, conn.c3.y);
    }

    if (this.type == "AND") {
      this.and();
    } else if (this.type == "OR") {
      this.or();
    } else if (this.type == "NOT") {
      this.not();
    } else if (this.type == "NAND") {
      this.and();
      circle(conn.c3.x - 15, conn.c3.y, this.connectorSize * 2);
    }

    fill(255);
    this.in1.show();
    if (this.type != "NOT") this.in2.show();
    this.out.show();
    pop();
  }

  calculateOutput() {
    if (!this.in1.connected || !(this.in2 && this.in2.connected)) return false;

    if (this.type == "AND") {
      return this.in1.value && this.in2.value;
    } else if (this.type == "NAND") {
      return !(this.in1.value && this.in2.value);
    } else if (this.type == "OR") {
      return this.in1.value || this.in2.value;
    } else if (this.type == "NOT") {
      return !this.in1.value;
    }
  }

  update() {
    let output = this.calculateOutput();
    this.out.setValue(output);
  }

  equals(o) {
    return this.x == o.x && this.y == o.y && this.type == o.type;
  }
}
