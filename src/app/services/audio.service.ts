import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio = new Audio();
  private isPlaying = false;
  private currentTrack = '';

  constructor() {
    // Restaurar el volumen desde el localStorage si está disponible
    const savedVolume = localStorage.getItem('audioVolume');
    this.audio.volume = savedVolume ? parseFloat(savedVolume) : 0.35; // El valor predeterminado es 1.0 (volumen máximo)

    this.audio.addEventListener('timeupdate', () => {
      localStorage.setItem(
        'audioCurrentTime',
        this.audio.currentTime.toString()
      );
    });

    this.audio.addEventListener('ended', () => {
      this.playTrack(this.currentTrack);
    });
  }

  playTrack(trackUrl: string) {
    if (this.currentTrack !== trackUrl) {
      this.audio.src = trackUrl;
      this.currentTrack = trackUrl;
      this.audio.currentTime = 0;
    }
    this.audio.play();
    this.isPlaying = true;
    localStorage.setItem('currentTrack', trackUrl);
  }

  pauseTrack() {
    this.audio.pause();
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration;
  }

  resumeTrack() {
    this.audio.play();
    this.isPlaying = true;
  }

  setCurrentTime(time: number) {
    this.audio.currentTime = time;
  }

  // Métodos para manejar el volumen
  setVolume(volume: number) {
    this.audio.volume = volume;
    localStorage.setItem('audioVolume', volume.toString()); // Guardar el volumen en localStorage
  }

  getVolume(): number {
    return this.audio.volume;
  }
}
