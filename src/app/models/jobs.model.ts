import { Bussiness } from "./bussiness.model";
import { Worker } from "./worker.model";

export class Job {

    constructor(
        public control: number,
        public name: string,
        public description: string,
        public sueldo: number,
        public bussiness: Bussiness,
        public worker: Worker,
        public status: boolean,
        public type: string,
        public fechain: Date,
        public fechaout: Date,
        public fecha: Date,
        public jid: string
    ){}

}