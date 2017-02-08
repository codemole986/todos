import { Component } from '@angular/core';

@Component({
  selector: 'todo-projects',
  template: `<h1>Angular Router</h1>
  <nav>
    <a routerLink="/login" routerLinkActive="active">Login</a>
    <a routerLink="/projects" routerLinkActive="active">Projects</a>
  </nav>
  <router-outlet></router-outlet>`
})

export class AppComponent { 
	title = 'Todo Project';
}
		