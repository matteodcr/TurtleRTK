import { NtripClient } from 'react-native-ntrip-client';

class CasterConnection {
    caster: string;
    mountpoint: string;
    username: string;
    password: string;

    constructor(caster: string, mountpoint: string, username: string, password: string){
        this.caster = caster;
        this.mountpoint = mountpoint;
        this.username = username;
        this.password = password;
    }
    getNTRIPData() {

        const options = {
            host: this.caster,
            port: 2101,
            mountpoint: this.mountpoint,
            username: this.username,
            password: this.password,
            userAgent: 'NTRIP',
            xyz: [-1983430.2365, -4937492.4088, 3505683.7925],
            interval: 2000
        };

        const client = new NtripClient(options);

        client.on('data', (data) => {
            console.log(data);
        });

        client.on('close', () => {
            console.log('client close');
        });

        client.on('error', (err) => {
            console.log(err);
        });

        client.run();
    }
}

async function main() {
    const connection = new CasterConnection(
      "caster.centipede.fr",
      "CRO2",
      "centipede",
      "centipede"
    );
    connection.getNTRIPData();
}

main();


