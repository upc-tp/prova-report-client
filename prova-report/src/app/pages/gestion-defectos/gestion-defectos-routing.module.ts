import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionDefectosComponent } from './gestion-defectos.component';

const routes: Routes = [
    { path: '', component: GestionDefectosComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionDefectosRoutingModule {}