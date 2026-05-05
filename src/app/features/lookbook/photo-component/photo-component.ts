import { Component, input } from '@angular/core';

import { PhotoResponse } from '../../../core/api/api.models';

@Component({
  selector: 'app-photo-component',
  imports: [],
  templateUrl: './photo-component.html',
  styleUrl: './photo-component.css',
})
export class PhotoComponent {
  readonly photo = input.required<PhotoResponse>();
}
