const express = require("express");
const router = express.Router();

const resource = require("./../resource/test_resource");

router.get("/message", resource.handleGet);
router.get("/add-producer", resource.handleAddProducer);
router.get("/add-consumer", resource.handleAddConsumer);
router.get("/produce-message", resource.handleProduceMessage);
router.get("/test", resource.handleAddCreate);

module.exports = router;
