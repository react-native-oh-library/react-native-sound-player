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

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry, EmitterSubscription } from 'react-native';


export interface Spec extends TurboModule {
    playSoundFile: (name: string, type: string) => void;
    loadSoundFile: (name: string, type: string) => void;
    playUrl: (url: string) => void;
    loadUrl: (url: string) => void;
    /** Play the loaded sound file. This function is the same as `resume`. */
    play: () => void;
    /** Pause the currently playing file. */
    pause: () => void;
    /** Resume from pause and continue playing the same file. This function is the same as `play`. */
    resume: () => void;
    /** Stop playing, call `playSound` to start playing again. */
    stop: () => void;

    seek(seconds: number): void;

    setVolume(volume: number): void;

    setSpeaker(on: boolean): void;

    setMixAudio(on: boolean): void;

    getInfo(): Promise<{ currentTime: number; duration: number }>;

    playSoundFileAsync(name: string, type: string): Promise<void>;

    playSoundFileWithDelay(name: string, type: string, delay: number): void;

    loadSoundFileAsync(name: string, type: string): Promise<void>;

    setNumberOfLoops(loops: number): void;

    playUrlAsync(url: string): Promise<void>;

    loadUrlAsync(url: string): Promise<void>;

    playAsync(): Promise<void>;

    pauseAsync(): Promise<void>;

    resumeAsync(): Promise<void>;

    stopAsync(): Promise<void>;

    setMixAudioAsync(on: boolean): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNSoundPlayer");