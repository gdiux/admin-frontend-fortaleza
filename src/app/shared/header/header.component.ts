import { Component, OnInit } from '@angular/core';

// MODELS
import { User } from 'src/app/models/users.model';

// SERVICE
import { UsersService } from '../../services/users.service';
import { SearchService } from 'src/app/services/search.service';
import { Product } from 'src/app/models/products.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public user!: User;

  constructor(  private usersService: UsersService,
                private searchService: SearchService) { 
    
    // CARGAR USER
    this.user = usersService.user;
    
  }

  ngOnInit(): void {

  }

  /** ==============================================================================
   * BUSCAR PRODUCTOS
  ================================================================================*/
  public resultados: number = 0;
  public products: Product[] = [];
  search( termino:string ){

    let query = `desde=0&hasta=1000`;

    if (termino.length === 0) {
      this.products = [];
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('products', termino, query)
        .subscribe( ({resultados}) => {

          this.products = resultados;
          this.resultados = resultados.length;

        });   

  }



  /** ==============================================================================
   * LOGOUT
  ================================================================================*/

  logout(){
    this.usersService.logout();
  }

}
