const {NtripClientV2} = require('./clientV2');

const options = {
  host: 'caster.centipede.fr',
  port: 2101,
  mountpoint: 'CRO2',
  username: 'centipede',
  password: 'centipede',
  xyz: [-1983430.2365, -4937492.4088, 3505683.7925],
  // the interval of send nmea, unit is millisecond
  interval: 10000,
};

const client = new NtripClientV2(options);

client.on('data', data => {
  console.log(data);
});

client.on('close', () => {
  console.log('client close');
});

client.on('error', err => {
  console.log(err);
});

client.run();

setTimeout(() => {
  client.close();
}, 10000);
