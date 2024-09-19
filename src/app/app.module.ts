import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Importa FormsModule

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
    FormsModule,  // Añade FormsModule aquí
    // otros módulos
  ],
  
 
})
export class AppModule { }