import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WelcomeScreenComponent } from './shared/components/welcome-screen-component/welcome-screen-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WelcomeScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('matryoshkaja-frontend');
}
