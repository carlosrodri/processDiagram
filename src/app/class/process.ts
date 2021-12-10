export class Process {
    _pid: number = 0
    get pid (){
        return this._pid;
    }
    
    _name: string = '';
    public get name() {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    _status: Status = Status.Created;
    public get status(): Status {
        return this._status;
    }

    public set status(status: Status) {
        this._status = status;
    }

    _burst: number = 0;
    public get burst(): number {
        return this._burst;
    }

    public set burst(burst: number) {
        this._burst = burst;
    }

    constructor(pid: number, name: string, time: number) {
        this._pid = pid;
        this._name = name;
        this._status = Status.Created;
        this._burst = time;
        this.startTime(false);
    }

    /**
     * inicia el hilo del proceso y sus validaciones
     * valida el estado actual de la ráfaga, empezamos en un valor por defaul de 10 unidades de tiempo y se descuentan hasta llegar a 0
     * @param stop parámetro el cual define ssi se detiene el hilo del proceso
     */
    startTime = (stop: boolean) => {
        let interval =  setInterval(() => {
            if(this.status == Status.Terminated){
                clearInterval(interval)
            }
            if (this.status == Status.Executing) {
                this._burst -= 1;
            } else if (this._burst <= 0) {
                this._burst = 0;
                this.status = Status.Terminated
            }
        }, 1000);
        if(stop){
            clearInterval(interval);
        }
    }

    pause = () => {
        this._status = Status.WaitingCPU;
        this.startTime(true);
    }

    excecuting = () => {
        this._status = Status.Executing;
        this.startTime(false);
    }

    ready = () => {
        this._status = Status.Ready;
    }

    terminated = () => {
        this._status = Status.Terminated;
        this.startTime(true);
    }

    isFinished = (): boolean => {
        return this._status == Status.Terminated ? true : false;
    }
}


enum Status {
    Created = 'Creado',
    Ready = 'Listo',
    Executing = 'En ejecución',
    Terminated = 'Terminado',
    WaitingIO = 'Esperando Entrada o Sálida',
    WaitingCPU = 'Esperando CPU',
    Receiving = 'Recepción'
}