/**
 * Procedural Web Audio API sound synthesizer for wooden chess acoustics.
 * Zero external asset dependencies — guaranteed to work offline and in sandboxes.
 */

class ChessAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound of moving a wooden piece onto a wooden square (felted solid tap).
   */
  public playMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.09);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Sound of capturing a piece (solid wooden collision).
   */
  public playCapture() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // First impact
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, t);
    osc1.frequency.exponentialRampToValueAtTime(60, t + 0.07);

    gain1.gain.setValueAtTime(0.65, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.09);

    // Second bounce (hollow wood resonance)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(180, t + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(40, t + 0.12);

    gain2.gain.setValueAtTime(0.3, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.02);
    osc2.stop(t + 0.15);
  }

  /**
   * Check indicator sound (refined brass/bell ping).
   */
  public playCheck() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(880, t + 0.05); // A5

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  /**
   * Castling move sound (two quick rhythmic wood taps).
   */
  public playCastle() {
    if (this.isMuted) return;
    this.playMove();
    setTimeout(() => {
      this.playMove();
    }, 110);
  }

  /**
   * Victory fan-fare / celebration chord.
   */
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chord = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  /**
   * Game draw or defeat quiet tone.
   */
  public playDefeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chord = [349.23, 311.13, 261.63];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }
}

export const soundManager = new ChessAudio();
