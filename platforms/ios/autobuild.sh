#!/bin/sh

#!/bin/sh

# Current as working as of 2014/09/22
# Xcode 6

OUTPUTDIR="$HOME/Downloads"
APPNAME="Jewelapp"
SCHEME="Jewelapp"

rm "$OUTPUTDIR/$APPNAME.ipa" #deletes previous ipa
xcodebuild -scheme "$SCHEME" archive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive"
xcodebuild -exportArchive -exportFormat ipa -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -exportPath "$OUTPUTDIR/$APPNAME.ipa" 