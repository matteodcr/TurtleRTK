import Base from './Base';
import {makeAutoObservable, observable} from 'mobx';
import {CasterPool} from './CasterPool';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class BasePool {
  baseList: Base[] = [];
  favoriteList: string[] = [];
  favs: boolean = false;
  distance: number = 200;
  favsDisplayDistance: boolean = true;

  constructor() {
    makeAutoObservable(this, {
      baseList: observable.shallow,
      favoriteList: observable.shallow,
    });
    this.loadFromStorage();
  }


  async loadFromStorage() {
    try {
      const storedData = await AsyncStorage.getItem('BasePoolData');
      if (storedData) {
        const { favoriteList, favs, distance, favsDisplayDistance } = JSON.parse(
          storedData
        );
        this.favoriteList = favoriteList;
        this.favs = favs;
        this.distance = distance;
        this.favsDisplayDistance = favsDisplayDistance;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async saveToStorage() {
    try {
      const data = JSON.stringify({
        favoriteList: this.favoriteList,
        favs: this.favs,
        distance: this.distance,
        favsDisplayDistance: this.favsDisplayDistance,
      });
      await AsyncStorage.setItem('BasePoolData', data);
    } catch (error) {
      console.error(error);
    }
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
    this.saveToStorage();
  }

  suppFavorite(key: string) {
    this.favoriteList = this.favoriteList.filter(item => item !== key);
    this.saveToStorage();
  }

  setFavs() {
    this.favs = !this.favs;
    this.saveToStorage();
  }

  setDistance(distance: number) {
    this.distance = distance;
    this.saveToStorage();
  }

  setFavsDisplayDistance() {
    this.favsDisplayDistance = !this.favsDisplayDistance;
    this.saveToStorage();
  }
}