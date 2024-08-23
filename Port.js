class Port extends Movable {
  constructor(x, y, type, ...connectors) {
    super(x, y);

    this.size = 50;
    this.connectorSize = 5;
    this.type = type;
    print(connectors);
    this.c1 = connectors[0];
    this.c2 = connectors[1];
    this.c3 = connectors[2];

    this.c1.r = this.connectorSize;
    this.c2.r = this.connectorSize;
    this.c3.r = this.connectorSize;

    this.updateConnectorsPositions();
  }

  getConnectorPositions() {
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

  updateConnectorsPositions() {
    let conn = this.getConnectorPositions();

    this.c1.x = conn.c1.x;
    this.c1.y = conn.c1.y;

    this.c2.x = conn.c2.x;
    this.c2.y = conn.c2.y;

    this.c3.x = conn.c3.x;
    this.c3.y = conn.c3.y;
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

  show() {
    fill(this.state);
    square(this.x, this.y, this.size);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    strokeWeight(1);
    text(this.type, this.x + this.size / 2, this.y + this.size / 2);
    strokeWeight(2);
    let conn = this.getConnectorPositions();
    line(conn.c1.x, conn.c1.y, conn.c1.x + 20, conn.c1.y);
    line(conn.c2.x, conn.c2.y, conn.c2.x + 20, conn.c2.y);
    line(conn.c3.x, conn.c3.y, conn.c3.x - 20, conn.c3.y);
    strokeWeight(1);
    fill(255);
    this.c1.show();
    this.c2.show();
    this.c3.show();
  }
}
