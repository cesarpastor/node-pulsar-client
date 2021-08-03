const { pulsarConfig } = require("./../config/pulsar_config");
const { PulsarConsumer } = require("./../client/pulsar_consumer");
const { PulsarProducer } = require("./../client/pulsar_producer");
const { PulsarService } = require("./../service/pulsar_service");
const {
  ConsumerCallbackService,
} = require("./../service/consumer_callback_service");

const express = require("express");
const expressWs = require("express-ws")(express());

exports.handleGet = async function (req, res) {
  return res.status(200).send({ status: "OK" });
};

dataId = 0;
exports.handleProduceMessage = async function (req, res) {
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
};

exports.handleAddProducer = async function (req, res) {
  const producer = new PulsarProducer(pulsarConfig).setTopic("test-topic");
  PulsarService.addProducer(producer);

  console.log(PulsarService.getProducers());

  res.status(200).send({
    status: "rest_resource_pulsar_producer_added",
    producer: producer.toString(),
  });
};

exports.handleAddConsumer = async function (req, res) {
  //ConsumerCallbackService.setApp(req.app);
  const consumer1 = new PulsarConsumer(pulsarConfig)
    .setTopic("test-topic")
    .setSubscription("my-subscription")
    .setSubscriptionType("Shared")
    .setAcknowledgeTimeOutMs(5);
  PulsarService.addConsumer(consumer1, ConsumerCallbackService.consume);

  console.log(PulsarService.getConsumers());

  res.status(200).send({
    status: "rest_resource_pulsar_consumer_created",
    consumer_name: consumer1.name,
  });
};

exports.handleAddCreate = async function (req, res) {
  const producer = new PulsarProducer(pulsarConfig).setTopic("test-topic");
  PulsarService.addProducer(producer);

  const consumer1 = new PulsarConsumer(pulsarConfig)
    .setTopic("test-topic")
    .setSubscription("my-subscription")
    .setSubscriptionType("Shared")
    .setAcknowledgeTimeOutMs(5);

  PulsarService.addConsumer(consumer1, ConsumerCallbackService, "consume");

  dataId++;
  let data = { last_name: "Pastor", first_name: "Cesar", id: dataId };
  let message = JSON.stringify(data);

  const produce = await PulsarService.produce(
    "test-topic",
    message,
    pulsarConfig
  );

  res.status(200).send({
    status: "create_producer_consumer_and_produce",
  });
};
