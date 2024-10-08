class Port extends Movable {
  constructor(x, y, type, ...connectors) {
    super(x, y);

    this.size = 35;
    this.connectorSize = 5;
    this.type = type;

    if (type == "NOT") {
      this.in1 = connectors[0];
      this.out = connectors[1];

      this.in1.port = this;
      this.out.port = this;
      print("port" + this.out.port);
    } else {
      this.in1 = connectors[0];
      this.in2 = connectors[1];
      this.out = connectors[2];

      this.in1.port = this;
      this.in2.port = this;
      this.out.port = this;
    }

    if (type == "NOT") {
      this.in1.r = this.connectorSize;
      this.out.r = this.connectorSize;
    } else {
      this.in1.r = this.connectorSize;
      this.in2.r = this.connectorSize;
      this.out.r = this.connectorSize;
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

  updateConnectorsPositions() {
    let conn = this.getConnectorPositions();

    this.in1.x = conn.c1.x;
    this.in1.y = conn.c1.y;

    if (this.type == "NOT") {
      this.out.x = conn.c2.x;
      this.out.y = conn.c2.y;
    } else {
      this.in2.x = conn.c2.x;
      this.in2.y = conn.c2.y;

      this.out.x = conn.c3.x;
      this.out.y = conn.c3.y;
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
      this.x + this.size / 2 - 1,
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

    // Add the first anchor point.
    vertex(this.x, this.y);

    // Add the Bézier vertex.
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
<<<<<<< HEAD
      this.x + 40,
=======
      this.x + 5 * (this.size / 6),
>>>>>>> 7924d3a (Big update. A lot of things done.)
      this.y + this.size,
      this.x + this.size + 5, // pontax
      this.y + this.size / 2 // pontay
    );

    bezierVertex(
      this.x + this.size + 5, // pontax
      this.y + this.size / 2, // pontay
<<<<<<< HEAD
      this.x + 40,
=======
      this.x + 5 * (this.size / 6),
>>>>>>> 7924d3a (Big update. A lot of things done.)
      this.y,
      this.x,
      this.y
    );

    // Stop drawing the shape.
    endShape();
  }

  show() {
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

<<<<<<< HEAD
    strokeWeight(1);
=======
    // strokeWeight(1);
>>>>>>> 7924d3a (Big update. A lot of things done.)

    if (this.type == "AND") {
      this.and();
    } else if (this.type == "OR") {
      this.or();
    } else if (this.type == "NOT") {
      this.not();
    }
    // this.and();
    // fill(0);
    // textSize(16);
    // textAlign(CENTER, CENTER);
    // strokeWeight(1);
    // text(this.type, this.x + this.size / 2, this.y + this.size / 2);

    fill(255);
    this.in1.show();
    if (this.type != "NOT") this.in2.show();
    this.out.show();
  }

  calculateOutput() {
    if (this.type == "AND") {
      return this.in1.value && this.in2.value;
    } else if (this.type == "OR") {
      return this.in1.value || this.in2.value;
    } else if (this.type == "NOT") {
      return !this.in1.value;
    }
  }

  update() {
    let output = this.calculateOutput();
    print("update: " + output + " on out " + this.out.type);
    this.out.setValue(output);
    // atualizar as saídas das portas
  }

  equals(o) {
    return this.x == o.x && this.y == o.y && this.type == o.type;
  }

  // propagate() {

  //   this.connections.forEach((c) => {
  //     if (!this.equals(c.c1)) {
  //       c.c1.setValue(this.value);
  //     }

  //     if (!this.equals(c.c2)) {
  //       c.c2.setValue(this.value);
  //     }
  //   });
  // }
}
