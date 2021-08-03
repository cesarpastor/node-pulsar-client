const { PulsarProducer } = require("./../client/pulsar_producer");
class PulsarService {
  constructor() {
    this.consumers = [];
    this.producers = [];
  }

  consumers;
  producers;

  addConsumer(consumer, consumerCallback, callbackMethod) {
    let _consumer = this.consumers.find((x) => x.TOPIC == consumer.TOPIC);
    if (!_consumer) {
      this.consumers.push(consumer);
      consumer.consume(consumerCallback, callbackMethod);
    }
  }

  addProducer(producer) {
    let _producer = this.producers.find((x) => x.TOPIC == producer.TOPIC);
    if (!_producer) {
      this.producers.push(producer);
    }
  }

  async produce(topic, message, pulsarConfig) {
    let _producer = this.producers.find((x) => x.TOPIC == topic);
    if (!_producer) {
      if (!pulsarConfig) {
        const error_message = `Producer for topic ${topic} not exists, you must provide pulsar config parameter to call this`;
        console.error(
          `Producer for topic ${topic} not exists, you must provide pulsar config parameter to call this`
        );
        throw new Error(error_message);
      } else {
        const producer = new PulsarProducer(pulsarConfig).setTopic(topic);
        this.producers.push(producer);
        return await producer.produce(message);
      }
    } else {
      return await _producer.produce(message);
    }
  }

  getConsumers() {
    return this.consumers;
  }
  getProducers() {
    return this.producers;
  }
}

module.exports.PulsarService = new PulsarService();
