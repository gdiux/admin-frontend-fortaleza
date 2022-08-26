import { Pipe, PipeTransform } from '@angular/core';

import { environment } from "../../environments/environment"

const base_url = environment.base_url;
const fortaleza_url = environment.fortaleza_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'worker' | 'user' | 'archivos' ): string {

    if (img) {
      
        if (tipo === 'worker') {
          return `${fortaleza_url}/uploads/${tipo}/${img}`;          
        }else if (tipo === 'archivos'){
          return `${fortaleza_url}/uploads/${tipo}/${img}`;
        }
        else{
          return `${base_url}/uploads/${tipo}/${img}`;
        }

    }else{
        
        if (tipo === 'worker') {          
          return `${fortaleza_url}/uploads/${tipo}/${img}`;          
        }else{
          return `${base_url}/uploads/${tipo}/no-image`;
        }
    }

  }

}
