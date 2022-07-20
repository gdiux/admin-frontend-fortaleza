import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARDS
import { AuthGuard } from '../guards/auth.guard';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { CorrectivosComponent } from './correctivos/correctivos.component';
import { PreventivosComponent } from './preventivos/preventivos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PreventivoComponent } from './preventivo/preventivo.component';
import { CorrectivoComponent } from './correctivo/correctivo.component';
import { ProductoComponent } from './producto/producto.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';


// COMPONENTS

const routes: Routes = [
    
    { 
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children:
        [
          { path: '', component: DashboardComponent, data:{ title: 'Dashboard' } },
          { path: 'clientes', component: ClientesComponent, data:{ title: 'Clientes' } },
          { path: 'correctivos', component: CorrectivosComponent, data:{ title: 'Correctivos' } },
          { path: 'correctivo/:id', component: CorrectivoComponent, data:{ title: 'Correctivo' } },
          { path: 'preventivos', component: PreventivosComponent, data:{ title: 'Preventivos' } },
          { path: 'preventivo/:id', component: PreventivoComponent, data:{ title: 'Preventivo' } },
          { path: 'productos', component: ProductosComponent, data:{ title: 'Productos' } },
          { path: 'producto/:id', component: ProductoComponent, data:{ title: 'Producto' } },
          { path: 'perfil/:id', component: PerfilComponent, data:{ title: 'Perfil' } },
          { path: 'trabajadores', component: TrabajadoresComponent, data:{ title: 'Trabajadores' } },
          { path: 'usuarios', component: UsuariosComponent, data:{ title: 'Usuarios' } },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ] 
      },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
