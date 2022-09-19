import { Bussiness } from "../models/bussiness.model";

export interface LoadBussiness{
    ok: boolean,
    bussiness: Bussiness[],
    total: number
}