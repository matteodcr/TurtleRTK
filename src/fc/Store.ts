import {createContext, useContext} from 'react';
import {CasterConnection} from './Caster/CasterConnection';
import {CasterPool} from './Caster/CasterPool';
import {BasePool} from './Caster/BasePool';
import {bluetoothManager} from './Rover/BLE/BluetoothManager'

export class AppStore {
  casterPool: CasterPool;
  basePool: BasePool;
  casterConnection: CasterConnection;
  bluetoothManager: bluetoothManager;

  constructor(
    casterPool: CasterPool,
    basePool: BasePool,
    casterConnection: CasterConnection,
    bluetoothManager: bluetoothManager,
  ) {
    this.casterPool = casterPool;
    this.basePool = basePool;
    this.casterConnection = casterConnection;
    this.bluetoothManager = bluetoothManager;
  }
}

const StoreContext = createContext<AppStore>(
  new AppStore(new CasterPool([], []), new BasePool(), new CasterConnection(), new bluetoothManager()),
);

export const useStoreContext = () => useContext(StoreContext);
