import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {bluetoothManager} from './Rover/BLE/BluetoothManager';
import {ErrorManager} from './Caster/ErrorManager';
import LogManager from './LogManager';

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;
  bluetoothManager: bluetoothManager;
  errorManager: ErrorManager;
  logManager: LogManager;

  constructor(
    basePool: BasePool,
    errorManager: ErrorManager,
    logManager: LogManager,
  ) {
    this.basePool = basePool;
    this.errorManager = errorManager;
    this.logManager = logManager;
  }
}

function generateStore() {
  const appStore = new AppStore(
    new BasePool(),
    new ErrorManager(),
    new LogManager(),
  );
  appStore.casterPool = new CasterPool(appStore, [], []);
  appStore.casterConnection = new CasterConnection(appStore);
  appStore.bluetoothManager = new bluetoothManager(appStore);
  return appStore;
}

const StoreContext = createContext<AppStore>(generateStore());

export const useStoreContext = () => useContext(StoreContext);
