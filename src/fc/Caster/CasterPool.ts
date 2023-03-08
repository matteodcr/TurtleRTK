import SourceTable from './SourceTable';
import {makeAutoObservable, observable, runInAction} from 'mobx';

export class CasterPool {
  subscribed: Array<SourceTable> = []; // casters dont les bases sont affichées
  unsubscribed: Array<SourceTable> = []; // casters enregistrés mais dont les bases sont pas affichées
  isLoading: boolean = false;

  constructor(subscribed: SourceTable[], unsubscribed: SourceTable[]) {
    this.subscribed = subscribed;
    this.unsubscribed = unsubscribed;
    makeAutoObservable(this, {
      subscribed: observable.shallow,
      unsubscribed: observable.shallow,
    });
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
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
      this.setLoading(true);
      sourceTable
        .getSourceTable(
          sourceTable.adress,
          sourceTable.port,
          sourceTable.username,
          sourceTable.password,
        )
        .then(() => runInAction(() => this.subscribed.push(sourceTable)));
      this.setLoading(false);
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
