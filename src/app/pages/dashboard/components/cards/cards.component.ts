import { Component, Input, OnInit } from '@angular/core';

// SERVICES
import { UsersService } from '../../../../services/users.service';
import { ClientsService } from '../../../../services/clients.service';
import { WorkersService } from '../../../../services/workers.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [
  ]
})
export class CardsComponent implements OnInit {

  @Input('coleccion') coleccion!: string;

  constructor(  private workersService: WorkersService,
                private usersService: UsersService) { }

  ngOnInit(): void {
    this.colection();    
  }

  /** ======================================================================
   * PARAM
  ====================================================================== */
  public total: number = 0;
  public color: string = 'bg-primary';
  public icon: string = 'mdi-alert-circle-outline';
  public title: string = 'Vacia';
  public ruta: string = '/';

  /** ======================================================================
   * COLECCION
  ====================================================================== */
  colection(){

    switch (this.coleccion) {
      case 'trabajadores':

        this.loadTrabajadores();
        
        break;

      case 'usuarios':
        this.loadUsers();
      break;

      case 'empresas':
        this.loadEmpresas();
      break;
    
      default:
        break;
    }
    
  }

  /** ======================================================================
   * LOAD CLIENTS
  ====================================================================== */
  loadTrabajadores(){

    this.workersService.loadWorkers(0,1000)
        .subscribe( ({ total }) => {

          this.total = total;
          this.color = 'bg-primary';
          this.icon = 'mdi-account-multiple-outline';
          this.title = 'Trabajadores';
          this.ruta = 'trabajadores';

        })

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  loadUsers(){

    this.usersService.loadUsers()
        .subscribe(({total}) => {

          this.total = total;
          this.color = 'bg-info';
          this.icon = 'mdi-account-box-outline';
          this.title = 'Usuarios';
          this.ruta = 'usuarios';

        });

  }

  /** ======================================================================
   * LOAD EMPRESAS
  ====================================================================== */
  loadEmpresas(){
    this.total = 0;
    this.color = 'bg-info';
    this.icon = 'mdi-account-box-outline';
    this.title = 'Empresas';
    this.ruta = 'empresas';
    
    // this.usersService.loadUsers()
    //     .subscribe(({total}) => {

    //       this.total = total;
    //       this.color = 'bg-info';
    //       this.icon = 'mdi-account-box-outline';
    //       this.title = 'Usuarios';
    //       this.ruta = 'usuarios';

    //     });

  }


  // FIN DE LA CLASE
}
