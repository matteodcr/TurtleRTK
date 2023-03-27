import Base from './Base';
import {makeAutoObservable, observable} from 'mobx';
import {CasterPool} from './CasterPool';

export class BasePool {
  baseList: Base[] = [];
  favoriteList: string[] = [];
  favs: boolean = false;

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

  addFavorite(key: string) {
    this.favoriteList.push(key);
  }

  suppFavorite(key: string) {
    this.favoriteList = this.favoriteList.filter(item => item !== key);
  }

  setFavs() {
    this.favs = !this.favs;
  }
}
