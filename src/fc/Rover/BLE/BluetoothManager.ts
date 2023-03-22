import BleManager, {PeripheralInfo} from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { makeAutoObservable, runInAction, observable } from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {NmeaMessage, NmeaTransport} from '@gnss/nmea';
import {ErrorManager} from '../../Caster/ErrorManager'


export class bluetoothManager{
    bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

    peripherals :Array<any> = []
    isScanning: boolean = false;

    displayNoNameDevices: boolean = false;
    setDisplayNoNameDevices(state: boolean) {this.displayNoNameDevices = state};

    // ------- For ErrorPopUp -------
    isBluetoothActivated: boolean = false;
    displayBluetoothActivatedError: boolean = false;
    isLocalisationActivated: boolean = false;
    displayLocalisationActivatedError: boolean = false;
    setIsBluetoothActivated(state: boolean) {this.isBluetoothActivated = state};
    setDisplayBluetoothActivatedError(state: boolean) {this.displayBluetoothActivatedError = state};
    setIsLocalisationActivated(state: boolean) {this.isLocalisationActivated = state};
    setDisplayLocalisationActivatedError(state: boolean) {this.displayLocalisationActivatedError = state};
    // ------- ------- ------- -------

    constructor(){
        BleManager.start({ showAlert: false }).then(() => {
            // Success code
            console.log("Module initialized");
        });
        makeAutoObservable(this);
    }

    getPeripherals(){
        return this.peripherals;
    }

    getPeripheral(peripheralId:string){
        for(let i=0; i<this.peripherals.length; i++){
            if(this.peripherals[i].id==peripheralId){
                return this.peripherals[i];
            }
        }
        return null;
    }

    setPeripheral(peripheral: PeripheralInfo){
        for(let i=0; i<this.peripherals.length; i++){
            if(this.peripherals[i].id==peripheral.id){
                this.peripherals[i]=peripheral;
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
    };

    handleDisconnectedPeripheral(data) {
        let peripheral = this.getPeripheral(data.peripheral.id);
        if (peripheral) {
            //peripheral.connected = false;
            this.setPeripheral(peripheral);
        }
        console.log('Disconnected from ' + peripheral);
    };

    handleUpdateValueForCharacteristic(data) {
        console.log(
            'Received data from ' +
            data.peripheral +
            ' characteristic ' +
            data.characteristic,
            data.value,
        );
    };

    handleDiscoverPeripheral(peripheral) {
        this.setPeripheral(peripheral);
    };

    togglePeripheralConnection(peripheral) {
        if (peripheral && peripheral.connected) {
            BleManager.disconnect(peripheral.id);
            this.setPeripheral({...peripheral, ...{connecting: false, connected: false, error: false}})
        } else {
            this.connectPeripheral(peripheral);
        }
    };

    connectPeripheral(peripheral) {
        try {
            if (peripheral) {
                this.setPeripheral({...peripheral, ...{connecting: true, connected: false, error: false}});
                BleManager.connect(peripheral.id).then(() => 
                runInAction(() => {this.setPeripheral({...peripheral, ...{connecting: false, connected: true, error: false}});
                //this.sendInformations([0])
                 })).catch(
                    () => {this.setPeripheral({...peripheral, ...{connecting: false, connected: false, error: true}})}
                );
            }
        } catch (error) {
            console.log('Connection error', error);
            this.setPeripheral({...peripheral, ...{connecting: false, connected: false}});
        }
    };
    isSending: boolean = false
    sendInformations(data){
        for(let i=0; i<this.peripherals.length; i++){
            if(this.peripherals[i].connected){
                const peripheral: PeripheralInfo = this.peripherals[i];
                BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => 
                runInAction(() => {
                    this.setPeripheral({...peripheralInfo, ...{connected:true}});
                    const buffer = Buffer.from(data);
                    if(!peripheral.advertising.serviceUUIDs)return;
                    if(!peripheralInfo.characteristics)return;
                    peripheralInfo.characteristics.forEach(element => {
                        if(!peripheralInfo.advertising.serviceUUIDs)return;
                        if(element.properties.Write && !this.isSending){
                            this.isSending = true;
                            BleManager.write(peripheralInfo.id, peripheralInfo.advertising.serviceUUIDs[0], element.characteristic, buffer.toJSON().data).then(() =>
                            runInAction(() => {console.log("Write : "+buffer.toJSON().data)
                            this.isSending = false;
                            if(!peripheral.characteristics)return;
                            peripheral.characteristics.forEach(element2 => {
                                if(!peripheral.advertising.serviceUUIDs)return;
                                if(element2.properties.Read){
                                    BleManager.read(peripheral.id, peripheral.advertising.serviceUUIDs[0], element2.characteristic).then((readData) =>
                                    runInAction(() => {
                                        let information = Buffer.from(readData).toString();
                                        if(information.charAt(0)=='$')
                                            console.log("Read : "+information)
                                })).catch(() =>
                                    runInAction(() => {}))
                                }
                            });
                        })).catch((error) =>
                            runInAction(() => {
                            this.isSending = false}))
                        }
                    });
                })).catch(() => {});
            };
        }
    }

    
    
    listeners = [
        this.bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral.bind(this)),
        this.bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan.bind(this)),
        this.bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral.bind(this)),
        //this.bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this)),
        this.bleManagerEmitter.addListener(
            "BleManagerDidUpdateValueForCharacteristic",
            ({ value, peripheral, characteristic, service }) => {
              // Convert bytes array to string
              console.log(`Received ${value} for characteristic ${characteristic}`);
            }
          ),
    ];
}