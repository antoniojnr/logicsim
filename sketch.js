let items = [];
let connectors = [];
let connections = [];
let startConnection;
let nowDrawing = 0;
let ports = ["AND", "OR", "NOT"];

function setup() {
  createCanvas(400, 400);
  // connectors.push(new Connector(width / 2, height / 2, 10));
  createPort(width / 2, height / 2);
  frameRate(120);
}

function draw() {
  background(220);
  connections.forEach((c) => c.show());
  connectors.forEach((c) => c.show());
  items.forEach((c) => c.show());

  if (startConnection) {
    line(startConnection.x, startConnection.y, mouseX, mouseY);
  }

  fill(0);
  strokeWeight(1);
  textSize(20);
  text(ports[nowDrawing], 20, 380);
}

function createPort(x, y) {
  let c1 = new Connector(0, 0, 0);
  let c2 = new Connector(0, 0, 0);
  let c3 = new Connector(0, 0, 0);

  connectors.push(c1, c2, c3);

  items.push(new Port(x, y, "AND", c1, c2, c3));
}

function mouseClicked() {
  for (let c of connectors) {
    if (c.mouseOver() && startConnection) {
      let newC = new Connection(startConnection, c);
      if (!connections.some((e) => e.equals(newC))) {
        connections.push(newC);
      }

      startConnection = null;

      return;
    }
  }
}

function doubleClicked() {
  for (let c of connectors) {
    if (c.mouseOver()) {
      startConnection = c;
      return;
    }
  }

  for (let c of connections) {
    if (c.mouseOver()) {
      c.addPoint(mouseX, mouseY);

      return;
    }
  }

  if (ports[nowDrawing] == "TEST") {
    connectors.push(new Connector(mouseX, mouseY, 10));
  } else if (ports[nowDrawing] == "AND") {
    createPort(mouseX, mouseY);
  }
}

function mouseMoved() {
  for (let c of connectors) {
    if (c.mouseOver()) {
      return;
    }
  }

  for (let c of items) {
    if (c.mouseOver()) {
      return;
    }
  }

  connections.forEach((c) => c.mouseOver());
}

function mousePressed() {
  for (let c of connectors) {
    if (c.mousePressed()) {
      return;
    }
  }
}

function mouseReleased() {
  connectors.forEach((c) => c.mouseReleased());
}

function mouseDragged() {
  connectors.forEach((c) => c.mouseDragged());
  connections.forEach((c) => c.mouseDragged());
  items.forEach((c) => c.mouseDragged());
}

function keyPressed() {
  if (keyCode == 32) {
    nowDrawing = (nowDrawing + 1) % ports.length;
  }
}
