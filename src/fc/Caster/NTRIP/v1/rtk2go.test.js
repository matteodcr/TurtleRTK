const {NtripClientV1} = require('./clientV1');

const options = {
  host: 'caster.centipede.fr',
  port: 2101,
  mountpoint: '',
  username: 'centipede',
  password: 'centipede',
  xyz: [-1983430.2365, -4937492.4088, 3505683.7925],
  interval: 2000,
};

const client = new NtripClientV1(options);

client.on('data', data => {
  console.log(data.toString());
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
