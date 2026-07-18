> 模板版本：v0.3.0

<p align="center">
  <h1 align="center"> <code>react-native-sound-player</code> </h1>
</p>


本项目基于 [react-native-sound-player@0.14.5](https://github.com/johnsonsu/react-native-sound-player/tree/0.14.5) 开发。

请到三方库的 Releases 发布地址查看配套的版本信息：[@react-native-oh-tpl/react-native-sound-player Releases](https://github.com/react-native-oh-library/react-native-sound-player/releases)。对于未发布到npm的旧版本，请参考[安装指南](/zh-cn/tgz-usage.md)安装tgz包。

| 三方库版本                 | 发布信息                                      |  支持RN版本                 |
| ------------------------- | ------------------------------------------------- |  -------------------------- |
| 0.14.6                 | [@react-native-oh-tpl/react-native-sound-player Releases](https://github.com/react-native-oh-library/react-native-sound-player/releases)  | 0.72 |

## 1. 安装与使用

进入到工程目录并输入以下命令：

#### **npm**

```bash
npm install @react-native-oh-tpl/react-native-sound-player
```

#### **yarn**

```bash
yarn add @react-native-oh-tpl/react-native-sound-player
```

下面的代码展示了这个库的基本使用场景：

> [!WARNING] 使用时 import 的库名不变。

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

此步骤为手动配置原生依赖项的指导。

首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`。

### 2.1. Overrides RN SDK

为了让工程依赖同一个版本的 RN SDK，需要在工程根目录的 `oh-package.json5` 添加 overrides 字段，指向工程需要使用的 RN SDK 版本。替换的版本既可以是一个具体的版本号，也可以是一个模糊版本，还可以是本地存在的 HAR 包或源码目录。

关于该字段的作用请阅读[官方说明](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#zh-cn_topic_0000001792256137_overrides)：

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "^0.72.38" // ohpm 在线版本
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // 指向本地 har 包的路径
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // 指向源码路径
  }
}
```

### 2.2. 引入原生端代码

目前有两种方法：

- 通过 har 包引入；
- 直接链接源码。

方法一：通过 har 包引入（推荐）

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开`entry/oh-package.json5`，添加以下依赖：

```json
"dependencies": {
    "@react-native-oh-tpl/react-native-sound-player": "file:../../node_modules/@react-native-oh-tpl/react-native-sound-player/harmony/rn_sound_player.har"
  }
```

点击右上角的 `sync` 按钮，

或者在命令行终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](/zh-cn/link-source-code.md)。

### 2.3. 配置 CMakeLists 和引入 RNSoundPlayerPackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")

# RNOH_BEGIN: manual_package_linking_1
+ add_subdirectory("${OH_MODULES}/@react-native-oh-tpl/react-native-sound-player/src/main/cpp" ./sound-player)
# RNOH_END: manual_package_linking_1

# RNOH_BEGIN: manual_package_linking_2
+ target_link_libraries(rnoh_app PUBLIC rnoh_sound_player)
# RNOH_END: manual_package_linking_2
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "generated/RNOHGeneratedPackage.h"
+ #include "RNSoundPlayerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
      std::make_shared<RNOHGeneratedPackage>(ctx),
+      std::make_shared<RNSoundPlayerPackage>(ctx)
    };
}
```

###  2.4. 在 ArkTs 侧引入 RNSoundPlayerPackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
  ...
+ import {RNSoundPlayerPackage} from '@react-native-oh-tpl/react-native-sound-player/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
+   new RNSoundPlayerPackage(ctx)
  ];
}
```

### 2.5. 运行

点击右上角的 `sync` 按钮，

或者在命令行终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 3. 约束与限制

### 3.1. 兼容性

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[@react-native-oh-tpl/react-native-sound-player Releases](https://github.com/react-native-oh-library/react-native-sound-player/releases)。

## 4. 属性

> [!TIP] "Platform"列表示该属性在原三方库上支持的平台。

> [!TIP] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

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

## 5. 遗留问题
- [X] 因系统侧暂未提供AVPlayer播放器生成和控制的同步方法，库依赖AVPlayer实现的同步功能暂未实现。需系统侧提供后补充。 问题：[issue#6](https://github.com/react-native-oh-library/react-native-sound-player/issues/6)。
- [X] 系统媒体播放器AVPlayer在使用playUrlAsync和loadUrlAsync接口方法播放m4a、aac、wav、flac、amr和ape等网络音频格式时异常。 问题：[issue#12](https://github.com/react-native-oh-library/react-native-sound-player/issues/12)。
- [X] rn的js侧不支持ogg、flac、amr、ape格式，导致无法通过import或require方式导入文件，因而无法通过playAssetAsync、loadAssetAsync方式进行播放。 问题：[issue#11](https://github.com/react-native-oh-library/react-native-sound-player/issues/11)。

## 6. 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/johnsonsu/react-native-sound-player/blob/master/LICENSE)，请自由地享受和参与开源。