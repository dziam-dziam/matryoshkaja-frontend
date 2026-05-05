import { Component, input } from '@angular/core';

import { PhotoResponse } from '../../../core/api/api.models';
import { PhotoComponent } from '../photo-component/photo-component';

@Component({
  selector: 'app-photo-list-component',
  imports: [PhotoComponent],
  templateUrl: './photo-list-component.html',
  styleUrl: './photo-list-component.css',
})
export class PhotoListComponent {
  readonly photos = input.required<PhotoResponse[]>();
  readonly loading = input(false);
  readonly error = input<unknown>(null);
}
