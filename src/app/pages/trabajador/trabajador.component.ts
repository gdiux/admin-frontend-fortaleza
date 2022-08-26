import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// MODELS
import { Worker } from 'src/app/models/worker.model';
import Swal from 'sweetalert2';

// SERVICES
import { WorkersService } from '../../services/workers.service';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styles: [
  ]
})
export class TrabajadorComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private workersService: WorkersService) { }

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

  
  // FIN DE LA CLASE
}
