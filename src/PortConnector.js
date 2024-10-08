class PortConnector extends Connector {
  static IN = 0;
  static OUT = 1;
  constructor(x, y, r, type) {
    super(x, y, r);
    this.port = null;
    this.type = type;
  }

  setValue(value) {
    super.setValue(value);

    if (this.type == PortConnector.IN) {
      this.port.update();
    }
  }

  mouseDragged() {
    return;
  }
}
