package com.newntripcli;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.common.StandardCharsets;
import com.felhr.usbserial.UsbSerialDevice;
import com.felhr.usbserial.UsbSerialInterface;

public class UsbModule extends ReactContextBaseJavaModule {

    private UsbManager m_manager;
    private UsbDevice m_device;
    private UsbSerialDevice m_serial;
    private UsbDeviceConnection m_connection;
    String ACTION_USB_PERMISSION = "permission";
    UsbSerialInterface.UsbReadCallback m_callback = new UsbSerialInterface.UsbReadCallback() {
        @Override
        public void onReceivedData(byte[] data) {
            //logs.setText(data.toString());    TODO: ouais voir pk c'pas bon ça
        }
    };

    private ReactApplicationContext context;

    
    
    UsbModule(ReactApplicationContext context) {
        super(context);

        Log.d("JavaUsb", "ça démarre doucement");
        
        // à virer si ça plante
        this.context = context;

        m_manager = (UsbManager) context.getSystemService(Context.USB_SERVICE);

        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_USB_PERMISSION);
        filter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
        context.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {

                if (intent.getAction() == ACTION_USB_PERMISSION) {
                    boolean granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false);
                    if (granted) {
                        m_connection = m_manager.openDevice(m_device);
                        m_serial = UsbSerialDevice.createUsbSerialDevice(m_device, m_connection);
                        if (m_serial != null) {
                            if (m_serial.open()) {
                                m_serial.setBaudRate(9600);
                                m_serial.setDataBits(UsbSerialInterface.DATA_BITS_8);
                                m_serial.setStopBits(UsbSerialInterface.STOP_BITS_1);
                                m_serial.setParity(UsbSerialInterface.PARITY_NONE);
                                m_serial.setFlowControl(UsbSerialInterface.FLOW_CONTROL_OFF);
                                m_serial.read(m_callback);

                                Log.d("JavaUsb", "ouais j'crois qu'on est bon");
                            } else
                                Log.d("JavaUsb", "le serial a pas ouvert");
                        } else
                            Log.d("JavaUsb", "le serial est null");
                    } else
                    Log.d("JavaUsb", "permission non accordée");

                } else if (intent.getAction() == UsbManager.ACTION_USB_DEVICE_ATTACHED) {
                    startUsbConnection();
                } else if (intent.getAction() == UsbManager.ACTION_USB_DEVICE_DETACHED) {
                    disconnect();
                }
            }
        }, filter);
    }


    @Override
    public String getName() {
        return "UsbModule";
    }

    @ReactMethod
    public void ouaip() {
        Log.d("UsbModule", "zebi, pitié que ça marche");
    }

    @ReactMethod
    private void startUsbConnection() {
        HashMap<String, UsbDevice> usbDevices = m_manager.getDeviceList();
        if (!usbDevices.isEmpty()) {
            for (UsbDevice device : usbDevices.values()) {
                m_device = device;

                int id = device.getVendorId();
                if (true) { // ici faudrait mettre un id == 9114 (rover prêté par M.Sibert)
                    PendingIntent intent = PendingIntent.getBroadcast(context, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);    // le premier argument c'est censé être un *this*, mais là vu que c'est différent alors freestyle
                    m_manager.requestPermission(device, intent);
                    Log.d("JavaUsb", "connection successful");
                    return;
                } else {
                    m_connection = null;
                    m_device = null;
                    Log.d("JavaUsb", "échec de l'appareillage");
                }

            }
        } else {
            Log.d("JavaUsb", "aucun device usb détecté");
        }
    }

    @ReactMethod
    private void sendData(String input) {
        if (m_serial != null) {
            m_serial.write(input.getBytes(StandardCharsets.UTF_8));
            Log.d("JavaUsb", input.getBytes(StandardCharsets.UTF_8).toString() + " : " + input);
        } else
            Log.d("JavaUsb", "connectez un device avant d'envoyer des données");
    }

    @ReactMethod
    private void  recvData() {

    };

    @ReactMethod
    private void disconnect() {
        if (m_serial != null) {
            m_serial.close();
            Log.d("JavaUsb", "périphérique déconnecté");
        } else
            Log.d("JavaUsb", "connectez un device avant de tenter une déconnection");
    }

}
