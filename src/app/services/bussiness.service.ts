import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

// ENVIRONMENT
import { environment } from '../../environments/environment';

// MODELS
import { Bussiness } from '../models/bussiness.model';

// INTERFACES
import { LoadBussiness } from '../interfaces/load-bussiness.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BussinessService {

  constructor(  private http: HttpClient,
                private router: Router) { }


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
   *   LOAD BUSSINESS
  ==================================================================== */
  loadBussiness(desde: number, limite: number){
    return this.http.get<LoadBussiness>( `${base_url}/bussiness?desde=${desde}&limite=${limite}`, this.headers );
  }

  /** ================================================================
   *   LOAD WORKER ID
  ==================================================================== */
  loadBussinessId(id: string){
    return this.http.get<{bussiness: Bussiness, ok: boolean}>(`${base_url}/bussiness/${id}`, this.headers);
  }

  /** ================================================================
   *   UPDATE BUSSINESS
  ==================================================================== */
  updateBussiness(formData: any, bid: string){
    return this.http.put<{ ok: boolean, bussiness: Bussiness }>(`${base_url}/bussiness/${bid}`, formData, this.headers);
  }

  /** ================================================================
   *   RECUPERAR PASSWORD
  ==================================================================== */
  recuperarPasswordBussiness( formData: any ){
    return this.http.post(`${base_url}/login/recuperar/password/bussiness`, formData);
  }


  // FIN DE LA CLASE
}
