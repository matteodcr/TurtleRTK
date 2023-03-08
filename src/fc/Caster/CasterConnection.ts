import {NtripClient} from 'react-native-ntrip-client';
import Base from './Base';
import {makeAutoObservable, runInAction} from 'mobx';

interface CasterConnectionOptions {
  host: string;
  port: number;
  mountpoint: string;
  username: string;
  password: string;
  userAgent: string;
  xyz;
  interval: number;
}

export class CasterConnection {
  inputData: string[] = [];
  casterReceiver: NtripClient = null;
  connectedBase: Base | null = null;
  options: CasterConnectionOptions | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  closeConnection() {
    this.casterReceiver.close();
  }

  configureConnection(base: Base) {
    this.options = {
      host: base.parentSourceTable.adress,
      port: base.parentSourceTable.port,
      mountpoint: base.mountpoint,
      username: base.parentSourceTable.username,
      password: base.parentSourceTable.password,
      userAgent: 'NTRIP',
      xyz: [-1983430.2365, -4937492.4088, 3505683.7925],
      interval: 2000,
    };
    this.connectedBase = base;
  }

  resetConnection() {
    this.options = null;
    this.connectedBase = null;
  }

  getNTRIPData() {
    this.casterReceiver = new NtripClient(this.options);

    this.casterReceiver.on('data', data => {
      runInAction(() => {
        this.inputData.push(data);
      });
    });

    this.casterReceiver.on('close', () => {
      console.log('client close');
    });

    this.casterReceiver.on('error', err => {
      console.log(err);
    });

    this.casterReceiver.run();
  }
}
