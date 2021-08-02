# node-pulsar-client

## Run Pulsar Docker

```
1. From a terminal go to docker-compose.yml folder, and run docker command line by line, make sure you installed docker

   - docker-machine start default
   - eval $(docker-machine env default)
   - docker-compose up -d

2. To stop docker container
   - docker-compose down
   - docker-machine stop default
```

## After succesfully running pulsar on docker you can access bellow WEB UI for pulsar, 192.168.99.100 is the docker machine IP

```
- PULSAR UI MANAGER - http://192.168.99.100:3000/
- ADD PULSAR CONNECTION - http://192.168.99.100:3000/connections
```

## Testing Pulsar on Docker

#### 1. CREATE TOPIC AND SUBSCRIPTION

```

- docker exec -it pulsar /bin/bash - bin/pulsar-client consume "test-topic" -s "test-subscription" -n 1
```

#### 2. PRODUCE MESSAGE

```

- docker exec -it pulsar /bin/bash
    Sample producer message 1
        - bin/pulsar-client produce "test-topic" -m "My first pulsar message!"
    Sample producer message 2
        - bin/pulsar-client produce "test-topic" -s --'' -m '{id: 1, last_name: "Pastor", first_name: "Cesar", age: 25, date_birth: "1996-12-29"}'

Note: in this sample once the message is consumed, the consumer (number 1) will then end
```

## NodeJS Pulsar client app

```
- npm i
- npm start
```

#### Pulsar Producer

```
- In a browser create sample producer by calling http://localhost:3000/produce
```

#### Pulsar add consumer, currently a consumer is added on the application, when it started, but you can add max of 4 total

```
- In a browser create sample consumer by calling http://localhost:3000/consumer
```

## NODEJS PULSAR CLIENT REFERENCE

```
Reference: https://pulsar.apache.org/docs/en/client-libraries-node/
Dependency build requirement: https://pulsar.apache.org/docs/en/client-libraries-cpp/#macos
```
