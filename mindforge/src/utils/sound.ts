// Accessible gentle audio cues using HTML5 Web Audio API
// Dignified, non-intrusive sound frequencies designed for cognitive comfort

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playTone(frequency: number, type: OscillatorType = 'sine', duration = 0.15, volume = 0.08) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playCardFlip() {
    this.playTone(480, 'sine', 0.08, 0.05);
  }

  public playMatchSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    this.playTone(523.25, 'sine', 0.12, 0.08); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.18, 0.08), 100); // E5
  }

  public playMismatch() {
    this.playTone(220, 'triangle', 0.18, 0.06);
  }

  public playSequenceNote(index: number) {
    // Pleasant pentatonic frequencies: C4, D4, E4, G4, A4, C5
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const freq = pentatonic[index % pentatonic.length];
    this.playTone(freq, 'sine', 0.28, 0.1);
  }

  public playVictoryFanfare() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.09);
      }, idx * 120);
    });
  }

  public playReminderChime() {
    this.playTone(587.33, 'sine', 0.2, 0.08);
    setTimeout(() => this.playTone(880, 'sine', 0.3, 0.08), 150);
  }
}

export const soundFx = new SoundSynthesizer();
