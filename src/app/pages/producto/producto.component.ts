import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// MODELS
import { Product } from 'src/app/models/products.model';
import { Preventive } from 'src/app/models/preventives.model';
import { Corrective } from 'src/app/models/correctives.model';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [
  ]
})
export class ProductoComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private productsService: ProductsService,
                private preventivesService: PreventivesService,
                private correctivesService: CorrectivesService,
                private router: Router) { }

  ngOnInit(): void {

    // this.activatedRoute.params
    //     .subscribe( ({id}) =>  {
    //       this.loadProduct(id);          
    //     });

    this.loadProduct();

  }

  /** ================================================================
   *  LOAD PRODUCT ID
  ==================================================================== */
  public product: Product | any;
  loadProduct(){

    this.activatedRoute.params
        .subscribe( ({id}) =>  {      
        

          this.productsService.loadProductId(id)
              .subscribe( ({product}) => {

                this.product = product;
                
                this.loadPreventives();
                this.loadCorrectives();

              }, (err) => {
                Swal.fire('Error', err.error.msg, 'error');
                this.router.navigateByUrl('/');
                
              });

      });

  }

  /** ================================================================
   *  LOAD PREVENTIVES
  ==================================================================== */
  public estadoPreventive: any = 'Pendiente';
  public preventives: Preventive[] = [];
  loadPreventives(){

    this.preventivesService.loadPreventivesProduct(this.product.pid, this.estadoPreventive)
        .subscribe( ({preventives}) => {

          this.preventives = preventives;
          
        });

  }

  /** ================================================================
   *  LOAD CORRECTIVES
  ==================================================================== */
  public estadoCorrective: any = 'Pendiente';
  public correctives: Corrective[] = [];

  loadCorrectives(){

    this.correctivesService.loadCorrectivesProduct(this.product.pid, this.estadoCorrective)
        .subscribe( ({ correctives }) => {

          this.correctives = correctives;
          
        });

  }

  
  // FIN DE LA CLASE
}
