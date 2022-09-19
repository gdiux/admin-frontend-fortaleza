import { Component, OnInit } from '@angular/core';

// MODELS
import { Product } from 'src/app/models/products.model';
import { User } from '../../models/users.model';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { UsersService } from '../../services/users.service';
import { Corrective } from 'src/app/models/correctives.model';
import { Preventive } from '../../models/preventives.model';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';
import { JobsService } from '../../services/jobs.service';
import { Job } from 'src/app/models/jobs.model';
import Swal from 'sweetalert2';
import { SearchService } from 'src/app/services/search.service';
import { Worker } from 'src/app/models/worker.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public user!: User;

  constructor(  private usersService: UsersService,
                private jobsService: JobsService,
                private searchService: SearchService) {  }

  ngOnInit(): void {

    this.user = this.usersService.user;

    // CARGAR JOBS PENDIENTES
    this.loadJobs();

  }

  /** ================================================================
   *  LOAD JOBS PENDIENTE
  ==================================================================== */
  public jobsPendiente: Job[] = [];
  loadJobs(){

    let query = '?type=Pendiente';

    this.jobsService.loadJobsStatus(query)
        .subscribe( ({jobs}) => {

          this.jobsPendiente = jobs;  
          

        })

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
