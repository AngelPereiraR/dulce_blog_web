import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './not_found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {

  ngOnInit(): void { }

}
