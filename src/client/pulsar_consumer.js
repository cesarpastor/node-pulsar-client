const Pulsar = require("pulsar-client");

class PulsarConsumer {
  constructor(config) {
    this.PULSAR_SERVICE_URL = config.service_url;
    this.ACKNOWLEDGE_TIMEOUT_MS = 10000;
    this.name = config.name
      ? config.name
      : `consumer-${new Date().getTime().toString(36)}`;
  }

  setTopic(topic) {
    this.TOPIC = topic;
    return this;
  }

  setSubscription(subscription) {
    this.SUBSCRIPTION = subscription;
    return this;
  }

  setSubscriptionType(subscriptionType) {
    this.SUBSCRIPTION_TYPE = subscriptionType;
    return this;
  }

  setAcknowledgeTimeOutMs(ackTimeoutMs) {
    ackTimeoutMs = ackTimeoutMs < 10000 ? 10000 : ackTimeoutMs;
    this.ACKNOWLEDGE_TIMEOUT_MS = ackTimeoutMs;
    return this;
  }

  toString() {
    let data = {
      service_url: this.PULSAR_SERVICE_URL,
      topic: this.TOPIC,
      subscription: this.SUBSCRIPTION,
      subscription_type: this.SUBSCRIPTION_TYPE,
      acknowledge_timeout_ms: this.ACKNOWLEDGE_TIMEOUT_MS,
      name: this.name,
    };
    return JSON.stringify(data);
  }

  async consume(classCallback, callbackMethod) {
    if (!classCallback) {
      throw new Error("Consumer consume callback is needed");
    }
    console.log(`CONSUMER ${this.name} STARTED`);

    const client = new Pulsar.Client({
      serviceUrl: this.PULSAR_SERVICE_URL,
    });

    try {
      const consumer = await client.subscribe({
        topic: this.TOPIC,
        subscription: this.SUBSCRIPTION,
        subscriptionType: this.SUBSCRIPTION_TYPE,
        ackTimeoutMs: this.ACKNOWLEDGE_TIMEOUT_MS,
        consumerName: this.name,
      });

      while (true) {
        const msg = await consumer.receive();

        console.log(
          new Date(),
          `${this.name} - Message received: `,
          msg.getData().toString()
        );
        var process_result;
        if (!callbackMethod) {
          process_result = await classCallback(msg.getData().toString());
        } else {
          process_result = await classCallback[callbackMethod](
            msg.getData().toString()
          );
        }

        if (process_result) {
          consumer.acknowledge(msg);
        }
      }

      await consumer.close();
    } catch (error) {
      console.log(`CONSUMER ${this.name} ERROR: `, error.message);
    }

    await client.close();
  }
}
module.exports.PulsarConsumer = PulsarConsumer;
