import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';

const WELCOME_SESSION_KEY = 'matryoshkaja.welcomeSeen';

@Component({
  selector: 'app-welcome-screen-component',
  imports: [],
  templateUrl: './welcome-screen-component.html',
  styleUrl: './welcome-screen-component.css',
})
export class WelcomeScreenComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  readonly visible = signal(false);
  readonly finishing = signal(false);

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const alreadySeen = sessionStorage.getItem(WELCOME_SESSION_KEY) === 'true';

    if (alreadySeen) {
      return;
    }

    this.visible.set(true);

    this.timers.push(
      setTimeout(() => {
        this.finishing.set(true);
      }, 2800),
    );

    this.timers.push(
      setTimeout(() => {
        sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
        this.visible.set(false);
      }, 4200),
    );
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }
}
