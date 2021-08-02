const express = require("express");

const { PulsarConsumer } = require("./client/pulsar_consumer");
const { PulsarProducer } = require("./client/pulsar_producer");
const { pulsarConfig } = require("./config/pulsar_config");

const APP_PORT = 3000;

app = express();

/* 
CONSUMER TYPES: Shared, Exclusive
*/

consumerId = 0;
app.get("/consume", (req, res) => {
  consumerId++;

  const consumer1 = new PulsarConsumer(pulsarConfig)
    .setTopic("test-topic")
    .setSubscription("my-subscription")
    .setSubscriptionType("Shared")
    .setAcknowledgeTimeOutMs(5)
    .consume(consumerCallback);

  res
    .status(200)
    .send({ status: "pulsar_consumer_created", consumer_name: consumer1.name });
});

dataId = 0;
app.get("/produce", async (req, res) => {
  dataId++;

  let data = { last_name: "Pastor", first_name: "Cesar", id: dataId };
  let message = JSON.stringify(data);

  const producer = new PulsarProducer(pulsarConfig).setTopic("test-topic");
  producer.produce(message);

  res.status(200).send({
    status: "pulsar_producer_produced",
    producer: producer.toString(),
    message: message,
  });
});

async function consumerCallback(message) {
  var data = JSON.parse(message);
  if (data.id == 100000) {
    setTimeout(function () {
      console.log(`TEST TIMEOUT FOR DATA ID ${data.id}`);
      console.log(new Date(), `PROCESS MESSAGE: ${message}`);
      return true;
    }, 20000);
  } else {
    console.log(new Date(), `PROCESS MESSAGE: ${message}`);
    return true;
  }
}

app.listen(APP_PORT, (error) => {
  if (error) {
    console.error(`APPLICATION ERROR: ${error.message}`);
  }

  const consumer = new PulsarConsumer(pulsarConfig)
    .setTopic("test-topic")
    .setSubscription("my-subscription")
    .setSubscriptionType("Shared")
    .setAcknowledgeTimeOutMs(5);
  consumer.consume(consumerCallback);

  console.log(
    `SERVER STARTED AT ${APP_PORT}, CONSUMER: ${consumer.toString()}`
  );
});
