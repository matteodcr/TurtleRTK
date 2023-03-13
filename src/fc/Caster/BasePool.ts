import Base from './Base';
import {makeAutoObservable, observable} from 'mobx';
import {CasterPool} from './CasterPool';

export class BasePool {
  baseList: Base[] = [];
  favoriteList: string[] = [];

  constructor() {
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
