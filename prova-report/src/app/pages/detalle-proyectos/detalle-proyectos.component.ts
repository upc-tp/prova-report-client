import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Project } from 'src/app/interfaces/projects';
import { ProjectService } from '../../services/projects.service';
import { TestCaseService } from '../../services/testcase.service';
import { Router } from '@angular/router';
import { tick } from '@angular/core/testing';
import { VersionService } from 'src/app/services/versions.services';
import { UtilsService } from 'src/app/common/UtilsService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalle-proyectos',
  templateUrl: './detalle-proyectos.component.html',
  styleUrls: ['./detalle-proyectos.component.scss']
})

export class DetalleProyectosComponent implements OnInit {
  projectId: number;
  passwordVisible = false;

  listCollaborators: Array<{
    id: number;
    email: string;
  }> = [];
  testCases: Array<{
    id: number;
    title: string;
    description: string;
    testStatus: string;
    testSuite: string;
    registerDate: string;
    registerBy: string;
  }> = [];
  collaborators: Array<{
    uid: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    password: string;
  }> = [];
  Versions: Array<{
    uid: number;
    orden: number;
    title: string;
    description: string;
    registerDate: string;
    registerBy: string;
  }> = [];
  project: Project = {
    id: 0,
    createdAt: '',
    createdBy: '',
    modifiedAt: '',
    modifiedBy: '',
    title: '',
    description: '',
  };


  isVisibleAssign = false;
  isOkLoadingAssign = false;
  submittedAssign = false;
  validateFormAssign: FormGroup;


