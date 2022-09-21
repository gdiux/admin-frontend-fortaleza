import { Worker } from "./worker.model";

export class Entrevista{

    constructor(
        public control: number,
        public enlace: string,
        public worker: Worker,
        public confirm: boolean,
        public status: boolean,
        public cancel: boolean,
        public day: Date,
        public fecha: Date,
        public eid: string,
        public _id: string,
    ){}

}