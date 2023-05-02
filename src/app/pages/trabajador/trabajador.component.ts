import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// MODELS
import { Worker } from 'src/app/models/worker.model';
import { Job } from 'src/app/models/jobs.model';
import { Entrevista } from 'src/app/models/entrevista.model';

// SERVICES
import { WorkersService } from '../../services/workers.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { JobsService } from 'src/app/services/jobs.service';
import { EntrevistasService } from '../../services/entrevistas.service';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styles: [
  ]
})
export class TrabajadorComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private workersService: WorkersService,
                private fileUploadService: FileUploadService,
                private jobsService: JobsService,
                private entrevistasService: EntrevistasService,
                private fb: FormBuilder) { }


  public dateActual: Date = new Date();

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id}) => {
          this.loadWorker(id);          
        });

  }

  /** ================================================================
   *  LOAD WORKER ID
  ==================================================================== */
  public worker!: Worker;
  
  loadWorker(id: string){

    this.workersService.loadWorkerId(id)
        .subscribe( ({worker}) => {
          this.worker = worker;

          this.cargarJobs();
          this.cargarEntrevistas();

          this.formEdit.reset({
            name: worker.name,
            cedula: worker.cedula,
            phone: worker.phone,
            email: worker.email,
            address: worker.address,
            city: worker.city,
            department: worker.department,
            barrio: worker.barrio
          });

        });

  }

  /** ================================================================
   *  EDITAR PERFIL DEL TRABAJADOR
  ==================================================================== */
  public formSubmiteEdit: boolean = false;
  public formEdit = this.fb.group({
    name: [ '', [Validators.required]],
    cedula: [ '', [Validators.required]],
    email: [ '', [Validators.required, Validators.email]],
    phone: [ '', [Validators.required]],
    address: [ '', [Validators.required]],
    city: [ '', [Validators.required]],
    department: [ '', [Validators.required]],
    barrio: [ '', [Validators.required]]
  });

  editarPerfil(){

    this.formSubmiteEdit = true;

    if (this.formEdit.invalid) {
      return;
    }

    this.workersService.updateWorker(this.formEdit.value, this.worker.wid)
        .subscribe( ({worker}) => {

          this.formSubmiteEdit = false;
          this.worker = worker;

          this.formEdit.reset({
            name: worker.name,
            cedula: worker.cedula,
            phone: worker.phone,
            email: worker.email,
            address: worker.address,
            city: worker.city,
            department: worker.department,
            barrio: worker.barrio
          });

          Swal.fire('Estupendo', 'Se ha actualizado el perfil del colaborador exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });

  }

  /** ======================================================================
   * VALIDATE UPDATE EDIT FORM
  ====================================================================== */
  validateEdit( campo: string): boolean{
    
    if ( this.formEdit.get(campo)?.invalid && this.formSubmiteEdit ) {      
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

    this.workersService.updateWorker(this.formPass.value, this.worker.wid)
        .subscribe( ({worker}) => {

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


  /** ================================================================
   *  APROBAR ARCHIVOS
  ==================================================================== */
  aprobarAll( approved: boolean, status: boolean ){

    Swal.fire({
      title: 'Atención?',
      text: "Estas seguro de cambiar el estado de todos los archivos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cambiar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        // CAMBIAR ESTADO
        this.worker.attachments.map( (file) => {          
          file.approved = approved;
          file.status = status;        
        });

        this.workersService.updateWorker( {attachments: this.worker.attachments}, this.worker.wid )
            .subscribe( ({worker}) => {

              this.worker.attachments = worker.attachments;
              Swal.fire('Estupendo', 'Se ha cambiado el estado de todos los archivos exitosamente!', 'success');              

            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');              
            });

      }
    })

  };

  /** ================================================================
   *  APROBAR ARCHIVOS
  ==================================================================== */
  aprobarArchivo( id: string, approved: boolean, status: boolean ){

    Swal.fire({
      title: 'Atención?',
      text: "Estas seguro de cambiar el estado del archivo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cambiar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        // CAMBIAR ESTADO
        this.worker.attachments.map( (file) => {          
          if (file._id === id) {            
            file.approved = approved;
            file.status = status;  
          }          
        });

        this.workersService.updateWorker( {attachments: this.worker.attachments}, this.worker.wid )
            .subscribe( ({worker}) => {

              this.worker.attachments = worker.attachments;
              Swal.fire('Estupendo', 'Se ha cambiado el estado del archivo exitosamente!', 'success');              

            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');              
            });

      }
    })

  };

  /** ================================================================
   *  ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   *   SUBIR ARCHIVOS
  ==================================================================== */
  public imgTemp: any = null;
  public imgTempAft: any = null;
  
  public typeFile: 'archivos' | 'img' = 'img';
  selecArch(file: any): any{

    this.subirArchivo = file.files[0];
    
    if (!this.subirArchivo) {  
      return this.file!.nativeElement.value = '';       
    }

    let verExt = this.subirArchivo.name.split('.');
    let ext = verExt[verExt.length - 1];
    
    if (ext === 'jpg' || ext === 'png' || ext === 'jepg' || ext === 'webp' ) {      
      this.typeFile = 'img';
    }else if (ext === 'pdf' || ext === 'docx' || ext === 'xlsx' ) {
      this.typeFile = 'archivos';      
    }
    
    // VALID EXT
    const archExt = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'jepg', 'webp'];

    if (!archExt.includes(ext)) {
      Swal.fire('Atención', 'Solo se permiten archivos PDF - Word - Excel - JPG - PNG - WEBP', 'warning');
      return this.file!.nativeElement.value = '';
    }
       
    // FIN DE CAMBIAR IMAGEN
  }
      
  /** ================================================================
   *  SUBIR ARCHIVOS
  ==================================================================== */
  @ViewChild('file') file!: any;
  public subirArchivo!: File;
  public imgProducto: string = 'no-image';
  public loading: boolean = false;
  public tipeD =  ['EPS', 'Caja de Compensacion'];
  @ViewChild('tipo')          tipo!: ElementRef;
  @ViewChild('parentesco')    parentesco!: ElementRef;
  @ViewChild('numero')        numero!: ElementRef;
  @ViewChild('beneficiario')  beneficiario!: ElementRef;

  subirArch(desc: any, tipo: string = 'No', parentesco: string = 'No', numero: string = 'No', beneficiario: string = 'No' ): any{

    if (  this.tipeD.includes(tipo) ||
          tipo.length === 0 ||
          parentesco.length === 0 ||
          numero.length === 0 ||
          beneficiario.length === 0) {
      Swal.fire('Atención!', 'Todos los datos son importantes', 'info');
      return;
    }

    this.loading = true;
    
    this.fileUploadService.updateFiles( this.subirArchivo, this.typeFile, desc, this.worker.wid, tipo, parentesco, numero, beneficiario)
    .then( data => {  
    

      if (data.ok === false) {
        Swal.fire('Error', data.msg, 'error');

        this.imgProducto = 'no-image';    
        this.imgTemp = null;
        this.file!.nativeElement.value = '';
        this.loading = false;
        
        return;
      }
      
      this.worker.attachments = data.worker.attachments;
      this.loading = false;
      
      Swal.fire('Estupendo', 'Se ha guardado el archivo exitosamente!', 'success');

      this.tipo.nativeElement.value = 'No';
      this.parentesco.nativeElement.value = 'No';
      this.numero.nativeElement.value = 'No';
      this.beneficiario.nativeElement.value = 'No';

      
    })
    .catch( err => {
      console.log(err);
      
    });
    
    
    this.file!.nativeElement.value = '';
    
  }

  /** ================================================================
   *  ELIMINAR ARCHIVOS
  ==================================================================== */
  deleteFile(attachment: string){

    Swal.fire({
      title: 'Atención?',
      text: "Estas seguro de eliminar este archivo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.fileUploadService.deleteFile(attachment, this.worker.wid)
        .subscribe( ({worker}) => {
          
          this.worker.attachments = worker.attachments;
          Swal.fire('Estupendo', 'El archivo se elimino exitosamente', 'success');

        });

      }
    })

  };

  /** ================================================================
   *  ASIGNAR TRABAJO
  ==================================================================== */
  asginar(type: string){

    if (type === 'Aspirante') {
      type = 'Trabajador';
    }else{
      type = 'Aspirante';
    }

    this.workersService.updateWorker({type}, this.worker.wid)
        .subscribe( ({worker}) => {
          this.worker.type = worker.type;
        });

  }

  /** ================================================================
   *  CARGAR TRABAJOS ASIGNADOS
  ==================================================================== */
  public jobs: Job[] = [];
  cargarJobs(){

    this.jobsService.loadJobsWorker( this.worker.wid )
        .subscribe( ({ jobs }) => {
          
          this.jobs = jobs;

        });
  }

  /** ================================================================
   *  SELECCIONAR TRABAJO
  ==================================================================== */
  public jobSelect!: Job;

  selectJob(job: Job){

    this.jobSelect = job;

  }

  /** ================================================================
   *  ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   *   ENTREVISTAS
  ==================================================================== */
  public entrevistas: Entrevista[] = [];

  cargarEntrevistas(){

    this.entrevistasService.loadEntrevistasWorker(this.worker.wid)
        .subscribe( ({entrevistas}) => {

          this.entrevistas = entrevistas;
          
        });

  }


  /** ================================================================
   *   CREAR ENTREVISTA
  ==================================================================== */
  public entrevistaFormSubmitted: boolean = false;
  public entrevistaForm = this.fb.group({
    enlace: ['', [Validators.required]],
    day: ['', Validators.required],
    worker: '',
    trabajador: '',
    email: '',
  })

  createEntrevista(){

    this.entrevistaForm.value.worker = this.worker.wid!;
    this.entrevistaForm.value.trabajador = this.worker.name;
    this.entrevistaForm.value.email = this.worker.email;

    this.entrevistaFormSubmitted = true;

    if (this.entrevistaForm.invalid) {
      return;
    }

    this.entrevistasService.createEntrevista(this.entrevistaForm.value)
        .subscribe( ({entrevista}) => {

          this.entrevistaForm.setValue({
            enlace: '',
            day: '',
            worker: this.worker.wid,
            trabajador: this.worker.name,
            email: this.worker.email,
          });

          this.entrevistaFormSubmitted = false;

          this.entrevistas.push(entrevista);
          Swal.fire('Estupendo', 'Se ha creado la entrevista exitosamente!', 'success');
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        });
    

  }

  /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validate( campo: string): boolean{
    
    if ( this.entrevistaForm.get(campo)?.invalid && this.entrevistaFormSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }

  /** ================================================================
   *   COMPLETAR ENTREVISTA ENTREVISTA
  ==================================================================== */
  completarEntrevista(status: boolean, id: string){

    this.entrevistasService.updateEntrevista({status, confirm: status}, id)
        .subscribe( ({entrevista}) => {

          this.cargarEntrevistas();
          Swal.fire('Estupendo', 'Se ha actualizado exitosamente la entrevista', 'success');          
          
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        })

  }

  /** ================================================================
   *   ELIMINAR ENTREVISTA
  ==================================================================== */
  deleteEntrevista(id: string){

    Swal.fire({
      title: 'Atención?',
      text: "Estas seguro de eliminar esta entrevista!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.entrevistasService.deleteEntrevista(id)
        .subscribe( resp => {

          this.cargarEntrevistas();
          Swal.fire('Estupendo', 'Se ha eliminado exitosamente la entrevista', 'success');          
          
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });

      }
    })

    

  }

  /** ================================================================
   *   ELIMINAR TRABAJO
  ==================================================================== */
  eliminarTrabajo(jid: string){

    Swal.fire({
      title: 'Atención?',
      text: "Estas seguro de eliminar esta asignación al trabajador?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        this.jobsService.deleteWorkerJob(jid, this.worker.wid)
            .subscribe( ({jobs, total}) => {

              this.jobs = jobs;

              if (total === 0) {
                this.asginar('Trabajador');
              }
              

            });

      }
    })
    

  }

  /** ================================================================
   *   PDF
  ==================================================================== */
  downloadPDF() {
    
    // Extraemos el
    const DATA = document.getElementById('pdf') as HTMLElement;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas( DATA , options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}.pdf`);
    });
  }

  
  // FIN DE LA CLASE
}
