import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';

@Component({
  selector: 'carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition('* => void', [animate(1000, style({ opacity: 0 }))]),
    ]),
  ],
})
export class CarouselComponent implements OnInit {
  @Input()
  images: string[] = []; // Array de URLs de imágenes
  currentImageIndex: number = 0; // Índice de la imagen actual

  constructor() {}

  ngOnInit(): void {}

  previousImage(): void {
    if (this.currentImageIndex === 0) {
      this.currentImageIndex = this.images.length - 1;
    } else {
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (this.currentImageIndex === this.images.length - 1) {
      this.currentImageIndex = 0;
    } else {
      this.currentImageIndex++;
    }
  }
}
