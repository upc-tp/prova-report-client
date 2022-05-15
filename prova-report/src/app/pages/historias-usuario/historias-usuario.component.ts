import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from 'src/app/common/UtilsService';
import { Filter } from 'src/app/interfaces/global.model';
import { PlanService } from 'src/app/services/plan.service';
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
  testPlanId: number;
  listProjects: Array<{
    id: number;
    name: string;
  }> = [];
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  listTestPlan: Filter[] = [];
  userStories: Array<{
    id: number;
    name: string;
    tag: string;
    testPlan: string;
    description: string;
    createdBy: string;
    createdAt: string;
  }> = [];

  filterItems: string[];
  filterFormGroup: FormGroup;
  displayedColumns: string[] = ['tag', 'name', 'testPlan', 'createdBy', 'createdAt', 'options'];
  dataSource = new MatTableDataSource<any>();
  found: boolean = false;
  selected: boolean = false;
  projectNameSelected: string;
  firstEntry: boolean = true;
  file: any;
  csvData: string[] = [];
  isVisibleMassive = false;
  isOkLoadingMassive = false;
  formMassive: FormGroup;

  constructor(
    private projectService: ProjectService,
    private userStoryService: UserStoryService,
    private utils: UtilsService,
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private testPlanService: PlanService,
  ) {
    this.iconRegistry.addSvgIcon(
      'NoTest',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/no-test.svg')
    );
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getProjects();
    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.getUserStories(this.page, this.pageSize, search);
      });
    if (localStorage.getItem('filterItems')) {
      this.found = true;
      this.filterItems = JSON.parse(localStorage.getItem('filterItems'));
      this.filterFormGroup = this._fb.group({
        projects: [this.filterItems[0], [Validators.required]],
        testPlans: [this.filterItems[1]]
      });
      this.updateTestPlans();
      console.log(localStorage.getItem('filterItems'));
      this.projectId = +this.filterItems[0];
      this.testPlanId = +this.filterItems[1];
      this.selected = true;
      this.getUserStories(this.page, this.pageSize);
    }
    else {
      this.filterFormGroup = this._fb.group({
        projects: ['', [Validators.required]],
        testPlans: [''],
      });
    }
  }

  ngOnDestroy(): void {
  }

  getProjects() {
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) => {
        this.listProjects = res.result.map((project) => {
          return {
            id: project.id,
            name: project.title
          }
        })
        console.log(this.listProjects);
      }
    );
  }

  selectProject() {
    localStorage.removeItem('filterItems');
    if (this.filterFormGroup.controls['projects'].value) {
      this.firstEntry = false;
      this.selected = true;
      if (this.filterFormGroup.controls['testPlans'].value) {

        this.testPlanId = +this.filterFormGroup.controls['testPlans'].value;
      }
      this.projectId = +this.filterFormGroup.controls['projects'].value;
      this.getUserStories(this.page, this.pageSize);
    } else if (!this.firstEntry) {
      Swal.fire(
        {
          title: 'Selecciona un proyecto',
          showCloseButton: true,
          icon: 'info'
        });
    }

  }

  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }

  getUserStories(page, pageSize, search: string = '') {
    console.log("El test Plan id es: ", this.testPlanId);
    this.userStoryService.getUserStories(page, pageSize, 'DESC', this.projectId, this.testPlanId, search).subscribe((res) => {
      this.userStories = res.result.map((uStory) => {
        return {
          id: uStory.id,
          tag: uStory.tag,
          name: uStory.name,
          testPlan: uStory.testPlan?.title,
          description: uStory.description,
          createdBy: uStory.createdBy,
          createdAt: this.utils.formatDate(new Date(uStory.createdAt))
        };
      });
      if (this.userStories.length == 0) {
        Swal.fire(
          {
            title: 'No existen historias de usuario',
            showCloseButton: true,
            icon: 'info'
          });
        this.selected = false;
      }
      this.dataSource = new MatTableDataSource(this.userStories);
      this.dataSource.paginator = this.paginator;
      this.page = res.page;
      this.pageSize = res.pageSize;
      this.count = res.count;
    });
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value);
  }
  onPageIndexChange(selectedPage: number) {
    this.page = selectedPage;
    this.getUserStories(this.page, this.pageSize);
  }
  getDetailsUserStory(id: number) {
    localStorage.removeItem('filterItems');
    this.filterItems = [];
    this.filterItems.push(this.projectId.toString());
    if(this.testPlanId){
      this.filterItems.push(this.testPlanId.toString());
    }
    localStorage.setItem('filterItems', JSON.stringify(this.filterItems));
    this.router.navigate(['detalles-historia-usuario'], {
      queryParams: { userStoryId: id },
    });
  }

  updateUserStory(id: number) {
    localStorage.removeItem('filterItems');
    this.filterItems = [];
    this.filterItems.push(this.projectId.toString());
    if(this.testPlanId){
      this.filterItems.push(this.testPlanId.toString());
    }
    localStorage.setItem('filterItems', JSON.stringify(this.filterItems));
    this.router.navigate(['registrar-historia-usuario'], {
      queryParams: { userStoryId: id },
    });
  }

  updateFilter(e: any) {
    if (e.source.ngControl.name == 'projects') {
      this.filterFormGroup.controls['testPlans'].patchValue('');
      console.log("TestPlan")
      this.testPlanService
        .getTestPlansByProject(null, null, '', e.value)
        .subscribe((res) => {
          console.log(res);
          this.listTestPlan = res.result.map((testPlan) => {
            const filtTestSuite = new Filter();
            filtTestSuite.group = 1;
            filtTestSuite.key = testPlan.id;
            filtTestSuite.value = testPlan.title;
            return filtTestSuite;
          });
        });
    }
  }

  updateTestPlans() {
    this.testPlanService
      .getTestPlansByProject(null, null, '', this.projectId)
      .subscribe((res) => {
        console.log(res);
        this.listTestPlan = res.result.map((testPlan) => {
          const filtTestSuite = new Filter();
          filtTestSuite.group = 1;
          filtTestSuite.key = testPlan.id;
          filtTestSuite.value = testPlan.title;
          return filtTestSuite;
        });
      });
  }

  filterUserStories(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createUserStory() {
    localStorage.removeItem('filterItems');
    this.filterItems = [];
    this.filterItems.push(this.projectId.toString());
    if(this.testPlanId){
      this.filterItems.push(this.testPlanId.toString());
    }
    localStorage.setItem('filterItems', JSON.stringify(this.filterItems));
    this.router.navigate(['/registrar-historia-usuario']);
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
      if (e.target.readyState == FileReader.DONE) {
        let xmlData = e.target.result as string;
        this.csvData.push(xmlData);
      }
      console.log(this.csvData);
    };
  }

  enviarCsvData() {
    console.log(this.csvData[0]);
    if (this.file) {
      this.userStoryService
        .bulkLoadUserStories(
          this.filterFormGroup.controls['projects'].value,
          this.csvData[0]
        )
        .subscribe((res) => {
          console.log(res.result);
          this.isVisibleMassive = false;
          this.getUserStories(this.page, this.pageSize);
          this.deleteFile();
        });
    } else {
      Swal.fire({
        title: 'Debes cargar un archivo para registrar la ejecución',
        showCloseButton: true,
        icon: 'info',
      });
    }
  }

  handleOkMassive(): void {
    this.isOkLoadingMassive = true;
    setTimeout(() => {
      this.isVisibleMassive = false;
      this.isOkLoadingMassive = false;
    }, 3000);
  }

  handleCancelMassive(): void {
    this.deleteFile();
    this.isVisibleMassive = false;
  }

  deleteFile() {
    this.file = null;
    this.csvData = [];
  }

  showModalMassive(): void {
    this.isVisibleMassive = true;
  }
}
