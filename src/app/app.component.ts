import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavComponent } from "./pages/cliente/nav/nav.component";
import { FooterComponent } from './pages/cliente/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavComponent, RouterLink, FooterComponent]
})
export class AppComponent {
  title = 'Cosechando';
}