  id: number;
  saved: boolean = false;
  savedVersion: boolean = false;
  updated: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  isVisible = false;
  isVisibleVersion = false;
  isOkLoading = false;
  isOkLoadingVersion = false;
  validateForm!: FormGroup;
  validateFormVersion!: FormGroup;
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private utils: UtilsService, private route: ActivatedRoute, private versionService: VersionService, private projectService: ProjectService, private testCaseService: TestCaseService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = Number(params.projectId);
    });
    //this.fetchTestCases(this.page, this.pageSize);
    this.getProject();
    this.getVersions();
    this.validateForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.validateFormVersion = this.fb.group({
      version: [null, [Validators.required]],
      descripcion: [null, [Validators.required]]
    });
    this.getProjectCollaborators();
    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchTestCases(this.page, this.pageSize, search);
      });

    this.validateFormAssign = this.fb.group({
      collaborators: ['', [Validators.required]]
    });

    this.getNoCollaborators();
  }
  getProject() {
      this.projectService.getTestProject(this.projectId).subscribe((res) => {
      this.project.id = this.projectId;
      this.project.title = res.result.title;
      this.project.description = res.result.description;
      this.project.createdBy = res.result.createdBy;
      this.project.createdAt = this.utils.formatDate(new Date(res.result.createdAt));
    });
  }

  getVersions() {
    this.versionService
      .getVersions(null, null, this.projectId).subscribe(
        (res) => (
          this.Versions = res.result.map((tversion) => {
            return {
              uid: tversion.id,
              orden: tversion.order,
              title: tversion.title,
              description: tversion.description,
              registerDate: this.utils.formatDate(new Date(tversion.createdAt)),
              registerBy: tversion.createdBy
            };
          })
        )
      )
  }

  fetchTestCases(page: number, pageSize: number, search: string = '') {
    this.testCaseService.getTestCases(page, pageSize, search, this.projectId,null).subscribe(
      res => {
        this.testCases = res.result.map((tCase) => {
          return {
            id: tCase.id,
            title: tCase.title,
            description: tCase.title,
            testStatus: tCase.testState.name,
            testSuite: tCase.testSuite.title,
            registerDate: new Date(tCase.createdAt).toLocaleDateString(),
            registerBy: tCase.createdBy
          };
        }
        );
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.count = res.count;
      }
    );
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value);
  }
  onPageIndexChange(selectedPage: number) {
    this.page = selectedPage;
    this.fetchTestCases(this.page, this.pageSize);
  }
  handleCancel(): void {
    this.isVisible = false;
    this.id = null;
  }
  handleCancelVersion(): void {
    this.isVisibleVersion = false;
    this.id = null;
  }
  showModal(): void {
    this.isVisible = true;
  }
  showModalVersion(): void {
    this.isVisibleVersion = true;
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }
  handleOkVersion(): void {
    this.isOkLoadingVersion = true;
    setTimeout(() => {
      this.isVisibleVersion = false;
      this.isOkLoadingVersion = false;
    }, 3000);
  }

  backTestProjects() {
    this.router.navigate(['gestion-proyectos']);
  }
  getProjectCollaborators() {
    this.projectService
      .getCollaborators(null, null, '', this.projectId).subscribe(
        (res) => (
          this.collaborators = res.result.map((tcollaborator) => {
            return {
              uid: tcollaborator.uid,
              email: tcollaborator.email,
              role: tcollaborator.role,
              firstName: tcollaborator.firstName,
              lastName: tcollaborator.lastName,
              password: tcollaborator.password
            };
          })
        )
      )
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.projectService
        .createCollaborator(
          this.validateForm.controls['firstName'].value,
          this.validateForm.controls['lastName'].value,
          this.validateForm.controls['email'].value,
          this.validateForm.controls['role'].value,
          this.validateForm.controls['password'].value,
          parseInt(this.projectId.toString())
        )
        .subscribe(
          (project) => {
            this.getProjectCollaborators();
            console.log('Response: ', project);
            this.isVisible = false;
            this.saved = true;
            setTimeout(function () {
              this.saved = false;
              console.log('Saved: ', this.saved);
            }.bind(this), 10000);
            this.validateForm.controls['firstName'].setValue('');
            this.validateForm.controls['lastName'].setValue('');
            this.validateForm.controls['email'].setValue('');
            this.validateForm.controls['role'].setValue('');
            this.validateForm.controls['password'].setValue('');
          },
          (error) => console.log(error)
        );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  submitFormVersion(): void {
    console.log("ejecutando")
    if (this.validateFormVersion.valid) {
      this.versionService
        .createVersion(
          this.projectId,
          this.validateFormVersion.controls['descripcion'].value,
          this.validateFormVersion.controls['version'].value
        )
        .subscribe(
          (project) => {
            this.getVersions();
            console.log('Response: ', project);
            this.isVisibleVersion = false;
            this.savedVersion = true;
            this.validateFormVersion.controls['version'].setValue('');
            this.validateFormVersion.controls['descripcion'].setValue('');
          },
          (error) => console.log(error)
        );
    } else {
      Object.values(this.validateFormVersion.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitFormAssign(): void {
    if (this.validateFormAssign.valid) {
      this.projectService
        .assignCollaborator(
          this.projectId,
          this.validateFormAssign.controls['collaborators'].value
        )
        .subscribe(
          (x) => {
            this.getNoCollaborators();
            this.getProjectCollaborators();
            this.isVisibleAssign = false;
            this.validateFormAssign.controls['collaborators'].setValue('');
          },
          (error) => console.log(error)
        );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getNoCollaborators(){
    this.projectService
      .getNoCollaborators(null, null, '', this.projectId).subscribe(
        (res) => (
          this.listCollaborators = res.result.map((tcollaborator) => {
            return {
              id: tcollaborator.uid,
              email: tcollaborator.email,
            };
          })
        )
      )
  }

  showModalAssign(): void {
    this.isVisibleAssign = true;
  }

  handleOkAssign(): void {
    this.isOkLoadingAssign = true;
    setTimeout(() => {
      this.isVisibleAssign = false;
      this.isOkLoadingAssign = false;
      this.submittedAssign = false;
    }, 3000);
  }

  handleCancelAssign(): void {
    this.isVisibleAssign = false;
    this.submittedAssign = false;
    this.validateFormAssign.controls['collaborators'].setValue('');
  }


  validaciones(campo: string): boolean {
    return (
      this.validateFormAssign.get(campo).invalid &&
      this.validateFormAssign.get(campo).touched
    );
  }

  deleteCollaborator(id:number,userId:number){
    Swal.fire({
      title: '¿Estas seguro de eliminar el colaborador?',
      text: "No volveras a visualizar el colaborador",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#218838',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteCollaborators(id,userId).subscribe(
          (res) => {
            if(res.success){
              this.getProjectCollaborators();
            }
          }
        );
      }
    })

  }

  deleteVersion(id:number){    
    Swal.fire({
      title: '¿Estas seguro de eliminar la versión?',
      text: "No volveras a visualizar el registro",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#218838',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.versionService.deleteVersion(id).subscribe(
          (res) => {
            if(res.success){
              this.getVersions();
            }
          }
        );
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
