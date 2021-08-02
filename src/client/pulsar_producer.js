const Pulsar = require("pulsar-client");

class PulsarProducer {
  constructor(config) {
    this.PULSAR_SERVICE_URL = config.service_url;
    this.name = config.name
      ? config.name
      : `produder-${new Date().getTime().toString(36)}`;
  }

  setTopic(topic) {
    this.TOPIC = topic;
    return this;
  }

  toString() {
    let data = {
      service_url: this.PULSAR_SERVICE_URL,
      topic: this.TOPIC,
      name: this.name,
    };
    return JSON.stringify(data);
  }

  async produce(message) {
    console.log(
      new Date(),
      `=== PRODUCING MESSAGE: ${message} FOR TOPIC NAME: ${this.TOPIC}, PRODUCER NAME: ${this.name}`
    );

    // Create a client
    const client = new Pulsar.Client({
      serviceUrl: this.PULSAR_SERVICE_URL,
    });

    try {
      // Create a producer
      const producer = await client.createProducer({
        topic: this.TOPIC,
      });

      producer.send({
        data: Buffer.from(message),
      });

      await producer.flush();
      await producer.close();

      console.log(
        new Date(),
        `=== MESSAGE: ${message} FOR TOPIC NAME: ${this.TOPIC} PRODUCED `
      );
    } catch (error) {
      console.error(new Date(), error);
    }

    await client.close();
  }
}

module.exports.PulsarProducer = PulsarProducer;
