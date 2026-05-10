import { Component, input, output } from '@angular/core';

import { PhotoResponse } from '../../../core/api/api.models';

@Component({
  selector: 'app-photo-component',
  imports: [],
  templateUrl: './photo-component.html',
  styleUrl: './photo-component.css',
})
export class PhotoComponent {
  readonly photo = input.required<PhotoResponse>();
  readonly photoSelected = output<PhotoResponse>();

  selectPhoto(): void {
    this.photoSelected.emit(this.photo());
  }
}