// Web Audio API sound generator for futuristic UI feedback and ambient coding audio
// (100% synthesized procedural audio - zero external MP3s/assets required)

export type AmbientChannel = 'cyber-lofi' | 'synthwave-pad' | 'deep-space' | 'rain-zen' | 'off';

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private activeAmbientNodes: (AudioNode | number)[] = [];
  private currentChannel: AmbientChannel = 'off';
  private ambientInterval: number | null = null;

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!this.isMuted && this.ambientGain && this.ctx && this.currentChannel !== 'off') {
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playHover() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore audio errors
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Ignore audio errors
    }
  }

  public playBeep() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.025, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch {
      // Ignore audio errors
    }
  }

  public playCodeRun() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // Generative Procedural Ambient Music & Lo-Fi Generator
  public setAmbientChannel(channel: AmbientChannel) {
    this.currentChannel = channel;
    this.stopAmbient();

    if (channel === 'off') return;

    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.06, ctx.currentTime);
      this.ambientGain.connect(ctx.destination);

      if (channel === 'cyber-lofi') {
        this.startCyberLoFi(ctx);
      } else if (channel === 'synthwave-pad') {
        this.startSynthwavePad(ctx);
      } else if (channel === 'deep-space') {
        this.startDeepSpace(ctx);
      } else if (channel === 'rain-zen') {
        this.startRainZen(ctx);
      }
    } catch {
      // Ignore audio errors
    }
  }

  public getCurrentChannel(): AmbientChannel {
    return this.currentChannel;
  }

  private stopAmbient() {
    if (this.ambientInterval) {
      window.clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.activeAmbientNodes.forEach((item) => {
      if (typeof item !== 'number' && 'stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
        try {
          (item as AudioScheduledSourceNode).stop();
        } catch {}
      }
    });
    this.activeAmbientNodes = [];
  }

  private startCyberLoFi(ctx: AudioContext) {
    if (!this.ambientGain) return;

    // Chords: Dm9 -> G13 -> Cmaj9 -> Am7
    const chordProgressions = [
      [146.83, 220.0, 261.63, 329.63, 392.0], // Dm9
      [196.0, 246.94, 293.66, 329.63, 440.0], // G13
      [130.81, 196.0, 246.94, 261.63, 329.63], // Cmaj9
      [110.0, 164.81, 220.0, 261.63, 329.63], // Am7
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (this.currentChannel !== 'cyber-lofi' || !this.ambientGain) return;
      const now = ctx.currentTime;
      const freqs = chordProgressions[chordIndex];
      chordIndex = (chordIndex + 1) % chordProgressions.length;

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.015, now + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(noteGain);
        noteGain.connect(this.ambientGain!);

        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playNextChord();
    this.ambientInterval = window.setInterval(playNextChord, 4000);
  }

  private startSynthwavePad(ctx: AudioContext) {
    if (!this.ambientGain) return;
    const baseFreqs = [110, 164.81, 220, 277.18, 329.63]; // A minor warm pad

    baseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400 + i * 100, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain!);

      osc.start();
      this.activeAmbientNodes.push(osc);
    });
  }

  private startDeepSpace(ctx: AudioContext) {
    if (!this.ambientGain) return;
    // Sub-bass drone + ethereal hum
    const drones = [55, 82.41, 110];
    drones.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.ambientGain!);

      osc.start();
      this.activeAmbientNodes.push(osc);
    });
  }

  private startRainZen(ctx: AudioContext) {
    if (!this.ambientGain) return;
    // Noise buffer generator for realistic soft rain
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.025, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    noise.start();
    this.activeAmbientNodes.push(noise);
  }
}

export const soundFx = new SoundSystem();
