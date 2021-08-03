const express = require("express");

const { PulsarConsumer } = require("./client/pulsar_consumer");
const { PulsarProducer } = require("./client/pulsar_producer");
const { pulsarConfig } = require("./config/pulsar_config");
const { PulsarService } = require("./service/pulsar_service");

const APP_PORT = 3000;

app = express();

counterExitTimeout = 0;
async function consumerCallback(message) {
  var data = JSON.parse(message);
  if (data.id == 10 && counterExitTimeout < 5) {
    counterExitTimeout++;
    setTimeout(function () {
      console.log(`TEST TIMEOUT FOR DATA ID ${data.id}`);
      console.log(new Date(), `PROCESSED MESSAGE: ${message}`);
      return true;
    }, 20000);
  } else {
    console.log(new Date(), `PROCESSED MESSAGE: ${message}`);
    return true;
  }
}

dataId = 1;
app.get("/produce", async (req, res) => {
  dataId++;
  let data = { last_name: "Pastor", first_name: "Cesar", id: dataId };
  let message = JSON.stringify(data);

  const producer = await PulsarService.produce(
    "test-topic",
    message,
    pulsarConfig
  );

  res.status(200).send({
    status: "pulsar_producer_produced",
    producer: producer.toString(),
    message: message,
  });
});

app.get("/add-producer", (req, res) => {
  const producer = new PulsarProducer(pulsarConfig).setTopic("test-topic");
  PulsarService.addProducer(producer);

  console.log(PulsarService.getProducers());

  res.status(200).send({
    status: "pulsar_producer_added",
    producer: producer.toString(),
  });
});

app.get("/consume", (req, res) => {
  const consumer1 = new PulsarConsumer(pulsarConfig)
    .setTopic("test-topic")
    .setSubscription("my-subscription")
    .setSubscriptionType("Shared")
    .setAcknowledgeTimeOutMs(5);
  PulsarService.addConsumer(consumer1, consumerCallback);

  console.log(PulsarService.getConsumers());

  res
    .status(200)
    .send({ status: "pulsar_consumer_created", consumer_name: consumer1.name });
});

app.listen(APP_PORT, (error) => {
  if (error) {
    console.error(`APPLICATION ERROR: ${error.message}`);
  }

  const consumer = new PulsarConsumer(pulsarConfig)
    .setTopic("test-topic")
    .setSubscription("my-subscription")
    .setSubscriptionType("Shared")
    .setAcknowledgeTimeOutMs(5);
  PulsarService.addConsumer(consumer, consumerCallback);

  console.log(
    `SERVER STARTED AT ${APP_PORT}, CONSUMER: ${consumer.toString()}`
  );
});
