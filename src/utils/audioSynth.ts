class AudioSynthManager {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private isMuted: boolean = false;
  private musicIntervalId: any = null;
  private isMusicPlaying: boolean = false;
  private activeMusicSources: Array<{ osc: OscillatorNode; gain: GainNode }> = [];

  constructor() {
    // AudioContext will be initialized on first user interaction due to browser policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Music Gain Node
        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGainNode.connect(this.ctx.destination);

        // SFX Gain Node
        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = volume;
    this.initContext();
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : volume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = volume;
    this.initContext();
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : volume, this.ctx.currentTime);
    }
  }

  public toggleMute(muted?: boolean) {
    this.isMuted = muted !== undefined ? muted : !this.isMuted;
    this.setMusicVolume(this.musicVolume);
    this.setSfxVolume(this.sfxVolume);
  }

  // Programmatic Sound Effects (SFX)
  
  public playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted || this.sfxVolume === 0) return;

    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.08);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(time);
    osc.stop(time + 0.09);
  }

  public playDiceRoll() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted || this.sfxVolume === 0) return;

    const time = this.ctx.currentTime;
    const duration = 0.5;
    
    // Create rolling rumble using low frequency triangular wave
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, time);
    
    // Modulate frequency to simulate rolling die
    for (let i = 0; i < 8; i++) {
      const step = time + (i * (duration / 8));
      const freq = 60 + Math.random() * 80;
      osc.frequency.setValueAtTime(freq, step);
    }

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.linearRampToValueAtTime(0.01, time + duration);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  public playLadderClimb() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted || this.sfxVolume === 0) return;

    const time = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    const noteDuration = 0.08;

    notes.forEach((freq, index) => {
      const noteTime = time + (index * noteDuration);
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + noteDuration - 0.01);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(noteTime);
      osc.stop(noteTime + noteDuration);
    });
  }

  public playSnakeSlide() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted || this.sfxVolume === 0) return;

    const time = this.ctx.currentTime;
    const duration = 0.8;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, time);
    filter.frequency.exponentialRampToValueAtTime(100, time + duration);

    gain.gain.setValueAtTime(0.25, time);
    // Wobble effect for snake slide
    for (let i = 0; i < 12; i++) {
      const step = time + (i * (duration / 12));
      const vol = 0.1 + (i % 2 === 0 ? 0.15 : -0.05);
      gain.gain.setValueAtTime(Math.max(0.01, vol), step);
    }
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted || this.sfxVolume === 0) return;

    const time = this.ctx.currentTime;
    // Triumphant chords progression
    // C major arpeggio, then F major, then high C
    const playNote = (freq: number, start: number, dur: number, wave: 'sine' | 'triangle' | 'square' = 'triangle') => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = wave;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(start);
      osc.stop(start + dur);
    };

    // Fanfare arpeggio
    playNote(261.63, time + 0.0, 0.25); // C4
    playNote(329.63, time + 0.1, 0.25); // E4
    playNote(392.00, time + 0.2, 0.25); // G4
    playNote(523.25, time + 0.3, 0.4);  // C5

    playNote(349.23, time + 0.5, 0.25); // F4
    playNote(440.00, time + 0.6, 0.25); // A4
    playNote(523.25, time + 0.7, 0.25); // C5
    playNote(698.46, time + 0.8, 0.4);  // F5

    // Triad ending chord
    playNote(523.25, time + 1.1, 1.2, 'sine');  // C5
    playNote(659.25, time + 1.1, 1.2, 'triangle');  // E5
    playNote(783.99, time + 1.1, 1.2, 'triangle');  // G5
    playNote(1046.50, time + 1.1, 1.2, 'sine'); // C6
  }

  // Synthesized Background Music
  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // We schedule a gentle loop of soft synthesized chords
    let step = 0;
    const tempo = 2.0; // 2 seconds per chord progression step

    const playAmbientStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode || this.isMuted || this.musicVolume === 0) return;
      
      const time = this.ctx.currentTime;
      
      // Chords: C-major (0), Aminor (1), F-major (2), G-major (3)
      const chordRoots = [130.81, 110.00, 87.31, 98.00]; // C3, A2, F2, G2
      const chordNotes = [
        [261.63, 329.63, 392.00], // C4, E4, G4 (C maj)
        [220.00, 261.63, 329.63], // A3, C4, E4 (A min)
        [174.61, 220.00, 261.63], // F3, A3, C4 (F maj)
        [196.00, 246.94, 293.66], // G3, B3, D4 (G maj)
      ];

      const activeChord = step % 4;
      const rootFreq = chordRoots[activeChord];
      const notes = chordNotes[activeChord];

      this.activeMusicSources = [];

      // 1. Play soft deep bass root note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(rootFreq, time);
      bassGain.gain.setValueAtTime(0, time);
      bassGain.gain.linearRampToValueAtTime(0.06, time + 0.5);
      bassGain.gain.linearRampToValueAtTime(0.04, time + tempo - 0.5);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + tempo);
      
      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGainNode);
      bassOsc.start(time);
      bassOsc.stop(time + tempo);
      this.activeMusicSources.push({ osc: bassOsc, gain: bassGain });

      // 2. Play soft triangle chords (arpeggiating slightly)
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        // Gentle offset for arpeggiation
        const startTime = time + (idx * 0.15);
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.025, startTime + 0.4);
        gain.gain.linearRampToValueAtTime(0.015, startTime + tempo - 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + tempo - 0.1);

        osc.connect(gain);
        gain.connect(this.musicGainNode);
        osc.start(startTime);
        osc.stop(time + tempo);
        this.activeMusicSources.push({ osc: osc, gain: gain });
      });

      step++;
    };

    // Initial trigger
    playAmbientStep();
    
    // Interval for loop
    this.musicIntervalId = setInterval(playAmbientStep, tempo * 1000);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    
    // Stop any active oscillators
    this.activeMusicSources.forEach(src => {
      try {
        src.osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeMusicSources = [];
  }
}

export const audioSynth = new AudioSynthManager();
