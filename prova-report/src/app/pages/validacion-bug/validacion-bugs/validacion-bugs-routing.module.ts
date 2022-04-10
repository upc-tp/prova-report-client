import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ValidacionBugsComponent } from "./validacion-bugs.component";

const routes: Routes = [
    { path: '', component: ValidacionBugsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidacionBugsRoutingModule { }