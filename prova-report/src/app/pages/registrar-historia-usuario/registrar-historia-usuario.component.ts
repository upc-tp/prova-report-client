import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/auth.service';
import { UtilsService } from 'src/app/common/UtilsService';
import { RegisterRequest } from 'src/app/interfaces/users';
import { UserStoryView } from 'src/app/interfaces/userstory';
import { PlanService } from 'src/app/services/plan.service';
import { ProjectService } from 'src/app/services/projects.service';
import { TestCaseService } from 'src/app/services/testcase.service';
import { UserStoryService } from 'src/app/services/userstory.service';
import { TestCase } from '../ejecucion-casos-pruebas/models/TestCaseExecution.model';



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
    private planService: PlanService,
    private userStoryService: UserStoryService,
    private utils: UtilsService,
    private testCaseService: TestCaseService,
    private projectService: ProjectService
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
    testPlanId: null,
    createdAt: '',
    description: '',
    name: '',
    createdBy: ''
  };
  
  userStoryCriterias: Array<{
    id: number;
    description: string;
    testCase: TestCase;
  }> = [];

  testList:Array<any> = [
    {id: 1, description: 'uno', disable: false},
    {id: 2, description: 'dos', disable: false},
    {id: 3, description: 'tres', disable: false},
    {id: 4, description: 'cuatro', disable: false},
    {id: 5, description: 'cinco', disable: false},
    {id: 6, description: 'seis', disable: false},
  ];
  testCases: Array<{
    id: number,
    tag: string,
    title: string,
    disable: boolean
  }> = [];

  filterItems: string[];

  listPlans: Array<{
    id: number;
    name: string;
  }> = [];

  listProjects: Array<{
    id: number;
    name: string;
  }> = [];

  selectedTestCases: Array<number> = [];
  selectedPlan: number = 0;

  selected: number;
  isUpdate = false;

  ngOnInit(): void {
    this.getTestCases(); 
    this.getProjects();
    if(this.route.snapshot.queryParamMap.get('userStoryId')){
      this.isUpdate = true;
    }
    this.registerForm = this._fb.group({
      projects: ['', Validators.required],
      selectPlan: [null],
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
      this.projectId = res.result.project.id;
      this.userStory.testPlanId = res.result.testPlan?.id;
      this.userStory.description = res.result.description;
      this.userStory.name = res.result.name;
      this.userStory.id = res.result.id;
      console.log(res.result.userStoryCriterias)
      this.userStoryCriterias = res.result.userStoryCriterias.map( (cri) => 
      {
        return{ 
          id: cri.id,
          description: cri.description,
          testCase: cri.testCase
        }
      } 
      );
      this.addTestCases();
      this.getTestPlans(this.projectId);
      console.log("estos son los criterios", this.userStoryCriterias);
      this.registerForm = this._fb.group({
        name: [this.userStory.name, Validators.required],
        projects: [this.projectId, Validators.required],
        selectPlan: [this.userStory.testPlanId],
        description: [this.userStory.description, Validators.required],
        criterias: this._fb.array(this.userStoryCriterias.map((U) => {
          const criteriaForm = this._fb.group({
            id: [U.id],
            description: [U.description, Validators.required],
            testCaseId: [U.testCase ? U.testCase.id : '']
          })
          return criteriaForm;
        }
        ))
      });

    });
  }

  getProjects() {
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) => (
        this.listProjects = res.result.map((tProject) => {
          return {
            name: tProject.title,
            id: tProject.id
          };
        })
      )

    );
  }

  updateFilter(e: any) {
    if (e.source.ngControl.name == 'projects') {
      this.registerForm.controls['selectPlan'].patchValue('');
      this.planService
        .getTestPlansByProject(null, null, '', e.value)
        .subscribe((res) => {
          console.log(res);
          this.listPlans = res.result.map((testPlan) => {
            return {
              name: testPlan.title,
              id: testPlan.id
            }
          });
        });
    }
  }


  registerUserStory() {
    if (this.registerForm.valid) {
      this.projectId = +this.f.projects.value;

      console.log("project", this.projectId);
      console.log("testplan", this.f.selectPlan.value);
      if(this.isUpdate){
        this.userStoryService.updateUserStory( 
          this.projectId,
          this.f.selectPlan.value != '' ? this.f.selectPlan.value : null,
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
        console.log(this.f.criterias.value);
        this.userStoryService
          .createUserStory(
            this.f.selectPlan.value != '' ? this.f.selectPlan.value : null,
            this.f.name.value,
            this.f.description.value,
            this.projectId,
            this.f.criterias.value
          )
          .subscribe(
            (project) => {
              this.f['selectPlan'].setValue(null);
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
      description: ['', Validators.required],
      testCaseId: ['']
    })

    this.criterias.push(criteriaForm);
    this.selectedTestCases.push(-1);
  }

  deleteCriteria(index: number){
    this.criterias.removeAt(index);

    if(this.selectedTestCases[index] >= 0){
      console.log("voy a deshabilitar el ", index);
      this.testCases[this.selectedTestCases[index]].disable = false;
      this.selectedTestCases[index] = -1;
    }

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

  disableTestCase(index: number, superindex: number){
    console.log("este es el index", index, "este es el superindex", superindex);
    if(!this.testCases[index].disable){
      if(this.selectedTestCases[superindex] >= 0){
        this.testCases[this.selectedTestCases[superindex]].disable = false;
      }
      this.selectedTestCases[superindex] = index;
      this.testCases[index].disable = true;
    }
  }

  getTestCases(){
    console.log(this.projectId);
    this.testCaseService.getTestCasesByProject(null, null, this.projectId, 0).subscribe( (res) =>{
      this.testCases = res.result.map( (c) => {
        return{
          id: c.id,
          tag: c.tag,
          title: c.title,
          disable: false
        }
      });
    })

  }

  getTestPlans(projectId: number) {
    this.planService.getTestPlansForSelect(projectId).subscribe(res => {
      this.listPlans = res.result.map(tPlan => {
        console.log(tPlan);
        return {
          name: tPlan.title,
          id: tPlan.id
        }
      });
    });
  }

  addTestCases(){
    for (let i = 0; i < this.userStoryCriterias.length; i++){
      if(this.userStoryCriterias[i].testCase){
        console.log("estoy haciendo push de", this.userStoryCriterias[i].testCase)
        this.testCases.push(
          {
            id: this.userStoryCriterias[i].testCase.id,
            title: this.userStoryCriterias[i].testCase.title,
            tag: this.userStoryCriterias[i].testCase.title,
            disable: true
          }
        )
        this.selectedTestCases[i] = this.testCases.length - 1;
      }
    }
      console.log("esta es la lista de seleccionados", this.selectedTestCases);
  }
}
