import { Process } from "./process";

export class Simulation {

    queue: Process[] = new Array()
    CPUqueue: Process[] = new Array();

    showList: Process[] = this.queue.concat(this.CPUqueue)
    processList: Process[] = new Array();
    get processes() {
        return this.processList;
    }

    time: number = 0;
    //valor del quantum (dafault 2 Unidades de tiempo)
    quantum: number = 2;

    //valor actual del quantum en ejecución
    currentQuantum: number = this.quantum;

    constructor(processList: Process[]) {
        this.processList = processList;
        let interval = setInterval(() => {
            if (this.CPUqueue.length == 0 && this.queue.length == 0 && this.showList[this.showList.length-1].isFinished()) {
                clearInterval(interval)
                alert(`La simulación ha terminado con un tiempo de: ${this.time}`)
            }
            this.time += 1;
            this.currentQuantum--;
        }, 1000);
        this.startOperation();
    }

    addWaitingQueue = (process: Process) => {
        this.queue.push(process)
    }

    /**
     * Se inicia la simulación y se establece los estados de los procesos en Listo
     */
    startOperation = () => {
        setTimeout(() => {
            this.processList.forEach(process => {
                process.ready();
            });
        }, 2000);
        this.CPUqueue = this.processList;
        this.showList = [...this.CPUqueue, ...this.queue]
        let mainProcess = setInterval(() => {
            if (this.CPUqueue.length > 0 || this.queue.length > 0) {
                this.validateProcessStatus();
            } else if (this.CPUqueue.length == 0 && this.queue.length == 0 && this.showList[this.showList.length-1].isFinished()) {
                clearInterval(mainProcess)
            }
        }, 1000)
    }

    /**
     * Validar cada uno de los escenarios cuando hay quantum (2 unidades de tiempo)
     * Si hay quantum y hay procesos en la cola de CPU con estado (esperando por CPU), se atienden, si están en (Ejecutando) se pasa a la cola de espera
     * Si hay quantum y la cola de CPU está vacía y la de espera tiene procesos, los procesos pasan a la cola de CPU y se repite el ciclo anterior
     * Si hay quantum y un proceso tiene estado terminado, simplemente sse retira de la cola enla que se encuentre
     */
    validateProcessStatus = () => {
        if (this.currentQuantum <= 0) {
            this.currentQuantum = this.quantum
            if (this.CPUqueue.length > 0 && (this.CPUqueue[0].status == 'Esperando CPU' || this.CPUqueue[0].status == 'Listo')) {
                this.CPUqueue[0].excecuting();
            } else if (this.CPUqueue.length > 0 && (this.CPUqueue[0].status == 'En ejecución')) {
                this.CPUqueue[0].pause();
                this.queue.push(<Process>this.CPUqueue.shift())
            } else if (this.CPUqueue.length == 0 && this.queue.length > 0) {
                this.CPUqueue = this.queue;
                this.queue = new Array();
            } else if (this.CPUqueue[0].status == 'Terminado') {
                this.CPUqueue.shift();
            } else if (this.queue.length > 0 && (this.queue[0].status == 'Terminado')) {
                this.queue.shift();
            }
        }
    }
}
