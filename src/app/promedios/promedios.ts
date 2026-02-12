import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function CalcMedia(datos: number[]): number {
  if (datos.length === 0) return 0;
  const suma = datos.reduce((acc, val) => acc + val, 0);
  return suma / datos.length;
}

export function CalcMediana(datos: number[]): number {
  if (datos.length === 0) return 0;
  const ordenados = [...datos].sort((a, b) => a - b);
  const medio = Math.floor(ordenados.length / 2);
  
  if (ordenados.length % 2 === 0) {
    return (ordenados[medio - 1] + ordenados[medio]) / 2;
  } else {
    return ordenados[medio];
  }
}

export function CalcModa(datos: number[]): number[] {
  if (datos.length === 0) return [];
  const frecuencias = new Map<number, number>();
  datos.forEach(valor => {
    frecuencias.set(valor, (frecuencias.get(valor) || 0) + 1);
  });
  
  let maxFrecuencia = 0;
  
  frecuencias.forEach((frecuencia) => {
    if (frecuencia > maxFrecuencia) {
      maxFrecuencia = frecuencia;
    }
  });

  if (maxFrecuencia === 1) {
    return [];
  }
  
  const modas: number[] = [];
  frecuencias.forEach((frecuencia, valor) => {
    if (frecuencia === maxFrecuencia) {
      modas.push(valor);
    }
  });
  
  return modas;
}

@Component({
  selector: 'app-promedios',
  imports: [CommonModule, FormsModule],
  templateUrl: './promedios.html',
  styleUrl: './promedios.css'
})
export class PromediosComponent {
  valorInput = '';
  datos = signal<number[]>([]);
  
  get media(): number {
    return CalcMedia(this.datos());
  }
  
  get mediana(): number {
    return CalcMediana(this.datos());
  }
  
  get moda(): string {
    const modas = CalcModa(this.datos());
    if (modas.length === 0) return 'Nulo';
    
    return modas.map(m => {
      if (Number.isInteger(m)) {
        return m.toString();
      }
      return m.toFixed(2);
    }).join(', ');
  }
  
  validarInput(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)) {
      return;
    }
    
    if (!/^[0-9.]$/.test(key)) {
      event.preventDefault();
      return;
    }
    
    if (key === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return;
    }
  }
  
  agregarValor() {
    const valor = parseFloat(this.valorInput);
    if (!isNaN(valor)) {
      this.datos.set([...this.datos(), valor]);
      this.valorInput = '';
    }
  }
  
  eliminarValor(index: number) {
    const nuevosDatos = this.datos().filter((_, i) => i !== index);
    this.datos.set(nuevosDatos);
  }
}
