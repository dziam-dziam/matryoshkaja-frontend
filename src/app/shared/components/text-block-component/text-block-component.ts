import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-block-component',
  imports: [],
  templateUrl: './text-block-component.html',
  styleUrl: './text-block-component.css',
})
export class TextBlockComponent {
  readonly eyebrow = input('');
  readonly title = input('');
  readonly paragraphs = input<string[]>([]);
}
