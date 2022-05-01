import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/projects.service';
import { PriorityService } from '../../services/priority.services';
import { SeverityService } from '../../services/seveities.services';
import { Filter } from 'src/app/interfaces/global.model';
import { TestCaseService } from '../../services/testcase.service';

@Component({
  selector: 'app-gestion-defectos',
  templateUrl: './gestion-defectos.component.html',
  styleUrls: ['./gestion-defectos.component.scss']
})
export class GestionDefectosComponent implements OnInit {
  listProjects: Filter[] = [];
  priorities: Array<{
    label: string;
    value: number;
  }> = [];
  severities: Array<{
    label: string;
    value: number;
  }> = [];
  testCases: Array<{
    label: string;
    value: number;
  }> = [];
  constructor(
    private ProjectService: ProjectService,
    private priorityService: PriorityService,
    private severityService: SeverityService,
    private testCaseService: TestCaseService
  ) { }

  ngOnInit(): void {
    this.getProjects();
    this.getPriorities();
    this.getSeverities();
  }

  getProjects() {
    this.ProjectService.getTestProjects(null, null, '').subscribe(
      (res) =>
        (this.listProjects = res.result.map((project) => {
          const filtProject = new Filter();
          filtProject.group = 0;
          filtProject.key = project.id;
          filtProject.value = project.title;
          return filtProject;
        }))
    );
  }

  getPriorities() {
    this.priorityService.getPriorities(null, null, '').subscribe(
      (res) =>
        (this.priorities = res.result.map((priority) => {
          return {
            label: priority.name,
            value: priority.id,
          };
        }))
    );
  }

  getSeverities() {
    this.severityService.getSeverities(null, null, '').subscribe(
      (res) =>
        (this.severities = res.result.map((severity) => {
          return {
            label: severity.name,
            value: severity.id,
          };
        }))
    );
  }

  getTestCases() {
    this.testCaseService.getTestCases(null, null, '', 1).subscribe((res) => {
      this.testCases = res.result.map((testCase) => {
        return {
          label: testCase.title,
          value: testCase.id,
        };
      });
    });
  }
}
