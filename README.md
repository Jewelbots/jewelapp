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
