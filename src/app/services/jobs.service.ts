import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

// ENVIRONMENT
import { environment } from '../../environments/environment';

import { LoadJobs } from '../interfaces/load-jobs.interface';
import { Job } from '../models/jobs.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class JobsService {

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
   *   POST JOB
  ==================================================================== */
  loadJobsBussiness(bussiness: string){
    return this.http.get<LoadJobs>(`${base_url}/jobs/all/${bussiness}`, this.headers);
  }

  /** ================================================================
   *   POST JOB
  ==================================================================== */
  createJob(formaData: any){
    return this.http.post<{ ok: boolean, job: Job }>(`${base_url}/jobs`, formaData, this.headers);
  }

  /** ================================================================
   *   UPDATE JOB
  ==================================================================== */
  updateJob(formData: any, jid: string){
    return this.http.put<{ ok: boolean, job: Job }>(`${base_url}/jobs/${jid}`, formData, this.headers);
  }

  /** ================================================================
   *   DELETE JOB
  ==================================================================== */
  deleteJob( jid: string ){
    return this.http.delete(`${base_url}/jobs/${jid}`, this.headers);
  }


  // FIN DE LA CLASE
}
