import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

// MODELS
import { Worker } from 'src/app/models/worker.model';

// SERVICES
import { WorkersService } from '../../services/workers.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styles: [
  ]
})
export class TrabajadorComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private workersService: WorkersService,
                private fileUploadService: FileUploadService) { }

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
        });

  }

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

  subirArch(desc: any ): any{

    this.loading = true;
    
    this.fileUploadService.updateFiles( this.subirArchivo, this.typeFile, desc, this.worker.wid)
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

  
  // FIN DE LA CLASE
}
