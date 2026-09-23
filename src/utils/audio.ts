/**
 * Procedural Web Audio API sound synthesizer for wooden chess acoustics.
 * Zero external asset dependencies — guaranteed to work offline and in sandboxes.
 */

class ChessAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private noiseBuffer: AudioBuffer | null = null;

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

  /**
   * Pre-generates an organic acoustic noise burst for physical wood transient simulation.
   */
  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === this.ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * 0.08); // 80ms
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const channelData = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.03 * white) / 1.03; // organic pink/brown noise
      channelData[i] = (last * 2.5 + white * 0.4) * Math.exp(-i / (sampleRate * 0.02));
    }
    this.noiseBuffer = buffer;
    return this.noiseBuffer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Authentic wooden chess piece landing on a wooden board.
   * Multi-layer physical acoustic synthesis:
   * 1. Felted wood transient click (1400Hz bandpass noise impulse)
   * 2. Weighted Staunton lead base mass (lowpass triangle sweep: 270Hz -> 55Hz)
   * 3. Hollow chessboard acoustic cavity resonance (138Hz sine body ring)
   * 4. Organic pitch jitter (±6%) for authentic, non-repetitive tactile feel
   */
  public playMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Micro-variation in placement velocity and piece weight
    const pitchVar = 0.94 + Math.random() * 0.12;

    // Layer 1: Felted wood contact transient click
    const noiseBuf = this.getNoiseBuffer();
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1450 * pitchVar, t);
      noiseFilter.Q.setValueAtTime(2.2, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.38, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.02);
    }

    // Fast surface contact snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(680 * pitchVar, t);
    snapOsc.frequency.exponentialRampToValueAtTime(160 * pitchVar, t + 0.014);

    snapGain.gain.setValueAtTime(0.45, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.016);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.02);

    // Layer 2: Weighted Staunton base mass ("thock" / "thump")
    const bodyOsc = this.ctx.createOscillator();
    const bodyFilter = this.ctx.createBiquadFilter();
    const bodyGain = this.ctx.createGain();

    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(270 * pitchVar, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(54 * pitchVar, t + 0.055);

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(780, t);
    bodyFilter.frequency.exponentialRampToValueAtTime(130, t + 0.06);

    bodyGain.gain.setValueAtTime(0.65, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

    bodyOsc.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(this.ctx.destination);
    bodyOsc.start(t);
    bodyOsc.stop(t + 0.075);

    // Layer 3: Hollow chessboard chamber resonance (warm wood knock)
    const resOsc = this.ctx.createOscillator();
    const resGain = this.ctx.createGain();

    resOsc.type = 'sine';
    resOsc.frequency.setValueAtTime(138 * pitchVar, t);
    resOsc.frequency.exponentialRampToValueAtTime(88 * pitchVar, t + 0.095);

    resGain.gain.setValueAtTime(0.24, t);
    resGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    resOsc.connect(resGain);
    resGain.connect(this.ctx.destination);
    resOsc.start(t);
    resOsc.stop(t + 0.11);
  }

  /**
   * Sound of capturing a piece:
   * 1. Sharp wood-on-wood collision click (pieces striking together)
   * 2. Followed immediately by the heavy weighted base slamming into the board.
   */
  public playCapture() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const pitchVar = 0.95 + Math.random() * 0.1;

    // First impact: Crisp wood-on-wood collision click
    const noiseBuf = this.getNoiseBuffer();
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2200 * pitchVar, t);
      noiseFilter.Q.setValueAtTime(2.8, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.025);
    }

    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(540 * pitchVar, t);
    clickOsc.frequency.exponentialRampToValueAtTime(170 * pitchVar, t + 0.028);

    clickGain.gain.setValueAtTime(0.65, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.035);

    // Second impact: Heavy settling thud onto the hardwood board (20ms later)
    const t2 = t + 0.02;
    const slamOsc = this.ctx.createOscillator();
    const slamFilter = this.ctx.createBiquadFilter();
    const slamGain = this.ctx.createGain();

    slamOsc.type = 'triangle';
    slamOsc.frequency.setValueAtTime(270 * pitchVar, t2);
    slamOsc.frequency.exponentialRampToValueAtTime(50 * pitchVar, t2 + 0.07);

    slamFilter.type = 'lowpass';
    slamFilter.frequency.setValueAtTime(820, t2);
    slamFilter.frequency.exponentialRampToValueAtTime(120, t2 + 0.075);

    slamGain.gain.setValueAtTime(0.72, t2);
    slamGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.08);

    slamOsc.connect(slamFilter);
    slamFilter.connect(slamGain);
    slamFilter.connect(this.ctx.destination);
    slamOsc.start(t2);
    slamOsc.stop(t2 + 0.085);

    // Deep hardwood box resonance
    const resOsc = this.ctx.createOscillator();
    const resGain = this.ctx.createGain();
    resOsc.type = 'sine';
    resOsc.frequency.setValueAtTime(130 * pitchVar, t2);
    resOsc.frequency.exponentialRampToValueAtTime(75 * pitchVar, t2 + 0.11);

    resGain.gain.setValueAtTime(0.32, t2);
    resGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.12);

    resOsc.connect(resGain);
    resGain.connect(this.ctx.destination);
    resOsc.start(t2);
    resOsc.stop(t2 + 0.13);
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
   * Castling move sound (King touches down, followed by Rook rhythmic tap).
   */
  public playCastle() {
    if (this.isMuted) return;
    this.playMove();
    setTimeout(() => {
      this.playMove();
    }, 130);
  }

  /**
   * Match start / opening chord chime.
   */
  public playGameStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25]; // A4, C#5, E5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.55);
    });
  }

  /**
   * Distinct turn alert for Player 1 (White): Bright, high-register wooden bell chime.
   */
  public playPlayer1Turn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, t); // E5
    osc1.frequency.exponentialRampToValueAtTime(987.77, t + 0.12); // B5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, t); // E6 shimmer
    osc2.frequency.exponentialRampToValueAtTime(1975.5, t + 0.1);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  /**
   * Distinct turn alert for Player 2 (Black): Deep, warm resonant wooden chime.
   */
  public playPlayer2Turn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(293.66, t); // D4
    osc1.frequency.exponentialRampToValueAtTime(196, t + 0.15); // G3

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(146.83, t); // D3 depth
    osc2.frequency.exponentialRampToValueAtTime(98, t + 0.18);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.38);
    osc2.stop(t + 0.38);
  }

  /**
   * Turn notification based on whose turn it is next.
   */
  public playTurnSound(nextTurnColor: 'w' | 'b') {
    if (nextTurnColor === 'w') {
      this.playPlayer1Turn();
    } else {
      this.playPlayer2Turn();
    }
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
