import { Job } from "../models/jobs.model";

export interface LoadJobs{
    ok: boolean,
    jobs: Job[]
}