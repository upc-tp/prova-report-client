import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../common/urlConstants";
import { DefectResponse } from "../interfaces/defect";

@Injectable({
    providedIn: 'root'
})
export class DefectService{
    private defect='api/defects';
    constructor(private http: HttpClient) { }
    getDefects(page: number, pageSize:number, search:string, testCaseId: number): Observable<DefectResponse>{
        return this.http.get<DefectResponse>(BASE_URL + this.defect + `?page=${page}&pageSize=${pageSize}&search=${search}&testCaseId=${testCaseId}`);
    }
}