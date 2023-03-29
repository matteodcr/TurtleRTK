import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {bluetoothManager} from './Rover/BLE/BluetoothManager';
import {ErrorManager} from './Caster/ErrorManager';
import Settings from './Settings';
//import LogManager from './LogManager';

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;
  bluetoothManager: bluetoothManager;
  errorManager: ErrorManager;
  settings: Settings;
  logManager: LogManager;

  constructor(
    basePool: BasePool,
    errorManager: ErrorManager,
    //logManager: LogManager,
    settings: Settings,
  ) {
    this.basePool = basePool;
    this.errorManager = errorManager;
    //this.logManager = logManager;
    this.settings = settings;
  }
}

function generateStore() {
  const appStore = new AppStore(
    new BasePool(),
    new ErrorManager(),
    //new LogManager(),
    new Settings(),
  );
  appStore.casterPool = new CasterPool(appStore, [], []);
  appStore.casterConnection = new CasterConnection(appStore);
  appStore.bluetoothManager = new bluetoothManager(appStore);
  return appStore;
}

const StoreContext = createContext<AppStore>(generateStore());

export const useStoreContext = () => useContext(StoreContext);
