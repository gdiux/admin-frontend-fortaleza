import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bussiness } from 'src/app/models/bussiness.model';

import Swal from 'sweetalert2';

// SERVICE
import { BussinessService } from '../../services/bussiness.service';
import { JobsService } from '../../services/jobs.service';
import { SearchService } from 'src/app/services/search.service';

// MODELS
import { Worker } from 'src/app/models/worker.model';
import { Job } from '../../models/jobs.model';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styles: [
  ]
})
export class EmpresaComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private bussinessService: BussinessService,
                private jobsService: JobsService,
                private searchService: SearchService) { }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id}) => {
          
          this.loadBussiness(id);
          
        });

  }

  /** ================================================================
   *  LOAD BUSSINESS ID
  ==================================================================== */
  public bussiness!: Bussiness;
  
  loadBussiness(id: string){

    this.bussinessService.loadBussinessId(id)
        .subscribe( ({bussiness}) => {
          this.bussiness = bussiness;
          this.loadJobs();

        });

  }

  /** ==============================================================================
  /** ==============================================================================
  /** ==============================================================================
  /** ==============================================================================
  /** ==============================================================================
   *  LOAD JOBS BUSSINESS
  ===================================================================================*/
  public jobs: Job[] = [];
  loadJobs(){

    this.jobsService.loadJobsBussiness(this.bussiness.bid)
        .subscribe( ({jobs}) => {

          this.jobs = jobs;
          
        });

  }

  /** ================================================================
   *  EDIT JOBS
  ==================================================================== */
  public loading: boolean = false;
  public jobSelect!: Job;
  selectJob(job: Job){

    this.loading = true;
    this.jobSelect = job;
    
    setTimeout(() => {
      this.loading = false;
      
    }, 1000);

  }

  editarJob(){



  }  

  /** ================================================================
   *  DELETE JOBS BUSSINESS
  ==================================================================== */
  deleteJob(jid: string){

    Swal.fire({
      title: 'Atención?',
      text: "Estas seguro de eliminar esta oferta!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.jobsService.deleteJob(jid)
            .subscribe( resp => {

              this.loadJobs();
              Swal.fire('Estupendo', 'se elimino la oferta exitosamente', 'success');

            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');
            });

      }
    })

  }

  /** ======================================================================
   * BUSCAR TRABAJADOR
  ====================================================================== */
  public workers: Worker[] = [];
  public resultadoW: number = 0;
  public sinResultadoW: boolean = false;
  searchTrabajador(termino: string){
    
    this.sinResultadoW = false;
    if (termino.length === 0) {
      this.workers = [];
      this.resultadoW = 0;
      return;
    }   

    this.searchService.search('workers', termino, '')
        .subscribe( ({resultados}) => {

          this.workers = resultados;
          this.resultadoW = resultados.length;
          
          if (this.resultadoW === 0) {
            this.sinResultadoW = true;
          }

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** ======================================================================
   * ASIGNAR TRABAJADOR
  ====================================================================== */

  asignarWorker(worker: Worker){

    this.workers = [];
    this.resultadoW = 0;

    this.jobSelect.worker = worker; 
    

  }

  /** ======================================================================
   * ASSIGNAR WORKER Y FECHA DE INICIO
  ====================================================================== */
  asignarFechaWorker(fechain:any  ){
        
    if (fechain.length === 0) {
      Swal.fire('Atención', 'Debes de agregar una fecha de inicio', 'info');
      return;
    }

    if (!this.jobSelect.worker) {
      Swal.fire('Atención', 'Debes de asignar un trabajador', 'info');
      return;
    }

    let data = {
      fechain,
      worker: this.jobSelect.worker.wid,
      type: 'Aprobado'
    }

    this.jobsService.updateJob(data, this.jobSelect.jid )
        .subscribe( resp => {

          Swal.fire('Estupendo', 'Se ha asigando correctamente el trabajador y la fecha de inicio', 'success');

          this.loadJobs();          

        })

  }


  // FIN DE LA CLASE

}
