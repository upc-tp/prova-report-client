import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/common/UtilsService';
import { ProjectService } from 'src/app/services/projects.service';
import { UserStoryService } from 'src/app/services/userstory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historias-usuario',
  templateUrl: './historias-usuario.component.html',
  styleUrls: ['./historias-usuario.component.scss']
})
export class HistoriasUsuarioComponent implements OnInit, OnDestroy {

  projectId: number;
  listProjects: Array<{
    id: number;
    name: string;
  }> = [];


  userStories: Array<{
    id: number;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
  }> = [];
  
  filterFormGroup: FormGroup;
  displayedColumns: string[] = ['name', 'description', 'createdBy', 'createdAt', 'options'];
  dataSource = new MatTableDataSource<any>(); 
  found: boolean = false;

  constructor(
    private projectService: ProjectService,
    private userStoryService: UserStoryService,
    private utils: UtilsService,
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private iconRegistry:MatIconRegistry,
    private router: Router,
  ) {
      this.iconRegistry.addSvgIcon(
        'NoTest',
        this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/no-test.svg')
      );
   }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getProjects();
    if(localStorage.getItem('projectId')){
      this.found = true;
      this.filterFormGroup = this._fb.group({
        projects: [+localStorage.getItem('projectId'),[Validators.required]]
      });
      this.projectId = +localStorage.getItem('projectId');
      this.getUserStories();
    }
    else {
      this.filterFormGroup = this._fb.group({
        projects: ['',[Validators.required]]
      });
    }
  }

  ngOnDestroy(): void {
    if(this.found){
      localStorage.removeItem('projectId');
    }
  }
  
  getProjects() {
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) =>{
        this.listProjects = res.result.map((project) => {
        return{
          id: project.id,
          name: project.title
        }
      })
      console.log(this.listProjects) ; 
      }
    );
  }
  selectProject(){
    console.log("este es el bool");
    console.log(this.found);
    console.log("este es el localstorage");
    console.log(localStorage.getItem('projectId'));
    localStorage.removeItem('projectId');
    if(this.filterFormGroup.controls['projects'].value){
      this.projectId = this.filterFormGroup.controls['projects'].value;
      this.getUserStories();
    }else{
      Swal.fire(
        {
          title: 'Selecciona un proyecto',
          showCloseButton:true,
          icon:'info'
        });
    }

  }
  
  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }

  getUserStories(){
    this.userStoryService.getUserStories(null, null, '', this.projectId).subscribe( (res) => {
      this.userStories = res.result.map( (uStory) => {
        return{
          id: uStory.id,
          name: uStory.name,
          description: uStory.description,
          createdBy: uStory.createdBy,
          createdAt: this.utils.formatDateTime(new Date(uStory.createdAt))
        };
      });
      if(this.userStories.length == 0){
        Swal.fire(
          {
            title: 'No existen historias de usuario',
            showCloseButton:true,
            icon:'info'
          });
        this.filterFormGroup.controls['projects'].setValue('');
        this.projectId = null;
      }
      this.dataSource = new MatTableDataSource(this.userStories);
      this.dataSource.paginator = this.paginator;
    });
  }

  getDetailsUserStory(id: number){

  }

  filterUserStories(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createUserStory(){
    localStorage.setItem('projectId', this.projectId.toString());
    this.router.navigate(['/registrar-historia-usuario']);
  }

}
