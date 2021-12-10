import { Simulation } from './class/simulation';
import { Component } from '@angular/core';
import { Process } from './class/process';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  processList: Process[] = new Array();
  simulation: Simulation = new Simulation(this.processList);
  title = 'processDiagram';

  constructor() {
    for (let index = 0; index < 9; index++) {
      this.processList.push(new Process(index, `Proceso ${index}`, 10))
    }
    this.simulation = new Simulation(this.processList);
  }

  getShowList = () => {
    return this.simulation.showList;
  }

  getClass = (status: string) => {
    let classColor = '';
    switch (status) {
      case 'Creado':
        classColor = 'gray';
        break;
      case 'Listo':
        classColor = 'yellow';
        break;
      case 'En ejecución':
        classColor = 'green';
        break;
      case 'Terminado':
        classColor = 'red';
        break;
      case 'Esperando Entrada o Sálida':
        classColor = 'orange';
        break;
      case 'Esperando CPU':
        classColor = 'blue';
        break;
      case 'Recepción':
        classColor = 'purple';
        break;
    }
    return classColor;
  }
}
