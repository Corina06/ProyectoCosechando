
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//Rutas Cliente
import { InicioComponent } from './pages/cliente/inicio/inicio.component';
import { CheckoutComponent } from './pages/cliente/checkout/checkout.component';
import { CarritoComponent } from './pages/cliente/carrito/carrito.component';
import { ProductoComponent } from './pages/cliente/producto/producto.component';
import { DetalleproductoComponent } from './pages/cliente/detalleproducto/detalleproducto.component';
//Rutas Comerciante
import { NavcomerComponent } from './pages/comerciante/navcomer/navcomer.component';
import { OrdenComponent } from './pages/comerciante/orden/orden.component';
import { ProductosComponent } from './pages/comerciante/productos/productos.component';
import { PanelComponent } from './pages/comerciante/panel/panel.component';
import { InventarioComponent } from './pages/comerciante/inventario/inventario.component';
import { PerfilComponent } from './pages/comerciante/perfil/perfil.component';
import { CompraComponent } from './pages/comerciante/compra/compra.component';
//Rutas Cuenta
import { LoginComponent } from './pages/cuenta/login/login.component';
import { RegistroComponent } from './pages/cuenta/registro/registro.component';
//Rutas Componentes
import { PaginacionComponent } from './componentes/paginacion/paginacion.component';

export const routes: Routes = [
   //Rutas Cliente
   {path: '', component: InicioComponent},
   {path: 'inicio', component: InicioComponent},
   {path: 'carrito', component: CarritoComponent},
   {path: 'checkout', component: CheckoutComponent},
   {path: 'producto', component: ProductoComponent},
   {path: 'detalleproducto', component: DetalleproductoComponent},
   //Rutas Comerciante (Protegidas con AuthGuard)
   {path: 'navcomer', component: NavcomerComponent, canActivate: [AuthGuard]},
   {path: 'orden', component: OrdenComponent, canActivate: [AuthGuard]},
   {path: 'productos', component: ProductosComponent, canActivate: [AuthGuard]},
   {path: 'panel', component: PanelComponent, canActivate: [AuthGuard]},
   {path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard]},
   {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
   {path: 'compra', component: CompraComponent, canActivate: [AuthGuard]},
   //Rutas Cuenta
   {path: 'login', component: LoginComponent},
   {path: 'registro', component: RegistroComponent},
   {path: '**', redirectTo: '', pathMatch: 'full' },
   //Rutas Componentes
   {path: 'paginacion', component: PaginacionComponent},

];