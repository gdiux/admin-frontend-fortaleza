interface _skills {
    name: string,
    years: number,
    fecha: Date,
    id: string
}

export class Worker {
    
    constructor(
        public name: string,
        public cedula: string,
        public phone: string,
        public email: string,
        public address: string,
        public city: string,
        public department: string,
        public zip: string,
        public status: boolean,
        public google: boolean,
        public type: string,
        public img: string,
        public fecha: Date,
        public wid: string,
        public description: string,
        public attachments: any[],
        public skills: _skills[]
        
    ){}

}