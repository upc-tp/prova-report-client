import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/auth.service';
import { RegisterRequest } from 'src/app/interfaces/users';
import { UserStoryService } from 'src/app/services/userstory.service';



@Component({
  selector: 'app-registrar-historia-usuario',
  templateUrl: './registrar-historia-usuario.component.html',
  styleUrls: ['./registrar-historia-usuario.component.scss']
})



export class RegistrarHistoriaUsuarioComponent implements OnInit, OnDestroy {

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userStoryService: UserStoryService,

  ) { }
  saved: boolean = false;
  projectId: number;
  loading: boolean = false;
  registerForm: FormGroup;
  listCriterias: Array<{
    description: string;
  }> = [];
  toCreate: boolean = false;

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      criterias: this._fb.array([])
    });
  }
  ngOnDestroy(): void {
  }

  get f() { return this.registerForm.controls; }

  registerUserStory() {
    this.saved = true;
    if (this.registerForm.valid) {
      this.userStoryService
        .createUserStory(
          this.f.name.value,
          this.f.description.value,
          +localStorage.getItem('projectId'),
          this.f.criterias.value
        )
        .subscribe(
          (project) => {
            this.f['name'].setValue('');
            this.f['description'].setValue(''); 
            this.router.navigate(['/historias-usuario']);
          },
          (error) => console.log(error)
        );
  } else {
    Object.values(this.registerForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  }

  get criterias() {
    return this.registerForm.controls["criterias"] as FormArray;
  }

  addCriteria(){
    const criteriaForm = this._fb.group({
      description: ['', Validators.required]
    })
    console.log(localStorage.getItem('projectId'));
    this.criterias.push(criteriaForm);
  }

  deleteCriteria(index: number){
    this.criterias.removeAt(index);
  }
  
  validaciones(campo: string): boolean {
    return (
      this.registerForm.get(campo).invalid &&
      this.registerForm.get(campo).touched
    );
  }
}
