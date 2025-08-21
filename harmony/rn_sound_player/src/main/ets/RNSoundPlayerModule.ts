/**
 * MIT License
 *
 * Copyright (C) 2025 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Logger from './Logger';
import media from '@ohos.multimedia.media';
import audio from '@ohos.multimedia.audio';
import fs from '@ohos.file.fs';
import { AnyThreadTurboModule } from '@rnoh/react-native-openharmony/ts';

const TAG = '[RNSoundPlayer]';
const EVENT_SETUP_ERROR: string = "OnSetupError";
const EVENT_FINISHED_PLAYING: string = "FinishedPlaying";
const EVENT_FINISHED_LOADING: string = "FinishedLoading";
const EVENT_FINISHED_LOADING_FILE: string = "FinishedLoadingFile";
const EVENT_FINISHED_LOADING_URL: string = "FinishedLoadingURL";

export class RNSoundPlayerModule extends AnyThreadTurboModule {
  private avPlayer: media.AVPlayer | undefined = undefined;
  private volume: number = 1;
  private state: string = '';
  private url: string = '';
  private name: string = '';
  private type: string = '';
  private toPlayFlag: boolean = false;

  private playStrategy: media.PlaybackStrategy = {
    preferredWidth: 1,
    preferredHeight: 2,
    preferredBufferDuration: 3,
    preferredHdr: false
  };

  private async initializeMediaPlayer(uri?: string): Promise<media.AVPlayer> {
    let avPlayer: media.AVPlayer = await media.createAVPlayer();
    return avPlayer;
  }

  private setListener() {
    if (this.avPlayer) {
      this.avPlayer.on('error', (error) => {
        Logger.error(TAG, `RNSoundPlayer error: ${error.message}`);
        this.sendErrorEvent(error);
      });
      this.avPlayer.on('volumeChange', (num) => {
        Logger.info(TAG, `RNSoundPlayer volumeChange num: ${num}`);
      })
      this.avPlayer.on('stateChange', async (state: string, reason: media.StateChangeReason) => {
        this.state = state;
        switch (state) {
          case 'idle':
            Logger.info(TAG, 'RNSoundPlayer state idle called');
            break;
          case 'initialized':
            Logger.info(TAG, 'RNSoundPlayer initialized prepared called');
            await this.avPlayer?.prepare();
            break;
          case 'prepared':
            Logger.info(TAG, 'RNSoundPlayer state prepared called');
            if (this.url) {
              this.sendEvent(EVENT_FINISHED_LOADING_URL, { "success": true, "url": this.url });
            } else {
              this.sendMountFileSuccessEvents(this.name, this.type);
            }

            Logger.info(TAG, 'RNSoundPlayer state prepared called toPlayFlag:' + this.toPlayFlag);
            if (this.toPlayFlag) {
              this.avPlayer?.play();
            }
            break;
          case 'playing':
            Logger.info(TAG, 'RNSoundPlayer state playing called');
            break;
          case 'paused':
            Logger.info(TAG, 'RNSoundPlayer state paused called');
            break;
          case 'completed':
            Logger.info(TAG, 'RNSoundPlayer state completed called');
            this.sendEvent(EVENT_FINISHED_PLAYING, { "success": true });
            break;
          case 'stopped':
            Logger.info(TAG, 'RNSoundPlayer state stopped called');
            this.avPlayer?.reset();
            break;
          case 'released':
            Logger.info(TAG, 'RNSoundPlayer state released called');
            break;
          case 'error':
            let e = new Error();
            if (reason === media.StateChangeReason.USER) {
              e.message = 'State changed by user operation';
            } else {
              e.message = 'State changed by background action';
            }
            Logger.info(TAG, `RNSoundPlayer state error ${e.message}`);
            this.sendErrorEvent(e);
            break;
          default:
            Logger.info(TAG, 'RNSoundPlayer unknown state :' + state);
            break;
        }
      });
    }
  }

  private removeListener() {
    this.avPlayer?.off('stateChange', () => {
      Logger.info(TAG, `RNSoundPlayer off stateChange`);
    });
    this.avPlayer?.off('error', (error) => {
      Logger.info(TAG, `RNSoundPlayer off error`);
    });
    this.avPlayer?.off('volumeChange', (num) => {
      Logger.info(TAG, `RNSoundPlayer off volumeChange`);
    });
  }

  private sandbox(name: string, type: string) {
    let file: string = type ? (name + '.' + type) : name;
    let filePath = this.ctx.uiAbilityContext?.filesDir + '/' + file;

    if (file && file.startsWith("asset://")) {
      // js侧设置的资源
      Logger.info(TAG, 'RNSoundPlayer resource from js asset');
      let s = 'asset://';
      let path = 'assets/' + file.substring(s.length);
      this.fd(path);
    } else if (file && file.startsWith("http://localhost:8081/assets/")) {
      // js侧设置的资源
      Logger.info(TAG, 'RNSoundPlayer resource from js asset1');
      let s = 'http://localhost:8081/assets/';
      let path = 'assets/' + file.substring(s.length);
      let path1 = path.substring(0, path.indexOf('?'));
      this.fd(path1);
    } else if (fs.accessSync(filePath, fs.AccessModeType.EXIST)) {
      // 沙箱路径下资源
      Logger.info(TAG, 'RNSoundPlayer resource from js sandBox');
      if (this.avPlayer) {
        const audioFile: fs.File = fs.openSync(filePath, fs.OpenMode.READ_ONLY);
        this.avPlayer.url = `fd://${audioFile.fd}`;
      }
    } else {
      // rawfile 目录下资源
      Logger.info(TAG, 'RNSoundPlayer resource from js rawfile');
      this.fd(file);
    }
    this.url = '';
  }

  private fd(name: string) {
    Logger.info(TAG, 'RNSoundPlayer fd name:' + `${name}`);
    if (name) {
      try {
        if (this.avPlayer) {
          let fileDescriptor = this.ctx.uiAbilityContext?.resourceManager.getRawFdSync(name);
          if (this.avPlayer && fileDescriptor && fileDescriptor.fd > 0) {
            this.avPlayer.fdSrc = fileDescriptor;
          }
        }
      } catch (e) {
        Logger.error(TAG, 'RNSoundPlayer fd err:' + `${e}`);
        this.sendErrorEvent(e);
      }
    }
  }

  private http(url: string) {
    let headers: Record<string, string> = { "User-Agent": "User-Agent-Value" };
    let mediaSource: media.MediaSource = media.createMediaSourceWithUrl(url, headers);
    this.avPlayer?.setMediaSource(mediaSource, this.playStrategy);

    this.name = '';
    this.type = '';
  }

  private async prepareUrl(url: string) {
    try {
      if (!!!this.avPlayer) {
        this.avPlayer = await this.initializeMediaPlayer();
        this.setListener();
        this.url = url;
        this.http(url);
      } else {
        await this.avPlayer.reset();
        if (url) {
          this.url = url;
          this.http(url);
        }
      }
    } catch (e) {
      Logger.info(TAG, 'RNSoundPlayer prepareUrl err:' + `${e}`);
      this.sendEvent(EVENT_SETUP_ERROR, { "error": e.message });
    }
  }

  private async mountSoundFile(name: string, type: string) {
    this.name = name;
    this.type = type;
    try {
      if (!!!this.avPlayer) {
        this.avPlayer = await this.initializeMediaPlayer();
        this.setListener();
        await this.sandbox(name, type);
      } else {
        await this.avPlayer.reset();
        await this.sandbox(name, type);
      }
    } catch (e) {
      Logger.error(TAG, 'RNSoundPlayer mountSoundFile err:' + `${e}`);
      this.sendErrorEvent(e);
    }
  }

  private sendMountFileSuccessEvents(name: string, type: string) {
    this.sendEvent(EVENT_FINISHED_LOADING, { "success": true });
    this.sendEvent(EVENT_FINISHED_LOADING_FILE, {
      "success": true,
      "name": name,
      "type": type
    });
  }

  private sendErrorEvent(e: Error) {
    this.sendEvent(EVENT_SETUP_ERROR, {
      "error": e.message,
    });
  }

  private sendEvent(eventName: string, params: ESObject) {
    this.ctx.rnInstance.emitDeviceEvent(eventName, params);
  }

  playSoundFile(name: string, type: string) {
  }

  loadSoundFile(name: string, type: string) {
  }

  playUrl(url: string) {
  }

  loadUrl(url: string) {
  }
  
  play() {
  }
  
  pause() {
  }
  
  resume() {
  }

  stop() {
  }

  setMixAudio(on: boolean){
  }

  playSoundFileWithDelay(name: string, type: string, delay: number) {
  }
  setSpeaker(on: boolean){
  }  

  async playSoundFileAsync(name: string, type: string) {
    await this.mountSoundFile(name, type);
    this.toPlayFlag = true;
  }

  async loadSoundFileAsync(name: string, type: string) {
    await this.mountSoundFile(name, type);
    this.toPlayFlag = false;
  }

  setNumberOfLoops(loops: number) {
    let looping: boolean = false;
    if (loops == 0) {
      looping = false;
    } else {
      looping = true;
    }

    if (this.avPlayer && this.state &&
      (this.state === 'prepared' || this.state === 'playing' || this.state === 'paused' ||
        this.state === 'completed')) {
      this.avPlayer.loop = looping;
      Logger.info(TAG, `RNSoundPlayer setNumberOfLoops do: ${looping}`);
    }
  }

  async playUrlAsync(url: string) {
    await this.prepareUrl(url);
    this.toPlayFlag = true;
  }

  async loadUrlAsync(url: string) {
    await this.prepareUrl(url);
    this.toPlayFlag = false;
  }

  async playAsync() {
    await this.resumeAsync();
  }

  async pauseAsync() {
    if (this.state && (this.state === 'playing')) {
      await this.avPlayer?.pause();
    }
  }

  async resumeAsync() {
    if (this.state && (this.state === 'prepared' || this.state === 'paused' || this.state === 'completed')) {
      if (this.volume != -1) {
        this.avPlayer?.setVolume(this.volume);
      }
      await this.avPlayer?.play();
    }
  }

  async stopAsync() {
    if (this.state && (this.state === 'prepared' || this.state === 'playing' || this.state === 'paused' ||
      this.state === 'completed')) {
      await this.avPlayer?.stop();
    }
  }

  seek(seconds: number) {
    if (this.state && (this.state === 'prepared' || this.state === 'playing' || this.state === 'paused' ||
      this.state === 'completed')) {
      this.avPlayer?.seek(seconds * 1000); // SeekMode
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.state && (this.state === 'prepared' || this.state === 'playing' || this.state === 'paused' ||
      this.state === 'completed')) {
      if (this.volume != -1) {
        this.avPlayer?.setVolume(volume);
        this.volume = volume;
      }
    }
  }

  async getInfo(): Promise<ESObject> {
    let promise: Promise<ESObject> = new Promise((resolve, reject) => {
      let result = {};
      if (this.avPlayer) {
        result = { currentTime: this.avPlayer.currentTime / 1000.0, duration: this.avPlayer.duration / 1000.0 };
      }
      resolve(result);
    });
    return promise;
  }

  async setMixAudioAsync(on: boolean){
    let strategy: audio.AudioSessionStrategy = {
      concurrencyMode: audio.AudioConcurrencyMode.CONCURRENCY_DEFAULT
    };
    
    if(on){
      strategy = {
        concurrencyMode: audio.AudioConcurrencyMode.CONCURRENCY_MIX_WITH_OTHERS
      };
    } 

    let audioManager = audio.getAudioManager();
    let audioSessionManager: audio.AudioSessionManager = audioManager.getSessionManager();
    await audioSessionManager.activateAudioSession(strategy);
    Logger.info(TAG, `RNSoundPlayer setMixAudioAsync do: ${on}`);
  }

  async setSpeakerAsync(on: boolean){
    let audioManager = audio.getAudioManager();
    let audioRoutingManager: audio.AudioRoutingManager = audioManager.getRoutingManager();

    let audioStreamInfo: audio.AudioStreamInfo = {
      samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_48000, // 采样率。
      channels: audio.AudioChannel.CHANNEL_2, // 通道。
      sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE, // 采样格式。
      encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW // 编码格式。
    };

    let audioRendererInfo: audio.AudioRendererInfo = {
      usage: audio.StreamUsage.STREAM_USAGE_VOICE_COMMUNICATION,
      rendererFlags: 0 // 音频渲染器标志。
    };

    let audioRendererOptions: audio.AudioRendererOptions = {
      streamInfo: audioStreamInfo,
      rendererInfo: audioRendererInfo
    };

    let audioRenderer: audio.AudioRenderer = await audio.createAudioRenderer(audioRendererOptions);
    await audioRenderer?.start();
    await audioRoutingManager.setCommunicationDevice(audio.CommunicationDeviceType.SPEAKER, on);
    Logger.info(TAG, `RNSoundPlayer setSpeakerAsync do: ${on}`);
  }
}