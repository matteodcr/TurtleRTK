import {createContext, useContext} from 'react';
import {makeAutoObservable, observable, runInAction} from 'mobx';
import SourceTable from '../../fc/Caster/SourceTable';
import Base from '../../fc/Caster/Base';

export interface CasterPoolEntry {
  sourceTable: SourceTable;
  port: number;
  // name: string; // get with the sourcetable and to be print on UI
  username: string;
  password: string;
}

export class CasterPool {
  subscribed: Array<CasterPoolEntry>; // casters dont les bases sont affichées
  unsubscribed: Array<CasterPoolEntry>; // casters enregistrés mais dont les bases sont pas affichées

  constructor(subscribed, unsubscribed) {
    // TODO : Récupérer du cache
    // sinon
    this.subscribed = subscribed;
    this.unsubscribed = unsubscribed;
    makeAutoObservable(this, {
      subscribed: observable.shallow,
      unsubscribed: observable.shallow,
    });
  }

  findCaster(sourceTable: SourceTable, list: Array<CasterPoolEntry>): number {
    for (const [index, value] of list.entries()) {
      if (value.sourceTable.adress === sourceTable.adress) {
        return index;
      }
    }
    return -1;
  }

  addCaster(
    sourceTable: SourceTable,
    port: number,
    username: string,
    password: string,
  ) {
    if (
      this.findCaster(sourceTable, this.subscribed) === -1 &&
      this.findCaster(sourceTable, this.unsubscribed) === -1
    ) {
      sourceTable
        .getSourceTable(sourceTable.adress, port, username, password)
        .then(() =>
          runInAction(() =>
            this.subscribed.push({
              sourceTable,
              port,
              username,
              password,
            }),
          ),
        );
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
    const index = this.unsubscribed.findIndex(
      entry => entry.sourceTable === sourceTable,
    );
    if (index !== -1) {
      const [entry] = this.unsubscribed.splice(index, 1);
      this.subscribed.push(entry);
      return;
    }
    throw new Error('Caster pas unsubscribed');
  }
  unsubscribe(sourceTable: SourceTable) {
    const index = this.subscribed.findIndex(
      entry => entry.sourceTable === sourceTable,
    );
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
      var caster = casterPool.subscribed[i];
      this.baseList.push(...caster.sourceTable.entries.baseList);
    }
  }
}

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;

  constructor(casterPool: CasterPool, basePool: BasePool) {
    this.casterPool = casterPool;
    this.basePool = basePool;
  }
}

const StoreContext = createContext<AppStore>(
  new AppStore(new CasterPool([], []), new BasePool()),
);

export const useStoreContext = () => useContext(StoreContext);
