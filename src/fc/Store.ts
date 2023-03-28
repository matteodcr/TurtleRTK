import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {bluetoothManager} from './Rover/BLE/BluetoothManager';
import {ErrorManager} from './Caster/ErrorManager';
import Settings from './Settings';

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;
  bluetoothManager: bluetoothManager;
  errorManager: ErrorManager;
  settings: Settings;

  constructor(
    basePool: BasePool,
    errorManager: ErrorManager,
    bluetoothManager: bluetoothManager,
    settings: Settings,
  ) {
    this.basePool = basePool;
    this.errorManager = errorManager;
    this.bluetoothManager = bluetoothManager;
    this.settings = settings;
  }
}

function generateStore() {
  const appStore = new AppStore(
    new BasePool(),
    new ErrorManager(),
    new bluetoothManager(),
    new Settings(),
  );
  appStore.casterPool = new CasterPool(appStore, [], []);
  appStore.casterConnection = new CasterConnection(appStore);
  console.log(appStore.casterPool.parentStore);
  return appStore;
}

const StoreContext = createContext<AppStore>(generateStore());

export const useStoreContext = () => useContext(StoreContext);
