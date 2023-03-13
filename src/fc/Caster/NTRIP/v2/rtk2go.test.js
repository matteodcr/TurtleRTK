const {NtripClientV2} = require('./clientV2');

const options = {
  host: 'rtk2go.com',
  port: 2101,
  mountpoint: '',
  username: 'mattdecorsaire@gmail.com',
  password: 'none',
  xyz: [-1983430.2365, -4937492.4088, 3505683.7925],
  // the interval of send nmea, unit is millisecond
  interval: 2000,
};

const client = new NtripClientV2(options);

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
