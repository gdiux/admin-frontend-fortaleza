import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Worker } from 'src/app/models/worker.model';
import { SearchService } from 'src/app/services/search.service';
import { WorkersService } from 'src/app/services/workers.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styles: [
  ]
})
export class TrabajadoresComponent implements OnInit {

  constructor(  private workersService: WorkersService,
                private searchService: SearchService,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    // CARGAR TRABAJADORES
    this.loadWorkers();

  }

    /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public workers: Worker[] = [];
  public workersTemp: Worker[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  loadWorkers(){

    this.cargando = true;
    this.sinResultados = false;           

    this.workersService.loadWorkers(this.desde, this.limite)
        .subscribe( ({workers, total}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (workers.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.workers = workers;
          this.workersTemp = workers;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.workers = this.workersTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('workers', termino, query)
        .subscribe( ({resultados}) => {

          this.workers = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ================================================================
   *   CAMBIAR PAGINA
  ==================================================================== */
  @ViewChild('mostrar') mostrar!: ElementRef;
  cambiarPagina (valor: number){
    
    this.limite = Number(this.mostrar.nativeElement.value);
    
    if (this.limite > 10) {
      valor = valor * (this.limite/10);      
    }
    
    this.desde += valor;
    
    if (this.desde < 0) {
      this.desde = 0;
    }else if( this.desde > this.total ){
      this.desde -= valor;
    }
    
    this.loadWorkers();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    

    this.limite = Number(cantidad);
    this.loadWorkers();

  }


  // FIN DE LA CLASE
}
