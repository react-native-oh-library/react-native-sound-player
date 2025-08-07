/**
 * @flow
 */
"use strict";

import { NativeEventEmitter } from "react-native";
import resolveAsset from 'react-native/Libraries/Image/resolveAssetSource';
import RNSoundPlayer from './NativeRNSoundPlayer'


const _soundPlayerEmitter = new NativeEventEmitter(RNSoundPlayer);
let _finishedPlayingListener = null;
let _finishedLoadingListener = null;

export default {
  playSoundFile: (name: string, type: string) => {
    RNSoundPlayer.playSoundFile(name, type);
  },
  loadSoundFile: (name: string, type: string) => {
    RNSoundPlayer.loadSoundFile(name, type);
  },
  playUrl: (url: string) => {
    RNSoundPlayer.playUrl(url);
  },
  loadUrl: (url: string) => {
    RNSoundPlayer.loadUrl(url);
  },
  playAsset: (asset: number) => {
    RNSoundPlayer.playSoundFile(resolveAsset(asset).uri, '');
  },
  loadAsset: (asset: number) => {
    RNSoundPlayer.loadSoundFile(resolveAsset(asset).uri, '');
  },
  play: () => {
    // play and resume has the exact same implementation natively
    RNSoundPlayer.resume();
  },
  pause: () => {
    RNSoundPlayer.pause();
  },
  resume: () => {
    RNSoundPlayer.resume();
  },
  stop: () => {
    RNSoundPlayer.stop();
  }, 
  
  onFinishedPlaying: (callback: (success: boolean) => any) => {
    if (_finishedPlayingListener) {
      _finishedPlayingListener.remove();
      _finishedPlayingListener = undefined;
    }

    _finishedPlayingListener = _soundPlayerEmitter.addListener(
      "FinishedPlaying",
      callback
    );
  },

  onFinishedLoading: (callback: (success: boolean) => any) => {
    if (_finishedLoadingListener) {
      _finishedLoadingListener.remove();
      _finishedLoadingListener = undefined;
    }

    _finishedLoadingListener = _soundPlayerEmitter.addListener(
      "FinishedLoading",
      callback
    );
  },

  addEventListener: (
    eventName:
      | "OnSetupError"
      | "FinishedLoading"
      | "FinishedPlaying"
      | "FinishedLoadingURL"
      | "FinishedLoadingFile",
    callback: Function
  ) => _soundPlayerEmitter.addListener(eventName, callback),

  seek: (seconds: number) => {
    RNSoundPlayer.seek(seconds);
  },

  setVolume: (volume: number) => {
    RNSoundPlayer.setVolume(volume);
  },

  setSpeaker: (on: boolean) => {
    RNSoundPlayer.setSpeaker(on);
  },

  setMixAudio: (on: boolean) => {
    RNSoundPlayer.setMixAudio(on);
  },

  getInfo: async () => RNSoundPlayer.getInfo(),

  unmount: () => {
    if (_finishedPlayingListener) {
      _finishedPlayingListener.remove();
      _finishedPlayingListener = undefined;
    }

    if (_finishedLoadingListener) {
      _finishedLoadingListener.remove();
      _finishedLoadingListener = undefined;
    }
  },
  playSoundFileAsync: async (name: string, type: string) => {
    await RNSoundPlayer.playSoundFileAsync(name, type);
  },

  playSoundFileWithDelay: (name: string, type: string, delay: number) => {
    RNSoundPlayer.playSoundFileWithDelay(name, type, delay);
  },

  loadSoundFileAsync: async (name: string, type: string) => {
    await RNSoundPlayer.loadSoundFileAsync(name, type);
  },

  setNumberOfLoops: (loops: number) => {
    RNSoundPlayer.setNumberOfLoops(loops);
  },

  playUrlAsync: async (url: string) => {
    await RNSoundPlayer.playUrlAsync(url);
  },

  loadUrlAsync: async (url: string) => {
    await RNSoundPlayer.loadUrlAsync(url);
  },

  playAssetAsync: async (asset: number) => {
    await RNSoundPlayer.playSoundFileAsync(resolveAsset(asset).uri, '');
  },

  loadAssetAsync: async (asset: number) => {
    await RNSoundPlayer.loadSoundFileAsync(resolveAsset(asset).uri, '');
  },

  setMixAudioAsync: async (on: boolean) => {
    await RNSoundPlayer.setMixAudioAsync(on);
  },

  playAsync: async () => {
    await RNSoundPlayer.resumeAsync();
  },

  pauseAsync: async () => {
    await RNSoundPlayer.pauseAsync();
  },

  resumeAsync: async () => {
    await RNSoundPlayer.resumeAsync();
  },

  stopAsync: async () => {
    await RNSoundPlayer.stopAsync();
  },

};
