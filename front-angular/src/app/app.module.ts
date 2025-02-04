import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { routes } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { LinkListComponent } from './components/link-list/link-list.component';
import { LinkDetailComponent } from './components/link-detail/link-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LinkListComponent,
    LinkDetailComponent
  ],
  imports: [
    BrowserModule,
    routes,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }