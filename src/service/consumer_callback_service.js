class ConsumerCallbackService {
  constructor() {}

  setExpressWs(expressWs) {
    this.expressWs = expressWs;
  }
  getExpressWs() {
    console.log("=== CONSUMER SERVICE GET WS");
    return this.expressWs;
  }
  setApp(app) {
    this.app = app;
    return this;
  }

  async consume(data) {
    await this.expressWs.getWss().clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
    console.log(new Date(), `Message: ${data} sent to client`);

    return true;
  }
}
module.exports.ConsumerCallbackService = new ConsumerCallbackService();
