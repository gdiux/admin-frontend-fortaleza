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

  constructor(  private usersService: UsersService) {  }

  ngOnInit(): void {

    this.user = this.usersService.user;

  }


  // FIN DE LA CLASE
}
