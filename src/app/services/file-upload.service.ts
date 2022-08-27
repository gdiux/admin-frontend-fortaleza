import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

// MODELS
import { Worker } from '../models/worker.model';

const base_url = environment.base_url;
const fortaleza_url = environment.fortaleza_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

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
   *   UPDATE IMAGES
  ==================================================================== */
  async updateImage(
    archivo: File,
    type: 'products' | 'logo' | 'user' | 'preventives' | 'correctives',
    id: string,
    desc: 'imgBef' | 'imgAft' | 'video' | 'none' = 'none'
  ){

    try {
      
      const url = `${base_url}/uploads/${type}/${id}?desc=${desc}`;

      const formData = new FormData();
      formData.append('image', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers:{
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        return data;
      }else{
        return false;

      }      
      
    } catch (error) {
      console.log(error);      
      return false;
    }

  }

  /** ================================================================
   *   UPDATE FILES
  ==================================================================== */
  async updateFiles(
    archivo: File,
    type: 'img' | 'archivos' ,
    desc: 'Examen Medico' | 'Cedula Ciudadania' | 'Hoja de vida' | 'Registro Civil' | 'Registro de Matrimonio' | 'EPS' | 'Pensiones' | 'Cesantias' | 'Banco' | 'Caja de Compensacion' | 'RUT' | 'Antecedentes',
    id: string
  ){
      
      const url = `${fortaleza_url}/uploads/files/${type}/${desc}/${id}`;

      const formData = new FormData();
      formData.append('image', archivo);


      const resp = await fetch(url, {
        method: 'PUT',
        headers:{
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      return await resp.json();

  }

  /** ================================================================
   *   DELETE IMAGES
  ==================================================================== */
  deleteFile(attachment: string, id: string){

    return this.http.delete<{worker: Worker, ok: boolean}>(`${fortaleza_url}/uploads/delete/${attachment}/${id}`, this.headers);

  }



  // FIN DE LA CLASE

}
