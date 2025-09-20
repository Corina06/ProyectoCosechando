
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';
import { FooterComponent } from "./pages/cliente/footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, FormsModule, AppRoutingModule, FooterComponent]
})
export class AppComponent {
  title = 'Cosechando';
}
