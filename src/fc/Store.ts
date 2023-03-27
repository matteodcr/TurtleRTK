import {createContext, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {bluetoothManager} from './Rover/BLE/BluetoothManager';
import {ErrorManager} from './Caster/ErrorManager';
import { create } from 'mobx-persist';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;
  bluetoothManager: bluetoothManager;
  errorManager: ErrorManager;

  constructor(
    basePool: BasePool,
    casterConnection: CasterConnection,
    errorManager: ErrorManager,
    bluetoothManager: bluetoothManager,
  ) {
    this.basePool = basePool;
    this.casterConnection = casterConnection;
    this.errorManager = errorManager;
    this.bluetoothManager = bluetoothManager;
    
    Promise.all([
      hydrate('fav', this.basePool),
      hydrate('caster', this.casterPool),])
  }
}

function generateStore() {
  const appStore = new AppStore(
    new BasePool(),
    new CasterConnection(),
    new ErrorManager(),
    new bluetoothManager(),
  );
  appStore.casterPool = new CasterPool(appStore, [], []);
  return appStore;
}

const StoreContext = createContext<AppStore>(generateStore());

export const useStoreContext = () => useContext(StoreContext);
