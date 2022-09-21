import { Entrevista } from "../models/entrevista.model";

export interface LoadEntrevistas{
    ok: boolean,
    entrevistas: Entrevista[]
}