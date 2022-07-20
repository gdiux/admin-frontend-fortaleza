import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

// SERVICES
import { SearchService } from '../../services/search.service';
import { CorrectivesService } from '../../services/correctives.service';

// MODELS
import { Corrective } from '../../models/correctives.model';

@Component({
  selector: 'app-correctivos',
  templateUrl: './correctivos.component.html',
  styles: [
  ]
})
export class CorrectivosComponent implements OnInit {

  constructor(  private correctivesServices: CorrectivesService,
                private searchService: SearchService,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loadCorrectives();

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public correctives: Corrective[] = [];
  public correctivesTemp: Corrective[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  loadCorrectives(){

    this.cargando = true;
    this.sinResultados = false;

    this.correctivesServices.loadCorrectives(this.desde, this.limite)
        .subscribe( ({ correctives, total }) => {

          // COMPROBAR SI EXISTEN RESULTADOS
          if (correctives.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.correctives = correctives;
          this.correctivesTemp = correctives;          

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }


  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.correctives = this.correctivesTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('preventives', termino, query)
        .subscribe( ({resultados}) => {

          this.correctives = resultados;
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
    
    this.loadCorrectives();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    

    this.limite = Number(cantidad);
    this.loadCorrectives;

  }

}
