import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-reproductor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reproductor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ReproductorComponent implements OnInit {
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
}
