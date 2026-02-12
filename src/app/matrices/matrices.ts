import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function SumMatrices(matriz1: number[][], matriz2: number[][]): number[][] | null {
  if (matriz1.length !== matriz2.length || matriz1[0]?.length !== matriz2[0]?.length) {
    return null;
  }
  
  const resultado: number[][] = [];
  for (let i = 0; i < matriz1.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz1[i].length; j++) {
      resultado[i][j] = matriz1[i][j] + matriz2[i][j];
    }
  }
  return resultado;
}

export function MultMatrices(matriz1: number[][], matriz2: number[][]): number[][] | null {
  if (matriz1[0]?.length !== matriz2.length) {
    return null;
  }
  
  const filas = matriz1.length;
  const columnas = matriz2[0].length;
  const n = matriz2.length;
  const resultado: number[][] = [];
  
  for (let i = 0; i < filas; i++) {
    resultado[i] = [];
    for (let j = 0; j < columnas; j++) {
      resultado[i][j] = 0;
      for (let k = 0; k < n; k++) {
        resultado[i][j] += matriz1[i][k] * matriz2[k][j];
      }
    }
  }
  return resultado;
}

export function MultEscalar(matriz: number[][], escalar: number): number[][] {
  const resultado: number[][] = [];
  for (let i = 0; i < matriz.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz[i].length; j++) {
      resultado[i][j] = matriz[i][j] * escalar;
    }
  }
  return resultado;
}

@Component({
  selector: 'app-matrices',
  imports: [CommonModule, FormsModule],
  templateUrl: './matrices.html',
  styleUrl: './matrices.css'
})
export class MatricesComponent {
  operacionActual = signal<'suma' | 'multiplicacion' | 'escalar'>('suma');
  
  filasA = signal(2);
  columnasA = signal(2);
  filasB = signal(2);
  columnasB = signal(2);
  escalar = signal(1);
  
  matrizA = signal<(number | '')[][]>([['', ''], ['', '']]);
  matrizB = signal<(number | '')[][]>([['', ''], ['', '']]);
  resultado = signal<number[][] | null>(null);
  error = signal<string>('');
  
  cambiarOperacion(operacion: 'suma' | 'multiplicacion' | 'escalar') {
    this.operacionActual.set(operacion);
    this.resultado.set(null);
    this.error.set('');
  }
  
  actualizarDimensionesA() {
    const filas = Math.max(1, Math.min(10, this.filasA()));
    const columnas = Math.max(1, Math.min(10, this.columnasA()));
    this.filasA.set(filas);
    this.columnasA.set(columnas);
    
    if (this.operacionActual() === 'multiplicacion') {
      this.filasB.set(columnas);
      this.columnasB.set(filas);
      this.actualizarMatrizB();
    }
    
    this.actualizarMatrizA();
  }
  
  actualizarDimensionesSuma() {
    const filas = Math.max(1, Math.min(10, this.filasA()));
    const columnas = Math.max(1, Math.min(10, this.columnasA()));
    this.filasA.set(filas);
    this.columnasA.set(columnas);
    this.filasB.set(filas);
    this.columnasB.set(columnas);
    
    this.actualizarMatrizA();
    this.actualizarMatrizB();
  }
  
  actualizarMatrizA() {
    const filas = this.filasA();
    const columnas = this.columnasA();
    const nuevaMatriz: (number | '')[][] = [];
    for (let i = 0; i < filas; i++) {
      nuevaMatriz[i] = [];
      for (let j = 0; j < columnas; j++) {
        nuevaMatriz[i][j] = this.matrizA()[i]?.[j] ?? '';
      }
    }
    this.matrizA.set(nuevaMatriz);
  }
  
  actualizarMatrizB() {
    const filas = this.filasB();
    const columnas = this.columnasB();
    const nuevaMatriz: (number | '')[][] = [];
    for (let i = 0; i < filas; i++) {
      nuevaMatriz[i] = [];
      for (let j = 0; j < columnas; j++) {
        nuevaMatriz[i][j] = this.matrizB()[i]?.[j] ?? '';
      }
    }
    this.matrizB.set(nuevaMatriz);
  }
  
  actualizarDimensionesB() {
    const filas = Math.max(1, Math.min(10, this.filasB()));
    const columnas = Math.max(1, Math.min(10, this.columnasB()));
    this.filasB.set(filas);
    this.columnasB.set(columnas);
    
    if (this.operacionActual() === 'multiplicacion') {
      this.columnasA.set(filas);
      this.filasA.set(columnas);
      this.actualizarMatrizA();
    }
    
    this.actualizarMatrizB();
  }
  
  actualizarValorA(i: number, j: number, valor: string) {
    const matriz = [...this.matrizA()];
    if (valor === '') {
      matriz[i][j] = '';
    } else {
      const num = parseFloat(valor);
      matriz[i][j] = isNaN(num) ? '' : num;
    }
    this.matrizA.set(matriz);
  }
  
  actualizarValorB(i: number, j: number, valor: string) {
    const matriz = [...this.matrizB()];
    if (valor === '') {
      matriz[i][j] = '';
    } else {
      const num = parseFloat(valor);
      matriz[i][j] = isNaN(num) ? '' : num;
    }
    this.matrizB.set(matriz);
  }
  
  validarInput(event: KeyboardEvent) {
    const key = event.key;
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
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
  
  validarInputDimensiones(event: KeyboardEvent) {
    const key = event.key;
    
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
      return;
    }
    
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
      return;
    }
  }
  
  calcular() {
    this.error.set('');
    
    const convertirMatriz = (matriz: (number | '')[][]): number[][] => {
      return matriz.map(fila => fila.map(val => val === '' ? 0 : val));
    };
    
    if (this.operacionActual() === 'suma') {
      const res = SumMatrices(convertirMatriz(this.matrizA()), convertirMatriz(this.matrizB()));
      this.resultado.set(res);
    } else if (this.operacionActual() === 'multiplicacion') {
      const res = MultMatrices(convertirMatriz(this.matrizA()), convertirMatriz(this.matrizB()));
      this.resultado.set(res);
    } else if (this.operacionActual() === 'escalar') {
      const res = MultEscalar(convertirMatriz(this.matrizA()), this.escalar());
      this.resultado.set(res);
    }
  }
}
