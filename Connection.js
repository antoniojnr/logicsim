class Connection {
  static ACTIVE = "#d4f2ff";
  static SELECTED = "#35b7f0";
  static NOT_SELECTED = "#000000";
  static POINT_RADIUS = 3.5;

  constructor(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
    this.points = [];
    this.state = Connection.NOT_SELECTED;
  }

  show() {
    strokeWeight(2);
    stroke(this.state);

    let all = [
      { x: this.c1.x, y: this.c1.y, over: false },
      ...this.points,
      { x: this.c2.x, y: this.c2.y, over: false },
    ];

    for (let i = 1; i < all.length; i++) {
      let p1 = all[i - 1];
      let p2 = all[i];

      line(p1.x, p1.y, p2.x, p2.y);
      if (p2.over) {
        fill("#FF0000");
      } else {
        fill(this.state);
      }

      noStroke();
      circle(p2.x, p2.y, Connection.POINT_RADIUS * 2);
      strokeWeight(2);
      stroke(this.state);
    }

    stroke("#000000");
    strokeWeight(1);
  }

  addPoint(x, y) {
    let newP = { x, y, over: false };
    let sliceAt = this.findInterval();

    if (sliceAt == 1) {
      this.points = [newP, ...this.points];
    } else if (sliceAt == this.points.length + 1) {
      this.points.push(newP);
    } else {
      this.points.splice(sliceAt - 1, 0, newP);
    }
  }

  mouseOverConnectionPoint() {
    for (let p of this.points) {
      if (dist(p.x, p.y, mouseX, mouseY) < Connection.POINT_RADIUS) {
        p.over = true;
      } else {
        p.over = false;
      }
    }
  }

  mouseDragged() {
    for (let p of this.points) {
      if (p.over) {
        p.x = mouseX;
        p.y = mouseY;
      }
    }
  }

  findInterval() {
    let all = [
      { x: this.c1.x, y: this.c1.y },
      ...this.points,
      { x: this.c2.x, y: this.c2.y },
    ];
    for (let i = 1; i < all.length; i++) {
      let p1 = all[i - 1];
      let p2 = all[i];

      if (this.isPointOverLine(p1.x, p1.y, p2.x, p2.y, mouseX, mouseY)) {
        return i;
      }
    }
  }

  mouseOver() {
    this.mouseOverConnectionPoint();

    if (this.isOverConnection()) {
      this.state = Connection.ACTIVE;
      this.over = true;
    } else {
      this.state = Connection.NOT_SELECTED;
      this.over = false;
    }

    return this.over;
  }

  isOverConnection() {
    let current = this.c1;
    for (let p of this.points) {
      if (this.isOverLine(current.x, current.y, p.x, p.y)) {
        return true;
      }
      current = p;
    }

    if (this.isOverLine(current.x, current.y, this.c2.x, this.c2.y)) {
      return true;
    }

    return false;
  }

  isOverLine(x1, y1, x2, y2) {
    return this.isPointOverLine(x1, y1, x2, y2, mouseX, mouseY);
  }

  isPointOverLine(x1, y1, x2, y2, px, py) {
    let d1 = dist(x1, y1, px, py);
    let d2 = dist(x2, y2, px, py);
    let d = dist(x1, y1, x2, y2);

    return d1 + d2 - d < 0.08;
  }

  equals(other) {
    return (
      (this.c1.x == other.c1.x &&
        this.c1.y == other.c1.y &&
        this.c2.x == other.c2.x &&
        this.c2.y == other.c2.y) ||
      (this.c1.x == other.c2.x &&
        this.c1.y == other.c2.y &&
        this.c2.x == other.c1.x &&
        this.c2.y == other.c1.y)
    );
  }
}
