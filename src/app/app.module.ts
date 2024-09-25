import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserListComponent } from './user/user-list/user-list.component'; // Ajusta la ruta según tu estructura

@NgModule({
  declarations: [
    UserListComponent,
    // otros componentes
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  
 
})
export class AppModule { }