import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BASE_URL } from "../common/urlConstants";
import { DefectCreated, DefectCreatedResponse, DefectResponse, SingleDefectResponse } from "../interfaces/defect";

@Injectable({
    providedIn: 'root'
})
export class DefectService{
    private defect='api/defects';
    constructor(private http: HttpClient) { }
    getDefects(page: number, pageSize:number, search:string, testCaseId: number): Observable<DefectResponse>{
        return this.http.get<DefectResponse>(BASE_URL + this.defect + `?page=${page}&pageSize=${pageSize}&search=${search}&testCaseId=${testCaseId}`);
    }

    getDefect(id: number): Observable<SingleDefectResponse> {
        return this.http.get<SingleDefectResponse>(BASE_URL + this.defect + `/${id}`)
    }

    createDefect(title: string, repro_steps: string, testCaseId: number, priorityId: number, severityId: number): Observable<DefectCreated>{
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<DefectCreatedResponse>(BASE_URL + this.defect, {
            title,
            repro_steps,
            testCaseId,
            priorityId,
            severityId,
            defectStateId: 1
        }, httpOptions).pipe(
            map(this.extractData),
            catchError(this.handleErrorObservable)
        );
    }
    updateDefect(severityId: number, priorityId: number, id: number): Observable<DefectCreatedResponse> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.put<DefectCreatedResponse>(BASE_URL + this.defect + `/${id}`, {
            severityId,
            priorityId
        }, httpOptions).pipe(
            map(this.extractData),
            catchError(this.handleErrorObservable)
        );
    }

    private extractData(res: any) {
        let body = res;
        return body;
      }
    
      private handleErrorObservable(error: any) {
        console.error(error.message || error);
        return throwError(error);
      }
}