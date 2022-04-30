import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { VerificacionDefectosComponent } from './verificacion-defectos.component';

const routes: Routes = [
    {path:'', component: VerificacionDefectosComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VerificacionDefectosRoutingModule {}