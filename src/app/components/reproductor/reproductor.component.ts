import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-reproductor',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './reproductor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ReproductorComponent implements OnInit {
  currentTime: string = '0:00';
  duration: string = '0:00';

  public firstLoading: boolean = true;

  constructor(public audioService: AudioService) {}

  ngOnInit() {
    const trackUrl =
      localStorage.getItem('currentTrack') ||
      'Roger Subirana Mata - Between Worlds.mp3';
    const savedTime = localStorage.getItem('audioCurrentTime');

    this.audioService.playTrack(trackUrl);

    if (savedTime) {
      this.audioService.setCurrentTime(parseFloat(savedTime));
    }

    this.updateTime();

    // Actualizar el tiempo cada segundo
    setInterval(() => {
      this.updateTime();
    }, 500);
  }

  togglePlayPause() {
    if (this.audioService.getIsPlaying()) {
      this.audioService.pauseTrack();
    } else {
      this.audioService.resumeTrack();
    }
  }

  increaseVolume() {
    let currentVolume = this.audioService.getVolume();
    if (currentVolume < 1.0) {
      currentVolume = Math.min(1.0, currentVolume + 0.01);
      this.audioService.setVolume(currentVolume);
    }
  }

  decreaseVolume() {
    let currentVolume = this.audioService.getVolume();
    if (currentVolume > 0.0) {
      currentVolume = Math.max(0.0, currentVolume - 0.01);
      this.audioService.setVolume(currentVolume);
    }
  }

  onVolumeChange(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Aseguramos que el target sea un HTMLInputElement
    const newVolume = parseFloat(inputElement.value);
    this.audioService.setVolume(newVolume);
  }

  private updateTime() {
    const currentTime = this.audioService.getCurrentTime();
    const duration = this.audioService.getDuration();

    if (duration) {
      this.currentTime = this.formatTime(currentTime);
      this.duration = this.formatTime(duration);
    }
  }

  private formatTime(time: number): string {
    const minutes: number = Math.floor(time / 60);
    const seconds: number = Math.floor(time % 60);

    this.firstLoading = false;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
