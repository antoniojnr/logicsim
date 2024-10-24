let items = [];
let connectors = [];
let connections = [];
let startConnection;
let nowDrawing = 0;
let guide;
let fileInput;
let mouseState;
let itemDragged;
let showGuide = false;
let ports = [
  "CONNECTOR",
  "SWITCH",
  "AND",
  "OR",
  "NOT",
  "NAND",
  "CONST1",
  "CONST0",
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createPort(width / 2, height / 2, "OR");
  guide = createVector(width / 2, height / 2);
  frameRate(120);

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
  document
    .getElementById("btnNand")
    .addEventListener("click", (e) => (nowDrawing = 5));
  document
    .getElementById("btnSave")
    .addEventListener("click", (e) => saveCircuit());
  document
    .getElementById("btnLoad")
    .addEventListener("click", (e) => loadCircuit());
}

function loadCircuit() {
  fileInput = createFileInput(handleData, true);
  fileInput.position(3, 25);
}

function handleData(file) {
  connectors = file.data.connectors.map((c) => deserializeConnector(c));
  print(connectors);
  items = file.data.items.map((i) => deserializePort(i));
  print(items);
  connections = file.data.connections.map((c) => deserializeConnection(c));

  solveReferences();
  print(connections);
}

function deserializePort(port) {
  if (port.type === "NOT") {
    let c1 = connectors.find((c) => c.id == port.in1);
    let c2 = connectors.find((c) => c.id == port.out);

    let p = new Port(port.x, port.y, port.type, c1, c2);

    p.id = port.id;
    p.size = port.size;
    p.connectorSize = port.connectorSize;

    return p;
  } else {
    let c1 = connectors.find((c) => c.id == port.in1);
    let c2 = connectors.find((c) => c.id == port.in2);
    let c3 = connectors.find((c) => c.id == port.out);

    let p = new Port(port.x, port.y, port.type, c1, c2, c3);

    p.id = port.id;
    p.size = port.size;
    p.connectorSize = port.connectorSize;

    return p;
  }
}

function deserializeConnector(ctor) {
  let c = new PortConnector(ctor.x, ctor.y, ctor.r, ctor.type);
  c.id = ctor.id;
  c.port = ctor.port;
  c.connections = ctor.connections;

  return c;
}

function deserializeConnection(ction) {
  let c = new Connection(ction.c1, ction.c2);
  c.id = ction.id;
  c.points = ction.points;

  return c;
}

function solveReferences() {
  for (let c of connectors) {
    c.connections = c.connections.map((cId) =>
      connections.find((c1) => c1.id == cId)
    );
  }

  connections.forEach((ction) => {
    let c1 = connectors.find((c) => c.id == ction.c1);
    if (c1) ction.c1 = c1;

    let c2 = connectors.find((c) => c.id == ction.c2);
    if (c2) ction.c2 = c2;
  });
}

function serializePort(port) {
  return {
    id: port.id,
    size: port.size,
    connectorSize: port.connectorSize,
    type: port.type,
    x: port.x,
    y: port.y,
    in1: port.in1.id,
    in2: port.in2.id,
    out: port.out.id,
  };
}

function serializeConnector(c) {
  return {
    id: c.id,
    x: c.x,
    y: c.y,
    r: c.r,
    type: c.type,
    port: c.port.id,
    connections: c.connections.map((conn) => conn.id),
  };
}

function serializeConnection(c) {
  return {
    id: c.id,
    c1: c.c1.id,
    c2: c.c2.id,
    points: c.points,
  };
}

function saveCircuit() {
  let data = {
    items: items.map((i) => serializePort(i)),
    connections: connections.map((c) => serializeConnection(c)),
    connectors: connectors.map((c) => serializeConnector(c)),
  };

  saveJSON(data, "circuit.json", true);
}

function draw() {
  background(220);
  connections.forEach((c) => c.show());
  connectors.forEach((c) => c.show());
  items.forEach((c) => c.show());

  if (startConnection) {
    line(startConnection.x, startConnection.y, mouseX, mouseY);
  }

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
  } else if (type == "SWITCH") {
    connectors.push(new Switch(x, y));
  } else {
    let c1 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c2 = new PortConnector(0, 0, 0, PortConnector.IN);
    let c3 = new PortConnector(0, 0, 0, PortConnector.OUT);

    connectors.push(c1, c2, c3);

    let p = new Port(x, y, type, c1, c2, c3);

    items.push(p);
  }
}

function mouseClicked() {
  for (let c of connectors) {
    if (c.mouseOver())
      if (startConnection) {
        print("1. startConnection is set");
        let newC = new Connection(startConnection, c);
        if (!connections.some((e) => e.equals(newC))) {
          print("2. new connection", startConnection, c);
          if (startConnection instanceof PortConnector) {
            if (c instanceof Switch) {
              c.addConnection(newC);
              connections.push(newC);
            } else if (c instanceof PortConnector) {
              print("3. PortConnector to PortConnector");
              // Se c e startConnection são conectores de portas...
              if (!c.port.equals(startConnection.port)) {
                // A conexão só pode ser feita com conectores de portas diferentes
                print("portas diferentes");
                if (c.type != startConnection.type) {
                  // A conexão deve ser sempre adicionada ao conector cujo tipo é OUT
                  if (c.type == PortConnector.IN) {
                    startConnection.addConnection(newC);
                    connections.push(newC);
                  } else if (c.type == PortConnector.OUT) {
                    c.addConnection(newC);
                    connections.push(newC);
                  }
                }
              }
              // PortConnector com PortConnector ainda não funciona
              //
              // if (c.type != startConnection.type) {
              //   if (c.type == PortConnector.IN) {
              //     startConnection.addConnection(newC);
              //     connections.push(newC);
              //   } else if (c.type == PortConnector.OUT) {
              //     c.addConnection(newC);
              //     connections.push(newC);
              //   }
              // }
            }
          } else if (startConnection instanceof Switch) {
            if (c instanceof PortConnector) {
              startConnection.addConnection(newC);
              connections.push(newC);
            }
          }

          startConnection = null;
          return;
        }
      } else {
        // Se a função mouseClicked estiver definida
        if (c.mouseClicked) {
          c.mouseClicked();
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
  let list = [...connectors, ...items];

  for (let elm of list) {
    if (elm.mouseOver()) {
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
