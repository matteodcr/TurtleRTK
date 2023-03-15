import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {ErrorManager} from './Caster/ErrorManager';

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;
  errorManager: ErrorManager;

  constructor(
    basePool: BasePool,
    casterConnection: CasterConnection,
    errorManager: ErrorManager,
  ) {
    this.basePool = basePool;
    this.casterConnection = casterConnection;
    this.errorManager = errorManager;
  }
}

function generateStore() {
  const appStore = new AppStore(
    new BasePool(),
    new CasterConnection(),
    new ErrorManager(),
  );
  appStore.casterPool = new CasterPool(appStore, [], []);
  console.log(appStore.casterPool.parentStore);
  return appStore;
}

const StoreContext = createContext<AppStore>(generateStore());

export const useStoreContext = () => useContext(StoreContext);
