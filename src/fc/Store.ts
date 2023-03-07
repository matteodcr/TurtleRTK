import {createContext, useContext} from 'react';
import {makeAutoObservable, observable, runInAction} from 'mobx';
import {NtripClient} from 'react-native-ntrip-client';
import SourceTable from './Caster/SourceTable';
import Base from './Caster/Base';

export class CasterPool {
  subscribed: Array<SourceTable>; // casters dont les bases sont affichées
  unsubscribed: Array<SourceTable>; // casters enregistrés mais dont les bases sont pas affichées

  constructor(subscribed: SourceTable[], unsubscribed: SourceTable[]) {
    this.subscribed = subscribed;
    this.unsubscribed = unsubscribed;
    makeAutoObservable(this, {
      subscribed: observable.shallow,
      unsubscribed: observable.shallow,
    });
  }

  findCaster(sourceTable: SourceTable, list: SourceTable[]): number {
    for (const [index, value] of list.entries()) {
      if (value.adress === sourceTable.adress) {
        return index;
      }
    }
    return -1;
  }

  addCaster(sourceTable: SourceTable) {
    if (
      this.findCaster(sourceTable, this.subscribed) === -1 &&
      this.findCaster(sourceTable, this.unsubscribed) === -1
    ) {
      sourceTable
        .getSourceTable(
          sourceTable.adress,
          sourceTable.port,
          sourceTable.username,
          sourceTable.password,
        )
        .then(() => runInAction(() => this.subscribed.push(sourceTable)));
      return;
    }
    throw new Error('Caster déja dans la liste.');
  }
  removeCaster(sourceTable: SourceTable) {
    let index = this.findCaster(sourceTable, this.subscribed);
    if (index !== -1) {
      this.subscribed.splice(index);
    }
    index = this.findCaster(sourceTable, this.unsubscribed);
    if (index !== -1) {
      this.unsubscribed.splice(index, 1);
    }
  }

  subscribe(sourceTable: SourceTable) {
    const index = this.unsubscribed.findIndex(entry => entry === sourceTable);
    if (index !== -1) {
      const [entry] = this.unsubscribed.splice(index, 1);
      this.subscribed.push(entry);
      return;
    }
    throw new Error('Caster pas unsubscribed');
  }
  unsubscribe(sourceTable: SourceTable) {
    const index = this.subscribed.findIndex(entry => entry === sourceTable);
    if (index !== -1) {
      const [entry] = this.subscribed.splice(index, 1);
      this.unsubscribed.push(entry);
      return;
    }
    throw new Error('Caster pas subscribed');
  }

  get formatData() {
    return [
      {
        title: 'Active casters',
        data: this.subscribed.slice(),
      },
      {
        title: 'Saved casters',
        data: this.unsubscribed.slice(),
      },
    ];
  }
}

export class BasePool {
  baseList: Base[];
  favoriteList: string[];

  constructor() {
    this.baseList = [];
    this.favoriteList = [];
    makeAutoObservable(this, {
      baseList: observable.shallow,
      favoriteList: observable.shallow,
    });
  }

  generate(casterPool: CasterPool) {
    this.baseList = [];
    for (var i = 0; i < casterPool.subscribed.length; i++) {
      var sourceTable = casterPool.subscribed[i];
      this.baseList.push(...sourceTable.entries.baseList);
    }
  }
}

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

    console.log('RUN');
    this.casterReceiver.run();
  }
}

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;

  constructor(
    casterPool: CasterPool,
    basePool: BasePool,
    casterConnection: CasterConnection,
  ) {
    this.casterPool = casterPool;
    this.basePool = basePool;
    this.casterConnection = casterConnection;
  }
}

const StoreContext = createContext<AppStore>(
  new AppStore(new CasterPool([], []), new BasePool(), new CasterConnection()),
);

export const useStoreContext = () => useContext(StoreContext);
