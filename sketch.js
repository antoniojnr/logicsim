let items = [];
let connectors = [];
let connections = [];
let startConnection;
let nowDrawing = 0;
let guide;
let mouseState;
let itemDragged;
let showGuide = false;
let info;
let ports = ["CONNECTOR", "SWITCH", "AND", "OR", "NOT", "CONST1", "CONST0"];

function setup() {
  createCanvas(800, 550);
  // createPort(width / 2, height / 2, "OR");
  guide = createVector(width / 2, height / 2);
  frameRate(120);

  info = document.getElementById("info");
  document
    .getElementById("btnConn")
    .addEventListener("click", (e) => (nowDrawing = 0));
  document
    .getElementById("btnSwitch")
    .addEventListener("click", (e) => (nowDrawing = 1));
  document
    .getElementById("btnAnd")
    .addEventListener("click", (e) => (nowDrawing = 2));
  document
    .getElementById("btnOr")
    .addEventListener("click", (e) => (nowDrawing = 3));
  document
    .getElementById("btnNot")
    .addEventListener("click", (e) => (nowDrawing = 4));
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

  if (showGuide) {
    fill("rgba(0, 0, 255, 0.4)");
    noStroke();
    circle(guide.x, guide.y, 30);
    stroke(150);
    line(guide.x, 0, guide.x, height);
    line(0, guide.y, width, guide.y);
    stroke(0);
  }
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
<<<<<<< HEAD
=======
  } else if (type == "SWITCH") {
    connectors.push(new Switch(x, y));
>>>>>>> 7924d3a (Big update. A lot of things done.)
  } else {
    let c1 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c2 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c3 = new PortConnector(0, 0, 0, PortConnector.OUT);

    connectors.push(c1, c2, c3);
<<<<<<< HEAD
    print(connectors);
    let p = new Port(x, y, type, c1, c2, c3);

    items.push(p);
=======

    items.push(new Port(x, y, type, c1, c2, c3));
>>>>>>> 7924d3a (Big update. A lot of things done.)
  }
}

function mouseClicked() {
  for (let c of connectors) {
<<<<<<< HEAD
    if (c.mouseOver() && startConnection) {
      let newC = new Connection(startConnection, c);
      if (!connections.some((e) => e.equals(newC))) {
        connections.push(newC);
        startConnection.addConnection(newC);

        startConnection = null;
        return;
      }
    }
=======
    if (c.mouseOver())
      if (startConnection) {
        let newC = new Connection(startConnection, c);
        if (!connections.some((e) => e.equals(newC))) {
          connections.push(newC);
          startConnection.addConnection(newC);

          startConnection = null;
          return;
        }
      } else {
        if (c.mouseClicked) {
          c.mouseClicked();
        }
      }
>>>>>>> 7924d3a (Big update. A lot of things done.)
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
  mouseState = "pressed";
  for (let c of connectors) {
    if (c.mousePressed()) {
      return;
    }
  }
}

function mouseReleased() {
  let lastState = mouseState;
  mouseState = "released";
  connectors.forEach((c) => c.mouseReleased());

  if (lastState == "dragged" && mouseState == "released") {
    if (
      guide.x > -1 &&
      guide.y > -1 &&
      dist(mouseX, mouseY, guide.x, guide.y) < 15
    ) {
      connections.forEach((c) => c.adjust(guide.x, guide.y));
      connectors.forEach((c) => {
        if (c.adjust) {
          c.adjust(guide.x, guide.y);
        } else {
          print("unavailable ", c);
        }
      });
    }
  }
}

function mouseDragged() {
  mouseState = "dragged";
  let dragging;
  showGuide = false;
  const draggables = [...connectors, ...connections, ...items];
  for (const c of draggables) {
    if (c.mouseDragged()) {
      dragging = c;
      break;
    }
  }

  if (dragging instanceof Connection) {
    connectors.forEach((c1) => {
      connectors.forEach((c2) => {
        // if (abs(c1.x - mouseX) < 10) {
        //   guide.x = c1.x;
        //   guide.y = mouseY;
        //   showGuide = true;
        // } else if (abs(c2.y - mouseY) < 10) {
        //   guide.x = mouseX;
        //   guide.y = c2.y;
        //   showGuide = true;
        // } else
        if (abs(c1.x - mouseX) < 10 && abs(c2.y - mouseY) < 10) {
          guide.x = c1.x;
          guide.y = c2.y;
          showGuide = true;
        } else if (abs(c2.x - mouseX) < 10 && abs(c1.y - mouseY) < 10) {
          guide.x = c2.x;
          guide.y = c1.y;
          showGuide = true;
        }
      });
    });
  } else if (dragging instanceof Connector) {
    connectors
      .filter((c) => !c.equals(dragging))
      .forEach((c) => {
        let details = "";
        if (abs(c.x - mouseX) < 10) {
          guide.x = c.x;
          guide.y = mouseY;
          showGuide = true;
        } else if (abs(c.y - mouseY) < 10) {
          guide.x = mouseX;
          guide.y = c.y;
          showGuide = true;
        }
      });
  }
}

function keyPressed() {
  if (keyCode == 32) {
    nowDrawing = (nowDrawing + 1) % ports.length;
  }
}
