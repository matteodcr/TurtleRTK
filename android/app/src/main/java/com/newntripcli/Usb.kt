package com.newntripcli;

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log

class UsbCom(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


// add to CalendarModule.kt
override fun getName() = "UsbCom"


@ReactMethod
fun createUsbEvent(name: String, location: String) {
    Log.d("UsbModule", "Create event called with name: $name and location: $location")
}
}