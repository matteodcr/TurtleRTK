import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';

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
