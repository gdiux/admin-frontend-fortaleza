import { Worker } from "../models/worker.model";

export interface LoadWorkers {
    ok: boolean,
    workers: Worker[],
    total: number
}