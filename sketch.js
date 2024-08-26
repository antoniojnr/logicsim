let items = [];
let connectors = [];
let connections = [];
let startConnection;
let nowDrawing = 0;
let ports = ["AND", "CONNECTOR", "OR", "NOT", "CONST1", "CONST0"];

function setup() {
  createCanvas(400, 400);
  // connectors.push(new Connector(width / 2, height / 2, 10));
  createPort(width / 2, height / 2, "AND");
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
  textAlign(LEFT, CENTER);
  text(ports[nowDrawing], 20, 380);
}

function createPort(x, y, type) {
  if (type == "NOT") {
    let c1 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c2 = new PortConnector(0, 0, 0, PortConnector.OUT);

    connectors.push(c1, c2);

    let p = new Port(x, y, "NOT", c1, c2);

    items.push(p);
  } else if (type == "CONNECTOR") {
    connectors.push(new Connector(x, y, 10));
  } else {
    let c1 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c2 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c3 = new PortConnector(0, 0, 0, PortConnector.OUT);

    connectors.push(c1, c2, c3);
    print(connectors);
    let p = new Port(x, y, type, c1, c2, c3);

    items.push(p);
  }
}

function mouseClicked() {
  for (let c of connectors) {
    if (c.mouseOver() && startConnection) {
      let newC = new Connection(startConnection, c);
      if (!connections.some((e) => e.equals(newC))) {
        connections.push(newC);
        startConnection.addConnection(newC);

        startConnection = null;
        return;
      }
    }
  }
  startConnection = null;
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

  if (ports[nowDrawing] == "CONST0") {
    connectors.push(new Constant(mouseX, mouseY, false));
  } else if (ports[nowDrawing] == "CONST1") {
    connectors.push(new Constant(mouseX, mouseY, true));
  } else {
    createPort(mouseX, mouseY, ports[nowDrawing]);
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
