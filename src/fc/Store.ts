import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {bluetoothManager} from './Rover/BLE/BluetoothManager'
import {ErrorManager} from './Caster/ErrorManager';

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
  console.log(appStore.casterPool.parentStore);
  return appStore;
}

const StoreContext = createContext<AppStore>(generateStore());

export const useStoreContext = () => useContext(StoreContext);
