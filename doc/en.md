> Template version: v0.3.0

<p align="center">
  <h1 align="center"> <code>react-native-sound-player</code> </h1>
</p>

This project is based on [react-native-sound-player@0.14.5](https://github.com/johnsonsu/react-native-sound-player/tree/0.14.5).

Please go to the Releases release address of the third-party library to view the supporting version information: [@react-native-oh-tpl/react-native-sound-player Releases](https://github.com/react-native-oh-library/react-native-sound-player/releases). For older versions that are not published to npm, install the tgz package by referring to the [Installation Guide](/en/tgz-usage-en.md).

| Version                   | Releases info                                      |  Support RN version                    |
| ------------------------- | ------------------------------------------------- |  -------------------------- |
| 0.14.6                 | [@react-native-oh-tpl/react-native-sound-player Releases](https://github.com/react-native-oh-library/react-native-sound-player/releases)  | 0.72 |

## 1. Installation and Usage

Go to the project directory and execute the following instruction:

#### **npm**

```bash
npm install @react-native-oh-tpl/react-native-sound-player
```

#### **yarn**

```bash
yarn add @react-native-oh-tpl/react-native-sound-player
```

The following code shows the basic use scenario of the repository:

> [!WARNING] The name of the imported repository remains unchanged.

```js
import React from 'react';
import { Button, View, ScrollView } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { EmitterSubscription } from "react-native";

const SoundPlayerDemo = () => {
    return (
        <>
            <ScrollView>
                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ width: 180 }}>
                        <Button
                            title="playSoundFileAsync"
                            onPress={async () => {
                                await SoundPlayer.playSoundFileAsync("tone", "mp3");
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="loadSoundFileAsync"
                            onPress={async () => {
                                await SoundPlayer.loadSoundFileAsync("tone", "mp3");
                            }}
                        />    
						<View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="playAssetAsync"
                            onPress={async () => {
                                await SoundPlayer.playAssetAsync(require('./assets/tone.mp3'));
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="loadAssetAsync"
                            onPress={async () => {
                                await SoundPlayer.loadAssetAsync(require('./assets/tone.mp3'));
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
						<Button
                            title="playAsync"
                            onPress={async () => {
                                await SoundPlayer.playAsync();
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="pauseAsync"
                            onPress={async () => {
                                await SoundPlayer.pauseAsync();
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="resumeAsync"
                            onPress={async () => {
                                await SoundPlayer.resumeAsync();
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="stopAsync"
                            onPress={async () => {
                                await SoundPlayer.stopAsync();
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="seek"
                            onPress={() => {
                                SoundPlayer.seek(10);
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                        <Button
                            title="setVolume"
                            onPress={() => {
                                SoundPlayer.setVolume(1);
                            }}
                        />
                        <View style={{ marginTop: 10 }} ></View>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

export default SoundPlayerDemo;
```

## 2. Manual Link

This step provides guidance for manually configuring native dependencies.

Open the `harmony` directory of the HarmonyOS project in DevEco Studio.

### 2.1 Overrides RN SDK

To ensure the project relies on the same version of the RN SDK, you need to add an `overrides` field in the project's root `oh-package.json5` file, specifying the RN SDK version to be used. The replacement version can be a specific version number, a semver range, or a locally available HAR package or source directory.

For more information about the purpose of this field, please refer to the [official documentation](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#en-us_topic_0000001792256137_overrides).

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "^0.72.38" // ohpm version
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // a locally available HAR package
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // source code directory
  }
}
```

### 2.2 Introducing Native Code

Currently, two methods are available:

- Use the HAR file.
- Directly link to the source code。

Method 1 (recommended): Use the HAR file.

> [!TIP] The HAR file is stored in the `harmony` directory in the installation path of the third-party library.

Open `entry/oh-package.json5` file and add the following dependencies:

```json
"dependencies": {
    "@react-native-oh-tpl/react-native-sound-player": "file:../../node_modules/@react-native-oh-tpl/react-native-sound-player/harmony/rn_sound_player.har"
  }
```

Click the `sync` button in the upper right corner.

Alternatively, run the following instruction on the terminal:

```bash
cd entry
ohpm install
```

Method 2: Directly link to the source code.

> [!TIP] For details, see [Directly Linking Source Code](/en/link-source-code.md).

### 2.3 Configuring CMakeLists and Introducing RNSoundPlayerPackage

Open `entry/src/main/cpp/CMakeLists.txt` and add the following code:

```diff
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")

# RNOH_BEGIN: manual_package_linking_1
+ add_subdirectory("${OH_MODULES}/@react-native-oh-tpl/react-native-sound-player/src/main/cpp" ./sound-player)
# RNOH_END: manual_package_linking_1

# RNOH_BEGIN: manual_package_linking_2
+ target_link_libraries(rnoh_app PUBLIC rnoh_sound_player)
# RNOH_END: manual_package_linking_2
```

Open `entry/src/main/cpp/PackageProvider.cpp` and add the following code:

```diff
#include "RNOH/PackageProvider.h"
#include "generated/RNOHGeneratedPackage.h"
+ #include "RNSoundPlayerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
        std::make_shared<RNOHGeneratedPackage>(ctx),
+        std::make_shared<RNSoundPlayerPackage>(ctx)
    };
}
```


### 2.4 Introducing RNSoundPlayerPackage Package to ArkTS

Open the `entry/src/main/ets/RNPackagesFactory.ts` file and add the following code:

```diff
  ...
