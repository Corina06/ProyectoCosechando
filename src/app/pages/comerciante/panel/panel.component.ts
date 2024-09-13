import { Component } from '@angular/core';
import { NavcomerComponent } from "../navcomer/navcomer.component";

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [NavcomerComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {

}
