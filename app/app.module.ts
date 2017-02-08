import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes} from '@angular/router';
import { HttpModule, RequestOptions } from '@angular/http';

import { AppComponent }   from './app.component';
import { FocusDirective } from './directives/focus.directive';

import { LoginComponent } from './component/login.component';
import { ProjectComponent } from './component/project.component';
import { ProjectsService } from './projects.service';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full'},
	{ path: 'projects', component: ProjectComponent},
	{ path: 'login', component: LoginComponent},
];


@NgModule({
  imports:      [ HttpModule, BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)],
  declarations: [ 
  	AppComponent,
  	FocusDirective,
  	LoginComponent,
  	ProjectComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [ ProjectsService ]
})
export class AppModule { 

}
