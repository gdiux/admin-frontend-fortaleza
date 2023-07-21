import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bussiness } from 'src/app/models/bussiness.model';
import { FormBuilder, Validators } from '@angular/forms';

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
                private searchService: SearchService,
                private fb: FormBuilder) { }

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

          this.editBussineessForm.setValue({
            name: this.bussiness.name,
            nit: this.bussiness.nit,
            phone: this.bussiness.phone,
            email: this.bussiness.email,
            address: this.bussiness.address,
            city: this.bussiness.city,
            department: this.bussiness.department,
          })

        });

  }

  /** ================================================================
   *  EDITAR BUSSINESS
  ==================================================================== */
  public editBussinessSubmited: boolean = false;
  public editBussineessForm = this.fb.group({
    name: ['', [Validators.required]],
    nit: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    department: ['', [Validators.required]],

  });

  editarBussiness(){

    this.editBussinessSubmited = true;

    if( this.editBussineessForm.invalid ){
      return;
    }


    this.bussinessService.updateBussiness(this.editBussineessForm.value, this.bussiness.bid)
        .subscribe( ({bussiness}) => {

          this.editBussinessSubmited = false;
          this.loadBussiness(this.bussiness.bid!);
          Swal.fire('Estupendo', 'Se ha modificado correctamente la empresa', 'success');


        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg);          
        })


  }

    /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validateEdit( campo:string ): boolean{
    if ( this.editBussineessForm.get(campo)?.invalid && this.editBussinessSubmited ) {      
      return true;
    }else{
      return false;
    }
  }

   /** ================================================================
   *  CAMBIAR CONTRASEÑA
  ==================================================================== */
  public formSubmitePass: boolean = false;
  public formPass = this.fb.group({
    password: [ '', [Validators.required, Validators.minLength(6)]],
    repassword: [ '', [Validators.required, Validators.minLength(6)]],
  });

  editarPassword(){

    this.formSubmitePass = true;

    if (this.formPass.invalid) {
      return;
    }

    if (this.formPass.value.password !== this.formPass.value.repassword) {
      Swal.fire('Error', 'Las contraseñas no son iguales', 'error');
      return;
    }

    this.bussinessService.updateBussiness(this.formPass.value, this.bussiness.bid!)
        .subscribe( ({bussiness}) => {

          this.formSubmitePass = false;

          this.formPass.reset({
            password: '',
            repassword: '',
          });

          Swal.fire('Estupendo', 'Se ha cambiado la contraseña exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });

  }

  /** ======================================================================
   * VALIDATE UPDATE EDIT FORM
  ====================================================================== */
  validatePassword( campo: string): boolean{
    
    if ( this.formPass.get(campo)?.invalid && this.formSubmitePass ) {      
      return true;
    }else{
      return false;
    }

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

  /** ======================================================================
   * NEW JOB
  ====================================================================== */
  public formSubmited: boolean = false;
  public formCreate = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    sueldo: ['', [Validators.required]],
  });

  createJob(){

    this.formSubmited = true;

    if (this.formCreate.invalid) {
      return;
    }

    this.jobsService.createJob(this.formCreate.value, this.bussiness.bid!)
        .subscribe( ({job}) => {

          this.formSubmited = false;
          this.formCreate.reset();
          this.loadBussiness(this.bussiness.bid!);
          Swal.fire('Estupendo', 'se ha creado la oferta nueva exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });
  }

  /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validateForm( campo:string ): boolean{
    if ( this.formCreate.get(campo)?.invalid && this.formSubmited ) {      
      return true;
    }else{
      return false;
    }
  }


  // FIN DE LA CLASE

}
