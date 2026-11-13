/**
 * Audio Utilities
 * 
 * This module handles all audio functionality for the Pac-Rat game,
 * including sound effects and background music using the Web Audio API.
 */

/**
 * Audio manager class for handling game sounds and music
 */
export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.musicLoopTimeout = null;
    this.backgroundMusicPlaying = false;
    this.musicNoteTimeouts = new Set();
    this.cutsceneVoices = new Set();
    this.enabled = true;
    this.musicEnabled = true;
    this.effectsEnabled = true;
  }

  /**
   * Initialize the audio context
   * Must be called after user interaction due to browser autoplay policies
   */
  initialize() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      this.audioContext ??= new AudioContext();
      if (this.audioContext.state === 'suspended' || this.audioContext.state === 'interrupted') {
        this.audioContext.resume().catch(() => {});
      }
    } catch {
      // Audio is optional when the browser cannot create or resume a context.
    }
  }

  /**
   * Set the master, music, and effects preferences
   */
  setMix({ sound, music, effects }) {
    this.enabled = sound;
    this.musicEnabled = music;
    this.effectsEnabled = effects;
    if (!sound || !music) this.stopBackgroundMusic();
    if (!sound || !effects) this.stopCutsceneEffects();
  }

  /**
   * Play a simple sound
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {string} type - Oscillator type (sine, square, triangle, sawtooth)
   * @param {number} volume - Volume level (0-1)
   */
  playSound(frequency, duration, type = 'sine', volume = 0.3, delay = 0, channel = 'effects') {
    const channelEnabled = channel === 'music' ? this.musicEnabled : this.effectsEnabled;
    if (!this.enabled || !channelEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;

    const start = this.audioContext.currentTime + delay;
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  playCutsceneEffect(notes) {
    const context = this.audioContext;
    if (!this.enabled || !this.effectsEnabled || context?.state !== 'running') return;

    const now = context.currentTime;
    for (const [pitch, endPitch, duration, type, volume, delay = 0] of notes) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + delay;
      const end = start + duration;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(pitch, start);
      oscillator.frequency.exponentialRampToValueAtTime(endPitch, end);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, end);
      oscillator.connect(gain);
      gain.connect(context.destination);

      const voice = { oscillator, gain };
      this.cutsceneVoices.add(voice);
      oscillator.onended = () => {
        this.cutsceneVoices.delete(voice);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(start);
      oscillator.stop(end);
    }
  }

  stopCutsceneEffects() {
    for (const { oscillator, gain } of this.cutsceneVoices) {
      gain.disconnect();
      oscillator.stop();
    }
    this.cutsceneVoices.clear();
  }

  /**
   * Play the dot collection sound
   */
  playDotSound() {
    this.playSound(800, 0.05, 'square', 0.1);
  }

  /**
   * Play the power-up collection sound
   */
  playPowerUpSound() {
    if (!this.enabled || !this.effectsEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      800,
      this.audioContext.currentTime + 0.2
    );

    gainNode.gain.value = 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Play the rat eating sound
   */
  playEatRatSound() {
    if (!this.enabled || !this.effectsEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      100,
      this.audioContext.currentTime + 0.3
    );

    gainNode.gain.value = 0.3;

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Play the death sound
   */
  playDeathSound() {
    if (!this.enabled || !this.effectsEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      this.audioContext.currentTime + 0.5
    );

    gainNode.gain.value = 0.4;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  /**
   * Play the candy collection sound (happy jingle)
   */
  playCandySound() {
    if (!this.enabled || !this.effectsEnabled || !this.audioContext) return;

    // Play a happy jingle - C E G C
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playSound(freq, 0.1, 'sine', 0.2), i * 50);
    });
  }

  playLevelClearSound() {
    [440, 554, 659].forEach((frequency, index) => {
      this.playSound(frequency, 0.14, 'triangle', 0.12, index * 0.1);
    });
  }

  /**
   * Start playing background music
   */
  playBackgroundMusic() {
    if (!this.enabled || !this.musicEnabled || !this.audioContext || this.backgroundMusicPlaying) return;

    this.backgroundMusicPlaying = true;
    this.playMusicLoop();
  }

  /**
   * Play one loop of the background music
   * Arizona ferret-themed adventure melody
   */
  playMusicLoop() {
    if (!this.enabled || !this.musicEnabled || !this.backgroundMusicPlaying) {
      this.backgroundMusicPlaying = false;
      if (this.musicLoopTimeout) {
        clearTimeout(this.musicLoopTimeout);
        this.musicLoopTimeout = null;
      }
      return;
    }

    // Dynamic Arizona ferret-themed adventure melody
    // Upbeat, playful tune that captures the desert adventure spirit
    const melody = [
      // Main phrase - energetic and bouncy
      { freq: 659, dur: 0.15 }, // E
      { freq: 784, dur: 0.15 }, // G
      { freq: 880, dur: 0.2 }, // A
      { freq: 784, dur: 0.1 }, // G
      { freq: 659, dur: 0.15 }, // E
      { freq: 523, dur: 0.25 }, // C

      // Variation 1 - desert wandering feel
      { freq: 587, dur: 0.2 }, // D
      { freq: 659, dur: 0.2 }, // E
      { freq: 784, dur: 0.3 }, // G
      { freq: 659, dur: 0.15 }, // E
      { freq: 587, dur: 0.15 }, // D

      // Climax - ferret adventure peak
      { freq: 1047, dur: 0.2 }, // C (high)
      { freq: 988, dur: 0.15 }, // B
      { freq: 880, dur: 0.15 }, // A
      { freq: 784, dur: 0.2 }, // G
      { freq: 659, dur: 0.25 }, // E

      // Bridge - mysterious desert moment
      { freq: 698, dur: 0.2 }, // F
      { freq: 784, dur: 0.2 }, // G
      { freq: 880, dur: 0.15 }, // A
      { freq: 784, dur: 0.15 }, // G
      { freq: 659, dur: 0.3 }, // E

      // Final phrase - triumphant return
      { freq: 523, dur: 0.15 }, // C
      { freq: 659, dur: 0.15 }, // E
      { freq: 784, dur: 0.15 }, // G
      { freq: 880, dur: 0.2 }, // A
      { freq: 1047, dur: 0.3 }, // C (high)
    ];

    let time = 0;
    melody.forEach((note) => {
      const noteTimeout = setTimeout(() => {
        this.musicNoteTimeouts.delete(noteTimeout);
        if (this.backgroundMusicPlaying && this.enabled && this.musicEnabled) {
          // Vary the waveform for more interest
          const waveform = note.freq > 800 ? 'triangle' : 'square';
          this.playSound(note.freq, note.dur, waveform, 0.06, 0, 'music');
        }
      }, time * 1000);
      this.musicNoteTimeouts.add(noteTimeout);
      time += note.dur;
    });

    // Schedule next loop
    this.musicLoopTimeout = setTimeout(() => this.playMusicLoop(), time * 1000 + 300);
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    this.backgroundMusicPlaying = false;
    if (this.musicLoopTimeout) {
      clearTimeout(this.musicLoopTimeout);
      this.musicLoopTimeout = null;
    }
    this.musicNoteTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.musicNoteTimeouts.clear();
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopBackgroundMusic();
    this.stopCutsceneEffects();
    if (this.audioContext) {
      this.audioContext.close?.();
      this.audioContext = null;
    }
  }
}

// Create a singleton instance
export const audioManager = new AudioManager();
