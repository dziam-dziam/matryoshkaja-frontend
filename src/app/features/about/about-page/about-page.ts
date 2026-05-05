import { Component } from '@angular/core';

import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';

@Component({
  selector: 'app-about-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {}
