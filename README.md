# Jewelapp
Jewelbots App for iOS/Android

# Setup

TBA

# Build

1. `gulp` - updates www folder
2. `ionic build ios` - prepare app to be built in xcode
3. XCode - `Product -> Archive`

Basic HTML stuff can be tested in the browser with `ionic serve`, but the bluetoothle library is not 
supported in the browser or emulator, so most of your testing will need to happen on a device itself.  
  
See instructions to build and deploy to your phone [here](https://github.com/Jewelbots/jewelapp/wiki/Build-and-Deploy-for-Dev-Testing)

# Dependencies

- [Cordova Bluetoothele Plugin](https://github.com/randdusing/cordova-plugin-bluetoothle)
- [Angular Wrapper for Cordova Bluetoothle Plugin](https://github.com/Jewelbots/ng-cordova-bluetoothle)

# Reading Firmware Services and Characteristics

## Important Services and Characteristics

- Service 180A - Device information
    - Firmware Revision: characteristic 2A26
    - Manufacturer Name: characteristic 2A29
    
- Service 63400001-1A1E-5704-0A53-844BD14254A1 - Jewelbots Information
    - Read Friends List: characteristic 63400002-1A1E-5704-0A53-844BD14254A1 (referred to as 0002)
    - Write Friends List: characteristic 63400003-1A1E-5704-0A53-844BD14254A1 (referred to as 0003)
    
## Friends List Data Structure

- The friends will come from device as a flattened uint8array
each "friend" is 8 bytes of the array, up to I think 16 friends
so a if the friend list is `[1,2,3,4,5,6,7,1,2,10,11,12,13,14,15,3]` that's 
really 2 "friends" of `[1,2,3,4,5,6,7,2]` and `[2,10,11,12,13,14,15,3]`.  
  
- In practice, it will always be "full", and any unused friend "slots" will be all zeroes.  

- The breakdown of each friend is first byte index, second-seventh bytes address (stored reversed), eighth byte color
    * e.g. [friend index 0, device address (reversed) 1-6, color 7]
    * so [1,97,134,83,125,97,221,2] is:
        * friend.index = 1 (first friend always 1, should never be 0, so 0 here means empty)
        * friend.address = 221:97:125:83:134:97 (reversed from how stored on device)
        * friend.color = 2 (blue)

- Color codes: 0 = red, 1 = green, 2 = blue, 3 = cyan (will be more later but only 4 currently active)

# Basic Bluetoothle Library Usage

## iOS

### Scan for devices [ex: pair-ctrl.js](https://github.com/Jewelbots/jewelapp/blob/master/app/scripts/registration/pair-ctrl.js#L59)

```js
ionicReady().then(function () {
  // use initialize to get bluetooth up and running. will error if bluetooth not enabled on phone
  return $cordovaBluetoothle.initialize(params)
})
.then(function (data) {
  //startScan() scans for devices. You can filter with params
  return $cordovaBluetoothle.startScan(params);
})
.then(function (data) {
  for(var i=0;i < data.length; i++) {
    if (data[i].status === 'scanResult' && data[i].advertisement.isConnectable) {
      console.log(data[i])
    }
  }
  //make sure to stopScan()
  return $cordovaBluetoothle.stopScan();
})
```

### Read Characteristics [ex: dashboard-ctrl.js](https://github.com/Jewelbots/jewelapp/blob/master/app/scripts/dashboard/dashboard-ctrl.js#L96)

On iOS, you will need to follow the same basic pattern to read a characteristic:
1. `initialize()` bluetooth
2. `connect()` to device
3. discover `services()` for device
4. discover `characteristics()` for a service
5. `read()` a characteristic

You have to do this even if you already know which service and characteristic you want. Trying to go straight to the `read()` will result in an error.  
  
```js
var result = $cordovaBluetoothle.initialize({'request': true})
.then(function(data) {
  return $timeout($cordovaBluetoothle.connect(params))
})
.then(function(response) {
  return $cordovaBluetoothle.services({address: deviceId})
})
.then(function(response) {
  return $cordovaBluetoothle.characteristics({address: deviceId, service: "180A"});
})
.then(function(response) {
  return $cordovaBluetoothle.read({address: DataService.GetDeviceId(), service: "180A", characteristic: "2A26"})
})
```
