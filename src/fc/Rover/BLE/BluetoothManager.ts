import BleManager, {PeripheralInfo} from 'react-native-ble-manager';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {makeAutoObservable, runInAction} from 'mobx';

import {AppStore} from '../../Store';

export class bluetoothManager {
  bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
  peripherals: Array<any> = [];
  peripheral: PeripheralInfo | null = null;
  isScanning: boolean = false;
  isSending: boolean = false;
  displayNoNameDevices: boolean = false;
  outputData: String[] = [];
  parentStore: AppStore | null = null;

  /**
   * Configures if devices with no name are shown in the screen list
   * @param {boolean} state - the desired configuration
   */
  setDisplayNoNameDevices(state: boolean) {
    this.displayNoNameDevices = state;
  }

  // ------- For ErrorPopUp -------
  isBluetoothActivated: boolean = false;
  displayBluetoothActivatedError: boolean = false;
  /**
   * Sets the state of bluetooth flag
   * @param {boolean} state - sets the flag
   */
  setIsBluetoothActivated(state: boolean) {
    this.isBluetoothActivated = state;
  }
  /**
   * Sets the flag for showing bluetooth error
   * @param state - sets the flag
   */
  setDisplayBluetoothActivatedError(state: boolean) {
    this.displayBluetoothActivatedError = state;
  }
  // ------- ------- ------- -------

  constructor(parentStore: AppStore) {
    this.parentStore = parentStore;
    BleManager.start({showAlert: false}).catch(() => {
      if (this.parentStore?.errorManager !== null) {
        this.parentStore?.errorManager.printError('Error while starting BLE');
      }
    });
    makeAutoObservable(this);
  }

  /**
   * Clears BLE output datas
   */
  clearOutput() {
    this.outputData = [];
  }

  /**
   * Returns detected peripherals
   * @returns peripherals
   */
  getPeripherals(): Array<PeripheralInfo> {
    return this.peripherals;
  }

  /**
   * Returns the peripheral detected with this Id, null if none
   * @param peripheralId - the searched Id
   * @returns peripheral
   */
  getPeripheral(peripheralId: String): PeripheralInfo | null {
    for (let i = 0; i < this.peripherals.length; i++) {
      if (this.peripherals[i].id === peripheralId) {
        return this.peripherals[i];
      }
    }
    return null;
  }

  /**
   * Updates the peripheral with the same Id in the discovered list with the given peripheral.
   * If none found, adds the peripheral to the list
   * @param peripheral the new peripheral
   */
  setPeripheral(peripheral: PeripheralInfo) {
    for (let i = 0; i < this.peripherals.length; i++) {
      if (this.peripherals[i].id === peripheral.id) {
        this.peripherals[i] = peripheral;
        return;
      }
    }
    this.peripherals.push(peripheral);
  }

