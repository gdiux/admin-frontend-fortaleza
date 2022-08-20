import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// MODELS
import { Worker } from 'src/app/models/worker.model';

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

          console.log(worker);
          this.worker = worker;

        });

  }

  
  // FIN DE LA CLASE
}
