const express = require("express");
const expressWs = require("express-ws")(express());
const router = express.Router();

const resource = require("./../resource/ws_resource");

//Url: ws://localhost:3001/ws/pulsar
router.ws("/pulsar", resource.handleWsTest);

module.exports = router;
