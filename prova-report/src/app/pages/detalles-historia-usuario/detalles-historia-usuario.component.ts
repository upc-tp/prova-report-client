import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/common/UtilsService';
import { SingleUserStoryResponse, UserStoryView } from 'src/app/interfaces/userstory';
import { UserStoryService } from 'src/app/services/userstory.service';

@Component({
  selector: 'app-detalles-historia-usuario',
  templateUrl: './detalles-historia-usuario.component.html',
  styleUrls: ['./detalles-historia-usuario.component.scss']
})
export class DetallesHistoriaUsuarioComponent implements OnInit {
  
  userStoryId: number;
  userStory: UserStoryView= {
    id: 0,
    testPlanId: null,
    createdAt: '',
    description: '',
    name: '',
    createdBy: ''
  };
  
  criterias: Array<{
    description: string;
    createdAt: string;
    testCaseName: string;
  }> = [];

  displayedColumns: string[] = ['description', 'testCase','createdAt'];
  dataSource = new MatTableDataSource<any>(); 
  
  constructor(
    private route: ActivatedRoute, 
    private utils: UtilsService, 
    private router: Router, 
    private userStoryService: UserStoryService ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userStoryId = params.userStoryId;
    });
    this.getUserStory();

    console.log(this.criterias);
  }

  getUserStory(){
    this.userStoryService.getUserStory(this.userStoryId).subscribe((res) => {
      this.userStory.createdAt = this.utils.formatDateTime(new Date(res.result.createdAt));
      this.userStory.description = res.result.description;
      this.userStory.name = res.result.tag + ' - ' + res.result.name;
      this.userStory.id = res.result.id;
      console.log(res.result.userStoryCriterias)
      this.criterias = res.result.userStoryCriterias.map( (cri) => 
      {
        return{ 
          description: cri.description,
          createdAt: this.utils.formatDateTime(new Date(cri.createdAt)),
          testCaseName: cri.testCase ? ((cri.testCase.tag ? cri.testCase.tag : ' ') + ' ' + cri.testCase.title) : 'No asociado'
        }
      } 
      );
      console.log(this.criterias)
      this.dataSource = new MatTableDataSource(this.criterias);
    });
  }

  backUserStories(){
    this.router.navigate(['historias-usuario']);
  }
}