  /**
   * Starts scanning nerby peripherals for 5s
   */
  scanDevices() {
    this.peripherals = [];
    if (!this.isScanning) {
      this.isScanning = true;
      try {
        BleManager.scan([], 5, false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Called when the scan is stopped.
   */
  handleStopScan() {
    this.isScanning = false;
  }

  /**
   * Called when a peripheral is discovered by scanning
   * @param peripheral - the peripheral
   */
  handleDiscoverPeripheral(peripheral: PeripheralInfo) {
    this.setPeripheral(peripheral);
  }

  /**
   * Called when a peripheral is disconnected
   * @param data - contains deta.peripheral
   */
  handleDisconnectedPeripheral(data) {
    this.disconnectPeripheral(data.peripheral);
  }

  /**
   * Toggle the connection of the given peripheral (connected/disconnected)
   * @param peripheral - the peripheral to toggle
   */
  togglePeripheralConnection(peripheral /*: PeripheralInfo*/) {
    if (peripheral.connected) {
      this.disconnectPeripheral(peripheral);
    } else {
      this.connectPeripheral(peripheral);
    }
  }

  /**
   * Disconnects the given peripheral
   * @param peripheral - the peripheral to disconnect
   */
  disconnectPeripheral(peripheral /*: PeripheralInfo*/) {
    if (peripheral.connected) {
      BleManager.disconnect(peripheral.id);
      this.setPeripheral({
        ...peripheral,
        ...{connecting: false, connected: false, error: false},
      });
    }
  }

  /**
   * Connects to the given peripheral
   * @param peripheral - the peripheral to connect to
   */
  connectPeripheral(peripheral: PeripheralInfo) {
    this.setPeripheral({
      ...peripheral,
      ...{connecting: true, connected: false, error: false},
    });
    BleManager.connect(peripheral.id)
      .then(() =>
        runInAction(() => {
          this.setPeripheral({
            ...peripheral,
            ...{connecting: false, connected: true, error: false},
          });
        }),
      )
      .catch(() => {
        this.setPeripheral({
          ...peripheral,
          ...{connecting: false, connected: false, error: true},
        });
      });
  }

  /**
   * Starts communication with the given peripheral
   * @param data - datas to transfer
   * @param peripheralID - destination peripheral Id
   * @param serviceUUIDs - destination peripheral service UUIDs
   */
  startCommunication(
    data,
    peripheralID: string,
    serviceUUIDs?: string[] | undefined,
  ) {
    BleManager.retrieveServices(peripheralID, serviceUUIDs)
      .then(peripheralInfo => {
        runInAction(() => {
          this.setPeripheral({...peripheralInfo, ...{connected: true}});
          this.peripheral = peripheralInfo;
          if (!peripheralInfo.characteristics) {
            if (this.parentStore?.errorManager !== null) {
              this.parentStore?.errorManager.printError(
                'Error in peripheral characteristics',
              );
            }
            return;
          }
          peripheralInfo.characteristics.forEach(element => {
            if (!peripheralInfo.advertising.serviceUUIDs) {
              if (this.parentStore?.errorManager !== null) {
                this.parentStore?.errorManager.printError(
                  'Error in peripheral service UUIDs',
                );
              }
              return;
            }
            if (element.properties.Write && !this.isSending) {
              this.isSending = true;
              this.write(
                peripheralInfo.id,
                peripheralInfo.advertising.serviceUUIDs[0],
                element.characteristic,
                data,
              );
            }
          });
        });
      })
      .catch(() => {
        runInAction(() => {
          if (this.parentStore?.errorManager !== null) {
            this.parentStore?.errorManager.printError(
              'Error in peripheral retrieving services',
            );
          }
        });
      });
  }

  /**
   * Start notifications on 'Read' characteristics of the given peripheral
   * @param peripheralID - the given peripheral Id
   * @param serviceUUID - the given peripheral service UUID
   */
  startNotification(peripheralID: string, serviceUUID: string) {
    if (!this.peripheral || !this.peripheral.characteristics) {
      return;
    }
    this.peripheral.characteristics.forEach(element => {
      if (!this.peripheral) {
        return;
      }
      if (!this.peripheral.advertising.serviceUUIDs) {
        return;
      }
      if (element.properties.Read) {
        if (!this.peripheral.advertising.serviceUUIDs) {
          return;
        }
        BleManager.startNotification(
          peripheralID,
          serviceUUID,
          element.characteristic,
        ).catch(() => {});
      }
    });
  }

  /**
   * Called when the value of the characteristic you notified changed
   * Adds the new value to the outputData list
   * @param event - contains event.(value/peripheral/characteristic/service)
   */
  handleUpdateValueForCharacteristic(event) {
    let buff = String.fromCharCode(...event.value);
    runInAction(() => {
      this.outputData.push(buff + '\n');
    });
  }

  /**
   * Sends the datas to the given peripheral then starts notification on 'Read' properties of the peripheral
   * @param peripheralID - the peripheral Id
   * @param serviceUUID - the peripheral UUID
   * @param characteristicUUID - the peripheral characteristic UUID
   * @param data - the data to transfer
   * @param maxByteSize (optional) - the maximum size of data
   */
  write(
    peripheralID: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: any,
    maxByteSize?: number | undefined,
  ) {
    const buffer = Buffer.from(data);
    BleManager.write(
      peripheralID,
      serviceUUID,
      characteristicUUID,
      buffer.toJSON().data,
      maxByteSize,
    )
      .then(() => {
        runInAction(() => {
          this.isSending = false;
          this.startNotification(peripheralID, serviceUUID);
        });
      })
      .catch(() => {
        this.isSending = false;
        if (this.parentStore?.errorManager !== null) {
          this.parentStore?.errorManager.printError(
            'Error while writing to peripheral',
          );
        }
      });
  }

  /**
   * Allows to transfer the data to all connected peripherals
   * @param data - the data to transfer
   */
  sendInformations(data) {
    for (let i = 0; i < this.peripherals.length; i++) {
      if (this.peripherals[i].connected) {
        const peripheral: PeripheralInfo = this.peripherals[i];
        this.startCommunication(data, peripheral.id);
      }
    }
  }

  listeners = [
    this.bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      this.handleDiscoverPeripheral.bind(this),
    ),
    this.bleManagerEmitter.addListener(
      'BleManagerStopScan',
      this.handleStopScan.bind(this),
    ),
    this.bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      this.handleDisconnectedPeripheral.bind(this),
    ),
    this.bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      this.handleUpdateValueForCharacteristic.bind(this),
    ),
  ];
}