+ import {RNSoundPlayerPackage} from '@react-native-oh-tpl/react-native-sound-player/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
+   new RNSoundPlayerPackage(ctx)
  ];
}
```

### 2.5 Running

Click the `sync` button in the upper right corner.

Alternatively, run the following instruction on the terminal:

```bash
cd entry
ohpm install
```

Then build and run the code.

## 3. Constraints

### 3.1 Compatibility

Check the release version information in the release address of the third-party library: [@react-native-oh-tpl/react-native-sound-player Releases](https://github.com/react-native-oh-library/react-native-sound-player/releases)。


## 4. Properties (If Any)

> [!TIP] The **Platform** column indicates the platform where the properties are supported in the original third-party library.

> [!TIP] If the value of **HarmonyOS Support** is **yes**, it means that the HarmonyOS platform supports this property; **no** means the opposite; **partially** means some capabilities of this property are supported. The usage method is the same on different platforms and the effect is the same as that of iOS or Android.

| Name        | Description                                       | Type   | Required | Platform | HarmonyOS Support |
| ----------- | ------------------------------------------------- | ------ | -------- | -------- | ----------------- |
| playSoundFileAsync | Asynchronous Play the sound file named `fileName` async with file type `fileType`. | function | no      |  | yes          |
| loadSoundFileAsync | Asynchronous Load the sound file named `fileName` with file type `fileType`, without playing it. | function | no     |  | yes        |
| playUrlAsync | Asynchronous Play the audio from url. | function | no     |  | yes        |
| loadUrlAsync | Asynchronous Load the audio from the given `url` without playing it | function | no     |  | yes        |
| playAssetAsync | Asynchronous Play the audio from an asset, to get the asset number use `require('./assets/tone.mp3')`. | function | no     |  | yes        |
| loadAssetAsync | Asynchronous Load the audio from an asset like above but without playing it. | function | no     |  | yes        |
| playAsync | Asynchronous Play the loaded sound file. This function is the same as `resumeAsync`. | function | no     |  | yes        |
| pauseAsync | Asynchronous Pause the currently playing file. | function | no     |  | yes        |
| resumeAsync | Asynchronous Resume from pause and continue playing the same file. This function is the same as `playAsync`. | function | no     |  | yes        |
| stopAsync | Asynchronous Stop playing. | function | no     |  | yes        |
| playSoundFile | Play the sound file named `fileName` with file type `fileType`. | function | no      | Android/iOS | no             |
| loadSoundFile | Load the sound file named `fileName` with file type `fileType`, without playing it. | function | no     | Android/iOS | no           |
| playUrl | Play the audio from url. | function | no     | Android/iOS | no           |
| loadUrl | Load the audio from the given `url` without playing it | function | no     | Android/iOS | no           |
| playAsset | Play the audio from an asset, to get the asset number use `require('./assets/tone.mp3')`. | function | no     | Android/iOS | no           |
| loadAsset | Load the audio from an asset like above but without playing it. | function | no     | Android/iOS | no           |
| onFinishedPlaying | Subscribe to the "finished playing" event. The `callback` function is called whenever a file is finished playing. ***\*This function will be deprecated soon, please use** **`addEventListener`** \**. | function | no     | All      | yes               |
| onFinishedLoading | Subscribe to the "finished loading" event. The `callback` function is called whenever a file is finished loading, i.e. the file is ready to be `play()`, `resume()`, `getInfo()`, etc. ***\*This function will be deprecated soon, please use** **`addEventListener`** \**. | function | no     | All      | yes               |
| addEventListener | Subscribe to any event. Returns a subscription object. Subscriptions created by this function cannot be removed by calling unmount(). You NEED to call yourSubscriptionObject.remove() when you no longer need this event listener or whenever your component unmounts. | function | no     | All      | yes               |
| play | Play the loaded sound file. This function is the same as `resume`. | function | no     | Android/iOS | no           |
| pause | Pause the currently playing file. | function | no     | Android/iOS | no           |
| resume | Resume from pause and continue playing the same file. This function is the same as `play`. | function | no     | Android/iOS | no           |
| stop | Stop playing. | function | no     | Android/iOS | no           |
| seek | Seek to seconds of the currently playing file. | function | no     | All      | yes               |
| setVolume | Set the volume of the current player. This does not change the volume of the device. | function | no     | All      | yes               |
| setNumberOfLoops | 0 means to play the sound once, other numbers indicate an indefinite loop. | function | no     | All      | yes               |
| getInfo | Get the currentTime and duration of the currently mounted audio media. This function returns a promise which resolves to an Object containing currentTime and duration properties. | function | no     | All      | yes               |
| unmount | Unsubscribe the "finished playing" and "finished loading" event. ***\*This function will be deprecated soon, please use** **`addEventListener`** **and remove your own listener by calling** **`yourSubscriptionObject.remove()`*****\***. | function | no     | All      | yes               |
| playSoundFileWithDelay | Only available on iOS. Play the sound file named `fileName` with file type `fileType` after a a delay of `delay` in *_seconds_* from the current device time. | function | no     | iOS   | no           |
| setSpeaker | Overwrite default audio output to speaker. | function | no     | iOS   | no           |
| setMixAudio | If you set this option, your audio will be mixed with audio playing in background apps, such as the Music app. | function | no     | iOS   | no           |
| setMixAudioAsync | Asynchronous method.If you set this option, your audio will be mixed with audio playing in background apps, such as the Music app. | function | no     |    | yes        |
| setSpeakerAsync | Asynchronous method. Overwrite default audio output to speaker.                                    | function | no     |    | yes        |

## 5. Known Issues

- [X] Since the system side has not yet provided synchronization methods for generating and controlling the AVPlayer, the synchronization function implemented by the library, which relies on AVPlayer, remains unimplemented. This will be supplemented once the system side provides the necessary methods.  issue: [issue#6](https://github.com/react-native-oh-library/react-native-sound-player/issues/6)
- [X] The system media player AVPlayer encounters exceptions when playing network audio formats such as m4a, aac, wav, flac, amr, and ape using the playUrlAsync and loadUrlAsync interface methods. issue: [issue#12](https://github.com/react-native-oh-library/react-native-sound-player/issues/12)。
- [X] The JS side of rn does not support ogg, flac, amr, and ape formats, which makes it impossible to import files through import or require, and therefore cannot be played through playAssetAsync or loadAssetAsync. issue: [issue#11](https://github.com/react-native-oh-library/react-native-sound-player/issues/11)。

## 6. License

This project is licensed under [MIT License](https://github.com/johnsonsu/react-native-sound-player/blob/master/LICENSE).
