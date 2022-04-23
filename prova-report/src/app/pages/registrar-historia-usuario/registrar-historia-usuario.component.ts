import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/auth.service';
import { UtilsService } from 'src/app/common/UtilsService';
import { RegisterRequest } from 'src/app/interfaces/users';
import { UserStoryView } from 'src/app/interfaces/userstory';
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
    private utils: UtilsService

  ) { }
  saved: boolean = false;
  projectId: number;
  loading: boolean = false;
  registerForm: FormGroup;
  listCriterias: Array<{
    description: string;
  }> = [];
  toCreate: boolean = false;

  userStoryId: number;
  userStory: UserStoryView = {
    id: 0,
    createdAt: '',
    description: '',
    name: '',
    createdBy: ''
  };
  
  userStoryCriterias: Array<{
    id: number;
    description: string;
  }> = [];

  isUpdate = false;

  ngOnInit(): void {

    if(this.route.snapshot.queryParamMap.get('userStoryId')){
      this.isUpdate = true;
    }
    this.registerForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      criterias: this._fb.array([])
    });


    if(this.isUpdate){
      this.route.queryParams.subscribe(params => {
        this.userStoryId = params.userStoryId;
      });
      this.getUserStory(); 
    }

    
    
  }
  ngOnDestroy(): void {
  }

  get f() { return this.registerForm.controls; }
  
  getUserStory(){
    this.userStoryService.getUserStory(this.userStoryId).subscribe((res) => {
      this.userStory.description = res.result.description;
      this.userStory.name = res.result.name;
      this.userStory.id = res.result.id;
      console.log(res.result.userStoryCriterias)
      this.userStoryCriterias = res.result.userStoryCriterias.map( (cri) => 
      {
        return{ 
          id: cri.id,
          description: cri.description
        }
      } 
      );
      this.registerForm = this._fb.group({
        name: [this.userStory.name, Validators.required],
        description: [this.userStory.description, Validators.required],
        criterias: this._fb.array(this.userStoryCriterias.map((U) => {
          const criteriaForm = this._fb.group({
            id: [U.id],
            description: [U.description, Validators.required]
          })
          return criteriaForm;
        }
        ))
      });

    });
  }
  registerUserStory() {
    if (this.registerForm.valid) {

      if(this.isUpdate){
        this.userStoryService.updateUserStory(  
          this.f.name.value,
          this.f.description.value,
          this.userStoryId,
          this.f.criterias.value
          )
          .subscribe(
            (us) => {
              this.f['name'].setValue('');
              this.f['description'].setValue(''); 
              this.router.navigate(['/historias-usuario']);
            },
            (error) => console.log(error)
          );
      }
      else{
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
      }
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
      id: [null],
      description: ['', Validators.required]
    })
    this.criterias.push(criteriaForm);
  }

  deleteCriteria(index: number){
    console.log(this.criterias);
    console.log(this.criterias.at(index));
    this.criterias.removeAt(index);
    console.log(this.criterias);
  }
  
  validaciones(campo: string): boolean {
    return (
      this.registerForm.get(campo).invalid &&
      this.registerForm.get(campo).touched
    );
  }

  backUserStories(){
    this.router.navigate(['/historias-usuario']);
  }
}
