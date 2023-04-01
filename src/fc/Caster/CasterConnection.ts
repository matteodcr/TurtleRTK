import {makeAutoObservable, runInAction} from 'mobx';

import {NtripClientV1} from './NTRIP/v1/clientV1';
import {NtripClientV2} from './NTRIP/v2/clientV2';
import {AppStore} from '../Store';
import Base from './Base';

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

/**
 * Manage the connection to an NTRIP connection to get position data
 */
export class CasterConnection {
  inputData: string[] = []; // RTCM data
  casterClient: NtripClientV1 | NtripClientV2;
  optionsV1: CasterConnectionOptionsNTRIPv1 | null = null;
  connectedBase: Base | null = null;
  isClosed = true;
  parentStore: AppStore | null = null;

  constructor(parentStore: AppStore) {
    makeAutoObservable(this);
    this.parentStore = parentStore;
  }

  /**
   * Close the caster connection
   */
  closeConnection() {
    this.isClosed = true;
  }

  /**
   * Configure the client connection to a NTRIP caster for the base
   * @param base - is the moutnpoint where we try to connect
   */
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

  /**
   * Reset the caster connection
   */
  resetConnection() {
    this.optionsV1 = null;
    this.connectedBase = null;
  }

  /**
   * Clear the received RTCM data array
   */
  clear() {
    this.inputData = [];
  }

  /**
   * Handle the connection to the caster, configureConnection is necessary before
   */
  getNTRIPData() {
    this.casterClient = new NtripClientV1(this.optionsV1);
    if (!this.connectedBase?.parentSourceTable.isNTRIPv1) {
      this.casterClient = new NtripClientV2(this.optionsV1);
    }
    this.isClosed = false;

    this.casterClient.on('data', data => {
      runInAction(() => {
        if (!this.isClosed) {
          this.inputData.push(data);
          this.parentStore?.bluetoothManager.sendInformations(data);
        } else {
          this.casterClient.client?.end();
          this.casterClient.close();
        }
      });
    });

    this.casterClient.on('close', () => {});

    this.casterClient.on('error', err => {
      console.log(err);
    });

    this.casterClient.run();
  }

  generateIcon() {
    if (this.isClosed) {
      return 'play';
    } else {
      return 'pause';
    }
  }

  generateText() {
    if (this.isClosed) {
      return 'Start';
    } else {
      return 'Stop & Save';
    }
  }
}
