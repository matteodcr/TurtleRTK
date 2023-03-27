import BleManager, {PeripheralInfo} from 'react-native-ble-manager';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {makeAutoObservable, runInAction} from 'mobx';
import {AppStore} from '../../Store';

export class bluetoothManager {
  bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
  peripherals: Array<any> = [];
  peripheral: PeripheralInfo | null = null;
  isScanning: boolean = false;
  displayNoNameDevices: boolean = false;
  outputData: String[] = [];
  parentStore: AppStore | null = null;

  setDisplayNoNameDevices(state: boolean) {
    this.displayNoNameDevices = state;
  }

  // ------- For ErrorPopUp -------
  isBluetoothActivated: boolean = false;
  displayBluetoothActivatedError: boolean = false;
  isLocalisationActivated: boolean = false;
  displayLocalisationActivatedError: boolean = false;
  setIsBluetoothActivated(state: boolean) {
    this.isBluetoothActivated = state;
  }
  setDisplayBluetoothActivatedError(state: boolean) {
    this.displayBluetoothActivatedError = state;
  }
  setIsLocalisationActivated(state: boolean) {
    this.isLocalisationActivated = state;
  }
  setDisplayLocalisationActivatedError(state: boolean) {
    this.displayLocalisationActivatedError = state;
  }
  // ------- ------- ------- -------

  constructor(parentStore: AppStore) {
    this.parentStore = parentStore;
    BleManager.start({showAlert: false}).then(() => {
      // Success code
      console.log('Module initialized');
    });
    makeAutoObservable(this);
  }

  clearOutput() {
    this.outputData = [];
  }

  getPeripherals() {
    return this.peripherals;
  }

  getPeripheral(peripheralId: string) {
    for (let i = 0; i < this.peripherals.length; i++) {
      if (this.peripherals[i].id === peripheralId) {
        return this.peripherals[i];
      }
    }
    return null;
  }

  setPeripheral(peripheral: PeripheralInfo) {
    for (let i = 0; i < this.peripherals.length; i++) {
      if (this.peripherals[i].id === peripheral.id) {
        this.peripherals[i] = peripheral;
        return;
      }
    }
    this.peripherals.push(peripheral);
  }

  scanDevices() {
    this.peripherals = [];
    if (!this.isScanning) {
      this.isScanning = true;
      try {
        console.log('Scanning...');
        BleManager.scan([], 5, false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  handleStopScan() {
    this.isScanning = false;
    console.log('Scan is stopped');
  }

  handleDisconnectedPeripheral(data) {
    let peripheral = this.getPeripheral(data.peripheral.id);
    if (peripheral) {
      //peripheral.connected = false;
      this.setPeripheral(peripheral);
    }
    console.log('Disconnected from ' + peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  }

  handleDiscoverPeripheral(peripheral) {
    this.setPeripheral(peripheral);
  }

  togglePeripheralConnection(peripheral) {
    if (peripheral && peripheral.connected) {
      BleManager.disconnect(peripheral.id);
      this.setPeripheral({
        ...peripheral,
        ...{connecting: false, connected: false, error: false},
      });
    } else {
      this.connectPeripheral(peripheral);
    }
  }

  connectPeripheral(peripheral) {
    try {
      if (peripheral) {
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
              //this.sendInformations([0])
            }),
          )
          .catch(() => {
            this.setPeripheral({
              ...peripheral,
              ...{connecting: false, connected: false, error: true},
            });
          });
      }
    } catch (error) {
      console.log('Connection error', error);
      this.setPeripheral({
        ...peripheral,
        ...{connecting: false, connected: false},
      });
    }
  }
  isSending: boolean = false;

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

  readNotification(event: any) {
    let buff = String.fromCharCode(...event.value);
    console.log('Received ' + buff);
    buff = buff + '\n';
    runInAction(() => {
      this.outputData.push(buff);
    });
  }

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
      this.readNotification.bind(this),
    ),
  ];
}
