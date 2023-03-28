import BleManager, {PeripheralInfo} from 'react-native-ble-manager';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {makeAutoObservable, runInAction} from 'mobx';

import {AppStore} from '../../Store';

export class bluetoothManager {
  bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
  discoveredPeripherals: Map<string, PeripheralInfo> = new Map(); //<Peripheral ID,Peripheral>
  connectedPeripherals: Map<string, PeripheralInfo> = new Map(); //<Peripheral ID,Peripheral>
  ongoingNotifications: Map<string, string[][]> = new Map(); //<Peripheral ID,[[service UUID, characteristic UUID],...]>
  isScanning: boolean = false;
  isSending: boolean = false;
  displayNoNameDevices: boolean = false;
  outputData: string[] = [];
  parentStore: AppStore | null = null;

  /**
   * Configures if devices with no name are shown in the screen list
   * @param {boolean} state - the desired configuration
   */
  setDisplayNoNameDevices(state: boolean) {
    this.displayNoNameDevices = state;
  }

  /**
   * Prints an error at the bottom of the screen
   * @param message - the message to display
   */
  printError(message: string) {
    if (this.parentStore?.errorManager !== null) {
      this.parentStore?.errorManager.printError(message);
    }
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
      this.printError('Error while starting BLE');
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
  getDiscoveredPeripherals(): Array<PeripheralInfo> {
    return Array.from(this.discoveredPeripherals.values());
  }

  /**
   * Returns connected peripherals
   * @returns peripherals
   */
  getConnectedPeripherals(): Array<PeripheralInfo> {
    return Array.from(this.connectedPeripherals.values());
  }

  /**
   * Starts scanning nerby peripherals for 5s
   */
  scanDevices() {
    this.discoveredPeripherals.clear();
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
    runInAction(() => {
      this.discoveredPeripherals.set(peripheral.id, peripheral);
    });
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
  togglePeripheralConnection(peripheral: PeripheralInfo) {
    if (this.connectedPeripherals.has(peripheral.id)) {
      this.disconnectPeripheral(peripheral);
    } else {
      this.connectPeripheral(peripheral);
    }
  }

  /**
   * Disconnects the given peripheral
   * @param peripheral - the peripheral to disconnect
   */
  disconnectPeripheral(peripheral: PeripheralInfo) {
    this.stopNotification(peripheral.id);
    BleManager.disconnect(peripheral.id)
      .then(() => {
        runInAction(() => {
          this.connectedPeripherals.delete(peripheral.id);
          this.isSending = false;
        });
      })
      .catch(() => {});
  }

  /**
   * Connects to the given peripheral
   * @param peripheral - the peripheral to connect to
   */
  connectPeripheral(peripheral: PeripheralInfo) {
    BleManager.connect(peripheral.id)
      .then(() =>
        runInAction(() => {
          this.connectedPeripherals.set(peripheral.id, peripheral);
        }),
      )
      .catch(() => {
        this.connectedPeripherals.delete(peripheral.id);
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
      .then(peripheral => {
        runInAction(() => {
          this.connectedPeripherals.set(peripheral.id, peripheral);
          this.discoveredPeripherals.set(peripheral.id, peripheral);
          if (!peripheral.characteristics) {
            this.printError('Error in peripheral characteristics');
            return;
          }
          peripheral.characteristics.forEach(element => {
            if (!peripheral.advertising.serviceUUIDs) {
              this.printError('Error in peripheral service UUIDs');
              return;
            }
            if (element.properties.Write && !this.isSending) {
              this.isSending = true;
              this.write(
                peripheral.id,
                peripheral.advertising.serviceUUIDs[0],
                element.characteristic,
                data,
              );
            }
          });
        });
      })
      .catch(() => {
        runInAction(() => {
          this.printError('Error in peripheral retrieving services');
        });
      });
  }

  /**
   * Start notifications on 'Read' characteristics of the given peripheral if not already done
   * @param peripheralID - the given peripheral Id
   * @param serviceUUID - the given peripheral service UUID
   */
  startNotification(peripheralID: string, serviceUUID: string) {
    let peripheral = this.connectedPeripherals.get(peripheralID);
    if (!peripheral || !peripheral.characteristics) {
      return;
    }
    if (!this.ongoingNotifications.has(peripheralID)) {
      BleManager.requestMTU(peripheralID, 512).catch(() => {
        this.printError('Unable to change BLE device MTU');
      });
    }

    peripheral.characteristics.forEach(element => {
      if (!peripheral || !peripheral.advertising.serviceUUIDs) {
        return;
      }
      if (element.properties.Read) {
        if (!peripheral.advertising.serviceUUIDs) {
          return;
        }
        let notifications = this.ongoingNotifications.get(peripheral.id);
        if (!notifications) {
          BleManager.startNotification(
            peripheralID,
            serviceUUID,
            element.characteristic,
          ).catch(() => {});
          this.ongoingNotifications.set(peripheralID, [
            [serviceUUID, element.characteristic],
          ]);
        } else {
          let notificationPresent = false;
          notifications.forEach(not => {
            if (not[0] === serviceUUID && not[1] === element.characteristic) {
              notificationPresent = true;
            }
          });
          if (!notificationPresent) {
            BleManager.startNotification(
              peripheralID,
              serviceUUID,
              element.characteristic,
            )
              .then(() => {
                runInAction(() => {
                  if (!notifications || !peripheral) {
                    return;
                  }
                  notifications.push([serviceUUID, element.characteristic]);
                  this.ongoingNotifications.set(peripheral.id, notifications);
                });
              })
              .catch(() => {});
          }
        }
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
   * Stops notifications of all characteristics of the given peripheral ID
   * @param peripheralID - the given paripheral ID
   */
  stopNotification(peripheralID: string) {
    let notifications = this.ongoingNotifications.get(peripheralID);
    if (notifications) {
      notifications.forEach(notification => {
        BleManager.stopNotification(
          peripheralID,
          notification[0],
          notification[1],
        ).catch(() => {});
      });
    }
    this.ongoingNotifications.delete(peripheralID);
  }

  /**
   * Stops all notifications of all peripherals
   */
  stopAllNotifications() {
    for (const peripheralId in this.ongoingNotifications.keys) {
      this.stopNotification(peripheralId);
    }
    this.ongoingNotifications.clear();
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
        this.printError('Error while writing to peripheral');
      });
  }

  /**
   * Allows to transfer the data to all connected peripherals
   * @param data - the data to transfer
   */
  sendInformations(data) {
    this.getConnectedPeripherals().forEach(peripheral => {
      this.startCommunication(data, peripheral.id);
    });
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
