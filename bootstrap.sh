set -v

gem install sass
gem install compass

npm install grunt
npm install
bower install

grunt platform:add:ios
grunt platform:add:android
grunt plugin:add:https://github.com/randdusing/BluetoothLE
grunt plugin:add:org.apache.cordova.dialogs
