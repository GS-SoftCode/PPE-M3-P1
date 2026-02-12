import { Component, signal } from '@angular/core';
import { PromediosComponent } from './promedios/promedios';
import { MatricesComponent } from './matrices/matrices';

@Component({
  selector: 'app-root',
  imports: [PromediosComponent, MatricesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly vistaActual = signal<'promedios' | 'matrices' | null>(null);

  mostrarPromedios() {
    this.vistaActual.set('promedios');
  }

  mostrarMatrices() {
    this.vistaActual.set('matrices');
  }
}
