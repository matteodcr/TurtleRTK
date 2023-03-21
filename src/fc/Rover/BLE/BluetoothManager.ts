import BleManager, {PeripheralInfo} from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { makeAutoObservable, runInAction, observable } from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {NmeaMessage, NmeaTransport} from '@gnss/nmea';


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
                 })).catch(
                    () => {this.setPeripheral({...peripheral, ...{connecting: false, connected: false, error: true}})}
                );
            }
        } catch (error) {
            console.log('Connection error', error);
            this.setPeripheral({...peripheral, ...{connecting: false, connected: false}});
        }
    };

    sendInformations(data){
        for(let i=0; i<this.peripherals.length; i++){
            BleManager.isPeripheralConnected(this.peripherals[i].id, []).then((isConnected) =>
            runInAction(() => {
                if(isConnected) {
                    const peripheral = this.peripherals[i];
                    BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => 
                    runInAction(() => {
                        console.log("Envoi de données ...")
                        const buffer = Buffer.from(data);
                        if(!peripheralInfo.advertising.serviceUUIDs){
                            console.log("Error : Write : no service UUID")
                            return;
                        }
                        if(!peripheralInfo.characteristics){
                            console.log("Error : Write : no service UUID")
                            return;
                        }
                        peripheralInfo.characteristics.forEach(element => {
                            if(!peripheralInfo.advertising.serviceUUIDs){
                                console.log("Error : Write : no service UUID")
                                return;
                            }
                            if(element.properties.Write){
                                BleManager.write(peripheralInfo.id, peripheralInfo.advertising.serviceUUIDs[0], element.characteristic, buffer.toJSON().data).then(() =>
                                runInAction(() => {console.log("Write : "+data)
                                if(!peripheralInfo.characteristics){
                                    console.log("Error : Write : no service UUID")
                                    return;
                                }
                                peripheralInfo.characteristics.forEach(element2 => {
                                    if(!peripheralInfo.advertising.serviceUUIDs){
                                        console.log("Error : Write : no service UUID")
                                        return;
                                    }
                                    if(element2.properties.Read){
                                        BleManager.read(peripheralInfo.id, peripheralInfo.advertising.serviceUUIDs[0], element2.characteristic).then((readData) =>
                                        runInAction(() => {console.log("Read : "+readData)
                                        let message: NmeaMessage = NmeaTransport.decode(readData);
                                        console.log("Message décodé : "+message);
                                    })).catch(() =>
                                        runInAction(() => {console.log("Erreur lors du read")}))
                                    }
                                });
                                
                                
                                
                            })).catch((error) =>
                                runInAction(() => {console.log("Error during writing : "+error)}))
                            }
                        });
                        
                    })).catch(() => 
                    runInAction(() => {console.log("Error during retrieveServices of "+peripheral.id)}))
                }
            }));
        }

        
    }
    
    listeners = [
        this.bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral.bind(this)),
        this.bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan.bind(this)),
        this.bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral.bind(this)),
        this.bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this)),
    ];
}