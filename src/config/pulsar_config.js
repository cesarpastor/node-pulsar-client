const PULSAR_SERVICE_URL = "192.168.99.100:6650";
let pulsarConfig = {
  service_url: `pulsar://${PULSAR_SERVICE_URL}`,
};

module.exports.pulsarConfig = pulsarConfig;
