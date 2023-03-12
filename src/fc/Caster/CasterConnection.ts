import {NtripClientV1} from './NTRIP/v1/clientV1';
import Base from './Base';
import {makeAutoObservable, runInAction} from 'mobx';

interface CasterConnectionOptionsNTRIPv1 {
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
  casterClientNTRIPv1;
  optionsV1: CasterConnectionOptionsNTRIPv1 | null = null;

  // TODO: Implement NTRIPv2
  // casterClientNTRIPv2: NtripClient = null;
  // optionsV2: CasterConnectionOptionsNTRIPv1 | null = null;

  connectedBase: Base | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  closeConnection() {
    this.casterClientNTRIPv1.close();
  }

  configureConnection(base: Base) {
    this.optionsV1 = {
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
    this.optionsV1 = null;
    this.connectedBase = null;
  }

  getNTRIPData() {
    this.casterClientNTRIPv1 = new NtripClientV1(this.optionsV1);

    this.casterClientNTRIPv1.on('data', data => {
      runInAction(() => {
        this.inputData.push(data);
      });
    });

    this.casterClientNTRIPv1.on('close', () => {
      console.log('client close');
    });

    this.casterClientNTRIPv1.on('error', err => {
      console.log(err);
    });

    this.casterClientNTRIPv1.run();
  }
}
