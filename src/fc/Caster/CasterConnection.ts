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
  connectedBase: Base | null = null;
  isClosed = true;

  constructor() {
    makeAutoObservable(this);
  }

  closeConnection() {
    this.isClosed = true;
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

  clear() {
    this.inputData = [];
  }

  getNTRIPData() {
    this.casterClientNTRIPv1 = new NtripClientV1(this.optionsV1);
    this.isClosed = false;

    this.casterClientNTRIPv1.on('data', data => {
      runInAction(() => {
        console.log('connection');
        if (!this.isClosed) {
          this.inputData.push(data);
        } else {
          this.casterClientNTRIPv1.client.end();
          this.casterClientNTRIPv1.close();
        }
      });
    });

    this.casterClientNTRIPv1.on('close', () => {});

    this.casterClientNTRIPv1.on('error', err => {
      console.log(err);
    });

    this.casterClientNTRIPv1.run();
  }
}
