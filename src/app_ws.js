const express = require("express");
const router = require("./routes/index");
const wsRoute = require("./routes/ws_routes");
var cors = require("cors");

const {
  ConsumerCallbackService,
} = require("./service/consumer_callback_service");

const app = express();
const expressWs = require("express-ws")(app);

ConsumerCallbackService.setExpressWs(expressWs);

const APP_PORT = 3001;

app.use(cors());
app.use("/test", router);
app.use("/ws", wsRoute);

app.get("/send", (req, res) => {
  const message = req.query.message;
  expressWs.getWss().clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });

  return res.status(200).send({ status: "OK" });
});

app.listen(APP_PORT, (error) => {
  if (error) {
    console.error(`APPLICATION ERROR: ${error.message}`);
  }

  console.log(`SERVER STARTED AT ${APP_PORT}`);
});
