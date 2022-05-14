import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../common/urlConstants';
import { SingleTestExecutionResponse } from "../interfaces/test-executions";

@Injectable({
    providedIn: 'root'
})
export class TestExecutionService{
    private testExecution = 'api/test-executions';
    constructor(private http:HttpClient){}

    getTestExecution(id:number){
        return this.http.get<SingleTestExecutionResponse>(BASE_URL + this.testExecution + `/${id}`);
    }



}