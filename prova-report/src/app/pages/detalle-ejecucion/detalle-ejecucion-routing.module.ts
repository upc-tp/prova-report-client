import { NgModule } from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { DetalleEjecucionComponent } from './detalle-ejecucion.component';

const routes: Routes = [
    {path: '', component: DetalleEjecucionComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetalleEjecucionRoutingModule {}