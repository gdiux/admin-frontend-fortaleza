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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public user!: User;

  constructor(  private productsService: ProductsService,
                private usersService: UsersService,
                private preventivesServices: PreventivesService,
                private correctivesService: CorrectivesService,) {  }

  ngOnInit(): void {

    this.loadProximos();

    this.user = this.usersService.user;
    this.loadPreventives();
    this.loadCorrectives();

  }

  /* ============================================================================ 
  LOAD PROXIMOS
  ============================================================================ */
  public products: Product[] = [];
  public totalProximos: number = 0;
  public inProduct: any;
  loadProximos(){

    let query = `tipo=proximos&status=true&preventivo=false`;
    this.productsService.loadProducts(0, 100, query)
        .subscribe(({ products, total }) =>{

          this.products = products;
          this.totalProximos = total;          

        });
  }

  /** ================================================================
   *  CARGAR PREVENTIVOS
  ==================================================================== */
  public preventives: Preventive[] = [];
  public estado: any = 'Pendiente';
  public total: number = 0;
  loadPreventives(){

    this.preventivesServices.loadPreventivesStaff(this.user.uid!, this.estado)
        .subscribe( ({ preventives, total }) => {

          this.total = total;
          this.preventives = preventives;

        });

  }

  /** ================================================================
   *  CARGAR CORRECTIVOS
  ==================================================================== */
  public correctives: Corrective[] = [];
  public estadoCorrective: any = 'Pendiente';
  public totalCorrectives: number = 0;
  loadCorrectives(){

    this.correctivesService.loadCorrectivesStaff(this.user.uid!, this.estadoCorrective)
        .subscribe( ({ correctives, total }) => {
          
          this.totalCorrectives = total;
          this.correctives = correctives;
          
        });

  }

  // FIN DE LA CLASE
}
