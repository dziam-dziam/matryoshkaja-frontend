import { Component } from '@angular/core';

import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';
import { TextBlockComponent } from '../../../shared/components/text-block-component/text-block-component';

@Component({
  selector: 'app-about-page',
  imports: [HeaderComponent, TextBlockComponent, FooterComponent],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {
  readonly storyParagraphs = [
    'Matryoshkaja is a visual archive built around photography, memory, and layered identity.',
    'The project treats every image as part of a larger collection: intimate, organized, and open to interpretation.',
  ];

  readonly lookbookParagraphs = [
    'The lookbook presents selected photographs in a clean structure, letting the archive stay readable before heavier visual styling is introduced.',
    'At this stage the page is connected directly to the backend, so every displayed image comes from the live API.',
  ];

  readonly processParagraphs = [
    'The frontend is being built step by step: first connection with the API, then page structure, then reusable components, and finally the visual language.',
    'This keeps the application easy to test while the design grows around working data.',
  ];
}
