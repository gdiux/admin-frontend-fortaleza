import { Component, OnInit } from '@angular/core';

// MODELS
import { User } from 'src/app/models/users.model';

// SERVICE
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public user!: User;

  constructor(  private usersService: UsersService) { 
    
    // CARGAR USER
    this.user = usersService.user;
    
  }

  ngOnInit(): void {

  }

  /** ==============================================================================
   * LOGOUT
  ================================================================================*/

  logout(){
    this.usersService.logout();
  }

}
