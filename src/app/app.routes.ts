
import { Routes } from '@angular/router';
//Rutas Cliente
import { InicioComponent } from './pages/cliente/inicio/inicio.component';
import { PedidoComponent } from './pages/cliente/pedido/pedido.component';
import { CheckoutComponent } from './pages/cliente/checkout/checkout.component';
import { CarritoComponent } from './pages/cliente/carrito/carrito.component';
import { ProductoComponent } from './pages/cliente/producto/producto.component';
import { DetalleproductoComponent } from './pages/cliente/detalleproducto/detalleproducto.component';
//Rutas Comerciante
import { NavcomerComponent } from './pages/comerciante/navcomer/navcomer.component';
import { PedidosComponent } from './pages/comerciante/pedidos/pedidos.component';
import { ProductosComponent } from './pages/comerciante/productos/productos.component';
import { PanelComponent } from './pages/comerciante/panel/panel.component';
import { InventarioComponent } from './pages/comerciante/inventario/inventario.component';
//Rutas Cuenta
import { LoginComponent } from './pages/cuenta/login/login.component';
import { RegistroComponent } from './pages/cuenta/registro/registro.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
   //Rutas Cliente
   {path: '', component: InicioComponent},
   {path: 'pedido', component: PedidoComponent},
   {path: 'carrito', component: CarritoComponent},
   {path: 'checkout', component: CheckoutComponent},
   {path: 'producto', component: ProductoComponent},
   {path: 'detalleproducto', component: DetalleproductoComponent},
   //Rutas Comerciante
   {path: 'navcomer', component: NavcomerComponent},
   {path: 'pedidos', component: PedidosComponent},
   {path: 'productos', component: ProductosComponent},
   {path: 'panel', component: PanelComponent},
   {path: 'inventario', component: InventarioComponent},
   //Rutas Cuenta
   {path: 'login', component: LoginComponent},
   {path: 'registro', component: RegistroComponent},
   {path: '**', redirectTo: '', pathMatch: 'full' },

];
