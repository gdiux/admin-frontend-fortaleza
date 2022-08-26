import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

// MODELS
import { Worker } from '../models/worker.model';

// INTERFACES
import { LoadWorkers } from '../interfaces/load-workers.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class WorkersService {

  constructor(  private http: HttpClient) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

    /** ================================================================
   *   LOAD WORKERS
  ==================================================================== */
  loadWorkers(desde: number, limite: number){
    return this.http.get<LoadWorkers>( `${base_url}/workers?desde=${desde}&limite=${limite}`, this.headers );
  }

  /** ================================================================
   *   LOAD WORKER ID
  ==================================================================== */
  loadWorkerId(id: string){
    return this.http.get<{worker: Worker, ok: boolean}>(`${base_url}/workers/${id}`, this.headers);
  }

  /** ================================================================
   *   UPDATE CLIENTS
  ==================================================================== */
  updateWorker( formData:any, id: string ){
    return this.http.put<{ok: boolean, worker: Worker}>(`${base_url}/workers/${id}`, formData, this.headers);
  }


  // FIN DE LA CLASE
}
