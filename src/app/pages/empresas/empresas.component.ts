import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// MODELS
import { Bussiness } from 'src/app/models/bussiness.model';

// SERVICES
import { BussinessService } from 'src/app/services/bussiness.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styles: [
  ]
})
export class EmpresasComponent implements OnInit {

  constructor(  private bussinessService: BussinessService,
                private searchService: SearchService) { }

  ngOnInit(): void {

    // CARGAR EMPRESAS
    this.LoadBussiness();
  }

  /** ======================================================================
   * LOAD JOBS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public bussiness: Bussiness[] = [];
  public bussinessTemp: Bussiness[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  LoadBussiness(){

    this.cargando = true;
    this.sinResultados = false;           

    this.bussinessService.loadBussiness(this.desde, this.limite)
        .subscribe( ({bussiness, total}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (bussiness.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.bussiness = bussiness;
          this.bussinessTemp = bussiness;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.bussiness = this.bussinessTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('bussiness', termino, query)
        .subscribe( ({resultados}) => {

          this.bussiness = resultados;
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
    
    this.LoadBussiness();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    
    
    this.limite = Number(cantidad);
    this.LoadBussiness();
    
  }



  // FIN DE LA CLASE

}
